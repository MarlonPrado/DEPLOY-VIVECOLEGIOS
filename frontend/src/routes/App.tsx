import React, { Suspense, useLayoutEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ColorSwitcher from '../components/common/ColorSwitcher';
import Layout from '../components/common/layout/Layout';
import { NotificationContainer } from '../components/common/Notifications';
import { isMultiColorActive } from '../constants/defaultValues';
import AppLocale from '../lang';
import * as LoginActions from '../stores/actions/LoginActions';

const SchoolYearList = React.lazy(() => {
  return import(
    /* webpackChunkName: "SchoolYearList" */ '../components/app/SchoolYear/SchoolYearList'
  );
});

const Login = React.lazy(() => {
  return import(/* webpackChunkName: "Login" */ '../components/app/Login/Login');
});

const Home = React.lazy(() => {
  return import(/* webpackChunkName: "Home" */ '../components/Home');
});

const Profile = React.lazy(() => {
  return import(/* webpackChunkName: "Profile" */ '../components/app/Profile/Profile');
});

const Faq = React.lazy(() => {
  return import(/* webpackChunkName: "Faq" */ '../components/app/Faq/Faq');
});

const VideoTutorials = React.lazy(() => {
  return import(
    /* webpackChunkName: "VideoTutorials" */ '../components/app/VideoTutorials/VideoTutorials'
  );
});

const GraphicsStudentAcademicGrade = React.lazy(() => {
  return import(
    /* webpackChunkName: "GraphicsStudentAcademicGrade" */ '../components/app/Graphics/GraphicsStudentAcademicGrade'
  );
});

const GraphicsStudentAcademicCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "GraphicsStudentAcademicCourse" */ '../components/app/Graphics/GraphicsStudentAcademicCourse'
  );
});

const MenuList = React.lazy(() => {
  return import(/* webpackChunkName: "MenuList" */ '../components/app/Menu/MenuList');
});

const ModalityList = React.lazy(() => {
  return import(/* webpackChunkName: "ModalityList" */ '../components/app/Modality/ModalityList');
});

const ObserverAnnotationTypeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ObserverAnnotationTypeList" */ '../components/app/ObserverAnnotationType/ObserverAnnotationTypeList'
  );
});

const ModuleList = React.lazy(() => {
  return import(/* webpackChunkName: "ModuleList" */ '../components/app/Module/ModuleList');
});

const MunicipalityList = React.lazy(() => {
  return import(
    /* webpackChunkName: "MunicipalityList" */ '../components/app/Municipality/MunicipalityList'
  );
});

const MyAsignaturesStudentList = React.lazy(() => {
  return import(
    /* webpackChunkName: "MyAsignaturesStudentList" */ '../components/app/MyAsignaturesStudent/MyAsignaturesStudentList'
  );
});

const MyClassesStudentList = React.lazy(() => {
  return import(
    /* webpackChunkName: "MyClassesStudentList" */ '../components/app/MyClassesStudent/MyClassesStudentList'
  );
});

const MyClassesList = React.lazy(() => {
  return import(
    /* webpackChunkName: "MyClassesList" */ '../components/app/MyClasses/MyClasessList'
  );
});

const StudentAttendance = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentAttendance" */ '../components/app/StudentAttendance/StudentAttendance'
  );
});
const StudentBehaviour = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentBehaviour" */ '../components/app/StudentBehaviour/StudentBehaviour'
  );
});

const AcademicAssignment = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicAssignment" */ '../components/app/AcademicAssignment/AcademicAssignment'
  );
});

const AcademicAssignmentTeacher = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicAssignmentTeacher" */ '../components/app/AcademicAssignment/AcademicAssignmentTeacher'
  );
});

const AreaList = React.lazy(() => {
  return import(/* webpackChunkName: "AreaList" */ '../components/app/Academic/Area/AreaList');
});

const AsignatureList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AsignatureList" */ '../components/app/Academic/Asignature/AsignatureList'
  );
});

const GradeList = React.lazy(() => {
  return import(/* webpackChunkName: "GradeList" */ '../components/app/Academic/Grade/GradeList');
});

const PerformanceLevelList = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceLevelList" */ '../components/app/Academic/PerformanceLevel/PerformanceLevelList'
  );
});

const StandardList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StandardList" */ '../components/app/Academic/Standard/StandardList'
  );
});

const AcademicAsignatureCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicAsignatureCourseList" */ '../components/app/AcademicAsignatureCourse/AcademicAsignatureCourseList'
  );
});

const AcademicAsignatureCourseBasicList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicAsignatureCourseBasicList" */ '../components/app/AcademicAsignatureCourseBasic/AcademicAsignatureCourseBasicList'
  );
});

const AcademicDayList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicDayList" */ '../components/app/AcademicDay/AcademicDayList'
  );
});

const AcademicHourList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicHourList" */ '../components/app/AcademicHour/AcademicHourList'
  );
});

