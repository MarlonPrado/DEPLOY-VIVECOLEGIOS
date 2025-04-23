import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { ObjectLiteral } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicDayRepository,
  CampusRepository,
  JornadasRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { Day } from '../../enums/Day';
import { NewAcademicDay } from '../../inputs/CampusAdministrator/NewAcademicDay';
import { IContext } from '../../interfaces/IContext';
import { AcademicDay, AcademicDayConnection } from '../../models/CampusAdministrator/AcademicDay';
import { Jornadas } from '../../models/Data/Jornadas';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { AcademicHourResolver } from './AcademicHourResolver';

@Resolver(AcademicDay)
export class AcademicDayResolver {
  @InjectRepository(AcademicDay)
  private repository = AcademicDayRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Jornadas)
  private repositoryJornadas = JornadasRepository;

  private academicHourResolver = new AcademicHourResolver();

  @Query(() => AcademicDay, { nullable: true })
  async getAcademicDay(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicDayConnection)
  async getAllAcademicDay(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String) campusId: String,
    @Arg('schoolId', () => String, { nullable: true }) schoolId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicDayConnection> {
    let result;
    let campusDataIds: any[] = [];
    if (schoolId) {
      const campusData = await this.repositoryCampus.findBy({ schoolId, active: true });
      campusData.forEach((campus: any) => {
        campusDataIds.push(campus.id.toString());
      });
    } else {
      campusDataIds.push(campusId);
    }
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
          },
        });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
            active: true,
          },
        });
      }
    }
    let resultConn = new AcademicDayConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => AcademicDayConnection)
  async getAllAcademicDayCampus(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String) campusId: String,
    @Arg('schoolId', () => String, { nullable: true }) schoolId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicDayConnection> {
    let result;
    let campusDataIds: any[] = [];
    campusDataIds.push(campusId);
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
          },
        });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            campusId: { $in: campusDataIds },
            schoolYearId,
            active: true,
          },
        });
      }
    }
    let resultConn = new AcademicDayConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicDay)
  async createAcademicDay(
    @Arg('data') data: NewAcademicDay,
    @Ctx() context: IContext,
  ): Promise<AcademicDay> {
    let dataProcess: NewAcademicDay = removeEmptyStringElements(data);
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

  @Mutation(() => Boolean)
  async updateAllAcademicDaySchoolId(@Arg('schoolId', () => String) schoolId: String) {
    let results;
    let campusDataIds: any[] = [];
    if (schoolId) {
      const campusData = await this.repositoryCampus.findBy({ schoolId, active: true });
      campusData.forEach((campus: any) => {
        campusDataIds.push(campus.id.toString());
      });
    }
    results = await this.repository.findBy({
      where: {
        campusId: { $in: campusDataIds },
      },
      order: { createdAt: 'DESC' },
    });
    for (let data of results) {
      let result = await this.repository.save({
        _id: new ObjectId(data.id.toString()),
        ...data,
        version: (data?.version as number) + 1,
        schoolId: schoolId.toString(),
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  public async createAllInitialsAcademicDay(
    @Arg('schoolId') schoolId: String,
    @Arg('schoolYearId') schoolYearId: String,
  ) {
    let school = await this.repositorySchool.findOneBy(schoolId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    let count = 0;
    let dataSaveBulk: ObjectLiteral[] = [];
    if (school && schoolYear) {
      let data = await this.repositoryJornadas.findBy({
        where: { dane: school.daneCode },
      });
      for (let jornada of data) {
        if (jornada.jornada && jornada.consecutivo && jornada.dane) {
          if (
            jornada.jornada.length > 1 &&
            jornada.consecutivo.length > 1 &&
            jornada.dane.length > 1
          ) {
            let campus = await this.repositoryCampus.findBy({
              where: { consecutive: jornada.consecutivo },
            });
            if (campus.length === 1) {
              let academicDay = await this.repository.findBy({
                where: {
                  campusId: campus[0].id.toString(),
                  nameSIMAT: jornada.jornada,
                  schoolYearId,
                },
              });
              if (academicDay.length === 0) {
                //const model = await this.repository.create({
                const model = {
                  name: jornada.jornada,
                  nameSIMAT: jornada.jornada,
                  day: [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY],
                  campusId: campus[0].id.toString(),
                  schoolId: school.id.toString(),
                  schoolYearId: schoolYear.id.toString(),
                  active: true,
                  version: 0,
                };
                dataSaveBulk.push({ insertOne: { document: { ...model } } });
                //let result = await this.repository.save(model);
                //console.log(model);
                count += 1;
              } else {
                let resultAcademicDay = await this.repository.save({
                  ...academicDay[0],
                  _id: new ObjectId(academicDay[0].id.toString()),
                  version: (academicDay[0]?.version as number) + 1,
                  schoolId: school.id.toString(),
                });
              }
            }
          }
        }
      }
    }
    if (dataSaveBulk.length > 0) {
      let result = await this.repository.bulkWrite(dataSaveBulk);
    }
    return true;
  }

  @Mutation(() => AcademicDay)
  async updateAcademicDay(
    @Arg('data') data: NewAcademicDay,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicDay | null> {
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
  async changeActiveAcademicDay(
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
  async deleteAcademicDay(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async fixAllAcademicDaySchoolAndSchoolYear() {
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
              console.log('school -: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                active: false,
                version: -1,
              });
            }
          } else {
            console.log('school -: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        } else {
          console.log('school -: ', number);
          result = await this.repository.save({
            _id: new ObjectId(result?.id?.toString()),
            ...result,
            active: false,
            version: -1,
          });
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async importAcademicDaySchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
    @Arg('academicHour', () => Boolean) academicHour: boolean,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let modelEntityBase = await this.repository.findBy({
        where: { entityBaseId: result?.id?.toString(), schoolYearId: newSchoolYearId.toString() },
      });
      let resultSave;
      if (modelEntityBase?.length < 1) {
        const model = await this.repository.create({
          name: result.name,
          nameSIMAT: result.nameSIMAT,
          day: result.day,
          schoolId: result.schoolId,
          campusId: result.campusId,
          createdByUserId: result.createdByUserId,
          updatedByUserId: result.updatedByUserId,
          active: result?.active,
          version: 0,
          schoolYearId: newSchoolYearId.toString(),
          entityBaseId: result?.id?.toString(),
        });
        resultSave = await this.repository.save(model);
      } else {
        resultSave = modelEntityBase[0];
      }
      console.log('academicHourResolver');
      if (academicHour) {
        await this.academicHourResolver.importAcademicHourSchoolYearId(
          schoolId,
          result.id.toString(),
          resultSave.id.toString(),
          newSchoolYearId.toString(),
        );
      }
    }
    return true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicDay) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicDay) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicDay) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: AcademicDay) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicDay) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }
}
