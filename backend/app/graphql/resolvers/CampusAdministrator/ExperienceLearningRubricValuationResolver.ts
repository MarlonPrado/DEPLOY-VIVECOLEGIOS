import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  CampusRepository,
  ExperienceLearningRepository,
  ExperienceLearningRubricCriteriaRepository,
  ExperienceLearningRubricCriteriaValuationRepository,
  ExperienceLearningRubricValuationRepository,
  PerformanceLevelRepository,
  StudentRepository,
  UserRepository
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { NewExperienceLearningRubricValuation } from '../../inputs/CampusAdministrator/NewExperienceLearningRubricValuation';
import { IContext } from '../../interfaces/IContext';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { ExperienceLearningRubricCriteria } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteria';
import { ExperienceLearningRubricCriteriaValuation } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteriaValuation';
import {
  ExperienceLearningRubricValuation,
  ExperienceLearningRubricValuationConnection
} from '../../models/CampusAdministrator/ExperienceLearningRubricValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { PerformanceLevelResolver } from '../SchoolAdministrator/PerformanceLevelResolver';
import { ExperienceLearningResolver } from './ExperienceLearningResolver';

@Resolver(ExperienceLearningRubricValuation)
export class ExperienceLearningRubricValuationResolver {
  @InjectRepository(ExperienceLearningRubricValuation)
  private repository = ExperienceLearningRubricValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(ExperienceLearning)
  private repositoryExperienceLearning = ExperienceLearningRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(ExperienceLearningRubricCriteriaValuation)
  private repositoryExperienceLearningRubricCriteriaValuation = ExperienceLearningRubricCriteriaValuationRepository;

  @InjectRepository(ExperienceLearningRubricCriteria)
  private repositoryExperienceLearningRubricCriteria = ExperienceLearningRubricCriteriaRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  private experienceLearningResolver = new ExperienceLearningResolver();

  private performanceLevelResolver = new PerformanceLevelResolver();

  @Query(() => ExperienceLearningRubricValuation, { nullable: true })
  async getExperienceLearningRubricValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => ExperienceLearningRubricValuationConnection)
  async getAllExperienceLearningRubricValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('experienceLearningId', () => String) experienceLearningId: String
  ): Promise<ExperienceLearningRubricValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            experienceLearningId,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            experienceLearningId,
          },
        });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            experienceLearningId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            experienceLearningId,
            active: true,
          },
        });
      }
    }
    let resultConn = new ExperienceLearningRubricValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => ExperienceLearningRubricValuation)
  async createExperienceLearningRubricValuation(
    @Arg('data') data: NewExperienceLearningRubricValuation,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningRubricValuation> {
    let dataProcess: NewExperienceLearningRubricValuation = removeEmptyStringElements(data);
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

  @Mutation(() => ExperienceLearningRubricValuation)
  async updateAssessmentExperienceLearningRubricValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningRubricValuation | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let experienceLearningRubricCriterias =
      await this.repositoryExperienceLearningRubricCriteria.findBy({
        experienceLearningId: result?.experienceLearningId,
        active: true,
      });
    let assessment = 0;
    let perf = null;
    let performanceLevelId = undefined;
    for (let experienceLearningRubricCriteria of experienceLearningRubricCriterias) {
      let experienceLearningRubricCriteriaValuations =
        await this.repositoryExperienceLearningRubricCriteriaValuation.findBy({
          where: {
            experienceLearningRubricCriteriaId: experienceLearningRubricCriteria?.id.toString(),
            active: true,
            studentId: result?.studentId,
          },
        });
      if (experienceLearningRubricCriteriaValuations.length > 0) {
        if (
          experienceLearningRubricCriteria &&
          experienceLearningRubricCriteria.weight &&
          experienceLearningRubricCriteriaValuations[0].assessment
        ) {
          let assessmentWeight =
            (experienceLearningRubricCriteria.weight *
              experienceLearningRubricCriteriaValuations[0].assessment) /
            100;
          assessment += assessmentWeight;
          let experienceLearning = await this.repositoryExperienceLearning.findOneBy(result?.experienceLearningId);
          if (experienceLearning) {
            let performanceLevels = await this.performanceLevelResolver.getAllPerformanceLevelAcademicAsignatureCourse({}, experienceLearning.academicAsignatureCourseId + "")
            perf = performanceLevels?.edges?.find((c: any) => {
              return assessment < c.node.topScore && assessment >= c.node.minimumScore;
            });
            if (perf === undefined) {
              perf = performanceLevels?.edges?.find((c: any) => {
                return assessment <= c.node.topScore && assessment > c.node.minimumScore;
              });
            }
            if (perf && perf?.node?.id) {
              performanceLevelId = perf.node.id
            }
          }
        }
      }
    }
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      assessment,
      performanceLevelId,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    const experienceLearning = await this.repositoryExperienceLearning.findOneBy(result?.experienceLearningId);
    if (experienceLearning?.academicAsignatureCourseId && experienceLearning?.academicPeriodId && result?.studentId) {
      this.experienceLearningResolver.createAcademicAsignatureCoursePeriodValuationStudent(experienceLearning?.academicAsignatureCourseId, experienceLearning?.academicPeriodId, result?.studentId + "", ExperienceLearningType?.NORMAL);
    }
    return result;
  }

  @Mutation(() => ExperienceLearningRubricValuation)
  async updateExperienceLearningRubricValuation(
    @Arg('data') data: NewExperienceLearningRubricValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningRubricValuation | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    //console.log(dataProcess);
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
  async changeActiveExperienceLearningRubricValuation(
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
  async deleteExperienceLearningRubricValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => ExperienceLearning, { nullable: true })
  async experienceLearning(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.experienceLearningId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryExperienceLearning.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: ExperienceLearningRubricValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