const AcademicPeriodList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AcademicPeriodList" */ '../components/app/AcademicPeriod/AcademicPeriodList'
  );
});

const SchoolAdministrativeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "SchoolAdministrativeList" */ '../components/app/Administrative/SchoolAdministrativeList'
  );
});

const AdministratorCampusList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AdministratorCampusList" */ '../components/app/AdministratorsCampus/AdministratorCampusList'
  );
});

const AdministratorSchoolList = React.lazy(() => {
  return import(
    /* webpackChunkName: "AdministratorSchoolList" */ '../components/app/AdministratorsSchool/AdministratorSchoolList'
  );
});

const ChatApp = React.lazy(() => {
  return import(/* webpackChunkName: "ChatApp" */ '../components/app/Aplications/Chat/Chat');
});

const ElectionsApp = React.lazy(() => {
  return import(
    /* webpackChunkName: "ElectionsApp" */ '../components/app/Aplications/Elections/Elections'
  );
});

const ForumApp = React.lazy(() => {
  return import(/* webpackChunkName: "ForumApp" */ '../components/app/Aplications/Forums/Forum');
});

const ForumListApp = React.lazy(() => {
  return import(
    /* webpackChunkName: "ForumListApp" */ '../components/app/Aplications/Forums/ForumList'
  );
});

const Survey = React.lazy(() => {
  return import(/* webpackChunkName: "Survey" */ '../components/app/Aplications/Survey/Survey');
});

const SurveyDetail = React.lazy(() => {
  return import(
    /* webpackChunkName: "SurveyDetail" */ '../components/app/Aplications/Survey/SurveyDetail'
  );
});

const CampusList = React.lazy(() => {
  return import(/* webpackChunkName: "CampusList" */ '../components/app/Campus/CampusList');
});

const ClassroomPlan = React.lazy(() => {
  return import(
    /* webpackChunkName: "ClassroomPlan" */ '../components/app/ClassroomPlan/ClassroomPlan'
  );
});

const ClassroomPlanDetail = React.lazy(() => {
  return import(
    /* webpackChunkName: "ClassroomPlanDetail" */ '../components/app/ClassroomPlan/ClassroomPlanDetail'
  );
});

const ClassroomPlanList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ClassroomPlanList" */ '../components/app/ClassroomPlan/ClassroomPlanList'
  );
});

const CoEvaluation = React.lazy(() => {
  return import(
    /* webpackChunkName: "CoEvaluation" */ '../components/app/CoEvaluation/CoEvaluation'
  );
});

const CoEvaluationStudents = React.lazy(() => {
  return import(
    /* webpackChunkName: "CoEvaluationStudents" */ '../components/app/CoEvaluationStudents/CoEvaluationStudents'
  );
});

const ComponentEvaluativeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ComponentEvaluativeList" */ '../components/app/ComponentEvaluative/ComponentEvaluativeList'
  );
});

const CoordinatorCampusList = React.lazy(() => {
  return import(
    /* webpackChunkName: "CoordinatorCampusList" */ '../components/app/CoordinatorCampus/CoordinatorCampusList'
  );
});

const CourseList = React.lazy(() => {
  return import(/* webpackChunkName: "CourseList" */ '../components/app/Course/CourseList');
});

const CoursesTeacherList = React.lazy(() => {
  return import(
    /* webpackChunkName: "CoursesTeacherList" */ '../components/app/CoursesTeacher/CoursesTeacherList'
  );
});

const Analytics = React.lazy(() => {
  return import(/* webpackChunkName: "Analytics" */ '../components/app/Dashboards/Analytics');
});

const DocumentTypeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "DocumentTypeList" */ '../components/app/DocumentType/DocumentTypeList'
  );
});

const EducationLevelList = React.lazy(() => {
  return import(
    /* webpackChunkName: "EducationLevelList" */ '../components/app/EducationLevel/EducationLevelList'
  );
});

const ExperienceLearningList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ExperienceLearningList" */ '../components/app/ExperienceLearning/ExperienceLearningList'
  );
});

const ExperienceLearningRecoveryPlanList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ExperienceLearningRecoveryPlanList" */ '../components/app/ExperienceLearning/ExperienceLearningRecoveryPlanList'
  );
});

const GenderList = React.lazy(() => {
  return import(/* webpackChunkName: "GenderList" */ '../components/app/Gender/GenderList');
});

const GeneralAreaList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralAreaList" */ '../components/app/GeneralAcademic/Area/AreaList'
  );
});

const GeneralAsignatureList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralAsignatureList" */ '../components/app/GeneralAcademic/Asignature/AsignatureList'
  );
});

const GeneralCycleList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralCycleList" */ '../components/app/GeneralAcademic/Cycle/CycleList'
  );
});

const GeneralGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralGradeList" */ '../components/app/GeneralAcademic/Grade/GradeList'
  );
});

