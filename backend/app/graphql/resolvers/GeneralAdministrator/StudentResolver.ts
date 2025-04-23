import bcrypt from 'bcrypt';
import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicGradeRepository,
  AverageAcademicYearStudentRepository,
  CampusRepository,
  CourseRepository,
  EstudiantesRepository,
  GeneralAcademicGradeRepository,
  SchoolRepository,
  SchoolYearRepository,
  StudentRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewStudent } from '../../inputs/GeneralAdministrator/NewStudent';
import { NewUser } from '../../inputs/GeneralAdministrator/NewUser';
import { IContext } from '../../interfaces/IContext';
import { AverageAcademicYearStudent } from '../../models/CampusAdministrator/AverageAcademicYearStudent';
import { Course } from '../../models/CampusAdministrator/Course';
import { Estudiantes } from '../../models/Data/Estudiantes';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { GeneralAcademicGrade } from '../../models/GeneralAdministrator/GeneralAcademicGrade';
import { School } from '../../models/GeneralAdministrator/School';
import { Student, StudentConnection } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { CourseResolver } from '../CampusAdministrator/CourseResolver';

const BCRYPT_SALT_ROUNDS = 12;

@Resolver(Student)
export class StudentResolver {
  @InjectRepository(Student)
  private repository = StudentRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(Estudiantes)
  private repositoryEstudiantes = EstudiantesRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(AverageAcademicYearStudent)
  private repositoryAverageAcademicYearStudent = AverageAcademicYearStudentRepository;

  @InjectRepository(GeneralAcademicGrade)
  private repositoryGeneralAcademicGrade = GeneralAcademicGradeRepository;

  private courseResolver = new CourseResolver();

