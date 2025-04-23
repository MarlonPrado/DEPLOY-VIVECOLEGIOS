import bcrypt from 'bcrypt';
import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  CampusAdministratorRepository,
  CampusRepository,
  SchoolRepository,
  UserRepository
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewUser } from '../../inputs/GeneralAdministrator/NewUser';
import { NewCampusAdministrator } from '../../inputs/SchoolAdministrator/NewCampusAdministrator';
import { IContext } from '../../interfaces/IContext';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import {
  CampusAdministrator,
  CampusAdministratorConnection
} from '../../models/SchoolAdministrator/CampusAdministrator';
import { ConnectionArgs } from '../../pagination/relaySpecs';

const BCRYPT_SALT_ROUNDS = 12;

@Resolver(CampusAdministrator)
export class CampusAdministratorResolver {
  @InjectRepository(CampusAdministrator)
  private repository = CampusAdministratorRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @Query(() => CampusAdministrator, { nullable: true })
  async getCampusAdministrator(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => CampusAdministratorConnection)
  async getAllCampusAdministrator(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String
  ): Promise<CampusAdministratorConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: { schoolId },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({ where: { schoolId } });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            schoolId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            schoolId,
            active: true,
          },
        });
      }
    }
    let resultConn = new CampusAdministratorConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => CampusAdministrator)
  async createCampusAdministrator(
    @Arg('data') data: NewCampusAdministrator,
    @Ctx() context: IContext
  ): Promise<CampusAdministrator> {
    let dataProcess: NewCampusAdministrator = removeEmptyStringElements(data);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess.newUser);
    let createdByUserId = context?.user?.authorization?.id;
    delete dataProcess.newUser;
    if (dataUserProcess.documentNumber != null) {
      let passwordHash = await bcrypt
        .hash(dataUserProcess.documentNumber, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword: any) {
          return hashedPassword;
        });
      dataUserProcess.password = passwordHash;
    }
    const modelUser = await this.repositoryUser.create({
      ...dataUserProcess,
      username: dataUserProcess.documentNumber,
      active: true,
      version: 0,
      createdByUserId,
    });
    let resultUser = await this.repositoryUser.save(modelUser);
    const model = await this.repository.create({
      ...dataProcess,
      userId: resultUser.id.toString(),
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => Boolean)
  public async createAllInitialsCampusAdministrators() {
    let campus = await this.repositoryCampus.find();
    for (let campu of campus) {
      let campusAdministrators = await this.repository.findBy({
        active: true,
        campusId: { $in: [campu.id.toString()] },
      });
      if (campusAdministrators.length < 1) {
        let passwordHash = await bcrypt
          .hash(campu.consecutive ? campu.consecutive : 'VIVE2022', BCRYPT_SALT_ROUNDS)
          .then(function (hashedPassword: any) {
            return hashedPassword;
          });
        const modelUser = await this.repositoryUser.create({
          name: 'Admin',
          lastName: campu.name,
          username: campu.consecutive,
          password: passwordHash,
          roleId: '61955190882a2fb6525a3075',
          active: true,
          version: 0,
        });
        let resultUser = await this.repositoryUser.save(modelUser);
        const model = await this.repository.create({
          schoolId: [campu.schoolId ? campu.schoolId : ''],
          campusId: [campu.id.toString()],
          userId: resultUser.id.toString(),
          active: true,
          version: 0,
        });
        let result = await this.repository.save(model);
      }
    }
    return true;
  }

  @Mutation(() => CampusAdministrator)
  async updateCampusAdministrator(
    @Arg('data') data: NewCampusAdministrator,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<CampusAdministrator | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess?.newUser);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      ...dataUserProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    delete dataProcess?.newUser;
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveCampusAdministrator(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    if (result.id) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteCampusAdministrator(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: CampusAdministrator) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: CampusAdministrator) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: CampusAdministrator) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findBy({ where: { _id: { $in: id } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: CampusAdministrator) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findBy({ where: { _id: { $in: id } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async user(@Root() data: CampusAdministrator) {
    let id = data.userId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }
}
