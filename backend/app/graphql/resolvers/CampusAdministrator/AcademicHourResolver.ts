import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  AcademicDayRepository,
  AcademicHourRepository,
  CampusRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicHour } from '../../inputs/CampusAdministrator/NewAcademicHour';
import { IContext } from '../../interfaces/IContext';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import {
  AcademicHour,
  AcademicHourConnection,
} from '../../models/CampusAdministrator/AcademicHour';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicHour)
export class AcademicHourResolver {
  @InjectRepository(AcademicHour)
  private repository = AcademicHourRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @Query(() => AcademicHour, { nullable: true })
  async getAcademicHour(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicHourConnection)
  async getAllAcademicHour(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String, { nullable: true }) campusId: String,
    @Arg('academicDayId', () => String, { nullable: true }) academicDayId: String,
  ): Promise<AcademicHourConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (campusId && academicDayId) {
          result = await this.repository.findBy({
            where: { campusId, academicDayId },
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
              where: { academicDayId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (campusId && academicDayId) {
          result = await this.repository.findBy({
            where: { campusId, academicDayId },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: { campusId },
            });
          } else {
            result = await this.repository.findBy({
              where: { academicDayId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (campusId && academicDayId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              academicDayId,
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
                academicDayId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (campusId && academicDayId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              academicDayId,
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
                academicDayId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AcademicHourConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicHour)
  async createAcademicHour(
    @Arg('data') data: NewAcademicHour,
    @Ctx() context: IContext,
  ): Promise<AcademicHour> {
    let dataProcess: NewAcademicHour = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicHour)
  async updateAcademicHour(
    @Arg('data') data: NewAcademicHour,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicHour | null> {
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
  async changeActiveAcademicHour(
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
  async deleteAcademicHour(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async fixAllAcademicHourSchoolAndSchoolYear() {
    let results = await this.repository.findBy({
      where: {
        $or: [
          {
            schoolId: null,
          },
          { schoolYearId: null },
        ],
      },
      order: { createdAt: 'DESC' },
    });
    console.log(results?.length);
    let number = 0;
    for (let result of results) {
      number++;
      if (result?.schoolYearId) {
        console.log('schoolYearId: ', number);
        let schoolYear = await this.repositorySchoolYear.findOneBy(result?.schoolYearId);
        if (schoolYear) {
          result = await this.repository.save({
            _id: new ObjectId(result?.id?.toString()),
            ...result,
            schoolId: schoolYear?.schoolId,
            version: (result?.version as number) + 1,
          });
        }
      } else {
        if (result?.schoolId || result?.campusId) {
          let schoolId;
          if (result?.schoolId) {
            let school = await this.repositorySchool.findOneBy(result?.schoolId);
            if (school) {
              schoolId = school?.id?.toString();
            }
          } else {
            if (result?.campusId) {
              let campus = await this.repositoryCampus.findOneBy(result?.campusId);
              if (campus) {
                schoolId = campus?.schoolId;
              }
            }
          }
          if (schoolId) {
            console.log('schoolYears: ', number);
            let schoolYears = await this.repositorySchoolYear.findBy({
              where: { schoolId: schoolId },
            });
            console.log('schoolYears length: ', schoolYears?.length);
            if (schoolYears && schoolYears?.length === 1) {
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: schoolId,
                schoolYearId: schoolYears[0]?.id?.toString(),
                version: (result?.version as number) + 1,
              });
            } else {
              console.log('school -1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                active: false,
                version: -1,
              });
            }
          } else {
            console.log('school -2: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        } else {
          if (result?.academicDayId) {
            let academicDay = await this.repositoryAcademicDay.findOneBy(result?.academicDayId);
            if (academicDay && academicDay?.schoolId && academicDay?.schoolYearId) {
              console.log('school 1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: academicDay?.schoolId,
                schoolYearId: academicDay?.schoolYearId,
                version: (result?.version as number) + 1,
              });
            }
          } else {
            console.log('school -3: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async importAcademicHourSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldAcademicDayId', () => String) oldAcademicDayId: String,
    @Arg('newAcademicDayId', () => String) newAcademicDayId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, academicDayId: oldAcademicDayId },
    });
    console.log('schoolId', schoolId);
    console.log('academicDayId', oldAcademicDayId);
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let modelEntityBase = await this.repository.findBy({
        where: { entityBaseId: result?.id?.toString(), schoolYearId: newSchoolYearId.toString() },
      });
      if (modelEntityBase?.length < 1) {
        const model = await this.repository.create({
          academicDayId: newAcademicDayId + '',
          startTime: result.startTime,
          endTime: result.endTime,
          order: result.order,
          campusId: result.campusId,
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

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicHour) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicHour) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicHour) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicDay, { nullable: true })
  async academicDay(@Root() data: AcademicHour) {
    let id = data.academicDayId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicDay.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: AcademicHour) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicHour) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }
}
