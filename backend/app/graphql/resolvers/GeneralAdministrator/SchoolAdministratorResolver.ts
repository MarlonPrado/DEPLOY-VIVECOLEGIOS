import bcrypt from 'bcrypt';
import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  SchoolAdministratorRepository,
  SchoolRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewSchoolAdministrator } from '../../inputs/GeneralAdministrator/NewSchoolAdministrator';
import { NewUser } from '../../inputs/GeneralAdministrator/NewUser';
import { IContext } from '../../interfaces/IContext';
import { School } from '../../models/GeneralAdministrator/School';
import {
  SchoolAdministrator,
  SchoolAdministratorConnection,
} from '../../models/GeneralAdministrator/SchoolAdministrator';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

const BCRYPT_SALT_ROUNDS = 12;

@Resolver(SchoolAdministrator)
export class SchoolAdministratorResolver {
  @InjectRepository(SchoolAdministrator)
  private repository = SchoolAdministratorRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @Query(() => SchoolAdministrator, { nullable: true })
  async getSchoolAdministrator(@Arg('id', () => String) id: string) {
    console.log('[GET] SchoolAdministrator called with id:', id);
    const result = await this.repository.findOneBy(id);
    console.log('[GET] Result:', JSON.stringify(result, null, 2));
    return result;
  }

  @Query(() => SchoolAdministrator, { nullable: true })
  async getSchoolAdministratorUserId(@Arg('userId', () => String) userId: string) {
    console.log('[GET BY USER] User ID:', userId);
    const result = await this.repository.findBy({ where: { userId } });
    console.log('[GET BY USER] Found:', result?.length, 'results');
    return result?.length > 0 ? result[0] : null;
  }