  @Query(() => Student, { nullable: true })
  async getStudent(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => StudentConnection)
  async getAllStudent(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String, { nullable: true }) schoolId: String,
    @Arg('campusId', () => String, { nullable: true }) campusId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<StudentConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (campusId) {
          result = await this.repository.findBy({
            where: { schoolId, campusId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (campusId) {
          result = await this.repository.findBy({
            where: { schoolId, campusId, schoolYearId },
          });
        } else {
          result = await this.repository.findBy({ where: { schoolId, schoolYearId } });
        }
      }
    } else {
      if (orderCreated) {
        if (campusId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              campusId,
              schoolYearId,
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
        if (campusId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              campusId,
              schoolYearId,
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
    let resultConn = new StudentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => StudentConnection)
  async getAllStudentAcademicGradeIdWithoutCourse(
    @Args() args: ConnectionArgs,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('campusId', () => String) campusId: String,
    @Arg('academicGradeId', () => String) academicGradeId: String,
  ): Promise<StudentConnection> {
    let result;
    result = await this.repository.findBy({
      where: {
        schoolId,
        campusId,
        academicGradeId,
        courseId: null,
        active: true,
      },
      order: { createdAt: 'DESC' },
    });
    let resultConn = new StudentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => StudentConnection)
  async getAllStudentAcademicGrade(
    @Args() args: ConnectionArgs,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('campusId', () => String, { nullable: true }) campusId: String,
    @Arg('academicGradeId', () => String) academicGradeId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<StudentConnection> {
    let result;
    if (campusId) {
      result = await this.repository.findBy({
        where: {
          schoolId,
          campusId,
          academicGradeId,
          schoolYearId,
          active: true,
        },
        order: { createdAt: 'DESC' },
      });
    } else {
      result = await this.repository.findBy({
        where: {
          schoolId,
          academicGradeId,
          schoolYearId,
          active: true,
        },
        order: { createdAt: 'DESC' },
      });
    }
    let resultConn = new StudentConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Student)
  async createStudent(@Arg('data') data: NewStudent, @Ctx() context: IContext): Promise<Student> {
    let dataProcess: NewStudent = removeEmptyStringElements(data);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess.newUser);
    let createdByUserId = context?.user?.authorization?.id;
    delete dataProcess.newUser;
    let user = await this.repositoryUser.findBy({ documentNumber: dataUserProcess.documentNumber });
    if (user.length > 0) {
      let teacher = await this.repository.findBy({
        userId: user[0]?.id?.toString(),
        schoolYearId: dataProcess.schoolYearId,
      });
      if (teacher.length == 0) {
        const model = await this.repository.create({
          ...dataProcess,
          userId: user[0].id.toString(),
          active: true,
          version: 0,
          createdByUserId,
        });
        let result = await this.repository.save(model);
        return result;
      }
      return new Student();
    } else {
      if (dataUserProcess.documentNumber != null) {
        let passwordHash = await bcrypt
          .hash(dataUserProcess.documentNumber, BCRYPT_SALT_ROUNDS)
          .then(function (hashedPassword: any) {
            return hashedPassword;
          });
        dataUserProcess.password = passwordHash;
      }
      const modelUser = await this.repositoryUser.create({
        ...dataUserProcess,
        username: dataUserProcess.documentNumber,
        active: true,
        version: 0,
        createdByUserId,
      });
      let resultUser = await this.repositoryUser.save(modelUser);
      const model = await this.repository.create({
        ...dataProcess,
        userId: resultUser.id.toString(),
        active: true,
        version: 0,
        createdByUserId,
      });
      let result = await this.repository.save(model);
      return result;
    }
  }

  @Mutation(() => Boolean)
  public async createAllInitialsStudents(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
  ) {
    let school = await this.repositorySchool.findOneBy(schoolId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    //let schools = await this.repositorySchool.findBy({ where: { daneCode: "254810000696" } });
    let count = 0;
    //for (let school of schools) {
    if (school && schoolYear) {
      let data = await this.repositoryEstudiantes.findBy({
        where: { dane: school.daneCode },
      });
      console.log('Step: SIMAT - Update Students - Count', data?.length);
      for (let estudiante of data) {
        if (
          estudiante.jornada &&
          estudiante.consecutivo &&
          estudiante.dane &&
          estudiante.grado_cod &&
          estudiante.grupo
        ) {
          if (
            estudiante.jornada.length > 1 &&
            estudiante.consecutivo.length > 1 &&
            estudiante.dane.length > 1 &&
            estudiante.grado_cod.length > 0 &&
            estudiante.grupo.length > 0
          ) {
            let user = await this.repositoryUser.findBy({ username: estudiante.doc });
            //if (user.length === 0) {
            let campus = await this.repositoryCampus.findBy({
              where: { consecutive: estudiante.consecutivo },
            });
            if (campus.length === 1) {
              let course = await this.repositoryCourse.findBy({
                jornadaSIMAT: estudiante.jornada,
                gradoCodSIMAT: estudiante.grado_cod,
                grupoSIMAT: estudiante.grupo,
                campusId: campus[0].id.toString(),
                active: true,
                schoolId: school.id.toString(),
                schoolYearId: schoolYear?.id?.toString(),
              });
              let academicGradeId = undefined;
              let courseId = undefined;
              if (course.length === 1) {
                academicGradeId = course[0].academicGradeId;
                courseId = course[0].id.toString();
              }
              let documentTypeId = '';
              switch (estudiante.tipodoc) {
                case 'RC:REGISTRO CIVIL DE NACIMIENTO':
                  documentTypeId = '629eb3e109a7e271df669986';
                  break;
                case 'NES:NÚMERO ESTABLECIDO POR LA SECRETARÍA':
                  documentTypeId = '629eb3f909a7e271df669987';
                  break;
                case 'TI:TARJETA DE IDENTIDAD':
                  documentTypeId = '61d5624837ab8e89c425f48a';
                  break;
                case 'CC:CÉDULA DE CIUDADANÍA':
                  documentTypeId = '60cfc792445f133f9e261eae';
                  break;
                case 'CE:CÉDULA DE EXTRANJERÍA':
                  documentTypeId = '629eb40a09a7e271df669988';
                  break;
                case 'NUIP:NÚMERO UNICO DE IDENTIFICACIÓN PERSONAL':
                  documentTypeId = '629eb42a09a7e271df669989';
                  break;
                case 'PEP:PERMISO ESPECIAL DE PERMANENCIA':
                  documentTypeId = '629eb51e09a7e271df66998e';
                  break;
                case 'PPT: PERMISO DE PROTECCIÃ¿N TEMPORAL':
                  documentTypeId = '629eb44109a7e271df66998a';
                  break;
                case 'TMF: TARJETA DE MOVILIDAD FRONTERIZA':
                  documentTypeId = '629eb45209a7e271df66998b';
                  break;
                case 'NIP:NÚMERO DE IDENTIFICACIÓN PERSONAL':
                  documentTypeId = '629eb46609a7e271df66998c';
                  break;
                case 'VISA':
                  documentTypeId = '629eb47009a7e271df66998d';
                  break;
              }
              let passwordHash = await bcrypt
                .hash(estudiante.doc ? estudiante.doc : 'VIVE2022', BCRYPT_SALT_ROUNDS)
                .then(function (hashedPassword: any) {
                  return hashedPassword;
                });
              let fechaNacimiento = estudiante.fecha_nacimiento?.split('/');
              let name = (estudiante.nombre1 ? estudiante.nombre1 : '') + ' ';
              name += estudiante.nombre2 ? estudiante.nombre2 : '';
              let lastName = (estudiante.apellido1 ? estudiante.apellido1 : '') + ' ';
              lastName += estudiante.apellido2 ? estudiante.apellido2 : '';
              //console.log(name, lastName)
              const modelUser = await this.repositoryUser.create({
                name,
                lastName,
                username: estudiante.doc,
                password: passwordHash,
                documentTypeId,
                documentNumber: estudiante.doc,
                genderId:
                  estudiante.genero == 'FEMENINO'
                    ? '60cfc51e445f133f9e261ead'
                    : '60ecc36d6c716a21bee51e00',
                birthdate: fechaNacimiento
                  ? new Date(
                      Number(fechaNacimiento[2]),
                      Number(fechaNacimiento[1]) - 1,
                      Number(fechaNacimiento[0]),
                    )
                  : undefined,
                roleId: '619551d1882a2fb6525a3078',
                schoolId: school.id.toString(),
                active: true,
                version: 0,
              });
              let resultUser = null;
              if (user.length > 0) {
                resultUser = await this.repositoryUser.save({
                  _id: new ObjectId(user[0]?.id?.toString()),
                  ...user[0],
                  ...modelUser,
                  version: (user[0]?.version as number) + 1,
                });
              } else {
                resultUser = await this.repositoryUser.save(modelUser);
              }
              let student = await this.repository.findBy({
                userId: resultUser.id.toString(),
                schoolId: { $in: [school.id.toString()] },
                schoolYearId: schoolYear?.id?.toString(),
              });
              const model = await this.repository.create({
                schoolId: [school.id.toString()],
                campusId: [campus[0].id.toString()],
                academicGradeId,
                courseId,
                userId: resultUser.id.toString(),
                active: true,
                version: 0,
                schoolYearId: schoolYear?.id?.toString(),
              });
              let result = null;
              if (student.length > 0) {
                result = await this.repository.save({
                  _id: new ObjectId(student[0]?.id?.toString()),
                  ...student[0],
                  ...model,
                  version: (user[0]?.version as number) + 1,
                });
              } else {
                result = await this.repository.save(model);
              }
              if (courseId != null && courseId != undefined) {
                let course = await this.repositoryCourse.findOneBy(courseId);
                let studentsId = course?.studentsId;
                if (studentsId == undefined || studentsId == null) {
                  studentsId = [];
                }
                studentsId?.push(result?.id?.toString());
                let resultCourse = await this.repositoryCourse.save({
                  _id: new ObjectId(courseId),
                  ...course,
                  studentsId,
                  version: (result?.version as number) + 1,
                });
                this.courseResolver.updateCodeStudentsCourse(courseId + '');
              }
              count += 1;
              const model2 = await this.repositoryEstudiantes.create({
                ...estudiante,
                procesado: true,
              });
              let result2 = await this.repositoryEstudiantes.save(model2);
              //console.log(count);
            }
            //} else {
            // const model = await this.repositoryEstudiantes.create({
            //   ...estudiante,
            //   procesado: true,
            // });
            //console.log(model);
            // let result = await this.repositoryEstudiantes.save(model);
            //}
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  public async updateAllIStudentsName() {
    let schools = await this.repositorySchool.find();
    let count = 0;
    for (let school of schools) {
      if (school?.daneCode == '154680000015') {
        let data = await this.repositoryEstudiantes.findBy({
          where: { dane: school.daneCode, procesado: null },
        });
        for (let estudiante of data) {
          if (
            estudiante.jornada &&
            estudiante.consecutivo &&
            estudiante.dane &&
            estudiante.grado_cod &&
            estudiante.grupo
          ) {
            if (
              estudiante.jornada.length > 1 &&
              estudiante.consecutivo.length > 1 &&
              estudiante.dane.length > 1 &&
              estudiante.grado_cod.length > 0 &&
              estudiante.grupo.length > 0
            ) {
              let user = await this.repositoryUser.findBy({ username: estudiante.doc });
              if (user.length == 1) {
                let name = (estudiante.nombre1 ? estudiante.nombre1 : '') + ' ';
                name += estudiante.nombre2 ? estudiante.nombre2 : '';
                let lastName = (estudiante.apellido1 ? estudiante.apellido1 : '') + ' ';
                lastName += estudiante.apellido2 ? estudiante.apellido2 : '';
                console.log(name, lastName);
                let resultUser = await this.repositoryUser.save({
                  _id: new ObjectId(user[0]?.id?.toString()),
                  ...user[0],
                  name,
                  lastName,
                  version: (user[0]?.version as number) + 1,
                });
                const model = await this.repositoryEstudiantes.create({
                  ...estudiante,
                  procesado: true,
                });
                // console.log(model);
                let result = await this.repositoryEstudiantes.save(model);
              }
            }
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Student)
  async updateStudent(
    @Arg('data') data: NewStudent,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Student | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess?.newUser);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      ...dataUserProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    delete dataProcess?.newUser;
    console.log(data);
    let courseId = null;
    if (data.courseId) {
      if (data.courseId != result?.courseId) {
        courseId = data?.courseId;
        let course = await this.repositoryCourse.findOneBy(data.courseId);
        dataProcess.campusId = [course?.campusId];
        let studentsId = course?.studentsId;
        if (studentsId == undefined || studentsId == null) {
          studentsId = [];
        }
        studentsId?.push(id);
        let resultCourse = await this.repositoryCourse.save({
          _id: new ObjectId(data.courseId),
          ...course,
          studentsId,
          version: (result?.version as number) + 1,
        });
      }
    } else {
      if (result?.courseId) {
        let course = await this.repositoryCourse.findOneBy(result?.courseId);
        if (course && course != undefined) {
          courseId = result?.courseId;
          let studentsId = course?.studentsId;
          if (studentsId == undefined || studentsId == null) {
            studentsId = [];
          }
          studentsId = studentsId?.filter((student) => {
            return student !== id;
          });
          let resultCourse = await this.repositoryCourse.save({
            _id: new ObjectId(data.courseId),
            ...course,
            studentsId,
            version: (result?.version as number) + 1,
          });
        }
      }
    }
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    await this.courseResolver.updateCodeStudentsCourse(courseId + '');
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveStudent(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
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
  async importStudentSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
    @Arg('studentPromoted', () => Boolean) studentPromoted: boolean,
    @Arg('studentNoPromoted', () => Boolean) studentNoPromoted: boolean,
  ) {
    let dataAcademicGradeGeneral = await this.repositoryGeneralAcademicGrade.findBy({
      where: { active: true },
    });
    for (let academicGradeGeneral of dataAcademicGradeGeneral) {
      //console.log('academicGradeGeneral', academicGradeGeneral);
      let academicGradeNext: any[] = [];
      let academicGradePrevious: any[] = [];
      let academicGradeCurrent: any[] = [];
      if (academicGradeGeneral?.nextGeneralAcademicGradeId) {
        academicGradeNext = await this.repositoryAcademicGrade.findBy({
          where: {
            generalAcademicGradeId: academicGradeGeneral?.nextGeneralAcademicGradeId,
            schoolYearId: newSchoolYearId,
          },
        });
      }
      if (academicGradeGeneral?.previousGeneralAcademicGradeId) {
        academicGradePrevious = await this.repositoryAcademicGrade.findBy({
          where: {
            generalAcademicGradeId: academicGradeGeneral?.id?.toString(),
            schoolYearId: oldSchoolYearId,
          },
        });
      }
      if (academicGradeGeneral?.previousGeneralAcademicGradeId) {
        academicGradeCurrent = await this.repositoryAcademicGrade.findBy({
          where: {
            generalAcademicGradeId: academicGradeGeneral?.id?.toString(),
            schoolYearId: newSchoolYearId,
          },
        });
      }
      //console.log('academicGradeNext', academicGradeNext);
      //console.log('academicGradePrevious', academicGradePrevious);
      //console.log('academicGradeCurrent', academicGradeCurrent);
      if (
        academicGradeNext?.length > 0 &&
        academicGradePrevious?.length > 0 &&
        academicGradeCurrent?.length > 0
      ) {
        let results = await this.repository.findBy({
          where: {
            schoolId,
            schoolYearId: oldSchoolYearId,
            academicGradeId: academicGradePrevious[0]?.id?.toString(),
          },
        });
        //console.log('schoolId', schoolId);
        //console.log('schoolYearId', oldSchoolYearId);
        //console.log('academicGradeId', academicGradePrevious[0]?.id?.toString());
        //console.log('IMPORT', results?.length);
        //results = [results[0]];
        //console.log('results', results);
        for (let result of results) {
          let modelEntityBase = await this.repository.findBy({
            where: {
              entityBaseId: result?.id?.toString(),
              schoolYearId: newSchoolYearId.toString(),
            },
          });
          if (modelEntityBase?.length < 1) {
            let averageAcademicYearStudent = await this.repositoryAverageAcademicYearStudent.findBy(
              {
                where: { studentId: result?.id?.toString(), schoolYearId: oldSchoolYearId },
              },
            );
            //console.log('averageAcademicYearStudent', averageAcademicYearStudent);
            if (averageAcademicYearStudent?.length > 0) {
              if (studentPromoted && averageAcademicYearStudent[0]?.promoted == true) {
                const model = await this.repository.create({
                  userId: result.userId,
                  campusId: result.campusId,
                  schoolId: result.schoolId,
                  academicGradeId: academicGradeNext[0]?.id?.toString(),
                  createdByUserId: result.createdByUserId,
                  updatedByUserId: result.updatedByUserId,
                  active: result?.active,
                  version: 0,
                  schoolYearId: newSchoolYearId.toString(),
                  entityBaseId: result?.id?.toString(),
                });
                //console.log('PROMOTED', model);
                let resultSave = await this.repository.save(model);
              }
              if (studentNoPromoted && averageAcademicYearStudent[0]?.promoted == false) {
                const model = await this.repository.create({
                  userId: result.userId,
                  campusId: result.campusId,
                  schoolId: result.schoolId,
                  academicGradeId: academicGradeCurrent[0]?.id?.toString(),
                  createdByUserId: result.createdByUserId,
                  updatedByUserId: result.updatedByUserId,
                  active: result?.active,
                  version: 0,
                  schoolYearId: newSchoolYearId.toString(),
                  entityBaseId: result?.id?.toString(),
                });
                //console.log('NO PROMOTED', model);
                let resultSave = await this.repository.save(model);
              }
            } else {
              const model = await this.repository.create({
                userId: result.userId,
                campusId: result.campusId,
                schoolId: result.schoolId,
                academicGradeId: academicGradeNext[0]?.id?.toString(),
                createdByUserId: result.createdByUserId,
                updatedByUserId: result.updatedByUserId,
                active: result?.active,
                version: 0,
                schoolYearId: newSchoolYearId.toString(),
                entityBaseId: result?.id?.toString(),
              });
              //console.log('PROMOTED', model);
              let resultSave = await this.repository.save(model);
            }
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllSudentSchoolAndSchoolYear() {
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
            schoolId: [schoolYear?.schoolId + ''],
            version: (result?.version as number) + 1,
          });
        }
      } else {
        if (result?.schoolId || result?.campusId) {
          let schoolId;
          if (result?.schoolId) {
            let school = await this.repositorySchool.findOneBy(result?.schoolId[0]);
            if (school) {
              schoolId = school?.id?.toString();
            }
          } else {
            if (result?.campusId) {
              let campus = await this.repositoryCampus.findOneBy(result?.campusId[0]);
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
                schoolId: [schoolYears[0]?.schoolId + ''],
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
  async deleteStudent(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Student) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Student) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: Student) {
    let ids = data.schoolId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositorySchool.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Campus], { nullable: true })
  async campus(@Root() data: Student) {
    let ids = data.campusId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryCampus.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async user(@Root() data: Student) {
    let id = data.userId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicGrade, { nullable: true })
  async academicGrade(@Root() data: Student) {
    let id = data.academicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Course, { nullable: true })
  async course(@Root() data: Student) {
    let id = data.courseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCourse.findOneBy(id);
      return result;
    }
    return null;
  }
}
