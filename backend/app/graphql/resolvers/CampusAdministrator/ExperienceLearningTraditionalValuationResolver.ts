import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  CampusRepository,
  ExperienceLearningRepository,
  ExperienceLearningTraditionalValuationRepository,
  PerformanceLevelRepository,
  StudentRepository,
  UserRepository
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewExperienceLearningTraditionalValuation } from '../../inputs/CampusAdministrator/NewExperienceLearningTraditionalValuation';
import { IContext } from '../../interfaces/IContext';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import {
  ExperienceLearningTraditionalValuation,
  ExperienceLearningTraditionalValuationConnection
} from '../../models/CampusAdministrator/ExperienceLearningTraditionalValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { ExperienceLearningResolver } from './ExperienceLearningResolver';

@Resolver(ExperienceLearningTraditionalValuation)
export class ExperienceLearningTraditionalValuationResolver {
  @InjectRepository(ExperienceLearningTraditionalValuation)
  private repository = ExperienceLearningTraditionalValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(ExperienceLearning)
  private repositoryExperienceLearning = ExperienceLearningRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  private experienceLearningResolver = new ExperienceLearningResolver();

  @Query(() => ExperienceLearningTraditionalValuation, { nullable: true })
  async getExperienceLearningTraditionalValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => ExperienceLearningTraditionalValuationConnection)
  async getAllExperienceLearningTraditionalValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('experienceLearningId', () => String) experienceLearningId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String
  ): Promise<ExperienceLearningTraditionalValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
              studentId,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
              studentId,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
              studentId,
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
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (studentId) {
          result = await this.repository.findBy({
            where: {
              experienceLearningId,
              studentId,
              active: true,
            },
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
    }
    let resultConn = new ExperienceLearningTraditionalValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => ExperienceLearningTraditionalValuation)
  async createExperienceLearningTraditionalValuation(
    @Arg('data') data: NewExperienceLearningTraditionalValuation,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningTraditionalValuation> {
    let dataProcess: NewExperienceLearningTraditionalValuation = removeEmptyStringElements(data);
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

  @Mutation(() => ExperienceLearningTraditionalValuation)
  async updateExperienceLearningTraditionalValuation(
    @Arg('data') data: NewExperienceLearningTraditionalValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<ExperienceLearningTraditionalValuation | null> {
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
    if (result?.experienceLearningId) {
      const experienceLearning = await this.repositoryExperienceLearning.findOneBy(result?.experienceLearningId);
      //console.log(experienceLearning)
      if (experienceLearning?.academicAsignatureCourseId && experienceLearning?.academicPeriodId && result?.studentId && experienceLearning?.experienceLearningType) {
        this.experienceLearningResolver.createAcademicAsignatureCoursePeriodValuationStudent(experienceLearning?.academicAsignatureCourseId, experienceLearning?.academicPeriodId, result?.studentId + "", experienceLearning?.experienceLearningType);
      }
    }
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveExperienceLearningTraditionalValuation(
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
  async deleteExperienceLearningTraditionalValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => ExperienceLearning, { nullable: true })
  async experienceLearning(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.experienceLearningId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryExperienceLearning.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: ExperienceLearningTraditionalValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
