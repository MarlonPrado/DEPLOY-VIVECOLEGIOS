import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicAsignatureCourseRepository,
  AcademicAsignatureRepository,
  CampusRepository,
  CourseRepository,
  ExperienceLearningRepository,
  GradeAssignmentRepository,
  SchoolRepository,
  SchoolYearRepository,
  TeacherRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { NewAcademicAsignatureCourse } from '../../inputs/CampusAdministrator/NewAcademicAsignatureCourse';
import { IContext } from '../../interfaces/IContext';
import {
  AcademicAsignatureCourse,
  AcademicAsignatureCourseConnection,
} from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { Course } from '../../models/CampusAdministrator/Course';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { GradeAssignment } from '../../models/SchoolAdministrator/GradeAssignment';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAsignatureCourse)
export class AcademicAsignatureCourseResolver {
  @InjectRepository(AcademicAsignatureCourse)
  private repository = AcademicAsignatureCourseRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(Teacher)
  private repositoryTeacher = TeacherRepository;

  @InjectRepository(ExperienceLearning)
  private repositoryExperienceLearning = ExperienceLearningRepository;

  @InjectRepository(GradeAssignment)
  private repositoryGradeAssignment = GradeAssignmentRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @Query(() => AcademicAsignatureCourse, { nullable: true })
  async getAcademicAsignatureCourse(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicAsignatureCourseConnection)
  async getAllAcademicAsignatureCourse(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String, { nullable: true }) campusId: String,
    @Arg('courseId', () => String, { nullable: true }) courseId: String,
  ): Promise<AcademicAsignatureCourseConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (campusId && courseId) {
          result = await this.repository.findBy({
            where: { campusId, courseId },
            order: { order: 'DESC' },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: { campusId },
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
        if (campusId && courseId) {
          result = await this.repository.findBy({
            where: { campusId, courseId },
          });
        } else {
          if (campusId) {
            result = await this.repository.findBy({
              where: { campusId },
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
        if (campusId && courseId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              courseId,
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
                courseId,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
          }
        }
      } else {
        if (campusId && courseId) {
          result = await this.repository.findBy({
            where: {
              campusId,
              courseId,
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
                courseId,
                active: true,
              },
            });
          }
        }
      }
    }
    let resultConn = new AcademicAsignatureCourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => AcademicAsignatureCourseConnection)
  async getAllAcademicAsignatureCourseByCourse(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('courseId', () => String) courseId: String,
  ): Promise<AcademicAsignatureCourseConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: { courseId },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: { courseId },
        });
      }
    } else {
      if (orderCreated) {
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
            courseId,
            active: true,
          },
        });
      }
    }
    let resultConn = new AcademicAsignatureCourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => AcademicAsignatureCourseConnection)
  async getAllAcademicAsignatureCourseTeacher(
    @Args() args: ConnectionArgs,
    @Arg('teacherId', () => String) teacherId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicAsignatureCourseConnection> {
    let result;
    result = await this.repository.findBy({
      where: {
        teacherId,
        schoolYearId,
        active: true,
      },
    });
    let resultConn = new AcademicAsignatureCourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicAsignatureCourse)
  async createAcademicAsignatureCourse(
    @Arg('data') data: NewAcademicAsignatureCourse,
    @Ctx() context: IContext,
  ): Promise<AcademicAsignatureCourse> {
    let dataProcess: NewAcademicAsignatureCourse = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicAsignatureCourse)
  async updateAcademicAsignatureCourse(
    @Arg('data') data: NewAcademicAsignatureCourse,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicAsignatureCourse | null> {
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
  async changeActiveAcademicAsignatureCourse(
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
  async importAcademicAsignatureSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldGradeAssignmentId', () => String) oldGradeAssignmentId: String,
    @Arg('newGradeAssignmentId', () => String) newGradeAssignmentId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, gradeAssignmentId: oldGradeAssignmentId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let courseNew: any;
      let courseOld = await this.repositoryCourse.findOneBy(result?.courseId);
      if (courseOld) {
        courseNew = await this.repositoryCourse.findBy({
          where: { entityBaseId: result?.courseId, schoolYearId: newSchoolYearId },
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
        hourlyIntensity: result.hourlyIntensity,
        academicAsignatureId:
          academicAsignatureNew?.length > 0 ? academicAsignatureNew[0]?.id?.toString() : null,
        courseId: courseNew?.length > 0 ? courseNew[0]?.id?.toString() : null,
        weight: result.weight,
        gradeAssignmentId: newGradeAssignmentId.toString(),
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
  async fixAllAcademicAsignatureCourseSchoolAndSchoolYear() {
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
          if (result?.courseId) {
            let course = await this.repositoryCourse.findOneBy(result?.courseId);
            if (course && course?.schoolId && course?.schoolYearId) {
              console.log('school 1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: course?.schoolId,
                schoolYearId: course?.schoolYearId,
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
  async deleteAcademicAsignatureCourse(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Query(() => [ExperienceLearning], { nullable: true })
  async getAllExperienceLearningAcademicPeriodEvaluativeComponentAcademicAsignatureCourse(
    @Arg('id', () => String) id: string,
    @Arg('academicPeriodId', () => String) academicPeriodId: string,
    @Arg('evaluativeComponentId', () => String) evaluativeComponentId: string,
    @Arg('experienceLearningType', () => ExperienceLearningType)
    experienceLearningType: ExperienceLearningType,
  ) {
    const result = await this.repositoryExperienceLearning.findBy({
      where: {
        academicAsignatureCourseId: id,
        academicPeriodId,
        evaluativeComponentsId: { $in: [evaluativeComponentId] },
        experienceLearningType,
        active: true,
      },
      order: { createdAt: 'ASC' },
    });
    return result;
  }

  @Mutation(() => AcademicAsignatureCourse)
  async updateAcademicAsignatureCourseHourltIntensity(
    @Arg('data') data: NewAcademicAsignatureCourse,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicAsignatureCourse | null> {
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
    let min = null;
    let max = null;
    const gradeAssignment = await this.repositoryGradeAssignment.findOneBy(
      result?.gradeAssignmentId,
    );
    const academicAsignatureCourses = await this.repository.findBy({
      where: {
        gradeAssignmentId: result?.gradeAssignmentId,
        active: true,
      },
    });
    if (academicAsignatureCourses && gradeAssignment) {
      for (let academicAsignatureCourse of academicAsignatureCourses) {
        if (academicAsignatureCourse?.hourlyIntensity) {
          if (min == null && academicAsignatureCourse?.hourlyIntensity) {
            min = academicAsignatureCourse?.hourlyIntensity;
          }
          if (min != null && academicAsignatureCourse?.hourlyIntensity < min) {
            min = academicAsignatureCourse?.hourlyIntensity;
          }
          if (max == null && academicAsignatureCourse?.hourlyIntensity) {
            max = academicAsignatureCourse?.hourlyIntensity;
          }
          if (max != null && academicAsignatureCourse?.hourlyIntensity > max) {
            max = academicAsignatureCourse?.hourlyIntensity;
          }
        }
      }
    }
    let resultGradeAssignment = await this.repositoryGradeAssignment.save({
      _id: new ObjectId(gradeAssignment?.id?.toString()),
      ...gradeAssignment,
      minHourlyIntensity: min ? min : 0,
      maxHourlyIntensity: max ? max : 0,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    return result;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicAsignatureCourse) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicAsignatureCourse) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicAsignatureCourse) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignature, { nullable: true })
  async academicAsignature(@Root() data: AcademicAsignatureCourse) {
    let id = data.academicAsignatureId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignature.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Course, { nullable: true })
  async course(@Root() data: AcademicAsignatureCourse) {
    let id = data.courseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Teacher, { nullable: true })
  async teacher(@Root() data: AcademicAsignatureCourse) {
    let id = data.teacherId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryTeacher.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GradeAssignment, { nullable: true })
  async gradeAssignment(@Root() data: AcademicAsignatureCourse) {
    let id = data.gradeAssignmentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGradeAssignment.findOneBy(id);
      return result;
    }
    return null;
  }

  @Mutation(() => Boolean)
  async fixAcademicAsignatureCourseTeacherV2(
    @Arg('teacherId', () => String) teacherId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<Boolean | null> {
    let result;
    result = await this.repository.findBy({
      where: {
        teacherId,
        schoolYearId,
        active: true,
      },
    });
    for (let dataAcademic of result) {
      let course = await this.repositoryCourse.findOneBy(dataAcademic?.courseId?.toString());
      if (course == null) {
        console.log('inactivando');
        let resultUpdate = await this.repository.save({
          _id: new ObjectId(dataAcademic?.id?.toString()),
          ...dataAcademic,
          version: (dataAcademic?.version as number) + 1,
          active: false,
        });
      }
    }
    return true;
  }
}
