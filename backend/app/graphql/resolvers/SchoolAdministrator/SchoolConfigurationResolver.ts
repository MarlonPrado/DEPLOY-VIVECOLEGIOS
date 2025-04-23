import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  SchoolConfigurationRepository,
  SchoolRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewSchoolConfiguration } from '../../inputs/SchoolAdministrator/NewSchoolConfiguration';
import { IContext } from '../../interfaces/IContext';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import {
  SchoolConfiguration,
  SchoolConfigurationConnection,
} from '../../models/SchoolAdministrator/SchoolConfiguration';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(SchoolConfiguration)
export class SchoolConfigurationResolver {
  @InjectRepository(SchoolConfiguration)
  private repository = SchoolConfigurationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @Query(() => SchoolConfiguration, { nullable: true })
  async getSchoolConfiguration(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => SchoolConfigurationConnection)
  async getAllSchoolConfiguration(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
  ): Promise<SchoolConfigurationConnection> {
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
    let resultConn = new SchoolConfigurationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => SchoolConfiguration)
  async createSchoolConfiguration(
    @Arg('data') data: NewSchoolConfiguration,
    @Ctx() context: IContext,
  ): Promise<SchoolConfiguration> {
    let dataProcess: NewSchoolConfiguration = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => SchoolConfiguration)
  async updateSchoolConfiguration(
    @Arg('data') data: NewSchoolConfiguration,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<SchoolConfiguration | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
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
  async changeActiveSchoolConfiguration(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
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
  public async createCodeSchoolConfigurations(
    @Arg('code', () => String) code: string,
    @Arg('valueNumber', () => Number) valueNumber: number,
    @Arg('valueString', () => String) valueString: string,
  ) {
    let schools = await this.repositorySchool.find();
    for (let school of schools) {
      let create = true;
      let schoolConfigurations = await this.repository.findBy({
        active: true,
        schoolId: school.id.toString(),
      });
      //console.log(schoolAdministrators.length);
      if (schoolConfigurations?.length > 0) {
        for (let schoolConfiguration of schoolConfigurations) {
          if (schoolConfiguration?.code === code) {
            create = false;
          }
        }
      }
      if (create) {
        const model = await this.repository.create({
          code,
          valueNumber,
          valueString,
          schoolId: school.id.toString(),
          active: true,
          version: 0,
        });
        let result = await this.repository.save(model);
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async importSchoolConfigurationSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let modelEntityBase = await this.repository.findBy({
        where: { entityBaseId: result?.id?.toString(), schoolYearId: newSchoolYearId.toString() },
      });
      if (modelEntityBase?.length < 1) {
        const model = await this.repository.create({
          code: result.code,
          valueNumber: result.valueNumber,
          valueString: result.valueString,
          schoolId: result.schoolId,
          createdByUserId: result.createdByUserId,
          updatedByUserId: result.updatedByUserId,
          active: result?.active,
          version: 0,
          schoolYearId: newSchoolYearId.toString(),
          entityBaseId: result?.id?.toString(),
        });
        let resultSave = await this.repository.save(model);
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteSchoolConfiguration(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: SchoolConfiguration) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: SchoolConfiguration) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: SchoolConfiguration) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }
}
