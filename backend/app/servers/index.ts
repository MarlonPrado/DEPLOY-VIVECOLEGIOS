import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import Cors from 'cors';
import Express, { RequestHandler } from 'express';
import fs from 'fs';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import Helmet from 'helmet';
import http from 'http';
import Morgan from 'morgan';
import path from 'path';
import { env } from 'process';
import 'reflect-metadata';
import { SERVER_NAME_APP, SERVER_PORT_APP } from '../config';
import { buildFederatedSchema } from '../graphql/helpers/buildFederatedSchema';
import { ErrorLoggerMiddleware } from '../graphql/middlewares/error-logger';
import { LogAccessMiddleware } from '../graphql/middlewares/log-access';
import { ResolveTimeMiddleware } from '../graphql/middlewares/resolve-time';
import { AcademicAreaCoursePeriodValuationResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAreaCoursePeriodValuationResolver';
import { AcademicAreaCourseYearValuationResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAreaCourseYearValuationResolver';
import { AcademicAsignatureCoursePeriodEvidenceLearningValuationResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAsignatureCoursePeriodEvidenceLearningValuationResolver';
import { AcademicAsignatureCoursePeriodValuationResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAsignatureCoursePeriodValuationResolver';
import { AcademicAsignatureCourseResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAsignatureCourseResolver';
import { AcademicAsignatureCourseYearValuationResolver } from '../graphql/resolvers/CampusAdministrator/AcademicAsignatureCourseYearValuationResolver';
import { AcademicHourResolver } from '../graphql/resolvers/CampusAdministrator/AcademicHourResolver';
import { AcademicScheduleResolver } from '../graphql/resolvers/CampusAdministrator/AcademicScheduleResolver';
import { AverageAcademicPeriodStudentResolver } from '../graphql/resolvers/CampusAdministrator/AverageAcademicPeriodStudentResolver';
import { AverageAcademicYearCourseResolver } from '../graphql/resolvers/CampusAdministrator/AverageAcademicYearCourseResolver';
import { AverageAcademicYearStudentResolver } from '../graphql/resolvers/CampusAdministrator/AverageAcademicYearStudentResolver';
import { ClassroomPlanExpectedPerformanceResolver } from '../graphql/resolvers/CampusAdministrator/ClassroomPlanExpectedPerformanceResolver';
import { ClassroomPlanPerformanceAppraisalStrategyResolver } from '../graphql/resolvers/CampusAdministrator/ClassroomPlanPerformanceAppraisalStrategyResolver';
import { ClassroomPlanResolver } from '../graphql/resolvers/CampusAdministrator/ClassroomPlanResolver';
import { ExperienceLearningAverageValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningAverageValuationResolver';
import { ExperienceLearningCoEvaluationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningCoEvaluationResolver';
import { ExperienceLearningCoEvaluationValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningCoEvaluationValuationResolver';
import { ExperienceLearningPerformanceLevelResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningPerformanceLevelResolver';
import { ExperienceLearningResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningResolver';
import { ExperienceLearningRubricCriteriaPerformanceLevelResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningRubricCriteriaPerformanceLevelResolver';
import { ExperienceLearningRubricCriteriaResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningRubricCriteriaResolver';
import { ExperienceLearningRubricCriteriaValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningRubricCriteriaValuationResolver';
import { ExperienceLearningRubricValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningRubricValuationResolver';
import { ExperienceLearningSelfAssessmentValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningSelfAssessmentValuationResolver';
import { ExperienceLearningTraditionalValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningTraditionalValuationResolver';
import { ExperienceLearningValuationResolver } from '../graphql/resolvers/CampusAdministrator/ExperienceLearningValuationResolver';
import { ForumInteractionResolver } from '../graphql/resolvers/CampusAdministrator/ForumInteractionResolver';
import { ForumQuestionResolver } from '../graphql/resolvers/CampusAdministrator/ForumQuestionResolver';
import { ForumResolver } from '../graphql/resolvers/CampusAdministrator/ForumResolver';
import { QuestionBankTestOnlineResolver } from '../graphql/resolvers/CampusAdministrator/QuestionBankTestOnlineResolver';
import { QuestionCategoryTestOnlineResolver } from '../graphql/resolvers/CampusAdministrator/QuestionCategoryTestOnlineResolver';
import { QuestionTestOnlineResolver } from '../graphql/resolvers/CampusAdministrator/QuestionTestOnlineResolver';
import { StudentAttendanceResolver } from '../graphql/resolvers/CampusAdministrator/StudentAttendanceResolver';
import { StudentBehaviourResolver } from '../graphql/resolvers/CampusAdministrator/StudentBehaviourResolver';
import { StudentObserverAnnotationResolver } from '../graphql/resolvers/CampusAdministrator/StudentObserverAnnotationResolver';
import { StudentYearBehaviourResolver } from '../graphql/resolvers/CampusAdministrator/StudentYearBehaviourResolver';
import { AuditLoginResolver } from '../graphql/resolvers/GeneralAdministrator/AuditLoginResolver';
import { BackupResolver } from '../graphql/resolvers/GeneralAdministrator/BackupResolver';
import { GenderResolver } from '../graphql/resolvers/GeneralAdministrator/GenderResolver';
import { GeneralAcademicAsignatureResolver } from '../graphql/resolvers/GeneralAdministrator/GeneralAcademicAsignatureResolver';
import { GeneralBasicLearningRightResolver } from '../graphql/resolvers/GeneralAdministrator/GeneralBasicLearningRightResolver';
import { ImportDataSchoolResolver } from '../graphql/resolvers/GeneralAdministrator/ImportDataSchoolResolver';
import { SchoolAdministrativeResolver } from '../graphql/resolvers/GeneralAdministrator/SchoolAdministrativeResolver';
import { VideoTutorialResolver } from '../graphql/resolvers/GeneralAdministrator/VideoTutorialResolver';
import { CertificateFinalReportResolver } from '../graphql/resolvers/SchoolAdministrator/CertificateFinalReport';
import { EvidenceLearningResolver } from '../graphql/resolvers/SchoolAdministrator/EvidenceLearningResolver';
import { LearningResolver } from '../graphql/resolvers/SchoolAdministrator/LearningResolver';
import { ObserverAnnotationTypeResolver } from '../graphql/resolvers/SchoolAdministrator/ObserverAnnotationTypeResolver';
import { PerformanceFinalReportResolver } from '../graphql/resolvers/SchoolAdministrator/PerformanceFinalReportResolver';
import { PerformanceReportResolver } from '../graphql/resolvers/SchoolAdministrator/PerformanceReportResolver';
import { SchoolConfigurationResolver } from '../graphql/resolvers/SchoolAdministrator/SchoolConfigurationResolver';
import { SyncOfflineResolver } from '../graphql/resolvers/SchoolAdministrator/SyncOfflineResolver';
import { AcademicDayResolver } from './../graphql/resolvers/CampusAdministrator/AcademicDayResolver';
import { CourseResolver } from './../graphql/resolvers/CampusAdministrator/CourseResolver';
import { GuardianResolver } from './../graphql/resolvers/CampusAdministrator/GuardianResolver';
import { TeacherResolver } from './../graphql/resolvers/CampusAdministrator/TeacherResolver';
import { CampusResolver } from './../graphql/resolvers/GeneralAdministrator/CampusResolver';
import { DocumentTypeResolver } from './../graphql/resolvers/GeneralAdministrator/DocumentTypeResolver';
import { EmailResolver } from './../graphql/resolvers/GeneralAdministrator/EmailResolver';
import { GeneralAcademicAreaResolver } from './../graphql/resolvers/GeneralAdministrator/GeneralAcademicAreaResolver';
import { GeneralAcademicCycleResolver } from './../graphql/resolvers/GeneralAdministrator/GeneralAcademicCycleResolver';
import { GeneralAcademicGradeResolver } from './../graphql/resolvers/GeneralAdministrator/GeneralAcademicGradeResolver';
import { GeneralAcademicStandardResolver } from './../graphql/resolvers/GeneralAdministrator/GeneralAcademicStandardResolver';
import { GeneralPerformanceLevelResolver } from './../graphql/resolvers/GeneralAdministrator/GeneralPerformanceLevelResolver';
import { InboxResolver } from './../graphql/resolvers/GeneralAdministrator/InboxResolver';
import { MenuItemResolver } from './../graphql/resolvers/GeneralAdministrator/MenuItemResolver';
import { MenuResolver } from './../graphql/resolvers/GeneralAdministrator/MenuResolver';
import { ModuleResolver } from './../graphql/resolvers/GeneralAdministrator/ModuleResolver';
import { MunicipalityResolver } from './../graphql/resolvers/GeneralAdministrator/MunicipalityResolver';
import { NotificationResolver } from './../graphql/resolvers/GeneralAdministrator/NotificationResolver';
import { RoleResolver } from './../graphql/resolvers/GeneralAdministrator/RoleResolver';
import { SchoolAdministratorResolver } from './../graphql/resolvers/GeneralAdministrator/SchoolAdministratorResolver';
import { SchoolResolver } from './../graphql/resolvers/GeneralAdministrator/SchoolResolver';
import { StudentResolver } from './../graphql/resolvers/GeneralAdministrator/StudentResolver';
import { UserResolver } from './../graphql/resolvers/GeneralAdministrator/UserResolver';
import { AcademicAreaResolver } from './../graphql/resolvers/SchoolAdministrator/AcademicAreaResolver';
import { AcademicAsignatureResolver } from './../graphql/resolvers/SchoolAdministrator/AcademicAsignatureResolver';
import { AcademicGradeResolver } from './../graphql/resolvers/SchoolAdministrator/AcademicGradeResolver';
import { AcademicPeriodResolver } from './../graphql/resolvers/SchoolAdministrator/AcademicPeriodResolver';
import { AcademicStandardResolver } from './../graphql/resolvers/SchoolAdministrator/AcademicStandardResolver';
import { CampusAdministratorResolver } from './../graphql/resolvers/SchoolAdministrator/CampusAdministratorResolver';
import { CampusCoordinatorResolver } from './../graphql/resolvers/SchoolAdministrator/CampusCoordinatorResolver';
import { EducationLevelResolver } from './../graphql/resolvers/SchoolAdministrator/EducationLevelResolver';
import { EvaluativeComponentResolver } from './../graphql/resolvers/SchoolAdministrator/EvaluativeComponentResolver';
import { GradeAssignmentResolver } from './../graphql/resolvers/SchoolAdministrator/GradeAssignmentResolver';
import { ModalityResolver } from './../graphql/resolvers/SchoolAdministrator/ModalityResolver';
import { PerformanceLevelResolver } from './../graphql/resolvers/SchoolAdministrator/PerformanceLevelResolver';
import { SchoolYearResolver } from './../graphql/resolvers/SchoolAdministrator/SchoolYearResolver';
import { SpecialtyResolver } from './../graphql/resolvers/SchoolAdministrator/SpecialtyResolver';
import { dataSource } from './DataSource';

const PORT = SERVER_PORT_APP;
const SERVER_NAME = SERVER_NAME_APP;

const cluster = require('node:cluster');
//const numCPUs = env.NODE_ENV === "development" ? 2 : require('node:os').cpus().length;
const numCPUs = env.NODE_ENV === 'development' ? 1 : 1;
const expressHealthApi = require('express-health-api');

async function app() {
  try {
    const federatedSchema = await buildFederatedSchema({
      resolvers: [
        AuditLoginResolver,
        DocumentTypeResolver,
        EmailResolver,
        GenderResolver,
        InboxResolver,
        MenuResolver,
        ModuleResolver,
        NotificationResolver,
        RoleResolver,
        UserResolver,
        MenuItemResolver,
        CampusResolver,
        GeneralAcademicAreaResolver,
        GeneralAcademicAsignatureResolver,
        GeneralAcademicCycleResolver,
        GeneralAcademicGradeResolver,
        GeneralAcademicStandardResolver,
        GeneralPerformanceLevelResolver,
        MunicipalityResolver,
        SchoolAdministratorResolver,
        SchoolResolver,
        StudentResolver,
        AcademicAreaResolver,
        AcademicAsignatureResolver,
        AcademicGradeResolver,
        AcademicPeriodResolver,
        AcademicStandardResolver,
        CampusAdministratorResolver,
        CampusCoordinatorResolver,
        EducationLevelResolver,
        EvaluativeComponentResolver,
        GradeAssignmentResolver,
        ModalityResolver,
        PerformanceLevelResolver,
        SchoolYearResolver,
        SpecialtyResolver,
        AcademicDayResolver,
        AcademicHourResolver,
        CourseResolver,
        GuardianResolver,
        TeacherResolver,
        ForumResolver,
        ForumInteractionResolver,
        AcademicAsignatureCourseResolver,
        AcademicScheduleResolver,
        LearningResolver,
        EvidenceLearningResolver,
        GeneralBasicLearningRightResolver,
        ExperienceLearningResolver,
        ExperienceLearningTraditionalValuationResolver,
        ExperienceLearningSelfAssessmentValuationResolver,
        ExperienceLearningCoEvaluationValuationResolver,
        ExperienceLearningCoEvaluationResolver,
        ExperienceLearningRubricCriteriaPerformanceLevelResolver,
        ExperienceLearningRubricCriteriaResolver,
        ExperienceLearningRubricValuationResolver,
        ExperienceLearningRubricCriteriaValuationResolver,
        ExperienceLearningPerformanceLevelResolver,
        ExperienceLearningAverageValuationResolver,
        AcademicAsignatureCoursePeriodValuationResolver,
        QuestionBankTestOnlineResolver,
        QuestionCategoryTestOnlineResolver,
        QuestionTestOnlineResolver,
        ClassroomPlanPerformanceAppraisalStrategyResolver,
        ClassroomPlanExpectedPerformanceResolver,
        ClassroomPlanResolver,
        SchoolAdministrativeResolver,
        ExperienceLearningValuationResolver,
        StudentAttendanceResolver,
        PerformanceReportResolver,
        SchoolConfigurationResolver,
        AcademicAreaCoursePeriodValuationResolver,
        AcademicAsignatureCoursePeriodEvidenceLearningValuationResolver,
        StudentBehaviourResolver,
        ObserverAnnotationTypeResolver,
        StudentObserverAnnotationResolver,
        AcademicAsignatureCourseYearValuationResolver,
        AcademicAreaCourseYearValuationResolver,
        AverageAcademicPeriodStudentResolver,
        AverageAcademicYearCourseResolver,
        AverageAcademicYearStudentResolver,
        CertificateFinalReportResolver,
        PerformanceFinalReportResolver,
        StudentYearBehaviourResolver,
        ImportDataSchoolResolver,
        VideoTutorialResolver,
        BackupResolver,
        ForumQuestionResolver,
        SyncOfflineResolver,
      ],
      globalMiddlewares: [ErrorLoggerMiddleware, ResolveTimeMiddleware, LogAccessMiddleware],
    });

    const configExpressStatusMonitor = {
      title: 'Express Status ViveColegios', // Default title
      theme: 'default.css', // Default styles
      path: '/status',
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        eventLoop: true,
        heap: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      healthChecks: [
        {
          protocol: 'http',
          host: 'localhost',
          path: `/healthcheck-${SERVER_NAME_APP}`,
          port: `${SERVER_PORT_APP}`,
        },
      ],
    };

    await dataSource
      .initialize()
      .then((connection) => {
        console.log('TypeORM with mongodb: ' + SERVER_NAME);
        // console.log(connection.options);
        // console.log(connection.driver.options);
      })
      .catch((error) => {
        console.error(error);
      });

    const server = new ApolloServer({
      schema: federatedSchema,
      includeStacktraceInErrorResponses: true,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
      ],
      csrfPrevention: true,
      formatError: (err: any) => {
        console.error('GraphQL Error 2', err);
        const errorReport = {
          message: err.message,
          locations: err.locations,
          path: err.path,
          stacktrace: err.extensions?.exception?.stacktrace || [],
          code: err.extensions?.code,
        };
        console.error('GraphQL Error 2', errorReport);

        return errorReport;
      },
    });

    const app = Express();
    const httpServer = http.createServer(app);
    await server.start();
    // Middlewares

    app.use(`/healthcheck-${SERVER_NAME}`, require('express-healthcheck')());
    app.use(require('express-status-monitor')(configExpressStatusMonitor));
    //log only 4xx and 5xx responses to console
    app.use(
      Morgan('dev', {
        skip: function (req, res) {
          return res.statusCode < 400;
        },
      }),
    );

    // log all requests to access.log
    app.use(
      Morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
      }),
    );

    app.use(
      Helmet({
        contentSecurityPolicy: false,
        xDownloadOptions: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    app.use(Cors({ origin: '*' }));

    app.use(Express.json({ limit: '800mb' }));

    app.use(expressHealthApi({ apiPath: '/health' }));

    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

    app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

    app.use(
      expressMiddleware(server, {
        context: async ({ req }: any) => {
          const user = req?.headers?.user ? JSON.parse(req?.headers?.user) : null;
          return { user };
        },
      }) as RequestHandler,
    );

    await new Promise((resolve) => {
      httpServer.listen({ port: PORT }, () => {
        console.log(`🚀 Server ${SERVER_NAME} Ready and Listening at ==> http://localhost:${PORT}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

if (cluster.isMaster) {
  console.log(`Master Services ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  // This event is firs when worker died
  cluster.on('exit', (worker: { process: { pid: any } }, code: any, signal: any) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
// For Worker
else {
  app();
}