  @Query(() => SchoolAdministratorConnection)
  async getAllSchoolAdministrator(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
  ): Promise<SchoolAdministratorConnection> {
    console.log('[GET ALL] Params:', {
      args,
      allData,
      orderCreated,
      schoolId
    });

    let result;
    if (allData) {
      console.log('[GET ALL] Fetching ALL data (including inactive)');
      if (orderCreated) {
        console.log('[GET ALL] Ordered by creation date DESC');
        result = await this.repository.findBy({
          where: { schoolId, support: false },
          order: { createdAt: 'DESC' },
        });
      } else {
        console.log('[GET ALL] No ordering');
        result = await this.repository.findBy({ where: { schoolId, support: false } });
      }
    } else {
      console.log('[GET ALL] Fetching ONLY active data');
      if (orderCreated) {
        console.log('[GET ALL] Ordered by creation date DESC');
        result = await this.repository.findBy({
          where: {
            schoolId,
            support: false,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        console.log('[GET ALL] No ordering');
        result = await this.repository.findBy({
          where: {
            schoolId,
            support: false,
            active: true,
          },
        });
      }
    }

    console.log(`[GET ALL] Found ${result.length} records`);
    if (result.length > 0) {
      console.log('[GET ALL] First record sample:', JSON.stringify(result[0], null, 2));
    }

    let resultConn = new SchoolAdministratorConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    
    console.log('[GET ALL] Connection result:', {
      edges: resultConn.edges?.length,
      totalCount: resultConn.totalCount
    });
    
    return resultConn;
  }

  @Mutation(() => SchoolAdministrator)
  async createSchoolAdministrator(
    @Arg('data') data: NewSchoolAdministrator,
    @Ctx() context: IContext,
  ): Promise<SchoolAdministrator> {
    console.log('[CREATE] Input data:', JSON.stringify(data, null, 2));
    console.log('[CREATE] Context user:', context?.user?.authorization?.id);

    let dataProcess: NewSchoolAdministrator = removeEmptyStringElements(data);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess.newUser);
    let createdByUserId = context?.user?.authorization?.id;
    
    console.log('[CREATE] Processed data:', JSON.stringify(dataProcess, null, 2));
    console.log('[CREATE] User data:', JSON.stringify(dataUserProcess, null, 2));

    delete dataProcess.newUser;
    
    if (dataUserProcess.documentNumber != null) {
      console.log('[CREATE] Hashing password...');
      let passwordHash = await bcrypt
        .hash(dataUserProcess.documentNumber, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword: any) {
          return hashedPassword;
        });
      dataUserProcess.password = passwordHash;
    }

    console.log('[CREATE] Creating user...');
    const modelUser = await this.repositoryUser.create({
      ...dataUserProcess,
      username: dataUserProcess.documentNumber,
      active: true,
      version: 0,
      createdByUserId,
    });
    let resultUser = await this.repositoryUser.save(modelUser);
    console.log('[CREATE] User created:', JSON.stringify(resultUser, null, 2));

    console.log('[CREATE] Creating school administrator...');
    const model = await this.repository.create({
      ...dataProcess,
      userId: resultUser.id.toString(),
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    console.log('[CREATE] School administrator created:', JSON.stringify(result, null, 2));
    
    return result;
  }

  @Mutation(() => Boolean)
  public async createAllInitialsSchoolAdministrators() {
    console.log('[INITIAL SETUP] Starting creation of initial school administrators');
    let schools = await this.repositorySchool.find();
    console.log(`[INITIAL SETUP] Found ${schools.length} schools`);

    for (let school of schools) {
      console.log(`[INITIAL SETUP] Processing school: ${school.name} (${school.id})`);
      let schoolAdministrators = await this.repository.findBy({
        active: true,
        schoolId: { $in: [school.id.toString()] },
      });
      
      console.log(`[INITIAL SETUP] Found ${schoolAdministrators.length} existing administrators`);
      
      if (schoolAdministrators.length < 1) {
        console.log('[INITIAL SETUP] Creating default administrator...');
        let passwordHash = await bcrypt
          .hash(school.daneCode ? school.daneCode : 'VIVE2022', BCRYPT_SALT_ROUNDS)
          .then(function (hashedPassword: any) {
            return hashedPassword;
          });

        console.log('[INITIAL SETUP] Creating user...');
        const modelUser = await this.repositoryUser.create({
          name: 'Admin',
          lastName: school.name,
          username: school.daneCode,
          password: passwordHash,
          roleId: '6195519c882a2fb6525a3076',
          active: true,
          version: 0,
        });
        let resultUser = await this.repositoryUser.save(modelUser);
        console.log('[INITIAL SETUP] User created:', JSON.stringify(resultUser, null, 2));

        console.log('[INITIAL SETUP] Creating school administrator...');
        const model = await this.repository.create({
          schoolId: [school.id.toString()],
          userId: resultUser.id.toString(),
          active: true,
          version: 0,
        });
        let result = await this.repository.save(model);
        console.log('[INITIAL SETUP] Administrator created:', JSON.stringify(result, null, 2));
      }
    }
    
    console.log('[INITIAL SETUP] Process completed');
    return true;
  }

  @Mutation(() => SchoolAdministrator)
  async updateSchoolAdministrator(
    @Arg('data') data: NewSchoolAdministrator,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<SchoolAdministrator | null> {
    console.log('[UPDATE] ID:', id);
    console.log('[UPDATE] Input data:', JSON.stringify(data, null, 2));
    console.log('[UPDATE] Context user:', context?.user?.authorization?.id);

    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    console.log('[UPDATE] Original data:', JSON.stringify(result, null, 2));

    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess?.newUser);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    console.log('[UPDATE] Original user data:', JSON.stringify(resultUser, null, 2));

    console.log('[UPDATE] Updating user...');
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      ...dataUserProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    console.log('[UPDATE] User updated:', JSON.stringify(resultUser, null, 2));

    delete dataProcess?.newUser;
    
    console.log('[UPDATE] Updating school administrator...');
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    console.log('[UPDATE] School administrator updated:', JSON.stringify(result, null, 2));
    
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveSchoolAdministrator(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    console.log('[CHANGE ACTIVE] ID:', id, 'Active:', active);
    console.log('[CHANGE ACTIVE] Context user:', context?.user?.authorization?.id);

    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    console.log('[CHANGE ACTIVE] Original data:', JSON.stringify(result, null, 2));

    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    console.log('[CHANGE ACTIVE] Original user data:', JSON.stringify(resultUser, null, 2));

    console.log('[CHANGE ACTIVE] Updating user status...');
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    console.log('[CHANGE ACTIVE] User updated:', JSON.stringify(resultUser, null, 2));

    console.log('[CHANGE ACTIVE] Updating school administrator status...');
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    console.log('[CHANGE ACTIVE] School administrator updated:', JSON.stringify(result, null, 2));
    console.log('[CHANGE ACTIVE] Operation success:', result.id ? 'YES' : 'NO');
    
    return result.id ? true : false;
  }

  @Mutation(() => Boolean)
  async deleteSchoolAdministrator(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    console.log('[DELETE] ID:', id);
    console.log('[DELETE] Context user:', context?.user?.authorization?.id);

    let data = await this.repository.findOneBy(id);
    console.log('[DELETE] Data to delete:', JSON.stringify(data, null, 2));

    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    console.log('[DELETE] MongoDB result:', JSON.stringify(result, null, 2));
    console.log('[DELETE] Operation success:', result?.result?.ok === 1 ? 'YES' : 'NO');
    
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: SchoolAdministrator) {
    let id = data.createdByUserId;
    console.log('[FIELD] createdByUser for administrator:', data.id, 'User ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      console.log('[FIELD] createdByUser result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: SchoolAdministrator) {
    let id = data.updatedByUserId;
    console.log('[FIELD] updatedByUser for administrator:', data.id, 'User ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      console.log('[FIELD] updatedByUser result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: SchoolAdministrator) {
    let id = data.schoolId;
    console.log('[FIELD] school for administrator:', data.id, 'School ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findBy({ where: { _id: { $in: id } } });
      console.log('[FIELD] school result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async user(@Root() data: SchoolAdministrator) {
    let id = data.userId;
    console.log('[FIELD] user for administrator:', data.id, 'User ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      console.log('[FIELD] user result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }
}