const GeneralPerformanceLevelList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralPerformanceLevelList" */ '../components/app/GeneralAcademic/PerformanceLevel/PerformanceLevelList'
  );
});

const GeneralStandardList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GeneralStandardList" */ '../components/app/GeneralAcademic/Standard/StandardList'
  );
});

const GradeAssignmentList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeAssignmentList" */ '../components/app/GradeAssignment/GradeAssignmentList'
  );
});

const GradeAssignmentReferentsList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeAssignmentReferentsList" */ '../components/app/GradeAssignmentReferents/GradeAssignmentReferentsList'
  );
});

const GuardianList = React.lazy(() => {
  return import(/* webpackChunkName: "GuardianList" */ '../components/app/Guardian/GuardianList');
});

const InboxDetail = React.lazy(() => {
  return import(/* webpackChunkName: "InboxDetail" */ '../components/app/Inbox/InboxDetail');
});

const LearningList = React.lazy(() => {
  return import(/* webpackChunkName: "LearningList" */ '../components/app/Learning/LearningList');
});

const LearningEvidenceList = React.lazy(() => {
  return import(
    /* webpackChunkName: "LearningEvidenceList" */ '../components/app/LearningEvidence/LearningEvidenceList'
  );
});

const QuestionCategoryTestOnlineList = React.lazy(() => {
  return import(
    /* webpackChunkName: "QuestionCategoryTestOnlineList" */ '../components/app/QuestionCategoryTestOnline/QuestionCategoryTestOnlineList'
  );
});

const QuestionsBankTestOnline = React.lazy(() => {
  return import(
    /* webpackChunkName: "QuestionsBankTestOnline" */ '../components/app/QuestionsBankTestOnline/QuestionsBankTestOnline'
  );
});

const QuestionTestOnlineList = React.lazy(() => {
  return import(
    /* webpackChunkName: "QuestionTestOnlineList" */ '../components/app/QuestionTestOnline/QuestionTestOnlineList'
  );
});

const RoleList = React.lazy(() => {
  return import(/* webpackChunkName: "RoleList" */ '../components/app/Role/RoleList');
});

const RubricCriteriaList = React.lazy(() => {
  return import(
    /* webpackChunkName: "RubricCriteriaList" */ '../components/app/RubricCriteria/RubricCriteriaList'
  );
});

const RubricCriteriaValuation = React.lazy(() => {
  return import(
    /* webpackChunkName: "RubricCriteriaValuation" */ '../components/app/RubricCriteriaValuation/RubricCriteriaValuation'
  );
});

const RubricValuation = React.lazy(() => {
  return import(
    /* webpackChunkName: "RubricValuation" */ '../components/app/RubricValuation/RubricValuation'
  );
});

const OfficeSchedule = React.lazy(() => {
  return import(
    /* webpackChunkName: "OfficeSchedule" */ '../components/app/Schedule/OfficeSchedule'
  );
});

const SchoolSchedule = React.lazy(() => {
  return import(
    /* webpackChunkName: "SchoolSchedule" */ '../components/app/Schedule/SchoolSchedule'
  );
});

const SchoolList = React.lazy(() => {
  return import(/* webpackChunkName: "SchoolList" */ '../components/app/School/SchoolList');
});

const SelfValuation = React.lazy(() => {
  return import(
    /* webpackChunkName: "SelfValuation" */ '../components/app/SelfValuation/SelfValuation'
  );
});

const SpecialityList = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpecialityList" */ '../components/app/Speciality/SpecialityList'
  );
});

const Spreadsheet = React.lazy(() => {
  return import(/* webpackChunkName: "Spreadsheet" */ '../components/app/Spreadsheet/Spreadsheet');
});

const SpreadsheetRecoveryPlan = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetRecoveryPlan" */ '../components/app/Spreadsheet/SpreadsheetRecoveryPlan'
  );
});

const SpreadsheetCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetCourse" */ '../components/app/SpreadsheetCourse/SpreadsheetCourse'
  );
});

const SpreadsheetAverageCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetAverageCourse" */ '../components/app/SpreadsheetCourse/SpreadsheetAverageCourse'
  );
});

const SpreadsheetBehaviour = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetBehaviour" */ '../components/app/SpreadsheetCourse/SpreadsheetBehaviour'
  );
});

const ReportSpreadsheetAccumulatedAverageCourseGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedAverageCourseGradeList" */ '../components/app/ReportSpreadsheetAccumulatedAverageCourse/ReportSpreadsheetAccumulatedAverageCourseGradeList'
  );
});
const ReportSpreadsheetAccumulatedAverageCourseCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedAverageCourseCourseList" */ '../components/app/ReportSpreadsheetAccumulatedAverageCourse/ReportSpreadsheetAccumulatedAverageCourseCourseList'
  );
});

