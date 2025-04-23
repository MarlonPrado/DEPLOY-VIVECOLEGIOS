import { ObjectId } from 'mongodb';
import report from 'puppeteer-report';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import fs from 'fs-extra';
import hbs from 'handlebars';
import puppeteer from 'puppeteer';
import {
  AcademicAreaCoursePeriodValuationRepository,
  AcademicAreaCourseYearValuationRepository,
  AcademicAreaRepository,
  AcademicAsignatureCoursePeriodValuationRepository,
  AcademicAsignatureCourseRepository,
  AcademicAsignatureCourseYearValuationRepository,
  AcademicAsignatureRepository,
  AcademicDayRepository,
  AcademicGradeRepository,
  AcademicPeriodRepository,
  AverageAcademicPeriodCourseRepository,
  AverageAcademicPeriodStudentRepository,
  CampusRepository,
  CourseRepository,
  EvidenceLearningRepository,
  ExperienceLearningRepository,
  LearningRepository,
  PerformanceLevelRepository,
  SchoolConfigurationRepository,
  SchoolRepository,
  SchoolYearRepository,
  StudentBehaviourRepository,
  StudentRepository,
  TeacherRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { PerformanceLevelType } from '../../enums/PerformanceLevelType';
import { ValuationType } from '../../enums/ValuationType';
import { IContext } from '../../interfaces/IContext';
import { AcademicAreaCoursePeriodValuation } from '../../models/CampusAdministrator/AcademicAreaCoursePeriodValuation';
import { AcademicAreaCourseYearValuation } from '../../models/CampusAdministrator/AcademicAreaCourseYearValuation';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicAsignatureCoursePeriodValuation } from '../../models/CampusAdministrator/AcademicAsignatureCoursePeriodValuation';
import { AcademicAsignatureCourseYearValuation } from '../../models/CampusAdministrator/AcademicAsignatureCourseYearValuation';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';
import { AverageAcademicPeriodCourse } from '../../models/CampusAdministrator/AverageAcademicPeriodCourse';
import { AverageAcademicPeriodStudent } from '../../models/CampusAdministrator/AverageAcademicPeriodStudent';
import { Course } from '../../models/CampusAdministrator/Course';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { StudentBehaviour } from '../../models/CampusAdministrator/StudentBehaviour';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { EvidenceLearning } from '../../models/SchoolAdministrator/EvidenceLearning';
import { Learning } from '../../models/SchoolAdministrator/Learning';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolConfiguration } from '../../models/SchoolAdministrator/SchoolConfiguration';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { PerformanceLevelResolver } from './PerformanceLevelResolver';

import path from 'path';
const merge = require('easy-pdf-merge');

@Resolver(SchoolConfiguration)
export class PerformanceReportResolver {
  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(Teacher)
  private repositoryTeacher = TeacherRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(AcademicDay)
  private repositoryAcademicDay = AcademicDayRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(AcademicAsignature)
  private repositoryAcademicAsignature = AcademicAsignatureRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(AcademicAsignatureCoursePeriodValuation)
  private repositoryAcademicAsignatureCoursePeriodValuation =
    AcademicAsignatureCoursePeriodValuationRepository;

  @InjectRepository(AcademicAreaCoursePeriodValuation)
  private repositoryAcademicAreaCoursePeriodValuation = AcademicAreaCoursePeriodValuationRepository;

  @InjectRepository(AcademicAsignatureCourseYearValuation)
  private repositoryAcademicAsignatureCourseYearValuation =
    AcademicAsignatureCourseYearValuationRepository;

  @InjectRepository(AcademicAreaCourseYearValuation)
  private repositoryAcademicAreaCourseYearValuation = AcademicAreaCourseYearValuationRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @InjectRepository(AverageAcademicPeriodStudent)
  private repositoryAverageAcademicPeriodStudent = AverageAcademicPeriodStudentRepository;

  @InjectRepository(AverageAcademicPeriodCourse)
  private repositoryAverageAcademicPeriodCourse = AverageAcademicPeriodCourseRepository;

  @InjectRepository(Learning)
  private repositoryLearning = LearningRepository;

  @InjectRepository(EvidenceLearning)
  private repositoryEvidenceLearning = EvidenceLearningRepository;

  @InjectRepository(ExperienceLearning)
  private repositoryExperienceLearning = ExperienceLearningRepository;

  @InjectRepository(SchoolConfiguration)
  private repositorySchoolConfiguration = SchoolConfigurationRepository;

  @InjectRepository(StudentBehaviour)
  private repositoryStudentBehaviour = StudentBehaviourRepository;

  private performanceLevelResolver = new PerformanceLevelResolver();

  // @Mutation(() => Boolean)
  // async generatePerformanceLevelExample(
  //   @Arg('id', () => String) id: string,
  //   @Ctx() context: IContext
  // ): Promise<Boolean | null> {
  //   var fs = require('fs');
  //   //var pdf = require('html-pdf');
  //   var html = fs.readFileSync('./app/reports/performanceReport/PerformanceReport.html', 'utf8');
  //   var options = {
  //     format: 'Letter', border: {
  //       top: "5mm",
  //       right: "5mm",
  //       bottom: "5mm",
  //       left: "5mm"
  //     },
  //   };
  //   pdf.create(html, options).toFile('./businesscard.pdf', function (err: any, res: any) {
  //     if (err) return console.log(err);
  //     console.log(res); // { filename: '/app/businesscard.pdf' }
  //   });
  //   return true;
  // }

