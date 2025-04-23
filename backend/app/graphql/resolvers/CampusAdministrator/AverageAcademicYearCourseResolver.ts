import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicDayRepository, AverageAcademicYearCourseRepository, CampusRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAverageAcademicYearCourse } from '../../inputs/CampusAdministrator/NewAverageAcademicYearCourse';
import { IContext } from '../../interfaces/IContext';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { AverageAcademicYearCourse, AverageAcademicYearCourseConnection } from '../../models/CampusAdministrator/AverageAcademicYearCourse';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AverageAcademicYearCourse)
export class AverageAcademicYearCourseResolver {
  @InjectRepository(AverageAcademicYearCourse)
  private repository = AverageAcademicYearCourseRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @Query(() => AverageAcademicYearCourse, { nullable: true })
  async getAverageAcademicYearCourse(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AverageAcademicYearCourseConnection)
  async getAllAverageAcademicYearCourse(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String, { nullable: true }) campusId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String
  ): Promise<AverageAcademicYearCourseConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (campusId && schoolYearId) {
          result = await this.repository.findBy({
            where: { campusId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: { campusId },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolYearId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (campusId && schoolYearId) {
          result = await this.repository.findBy({
            where: { campusId, schoolYearId },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: { campusId },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolYearId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (campusId && schoolYearId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: {
                campusId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolYearId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (campusId && schoolYearId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              schoolYearId,
              active: true,
            },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: {
                campusId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolYearId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AverageAcademicYearCourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AverageAcademicYearCourse)
  async createAverageAcademicYearCourse(
    @Arg('data') data: NewAverageAcademicYearCourse,
    @Ctx() context: IContext
  ): Promise<AverageAcademicYearCourse> {
    let dataProcess: NewAverageAcademicYearCourse = removeEmptyStringElements(data);
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

  @Mutation(() => AverageAcademicYearCourse)
  async updateAverageAcademicYearCourse(
    @Arg('data') data: NewAverageAcademicYearCourse,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AverageAcademicYearCourse | null> {
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
  async changeActiveAverageAcademicYearCourse(
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
  async deleteAverageAcademicYearCourse(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AverageAcademicYearCourse) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AverageAcademicYearCourse) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AverageAcademicYearCourse) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

}