const ReportSpreadsheetAccumulatedBehaviourGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedBehaviourGradeList" */ '../components/app/ReportSpreadsheetAccumulatedBehaviour/ReportSpreadsheetAccumulatedBehaviourGradeList'
  );
});
const ReportSpreadsheetAccumulatedBehaviourCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedBehaviourCourseList" */ '../components/app/ReportSpreadsheetAccumulatedBehaviour/ReportSpreadsheetAccumulatedBehaviourCourseList'
  );
});

const ReportSpreadsheetAccumulatedCourseGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedCourseGradeList" */ '../components/app/ReportSpreadsheetAccumulatedCourse/ReportSpreadsheetAccumulatedCourseGradeList'
  );
});
const ReportSpreadsheetAccumulatedCourseCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedCourseCourseList" */ '../components/app/ReportSpreadsheetAccumulatedCourse/ReportSpreadsheetAccumulatedCourseCourseList'
  );
});

const ReportSpreadsheetAccumulatedAreaCourseGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedAreaCourseGradeList" */ '../components/app/ReportSpreadsheetAccumulatedAreaCourse/ReportSpreadsheetAccumulatedAreaCourseGradeList'
  );
});
const ReportSpreadsheetAccumulatedAreaCourseCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedCourseCourseList" */ '../components/app/ReportSpreadsheetAccumulatedAreaCourse/ReportSpreadsheetAccumulatedAreaCourseCourseList'
  );
});

const ReportSpreadsheetAccumulatedAsignatureCourseGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedAsignatureCourseGradeList" */ '../components/app/ReportSpreadsheetAccumulatedAsignatureCourse/ReportSpreadsheetAccumulatedAsignatureCourseGradeList'
  );
});
const ReportSpreadsheetAccumulatedAsignatureCourseCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportSpreadsheetAccumulatedAsignatureCourseCourseList" */ '../components/app/ReportSpreadsheetAccumulatedAsignatureCourse/ReportSpreadsheetAccumulatedAsignatureCourseCourseList'
  );
});

const SpreadsheetAccumulatedAsignatureCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetCourse" */ '../components/app/SpreadsheetCourse/SpreadsheetAccumulatedAsignatureCourse'
  );
});

const SpreadsheetAccumulatedAreaCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetCourse" */ '../components/app/SpreadsheetCourse/SpreadsheetAccumulatedAreaCourse'
  );
});

const SpreadsheetAccumulatedBehaviour = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetAccumulatedBehaviour" */ '../components/app/SpreadsheetCourse/SpreadsheetAccumulatedBehaviour'
  );
});

const SpreadsheetAccumulatedAverageCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "SpreadsheetAccumulatedAverageCourse" */ '../components/app/SpreadsheetCourse/SpreadsheetAccumulatedAverageCourse'
  );
});

const StudentsList = React.lazy(() => {
  return import(/* webpackChunkName: "StudentsList" */ '../components/app/Students/StudentsList');
});

const StudentsCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentsCourseList" */ '../components/app/StudentsCourse/StudentsCourseList'
  );
});

const SubmenuList = React.lazy(() => {
  return import(/* webpackChunkName: "SubmenuList" */ '../components/app/Submenu/SubmenuList');
});

const TeacherList = React.lazy(() => {
  return import(/* webpackChunkName: "TeacherList" */ '../components/app/Teacher/TeacherList');
});

const TraditionalValuation = React.lazy(() => {
  return import(
    /* webpackChunkName: "TraditionalValuation" */ '../components/app/TraditionalValuation/TraditionalValuation'
  );
});
const TraditionalValuationRecoveryPlan = React.lazy(() => {
  return import(
    /* webpackChunkName: "TraditionalValuationRecoveryPlan" */ '../components/app/TraditionalValuation/TraditionalValuationRecoveryPlan'
  );
});

const UserList = React.lazy(() => {
  return import(/* webpackChunkName: "UserList" */ '../components/app/User/UserList');
});

const ValuationReferents = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationReferents" */ '../components/app/ValuationReferents/ValuationReferents'
  );
});

const ValuationReferentsTeacher = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationReferentsTeacher" */ '../components/app/ValuationReferents/ValuationReferentsTeacher'
  );
});

const BasicLearningDutiesList = React.lazy(() => {
  return import(
    /* webpackChunkName: "BasicLearningDutiesList" */ '../components/app/BasicLearningDuties/BasicLearningDutiesList'
  );
});

const PerformanceReportCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceReportCourseList" */ '../components/app/PerformanceReport/PerformanceReportCourseList'
  );
});

const PerformanceReportGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceReportGradeList" */ '../components/app/PerformanceReport/PerformanceReportGradeList'
  );
});
const PerformanceReportStudentsCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceReportStudentsCourseList" */ '../components/app/PerformanceReport/PerformanceReportStudentsCourseList'
  );
});

