import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicDayRepository, AverageAcademicPeriodCourseRepository, CampusRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAverageAcademicPeriodCourse } from '../../inputs/CampusAdministrator/NewAverageAcademicPeriodCourse';
import { IContext } from '../../interfaces/IContext';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { AverageAcademicPeriodCourse, AverageAcademicPeriodCourseConnection } from '../../models/CampusAdministrator/AverageAcademicPeriodCourse';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AverageAcademicPeriodCourse)
export class AverageAcademicPeriodCourseResolver {
  @InjectRepository(AverageAcademicPeriodCourse)
  private repository = AverageAcademicPeriodCourseRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @Query(() => AverageAcademicPeriodCourse, { nullable: true })
  async getAverageAcademicPeriodCourse(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AverageAcademicPeriodCourseConnection)
  async getAllAverageAcademicPeriodCourse(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicPeriodId', () => String, { nullable: true }) academicPeriodId: String,
    @Arg('courseId', () => String, { nullable: true }) courseId: String
  ): Promise<AverageAcademicPeriodCourseConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (courseId && academicPeriodId) {
          result = await this.repository.findBy({
            where: { courseId, academicPeriodId },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (courseId) {
            result = await this.repository.findBy({
              where: { courseId },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: { academicPeriodId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (courseId && academicPeriodId) {
          result = await this.repository.findBy({
            where: { courseId, academicPeriodId },
          });
        } else {
          if (courseId) {
            result = await this.repository.findBy({
              where: { courseId },
            });
          } else {
            result = await this.repository.findBy({
              where: { academicPeriodId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (courseId && academicPeriodId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (courseId) {
            result = await this.repository.findBy({
              where: {
                courseId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                academicPeriodId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (courseId && academicPeriodId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              active: true,
            },
          });
        } else {
          if (courseId) {
            result = await this.repository.findBy({
              where: {
                courseId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                academicPeriodId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AverageAcademicPeriodCourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AverageAcademicPeriodCourse)
  async createAverageAcademicPeriodCourse(
    @Arg('data') data: NewAverageAcademicPeriodCourse,
    @Ctx() context: IContext
  ): Promise<AverageAcademicPeriodCourse> {
    let dataProcess: NewAverageAcademicPeriodCourse = removeEmptyStringElements(data);
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

  @Mutation(() => AverageAcademicPeriodCourse)
  async updateAverageAcademicPeriodCourse(
    @Arg('data') data: NewAverageAcademicPeriodCourse,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AverageAcademicPeriodCourse | null> {
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
  async changeActiveAverageAcademicPeriodCourse(
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
  async deleteAverageAcademicPeriodCourse(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AverageAcademicPeriodCourse) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AverageAcademicPeriodCourse) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AverageAcademicPeriodCourse) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

}
