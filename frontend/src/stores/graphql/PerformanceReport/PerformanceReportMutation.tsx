import { gql } from '@apollo/client';

export const GENERATE_PERFORMANCE_REPORT_COURSE = gql`
  mutation generatePerformanceReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!, $academicPeriodId: String!, $format: String!) {
    generate: generatePerformanceReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, academicPeriodId: $academicPeriodId, format: $format)
  }
`;

export const GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT = gql`
  mutation generatePerformanceReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!, $academicPeriodId: String!, $format: String!,$studentId: String!) {
    generate: generatePerformanceReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, academicPeriodId: $academicPeriodId, format: $format, studentId: $studentId)
  }
`;

export const GENERATE_PERFORMANCE_REPORT_COURSE_2 = gql`
  mutation generatePerformanceFinalReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!,$format: String!) {
    generate: generatePerformanceFinalReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, format: $format)
  }
`;

export const GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_2 = gql`
  mutation generatePerformanceFinalReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!, $format: String!,$studentId: String!) {
    generate: generatePerformanceFinalReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, format: $format, studentId: $studentId)
  }
`;

export const GENERATE_PERFORMANCE_REPORT_COURSE_3 = gql`
  mutation generateCertificateFinalReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!,$format: String!) {
    generate: generateCertificateFinalReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, format: $format)
  }
`;

export const GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_3 = gql`
  mutation generateCertificateFinalReportCourse($id: String!, $schoolId: String!, $schoolYearId: String!, $format: String!,$studentId: String!) {
    generate: generateCertificateFinalReportCourse(id: $id, schoolId: $schoolId, schoolYearId: $schoolYearId, format: $format, studentId: $studentId)
  }
`;