const PerformanceReportStudentsCourseList2 = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceReportStudentsCourseList2" */ '../components/app/PerformanceReport/PerformanceReportStudentsCourseList2'
  );
});

const PerformanceReportStudentsCourseList3 = React.lazy(() => {
  return import(
    /* webpackChunkName: "PerformanceReportStudentsCourseList3" */ '../components/app/PerformanceReport/PerformanceReportStudentsCourseList3'
  );
});

const ValuationDefinitivePeriodCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationDefinitivePeriodCourseList" */ '../components/app/ValuationDefinitivePeriod/ValuationDefinitivePeriodCourseList'
  );
});
const ValuationDefinitivePeriodGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationDefinitivePeriodGradeList" */ '../components/app/ValuationDefinitivePeriod/ValuationDefinitivePeriodGradeList'
  );
});
const ValuationDefinitivePeriodStudentsCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationDefinitivePeriodStudentsCourseList" */ '../components/app/ValuationDefinitivePeriod/ValuationDefinitivePeriodStudentsCourseList'
  );
});
const ValuationDefinitivePeriodStudent = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationDefinitivePeriodStudent" */ '../components/app/ValuationDefinitivePeriod/ValuationDefinitivePeriodStudent'
  );
});
const ValuationDefinitiveYearStudent = React.lazy(() => {
  return import(
    /* webpackChunkName: "ValuationDefinitiveYearStudent" */ '../components/app/ValuationDefinitivePeriod/ValuationDefinitiveYearStudent'
  );
});
const StudentObserverGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentObserverGradeList" */ '../components/app/StudentObserver/StudentObserverGradeList'
  );
});
const StudentObserverCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentObserverCourseList" */ '../components/app/StudentObserver/StudentObserverCourseList'
  );
});
const StudentObserverCourseStudentList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentObserverCourseStudentList" */ '../components/app/StudentObserver/StudentObserverCourseStudentList'
  );
});
const StudentObserverAnnotationList = React.lazy(() => {
  return import(
    /* webpackChunkName: "StudentObserverAnnotationList" */ '../components/app/StudentObserver/StudentObserverAnnotationList'
  );
});

const ReportHourlyIntensityGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportHourlyIntensityGradeList" */ '../components/app/ReportHourlyIntensity/ReportHourlyIntensityGradeList'
  );
});
const ReportHourlyIntensityCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportHourlyIntensityCourseList" */ '../components/app/ReportHourlyIntensity/ReportHourlyIntensityCourseList'
  );
});
const ReportHourlyIntensityCourse = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportHourlyIntensityCourse" */ '../components/app/ReportHourlyIntensity/ReportHourlyIntensityCourse'
  );
});
const ReportHourlyIntensityGrade = React.lazy(() => {
  return import(
    /* webpackChunkName: "ReportHourlyIntensityGrade" */ '../components/app/ReportHourlyIntensity/ReportHourlyIntensityGrade'
  );
});

const RecoveryPlanAcademicAsignatureCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "RecoveryPlanAcademicAsignatureCourseList" */ '../components/app/RecoveryPlan/RecoveryPlanAcademicAsignatureCourseList'
  );
});

const GradeCourseAssigmentGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeCourseAssigmentGradeList" */ '../components/app/GradeCourseAssignment/GradeCourseAssigmentGradeList'
  );
});

const GradeCourseAssigmentCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeCourseAssigmentCourseList" */ '../components/app/GradeCourseAssignment/GradeCourseAssigmentCourseList'
  );
});

const GradeCourseStudentsGradeList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeCourseStudentsGradeList" */ '../components/app/GradeCourseStudents/GradeCourseStudentsGradeList'
  );
});

const GradeCourseStudentsCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "GradeCourseStudentsCourseList" */ '../components/app/GradeCourseStudents/GradeCourseStudentsCourseList'
  );
});

const SchoolConfigurationList = React.lazy(() => {
  return import(
    /* webpackChunkName: "SchoolConfigurationList" */ '../components/app/SchoolConfiguration/SchoolConfigurationList'
  );
});

const SchoolProfile = React.lazy(() => {
  return import(/* webpackChunkName: "SchoolProfile" */ '../components/app/School/SchoolProfile');
});

const ForumGradeList = React.lazy(() => {
  return import(/* webpackChunkName: "ForumGradeList" */ '../components/app/Forum/ForumGradeList');
});

const ForumCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ForumCourseList" */ '../components/app/Forum/ForumCourseList'
  );
});

const ForumAcademicAsignatureCourseList = React.lazy(() => {
  return import(
    /* webpackChunkName: "ForumAcademicAsignatureCourseList" */ '../components/app/Forum/ForumAcademicAsignatureCourseList'
  );
});

const ForumList = React.lazy(() => {
  return import(/* webpackChunkName: "ForumList" */ '../components/app/Forum/ForumList');
});

