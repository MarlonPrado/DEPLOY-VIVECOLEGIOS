import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicAsignatureRepository, AcademicGradeRepository, AcademicStandardRepository, GeneralAcademicStandardRepository, SchoolRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicStandard } from '../../inputs/SchoolAdministrator/NewAcademicStandard';
import { IContext } from '../../interfaces/IContext';
import { GeneralAcademicStandard } from '../../models/GeneralAdministrator/GeneralAcademicStandard';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import {
  AcademicStandard,
  AcademicStandardConnection
} from '../../models/SchoolAdministrator/AcademicStandard';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicStandard)
export class AcademicStandardResolver {
  @InjectRepository(AcademicStandard)
  private repository = AcademicStandardRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(GeneralAcademicStandard)
  private repositoryGeneralAcademicStandard = GeneralAcademicStandardRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;


  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @Query(() => AcademicStandard, { nullable: true })
  async getAcademicStandard(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicStandardConnection)
  async getAllAcademicStandard(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('academicAsignatureId', () => String, { nullable: true }) academicAsignatureId: string,
    @Arg('academicGradeId', () => String, { nullable: true }) academicGradeId: string,
  ): Promise<AcademicStandardConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAsignatureId, academicGradeId },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolId, academicGradeId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAsignatureId, academicGradeId },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolId, academicGradeId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: {
              schoolId, academicAsignatureId, academicGradeId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: {
                schoolId, academicAsignatureId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolId, academicGradeId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: {
              schoolId, academicAsignatureId, academicGradeId,
              active: true,
            },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: {
                schoolId, academicAsignatureId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolId, academicGradeId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AcademicStandardConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicStandard)
  async createAcademicStandard(
    @Arg('data') data: NewAcademicStandard,
    @Ctx() context: IContext
  ): Promise<AcademicStandard> {
    let dataProcess: NewAcademicStandard = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicStandard)
  async updateAcademicStandard(
    @Arg('data') data: NewAcademicStandard,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AcademicStandard | null> {
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
  async changeActiveAcademicStandard(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
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
  async deleteAcademicStandard(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicStandard) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicStandard) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralAcademicStandard, { nullable: true })
  async generalAcademicStandard(@Root() data: AcademicStandard) {
    let id = data.generalAcademicStandardId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralAcademicStandard.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignature, { nullable: true })
  async academicAsignature(@Root() data: AcademicStandard) {
    let id = data.academicAsignatureId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignature.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicGrade, { nullable: true })
  async academicGrade(@Root() data: AcademicStandard) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: AcademicStandard) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }
}
