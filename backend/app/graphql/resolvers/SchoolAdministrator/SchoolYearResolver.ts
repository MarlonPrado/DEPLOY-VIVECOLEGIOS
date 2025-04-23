import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicHourResolver } from './../CampusAdministrator/AcademicHourResolver';
import { CourseResolver } from './../CampusAdministrator/CourseResolver';

import {
  AcademicAreaRepository,
  AcademicAsignatureRepository,
  AcademicDayRepository,
  AcademicGradeRepository,
  AcademicPeriodRepository,
  EducationLevelRepository,
  EvaluativeComponentRepository,
  GradeAssignmentRepository,
  ModalityRepository,
  PerformanceLevelRepository,
  SchoolConfigurationRepository,
  SchoolRepository,
  SchoolYearRepository,
  StudentRepository,
  TeacherRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { EvaluativeComponentType } from '../../enums/EvaluativeComponentType';
import { PerformanceLevelCategory } from '../../enums/PerformanceLevelCategory';
import { PerformanceLevelCategoryGrade } from '../../enums/PerformanceLevelCategoryGrade';
import { PerformanceLevelType } from '../../enums/PerformanceLevelType';
import { NewSchoolYear } from '../../inputs/SchoolAdministrator/NewSchoolYear';
import { IContext } from '../../interfaces/IContext';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { School } from '../../models/GeneralAdministrator/School';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { EducationLevel } from '../../models/SchoolAdministrator/EducationLevel';
import { EvaluativeComponent } from '../../models/SchoolAdministrator/EvaluativeComponent';
import { GradeAssignment } from '../../models/SchoolAdministrator/GradeAssignment';
import { Modality } from '../../models/SchoolAdministrator/Modality';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolConfiguration } from '../../models/SchoolAdministrator/SchoolConfiguration';
import { SchoolYear, SchoolYearConnection } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { AcademicAsignatureCourseResolver } from '../CampusAdministrator/AcademicAsignatureCourseResolver';
import { AcademicDayResolver } from '../CampusAdministrator/AcademicDayResolver';
import { TeacherResolver } from '../CampusAdministrator/TeacherResolver';
import { StudentResolver } from '../GeneralAdministrator/StudentResolver';
import { AcademicAreaResolver } from './AcademicAreaResolver';
import { AcademicAsignatureResolver } from './AcademicAsignatureResolver';
import { AcademicGradeResolver } from './AcademicGradeResolver';
import { AcademicPeriodResolver } from './AcademicPeriodResolver';
import { EducationLevelResolver } from './EducationLevelResolver';
import { EvaluativeComponentResolver } from './EvaluativeComponentResolver';
import { GradeAssignmentResolver } from './GradeAssignmentResolver';
import { ModalityResolver } from './ModalityResolver';
import { PerformanceLevelResolver } from './PerformanceLevelResolver';
import { SchoolConfigurationResolver } from './SchoolConfigurationResolver';
import { SpecialtyResolver } from './SpecialtyResolver';

@Resolver(SchoolYear)
export class SchoolYearResolver {
  @InjectRepository(SchoolYear)
  private repository = SchoolYearRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(EducationLevel)
  private repositoryEducationLevel = EducationLevelRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @InjectRepository(EvaluativeComponent)
  private repositoryEvaluativeComponent = EvaluativeComponentRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @InjectRepository(Modality)
  private repositoryModality = ModalityRepository;

  @InjectRepository(GradeAssignment)
  private repositoryGradeAssignment = GradeAssignmentRepository;

  @InjectRepository(SchoolConfiguration)
  private repositorySchoolConfiguration = SchoolConfigurationRepository;

  @InjectRepository(Teacher)
  private repositoryTeacher = TeacherRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  private academicDayResolver = new AcademicDayResolver();

  private academicHourResolver = new AcademicHourResolver();

  private studentResolver = new StudentResolver();

  private academicPeriodResolver = new AcademicPeriodResolver();

  private educationLevelResolver = new EducationLevelResolver();

  private performanceLevelResolver = new PerformanceLevelResolver();

  private evaluativeComponentResolver = new EvaluativeComponentResolver();

  private modalityResolver = new ModalityResolver();

  private specialtyResolver = new SpecialtyResolver();

  private academicAreaResolver = new AcademicAreaResolver();

  private academicAsignatureResolver = new AcademicAsignatureResolver();

  private academicGradeResolver = new AcademicGradeResolver();

  private courseResolver = new CourseResolver();

