import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AverageAcademicYearStudentRepository, CampusRepository, PerformanceLevelRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAverageAcademicYearStudent } from '../../inputs/CampusAdministrator/NewAverageAcademicYearStudent';
import { IContext } from '../../interfaces/IContext';
import { AverageAcademicYearStudent, AverageAcademicYearStudentConnection } from '../../models/CampusAdministrator/AverageAcademicYearStudent';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AverageAcademicYearStudent)
export class AverageAcademicYearStudentResolver {
  @InjectRepository(AverageAcademicYearStudent)
  private repository = AverageAcademicYearStudentRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => AverageAcademicYearStudent, { nullable: true })
  async getAverageAcademicYearStudent(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AverageAcademicYearStudentConnection)
  async getAllAverageAcademicYearStudent(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
    @Arg('courseId', () => String, { nullable: true }) courseId: String
  ): Promise<AverageAcademicYearStudentConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (schoolYearId && courseId) {
          result = await this.repository.findBy({
            where: { schoolYearId, courseId },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (schoolYearId) {
            result = await this.repository.findBy({
              where: { schoolYearId },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: { courseId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (schoolYearId && courseId) {
          result = await this.repository.findBy({
            where: { schoolYearId, courseId },
          });
        } else {
          if (schoolYearId) {
            result = await this.repository.findBy({
              where: { schoolYearId },
            });
          } else {
            result = await this.repository.findBy({
              where: { courseId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (schoolYearId && courseId) {
          result = await this.repository.findBy({
            where: {
              schoolYearId,
              courseId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (schoolYearId) {
            result = await this.repository.findBy({
              where: {
                schoolYearId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                courseId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (schoolYearId && courseId) {
          result = await this.repository.findBy({
            where: {
              schoolYearId,
              courseId,
              active: true,
            },
          });
        } else {
          if (schoolYearId) {
            result = await this.repository.findBy({
              where: {
                schoolYearId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                courseId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AverageAcademicYearStudentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AverageAcademicYearStudent)
  async createAverageAcademicYearStudent(
    @Arg('data') data: NewAverageAcademicYearStudent,
    @Ctx() context: IContext
  ): Promise<AverageAcademicYearStudent> {
    let dataProcess: NewAverageAcademicYearStudent = removeEmptyStringElements(data);
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

  @Mutation(() => AverageAcademicYearStudent)
  async updateAverageAcademicYearStudent(
    @Arg('data') data: NewAverageAcademicYearStudent,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AverageAcademicYearStudent | null> {
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
  async changeActiveAverageAcademicYearStudent(
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
  async deleteAverageAcademicYearStudent(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AverageAcademicYearStudent) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AverageAcademicYearStudent) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AverageAcademicYearStudent) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: AverageAcademicYearStudent) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }

}
