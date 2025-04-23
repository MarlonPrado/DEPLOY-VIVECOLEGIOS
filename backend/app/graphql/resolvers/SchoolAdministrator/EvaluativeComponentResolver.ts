import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicAreaRepository,
  AcademicAsignatureCourseRepository,
  AcademicAsignatureRepository,
  CampusRepository,
  CourseRepository,
  EvaluativeComponentRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewEvaluativeComponent } from '../../inputs/SchoolAdministrator/NewEvaluativeComponent';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { Course } from '../../models/CampusAdministrator/Course';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import {
  EvaluativeComponent,
  EvaluativeComponentConnection,
} from '../../models/SchoolAdministrator/EvaluativeComponent';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(EvaluativeComponent)
export class EvaluativeComponentResolver {
  @InjectRepository(EvaluativeComponent)
  private repository = EvaluativeComponentRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @Query(() => EvaluativeComponent, { nullable: true })
  async getEvaluativeComponent(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => EvaluativeComponentConnection)
  async getAllEvaluativeComponent(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('academicAsignatureId', () => String, { nullable: true }) academicAsignatureId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<EvaluativeComponentConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              academicAsignatureId: { $in: [academicAsignatureId] },
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              academicAsignatureId: { $in: [academicAsignatureId] },
            },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId, schoolYearId },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              academicAsignatureId: { $in: [academicAsignatureId] },
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              academicAsignatureId: { $in: [academicAsignatureId] },
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new EvaluativeComponentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => EvaluativeComponentConnection)
  async getAllEvaluativeComponentAcademicAsignatureCourse(
    @Args() args: ConnectionArgs,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
  ): Promise<EvaluativeComponentConnection> {
    let result: any[] = [];
    let academicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.findOneBy(
      academicAsignatureCourseId,
    );
    if (academicAsignatureCourse) {
      let course = await this.repositoryCourse.findOneBy(academicAsignatureCourse.courseId);
      let academicAsignature = await this.repositoryAcademicAsignature.findOneBy(
        academicAsignatureCourse.academicAsignatureId,
      );
      if (course && academicAsignature) {
        let schoolYear = await this.repositorySchoolYear.findOneBy(course.schoolYearId);
        let campus = await this.repositoryCampus.findOneBy(course.campusId);
        if (campus) {
          result = await this.repository.findBy({
            where: {
              academicAsignaturesId: { $in: [academicAsignature.id.toString()] },
              schoolId: campus.schoolId,
              schoolYearId: schoolYear?.id?.toString(),
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
          if (result.length === 0) {
            result = await this.repository.findBy({
              where: {
                academicAreasId: { $in: [academicAsignature.academicAreaId] },
                schoolId: campus.schoolId,
                schoolYearId: schoolYear?.id?.toString(),
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
            if (result.length === 0) {
              result = await this.repository.findBy({
                where: {
                  schoolId: campus.schoolId,
                  schoolYearId: schoolYear?.id?.toString(),
                  active: true,
                },
                order: { createdAt: 'DESC' },
              });
            }
          }
        }
      }
    }
    let resultConn = new EvaluativeComponentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => EvaluativeComponent)
  async createEvaluativeComponent(
    @Arg('data') data: NewEvaluativeComponent,
    @Ctx() context: IContext,
  ): Promise<EvaluativeComponent> {
    let dataProcess: NewEvaluativeComponent = removeEmptyStringElements(data);
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

  @Mutation(() => EvaluativeComponent)
  async updateEvaluativeComponent(
    @Arg('data') data: NewEvaluativeComponent,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<EvaluativeComponent | null> {
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
  async changeActiveEvaluativeComponent(
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
  async deleteEvaluativeComponent(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async importEvaluativeComponentSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let academicAreasId = [];
      if (result?.academicAreasId) {
        for (let academicAreaId of result?.academicAreasId) {
          let academicAreaNew: any;
          let academicAreaOld = await this.repositoryAcademicArea.findOneBy(academicAreaId);
          if (academicAreaOld) {
            academicAreaNew = await this.repositoryAcademicArea.findBy({
              where: { entityBaseId: academicAreaId, schoolYearId: newSchoolYearId },
            });
            if (academicAreaNew?.length > 0) {
              academicAreasId.push(academicAreaNew[0]?.id?.toString());
            }
          }
        }
      }
      let academicAsignaturesId = [];
      if (result?.academicAsignaturesId) {
        for (let academicAsignatureId of result?.academicAsignaturesId) {
          let academicAsignatureNew: any;
          let academicAsignatureOld =
            await this.repositoryAcademicArea.findOneBy(academicAsignatureId);
          if (academicAsignatureOld) {
            academicAsignatureNew = await this.repositoryAcademicArea.findBy({
              where: { entityBaseId: academicAsignatureId, schoolYearId: newSchoolYearId },
            });
            if (academicAsignatureNew?.length > 0) {
              academicAsignaturesId.push(academicAsignatureNew[0]?.id?.toString());
            }
          }
        }
      }
      const model = await this.repository.create({
        name: result.name,
        weight: result.weight,
        type: result.type,
        academicAreasId: academicAreasId,
        academicAsignaturesId: academicAsignaturesId,
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
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllEvaluativeComponentSchoolAndSchoolYear() {
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
        if (result?.schoolId) {
          let schoolId;
          let school = await this.repositorySchool.findOneBy(result?.schoolId);
          if (school) {
            schoolId = school?.id?.toString();
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

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: EvaluativeComponent) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: EvaluativeComponent) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: EvaluativeComponent) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: EvaluativeComponent) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [AcademicAsignature], { nullable: true })
  async academicAsignatures(@Root() data: EvaluativeComponent) {
    let ids = data.academicAsignaturesId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryAcademicAsignature.findBy({
        where: { _id: { $in: dataIds } },
      });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [AcademicArea], { nullable: true })
  async academicAreas(@Root() data: EvaluativeComponent) {
    let ids = data.academicAreasId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryAcademicArea.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }
}