  private gradeAssignmentResolver = new GradeAssignmentResolver();

  private schoolConfigurationResolver = new SchoolConfigurationResolver();

  private academicAsignatureCourseResolver = new AcademicAsignatureCourseResolver();

  private teacherResolver = new TeacherResolver();

  @Query(() => SchoolYear, { nullable: true })
  async getSchoolYear(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => SchoolYearConnection)
  async getAllSchoolYear(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
  ): Promise<SchoolYearConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: { schoolId },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({ where: { schoolId } });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            schoolId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            schoolId,
            active: true,
          },
        });
      }
    }
    let resultConn = new SchoolYearConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => SchoolYear)
  async createSchoolYear(
    @Arg('data') data: NewSchoolYear,
    @Ctx() context: IContext,
  ): Promise<SchoolYear> {
    let dataProcess: NewSchoolYear = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    if (result?.schoolYearImportId) {
      this.importDataSchoolActiveOldYear(
        result?.schoolId + '',
        result?.schoolYearImportId,
        result?.id?.toString(),
      );
    }
    return result;
  }

  @Mutation(() => SchoolYear)
  async updateSchoolYear(
    @Arg('data') data: NewSchoolYear,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<SchoolYear | null> {
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
  async changeActiveSchoolYear(
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
  async deleteSchoolYear(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: SchoolYear) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: SchoolYear) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: SchoolYear) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYearImport(@Root() data: SchoolYear) {
    let id = data.schoolYearImportId;
    if (id !== null && id !== undefined) {
      const result = await this.repository.findOneBy(id);
      return result;
    }
    return null;
  }

  async importDataSchoolActiveOldYear(
    schoolId: String,
    schoolYearOldId: String,
    schoolYearNewId: String,
  ) {
    let dataSchoolYearOld = await this.repository.findOneBy(schoolYearOldId);
    let dataSchoolYearNew = await this.repository.findOneBy(schoolYearNewId);
    if (dataSchoolYearOld) {
      let schoolYear = dataSchoolYearOld;
      if (dataSchoolYearNew) {
        //cambiando año
        let newSchoolYear = dataSchoolYearNew;
        let dataSchoolConfigurationNew = await this.repositorySchoolConfiguration.findBy({
          where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
        });
        console.log('School Configuration New: ', dataSchoolConfigurationNew?.length);
        if (dataSchoolConfigurationNew.length == 0) {
          await this.schoolConfigurationResolver.importSchoolConfigurationSchoolYearId(
            schoolId,
            schoolYear.id.toString(),
            newSchoolYear.id.toString(),
          );
        }
        if (newSchoolYear?.schoolYearImportOptions?.academicPeriod) {
          let dataAcademicPeriodsNew = await this.repositoryAcademicPeriod.findBy({
            where: {
              schoolId: schoolId,
              schoolYearId: newSchoolYear?.id?.toString(),
            },
          });
          console.log('Academic Periods New: ', dataAcademicPeriodsNew?.length);
          if (dataAcademicPeriodsNew.length == 0) {
            await this.academicPeriodResolver.importAcademicPeriodSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.educationLevel) {
          let dataEducationLevelNew = await this.repositoryEducationLevel.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Education Level New: ', dataEducationLevelNew?.length);
          if (dataEducationLevelNew.length == 0) {
            await this.educationLevelResolver.importEducationLevelSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.academicDay) {
          let dataAcademicDayNew = await this.repositoryAcademicDay.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Academic Day New: ', dataAcademicDayNew?.length);
          if (dataAcademicDayNew.length == 0) {
            await this.academicDayResolver.importAcademicDaySchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.academicHour
                ? newSchoolYear?.schoolYearImportOptions?.academicHour
                : false,
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.modality) {
          let dataModalityNew = await this.repositoryModality.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Modality New: ', dataModalityNew?.length);
          if (dataModalityNew.length == 0) {
            await this.modalityResolver.importModalitySchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.speciality
                ? newSchoolYear?.schoolYearImportOptions?.speciality
                : false,
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.grade) {
          let dataAcademicGradeNew = await this.repositoryAcademicGrade.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Academic Grade New: ', dataAcademicGradeNew?.length);
          if (dataAcademicGradeNew?.length == 0) {
            await this.academicGradeResolver.importAcademicGradeSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.course
                ? newSchoolYear?.schoolYearImportOptions?.course
                : false,
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.performanceLevel) {
          let dataPerformanceLevelNew = await this.repositoryPerformanceLevel.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Performance Level New: ', dataPerformanceLevelNew?.length);
          if (dataPerformanceLevelNew?.length == 0) {
            await this.performanceLevelResolver.importPerformanceLevelSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.area) {
          let dataAcademicAreaNew = await this.repositoryAcademicArea.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Academic Area New: ', dataAcademicAreaNew?.length);
          if (dataAcademicAreaNew?.length == 0) {
            await this.academicAreaResolver.importAcademicAreaSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.asignature
                ? newSchoolYear?.schoolYearImportOptions?.asignature
                : false,
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.evaluativeComponent) {
          let dataEvaluativeComponentNew = await this.repositoryEvaluativeComponent.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Evaluative Component New: ', dataEvaluativeComponentNew?.length);
          if (dataEvaluativeComponentNew?.length == 0) {
            await this.evaluativeComponentResolver.importEvaluativeComponentSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.gradeAssignment) {
          let dataGradeAssignmentNew = await this.repositoryGradeAssignment.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Grade Assigment New: ', dataGradeAssignmentNew?.length);
          if (dataGradeAssignmentNew?.length == 0) {
            await this.gradeAssignmentResolver.importGradeAssignmentSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.academicAsignatureCourse
                ? newSchoolYear?.schoolYearImportOptions?.academicAsignatureCourse
                : false,
            );
          }
        }
        if (newSchoolYear?.schoolYearImportOptions?.teacher) {
          let dataTeacherNew = await this.repositoryTeacher.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Teacher New: ', dataTeacherNew?.length);
          if (dataTeacherNew?.length == 0) {
            await this.teacherResolver.importTeacherSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
            );
          }
        }
        if (
          newSchoolYear?.schoolYearImportOptions?.studentPromoted ||
          newSchoolYear?.schoolYearImportOptions?.studentNoPromoted
        ) {
          let dataStudentNew = await this.repositoryStudent.findBy({
            where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
          });
          console.log('Student New: ', dataStudentNew?.length);
          if (dataStudentNew?.length == 0) {
            await this.studentResolver.importStudentSchoolYearId(
              schoolId,
              schoolYear.id.toString(),
              newSchoolYear.id.toString(),
              newSchoolYear?.schoolYearImportOptions?.studentPromoted
                ? newSchoolYear?.schoolYearImportOptions?.studentPromoted
                : false,
              newSchoolYear?.schoolYearImportOptions?.studentNoPromoted
                ? newSchoolYear?.schoolYearImportOptions?.studentNoPromoted
                : false,
            );
          }
        }
        console.log('Step: Final');
      }
    } else {
      //console.log('Step Fail: School Years 2022', dataSchoolYear2022?.length);
      //console.log('Step Fail: School Years 2023', dataSchoolYear2023?.length);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixSchoolIdAndSchoolYearId() {
    await this.educationLevelResolver.fixAllEducationLevelSchoolAndSchoolYear();
    await this.academicDayResolver.fixAllAcademicDaySchoolAndSchoolYear();
    await this.academicHourResolver.fixAllAcademicHourSchoolAndSchoolYear();
    await this.modalityResolver.fixAllModalitySchoolAndSchoolYear();
    await this.specialtyResolver.fixAllSpecialtySchoolAndSchoolYear();
    await this.academicGradeResolver.fixAllAcademicGradeSchoolAndSchoolYear();
    await this.courseResolver.fixAllCourseSchoolAndSchoolYear();
    await this.performanceLevelResolver.fixAllPerformanceLevelSchoolAndSchoolYear();
    await this.academicAreaResolver.fixAllAcademicAreaSchoolAndSchoolYear();
    await this.academicAsignatureResolver.fixAllAcademicAsignatureSchoolAndSchoolYear();
    await this.evaluativeComponentResolver.fixAllEvaluativeComponentSchoolAndSchoolYear();
    await this.gradeAssignmentResolver.fixAllGradeAssignmentSchoolAndSchoolYear();
    await this.academicAsignatureCourseResolver.fixAllAcademicAsignatureCourseSchoolAndSchoolYear();
    await this.teacherResolver.fixAllTeacherSchoolAndSchoolYear();
    await this.studentResolver.fixAllSudentSchoolAndSchoolYear();

    let dataSchoolYears = await this.repository.findBy({
      where: {
        schoolYearImportId: { $ne: null },
      },
    });
    console.log(dataSchoolYears?.length);
    // for (let schoolYear of dataSchoolYears) {
    //   await this.importDataSchoolActiveOldYear(
    //     schoolYear?.schoolId + '',
    //     schoolYear?.schoolYearImportId + '',
    //     schoolYear?.id?.toString(),
    //   );
    // }

    return true;
  }

  @Mutation(() => Boolean)
  async createSchoolYearsCode() {
    let dataSchoolCreate = [
      '254003002278',
      '254003000364',
      '254003000062',
      '254003000445',
      '254003000046',
      '254003000381',
      '254003002359',
      '154003000823',
      '254003000330',
      '254003000526',
      '154003001668',
      '254051000821',
      '254099000289',
      '254109000177',
      '254109000096',
      '154128000680',
      '154128000019',
      '254172000233',
      '254172000039',
      '254174000371',
      '254206000149',
      '154206000012',
      '254206001030',
      '254206000041',
      '254206000157',
      '154206000021',
      '254206001196',
      '254206001102',
      '254223000691',
      '254245000776',
      '254245000270',
      '154245000607',
      '254245000041',
      '254245001292',
      '254810000629',
      '254670000488',
      '254670000445',
      '154670001056',
      '254810000106',
      '254261000166',
      '254261000476',
      '154261000099',
      '254261000484',
      '154313000033',
      '254313000054',
      '254344000338',
      '254344000133',
      '254344000290',
      '154344000465',
      '254385000270',
      '254385000121',
      '254398000490',
      '254398000368',
      '254398000724',
      '254398000121',
      '254398000732',
      '154377000207',
      '154405000986',
      '354405000098',
      '254874000363',
      '254874000568',
      '154418000331',
      '154480000118',
      '254480000066',
      '254480000139',
      '154498000018',
      '154498000085',
      '254498000721',
      '154498001944',
      '254498000705',
      '254498000144',
      '154498001928',
      '154498000069',
      '154498002223',
      '254498000209',
      '154518000753',
      '154518000273',
      '254001004761',
      '154660000698',
      '254660000200',
      '254670000798',
      '254670000470',
      '254670000364',
      '254670001301',
      '254720001677',
      '254720000034',
      '254720000930',
      '254743000104',
      '254800000582',
      '254800000108',
      '154810003020',
      '254810000696',
      '254810000386',
      '254810002265',
      '254810000165',
      '254810002061',
      '254810001013',
      '254820000759',
      '254820000368',
      '254820000384',
      '254820000856',
      '254820000848',
      '254874000070',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolCreate } },
    });
    let countSchools = dataSchool?.length;
    let countNoYears = 0;
    console.log('SCHOOLS: ', countSchools);
    for (let school of dataSchool) {
      if (school?.active) {
        console.log('SCHOOL: ', school?.daneCode);
        let schoolYear = await this.repository.findBy({
          where: { schoolYear: 2024, schoolId: school?.id?.toString() },
        });
        console.log('SCHOOL YEARS: ', schoolYear?.length);
        if (schoolYear?.length == 0) {
          countNoYears++;
          const model = await this.repository.create({
            schoolYear: 2024,
            startDate: new Date(2024, 0, 1),
            endDate: new Date(2024, 11, 31),
            schoolId: school?.id?.toString(),
            active: true,
            version: 0,
          });
          let resultSchoolYear = await this.repository.save(model);
          if (resultSchoolYear != null) {
            // CREANDO PERIODOS ACADEMICOS
            const modelAcademicPeriod1 = await this.repositoryAcademicPeriod.create({
              name: 'Primer Periodo',
              startDate: new Date(2024, 0, 1),
              endDate: new Date(2024, 3, 30),
              startDateRecovery: new Date(2024, 0, 1),
              endDateRecovery: new Date(2024, 3, 30),
              weight: 33,
              order: 1,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicPeriod1 =
              await this.repositoryAcademicPeriod.save(modelAcademicPeriod1);

            const modelAcademicPeriod2 = await this.repositoryAcademicPeriod.create({
              name: 'Segundo Periodo',
              startDate: new Date(2024, 4, 1),
              endDate: new Date(2024, 7, 31),
              startDateRecovery: new Date(2024, 4, 1),
              endDateRecovery: new Date(2024, 7, 31),
              weight: 33,
              order: 2,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicPeriod2 =
              await this.repositoryAcademicPeriod.save(modelAcademicPeriod2);

            const modelAcademicPeriod3 = await this.repositoryAcademicPeriod.create({
              name: 'Tercer Periodo',
              startDate: new Date(2024, 8, 1),
              endDate: new Date(2024, 11, 31),
              startDateRecovery: new Date(2024, 8, 1),
              endDateRecovery: new Date(2024, 11, 31),
              weight: 34,
              order: 3,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicPeriod3 =
              await this.repositoryAcademicPeriod.save(modelAcademicPeriod3);

            // CREANDO NIVELES DE DESEMPENO
            const modelPerformanceLevel1 = await this.repositoryPerformanceLevel.create({
              name: 'Bajo',
              minimumScore: 0.0,
              topScore: 3.0,
              isFinal: true,
              isRecovery: true,
              type: PerformanceLevelType.QUANTITATIVE,
              category: PerformanceLevelCategory.SCHOOL,
              categoryGrade: PerformanceLevelCategoryGrade.ALL,
              generalPerformanceLevelId: '60e45535e0ca01f690a7b78f',
              campusId: [],
              academicGradesId: [],
              order: 1,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultPerfomanceLevel1 =
              await this.repositoryPerformanceLevel.save(modelPerformanceLevel1);

            const modelPerformanceLevel2 = await this.repositoryPerformanceLevel.create({
              name: 'Basico',
              minimumScore: 3.0,
              topScore: 4.0,
              isFinal: true,
              isRecovery: false,
              type: PerformanceLevelType.QUANTITATIVE,
              category: PerformanceLevelCategory.SCHOOL,
              categoryGrade: PerformanceLevelCategoryGrade.ALL,
              generalPerformanceLevelId: '60e4552fe0ca01f690a7b78e',
              campusId: [],
              academicGradesId: [],
              order: 2,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultPerfomanceLevel2 =
              await this.repositoryPerformanceLevel.save(modelPerformanceLevel2);

            const modelPerformanceLevel3 = await this.repositoryPerformanceLevel.create({
              name: 'Alto',
              minimumScore: 4.0,
              topScore: 4.5,
              isFinal: true,
              isRecovery: false,
              type: PerformanceLevelType.QUANTITATIVE,
              category: PerformanceLevelCategory.SCHOOL,
              categoryGrade: PerformanceLevelCategoryGrade.ALL,
              generalPerformanceLevelId: '60e45524e0ca01f690a7b78d',
              campusId: [],
              academicGradesId: [],
              order: 3,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultPerfomanceLevel3 =
              await this.repositoryPerformanceLevel.save(modelPerformanceLevel3);

            const modelPerformanceLevel4 = await this.repositoryPerformanceLevel.create({
              name: 'Superior',
              minimumScore: 4.5,
              topScore: 5.0,
              isFinal: true,
              isRecovery: false,
              type: PerformanceLevelType.QUANTITATIVE,
              category: PerformanceLevelCategory.SCHOOL,
              categoryGrade: PerformanceLevelCategoryGrade.ALL,
              generalPerformanceLevelId: '61fb01496770295e7c3775d1',
              campusId: [],
              academicGradesId: [],
              order: 4,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultPerfomanceLevel4 =
              await this.repositoryPerformanceLevel.save(modelPerformanceLevel4);

            // CREANDO COMPONENTES EDUCATIVOS

            const modelEvaluativeComponent1 = await this.repositoryEvaluativeComponent.create({
              name: 'Ser',
              weight: 25,
              type: EvaluativeComponentType.GENERAL,
              academicAreasId: [],
              academicAsignaturesId: [],
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEvaluativeComponent1 =
              await this.repositoryEvaluativeComponent.save(modelEvaluativeComponent1);

            const modelEvaluativeComponent2 = await this.repositoryEvaluativeComponent.create({
              name: 'Saber',
              weight: 25,
              type: EvaluativeComponentType.GENERAL,
              academicAreasId: [],
              academicAsignaturesId: [],
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEvaluativeComponent2 =
              await this.repositoryEvaluativeComponent.save(modelEvaluativeComponent2);

            const modelEvaluativeComponent3 = await this.repositoryEvaluativeComponent.create({
              name: 'Hacer',
              weight: 25,
              type: EvaluativeComponentType.GENERAL,
              academicAreasId: [],
              academicAsignaturesId: [],
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEvaluativeComponent3 =
              await this.repositoryEvaluativeComponent.save(modelEvaluativeComponent3);

            const modelEvaluativeComponent4 = await this.repositoryEvaluativeComponent.create({
              name: 'Convivir',
              weight: 25,
              type: EvaluativeComponentType.GENERAL,
              academicAreasId: [],
              academicAsignaturesId: [],
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEvaluativeComponent4 =
              await this.repositoryEvaluativeComponent.save(modelEvaluativeComponent4);

            // CREANDO NIVELES EDUCATIVOS y ACADEMIC GRADES
            const modelEducationLevel1 = await this.repositoryEducationLevel.create({
              name: 'Preescolar',
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEducationLevel1 =
              await this.repositoryEducationLevel.save(modelEducationLevel1);

            if (resultEducationLevel1 != null) {
              const modelAcademicGrade1 = await this.repositoryAcademicGrade.create({
                name: 'Transición',
                educationLevelId: resultEducationLevel1?.id?.toString(),
                generalAcademicCycleId: '627ded8db3635b55532fbcf6',
                generalAcademicGradeId: '627deedcb3635b55532fbd00',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade1 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade1);
            }

            const modelEducationLevel2 = await this.repositoryEducationLevel.create({
              name: 'Basica Primaria',
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEducationLevel2 =
              await this.repositoryEducationLevel.save(modelEducationLevel2);

            if (modelEducationLevel2 != null) {
              const modelAcademicGrade2 = await this.repositoryAcademicGrade.create({
                name: 'Primero',
                educationLevelId: resultEducationLevel2?.id?.toString(),
                generalAcademicCycleId: '60e447f2e0ca01f690a7b78c',
                generalAcademicGradeId: '6256093f78f3395f6ca958eb',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade2 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade2);

              const modelAcademicGrade3 = await this.repositoryAcademicGrade.create({
                name: 'Segundo',
                educationLevelId: resultEducationLevel2?.id?.toString(),
                generalAcademicCycleId: '60e447f2e0ca01f690a7b78c',
                generalAcademicGradeId: '62560c9078f3395f6ca958f4',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade3 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade3);

              const modelAcademicGrade4 = await this.repositoryAcademicGrade.create({
                name: 'Tercero',
                educationLevelId: resultEducationLevel2?.id?.toString(),
                generalAcademicCycleId: '60e447f2e0ca01f690a7b78c',
                generalAcademicGradeId: '62560c9678f3395f6ca958f5',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade4 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade4);

              const modelAcademicGrade5 = await this.repositoryAcademicGrade.create({
                name: 'Cuarto',
                educationLevelId: resultEducationLevel2?.id?.toString(),
                generalAcademicCycleId: '62560c8778f3395f6ca958f3',
                generalAcademicGradeId: '62560c9b78f3395f6ca958f6',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade5 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade5);

              const modelAcademicGrade6 = await this.repositoryAcademicGrade.create({
                name: 'Quinto',
                educationLevelId: resultEducationLevel2?.id?.toString(),
                generalAcademicCycleId: '62560c8778f3395f6ca958f3',
                generalAcademicGradeId: '62560ca278f3395f6ca958f7',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade6 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade6);
            }

            const modelEducationLevel3 = await this.repositoryEducationLevel.create({
              name: 'Basica Secundaria',
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEducationLevel3 =
              await this.repositoryEducationLevel.save(modelEducationLevel3);

            if (modelEducationLevel3 != null) {
              const modelAcademicGrade7 = await this.repositoryAcademicGrade.create({
                name: 'Sexto',
                educationLevelId: modelEducationLevel3?.id?.toString(),
                generalAcademicCycleId: '627ded9bb3635b55532fbcf7',
                generalAcademicGradeId: '627dee7eb3635b55532fbcfa',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade7 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade7);

              const modelAcademicGrade8 = await this.repositoryAcademicGrade.create({
                name: 'Septimo',
                educationLevelId: modelEducationLevel3?.id?.toString(),
                generalAcademicCycleId: '627ded9bb3635b55532fbcf7',
                generalAcademicGradeId: '627dee88b3635b55532fbcfb',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade8 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade8);

              const modelAcademicGrade9 = await this.repositoryAcademicGrade.create({
                name: 'Octavo',
                educationLevelId: modelEducationLevel3?.id?.toString(),
                generalAcademicCycleId: '627deda6b3635b55532fbcf8',
                generalAcademicGradeId: '627dee90b3635b55532fbcfc',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade9 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade9);

              const modelAcademicGrade10 = await this.repositoryAcademicGrade.create({
                name: 'Noveno',
                educationLevelId: modelEducationLevel3?.id?.toString(),
                generalAcademicCycleId: '627deda6b3635b55532fbcf8',
                generalAcademicGradeId: '627dee97b3635b55532fbcfd',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade10 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade10);
            }

            const modelEducationLevel4 = await this.repositoryEducationLevel.create({
              name: 'Media',
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultEducationLevel4 =
              await this.repositoryEducationLevel.save(modelEducationLevel4);

            if (resultEducationLevel4 != null) {
              const modelAcademicGrade11 = await this.repositoryAcademicGrade.create({
                name: 'Décimo',
                educationLevelId: resultEducationLevel4?.id?.toString(),
                generalAcademicCycleId: '627dedb1b3635b55532fbcf9',
                generalAcademicGradeId: '627deeb4b3635b55532fbcfe',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade11 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade11);

              const modelAcademicGrade12 = await this.repositoryAcademicGrade.create({
                name: 'Undecimo',
                educationLevelId: resultEducationLevel4?.id?.toString(),
                generalAcademicCycleId: '627dedb1b3635b55532fbcf9',
                generalAcademicGradeId: '627deebcb3635b55532fbcff',
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicGrade12 =
                await this.repositoryAcademicGrade.save(modelAcademicGrade12);
            }

            // CREANDO ACADEMIC AREA Y ACADEMIC ASIGNATURES
            const modelAcademicArea1 = await this.repositoryAcademicArea.create({
              name: 'Tecnologia e informatica',
              abbreviation: 'TI',
              order: 1,
              generalAcademicAreaId: '627df0a4b3635b55532fbd08',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea1 = await this.repositoryAcademicArea.save(modelAcademicArea1);

            if (resultAcademicArea1 != null) {
              const modelAcademcAsignature1 = await this.repositoryAcademicAsignature.create({
                name: 'Tecnologia e informatica',
                abbreviation: 'TI',
                generalAcademicAsignatureId: '62a69f1fd2b1e26bc0ac47d9',
                order: 1,
                academicAreaId: resultAcademicArea1?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature1 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature1);
            }

            const modelAcademicArea2 = await this.repositoryAcademicArea.create({
              name: 'Matematicas',
              abbreviation: 'MAT',
              order: 2,
              generalAcademicAreaId: '627df09ab3635b55532fbd07',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea2 = await this.repositoryAcademicArea.save(modelAcademicArea2);

            if (resultAcademicArea2 != null) {
              const modelAcademcAsignature2 = await this.repositoryAcademicAsignature.create({
                name: 'Matematicas',
                abbreviation: 'MAT',
                generalAcademicAsignatureId: '62a69f18d2b1e26bc0ac47d8',
                order: 1,
                academicAreaId: resultAcademicArea2?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature2 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature2);
            }

            const modelAcademicArea3 = await this.repositoryAcademicArea.create({
              name: 'Humanidades, lengua castellana e idiomas extranjeros',
              abbreviation: 'HUM',
              order: 3,
              generalAcademicAreaId: '627df092b3635b55532fbd06',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea3 = await this.repositoryAcademicArea.save(modelAcademicArea3);

            if (resultAcademicArea3 != null) {
              const modelAcademcAsignature3 = await this.repositoryAcademicAsignature.create({
                name: 'Humanidades, lengua castellana e idiomas extranjeros',
                abbreviation: 'HUM',
                generalAcademicAsignatureId: '62983cd789faf55804843310',
                order: 1,
                academicAreaId: resultAcademicArea3?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature3 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature3);
            }

            const modelAcademicArea4 = await this.repositoryAcademicArea.create({
              name: 'Educacion religiosa',
              abbreviation: 'REL',
              order: 4,
              generalAcademicAreaId: '627df08bb3635b55532fbd05',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea4 = await this.repositoryAcademicArea.save(modelAcademicArea4);

            if (resultAcademicArea4 != null) {
              const modelAcademcAsignature4 = await this.repositoryAcademicAsignature.create({
                name: 'Educacion religiosa',
                abbreviation: 'REL',
                generalAcademicAsignatureId: '62a69f0ed2b1e26bc0ac47d7',
                order: 1,
                academicAreaId: resultAcademicArea4?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature4 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature4);
            }

            const modelAcademicArea5 = await this.repositoryAcademicArea.create({
              name: 'Educacion fisica, recreacion y deportes',
              abbreviation: 'EDF',
              order: 5,
              generalAcademicAreaId: '627df082b3635b55532fbd04',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea5 = await this.repositoryAcademicArea.save(modelAcademicArea5);

            if (resultAcademicArea5 != null) {
              const modelAcademcAsignature5 = await this.repositoryAcademicAsignature.create({
                name: 'Educacion fisica, recreacion y deportes',
                abbreviation: 'EDF',
                generalAcademicAsignatureId: '62a69f08d2b1e26bc0ac47d6',
                order: 1,
                academicAreaId: resultAcademicArea5?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature5 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature5);
            }

            const modelAcademicArea6 = await this.repositoryAcademicArea.create({
              name: 'Educacion etica y en valores humanos',
              abbreviation: 'EDE',
              order: 6,
              generalAcademicAreaId: '627df079b3635b55532fbd03',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea6 = await this.repositoryAcademicArea.save(modelAcademicArea6);

            if (resultAcademicArea6 != null) {
              const modelAcademcAsignature6 = await this.repositoryAcademicAsignature.create({
                name: 'Educacion etica y en valores humanos',
                abbreviation: 'EDE',
                generalAcademicAsignatureId: '62a69f01d2b1e26bc0ac47d5',
                order: 1,
                academicAreaId: resultAcademicArea6?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature6 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature6);
            }

            const modelAcademicArea7 = await this.repositoryAcademicArea.create({
              name: 'Educacion artistica y cultural',
              abbreviation: 'EDA',
              order: 7,
              generalAcademicAreaId: '627df071b3635b55532fbd02',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea7 = await this.repositoryAcademicArea.save(modelAcademicArea7);

            if (resultAcademicArea7 != null) {
              const modelAcademcAsignature7 = await this.repositoryAcademicAsignature.create({
                name: 'Educacion artistica y cultural',
                abbreviation: 'EDA',
                generalAcademicAsignatureId: '62a69ef8d2b1e26bc0ac47d4',
                order: 1,
                academicAreaId: resultAcademicArea7?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature7 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature7);
            }

            const modelAcademicArea8 = await this.repositoryAcademicArea.create({
              name: 'Ciencias sociales, historia, geografia, constitucion politica y democracia',
              abbreviation: 'CSO',
              order: 8,
              generalAcademicAreaId: '627df069b3635b55532fbd01',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea8 = await this.repositoryAcademicArea.save(modelAcademicArea8);

            if (resultAcademicArea8 != null) {
              const modelAcademcAsignature8 = await this.repositoryAcademicAsignature.create({
                name: 'Ciencias sociales, historia, geografia, constitucion politica y democracia',
                abbreviation: 'CSO',
                generalAcademicAsignatureId: '62a69ef1d2b1e26bc0ac47d3',
                order: 1,
                academicAreaId: resultAcademicArea8?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature8 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature8);
            }

            const modelAcademicArea9 = await this.repositoryAcademicArea.create({
              name: 'Ciencias naturales y educacion ambiental',
              abbreviation: 'CNA',
              order: 9,
              generalAcademicAreaId: '6256099d78f3395f6ca958ef',
              isAverage: true,
              schoolId: resultSchoolYear?.schoolId?.toString(),
              schoolYearId: resultSchoolYear?.id?.toString(),
              active: true,
              version: 0,
            });
            let resultAcademicArea9 = await this.repositoryAcademicArea.save(modelAcademicArea9);

            if (resultAcademicArea9 != null) {
              const modelAcademcAsignature9 = await this.repositoryAcademicAsignature.create({
                name: 'Ciencias naturales y educacion ambiental',
                abbreviation: 'CNA',
                generalAcademicAsignatureId: '60e3d85be0ca01f690a7b78a',
                order: 1,
                academicAreaId: resultAcademicArea9?.id?.toString(),
                schoolId: resultSchoolYear?.schoolId?.toString(),
                schoolYearId: resultSchoolYear?.id?.toString(),
                active: true,
                version: 0,
              });
              let resultAcademicAsignature9 =
                await this.repositoryAcademicAsignature.save(modelAcademcAsignature9);
            }
          }
          //console.log('DANE IE: ', school?.daneCode);
          //console.log('Count: ', countNoYears);
        } else {
          //console.error('DANE IE: ', school?.daneCode);
          //console.error('School ID: ', school?.id?.toString());
          //console.log('Counts: ', schoolYear?.length);
        }
      }
    }
    console.log('SCHOOLNOYEARS: ', countNoYears);
    return true;
  }
}
