import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  AcademicAsignatureRepository,
  AcademicGradeRepository,
  AcademicPeriodRepository,
  AcademicStandardRepository,
  EvidenceLearningRepository,
  GeneralBasicLearningRightRepository,
  LearningRepository,
  SchoolRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewLearning } from '../../inputs/SchoolAdministrator/NewLearning';
import { IContext } from '../../interfaces/IContext';
import { GeneralBasicLearningRight } from '../../models/GeneralAdministrator/GeneralBasicLearningRight';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { AcademicStandard } from '../../models/SchoolAdministrator/AcademicStandard';
import { EvidenceLearning } from '../../models/SchoolAdministrator/EvidenceLearning';
import { Learning, LearningConnection } from '../../models/SchoolAdministrator/Learning';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(Learning)
export class LearningResolver {
  @InjectRepository(Learning)
  private repository = LearningRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(GeneralBasicLearningRight)
  private repositoryGeneralBasicLearningRight = GeneralBasicLearningRightRepository;

  @InjectRepository(AcademicStandard)
  private repositoryAcademicStandard = AcademicStandardRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(EvidenceLearning)
  private repositoryEvidenceLearning = EvidenceLearningRepository;

  @Query(() => Learning, { nullable: true })
  async getLearning(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => LearningConnection)
  async getAllLearning(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: string,
    @Arg('academicPeriodsId', () => [String], { nullable: true }) academicPeriodsId: String[],
    @Arg('academicAsignatureId', () => String, { nullable: true }) academicAsignatureId: string,
    @Arg('academicGradeId', () => String, { nullable: true }) academicGradeId: string
  ): Promise<LearningConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId && academicPeriodsId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              academicPeriodsId: { $in: academicPeriodsId },
            },
            order: { createdAt: 'DESC' },
          });
        } else {
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
        }
      } else {
        if (academicAsignatureId && academicGradeId && academicPeriodsId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              academicPeriodsId: { $in: academicPeriodsId },
            },
          });
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
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId && academicPeriodsId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              academicPeriodsId: { $in: academicPeriodsId },
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (academicAsignatureId && academicGradeId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId, academicGradeId, active: true },
              order: { createdAt: 'DESC' },
            });
          } else {
            if (academicAsignatureId) {
              result = await this.repository.findBy({
                where: { schoolId, academicAsignatureId, active: true },
                order: { createdAt: 'DESC' },
              });
            } else {
              result = await this.repository.findBy({
                where: { schoolId, academicGradeId, active: true },
                order: { createdAt: 'DESC' },
              });
            }
          }
        }
      } else {
        if (academicAsignatureId && academicGradeId && academicPeriodsId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              academicPeriodsId: { $in: academicPeriodsId },
              active: true,
            },
          });
        } else {
          if (academicAsignatureId && academicGradeId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId, academicGradeId, active: true },
            });
          } else {
            if (academicAsignatureId) {
              result = await this.repository.findBy({
                where: { schoolId, academicAsignatureId, active: true },
              });
            } else {
              result = await this.repository.findBy({
                where: { schoolId, academicGradeId, active: true },
              });
            }
          }
        }
      }
    }
    let resultConn = new LearningConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Learning)
  async createLearning(
    @Arg('data') data: NewLearning,
    @Ctx() context: IContext
  ): Promise<Learning> {
    let dataProcess: NewLearning = removeEmptyStringElements(data);
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

  @Mutation(() => Learning)
  async updateLearning(
    @Arg('data') data: NewLearning,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Learning | null> {
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
  async changeActiveLearning(
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
  async deleteLearning(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Learning) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Learning) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralBasicLearningRight, { nullable: true })
  async generalBasicLearningRight(@Root() data: Learning) {
    let id = data.generalBasicLearningRightId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralBasicLearningRight.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignature, { nullable: true })
  async academicAsignature(@Root() data: Learning) {
    let id = data.academicAsignatureId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignature.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicStandard, { nullable: true })
  async academicStandard(@Root() data: Learning) {
    let id = data.academicStandardId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicStandard.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicGrade, { nullable: true })
  async academicGrade(@Root() data: Learning) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [AcademicPeriod], { nullable: true })
  async academicPeriods(@Root() data: Learning) {
    let ids = data.academicPeriodsId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryAcademicPeriod.findBy({
        where: { _id: { $in: dataIds } },
      });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: Learning) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [EvidenceLearning], { nullable: true })
  async evidenceLearnings(@Root() data: Learning) {
    const result = await this.repositoryEvidenceLearning.findBy({
      where: { learningId: data.id.toString() },
    });
    return result;
  }
}
