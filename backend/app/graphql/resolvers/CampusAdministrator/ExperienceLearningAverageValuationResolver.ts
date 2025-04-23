import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  AcademicAsignatureCourseRepository,
  AcademicPeriodRepository,
  CampusRepository,
  EvaluativeComponentRepository,
  ExperienceLearningAverageValuationRepository,
  PerformanceLevelRepository,
  StudentRepository,
  UserRepository
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { NewExperienceLearningAverageValuation } from '../../inputs/CampusAdministrator/NewExperienceLearningAverageValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import {
  ExperienceLearningAverageValuation,
  ExperienceLearningAverageValuationConnection
} from '../../models/CampusAdministrator/ExperienceLearningAverageValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { EvaluativeComponent } from '../../models/SchoolAdministrator/EvaluativeComponent';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(ExperienceLearningAverageValuation)
export class ExperienceLearningAverageValuationResolver {
  @InjectRepository(ExperienceLearningAverageValuation)
  private repository = ExperienceLearningAverageValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(EvaluativeComponent)
  private repositoryEvaluativeComponent = EvaluativeComponentRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => ExperienceLearningAverageValuation, { nullable: true })
  async getExperienceLearningAverageValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => ExperienceLearningAverageValuationConnection)
  async getAllExperienceLearningAverageValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
    @Arg('academicPeriodId', () => String) academicPeriodId: String,
    @Arg('evaluativeComponentId', () => String) evaluativeComponentId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
    @Arg('experienceLearningType', () => ExperienceLearningType) experienceLearningType: ExperienceLearningType,
  ): Promise<ExperienceLearningAverageValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureCourseId && academicPeriodId && evaluativeComponentId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              studentId,
              experienceLearningType
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              experienceLearningType
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureCourseId && academicPeriodId && evaluativeComponentId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              studentId,
              experienceLearningType
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              experienceLearningType
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureCourseId && academicPeriodId && evaluativeComponentId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              studentId,
              experienceLearningType,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              experienceLearningType,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureCourseId && academicPeriodId && evaluativeComponentId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              studentId,
              experienceLearningType,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              evaluativeComponentId,
              experienceLearningType,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new ExperienceLearningAverageValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => ExperienceLearningAverageValuation)
  async createExperienceLearningAverageValuation(
    @Arg('data') data: NewExperienceLearningAverageValuation,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningAverageValuation> {
    let dataProcess: NewExperienceLearningAverageValuation = removeEmptyStringElements(data);
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

  @Mutation(() => ExperienceLearningAverageValuation)
  async updateExperienceLearningAverageValuation(
    @Arg('data') data: NewExperienceLearningAverageValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningAverageValuation | null> {
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
  async changeActiveExperienceLearningAverageValuation(
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
  async deleteExperienceLearningAverageValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignatureCourse, { nullable: true })
  async academicAsignatureCourse(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.academicAsignatureCourseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignatureCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicPeriod, { nullable: true })
  async academicPeriod(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.academicPeriodId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicPeriod.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => EvaluativeComponent, { nullable: true })
  async evaluativeComponent(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.evaluativeComponentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryEvaluativeComponent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: ExperienceLearningAverageValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
