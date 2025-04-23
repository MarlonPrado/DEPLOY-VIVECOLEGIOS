import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  CampusRepository,
  ExperienceLearningRubricCriteriaRepository,
  ExperienceLearningRubricCriteriaValuationRepository,
  PerformanceLevelRepository,
  StudentRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewExperienceLearningRubricCriteriaValuation } from '../../inputs/CampusAdministrator/NewExperienceLearningRubricCriteriaValuation';
import { IContext } from '../../interfaces/IContext';
import { ExperienceLearningRubricCriteria } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteria';
import {
  ExperienceLearningRubricCriteriaValuation,
  ExperienceLearningRubricCriteriaValuationConnection,
} from '../../models/CampusAdministrator/ExperienceLearningRubricCriteriaValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(ExperienceLearningRubricCriteriaValuation)
export class ExperienceLearningRubricCriteriaValuationResolver {
  @InjectRepository(ExperienceLearningRubricCriteriaValuation)
  private repository = ExperienceLearningRubricCriteriaValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(ExperienceLearningRubricCriteria)
  private repositoryExperienceLearningRubricCriteria = ExperienceLearningRubricCriteriaRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => ExperienceLearningRubricCriteriaValuation, { nullable: true })
  async getExperienceLearningRubricCriteriaValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => ExperienceLearningRubricCriteriaValuationConnection)
  async getAllExperienceLearningRubricCriteriaValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('experienceLearningRubricCriteriaId', () => String)
    experienceLearningRubricCriteriaId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String
  ): Promise<ExperienceLearningRubricCriteriaValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              studentId,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              studentId,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningRubricCriteriaId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new ExperienceLearningRubricCriteriaValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => ExperienceLearningRubricCriteriaValuationConnection)
  async getAllExperienceLearningRubricCriteriaValuationStudent(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('experienceLearningId', () => String) experienceLearningId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String
  ): Promise<ExperienceLearningRubricCriteriaValuationConnection> {
    let result: any[] = [];
    const experienceLearningRubricCriterias =
      await this.repositoryExperienceLearningRubricCriteria.findBy({
        where: {
          experienceLearningId,
          active: true,
        },
      });
    if (experienceLearningRubricCriterias) {
      let dataIds: any[] = [];
      experienceLearningRubricCriterias.forEach(async (experienceLearningRubricCriteria: any) => {
        dataIds.push(experienceLearningRubricCriteria.id.toString());
      });
      if (allData) {
        if (orderCreated) {
          if (studentId) {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                studentId,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
              },
              order: { createdAt: 'DESC' },
            });
          }
        } else {
          if (studentId) {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                studentId,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
              },
            });
          }
        }
      } else {
        if (orderCreated) {
          if (studentId) {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                studentId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        } else {
          if (studentId) {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                studentId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                experienceLearningRubricCriteriaId: { $in: dataIds },
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new ExperienceLearningRubricCriteriaValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => ExperienceLearningRubricCriteriaValuation)
  async createExperienceLearningRubricCriteriaValuation(
    @Arg('data') data: NewExperienceLearningRubricCriteriaValuation,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningRubricCriteriaValuation> {
    let dataProcess: NewExperienceLearningRubricCriteriaValuation = removeEmptyStringElements(data);
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

  @Mutation(() => ExperienceLearningRubricCriteriaValuation)
  async updateExperienceLearningRubricCriteriaValuation(
    @Arg('data') data: NewExperienceLearningRubricCriteriaValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningRubricCriteriaValuation | null> {
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
  async changeActiveExperienceLearningRubricCriteriaValuation(
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
  async deleteExperienceLearningRubricCriteriaValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => ExperienceLearningRubricCriteria, { nullable: true })
  async experienceLearningRubricCriteria(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.experienceLearningRubricCriteriaId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryExperienceLearningRubricCriteria.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: ExperienceLearningRubricCriteriaValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
