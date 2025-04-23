import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  AcademicAsignatureCourseRepository,
  AcademicAsignatureRepository,
  AcademicGradeRepository,
  CourseRepository,
  GradeAssignmentRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewGradeAssignment } from '../../inputs/SchoolAdministrator/NewGradeAssignment';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { Course } from '../../models/CampusAdministrator/Course';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import {
  GradeAssignment,
  GradeAssignmentConnection,
} from '../../models/SchoolAdministrator/GradeAssignment';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { AcademicAsignatureCourseResolver } from '../CampusAdministrator/AcademicAsignatureCourseResolver';
import { AcademicGrade } from './../../models/SchoolAdministrator/AcademicGrade';

@Resolver(GradeAssignment)
export class GradeAssignmentResolver {
  @InjectRepository(GradeAssignment)
  private repository = GradeAssignmentRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  private academicAsignatureCourseResolver = new AcademicAsignatureCourseResolver();

  @Query(() => GradeAssignment, { nullable: true })
  async getGradeAssignment(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => GradeAssignmentConnection)
  async getAllGradeAssignment(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('academicAsignatureId', () => String, { nullable: true }) academicAsignatureId: string,
    @Arg('academicGradeId', () => String, { nullable: true }) academicGradeId: string,
  ): Promise<GradeAssignmentConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAsignatureId, academicGradeId },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolId, academicGradeId },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAsignatureId, academicGradeId },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: { schoolId, academicAsignatureId },
            });
          } else {
            result = await this.repository.findBy({
              where: { schoolId, academicGradeId },
            });
          }
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: {
                schoolId,
                academicAsignatureId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolId,
                academicGradeId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (academicAsignatureId && academicGradeId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAsignatureId,
              academicGradeId,
              active: true,
            },
          });
        } else {
          if (academicAsignatureId) {
            result = await this.repository.findBy({
              where: {
                schoolId,
                academicAsignatureId,
                active: true,
              },
            });
          } else {
            result = await this.repository.findBy({
              where: {
                schoolId,
                academicGradeId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new GradeAssignmentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => GradeAssignmentConnection)
  async getAllGradeAssignmentNotAssignedInCourse(
    @Args() args: ConnectionArgs,
    @Arg('courseId', () => String) courseId: string,
  ): Promise<GradeAssignmentConnection> {
    let course = await this.repositoryCourse.findOneBy(courseId);
    let result: any[] = [];
    if (course) {
      let academicAsignatureCourseAsignatureIds: any[] = [];
      let academicAsignaturesCourseAsignature =
        await this.repositoryAcademicAsignatureCourse.findBy({
          where: {
            courseId,
            active: true,
          },
        });
      academicAsignaturesCourseAsignature.forEach((academicAsignatureCourseAsignature: any) => {
        academicAsignatureCourseAsignatureIds.push(
          academicAsignatureCourseAsignature.academicAsignatureId,
        );
      });
      result = await this.repository.findBy({
        where: {
          academicGradeId: course.academicGradeId,
          academicAsignatureId: { $nin: academicAsignatureCourseAsignatureIds },
          active: true,
        },
      });
    }
    let resultConn = new GradeAssignmentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => GradeAssignment)
  async createGradeAssignment(
    @Arg('data') data: NewGradeAssignment,
    @Ctx() context: IContext,
  ): Promise<GradeAssignment> {
    let dataProcess: NewGradeAssignment = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    let courses = await this.repositoryCourse.findBy({
      where: {
        academicGradeId: result?.academicGradeId,
        schoolYearId: result?.schoolYearId,
      },
    });
    if (courses) {
      for (let course of courses) {
        let repositoryAcademicAsignatureCourse =
          await this.repositoryAcademicAsignatureCourse.findBy({
            where: {
              academicAsignatureId: result?.academicAsignatureId,
              courseId: course?.id.toString(),
              schoolYearId: result?.schoolYearId,
            },
          });
        if (repositoryAcademicAsignatureCourse.length === 0) {
          const modelAcademicAsignatureCourse =
            await this.repositoryAcademicAsignatureCourse.create({
              hourlyIntensity: result?.minHourlyIntensity,
              academicAsignatureId: result?.academicAsignatureId,
              courseId: course?.id.toString(),
              gradeAssignmentId: result?.id.toString(),
              schoolYearId: result?.schoolYearId,
              active: true,
              version: 0,
              createdByUserId,
            });
          let resultAcademicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.save(
            modelAcademicAsignatureCourse,
          );
        }
      }
    }
    return result;
  }

  @Mutation(() => GradeAssignment)
  async updateGradeAssignment(
    @Arg('data') data: NewGradeAssignment,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<GradeAssignment | null> {
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
  async changeActiveGradeAssignment(
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
  async importGradeAssignmentSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
    @Arg('academicAsignatureCourse', () => Boolean) academicAsignatureCourse: boolean,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let academicGradeNew: any;
      let academicGradeOld = await this.repositoryAcademicGrade.findOneBy(result?.academicGradeId);
      if (academicGradeOld) {
        academicGradeNew = await this.repositoryAcademicGrade.findBy({
          where: { entityBaseId: result?.academicGradeId, schoolYearId: newSchoolYearId },
        });
      }
      let academicAsignatureNew: any;
      let academicAsignatureOld = await this.repositoryAcademicAsignature.findOneBy(
        result?.academicAsignatureId,
      );
      if (academicAsignatureOld) {
        academicAsignatureNew = await this.repositoryAcademicAsignature.findBy({
          where: { entityBaseId: result?.academicAsignatureId, schoolYearId: newSchoolYearId },
        });
      }
      const model = await this.repository.create({
        minHourlyIntensity: result.minHourlyIntensity,
        maxHourlyIntensity: result.maxHourlyIntensity,
        academicGradeId: academicGradeNew?.length > 0 ? academicGradeNew[0]?.id?.toString() : null,
        academicAsignatureId:
          academicAsignatureNew?.length > 0 ? academicAsignatureNew[0]?.id?.toString() : null,
        schoolId: result.schoolId,
        createdByUserId: result.createdByUserId,
        updatedByUserId: result.updatedByUserId,
        active: result?.active,
        version: 0,
        schoolYearId: newSchoolYearId.toString(),
        entityBaseId: result?.id?.toString(),
      });
      let resultSave = await this.repository.save(model);
      console.log('academicAsignatureCourseResolver');
      if (academicAsignatureCourse) {
        await this.academicAsignatureCourseResolver.importAcademicAsignatureSchoolYearId(
          schoolId,
          result.id.toString(),
          resultSave.id.toString(),
          newSchoolYearId.toString(),
        );
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllGradeAssignmentSchoolAndSchoolYear() {
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
          if (result?.academicGradeId) {
            let academicGrade = await this.repositoryAcademicGrade.findOneBy(
              result?.academicGradeId,
            );
            if (academicGrade && academicGrade?.schoolId && academicGrade?.schoolYearId) {
              console.log('school 1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: academicGrade?.schoolId,
                schoolYearId: academicGrade?.schoolYearId,
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
  async deleteGradeAssignment(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: GradeAssignment) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: GradeAssignment) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicGrade, { nullable: true })
  async academicGrade(@Root() data: GradeAssignment) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignature, { nullable: true })
  async academicAsignature(@Root() data: GradeAssignment) {
    let id = data.academicAsignatureId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignature.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: GradeAssignment) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }
}