  @Mutation(() => String)
  async generatePerformanceReportCourse(
    @Arg('id', () => String) id: string,
    @Arg('schoolId', () => String) schoolId: string,
    @Arg('schoolYearId', () => String) schoolYearId: string,
    @Arg('academicPeriodId', () => String) academicPeriodId: string,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
    @Arg('format', () => String) format: String,
    @Ctx() context: IContext,
  ): Promise<String | undefined> {
    // id = "6298c6ede686a07d17a79e2c";
    let data = {};
    let course = await this.repositoryCourse.findOneBy(id);
    if (course) {
      let campus = await this.repositoryCampus.findOneBy(course?.campusId);
      let school = await this.repositorySchool.findOneBy(schoolId);
      let schoolConfigurationCountDigitsPerformanceLevel =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'COUNT_DIGITS_PERFORMANCE_LEVEL', active: true },
        });
      let schoolConfigurationCountDigitsAverageStudent =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'COUNT_DIGITS_AVERAGE_STUDENT', active: true },
        });
      let schoolConfigurationCountDigitsAverageCourse =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'COUNT_DIGITS_AVERAGE_COURSE', active: true },
        });
      let schoolConfigurationTypeLearningsDisplay = await this.repositorySchoolConfiguration.findBy(
        {
          where: { schoolId, code: 'REPORT_PERFORMANCE_TYPE_LEARNINGS_DISPLAY', active: true },
        },
      );
      let schoolConfigurationTypeEvidenceLearningsDisplay =
        await this.repositorySchoolConfiguration.findBy({
          where: {
            schoolId,
            code: 'REPORT_PERFORMANCE_TYPE_EVIDENCE_LEARNINGS_DISPLAY',
            active: true,
          },
        });
      let schoolConfigurationTypeDisplayDetails = await this.repositorySchoolConfiguration.findBy({
        where: { schoolId, code: 'REPORT_PERFORMANCE_TYPE_DISPLAY_DETAILS', active: true },
      });
      let schoolConfigurationReportPerformanceType =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_TYPE', active: true },
        });
      let schoolConfigurationReportPerformanceSignatureType =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_SIGNATURE_TYPE', active: true },
        });
      let schoolConfigurationReportPerformanceBehaviourStudent =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_BEHAVIOUR_STUDENT', active: true },
        });
      let schoolConfigurationReportPerformanceBehaviourStudentType =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_BEHAVIOUR_STUDENT_TYPE', active: true },
        });
      let schoolConfigurationReportPerformanceAreaAsignatureType =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_AREA_ASIGNATURE_TYPE', active: true },
        });
      let schoolConfigurationReportPerformanceTitleSignatureTeacherCourse =
        await this.repositorySchoolConfiguration.findBy({
          where: {
            schoolId,
            code: 'REPORT_PERFORMANCE_TITLE_SIGNATURE_TEACHER_COURSE',
            active: true,
          },
        });
      let schoolConfigurationReportPerformanceTitleSignaturePrincipal =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_TITLE_SIGNATURE_PRINCIPAL', active: true },
        });
      let schoolConfigurationReportPerformanceShowFinalValuation =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_SHOW_FINAL_VALUATION', active: true },
        });
      let schoolConfigurationReportPerformanceShowRecoverylValuation =
        await this.repositorySchoolConfiguration.findBy({
          where: { schoolId, code: 'REPORT_PERFORMANCE_SHOW_RECOVERY_VALUATION', active: true },
        });
      let academicGrade = await this.repositoryAcademicGrade.findOneBy(course?.academicGradeId);
      let titular = await this.repositoryTeacher.findOneBy(course?.teacherId);
      let titularUser = await this.repositoryUser.findOneBy(titular?.userId);
      let academicDay = await this.repositoryAcademicDay.findOneBy(course?.academicDayId);
      let schoolYear = await this.repositorySchoolYear.findOneBy(course?.schoolYearId);
      let academicPeriods = await this.repositoryAcademicPeriod.findBy({
        where: {
          schoolYearId: schoolYearId,
          schoolId: schoolId,
          active: true,
        },
        order: { order: 1 },
      });
      let academicPeriod = await this.repositoryAcademicPeriod.findOneBy(academicPeriodId);
      let academicAsignaturesCourse = await this.repositoryAcademicAsignatureCourse.findBy({
        where: { courseId: course?.id?.toString() },
      });
      if (academicAsignaturesCourse?.length > 0) {
        data = { ...data, schoolPrincipalSignature: school?.textPrincipalSignature };
        data = {
          ...data,
          imgPrincipalSignature: school?.imgPrincipalSignature
            ? school?.imgPrincipalSignature
            : '*',
        };
        data = {
          ...data,
          imgSecretarySignature: school?.imgSecretarySignature
            ? school?.imgSecretarySignature
            : '*',
        };
        data = { ...data, schoolName: school?.name };
        data = { ...data, schoolResolution: school?.textResolution };
        data = { ...data, schoolAddress: school?.textAddress };
        data = { ...data, schoolDaneNit: school?.textDaneNit };
        data = { ...data, schoolLogo: school?.logo };
        data = { ...data, studentAcademicGradeName: academicGrade?.name };
        data = { ...data, studentAcademicCourseName: course?.name };
        data = { ...data, campusName: campus?.name };
        data = { ...data, titular: titularUser?.name + ' ' + titularUser?.lastName };
        data = {
          ...data,
          imgTitularSignature: titularUser?.signaturePhoto ? titularUser?.signaturePhoto : '*',
        };
        data = { ...data, studentAcademicDayName: academicDay?.name };
        data = { ...data, academicPeriodName: academicPeriod?.name };
        data = { ...data, schoolYear: schoolYear?.schoolYear };
        data = { ...data, academicPeriodId: academicPeriod?.id?.toString() };
        let areasAux: any[] = [];
        let asignaturesAux: any[] = [];
        let performanceLevelType: any = null;
        if (academicAsignaturesCourse?.length > 0) {
          let performanceLevels =
            await this.performanceLevelResolver.getAllPerformanceLevelAcademicAsignatureCourseFinal(
              {},
              academicAsignaturesCourse[0]?.id?.toString() + '',
            );
          if (performanceLevels) {
            performanceLevelType = performanceLevels?.edges[0]?.node?.type;
            data = { ...data, performanceLevelType: performanceLevelType };
          }
        }
        for (let asignatureCourse of academicAsignaturesCourse) {
          let academicAsignature = await this.repositoryAcademicAsignature.findOneBy(
            asignatureCourse?.academicAsignatureId,
          );
          let academicArea = await this.repositoryAcademicArea.findOneBy(
            academicAsignature?.academicAreaId,
          );
          if (academicArea !== null) {
            asignaturesAux.push(academicAsignature);
            areasAux.push(academicArea);
          }
        }
        const ids = areasAux.map((o) => o.id?.toString());
        const count: any = {};
        ids.forEach((element) => {
          count[element] = (count[element] || 0) + 1;
        });
        const filtered = areasAux.filter(
          ({ id }, index) => !ids.includes(id?.toString(), index + 1),
        );
        for (let filter of filtered) {
          filter.count = count[filter?.id];
        }
        let ultimateOrderAcademicPeriod = 0;
        let ultimateAcademicPeriod: any = null;
        academicPeriods.map((academicPeriod) => {
          //console.log("academicPeriod", academicPeriod);
          if (academicPeriod?.order) {
            if (academicPeriod?.order > ultimateOrderAcademicPeriod) {
              ultimateOrderAcademicPeriod = academicPeriod?.order;
              ultimateAcademicPeriod = academicPeriod;
            }
          }
        });
        //console.log("ultimateOrderAcademicPeriod", ultimateOrderAcademicPeriod);
        //console.log("ultimateAcademicPeriod", ultimateAcademicPeriod);

        let academicPeriodsData: any[] = [];
        academicPeriods.map((academicPeriod) => {
          let academicPeriodData = {
            name: academicPeriod?.name,
            id: academicPeriod?.id?.toString(),
            order: academicPeriod?.order,
          };
          academicPeriodsData.push(academicPeriodData);
        });
        let academicPeriodData = { name: 'FINAL', id: 'FINAL', order: 99 };
        academicPeriodsData.push(academicPeriodData);
        data = { ...data, academicPeriods: academicPeriodsData };
        data = {
          ...data,
          academicPeriodsCount: `3fr repeat(${academicPeriodsData?.length}, 1fr);`,
        };
        let studentsId = course?.studentsId;
        if (studentId !== null && studentId?.length > 0) {
          studentsId = [studentId];
        } else {
          let studentsAux = studentsId;
          if (studentsAux) {
            let studentsIds = [];
            for (let studentId of studentsAux) {
              studentsIds?.push(new ObjectId(studentId.toString()));
            }
            let students = await this.repositoryStudent.findBy({
              where: { _id: { $in: studentsIds } },
              order: { code: 1 },
            });
            //console.log(students);
            studentsId = [];
            for (let student of students) {
              studentsId.push(student?.id?.toString());
            }
          }
        }
        areasAux = filtered.sort(this.compareOrderAcademicArea);
        let areas: any[] = [];
        // areasAux.map((area) => {
        let typeDisplayDetails = 'EVIDENCE_LEARNING';
        if (schoolConfigurationTypeDisplayDetails?.length > 0) {
          typeDisplayDetails = schoolConfigurationTypeDisplayDetails[0]?.valueString
            ? schoolConfigurationTypeDisplayDetails[0]?.valueString
            : 'EVIDENCE_LEARNING';
        }
        let typeEvidenceLearningsDisplay = 'SPECIFIC';
        if (schoolConfigurationTypeEvidenceLearningsDisplay?.length > 0) {
          typeEvidenceLearningsDisplay = schoolConfigurationTypeEvidenceLearningsDisplay[0]
            ?.valueString
            ? schoolConfigurationTypeEvidenceLearningsDisplay[0]?.valueString
            : 'SPECIFIC';
        }
        let typeLearningsDisplay = 'SPECIFIC';
        if (schoolConfigurationTypeLearningsDisplay?.length > 0) {
          typeLearningsDisplay = schoolConfigurationTypeLearningsDisplay[0]?.valueString
            ? schoolConfigurationTypeLearningsDisplay[0]?.valueString
            : 'SPECIFIC';
        }
        let reportPerformanceType = 'DETAILS';
        if (schoolConfigurationReportPerformanceType?.length > 0) {
          reportPerformanceType = schoolConfigurationReportPerformanceType[0]?.valueString
            ? schoolConfigurationReportPerformanceType[0]?.valueString
            : 'DETAILS';
        }
        let countDigitsPerformanceLevel = 2;
        if (schoolConfigurationCountDigitsPerformanceLevel?.length > 0) {
          countDigitsPerformanceLevel = schoolConfigurationCountDigitsPerformanceLevel[0]
            ?.valueNumber
            ? schoolConfigurationCountDigitsPerformanceLevel[0]?.valueNumber
            : 2;
        }
        let countDigitsAverageStudent = 2;
        if (schoolConfigurationCountDigitsAverageStudent?.length > 0) {
          countDigitsAverageStudent = schoolConfigurationCountDigitsAverageStudent[0]?.valueNumber
            ? schoolConfigurationCountDigitsAverageStudent[0]?.valueNumber
            : 2;
        }
        let countDigitsAverageCourse = 2;
        if (schoolConfigurationCountDigitsAverageCourse?.length > 0) {
          countDigitsAverageCourse = schoolConfigurationCountDigitsAverageCourse[0]?.valueNumber
            ? schoolConfigurationCountDigitsAverageCourse[0]?.valueNumber
            : 2;
        }
        let reportPerformanceSignatureType = 'TEACHER_COURSE';
        if (schoolConfigurationReportPerformanceSignatureType?.length > 0) {
          reportPerformanceSignatureType = schoolConfigurationReportPerformanceSignatureType[0]
            ?.valueString
            ? schoolConfigurationReportPerformanceSignatureType[0]?.valueString
            : 'TEACHER_COURSE';
        }
        let reportPerformanceBehaviourStudent = 'DISPLAY';
        if (schoolConfigurationReportPerformanceBehaviourStudent?.length > 0) {
          reportPerformanceBehaviourStudent =
            schoolConfigurationReportPerformanceBehaviourStudent[0]?.valueString
              ? schoolConfigurationReportPerformanceBehaviourStudent[0]?.valueString
              : 'DISPLAY';
        }
        let reportPerformanceBehaviourStudentType = 'QUALITATIVE';
        if (schoolConfigurationReportPerformanceBehaviourStudentType?.length > 0) {
          reportPerformanceBehaviourStudentType =
            schoolConfigurationReportPerformanceBehaviourStudentType[0]?.valueString
              ? schoolConfigurationReportPerformanceBehaviourStudentType[0]?.valueString
              : 'QUALITATIVE';
        }
        let reportPerformanceAreaAsignatureType = 'AREA_ASIGNATURE';
        if (schoolConfigurationReportPerformanceAreaAsignatureType?.length > 0) {
          reportPerformanceAreaAsignatureType =
            schoolConfigurationReportPerformanceAreaAsignatureType[0]?.valueString
              ? schoolConfigurationReportPerformanceAreaAsignatureType[0]?.valueString
              : 'AREA_ASIGNATURE';
        }
        let reportPerformanceTitleSignatureTeacherCourse = 'Titular';
        if (schoolConfigurationReportPerformanceTitleSignatureTeacherCourse?.length > 0) {
          reportPerformanceTitleSignatureTeacherCourse =
            schoolConfigurationReportPerformanceTitleSignatureTeacherCourse[0]?.valueString
              ? schoolConfigurationReportPerformanceTitleSignatureTeacherCourse[0]?.valueString
              : 'Titular';
        }
        let reportPerformanceTitleSignaturePrincipal = 'Rector';
        if (schoolConfigurationReportPerformanceTitleSignaturePrincipal?.length > 0) {
          reportPerformanceTitleSignaturePrincipal =
            schoolConfigurationReportPerformanceTitleSignaturePrincipal[0]?.valueString
              ? schoolConfigurationReportPerformanceTitleSignaturePrincipal[0]?.valueString
              : 'Rector';
        }
        let reportPerformanceShowFinalValuation = 'NO';
        if (schoolConfigurationReportPerformanceShowFinalValuation?.length > 0) {
          reportPerformanceShowFinalValuation =
            schoolConfigurationReportPerformanceShowFinalValuation[0]?.valueString
              ? schoolConfigurationReportPerformanceShowFinalValuation[0]?.valueString
              : 'NO';
        }
        let reportPerformanceShowRecoverylValuation = 'NO';
        if (schoolConfigurationReportPerformanceShowRecoverylValuation?.length > 0) {
          reportPerformanceShowRecoverylValuation =
            schoolConfigurationReportPerformanceShowRecoverylValuation[0]?.valueString
              ? schoolConfigurationReportPerformanceShowRecoverylValuation[0]?.valueString
              : 'NO';
        }
        data = {
          ...data,
          reportPerformanceTitleSignatureTeacherCourse:
            reportPerformanceTitleSignatureTeacherCourse,
        };
        data = {
          ...data,
          reportPerformanceTitleSignaturePrincipal: reportPerformanceTitleSignaturePrincipal,
        };
        data = {
          ...data,
          reportPerformanceAreaAsignatureType: reportPerformanceAreaAsignatureType,
        };
        data = { ...data, reportPerformanceBehaviourStudent: reportPerformanceBehaviourStudent };
        data = {
          ...data,
          reportPerformanceBehaviourStudentType: reportPerformanceBehaviourStudentType,
        };
        data = { ...data, reportPerformanceSignatureType: reportPerformanceSignatureType };
        data = { ...data, countDigitsAverageCourse: countDigitsAverageCourse };
        data = { ...data, countDigitsPerformanceLevel: countDigitsPerformanceLevel };
        data = { ...data, countDigitsAverageStudent: countDigitsAverageStudent };
        data = { ...data, typeDisplayDetails: typeDisplayDetails };
        data = { ...data, typeEvidenceLearningsDisplay: typeEvidenceLearningsDisplay };
        data = { ...data, typeLearningsDisplay: typeLearningsDisplay };
        data = { ...data, reportPerformanceType: reportPerformanceType };
        for (let area of areasAux) {
          let asignaturesAreaData: any[] = [];
          for (let asignature of asignaturesAux) {
            if (asignature?.academicAreaId === area?.id?.toString()) {
              let evidencesIdAux: String[] = [];
              let learningsIdAux: String[] = [];
              let evidenceLearnings: any[] = [];
              let learnings: any[] = [];
              if (reportPerformanceType == 'DETAILS') {
                switch (typeDisplayDetails) {
                  case 'EVIDENCE_LEARNING':
                    switch (typeEvidenceLearningsDisplay) {
                      case 'ALL':
                        let learnigs = await this.repositoryLearning.findBy({
                          where: {
                            academicAsignatureId: asignature?.id?.toString(),
                            academicPeriodsId: { $in: [academicPeriod?.id?.toString()] },
                            academicGradeId: course?.academicGradeId,
                            active: true,
                          },
                        });
                        for (let learning of learnigs) {
                          let evidenceLearningAux = await this.repositoryEvidenceLearning.findBy({
                            where: {
                              learningId: learning?.id?.toString(),
                              active: true,
                            },
                          });
                          for (let evidenceLearning of evidenceLearningAux) {
                            evidenceLearnings.push(evidenceLearning);
                          }
                        }
                        break;
                      case 'SPECIFIC':
                        for (let asignatureCourse of academicAsignaturesCourse) {
                          if (
                            asignatureCourse?.academicAsignatureId == asignature?.id?.toString()
                          ) {
                            let experienceLearnings =
                              await this.repositoryExperienceLearning.findBy({
                                where: {
                                  academicPeriodId: academicPeriod?.id?.toString(),
                                  academicAsignatureCourseId: asignatureCourse?.id?.toString(),
                                  active: true,
                                },
                              });
                            for (let experienceLearning of experienceLearnings) {
                              if (
                                experienceLearning?.evidenceLearningsId &&
                                experienceLearning?.evidenceLearningsId?.length > 0
                              ) {
                                for (let evidence of experienceLearning?.evidenceLearningsId) {
                                  evidencesIdAux.push(evidence);
                                }
                              }
                            }
                          }
                        }
                        evidencesIdAux = evidencesIdAux.filter(
                          (ele, pos) => evidencesIdAux.indexOf(ele) == pos,
                        );
                        let evidencesId: any[] = [];
                        for (let evidenceId of evidencesIdAux) {
                          evidencesId?.push(new ObjectId(evidenceId.toString()));
                        }
                        evidenceLearnings = await this.repositoryEvidenceLearning.findBy({
                          where: { _id: { $in: evidencesId } },
                        });
                        break;
                    }
                    break;
                  case 'LEARNING':
                    switch (typeLearningsDisplay) {
                      case 'ALL':
                        let learnigsAux = await this.repositoryLearning.findBy({
                          where: {
                            academicAsignatureId: asignature?.id?.toString(),
                            academicPeriodsId: { $in: [academicPeriod?.id?.toString()] },
                            academicGradeId: course?.academicGradeId,
                            active: true,
                          },
                        });
                        for (let learning of learnigsAux) {
                          learnings.push(learning);
                        }
                        break;
                      case 'SPECIFIC':
                        for (let asignatureCourse of academicAsignaturesCourse) {
                          if (
                            asignatureCourse?.academicAsignatureId == asignature?.id?.toString()
                          ) {
                            //console.log(asignature?.name, asignatureCourse?.academicAsignatureId)
                            let experienceLearnings =
                              await this.repositoryExperienceLearning.findBy({
                                where: {
                                  academicPeriodId: academicPeriod?.id?.toString(),
                                  academicAsignatureCourseId: asignatureCourse?.id?.toString(),
                                  active: true,
                                },
                              });
                            for (let experienceLearning of experienceLearnings) {
                              if (
                                experienceLearning?.learningsId &&
                                experienceLearning?.learningsId?.length > 0
                              ) {
                                for (let learning of experienceLearning?.learningsId) {
                                  learningsIdAux.push(learning);
                                }
                                //console.log(experienceLearning?.learningsId)
                              }
                            }
                          }
                        }
                        learningsIdAux = learningsIdAux.filter(
                          (ele, pos) => learningsIdAux.indexOf(ele) == pos,
                        );
                        let learningsId: any[] = [];
                        for (let learningId of learningsIdAux) {
                          learningsId?.push(new ObjectId(learningId.toString()));
                        }
                        learnings = await this.repositoryLearning.findBy({
                          where: { _id: { $in: learningsId } },
                        });
                        break;
                    }
                    break;
                }
              }
              let hourlyIntensity = 0;
              for (let asignatureCourse of academicAsignaturesCourse) {
                if (asignatureCourse?.academicAsignatureId == asignature?.id?.toString()) {
                  hourlyIntensity = asignatureCourse?.hourlyIntensity
                    ? asignatureCourse?.hourlyIntensity
                    : 0;
                }
              }
              let asignaturesData = {
                name: asignature?.name,
                id: asignature?.id?.toString(),
                academicPeriods: academicPeriodsData,
                evidenceLearnings: evidenceLearnings,
                learnings: learnings,
                ihs: hourlyIntensity,
              };
              //console.log(asignaturesData)
              asignaturesAreaData.push(asignaturesData);
            }
          }
          let areaData = {
            name: area?.name,
            id: area?.id?.toString(),
            asignatures: asignaturesAreaData,
            academicPeriods: academicPeriodsData,
          };
          areas.push(areaData);
        }
        data = { ...data, areas: areas };
        let averageAcademicPeriodCourseList =
          await this.repositoryAverageAcademicPeriodCourse.findBy({
            where: {
              courseId: id,
              academicPeriodId,
            },
          });
        switch (performanceLevelType) {
          case PerformanceLevelType.QUALITATIVE:
            if (averageAcademicPeriodCourseList[0]?.performanceLevelId != null) {
              let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                averageAcademicPeriodCourseList[0]?.performanceLevelId,
              );
              data = { ...data, promCourse: performanceLevel?.name };
            } else {
              data = { ...data, promCourse: '' };
            }
            break;
          case PerformanceLevelType.QUANTITATIVE:
            data = {
              ...data,
              promCourse:
                averageAcademicPeriodCourseList[0]?.assessment?.toFixed(countDigitsAverageCourse),
            };
            break;
        }
        //console.log("aca vamos bien", academicAsignaturesCourse);
        let urls: any[] = [];
        if (studentsId) {
          let promisesGeneratePDF: any[] = [];
          // for (let studentId of [studentsId[0]]) {
          for (let studentId of studentsId) {
            let dataPDF = { ...data };
            let student = await this.repositoryStudent.findOneBy(studentId + '');
            //console.log("codigo", student?.code);
            let studentUser = await this.repositoryUser.findOneBy(student?.userId);
            dataPDF = { ...dataPDF, studentName: studentUser?.name + ' ' + studentUser?.lastName };
            dataPDF = { ...dataPDF, studentDocumentNumber: studentUser?.documentNumber };
            let averageAcademicPeriodStudentList =
              await this.repositoryAverageAcademicPeriodStudent.findBy({
                where: {
                  courseId: id,
                  academicPeriodId,
                  studentId,
                },
              });
            switch (performanceLevelType) {
              case PerformanceLevelType.QUALITATIVE:
                if (averageAcademicPeriodStudentList[0]?.performanceLevelId != null) {
                  let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                    averageAcademicPeriodStudentList[0]?.performanceLevelId,
                  );
                  dataPDF = { ...dataPDF, promStudent: performanceLevel?.name };
                } else {
                  dataPDF = { ...dataPDF, promStudent: '' };
                }
                break;
              case PerformanceLevelType.QUANTITATIVE:
                dataPDF = {
                  ...dataPDF,
                  promStudent:
                    averageAcademicPeriodStudentList[0]?.assessment?.toFixed(
                      countDigitsAverageStudent,
                    ),
                };
                break;
            }
            dataPDF = { ...dataPDF, puestoEstudiante: averageAcademicPeriodStudentList[0]?.score };
            let notesAsignatures = [];
            for (let asignatureCourse of academicAsignaturesCourse) {
              let academicAsignature = await this.repositoryAcademicAsignature.findOneBy(
                asignatureCourse?.academicAsignatureId,
              );
              let academicArea = await this.repositoryAcademicArea.findOneBy(
                academicAsignature?.academicAreaId,
              );
              let teacherAsignatureCourse = await this.repositoryTeacher.findOneBy(
                asignatureCourse?.teacherId,
              );
              let teacherUserAsignatureCourse = await this.repositoryUser.findOneBy(
                teacherAsignatureCourse?.userId,
              );
              for (let period of academicPeriods) {
                if (period?.order && academicPeriod?.order) {
                  if (period?.order <= academicPeriod?.order) {
                    let notesAsignature =
                      await this.repositoryAcademicAsignatureCoursePeriodValuation.findBy({
                        academicAsignatureCourseId: asignatureCourse?.id?.toString(),
                        academicPeriodId: period?.id?.toString(),
                        studentId,
                      });
                    if (notesAsignature?.length > 0) {
                      if (notesAsignature?.length == 1) {
                        let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                          notesAsignature[0]?.performanceLevelId,
                        );
                        notesAsignatures.push({
                          assessment: notesAsignature[0]?.assessment?.toFixed(
                            countDigitsPerformanceLevel,
                          ),
                          academicPeriodId: notesAsignature[0]?.academicPeriodId,
                          performanceLevel: performanceLevel?.name,
                          asignatureId: academicAsignature?.id?.toString(),
                          areaId: academicArea?.id?.toString(),
                          teacher:
                            teacherUserAsignatureCourse?.name +
                            ' ' +
                            teacherUserAsignatureCourse?.lastName,
                        });
                      } else {
                        let valuationAsignatureCalculate;
                        let valuationAsignatureDefinitive;
                        let valuationAsignatureRecovery;
                        for (let notesAsigna of notesAsignature) {
                          switch (notesAsigna?.valuationType) {
                            case ValuationType.CALCULATE:
                              valuationAsignatureCalculate = notesAsigna;
                              break;
                            case ValuationType.DEFINITIVE:
                              valuationAsignatureDefinitive = notesAsigna;
                              break;
                            case ValuationType.RECOVERY:
                              valuationAsignatureRecovery = notesAsigna;
                              break;
                          }
                        }
                        if (valuationAsignatureRecovery) {
                          let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                            valuationAsignatureRecovery?.performanceLevelId,
                          );
                          ///configuration recovery
                          if (reportPerformanceShowRecoverylValuation == 'YES') {
                            notesAsignatures.push({
                              assessment:
                                valuationAsignatureCalculate?.assessment?.toFixed(
                                  countDigitsPerformanceLevel,
                                ) +
                                ' - ' +
                                valuationAsignatureRecovery?.assessment?.toFixed(
                                  countDigitsPerformanceLevel,
                                ) +
                                ' (N)',
                              academicPeriodId: valuationAsignatureRecovery?.academicPeriodId,
                              performanceLevel: performanceLevel?.name,
                              asignatureId: academicAsignature?.id?.toString(),
                              areaId: academicArea?.id?.toString(),
                              teacher:
                                teacherUserAsignatureCourse?.name +
                                ' ' +
                                teacherUserAsignatureCourse?.lastName,
                            });
                          } else {
                            notesAsignatures.push({
                              assessment: valuationAsignatureRecovery?.assessment?.toFixed(
                                countDigitsPerformanceLevel,
                              ),
                              academicPeriodId: valuationAsignatureRecovery?.academicPeriodId,
                              performanceLevel: performanceLevel?.name,
                              asignatureId: academicAsignature?.id?.toString(),
                              areaId: academicArea?.id?.toString(),
                              teacher:
                                teacherUserAsignatureCourse?.name +
                                ' ' +
                                teacherUserAsignatureCourse?.lastName,
                            });
                          }
                        } else {
                          if (valuationAsignatureDefinitive) {
                            let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                              valuationAsignatureDefinitive?.performanceLevelId,
                            );
                            notesAsignatures.push({
                              assessment: valuationAsignatureDefinitive?.assessment?.toFixed(
                                countDigitsPerformanceLevel,
                              ),
                              academicPeriodId: valuationAsignatureDefinitive?.academicPeriodId,
                              performanceLevel: performanceLevel?.name,
                              asignatureId: academicAsignature?.id?.toString(),
                              areaId: academicArea?.id?.toString(),
                              teacher:
                                teacherUserAsignatureCourse?.name +
                                ' ' +
                                teacherUserAsignatureCourse?.lastName,
                            });
                          } else {
                            if (valuationAsignatureCalculate) {
                              let performanceLevel =
                                await this.repositoryPerformanceLevel.findOneBy(
                                  valuationAsignatureCalculate?.performanceLevelId,
                                );
                              notesAsignatures.push({
                                assessment: valuationAsignatureCalculate?.assessment?.toFixed(
                                  countDigitsPerformanceLevel,
                                ),
                                academicPeriodId: valuationAsignatureCalculate?.academicPeriodId,
                                performanceLevel: performanceLevel?.name,
                                asignatureId: academicAsignature?.id?.toString(),
                                areaId: academicArea?.id?.toString(),
                                teacher:
                                  teacherUserAsignatureCourse?.name +
                                  ' ' +
                                  teacherUserAsignatureCourse?.lastName,
                              });
                            }
                          }
                        }
                      }
                    } else {
                      notesAsignatures.push({
                        assessment: '-',
                        academicPeriodId: period?.id?.toString(),
                        performanceLevel: '-',
                        asignatureId: academicAsignature?.id?.toString(),
                        areaId: academicArea?.id?.toString(),
                        teacher:
                          teacherUserAsignatureCourse?.name +
                          ' ' +
                          teacherUserAsignatureCourse?.lastName,
                      });
                    }
                  } else {
                    notesAsignatures.push({
                      assessment: '-',
                      academicPeriodId: period?.id?.toString(),
                      performanceLevel: '-',
                      asignatureId: academicAsignature?.id?.toString(),
                      areaId: academicArea?.id?.toString(),
                      teacher:
                        teacherUserAsignatureCourse?.name +
                        ' ' +
                        teacherUserAsignatureCourse?.lastName,
                    });
                  }
                }
                //else {
                // console.log("dime que aca es el problema y listo")
                // console.log("academicPeriod", academicPeriod);
                // console.log("period", period);
                //}
              }
              // Nota Final de Año
              if (ultimateAcademicPeriod) {
                if (
                  ultimateAcademicPeriod?.id?.toString() == academicPeriodId ||
                  reportPerformanceShowFinalValuation == 'YES'
                ) {
                  let notesAsignature =
                    await this.repositoryAcademicAsignatureCourseYearValuation.findBy({
                      academicAsignatureCourseId: asignatureCourse?.id?.toString(),
                      schoolYearId: academicPeriods[0]?.schoolYearId?.toString(),
                      studentId,
                    });
                  if (notesAsignature?.length > 0) {
                    if (notesAsignature?.length == 1) {
                      let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                        notesAsignature[0]?.performanceLevelId,
                      );
                      notesAsignatures.push({
                        assessment: notesAsignature[0]?.assessment?.toFixed(
                          countDigitsPerformanceLevel,
                        ),
                        academicPeriodId: 'FINAL',
                        performanceLevel: performanceLevel?.name,
                        asignatureId: academicAsignature?.id?.toString(),
                        areaId: academicArea?.id?.toString(),
                        teacher:
                          teacherUserAsignatureCourse?.name +
                          ' ' +
                          teacherUserAsignatureCourse?.lastName,
                      });
                    } else {
                      let valuationAsignatureCalculate;
                      let valuationAsignatureDefinitive;
                      let valuationAsignatureRecovery;
                      for (let notesAsigna of notesAsignature) {
                        switch (notesAsigna?.valuationType) {
                          case ValuationType.CALCULATE:
                            valuationAsignatureCalculate = notesAsigna;
                            break;
                          case ValuationType.DEFINITIVE:
                            valuationAsignatureDefinitive = notesAsigna;
                            break;
                          case ValuationType.RECOVERY:
                            valuationAsignatureRecovery = notesAsigna;
                            break;
                        }
                      }
                      if (valuationAsignatureRecovery) {
                        let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                          valuationAsignatureRecovery?.performanceLevelId,
                        );
                        notesAsignatures.push({
                          assessment: valuationAsignatureRecovery?.assessment?.toFixed(
                            countDigitsPerformanceLevel,
                          ),
                          academicPeriodId: 'FINAL',
                          performanceLevel: performanceLevel?.name,
                          asignatureId: academicAsignature?.id?.toString(),
                          areaId: academicArea?.id?.toString(),
                          teacher:
                            teacherUserAsignatureCourse?.name +
                            ' ' +
                            teacherUserAsignatureCourse?.lastName,
                        });
                      } else {
                        if (valuationAsignatureDefinitive) {
                          let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                            valuationAsignatureDefinitive?.performanceLevelId,
                          );
                          notesAsignatures.push({
                            assessment: valuationAsignatureDefinitive?.assessment?.toFixed(
                              countDigitsPerformanceLevel,
                            ),
                            academicPeriodId: 'FINAL',
                            performanceLevel: performanceLevel?.name,
                            asignatureId: academicAsignature?.id?.toString(),
                            areaId: academicArea?.id?.toString(),
                            teacher:
                              teacherUserAsignatureCourse?.name +
                              ' ' +
                              teacherUserAsignatureCourse?.lastName,
                          });
                        } else {
                          if (valuationAsignatureCalculate) {
                            let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                              valuationAsignatureCalculate?.performanceLevelId,
                            );
                            notesAsignatures.push({
                              assessment: valuationAsignatureCalculate?.assessment?.toFixed(
                                countDigitsPerformanceLevel,
                              ),
                              academicPeriodId: 'FINAL',
                              performanceLevel: performanceLevel?.name,
                              asignatureId: academicAsignature?.id?.toString(),
                              areaId: academicArea?.id?.toString(),
                              teacher:
                                teacherUserAsignatureCourse?.name +
                                ' ' +
                                teacherUserAsignatureCourse?.lastName,
                            });
                          }
                        }
                      }
                    }
                  } else {
                    notesAsignatures.push({
                      assessment: '-',
                      academicPeriodId: 'FINAL',
                      performanceLevel: '-',
                      asignatureId: academicAsignature?.id?.toString(),
                      areaId: academicArea?.id?.toString(),
                      teacher:
                        teacherUserAsignatureCourse?.name +
                        ' ' +
                        teacherUserAsignatureCourse?.lastName,
                    });
                  }
                } else {
                  notesAsignatures.push({
                    assessment: '-',
                    academicPeriodId: 'FINAL',
                    performanceLevel: '-',
                    asignatureId: academicAsignature?.id?.toString(),
                    areaId: academicArea?.id?.toString(),
                    teacher:
                      teacherUserAsignatureCourse?.name +
                      ' ' +
                      teacherUserAsignatureCourse?.lastName,
                  });
                }
              } else {
                notesAsignatures.push({
                  assessment: '-',
                  academicPeriodId: 'FINAL',
                  performanceLevel: '-',
                  asignatureId: academicAsignature?.id?.toString(),
                  areaId: academicArea?.id?.toString(),
                  teacher:
                    teacherUserAsignatureCourse?.name + ' ' + teacherUserAsignatureCourse?.lastName,
                });
              }

              // Nota Final de Año
            }
            let notesAreas = [];
            for (let area of areas) {
              for (let period of academicPeriods) {
                if (period?.order && academicPeriod?.order) {
                  if (period?.order <= academicPeriod?.order) {
                    let notesArea = await this.repositoryAcademicAreaCoursePeriodValuation.findBy({
                      academicAreaId: area?.id?.toString(),
                      academicPeriodId: period?.id?.toString(),
                      studentId,
                    });
                    if (notesArea?.length > 0) {
                      let valuationAreaCalculate;
                      let valuationAreaDefinitive;
                      let valuationAreaRecovery;
                      for (let notesA of notesArea) {
                        switch (notesA?.valuationType) {
                          case ValuationType.CALCULATE:
                            valuationAreaCalculate = notesA;
                            break;
                          case ValuationType.DEFINITIVE:
                            valuationAreaDefinitive = notesA;
                            break;
                          case ValuationType.RECOVERY:
                            valuationAreaRecovery = notesA;
                            break;
                        }
                      }
                      if (valuationAreaRecovery) {
                        let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                          valuationAreaRecovery?.performanceLevelId,
                        );
                        notesAreas.push({
                          assessment: valuationAreaRecovery?.assessment?.toFixed(
                            countDigitsPerformanceLevel,
                          ),
                          academicPeriodId: valuationAreaRecovery?.academicPeriodId,
                          performanceLevel: performanceLevel?.name,
                          areaId: area?.id?.toString(),
                        });
                      } else {
                        if (valuationAreaDefinitive) {
                          let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                            valuationAreaDefinitive?.performanceLevelId,
                          );
                          notesAreas.push({
                            assessment: valuationAreaDefinitive?.assessment?.toFixed(
                              countDigitsPerformanceLevel,
                            ),
                            academicPeriodId: valuationAreaDefinitive?.academicPeriodId,
                            performanceLevel: performanceLevel?.name,
                            areaId: area?.id?.toString(),
                          });
                        } else {
                          if (valuationAreaCalculate) {
                            let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                              valuationAreaCalculate?.performanceLevelId,
                            );
                            notesAreas.push({
                              assessment: valuationAreaCalculate?.assessment?.toFixed(
                                countDigitsPerformanceLevel,
                              ),
                              academicPeriodId: valuationAreaCalculate?.academicPeriodId,
                              performanceLevel: performanceLevel?.name,
                              areaId: area?.id?.toString(),
                            });
                          }
                        }
                      }
                    } else {
                      notesAreas.push({
                        assessment: '-',
                        academicPeriodId: period?.id?.toString(),
                        performanceLevel: '-',
                        areaId: area?.id?.toString(),
                      });
                    }
                  } else {
                    notesAreas.push({
                      assessment: '-',
                      academicPeriodId: period?.id?.toString(),
                      performanceLevel: '-',
                      areaId: area?.id?.toString(),
                    });
                  }
                }
              }
              if (ultimateAcademicPeriod) {
                if (
                  ultimateAcademicPeriod?.id?.toString() == academicPeriodId ||
                  reportPerformanceShowFinalValuation == 'YES'
                ) {
                  // Nota Final de Año
                  let notesArea = await this.repositoryAcademicAreaCourseYearValuation.findBy({
                    academicAreaId: area?.id?.toString(),
                    schoolYearId: academicPeriods[0]?.schoolYearId?.toString(),
                    studentId,
                  });
                  if (notesArea?.length > 0) {
                    if (notesArea?.length == 1) {
                      let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                        notesArea[0]?.performanceLevelId,
                      );
                      notesAreas.push({
                        assessment: notesArea[0]?.assessment?.toFixed(countDigitsPerformanceLevel),
                        academicPeriodId: 'FINAL',
                        performanceLevel: performanceLevel?.name,
                        areaId: area?.id?.toString(),
                      });
                    } else {
                      let valuationAreaCalculate;
                      let valuationAreaDefinitive;
                      let valuationAreaRecovery;
                      for (let notesA of notesArea) {
                        switch (notesA?.valuationType) {
                          case ValuationType.CALCULATE:
                            valuationAreaCalculate = notesA;
                            break;
                          case ValuationType.DEFINITIVE:
                            valuationAreaDefinitive = notesA;
                            break;
                          case ValuationType.RECOVERY:
                            valuationAreaRecovery = notesA;
                            break;
                        }
                      }
                      if (valuationAreaRecovery) {
                        let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                          valuationAreaRecovery?.performanceLevelId,
                        );
                        notesAreas.push({
                          assessment: valuationAreaRecovery?.assessment?.toFixed(
                            countDigitsPerformanceLevel,
                          ),
                          academicPeriodId: 'FINAL',
                          performanceLevel: performanceLevel?.name,
                          areaId: area?.id?.toString(),
                        });
                      } else {
                        if (valuationAreaDefinitive) {
                          let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                            valuationAreaDefinitive?.performanceLevelId,
                          );
                          notesAreas.push({
                            assessment: valuationAreaDefinitive?.assessment?.toFixed(
                              countDigitsPerformanceLevel,
                            ),
                            academicPeriodId: 'FINAL',
                            performanceLevel: performanceLevel?.name,
                            areaId: area?.id?.toString(),
                          });
                        } else {
                          if (valuationAreaCalculate) {
                            let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                              valuationAreaCalculate?.performanceLevelId,
                            );
                            notesAreas.push({
                              assessment: valuationAreaCalculate?.assessment?.toFixed(
                                countDigitsPerformanceLevel,
                              ),
                              academicPeriodId: 'FINAL',
                              performanceLevel: performanceLevel?.name,
                              areaId: area?.id?.toString(),
                            });
                          }
                        }
                      }
                    }
                  } else {
                    notesAreas.push({
                      assessment: '-',
                      academicPeriodId: 'FINAL',
                      performanceLevel: '-',
                      areaId: area?.id?.toString(),
                    });
                  }
                } else {
                  notesAreas.push({
                    assessment: '-',
                    academicPeriodId: 'FINAL',
                    performanceLevel: '-',
                    areaId: area?.id?.toString(),
                  });
                }
              } else {
                notesAreas.push({
                  assessment: '-',
                  academicPeriodId: 'FINAL',
                  performanceLevel: '-',
                  areaId: area?.id?.toString(),
                });
              }
              // Nota Final de Año
            }
            let notesBehaviour = [];
            if (reportPerformanceBehaviourStudent == 'DISPLAY') {
              let noteBehaviour = await this.repositoryStudentBehaviour.findBy({
                courseId: course?.id?.toString(),
                academicPeriodId: academicPeriod?.id?.toString(),
                studentId,
              });
              if (noteBehaviour?.length == 1) {
                let performanceLevel = await this.repositoryPerformanceLevel.findOneBy(
                  noteBehaviour[0]?.performanceLevelId,
                );
                notesBehaviour.push({
                  assessment: noteBehaviour[0]?.assessment?.toFixed(countDigitsPerformanceLevel),
                  academicPeriodId: noteBehaviour[0]?.academicPeriodId,
                  performanceLevel: performanceLevel?.name,
                  observation: noteBehaviour[0]?.observation,
                });
              } else {
                notesBehaviour.push({
                  assessment: '-',
                  academicPeriodId: academicPeriod?.id?.toString(),
                  performanceLevel: '-',
                  observation: '-',
                });
              }
            }
            dataPDF = { ...dataPDF, noteBehaviour: notesBehaviour };
            //console.log(notesAreas)
            dataPDF = { ...dataPDF, notesAsignatures: notesAsignatures };
            dataPDF = { ...dataPDF, notesAreas: notesAreas };
            dataPDF = {
              ...dataPDF,
              generatedDate: new Date().toLocaleString(undefined, {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
            };
            dataPDF = {
              ...dataPDF,
              generatedHour: new Date().toLocaleString('en-US', {
                timeZone: 'America/Bogota',
                hour: '2-digit',
                hour12: true,
                minute: '2-digit',
                second: '2-digit',
              }),
            };
            switch (reportPerformanceType) {
              case 'DETAILS':
                //promisesGeneratePDF.push(
                await this.generatePerformanceReportStudentDetails(dataPDF, studentId, format).then(
                  (dataUrl) => {
                    urls.push(dataUrl);
                  },
                );
                //);
                //promisesGeneratePDF.push(
                await this.generatePerformanceReportStudent(dataPDF, studentId, format).then(
                  (dataUrl) => {
                    urls.push(dataUrl);
                  },
                );
                //);
                break;
              case 'SINGLE':
                //promisesGeneratePDF.push(
                await this.generatePerformanceReportStudent(dataPDF, studentId, format).then(
                  (dataUrl) => {
                    urls.push(dataUrl);
                  },
                );
                //);
                break;
            }
          }
          let urlsReturn = await Promise.all(promisesGeneratePDF).then(() => {
            if (urls?.length > 1) {
              //urls = urls.sort();
              //console.log(studentsId);
              //console.log(urls);
              let urlsAux = [];
              if (studentsId) {
                for (let student of studentsId) {
                  let urlsStudents = urls.filter((url: any) => url.includes(student));
                  urlsStudents = urlsStudents.sort();
                  for (let urlStudent of urlsStudents) {
                    urlsAux.push(urlStudent);
                  }
                }
              }
              //console.log(urlsAux);

              const opts = {
                maxBuffer: 1024 * 5096, // 500kb
                maxHeap: '2g', // for setting JVM heap limits to 2GB
              };
              //console.log(urls);
              var dir = './public/downloads/reports/courses/' + id;
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              merge(urlsAux, dir + '/' + id + '.pdf', opts, function (err: any) {
                if (err) {
                  return console.log(err);
                }
                console.log('Successfully merged!');
              });
              return dir + '/' + id + '.pdf';
            } else {
              return urls[0];
            }
          });
          return urlsReturn + '';
        }
      }
    }
  }

  async generatePerformanceReportStudent(data: any, id: any, format: any) {
    try {
      hbs.registerHelper(
        `iff`,
        (
          a: number,
          operator: any,
          b: number,
          opts: { fn: (arg0: any) => any; inverse: (arg0: any) => any },
        ) => {
          let bool = false;
          a?.toString();
          b?.toString();
          switch (operator) {
            case `!=`:
              bool = a != b;
              break;
            case `===`:
              bool = a === b;
              break;
            case `==`:
              bool = a == b;
              break;
            case `>`:
              bool = a > b;
              break;
            case `<`:
              bool = a < b;
              break;
            default:
              bool = a === b;
          }

          if (bool) {
            return opts.fn(this);
          }
          return opts.inverse(this);
        },
      );
      const browser = await puppeteer.launch({
        pipe: true,
        args: [
          '--headless',
          '--disable-gpu',
          '--full-memory-crash-report',
          '--unlimited-storage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        protocolTimeout: 240000,
        headless: true,
        timeout: 0,
      });
      const page = await browser.newPage();
      //await page.setDefaultNavigationTimeout(0);
      //console.log(data)
      const content = await this.compile('index', data);

      await page.setContent(content);
      var dir = './public/downloads/reports/students/' + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await report.pdfPage(page, {
        path: dir + '/' + id + '-1' + '.pdf',
        format: format,
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          bottom: '0',
          left: '0',
          right: '0',
          top: '0',
        },
      });
      //console.log("done creating pdf");
      await page.close();
      await browser.close();
      return dir + '/' + id + '-1' + '.pdf';
      //process.exit();
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  async generatePerformanceReportStudentDetails(data: any, id: any, format: any) {
    try {
      hbs.registerHelper(
        `iff`,
        (
          a: number,
          operator: any,
          b: number,
          opts: { fn: (arg0: any) => any; inverse: (arg0: any) => any },
        ) => {
          let bool = false;
          a?.toString();
          b?.toString();
          switch (operator) {
            case `!=`:
              bool = a != b;
              break;
            case `===`:
              bool = a === b;
              break;
            case `==`:
              bool = a == b;
              break;
            case `>`:
              bool = a > b;
              break;
            case `<`:
              bool = a < b;
              break;
            default:
              bool = a === b;
          }

          if (bool) {
            return opts.fn(this);
          }
          return opts.inverse(this);
        },
      );
      process.setMaxListeners(0);
      const browser = await puppeteer.launch({
        pipe: true,
        args: [
          '--headless',
          '--disable-gpu',
          '--full-memory-crash-report',
          '--unlimited-storage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        protocolTimeout: 240000,
        headless: true,
        timeout: 0,
      });
      const page = await browser.newPage();
      //await page.setDefaultNavigationTimeout(0);
      //console.log(data)
      const content = await this.compile('index2', data);
      //console.log(content)
      await page.setContent(content);
      var dir = './public/downloads/reports/students/' + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await report.pdfPage(page, {
        path: dir + '/' + id + '-2' + '.pdf',
        format: format,
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          bottom: '0',
          left: '0',
          right: '0',
          top: '0',
        },
      });
      //console.log("done creating pdf");
      await page.close();
      await browser.close();
      return dir + '/' + id + '-2' + '.pdf';
      //process.exit();
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  @Mutation(() => Boolean)
  async generatePerformanceLevelExample2(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    const data = require('../../../reports/performanceReport/data.json');
    try {
      process.setMaxListeners(0);
      const browser = await puppeteer.launch({
        pipe: true,
        args: [
          '--headless',
          '--disable-gpu',
          '--full-memory-crash-report',
          '--unlimited-storage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        protocolTimeout: 240000,
        headless: true,
        timeout: 0,
      });
      const page = await browser.newPage();
      //await page.setDefaultNavigationTimeout(0);
      //console.log(data)
      const content = await this.compile('index', data);
      //console.log(content)
      await page.setContent(content);
      await page.pdf({
        path: 'output.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
          bottom: '10mm',
          left: '10mm',
          right: '10mm',
          top: '10mm',
        },
      });
      //console.log("done creating pdf");
      await page.close();
      await browser.close();
      //process.exit();
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  async compile(templateName: any, data: any) {
    //console.log(data)
    const filePath = path.join(
      process.cwd(),
      'app',
      'reports',
      'performanceReport',
      `${templateName}.hbs`,
    );
    const html = await fs.readFile(filePath, 'utf8');
    //console.log(html)
    return hbs.compile(html)(data);
  }

  compareOrderAcademicArea(a: any, b: any) {
    if (a?.order > b?.order) {
      return -1;
    }
    if (a?.order < b?.order) {
      return 1;
    }
    return 0;
  }
}
