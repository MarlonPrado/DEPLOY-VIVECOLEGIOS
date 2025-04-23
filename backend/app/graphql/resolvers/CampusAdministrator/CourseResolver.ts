import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicAsignatureCourseRepository,
  AcademicDayRepository,
  AcademicGradeRepository,
  CampusRepository,
  CourseRepository,
  CursosRepository,
  SchoolRepository,
  SchoolYearRepository,
  StudentRepository,
  TeacherRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewCourse } from '../../inputs/CampusAdministrator/NewCourse';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { Course, CourseConnection } from '../../models/CampusAdministrator/Course';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { Cursos } from './../../models/Data/Cursos';
import { AcademicAsignatureCourseResolver } from './AcademicAsignatureCourseResolver';

@Resolver(Course)
export class CourseResolver {
  @InjectRepository(Course)
  private repository = CourseRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @InjectRepository(Teacher)
  private repositoryTeacher = TeacherRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Cursos)
  private repositoryCursos = CursosRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  private academicAsignatureCourseResolver = new AcademicAsignatureCourseResolver();

  @Query(() => Course, { nullable: true })
  async getCourse(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => CourseConnection)
  async getAllCourse(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('campusId', () => String) campusId: String,
    @Arg('schoolId', () => String, { nullable: true }) schoolId: String,
    @Arg('academicGradeId', () => String, { nullable: true }) academicGradeId: String,
  ): Promise<CourseConnection> {
    let result;
    let campusDataIds: any[] = [];
    if (schoolId) {
      let campusData = [];
      if (allData) {
        campusData = await this.repositoryCampus.findBy({ schoolId });
      } else {
        campusData = await this.repositoryCampus.findBy({ schoolId, active: true });
      }
      campusData.forEach((campus: any) => {
        campusDataIds.push(campus.id.toString());
      });
    } else {
      campusDataIds.push(campusId);
    }
    if (allData) {
      if (orderCreated) {
        if (academicGradeId) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              academicGradeId,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicGradeId) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              academicGradeId,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicGradeId) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              academicGradeId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicGradeId) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              academicGradeId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: campusDataIds },
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new CourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => CourseConnection)
  async getAllCourseTeacher(
    @Args() args: ConnectionArgs,
    @Arg('teacherId', () => String) teacherId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<CourseConnection> {
    let result = await this.repository.findBy({
      where: {
        teacherId,
        schoolYearId,
        active: true,
      },
      order: { createdAt: 'DESC' },
    });
    let resultConn = new CourseConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Course)
  async createCourse(@Arg('data') data: NewCourse, @Ctx() context: IContext): Promise<Course> {
    let dataProcess: NewCourse = removeEmptyStringElements(data);
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
  public async updateGradeAcademicDayAllInitialsCourse(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
  ) {
    let school = await this.repositorySchool.findOneBy(schoolId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    //let schools = await this.repositorySchool.findBy({ where: { daneCode: "254810000696" } });
    let count = 0;
    //for (let school of schools) {
    if (school && schoolYear) {
      let campus = await this.repositoryCampus.findBy({
        where: { schoolId: school.id.toString() },
      });
      for (let campu of campus) {
        let courses = await this.repository.findBy({
          where: {
            academicDayId: undefined,
            campusId: campu.id.toString(),
            schoolId: school.id.toString(),
            schoolYearId: schoolYear?.id?.toString(),
          },
        });
        for (let course of courses) {
          let academicDay = await this.repositoryAcademicDay.findBy({
            where: {
              campusId: campu.id.toString(),
              nameSIMAT: course.jornadaSIMAT,
              active: true,
              schoolId: school.id.toString(),
              schoolYearId: schoolYear?.id?.toString(),
            },
          });
          if (academicDay.length === 1) {
            const result = await this.repository.save({
              _id: new ObjectId(course.id.toString()),
              ...course,
              academicDayId: academicDay[0].id.toString(),
              version: (course?.version as number) + 1,
            });
            count += 1;
            //console.log(count);
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  public async updateGradeAllInitialsCourse(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
  ) {
    let school = await this.repositorySchool.findOneBy(schoolId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    //let schools = await this.repositorySchool.findBy({ where: { daneCode: "254810000696" } });
    let count = 0;
    // for (let school of schools) {
    if (school && schoolYear) {
      let campus = await this.repositoryCampus.findBy({
        where: { schoolId: school.id.toString() },
      });
      for (let campu of campus) {
        let courses = await this.repository.findBy({
          where: {
            academicGradeId: undefined,
            campusId: campu.id.toString(),
            active: true,
            schoolId: school.id.toString(),
            schoolYearId: schoolYear?.id?.toString(),
          },
        });
        for (let course of courses) {
          let generalAcademicGradeId = '';
          switch (course.gradoCodSIMAT) {
            case '0':
              generalAcademicGradeId = '627deedcb3635b55532fbd00';
              break;
            case '1':
              generalAcademicGradeId = '6256093f78f3395f6ca958eb';
              break;
            case '2':
              generalAcademicGradeId = '62560c9078f3395f6ca958f4';
              break;
            case '3':
              generalAcademicGradeId = '62560c9678f3395f6ca958f5';
              break;
            case '4':
              generalAcademicGradeId = '62560c9b78f3395f6ca958f6';
              break;
            case '5':
              generalAcademicGradeId = '62560ca278f3395f6ca958f7';
              break;
            case '6':
              generalAcademicGradeId = '627dee7eb3635b55532fbcfa';
              break;
            case '7':
              generalAcademicGradeId = '627dee88b3635b55532fbcfb';
              break;
            case '8':
              generalAcademicGradeId = '627dee90b3635b55532fbcfc';
              break;
            case '9':
              generalAcademicGradeId = '627dee97b3635b55532fbcfd';
              break;
            case '10':
              generalAcademicGradeId = '627deeb4b3635b55532fbcfe';
              break;
            case '11':
              generalAcademicGradeId = '627deebcb3635b55532fbcff';
              break;
          }
          let academicGrade = await this.repositoryAcademicGrade.findBy({
            where: {
              schoolId: school.id.toString(),
              generalAcademicGradeId,
              active: true,
              schoolYearId: schoolYear?.id?.toString(),
            },
          });
          if (academicGrade.length === 1) {
            const result = await this.repository.save({
              _id: new ObjectId(course.id.toString()),
              ...course,
              academicGradeId: academicGrade[0].id.toString(),
              version: (course?.version as number) + 1,
            });
            count += 1;
            //console.log(count);
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  public async createAllInitialsCourse(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
  ) {
    let school = await this.repositorySchool.findOneBy(schoolId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    //let schools = await this.repositorySchool.findBy({ where: { daneCode: "254810000696" } });
    let count = 0;
    //for (let school of schools) {
    if (school && schoolYear) {
      let data = await this.repositoryCursos.findBy({
        where: { dane: school.daneCode },
      });
      for (let curso of data) {
        if (curso.jornada && curso.consecutivo && curso.dane && curso.grado_cod && curso.grupo) {
          if (
            curso.jornada.length > 1 &&
            curso.consecutivo.length > 1 &&
            curso.dane.length > 1 &&
            curso.grado_cod.length > 0 &&
            curso.grupo.length > 0
          ) {
            let campus = await this.repositoryCampus.findBy({
              where: { consecutive: curso.consecutivo },
            });
            // let academicDay = await this.repository.findBy({
            //   where: { campusId: campus[0].id.toString(), nameSIMAT: curso.jornada },
            // });
            //if (campus.length === 1 && academicDay.length === 1) {
            if (campus.length === 1) {
              let course = await this.repository.findBy({
                where: {
                  campusId: campus[0].id.toString(),
                  //academicDayId: academicDay[0].id.toString(),
                  grupoSIMAT: curso.grupo,
                  gradoCodSIMAT: curso.grado_cod,
                  jornadaSIMAT: curso.jornada,
                  schoolYearId: schoolYear?.id?.toString(),
                },
              });
              if (course.length === 0) {
                const model = await this.repository.create({
                  name: curso.grupo,
                  grupoSIMAT: curso.grupo,
                  gradoCodSIMAT: curso.grado_cod,
                  jornadaSIMAT: curso.jornada,
                  campusId: campus[0].id.toString(),
                  schoolId: school.id.toString(),
                  schoolYearId: schoolYear?.id?.toString(),
                  active: true,
                  version: 0,
                });
                let result = await this.repository.save(model);
                // console.log(model);
                count += 1;
                // console.log(count);
              } else {
                let result = await this.repository.save({
                  _id: new ObjectId(course[0].id.toString()),
                  ...course[0],
                  schoolId: school.id.toString(),
                  active: true,
                  version: (course[0]?.version as number) + 1,
                });
                // console.log("aca pasa aglo")
              }
            }
          }
        }
      }
    }
    //}
    return true;
  }

  @Mutation(() => Boolean)
  public async updateStudentsAllInitialsCourse() {
    let schools = await this.repositorySchool.find();
    let count = 0;
    for (let school of schools) {
      let campus = await this.repositoryCampus.findBy({
        where: { schoolId: school.id.toString() },
      });
      for (let campu of campus) {
        let courses = await this.repository.findBy({
          where: {
            campusId: campu.id.toString(),
          },
        });
        for (let course of courses) {
          let students = await this.repositoryStudent.findBy({
            where: {
              courseId: course.id.toString(),
            },
          });
          let studentsId = course?.studentsId;
          if (studentsId == undefined || studentsId == null) {
            studentsId = [];
          }
          for (let student of students) {
            studentsId?.push(student.id.toString());
          }
          let resultCourse = await this.repository.save({
            _id: new ObjectId(course.id.toString()),
            ...course,
            studentsId,
            version: (course?.version as number) + 1,
          });
          count += 1;
          //console.log(count);
        }
      }
    }
  }

  @Mutation(() => Boolean)
  public async updateCodeStudentsAllCourses() {
    let schools = await this.repositorySchool.find();
    let count = 0;
    for (let school of schools) {
      let campus = await this.repositoryCampus.findBy({
        where: { schoolId: school.id.toString() },
      });
      for (let campu of campus) {
        let courses = await this.repository.findBy({
          where: {
            campusId: campu.id.toString(),
          },
        });
        for (let course of courses) {
          this.updateCodeStudentsCourse(course.id.toString());
          count += 1;
          //console.log(count);
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  public async updateCodeStudentsCoursesAcademicGrade(@Arg('id', () => String) id: string) {
    let count = 0;
    let academicGrade = await this.repositoryAcademicGrade.findOneBy(id);
    if (academicGrade && academicGrade?.schoolId) {
      console.log(academicGrade);
      let campus = await this.repositoryCampus.findBy({
        where: { schoolId: academicGrade?.schoolId.toString() },
      });
      for (let campu of campus) {
        let courses = await this.repository.findBy({
          where: {
            academicGradeId: academicGrade?.id?.toString(),
            campusId: campu.id.toString(),
          },
        });
        for (let course of courses) {
          console.log(count);
          this.updateCodeStudentsCourse(course.id.toString());
          count += 1;
        }
      }
      return true;
    }
  }

  @Mutation(() => Boolean)
  async updateCodeStudentsCourse(@Arg('id', () => String) id: string): Promise<Boolean | null> {
    let course = await this.repository.findOneBy(id);
    if (course) {
      console.log(course);
      if (course.studentsId && course.studentsId.length > 0) {
        let studentsAux = course.studentsId;
        let studentsIds = [];
        for (let studentId of studentsAux) {
          studentsIds?.push(new ObjectId(studentId.toString()));
        }
        let students = await this.repositoryStudent.findBy({
          where: { _id: { $in: studentsIds } },
        });
        let usersId = [];
        let studentsId = [];
        for (let student of students) {
          if (student?.courseId == course?.id?.toString()) {
            usersId?.push(new ObjectId(student.userId));
            studentsId?.push(student?.id?.toString());
          }
        }
        // console.log("dataAux", studentsAux?.length);
        // console.log("data", studentsId?.length);
        let users = await this.repositoryUser.findBy({
          where: { _id: { $in: usersId }, active: true },
          order: { lastName: 'ASC' },
        });
        // for (let use1 of users) {
        //   console.log(use1?.lastName + " " + use1?.name);
        // }
        users = users.sort(function (a, b) {
          return new Intl.Collator('es').compare(
            '' + a?.lastName + ' ' + a?.name,
            '' + b?.lastName + ' ' + b?.name,
          );
        });
        // for (let use2 of users2) {
        //   console.log(use2?.lastName + " " + use2?.name);
        // }
        //console.log(users);
        if (users && users.length > 0) {
          let code = 1;
          for (let user of users) {
            let student = await this.repositoryStudent.findBy({
              where: {
                courseId: course.id.toString(),
                userId: user.id.toString(),
                active: true,
                schoolYearId: course?.schoolYearId,
              },
            });
            if (student && student.length === 1) {
              await this.repositoryStudent.save({
                _id: new ObjectId(student[0].id.toString()),
                ...student[0],
                code: code as number,
                version: (student[0]?.version as number) + 1,
              });
              code += 1;
              //  console.log("code", code);
              //console.log("student", student);
            } else {
              //console.log("student", student);
            }
          }
          await this.repository.save({
            _id: new ObjectId(id),
            ...course,
            studentsId: studentsId,
            version: (course?.version as number) + 1,
          });
        }
      } else {
        let students = await this.repositoryStudent.findBy({
          where: { courseId: id, active: true, schoolYearId: course?.schoolYearId },
        });
        let usersId = [];
        let studentsId = [];
        for (let student of students) {
          usersId?.push(new ObjectId(student.userId));
          studentsId?.push(student.id?.toString());
        }
        let users = await this.repositoryUser.findBy({
          where: { _id: { $in: usersId }, active: true },
          order: { lastName: 'ASC' },
        });
        if (users && users.length > 0) {
          let code = 1;
          for (let user of users) {
            let student = await this.repositoryStudent.findBy({
              where: {
                courseId: course.id.toString(),
                userId: user.id.toString(),
                active: true,
                schoolYearId: course?.schoolYearId,
              },
            });
            if (student && student.length === 1) {
              await this.repositoryStudent.save({
                _id: new ObjectId(student[0].id.toString()),
                ...student[0],
                code: code as number,
                version: (student[0]?.version as number) + 1,
              });
              code += 1;
            }
          }
          this.repository.save({
            _id: new ObjectId(id),
            ...course,
            studentsId: studentsId,
            version: (course?.version as number) + 1,
          });
        }
      }
    }
    return true;
  }

  @Mutation(() => Course)
  async updateCourse(
    @Arg('data') data: NewCourse,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Course | null> {
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
  async changeActiveCourse(
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
    if (!active) {
      const academicAsignatureCourses = await this.repositoryAcademicAsignatureCourse.findBy({
        where: { courseId: id },
      });
      for (let academicAsignatureCourse of academicAsignatureCourses) {
        await this.academicAsignatureCourseResolver.changeActiveAcademicAsignatureCourse(
          false,
          academicAsignatureCourse?.id?.toString(),
          context,
        );
      }
    }
    if (result.id) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async importCourseSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldAcademicGradeId', () => String) oldAcademicGradeId: String,
    @Arg('newAcademicGradeId', () => String) newAcademicGradeId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, academicGradeId: oldAcademicGradeId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let academicDayNew: any;
      let academicDayOld = await this.repositoryAcademicDay.findOneBy(result?.academicDayId);
      if (academicDayOld) {
        academicDayNew = await this.repositoryAcademicDay.findBy({
          where: { entityBaseId: result?.academicDayId, schoolYearId: newSchoolYearId },
        });
      }
      const model = await this.repository.create({
        academicGradeId: newAcademicGradeId?.toString(),
        academicDayId: academicDayNew?.length > 0 ? academicDayNew[0]?.id?.toString() : null,
        name: result.name,
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
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllCourseSchoolAndSchoolYear() {
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
  async fixImportCourseSchoolYearId(@Arg('schoolYearId', () => String) schoolYearId: String) {
    let results = await this.repository.findBy({
      where: { schoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let oldCourse = await this.repository.findOneBy(result?.entityBaseId);
      if (oldCourse) {
        let result2 = await this.repository.save({
          _id: new ObjectId(result?.id?.toString()),
          ...result,
          campusId: oldCourse.campusId,
          schoolId: oldCourse.schoolId,
        });
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteCourse(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Course) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Course) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: Course) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicGrade, { nullable: true })
  async academicGrade(@Root() data: Course) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicDay, { nullable: true })
  async academicDay(@Root() data: Course) {
    let id = data.academicDayId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicDay.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Student], { nullable: true })
  async students(@Root() data: Course) {
    let ids = data.studentsId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryStudent.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Teacher, { nullable: true })
  async teacher(@Root() data: Course) {
    let id = data.teacherId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryTeacher.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: Course) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: Course) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Number, { nullable: true })
  async countStudent(@Root() data: Course) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findBy({
        where: {
          courseId: data?.id?.toString(),
        },
      });
      return result?.length;
    }
    return 0;
  }
}
