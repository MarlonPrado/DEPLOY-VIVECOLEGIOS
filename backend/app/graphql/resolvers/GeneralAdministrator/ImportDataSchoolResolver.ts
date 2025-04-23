import { ObjectId } from 'mongodb';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAreaRepository, AcademicAsignatureCourseRepository, AcademicAsignatureRepository, AcademicDayRepository, AcademicGradeRepository, AcademicPeriodRepository, CampusAdministratorRepository, CampusRepository, CourseRepository, EducationLevelRepository, EvaluativeComponentRepository, GradeAssignmentRepository, ModalityRepository, PerformanceLevelRepository, SchoolAdministratorRepository, SchoolRepository, SchoolYearRepository, SpecialtyRepository, StudentRepository, TeacherRepository, UserRepository } from '../../../servers/DataSource';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { Course } from '../../models/CampusAdministrator/Course';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { SchoolAdministrator } from '../../models/GeneralAdministrator/SchoolAdministrator';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { CampusAdministrator } from '../../models/SchoolAdministrator/CampusAdministrator';
import { EducationLevel } from '../../models/SchoolAdministrator/EducationLevel';
import { EvaluativeComponent } from '../../models/SchoolAdministrator/EvaluativeComponent';
import { GradeAssignment } from '../../models/SchoolAdministrator/GradeAssignment';
import { Modality } from '../../models/SchoolAdministrator/Modality';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { Specialty } from '../../models/SchoolAdministrator/Specialty';
import { AcademicDayResolver } from '../CampusAdministrator/AcademicDayResolver';
import { CourseResolver } from '../CampusAdministrator/CourseResolver';
import { AcademicAreaResolver } from '../SchoolAdministrator/AcademicAreaResolver';
import { AcademicGradeResolver } from '../SchoolAdministrator/AcademicGradeResolver';
import { AcademicPeriodResolver } from '../SchoolAdministrator/AcademicPeriodResolver';
import { EducationLevelResolver } from '../SchoolAdministrator/EducationLevelResolver';
import { EvaluativeComponentResolver } from '../SchoolAdministrator/EvaluativeComponentResolver';
import { PerformanceLevelResolver } from '../SchoolAdministrator/PerformanceLevelResolver';
import { StudentResolver } from './StudentResolver';

@Resolver(School)
export class ImportDataSchoolResolver {
  @InjectRepository(Specialty)
  private repository = SpecialtyRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @InjectRepository(EducationLevel)
  private repositoryEducationLevel = EducationLevelRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @InjectRepository(EvaluativeComponent)
  private repositoryEvaluativeComponent = EvaluativeComponentRepository;

  @InjectRepository(Modality)
  private repositoryModality = ModalityRepository;

  @InjectRepository(Specialty)
  private repositorySpecialty = SpecialtyRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(SchoolAdministrator)
  private repositorySchoolAdministrator = SchoolAdministratorRepository;

  @InjectRepository(CampusAdministrator)
  private repositoryCampusAdministrator = CampusAdministratorRepository;

  @InjectRepository(GradeAssignment)
  private repositoryGradeAssignment = GradeAssignmentRepository;

  @InjectRepository(Teacher)
  private repositoryTeacher = TeacherRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  private academicDayResolver = new AcademicDayResolver();

  private courseResolver = new CourseResolver();

  private studentResolver = new StudentResolver();

  private academicPeriodResolver = new AcademicPeriodResolver();

  private educationLevelResolver = new EducationLevelResolver();

  private performanceLevelResolver = new PerformanceLevelResolver();

  private evaluativeComponentResolver = new EvaluativeComponentResolver();

  private academicAreaResolver = new AcademicAreaResolver();

  private academicGradeResolver = new AcademicGradeResolver();