const SyncOfflineList = React.lazy(() => {
  return import(
    /* webpackChunkName: "SyncOfflineList" */ '../components/app/SyncOffline/SyncOfflineList'
  );
});

const App = (props: any) => {
  const { locale } = props.translateReducer;

  const currentAppLocale = AppLocale[locale];

  const [permissions, setPermissions] = useState(false);

  useLayoutEffect(() => {
    const token = localStorage.getItem('token');
    if (props?.loginReducer?.userId?.length > 0 && token != null) {
      setPermissions(true);
    } else {
      setPermissions(false);
    }
  }, [props.loginReducer]);

  return (
    <div className="h-100">
      <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
        <NotificationContainer />
        {isMultiColorActive && <ColorSwitcher />}
        <BrowserRouter>
          <Layout permissions={permissions}>
            <Suspense fallback={<div className="loading" />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={permissions ? <Home /> : <Login />} />

                {permissions ? (
                  <>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/videoTutorials" element={<VideoTutorials />} />
                    <Route
                      path="/graphicsStudentAcademicGrade"
                      element={<GraphicsStudentAcademicGrade />}
                    />
                    <Route
                      path="/graphicsStudentAcademicCourse"
                      element={<GraphicsStudentAcademicCourse />}
                    />
                    <Route path="/myScheduleOffice" element={<OfficeSchedule />} />
                    <Route path="/myScheduleShool" element={<SchoolSchedule />} />
                    <Route path="/messages" element={<InboxDetail />} />
                    {/* ADMIN */}
                    <Route path="/roles" element={<RoleList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/modules" element={<ModuleList />} />
                    <Route path="/menus" element={<MenuList />} />
                    <Route path="/submenus" element={<SubmenuList />} />
                    <Route path="/genders" element={<GenderList />} />
                    <Route path="/documentTypes" element={<DocumentTypeList />} />
                    <Route path="/municipality" element={<MunicipalityList />} />
                    {/* ADMIN */}
                    {/* PERSONAL */}
                    <Route path="/schools" element={<SchoolList />} />
                    <Route path="/campus" element={<CampusList />} />
                    <Route path="/students" element={<StudentsList />} />
                    <Route path="/studentCourse" element={<StudentsCourseList />} />
                    <Route path="/studentGrade" element={<StudentsCourseList />} />
                    <Route path="/teachers" element={<TeacherList />} />
                    <Route path="/schoolAdministratives" element={<SchoolAdministrativeList />} />
                    <Route path="/guardians" element={<GuardianList />} />
                    <Route path="/administratorsSchool" element={<AdministratorSchoolList />} />
                    <Route path="/administratorsCampus" element={<AdministratorCampusList />} />
                    <Route path="/coordinatorsCampus" element={<CoordinatorCampusList />} />
                    {/* PERSONAL */}
                    {/* GENERAL ACADEMIC */}
                    <Route path="/general/areas" element={<GeneralAreaList />} />
                    <Route path="/general/asignatures" element={<GeneralAsignatureList />} />
                    <Route path="/general/cycles" element={<GeneralCycleList />} />
                    <Route
                      path="/general/performanceLevel"
                      element={<GeneralPerformanceLevelList />}
                    />
                    <Route path="/general/standardAcademic" element={<GeneralStandardList />} />
                    <Route path="/general/grades" element={<GeneralGradeList />} />
                    {/* GENERAL ACADEMIC */}
                    {/* ACADEMIC */}
                    <Route path="/areas" element={<AreaList />} />
                    <Route path="/asignatures" element={<AsignatureList />} />
                    <Route path="/performanceLevel" element={<PerformanceLevelList />} />
                    <Route path="/standardAcademic" element={<StandardList />} />
                    <Route path="/grades" element={<GradeList />} />
                    <Route path="/educationLevel" element={<EducationLevelList />} />
                    <Route path="/evaluativeComponent" element={<ComponentEvaluativeList />} />
                    <Route path="/modality" element={<ModalityList />} />
                    <Route
                      path="/observerAnnotationType"
                      element={<ObserverAnnotationTypeList />}
                    />
                    <Route path="/schoolYear" element={<SchoolYearList />} />
                    <Route path="/speciality" element={<SpecialityList />} />
                    <Route path="/periodAcademic" element={<AcademicPeriodList />} />
                    {/* <Route path="/indicatorAcademic" element={<AcademicIndicatorList />} /> */}
                    <Route path="/gradeAssignment" element={<GradeAssignmentList />} />
                    <Route path="/academicDay" element={<AcademicDayList />} />
                    <Route path="/academicHour" element={<AcademicHourList />} />
                    <Route path="/course" element={<CourseList />} />
                    <Route path="/myCourse" element={<CoursesTeacherList />} />
                    <Route
                      path="/valuationReferentsTeacher"
                      element={<ValuationReferentsTeacher />}
                    />
                    <Route
                      path="/academicAsignatureCourseBasic"
                      element={<AcademicAsignatureCourseBasicList />}
                    />
                    <Route path="/dba" element={<BasicLearningDutiesList />} />
                    <Route path="/learning" element={<LearningList />} />
                    <Route path="/evidenceLearning" element={<LearningEvidenceList />} />
                    <Route path="/experienceLearning" element={<ExperienceLearningList />} />
                    <Route
                      path="/experienceLearningRecoveryPlan"
                      element={<ExperienceLearningRecoveryPlanList />}
                    />
                    <Route path="/myAsignaturesStudent" element={<MyAsignaturesStudentList />} />
                    <Route path="/myClassesStudent" element={<MyClassesStudentList />} />
                    <Route path="/myClasses" element={<MyClassesList />} />
                    <Route path="/studentAttendance" element={<StudentAttendance />} />
                    <Route path="/studentBehaviour" element={<StudentBehaviour />} />
                    <Route path="/academicAssignment" element={<AcademicAssignment />} />
                    <Route
                      path="/academicAssignmentTeacher"
                      element={<AcademicAssignmentTeacher />}
                    />
                    <Route path="/traditionalValuation" element={<TraditionalValuation />} />
                    <Route
                      path="/traditionalValuationRecoveryPlan"
                      element={<TraditionalValuationRecoveryPlan />}
                    />
                    <Route path="/selfValuation" element={<SelfValuation />} />
                    <Route path="/rubricCriteria" element={<RubricCriteriaList />} />
                    <Route path="/rubricValuation" element={<RubricValuation />} />
                    <Route path="/rubricCriteriaValuation" element={<RubricCriteriaValuation />} />
                    <Route path="/coEvaluation" element={<CoEvaluation />} />
                    <Route path="/coEvaluationStudents" element={<CoEvaluationStudents />} />
                    <Route path="/spreadsheet" element={<Spreadsheet />} />
                    <Route path="/spreadsheetRecoveryPlan" element={<SpreadsheetRecoveryPlan />} />
                    <Route path="/spreadsheetCourse" element={<SpreadsheetCourse />} />
                    <Route
                      path="/spreadsheetAverageCourse"
                      element={<SpreadsheetAverageCourse />}
                    />
                    <Route path="/spreadsheetBehaviour" element={<SpreadsheetBehaviour />} />
                    <Route
                      path="/reportSpreadsheetAccumulatedAverageCourseGradeList"
                      element={<ReportSpreadsheetAccumulatedAverageCourseGradeList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedAverageCourseCourseList"
                      element={<ReportSpreadsheetAccumulatedAverageCourseCourseList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedBehaviourGradeList"
                      element={<ReportSpreadsheetAccumulatedBehaviourGradeList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedBehaviourCourseList"
                      element={<ReportSpreadsheetAccumulatedBehaviourCourseList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedCourseGradeList"
                      element={<ReportSpreadsheetAccumulatedCourseGradeList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedCourseCourseList"
                      element={<ReportSpreadsheetAccumulatedCourseCourseList />}
                    />

                    <Route
                      path="/reportSpreadsheetAccumulatedAreaCourseGradeList"
                      element={<ReportSpreadsheetAccumulatedAreaCourseGradeList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedAreaCourseCourseList"
                      element={<ReportSpreadsheetAccumulatedAreaCourseCourseList />}
                    />

                    <Route
                      path="/reportSpreadsheetAccumulatedAsignatureCourseGradeList"
                      element={<ReportSpreadsheetAccumulatedAsignatureCourseGradeList />}
                    />
                    <Route
                      path="/reportSpreadsheetAccumulatedAsignatureCourseCourseList"
                      element={<ReportSpreadsheetAccumulatedAsignatureCourseCourseList />}
                    />

                    <Route
                      path="/spreadsheetAccumulatedAsignatureCourse"
                      element={<SpreadsheetAccumulatedAsignatureCourse />}
                    />
                    <Route
                      path="/spreadsheetAccumulatedAreaCourse"
                      element={<SpreadsheetAccumulatedAreaCourse />}
                    />
                    <Route
                      path="/spreadsheetAccumulatedAverageCourse"
                      element={<SpreadsheetAccumulatedAverageCourse />}
                    />

                    <Route
                      path="/spreadsheetAccumulatedBehaviour"
                      element={<SpreadsheetAccumulatedBehaviour />}
                    />
                    <Route
                      path="/questionCategoryTestOnline"
                      element={<QuestionCategoryTestOnlineList />}
                    />
                    <Route path="/questionTestOnline" element={<QuestionTestOnlineList />} />
                    <Route path="/questionsBank" element={<QuestionsBankTestOnline />} />
                    <Route path="/classroomPlan" element={<ClassroomPlan />} />
                    <Route path="/listClassroomPlans" element={<ClassroomPlanList />} />
                    <Route path="/classroomPlanDetail" element={<ClassroomPlanDetail />} />
                    <Route path="/valuationReferents" element={<ValuationReferents />} />
                    <Route
                      path="/gradeAssignmentReferents"
                      element={<GradeAssignmentReferentsList />}
                    />
                    {/* ACADEMIC */}

                    {/* APPLICATIONS */}
                    <Route path="/chat" element={<ChatApp />} />
                    <Route path="/foros" element={<ForumListApp />} />
                    <Route path="/foro-detalle" element={<ForumApp />} />
                    <Route path="/elecciones-personero" element={<ElectionsApp />} />
                    <Route path="/encuestas" element={<Survey />} />
                    <Route path="/encuestas-detalle" element={<SurveyDetail />} />
                    <Route path="/informe-avance-desempeno" element={<Analytics />} />

                    <Route
                      path="/performanceReportGrade"
                      element={<PerformanceReportGradeList />}
                    />
                    <Route
                      path="/performanceReportCourse"
                      element={<PerformanceReportCourseList />}
                    />
                    <Route
                      path="/performanceReportStudentsCourse"
                      element={<PerformanceReportStudentsCourseList />}
                    />
                    <Route
                      path="/performanceReportStudentsCourse2"
                      element={<PerformanceReportStudentsCourseList2 />}
                    />
                    <Route
                      path="/performanceReportStudentsCourse3"
                      element={<PerformanceReportStudentsCourseList3 />}
                    />
                    <Route
                      path="/valuationDefinitivePeriodGrade"
                      element={<ValuationDefinitivePeriodGradeList />}
                    />
                    <Route
                      path="/valuationDefinitivePeriodCourse"
                      element={<ValuationDefinitivePeriodCourseList />}
                    />
                    <Route
                      path="/valuationDefinitivePeriodStudentsCourse"
                      element={<ValuationDefinitivePeriodStudentsCourseList />}
                    />
                    <Route
                      path="/valuationDefinitivePeriodStudent"
                      element={<ValuationDefinitivePeriodStudent />}
                    />
                    <Route
                      path="/valuationDefinitiveYearStudent"
                      element={<ValuationDefinitiveYearStudent />}
                    />
                    <Route
                      path="/studentObserverGradeList"
                      element={<StudentObserverGradeList />}
                    />
                    <Route
                      path="/studentObserverCourseList"
                      element={<StudentObserverCourseList />}
                    />
                    <Route
                      path="/studentObserverCourseStudentList"
                      element={<StudentObserverCourseStudentList />}
                    />
                    <Route
                      path="/studentObserverAnnotationList"
                      element={<StudentObserverAnnotationList />}
                    />
                    <Route
                      path="/reportHourlyIntensityGradeList"
                      element={<ReportHourlyIntensityGradeList />}
                    />
                    <Route
                      path="/reportHourlyIntensityCourseList"
                      element={<ReportHourlyIntensityCourseList />}
                    />
                    <Route
                      path="/reportHourlyIntensityCourse"
                      element={<ReportHourlyIntensityCourse />}
                    />
                    <Route
                      path="/reportHourlyIntensityGrade"
                      element={<ReportHourlyIntensityGrade />}
                    />

                    <Route
                      path="/recoveryPlanAcademicAsignatureCourse"
                      element={<RecoveryPlanAcademicAsignatureCourseList />}
                    />

                    <Route
                      path="/gradeCourseAssigmentGradeList"
                      element={<GradeCourseAssigmentGradeList />}
                    />
                    <Route
                      path="/gradeCourseAssigmentCourseList"
                      element={<GradeCourseAssigmentCourseList />}
                    />

                    <Route
                      path="/gradeCourseStudentsGradeList"
                      element={<GradeCourseStudentsGradeList />}
                    />
                    <Route
                      path="/gradeCourseStudentsCourseList"
                      element={<GradeCourseStudentsCourseList />}
                    />

                    <Route path="/forumGradeList" element={<ForumGradeList />} />
                    <Route path="/forumCourseList" element={<ForumCourseList />} />
                    <Route
                      path="/forumAcademicAsignatureCourseList"
                      element={<ForumAcademicAsignatureCourseList />}
                    />
                    <Route path="/forumList" element={<ForumList />} />

                    <Route path="/schoolConfiguration" element={<SchoolConfigurationList />} />

                    <Route path="/schoolProfile" element={<SchoolProfile />} />
                    <Route path="/syncOffline" element={<SyncOfflineList />} />
                  </>
                ) : (
                  <Route path="*" element={<Login />} />
                )}
                <Route element={<Home />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </IntlProvider>
    </div>
  );
};

const mapDispatchToProps = { ...LoginActions };

const mapStateToProps = ({ loginReducer, translateReducer }: any) => {
  return { loginReducer, translateReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
