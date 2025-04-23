import { env } from 'process';
import { DataSource } from 'typeorm';
import { SyncOffline } from './../graphql/models/SchoolAdministrator/SyncOffline';

import { AcademicAreaCoursePeriodValuation } from '../graphql/models/CampusAdministrator/AcademicAreaCoursePeriodValuation';
import { AcademicAreaCourseYearValuation } from '../graphql/models/CampusAdministrator/AcademicAreaCourseYearValuation';
import { AcademicAsignatureCourse } from '../graphql/models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicAsignatureCoursePeriodEvidenceLearningValuation } from '../graphql/models/CampusAdministrator/AcademicAsignatureCoursePeriodEvidenceLearningValuation';
import { AcademicAsignatureCoursePeriodValuation } from '../graphql/models/CampusAdministrator/AcademicAsignatureCoursePeriodValuation';
import { AcademicAsignatureCourseYearValuation } from '../graphql/models/CampusAdministrator/AcademicAsignatureCourseYearValuation';
import { AcademicDay } from '../graphql/models/CampusAdministrator/AcademicDay';
import { AcademicHour } from '../graphql/models/CampusAdministrator/AcademicHour';
import { AcademicSchedule } from '../graphql/models/CampusAdministrator/AcademicSchedule';
import { AverageAcademicPeriodCourse } from '../graphql/models/CampusAdministrator/AverageAcademicPeriodCourse';
import { AverageAcademicPeriodStudent } from '../graphql/models/CampusAdministrator/AverageAcademicPeriodStudent';
import { AverageAcademicYearCourse } from '../graphql/models/CampusAdministrator/AverageAcademicYearCourse';
import { AverageAcademicYearStudent } from '../graphql/models/CampusAdministrator/AverageAcademicYearStudent';
import { ClassroomPlan } from '../graphql/models/CampusAdministrator/ClassroomPlan';
import { Course } from '../graphql/models/CampusAdministrator/Course';
import { ExperienceLearning } from '../graphql/models/CampusAdministrator/ExperienceLearning';
import { ExperienceLearningAverageValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningAverageValuation';
import { ExperienceLearningCoEvaluation } from '../graphql/models/CampusAdministrator/ExperienceLearningCoEvaluation';
import { ExperienceLearningCoEvaluationValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningCoEvaluationValuation';
import { ExperienceLearningRubricCriteria } from '../graphql/models/CampusAdministrator/ExperienceLearningRubricCriteria';
import { ExperienceLearningRubricCriteriaValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningRubricCriteriaValuation';
import { ExperienceLearningRubricValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningRubricValuation';
import { ExperienceLearningSelfAssessmentValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningSelfAssessmentValuation';
import { ExperienceLearningTraditionalValuation } from '../graphql/models/CampusAdministrator/ExperienceLearningTraditionalValuation';
import { Forum } from '../graphql/models/CampusAdministrator/Forum';
import { ForumInteraction } from '../graphql/models/CampusAdministrator/ForumInteraction';
import { ForumQuestion } from '../graphql/models/CampusAdministrator/ForumQuestion';
import { Guardian } from '../graphql/models/CampusAdministrator/Guardian';
import { QuestionBankTestOnline } from '../graphql/models/CampusAdministrator/QuestionBankTestOnline';
import { QuestionCategoryTestOnline } from '../graphql/models/CampusAdministrator/QuestionCategoryTestOnline';
import { QuestionTestOnline } from '../graphql/models/CampusAdministrator/QuestionTestOnline';
import { StudentAttendance } from '../graphql/models/CampusAdministrator/StudentAttendance';
import { StudentBehaviour } from '../graphql/models/CampusAdministrator/StudentBehaviour';
import { StudentObserverAnnotation } from '../graphql/models/CampusAdministrator/StudentObserverAnnotation';
import { StudentYearBehaviour } from '../graphql/models/CampusAdministrator/StudentYearBehaviour';
import { Teacher } from '../graphql/models/CampusAdministrator/Teacher';
import { Estudiantes } from '../graphql/models/Data/Estudiantes';
import { PlantaDocente } from '../graphql/models/Data/PlantaDocente';
import { AuditLogin } from '../graphql/models/GeneralAdministrator/AuditLogin';
import { Campus } from '../graphql/models/GeneralAdministrator/Campus';
import { DocumentType } from '../graphql/models/GeneralAdministrator/DocumentType';
import { Email } from '../graphql/models/GeneralAdministrator/Email';
import { FrecuentQuestion } from '../graphql/models/GeneralAdministrator/FrecuentQuestion';
import { Gender } from '../graphql/models/GeneralAdministrator/Gender';
import { GeneralAcademicArea } from '../graphql/models/GeneralAdministrator/GeneralAcademicArea';
import { GeneralAcademicAsignature } from '../graphql/models/GeneralAdministrator/GeneralAcademicAsignature';
import { GeneralAcademicCycle } from '../graphql/models/GeneralAdministrator/GeneralAcademicCycle';
import { GeneralAcademicGrade } from '../graphql/models/GeneralAdministrator/GeneralAcademicGrade';
import { GeneralAcademicStandard } from '../graphql/models/GeneralAdministrator/GeneralAcademicStandard';
import { GeneralBasicLearningRight } from '../graphql/models/GeneralAdministrator/GeneralBasicLearningRight';
import { GeneralPerformanceLevel } from '../graphql/models/GeneralAdministrator/GeneralPerformanceLevel';
import { Inbox } from '../graphql/models/GeneralAdministrator/Inbox';
import { Menu } from '../graphql/models/GeneralAdministrator/Menu';
import { MenuItem } from '../graphql/models/GeneralAdministrator/MenuItem';
import { Module } from '../graphql/models/GeneralAdministrator/Module';
import { Municipality } from '../graphql/models/GeneralAdministrator/Municipality';
import { Notification } from '../graphql/models/GeneralAdministrator/Notification';
import { Role } from '../graphql/models/GeneralAdministrator/Role';
import { School } from '../graphql/models/GeneralAdministrator/School';
import { SchoolAdministrative } from '../graphql/models/GeneralAdministrator/SchoolAdministrative';
import { SchoolAdministrator } from '../graphql/models/GeneralAdministrator/SchoolAdministrator';
import { Student } from '../graphql/models/GeneralAdministrator/Student';
import { User } from '../graphql/models/GeneralAdministrator/User';
import { VideoTutorial } from '../graphql/models/GeneralAdministrator/VideoTutorial';
import { AcademicArea } from '../graphql/models/SchoolAdministrator/AcademicArea';
import { AcademicAsignature } from '../graphql/models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../graphql/models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../graphql/models/SchoolAdministrator/AcademicPeriod';
import { AcademicStandard } from '../graphql/models/SchoolAdministrator/AcademicStandard';
import { CampusAdministrator } from '../graphql/models/SchoolAdministrator/CampusAdministrator';
import { CampusCoordinator } from '../graphql/models/SchoolAdministrator/CampusCoordinator';
import { EducationLevel } from '../graphql/models/SchoolAdministrator/EducationLevel';
import { EvaluativeComponent } from '../graphql/models/SchoolAdministrator/EvaluativeComponent';
import { EvidenceLearning } from '../graphql/models/SchoolAdministrator/EvidenceLearning';
import { GradeAssignment } from '../graphql/models/SchoolAdministrator/GradeAssignment';
import { Learning } from '../graphql/models/SchoolAdministrator/Learning';
import { Modality } from '../graphql/models/SchoolAdministrator/Modality';
import { ObserverAnnotationType } from '../graphql/models/SchoolAdministrator/ObserverAnnotationType';
import { PerformanceLevel } from '../graphql/models/SchoolAdministrator/PerformanceLevel';
import { SchoolConfiguration } from '../graphql/models/SchoolAdministrator/SchoolConfiguration';
import { SchoolYear } from '../graphql/models/SchoolAdministrator/SchoolYear';
import { Specialty } from '../graphql/models/SchoolAdministrator/Specialty';
import { Cursos } from './../graphql/models/Data/Cursos';
import { Jornadas } from './../graphql/models/Data/Jornadas';

export const dataSource = new DataSource({
  type: 'mongodb',
  url: env.DATABASE_URL_TYPE_ORM,
  authSource: 'admin',
  entities: [
    AuditLogin,
    DocumentType,
    Email,
    Gender,
    Inbox,
    Menu,
    Module,
    Notification,
    Role,
    User,
    MenuItem,
    Campus,
    GeneralAcademicArea,
    GeneralAcademicAsignature,
    GeneralAcademicCycle,
    GeneralAcademicGrade,
    GeneralAcademicStandard,
    GeneralPerformanceLevel,
    Municipality,
    School,
    SchoolAdministrator,
    Student,
    AcademicArea,
    AcademicAsignature,
    AcademicGrade,
    AcademicPeriod,
    AcademicStandard,
    CampusAdministrator,
    CampusCoordinator,
    EducationLevel,
    EvaluativeComponent,
    GradeAssignment,
    Modality,
    PerformanceLevel,
    SchoolYear,
    Specialty,
    AcademicDay,
    AcademicHour,
    Course,
    Guardian,
    Teacher,
    Forum,
    ForumInteraction,
    AcademicAsignatureCourse,
    AcademicSchedule,
    Learning,
    EvidenceLearning,
    GeneralBasicLearningRight,
    ExperienceLearning,
    ExperienceLearningTraditionalValuation,
    ExperienceLearningSelfAssessmentValuation,
    ExperienceLearningCoEvaluationValuation,
    ExperienceLearningCoEvaluation,
    ExperienceLearningRubricCriteria,
    ExperienceLearningRubricValuation,
    ExperienceLearningRubricCriteriaValuation,
    ExperienceLearningAverageValuation,
    AcademicAsignatureCoursePeriodValuation,
    QuestionTestOnline,
    QuestionBankTestOnline,
    QuestionCategoryTestOnline,
    ClassroomPlan,
    PlantaDocente,
    Estudiantes,
    Jornadas,
    Cursos,
    SchoolAdministrative,
    StudentAttendance,
    AcademicAreaCoursePeriodValuation,
    SchoolConfiguration,
    AcademicAsignatureCoursePeriodEvidenceLearningValuation,
    AverageAcademicPeriodStudent,
    AverageAcademicPeriodCourse,
    StudentBehaviour,
    ObserverAnnotationType,
    StudentObserverAnnotation,
    AcademicAsignatureCourseYearValuation,
    AcademicAreaCourseYearValuation,
    AverageAcademicYearStudent,
    AverageAcademicYearCourse,
    StudentYearBehaviour,
    VideoTutorial,
    FrecuentQuestion,
    ForumQuestion,
    SyncOffline,
  ],
  synchronize: true,
  logger: 'advanced-console',
  logging: 'all',
  dropSchema: false,
  cache: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //connectTimeoutMS: 50000,
  //socketTimeoutMS: 50000,
});

export const AuditLoginRepository = dataSource.getMongoRepository(AuditLogin);
export const DocumentTypeRepository = dataSource.getMongoRepository(DocumentType);
export const EmailRepository = dataSource.getMongoRepository(Email);
export const GenderRepository = dataSource.getMongoRepository(Gender);
export const InboxRepository = dataSource.getMongoRepository(Inbox);
export const MenuRepository = dataSource.getMongoRepository(Menu);
export const ModuleRepository = dataSource.getMongoRepository(Module);
export const NotificationRepository = dataSource.getMongoRepository(Notification);
export const RoleRepository = dataSource.getMongoRepository(Role);
export const UserRepository = dataSource.getMongoRepository(User);
export const MenuItemRepository = dataSource.getMongoRepository(MenuItem);
export const CampusRepository = dataSource.getMongoRepository(Campus);
export const GeneralAcademicAreaRepository = dataSource.getMongoRepository(GeneralAcademicArea);
export const GeneralAcademicAsignatureRepository =
  dataSource.getMongoRepository(GeneralAcademicAsignature);
export const GeneralAcademicCycleRepository = dataSource.getMongoRepository(GeneralAcademicCycle);
export const GeneralAcademicGradeRepository = dataSource.getMongoRepository(GeneralAcademicGrade);
export const GeneralAcademicStandardRepository =
  dataSource.getMongoRepository(GeneralAcademicStandard);
export const GeneralPerformanceLevelRepository =
  dataSource.getMongoRepository(GeneralPerformanceLevel);
export const MunicipalityRepository = dataSource.getMongoRepository(Municipality);
export const SchoolRepository = dataSource.getMongoRepository(School);
export const SchoolAdministratorRepository = dataSource.getMongoRepository(SchoolAdministrator);
export const StudentRepository = dataSource.getMongoRepository(Student);
export const AcademicAreaRepository = dataSource.getMongoRepository(AcademicArea);
export const AcademicAsignatureRepository = dataSource.getMongoRepository(AcademicAsignature);
export const AcademicGradeRepository = dataSource.getMongoRepository(AcademicGrade);
export const AcademicPeriodRepository = dataSource.getMongoRepository(AcademicPeriod);
export const AcademicStandardRepository = dataSource.getMongoRepository(AcademicStandard);
export const CampusAdministratorRepository = dataSource.getMongoRepository(CampusAdministrator);
export const CampusCoordinatorRepository = dataSource.getMongoRepository(CampusCoordinator);
export const EducationLevelRepository = dataSource.getMongoRepository(EducationLevel);
export const EvaluativeComponentRepository = dataSource.getMongoRepository(EvaluativeComponent);
export const GradeAssignmentRepository = dataSource.getMongoRepository(GradeAssignment);
export const ModalityRepository = dataSource.getMongoRepository(Modality);
export const PerformanceLevelRepository = dataSource.getMongoRepository(PerformanceLevel);
export const SchoolYearRepository = dataSource.getMongoRepository(SchoolYear);
export const SpecialtyRepository = dataSource.getMongoRepository(Specialty);
export const AcademicDayRepository = dataSource.getMongoRepository(AcademicDay);
export const AcademicHourRepository = dataSource.getMongoRepository(AcademicHour);
export const CourseRepository = dataSource.getMongoRepository(Course);
export const GuardianRepository = dataSource.getMongoRepository(Guardian);
export const TeacherRepository = dataSource.getMongoRepository(Teacher);
export const ForumRepository = dataSource.getMongoRepository(Forum);
export const ForumInteractionRepository = dataSource.getMongoRepository(ForumInteraction);
export const AcademicAsignatureCourseRepository =
  dataSource.getMongoRepository(AcademicAsignatureCourse);
export const AcademicScheduleRepository = dataSource.getMongoRepository(AcademicSchedule);
export const LearningRepository = dataSource.getMongoRepository(Learning);
export const EvidenceLearningRepository = dataSource.getMongoRepository(EvidenceLearning);
export const GeneralBasicLearningRightRepository =
  dataSource.getMongoRepository(GeneralBasicLearningRight);
export const ExperienceLearningRepository = dataSource.getMongoRepository(ExperienceLearning);
export const ExperienceLearningTraditionalValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningTraditionalValuation,
);
export const ExperienceLearningSelfAssessmentValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningSelfAssessmentValuation,
);
export const ExperienceLearningCoEvaluationValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningCoEvaluationValuation,
);
export const ExperienceLearningCoEvaluationRepository = dataSource.getMongoRepository(
  ExperienceLearningCoEvaluation,
);
export const ExperienceLearningRubricCriteriaRepository = dataSource.getMongoRepository(
  ExperienceLearningRubricCriteria,
);
export const ExperienceLearningRubricValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningRubricValuation,
);
export const ExperienceLearningRubricCriteriaValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningRubricCriteriaValuation,
);
export const ExperienceLearningAverageValuationRepository = dataSource.getMongoRepository(
  ExperienceLearningAverageValuation,
);
export const AcademicAsignatureCoursePeriodValuationRepository = dataSource.getMongoRepository(
  AcademicAsignatureCoursePeriodValuation,
);
export const QuestionTestOnlineRepository = dataSource.getMongoRepository(QuestionTestOnline);
export const QuestionBankTestOnlineRepository =
  dataSource.getMongoRepository(QuestionBankTestOnline);