  @Mutation(() => Boolean)
  async updateWithDaneSchoolBulk() {
    let dataSchoolDane = ['154498000051'];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      let schoolId = school.id.toString();
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      await this.importDataSchoolInactive(schoolId);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async importDataSchoolInactive(@Arg('schoolId', () => String) schoolId: String) {
    let dataSchoolYear = await this.repositorySchoolYear.findBy({
      where: { schoolId: schoolId, schoolYear: 2023 },
    });
    //let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({ where: { schoolId: schoolId, schoolYear: 2023 } });
    if (dataSchoolYear.length == 1) {
      let dataCampus = await this.repositoryCampus.findBy({ where: { schoolId: schoolId } });
      for (let schoolYear of dataSchoolYear) {
        console.log('Step: Initial');
        console.log('Update Year');
        let resultSchoolYear = await this.repositorySchoolYear.save({
          _id: new ObjectId(schoolYear.id.toString()),
          ...schoolYear,
          schoolYear: 2023,
          version: (schoolYear?.version as number) + 1,
        });
        let dataAcademicPeriods = await this.repositoryAcademicPeriod.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Academic Periods: ', dataAcademicPeriods?.length);
        for (let academicPeriod of dataAcademicPeriods) {
          let resultAcademicPeriod = await this.repositoryAcademicPeriod.save({
            _id: new ObjectId(academicPeriod.id.toString()),
            ...academicPeriod,
            version: (academicPeriod?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
        }
        for (let campus of dataCampus) {
          let dataAcademicDays = await this.repositoryAcademicDay.findBy({
            where: { campusId: campus.id.toString() },
          });
          console.log('Academic Days Campus: ', dataAcademicDays?.length);
          console.log('Campus: ', campus?.name);
          for (let academicDay of dataAcademicDays) {
            let resultAcademicDay = await this.repositoryAcademicDay.save({
              _id: new ObjectId(academicDay.id.toString()),
              ...academicDay,
              version: (academicDay?.version as number) + 1,
              schoolId: schoolId.toString(),
              schoolYearId: schoolYear.id.toString(),
            });
          }
        }
        let dataEducationLevel = await this.repositoryEducationLevel.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Education Level: ', dataEducationLevel?.length);
        for (let educationLevel of dataEducationLevel) {
          let resultEducationLevel = await this.repositoryEducationLevel.save({
            _id: new ObjectId(educationLevel.id.toString()),
            ...educationLevel,
            version: (educationLevel?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
        }
        let dataPerformanceLevel = await this.repositoryPerformanceLevel.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Performance Level: ', dataPerformanceLevel?.length);
        for (let performanceLevel of dataPerformanceLevel) {
          let resultEducationLevel = await this.repositoryPerformanceLevel.save({
            _id: new ObjectId(performanceLevel.id.toString()),
            ...performanceLevel,
            version: (performanceLevel?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
        }
        let dataEvaluativeComponent = await this.repositoryEvaluativeComponent.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Evaluative Component: ', dataEvaluativeComponent?.length);
        for (let evaluativeComponent of dataEvaluativeComponent) {
          let resultEducationLevel = await this.repositoryEvaluativeComponent.save({
            _id: new ObjectId(evaluativeComponent.id.toString()),
            ...evaluativeComponent,
            version: (evaluativeComponent?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
        }
        let dataModality = await this.repositoryModality.findBy({ where: { schoolId: schoolId } });
        console.log('Modality: ', dataEvaluativeComponent?.length);
        for (let modality of dataModality) {
          let resultModality = await this.repositoryModality.save({
            _id: new ObjectId(modality.id.toString()),
            ...modality,
            version: (modality?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
          let dataSpeciality = await this.repositorySpecialty.findBy({
            where: { modalityId: modality.id.toString() },
          });
          console.log('Speciality: ', dataSpeciality?.length);
          for (let speciality of dataSpeciality) {
            let resultSpeciality = await this.repositorySpecialty.save({
              _id: new ObjectId(speciality.id.toString()),
              ...speciality,
              version: (speciality?.version as number) + 1,
              schoolId: schoolId.toString(),
              schoolYearId: schoolYear.id.toString(),
            });
          }
        }
        let dataAcademicArea = await this.repositoryAcademicArea.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Academic Area: ', dataAcademicArea?.length);
        for (let academicArea of dataAcademicArea) {
          let resultAcademicArea = await this.repositoryAcademicArea.save({
            _id: new ObjectId(academicArea.id.toString()),
            ...academicArea,
            version: (academicArea?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
          let dataAcademicAsignature = await this.repositoryAcademicAsignature.findBy({
            where: { academicAreaId: academicArea.id.toString() },
          });
          console.log('Academic Asignature: ', dataAcademicAsignature?.length);
          for (let academicAsignature of dataAcademicAsignature) {
            let resultAcademicAsignature = await this.repositoryAcademicAsignature.save({
              _id: new ObjectId(academicAsignature.id.toString()),
              ...academicAsignature,
              version: (academicAsignature?.version as number) + 1,
              schoolId: schoolId.toString(),
              schoolYearId: schoolYear.id.toString(),
            });
          }
        }
        let dataAcademicGrade = await this.repositoryAcademicGrade.findBy({
          where: { schoolId: schoolId },
        });
        console.log('Academic Grade: ', dataAcademicGrade?.length);
        for (let academicGrade of dataAcademicGrade) {
          let resultAcademicGrade = await this.repositoryAcademicGrade.save({
            _id: new ObjectId(academicGrade.id.toString()),
            ...academicGrade,
            version: (academicGrade?.version as number) + 1,
            schoolId: schoolId.toString(),
            schoolYearId: schoolYear.id.toString(),
          });
          let dataCourse = await this.repositoryCourse.findBy({
            where: { academicGradeId: academicGrade.id.toString() },
          });
          console.log('Course: ', dataCourse?.length);
          for (let course of dataCourse) {
            let resultCourse = await this.repositoryCourse.save({
              _id: new ObjectId(course.id.toString()),
              ...course,
              version: (course?.version as number) + 1,
              studentsId: [],
              schoolId: schoolId.toString(),
              schoolYearId: schoolYear.id.toString(),
            });
          }
        }
        console.log('Step: SIMAT ');
        await this.academicDayResolver.createAllInitialsAcademicDay(
          schoolId,
          schoolYear.id.toString()
        );
        console.log('Step: SIMAT - Academic Days');
        await this.courseResolver.createAllInitialsCourse(schoolId, schoolYear.id.toString());
        console.log('Step: SIMAT - Courses');
        await this.courseResolver.updateGradeAllInitialsCourse(schoolId, schoolYear.id.toString());
        console.log('Step: SIMAT - Update Grade Courses');
        await this.courseResolver.updateGradeAcademicDayAllInitialsCourse(
          schoolId,
          schoolYear.id.toString()
        );
        console.log('Step: SIMAT - Update Academic Day Courses');
        await this.studentResolver.createAllInitialsStudents(schoolId, schoolYear.id.toString());
        console.log('Step: SIMAT - Update Students');
        // console.log('Step: Final');
        // console.log('Activate Administrator IE');
        // let dataSchoolAdministrator = await this.repositorySchoolAdministrator.findBy({
        //   where: { schoolId: { $in: [schoolId] } },
        // });
        // console.log('School Administrator: ', dataSchoolAdministrator?.length);
        // for (let schoolAdministrator of dataSchoolAdministrator) {
        //   let resultUser = await this.repositoryUser.findOneBy(
        //     schoolAdministrator?.userId?.toString()
        //   );
        //   resultUser = await this.repositoryUser.save({
        //     _id: new ObjectId(resultUser?.id?.toString()),
        //     ...resultUser,
        //     active: true,
        //     version: (resultUser?.version as number) + 1,
        //   });
        // }
        // console.log('Activate Administrator Campus');
        // let dataCampusAdministrator = await this.repositoryCampusAdministrator.findBy({
        //   where: { schoolId: { $in: [schoolId] } },
        // });
        // console.log('Campus Administrator: ', dataCampusAdministrator?.length);
        // for (let campusAdministrator of dataSchoolAdministrator) {
        //   let resultUser = await this.repositoryUser.findOneBy(
        //     campusAdministrator?.userId?.toString()
        //   );
        //   resultUser = await this.repositoryUser.save({
        //     _id: new ObjectId(resultUser?.id?.toString()),
        //     ...resultUser,
        //     active: true,
        //     version: (resultUser?.version as number) + 1,
        //   });
        // }
        // console.log('Activate Teachers');
        // let dataTeacher = await this.repositoryTeacher.findBy({
        //   where: { schoolId: { $in: [schoolId] } },
        // });
        // console.log('Teacher: ', dataTeacher?.length);
        // for (let teacher of dataTeacher) {
        //   let resultUser = await this.repositoryUser.findOneBy(teacher?.userId?.toString());
        //   resultUser = await this.repositoryUser.save({
        //     _id: new ObjectId(resultUser?.id?.toString()),
        //     ...resultUser,
        //     active: true,
        //     version: (resultUser?.version as number) + 1,
        //   });
        // }
      }
    } else {
      console.log('Step Fail: School Years ', dataSchoolYear?.length);
    }
    return true;
  }

  // @Mutation(() => Boolean)
  // async importDataSchoolActiveOldYear(@Arg('schoolId', () => String) schoolId: String) {
  //   //let dataSchoolYear = await this.repositorySchoolYear.findBy({ where: { schoolId: schoolId } });
  //   let dataSchoolYear2022 = await this.repositorySchoolYear.findBy({
  //     where: { schoolId: schoolId, schoolYear: 2022 },
  //   });
  //   let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
  //     where: { schoolId: schoolId, schoolYear: 2023 },
  //   });
  //   if (dataSchoolYear2022.length == 1) {
  //     let schoolYear = dataSchoolYear2022[0];
  //     // let dataCampus = await this.repositoryCampus.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Step: Initial")
  //     // console.log("Update Year")
  //     // let resultSchoolYear = await this.repositorySchoolYear.save({
  //     //   _id: new ObjectId(schoolYear.id.toString()),
  //     //   ...schoolYear,
  //     //   name: 2023,
  //     //   version: (schoolYear?.version as number) + 1,
  //     // });
  //     // let dataAcademicPeriods = await this.repositoryAcademicPeriod.findBy({
  //     //   where: {
  //     //     schoolId: schoolId, schoolYearId: schoolYear?.id?.toString()
  //     //   }
  //     // });
  //     // console.log("Academic Periods: ", dataAcademicPeriods?.length)
  //     // for (let academicPeriod of dataAcademicPeriods) {
  //     //   let resultAcademicPeriod = await this.repositoryAcademicPeriod.save({
  //     //     _id: new ObjectId(academicPeriod.id.toString()),
  //     //     ...academicPeriod,
  //     //     version: (academicPeriod?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     // }
  //     // for (let campus of dataCampus) {
  //     //   let dataAcademicDays = await this.repositoryAcademicDay.findBy({ where: { campusId: campus.id.toString() } });;
  //     //   console.log("Academic Days Campus: ", dataAcademicDays?.length)
  //     //   console.log("Campus: ", campus?.name)
  //     //   for (let academicDay of dataAcademicDays) {
  //     //     let resultAcademicDay = await this.repositoryAcademicDay.save({
  //     //       _id: new ObjectId(academicDay.id.toString()),
  //     //       ...academicDay,
  //     //       version: (academicDay?.version as number) + 1,
  //     //       schoolId: schoolId.toString(),
  //     //       schoolYearId: schoolYear.id.toString()
  //     //     });
  //     //   }
  //     // }
  //     // let dataEducationLevel = await this.repositoryEducationLevel.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Education Level: ", dataEducationLevel?.length)
  //     // for (let educationLevel of dataEducationLevel) {
  //     //   let resultEducationLevel = await this.repositoryEducationLevel.save({
  //     //     _id: new ObjectId(educationLevel.id.toString()),
  //     //     ...educationLevel,
  //     //     version: (educationLevel?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     // }
  //     // let dataPerformanceLevel = await this.repositoryPerformanceLevel.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Performance Level: ", dataPerformanceLevel?.length)
  //     // for (let performanceLevel of dataPerformanceLevel) {
  //     //   let resultEducationLevel = await this.repositoryPerformanceLevel.save({
  //     //     _id: new ObjectId(performanceLevel.id.toString()),
  //     //     ...performanceLevel,
  //     //     version: (performanceLevel?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     // }
  //     // let dataEvaluativeComponent = await this.repositoryEvaluativeComponent.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Evaluative Component: ", dataEvaluativeComponent?.length)
  //     // for (let evaluativeComponent of dataEvaluativeComponent) {
  //     //   let resultEducationLevel = await this.repositoryEvaluativeComponent.save({
  //     //     _id: new ObjectId(evaluativeComponent.id.toString()),
  //     //     ...evaluativeComponent,
  //     //     version: (evaluativeComponent?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     // }
  //     // let dataModality = await this.repositoryModality.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Modality: ", dataEvaluativeComponent?.length)
  //     // for (let modality of dataModality) {
  //     //   let resultModality = await this.repositoryModality.save({
  //     //     _id: new ObjectId(modality.id.toString()),
  //     //     ...modality,
  //     //     version: (modality?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     //   let dataSpeciality = await this.repositorySpecialty.findBy({ where: { modalityId: modality.id.toString() } });
  //     //   console.log("Speciality: ", dataSpeciality?.length)
  //     //   for (let speciality of dataSpeciality) {
  //     //     let resultSpeciality = await this.repositorySpecialty.save({
  //     //       _id: new ObjectId(speciality.id.toString()),
  //     //       ...speciality,
  //     //       version: (speciality?.version as number) + 1,
  //     //       schoolId: schoolId.toString(),
  //     //       schoolYearId: schoolYear.id.toString()
  //     //     });
  //     //   }
  //     // }
  //     // let dataAcademicArea = await this.repositoryAcademicArea.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Academic Area: ", dataAcademicArea?.length)
  //     // for (let academicArea of dataAcademicArea) {
  //     //   let resultAcademicArea = await this.repositoryAcademicArea.save({
  //     //     _id: new ObjectId(academicArea.id.toString()),
  //     //     ...academicArea,
  //     //     version: (academicArea?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     //   let dataAcademicAsignature = await this.repositoryAcademicAsignature.findBy({ where: { academicAreaId: academicArea.id.toString() } });
  //     //   console.log("Academic Asignature: ", dataAcademicAsignature?.length)
  //     //   for (let academicAsignature of dataAcademicAsignature) {
  //     //     let resultAcademicAsignature = await this.repositoryAcademicAsignature.save({
  //     //       _id: new ObjectId(academicAsignature.id.toString()),
  //     //       ...academicAsignature,
  //     //       version: (academicAsignature?.version as number) + 1,
  //     //       schoolId: schoolId.toString(),
  //     //       schoolYearId: schoolYear.id.toString()
  //     //     });
  //     //   }
  //     // }
  //     // let dataAcademicGrade = await this.repositoryAcademicGrade.findBy({ where: { schoolId: schoolId } });
  //     // console.log("Academic Grade: ", dataAcademicGrade?.length)
  //     // for (let academicGrade of dataAcademicGrade) {
  //     //   let resultAcademicGrade = await this.repositoryAcademicGrade.save({
  //     //     _id: new ObjectId(academicGrade.id.toString()),
  //     //     ...academicGrade,
  //     //     version: (academicGrade?.version as number) + 1,
  //     //     schoolId: schoolId.toString(),
  //     //     schoolYearId: schoolYear.id.toString()
  //     //   });
  //     //   let dataCourse = await this.repositoryCourse.findBy({ where: { academicGradeId: academicGrade.id.toString() } });
  //     //   console.log("Course: ", dataCourse?.length)
  //     //   for (let course of dataCourse) {
  //     //     let resultCourse = await this.repositoryCourse.save({
  //     //       _id: new ObjectId(course.id.toString()),
  //     //       ...course,
  //     //       version: (course?.version as number) + 1,
  //     //       studentsId: [],
  //     //       schoolId: schoolId.toString(),
  //     //       schoolYearId: schoolYear.id.toString()
  //     //     });
  //     //   }
  //     // }
  //     if (dataSchoolYear2023.length == 0) {
  //       const model = await this.repositorySchoolYear.create({
  //         schoolYear: 2023,
  //         schoolId: schoolId.toString(),
  //         active: true,
  //         version: 0,
  //       });
  //       let resultSchoolYear = await this.repositorySchoolYear.save(model);
  //       if (resultSchoolYear) {
  //         dataSchoolYear2023 = [resultSchoolYear];
  //       }
  //     }
  //     if (dataSchoolYear2023.length == 1 && dataSchoolYear2023.length == 1) {
  //       //cambiando año
  //       let newSchoolYear = dataSchoolYear2023[0];
  //       console.log('Step: New year ');
  //       let dataAcademicPeriodsNew = await this.repositoryAcademicPeriod.findBy({
  //         where: {
  //           schoolId: schoolId,
  //           schoolYearId: newSchoolYear?.id?.toString(),
  //         },
  //       });
  //       console.log('Academic Periods New: ', dataAcademicPeriodsNew?.length);
  //       if (dataAcademicPeriodsNew.length == 0) {
  //         console.log('Step: Import Academic Periods ');
  //         await this.academicPeriodResolver.importAcademicPeriodSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       let dataEducationLevelNew = await this.repositoryEducationLevel.findBy({
  //         where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
  //       });
  //       console.log('Education Level New: ', dataEducationLevelNew?.length);
  //       if (dataEducationLevelNew.length == 0) {
  //         await this.educationLevelResolver.importEducationLevelSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       let dataPerformanceLevelNew = await this.repositoryPerformanceLevel.findBy({
  //         where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
  //       });
  //       console.log('Performance Level New: ', dataPerformanceLevelNew?.length);
  //       if (dataPerformanceLevelNew?.length == 0) {
  //         await this.performanceLevelResolver.importPerformanceLevelSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       let dataEvaluativeComponentNew = await this.repositoryEvaluativeComponent.findBy({
  //         where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
  //       });
  //       console.log('Evaluative Component New: ', dataEvaluativeComponentNew?.length);
  //       if (dataEvaluativeComponentNew?.length == 0) {
  //         await this.evaluativeComponentResolver.importEvaluativeComponentSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       let dataAcademicAreaNew = await this.repositoryAcademicArea.findBy({
  //         where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
  //       });
  //       console.log('Academic Area New: ', dataAcademicAreaNew?.length);
  //       if (dataAcademicAreaNew?.length == 0) {
  //         await this.academicAreaResolver.importAcademicAreaSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       let dataAcademicGradeNew = await this.repositoryAcademicGrade.findBy({
  //         where: { schoolId: schoolId, schoolYearId: newSchoolYear?.id?.toString() },
  //       });
  //       console.log('Academic Grade New: ', dataAcademicGradeNew?.length);
  //       if (dataAcademicGradeNew?.length == 0) {
  //         await this.academicGradeResolver.importAcademicGradeSchoolYearId(
  //           schoolId,
  //           schoolYear.id.toString(),
  //           newSchoolYear.id.toString()
  //         );
  //       }
  //       console.log('Step: SIMAT ');
  //       await this.academicDayResolver.createAllInitialsAcademicDay(
  //         schoolId,
  //         newSchoolYear.id.toString()
  //       );
  //       console.log('Step: SIMAT - Academic Days');
  //       await this.courseResolver.createAllInitialsCourse(schoolId, newSchoolYear.id.toString());
  //       console.log('Step: SIMAT - Courses');
  //       await this.courseResolver.updateGradeAllInitialsCourse(
  //         schoolId,
  //         newSchoolYear.id.toString()
  //       );
  //       console.log('Step: SIMAT - Update Grade Courses');
  //       await this.courseResolver.updateGradeAcademicDayAllInitialsCourse(
  //         schoolId,
  //         newSchoolYear.id.toString()
  //       );
  //       console.log('Step: SIMAT - Update Academic Day Courses');
  //       await this.studentResolver.createAllInitialsStudents(schoolId, newSchoolYear.id.toString());
  //       console.log('Step: SIMAT - Update Students');
  //       console.log('Step: Final');
  //     }
  //     //console.log("Activate Administrator IE")
  //     // let dataSchoolAdministrator = await this.repositorySchoolAdministrator.findBy({ where: { schoolId: { $in: [schoolId] } } });
  //     // console.log("School Administrator: ", dataSchoolAdministrator?.length)
  //     // for (let schoolAdministrator of dataSchoolAdministrator) {
  //     //   let resultUser = await this.repositoryUser.findOneBy(schoolAdministrator?.userId?.toString());
  //     //   resultUser = await this.repositoryUser.save({
  //     //     _id: new ObjectId(resultUser?.id?.toString()),
  //     //     ...resultUser,
  //     //     active: true,
  //     //     version: (resultUser?.version as number) + 1,
  //     //   });
  //     // }
  //     // console.log("Activate Administrator Campus")
  //     // let dataCampusAdministrator = await this.repositoryCampusAdministrator.findBy({ where: { schoolId: { $in: [schoolId] } } });
  //     // console.log("Campus Administrator: ", dataCampusAdministrator?.length)
  //     // for (let campusAdministrator of dataSchoolAdministrator) {
  //     //   let resultUser = await this.repositoryUser.findOneBy(campusAdministrator?.userId?.toString());
  //     //   resultUser = await this.repositoryUser.save({
  //     //     _id: new ObjectId(resultUser?.id?.toString()),
  //     //     ...resultUser,
  //     //     active: true,
  //     //     version: (resultUser?.version as number) + 1,
  //     //   });
  //     // }
  //     // console.log("Activate Teachers")
  //     // let dataTeacher = await this.repositoryTeacher.findBy({ where: { schoolId: { $in: [schoolId] } } });
  //     // console.log("Teacher: ", dataTeacher?.length)
  //     // for (let teacher of dataTeacher) {
  //     //   let resultUser = await this.repositoryUser.findOneBy(teacher?.userId?.toString());
  //     //   resultUser = await this.repositoryUser.save({
  //     //     _id: new ObjectId(resultUser?.id?.toString()),
  //     //     ...resultUser,
  //     //     active: true,
  //     //     version: (resultUser?.version as number) + 1,
  //     //   });
  //     // }
  //   } else {
  //     console.log('Step Fail: School Years 2022', dataSchoolYear2022?.length);
  //     console.log('Step Fail: School Years 2023', dataSchoolYear2023?.length);
  //   }
  //   return true;
  // }

  @Mutation(() => Boolean)
  async updateGradeAssignmentSchoolYear() {
    let dataSchoolDane = [
      // "254003000046",
      '154128000680',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      let schoolId = school.id.toString();
      let dataGradeAssigments = await this.repositoryGradeAssignment.findBy({
        where: { schoolId: schoolId },
      });
      let schoolYearId = undefined;
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      console.log('Actualizando: ', dataGradeAssigments?.length);
      for (let gradeAssigment of dataGradeAssigments) {
        if (gradeAssigment.schoolYearId == undefined) {
          let academicGrade = await this.repositoryAcademicGrade.findOneBy(
            gradeAssigment.academicGradeId
          );
          if (academicGrade) {
            let resultGradeAssigment = await this.repositoryGradeAssignment.save({
              _id: new ObjectId(gradeAssigment?.id?.toString()),
              ...gradeAssigment,
              schoolYearId: academicGrade.schoolYearId,
              active: true,
              version: (gradeAssigment?.version as number) + 1,
            });
            schoolYearId = academicGrade.schoolYearId;
          }
        } else {
          schoolYearId = gradeAssigment.schoolYearId;
        }
        let dataAcademicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.findBy({
          where: { gradeAssignmentId: gradeAssigment.id.toString() },
        });
        for (let academicAsignatureCourse of dataAcademicAsignatureCourse) {
          let resultAcademicAsignatureCourse =
            await this.repositoryAcademicAsignatureCourse.findOneBy(
              academicAsignatureCourse?.id?.toString()
            );
          resultAcademicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.save({
            _id: new ObjectId(resultAcademicAsignatureCourse?.id?.toString()),
            ...resultAcademicAsignatureCourse,
            schoolYearId: schoolYearId,
            schoolId: schoolId.toString(),
            active: true,
            version: (resultAcademicAsignatureCourse?.version as number) + 1,
          });
        }
      }
    }
    return true;
  }

  //627cfaf0459553d16d932be0

  //buscar en todos los academic day y actualizar el schoolID segun el campusiD
  // falta limpiar la base de datos de los registros de asignaturas que no tengan un area vinculada

  @Mutation(() => Boolean)
  async fixStudentCourseYearOld(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String
  ) {
    let dataSchool = await this.repositorySchool.findOneBy(schoolId);
    let dataSchoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
    if (dataSchool && dataSchoolYear) {
      let schoolId = dataSchool.id.toString();
      let schoolYearId = dataSchoolYear.id.toString();
      let dataCourses = await this.repositoryCourse.findBy({
        where: { schoolId: schoolId, schoolYearId },
      });
      for (let course of dataCourses) {
        let dataStudents = await this.repositoryStudent.findBy({
          courseId: course.id.toString(),
          //schoolYearId: schoolYearId
        });
        console.log('dataStudents', dataStudents);
        let studentsId = [];
        for (let student of dataStudents) {
          studentsId?.push(student?.id?.toString());
        }
        console.log(studentsId);
        let resultCourse = await this.repositoryCourse.save({
          _id: new ObjectId(course?.id?.toString()),
          ...course,
          studentsId,
          version: (course?.version as number) + 1,
        });
        //this.courseResolver.updateCodeStudentsCourse(course + "");
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async updateDataSimat(@Arg('schoolId', () => String) schoolId: String, @Arg('schoolYearId', () => String) schoolYearId: String) {
    let dataSchool = await this.repositorySchool.findOneBy(schoolId);
    if (dataSchool) {
      let schoolId = dataSchool.id.toString();
      console.log('Actualizando IE: ', dataSchool?.name);
      console.log('DANE IE: ', dataSchool?.daneCode);
      let dataSchoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId);
      if (dataSchoolYear) {
        console.log('Step: SIMAT ');
        await this.academicDayResolver.createAllInitialsAcademicDay(
          schoolId,
          schoolYearId
        );
        console.log('Step: SIMAT - Academic Days');
        await this.courseResolver.createAllInitialsCourse(
          schoolId,
          schoolYearId
        );
        console.log('Step: SIMAT - Courses');
        await this.courseResolver.updateGradeAllInitialsCourse(
          schoolId,
          schoolYearId
        );
        console.log('Step: SIMAT - Update Grade Courses');
        await this.courseResolver.updateGradeAcademicDayAllInitialsCourse(
          schoolId,
          schoolYearId
        );
        console.log('Step: SIMAT - Update Academic Day Courses');
        await this.studentResolver.createAllInitialsStudents(
          schoolId,
          schoolYearId
        );
        console.log('Step: SIMAT - Update Students');
        console.log('Step: Final');
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async importGradeAssignmentSchoolYear() {
    let dataSchoolDane = [
      // "254003000046",
      '2540030000445',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      let dataSchoolYear2022 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2022 },
      });
      let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2023 },
      });
      let schoolId = school.id.toString();
      console.log('dataSchoolYear2022', dataSchoolYear2022[0].id.toString());
      console.log('dataSchoolYear2023', dataSchoolYear2023[0].id.toString());
      if (dataSchoolYear2022?.length > 0 && dataSchoolYear2023.length > 0) {
        let dataOldGradeAssigments = await this.repositoryGradeAssignment.findBy({
          where: { schoolId: schoolId, schoolYearId: dataSchoolYear2022[0].id.toString() },
        });
        console.log('Actualizando IE: ', school?.name);
        console.log('DANE IE: ', school?.daneCode);
        console.log('Data OLD Grade Assigments: ', dataOldGradeAssigments?.length);
        for (let oldGradeAssigment of dataOldGradeAssigments) {
          let oldAcademicGrade = await this.repositoryAcademicGrade.findOneBy(
            oldGradeAssigment.academicGradeId
          );
          let oldAcademicAsignature = await this.repositoryAcademicAsignature.findOneBy(
            oldGradeAssigment.academicAsignatureId
          );
          console.log('oldAcademicGrade', oldAcademicGrade?.id?.toString());
          console.log('oldAcademicAsignature', oldAcademicAsignature?.id?.toString());
          if (oldAcademicGrade && oldAcademicAsignature) {
            let newAcademicGrade = await this.repositoryAcademicGrade.findBy({
              where: {
                schoolId: schoolId,
                schoolYearId: dataSchoolYear2023[0].id.toString(),
                generalAcademicGradeId: oldAcademicGrade?.generalAcademicGradeId,
                name: oldAcademicGrade?.name,
              },
            });
            let newAcademicAsignature = await this.repositoryAcademicAsignature.findBy({
              where: {
                schoolId: schoolId,
                schoolYearId: dataSchoolYear2023[0].id.toString(),
                name: oldAcademicAsignature?.name,
              },
            });
            console.log('newAcademicGrade', newAcademicGrade[0].id.toString());
            console.log('newAcademicAsignature', newAcademicAsignature[0].id.toString());
            if (newAcademicGrade?.length > 0 && newAcademicAsignature.length > 0) {
              const modelNewGradeAssigment = await this.repositoryGradeAssignment.create({
                academicGradeId: newAcademicGrade[0].id.toString(),
                academicAsignatureId: newAcademicAsignature[0].id.toString(),
                minHourlyIntensity: oldGradeAssigment.minHourlyIntensity,
                maxHourlyIntensity: oldGradeAssigment.maxHourlyIntensity,
                schoolId: school.id.toString(),
                schoolYearId: dataSchoolYear2023[0].id.toString(),
                active: true,
                version: 0,
              });
              let resultNewGradeAssigment = await this.repositoryGradeAssignment.save(
                modelNewGradeAssigment
              );
              let courses = await this.repositoryCourse.findBy({
                where: {
                  academicGradeId: resultNewGradeAssigment?.academicGradeId,
                  schoolYearId: resultNewGradeAssigment?.schoolYearId,
                },
              });
              if (courses) {
                for (let course of courses) {
                  let repositoryAcademicAsignatureCourse =
                    await this.repositoryAcademicAsignatureCourse.findBy({
                      where: {
                        academicAsignatureId: resultNewGradeAssigment?.academicAsignatureId,
                        courseId: course?.id.toString(),
                        schoolYearId: resultNewGradeAssigment?.schoolYearId,
                      },
                    });
                  if (repositoryAcademicAsignatureCourse.length === 0) {
                    const modelAcademicAsignatureCourse =
                      await this.repositoryAcademicAsignatureCourse.create({
                        hourlyIntensity: resultNewGradeAssigment?.minHourlyIntensity,
                        academicAsignatureId: resultNewGradeAssigment?.academicAsignatureId,
                        courseId: course?.id.toString(),
                        gradeAssignmentId: resultNewGradeAssigment?.id.toString(),
                        schoolYearId: resultNewGradeAssigment?.schoolYearId,
                        active: true,
                        version: 0,
                      });
                    let resultAcademicAsignatureCourse =
                      await this.repositoryAcademicAsignatureCourse.save(
                        modelAcademicAsignatureCourse
                      );
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAcademicAsignatureCourseSchoolYear() {
    let dataSchoolDane = [
      // "254003000046",
      '254385000431',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2023 },
      });
      if (dataSchool && dataSchoolYear2023) {
        let schoolId = school.id.toString();
        let schoolYearId = dataSchoolYear2023[0].id.toString();
        let dataCourses = await this.repositoryCourse.findBy({
          where: { schoolId: schoolId, schoolYearId: schoolYearId },
        });
        for (let course of dataCourses) {
          let dataAcademicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.findBy({
            courseId: course.id.toString(),
          });
          for (let academicAsignatureCourse of dataAcademicAsignatureCourse) {
            if (
              academicAsignatureCourse.schoolId == undefined ||
              academicAsignatureCourse.schoolId == null ||
              academicAsignatureCourse.schoolYearId == undefined ||
              academicAsignatureCourse.schoolYearId == null
            ) {
              let resultAcademicAsignatureCourse =
                await this.repositoryAcademicAsignatureCourse.save({
                  _id: new ObjectId(academicAsignatureCourse?.id?.toString()),
                  ...academicAsignatureCourse,
                  schoolId: course.schoolId,
                  schoolYearId: course.schoolYearId,
                  version: (academicAsignatureCourse?.version as number) + 1,
                });
            }
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async updateSchoolYearAllTeacher() {
    let schools = await this.repositorySchool.find();
    for (let school of schools) {
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      let schoolYearId = '';
      console.log('Activate Teachers');
      let dataSchoolYear2022 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2022 },
      });
      let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2023 },
      });
      //console.log("dataSchoolYear2022", dataSchoolYear2022[0].id.toString())
      //console.log("dataSchoolYear2023", dataSchoolYear2023[0].id.toString())
      if (dataSchoolYear2023?.length > 0) {
        schoolYearId = dataSchoolYear2023[0].id.toString();
      } else {
        if (dataSchoolYear2022?.length > 0) {
          schoolYearId = dataSchoolYear2022[0].id.toString();
        }
      }
      console.log('SchoolYearId: ', schoolYearId);
      let dataTeacher = await this.repositoryTeacher.findBy({
        where: { schoolId: { $in: [school?.id?.toString()] } },
      });
      console.log('Teacher: ', dataTeacher?.length);
      for (let teacher of dataTeacher) {
        //if (teacher.schoolYearId?.length == 0 || teacher.schoolYearId == undefined || teacher.schoolYearId == null) {
        let resultTeacher = await this.repositoryTeacher.save({
          _id: new ObjectId(teacher?.id?.toString()),
          ...teacher,
          //active: true,
          schoolYearId: schoolYearId,
          version: (teacher?.version as number) + 1,
        });
        //}
        // let resultUser = await this.repositoryUser.findOneBy(teacher?.userId?.toString());
        // if (resultUser?.roleId == undefined || resultUser?.roleId == null) {
        //   resultUser = await this.repositoryUser.save({
        //     _id: new ObjectId(resultUser?.id?.toString()),
        //     ...resultUser,
        //     roleId: "619551da882a2fb6525a3079",
        //     active: true,
        //     version: (resultUser?.version as number) + 1,
        //   });
        // }
      }
    }
    return true;
  }

  //Fixs personalizados

  @Mutation(() => Boolean)
  async fixAcademicAsignatureCourseSchoolSchoolYear2023() {
    let dataSchoolDane = [
      // "254003000046",
      '154680000015',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2023 },
      });
      if (dataSchool && dataSchoolYear2023) {
        let schoolId = school.id.toString();
        let schoolYearId = dataSchoolYear2023[0].id.toString();
        if (schoolYearId) {
          let dataAcademicGrades = await this.repositoryAcademicGrade.findBy({
            where: { schoolId: school.id.toString(), schoolYearId: schoolYearId },
          });
          for (let academicGrade of dataAcademicGrades) {
            console.log('Academic Grade: ', academicGrade?.name);
            //if (academicGrade?.name == "Primero") {
            let dataCourses = await this.repositoryCourse.findBy({
              where: {
                academicGradeId: academicGrade?.id?.toString(),
                schoolId: school.id.toString(),
                schoolYearId: schoolYearId,
              },
            });
            for (let course of dataCourses) {
              console.log('Academic Course: ', course?.name);
              //if (course?.id?.toString() == "640f812102637da270e690a5") {
              let dataAcademicAsignatureCourse =
                await this.repositoryAcademicAsignatureCourse.findBy({
                  courseId: course.id.toString(),
                  schoolYearId: schoolYearId,
                });
              for (let academicAsignatureCourse of dataAcademicAsignatureCourse) {
                let dataGradeAssigment = await this.repositoryGradeAssignment.findOneBy(
                  academicAsignatureCourse?.gradeAssignmentId
                );
                if (dataGradeAssigment) {
                  let dataAcademicAsignature = await this.repositoryAcademicAsignature.findOneBy(
                    dataGradeAssigment?.academicAsignatureId
                  );
                  if (dataAcademicAsignature) {
                    console.log('Academic Asignature: ', dataAcademicAsignature?.name);
                    let dataAcademicArea = await this.repositoryAcademicArea.findOneBy(
                      dataAcademicAsignature?.academicAreaId
                    );
                    if (dataAcademicArea) {
                      console.log('Academic Area: ', dataAcademicArea?.name);
                      console.log('Existe el Area');
                      if (
                        academicAsignatureCourse?.academicAsignatureId !==
                        dataGradeAssigment?.academicAsignatureId
                      ) {
                        let modelAcademicAsignatureCourse =
                          await this.repositoryAcademicAsignatureCourse.create({
                            ...academicAsignatureCourse,
                            academicAsignatureId: dataGradeAssigment?.academicAsignatureId,
                            version: (academicAsignatureCourse?.version as number) + 1,
                          });
                        let resultAcademicAsignatureCourse =
                          await this.repositoryAcademicAsignatureCourse.save(
                            modelAcademicAsignatureCourse
                          );
                      }
                    } else {
                      console.log('No Existe el Area');
                      let dataAcademicAsignatures = await this.repositoryAcademicAsignature.findBy({
                        where: {
                          name: dataAcademicAsignature?.name,
                          schoolId: school.id.toString(),
                          schoolYearId: schoolYearId,
                        },
                      });
                      let data = dataAcademicAsignatures.filter((academicAsignatureFilter: any) => {
                        if (
                          academicAsignatureFilter?.id?.toString() !==
                          dataAcademicAsignature?.id?.toString()
                        ) {
                          return academicAsignatureFilter;
                        }
                      });
                      if (data?.length == 1) {
                        //console.log(data);
                        console.log('Nueva Asignatura', data?.length);
                        dataAcademicArea = await this.repositoryAcademicArea.findOneBy(
                          data[0]?.academicAreaId
                        );
                        if (dataAcademicArea) {
                          console.log('Existe el Area');
                          //dataGradeAssigment?.academicAsignatureId = data[0]?.id?.toString();
                          let modelGradeAssigment = await this.repositoryGradeAssignment.create({
                            ...dataGradeAssigment,
                            academicAsignatureId: data[0]?.id?.toString(),
                            version: (dataGradeAssigment?.version as number) + 1,
                          });
                          console.log('modelGradeAssigmentOld', dataGradeAssigment);
                          console.log('modelGradeAssigment', modelGradeAssigment);
                          let resultGradeAssigment = await this.repositoryGradeAssignment.save(
                            modelGradeAssigment
                          );
                          let modelAcademicAsignatureCourse =
                            await this.repositoryAcademicAsignatureCourse.create({
                              ...academicAsignatureCourse,
                              academicAsignatureId: data[0]?.id?.toString(),
                              version: (academicAsignatureCourse?.version as number) + 1,
                            });
                          let resultAcademicAsignatureCourse =
                            await this.repositoryAcademicAsignatureCourse.save(
                              modelAcademicAsignatureCourse
                            );
                          console.log('modelAcademicAsignatureCourseOld', academicAsignatureCourse);
                          console.log(
                            'modelAcademicAsignatureCourse',
                            modelAcademicAsignatureCourse
                          );
                          console.log(
                            '************************************************************'
                          );
                        }
                      }
                    }
                  } else {
                    console.log('No Existe la asignatura');
                  }
                } else {
                  console.log('NO Existe la asignacion de grado');
                }
                // if (academicAsignatureCourse.schoolId == undefined || academicAsignatureCourse.schoolId == null || academicAsignatureCourse.schoolYearId == undefined || academicAsignatureCourse.schoolYearId == null) {
                //   let resultAcademicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.save({
                //     _id: new ObjectId(academicAsignatureCourse?.id?.toString()),
                //     ...academicAsignatureCourse,
                //     schoolId: course.schoolId,
                //     schoolYearId: course.schoolYearId,
                //     version: (academicAsignatureCourse?.version as number) + 1,
                //   });
                // }
              }
              //}
            }
            //}
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAcademicAsignatureWithDeleteAcademicArea() {
    let dataSchoolDane = [
      // "254003000046",
      '154680000015',
    ];
    let dataSchool = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolDane } },
    });
    for (let school of dataSchool) {
      console.log('Actualizando IE: ', school?.name);
      console.log('DANE IE: ', school?.daneCode);
      let dataSchoolYear2023 = await this.repositorySchoolYear.findBy({
        where: { schoolId: school.id.toString(), schoolYear: 2023 },
      });
      if (dataSchool && dataSchoolYear2023) {
        let schoolId = school.id.toString();
        let schoolYearId = dataSchoolYear2023[0].id.toString();
        if (schoolYearId) {
          let dataAcademicAsignatures = await this.repositoryAcademicAsignature.findBy({
            where: {
              schoolId: school.id.toString(),
              schoolYearId: schoolYearId,
            },
          });
          for (let academicAsignature of dataAcademicAsignatures) {
            let dataAcademicArea = await this.repositoryAcademicArea.findOneBy(
              academicAsignature.academicAreaId
            );
            if (!dataAcademicArea) {
              let modelAcademicAsignature = await this.repositoryAcademicAsignature.create({
                ...academicAsignature,
                active: false,
                version: (academicAsignature?.version as number) + 1,
              });
              await this.repositoryAcademicAsignature.save(modelAcademicAsignature);
            } else {
              let modelAcademicAsignature = await this.repositoryAcademicAsignature.create({
                ...academicAsignature,
                schoolYearId: dataAcademicArea?.schoolYearId,
                version: (academicAsignature?.version as number) + 1,
              });
              await this.repositoryAcademicAsignature.save(modelAcademicAsignature);
            }
          }
        }
      }
    }
    return true;
  }
}