export const QuestionCategoryTestOnlineRepository = dataSource.getMongoRepository(
  QuestionCategoryTestOnline,
);
export const ClassroomPlanRepository = dataSource.getMongoRepository(ClassroomPlan);
export const PlantaDocenteRepository = dataSource.getMongoRepository(PlantaDocente);
export const EstudiantesRepository = dataSource.getMongoRepository(Estudiantes);
export const JornadasRepository = dataSource.getMongoRepository(Jornadas);
export const CursosRepository = dataSource.getMongoRepository(Cursos);
export const SchoolAdministrativeRepository = dataSource.getMongoRepository(SchoolAdministrative);
export const StudentAttendanceRepository = dataSource.getMongoRepository(StudentAttendance);
export const AcademicAreaCoursePeriodValuationRepository = dataSource.getMongoRepository(
  AcademicAreaCoursePeriodValuation,
);
export const SchoolConfigurationRepository = dataSource.getMongoRepository(SchoolConfiguration);
export const AcademicAsignatureCoursePeriodEvidenceLearningValuationRepository =
  dataSource.getMongoRepository(AcademicAsignatureCoursePeriodEvidenceLearningValuation);
export const AverageAcademicPeriodStudentRepository = dataSource.getMongoRepository(
  AverageAcademicPeriodStudent,
);
export const AverageAcademicPeriodCourseRepository = dataSource.getMongoRepository(
  AverageAcademicPeriodCourse,
);
export const StudentBehaviourRepository = dataSource.getMongoRepository(StudentBehaviour);
export const ObserverAnnotationTypeRepository =
  dataSource.getMongoRepository(ObserverAnnotationType);
export const StudentObserverAnnotationRepository =
  dataSource.getMongoRepository(StudentObserverAnnotation);
export const AcademicAsignatureCourseYearValuationRepository = dataSource.getMongoRepository(
  AcademicAsignatureCourseYearValuation,
);
export const AcademicAreaCourseYearValuationRepository = dataSource.getMongoRepository(
  AcademicAreaCourseYearValuation,
);
export const AverageAcademicYearStudentRepository = dataSource.getMongoRepository(
  AverageAcademicYearStudent,
);
export const AverageAcademicYearCourseRepository =
  dataSource.getMongoRepository(AverageAcademicYearCourse);
export const StudentYearBehaviourRepository = dataSource.getMongoRepository(StudentYearBehaviour);
export const VideoTutorialRepository = dataSource.getMongoRepository(VideoTutorial);
export const FrecuentQuestionRepository = dataSource.getMongoRepository(FrecuentQuestion);
export const ForumQuestionRepository = dataSource.getMongoRepository(ForumQuestion);
export const SyncOfflineRepository = dataSource.getMongoRepository(SyncOffline);
