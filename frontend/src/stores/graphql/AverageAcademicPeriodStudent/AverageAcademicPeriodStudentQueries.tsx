import { gql } from '@apollo/client';

export const QUERY_GET_All_AVERAGE_ACADEMIC_PERIOD_STUDENT = gql`
  query getAllAverageAcademicPeriodStudent($academicPeriodId: String!, $courseId: String!) {
    data: getAllAverageAcademicPeriodStudent(orderCreated: true, allData: true, academicPeriodId: $academicPeriodId, courseId: $courseId) {
      edges {
        cursor
        node {
          id
          studentId
          score
          assessment   
          academicPeriodId
          performanceLevelId 
          performanceLevel {
            name
            colorHex
            abbreviation
            isRecovery
          }    
        }
      }    
    }
  }
`;

export const QUERY_GET_All_AVERAGE_ACADEMIC_YEAR_STUDENT = gql`
  query getAllAverageAcademicYearStudent($schoolYearId: String!, $courseId: String!) {
    data: getAllAverageAcademicYearStudent(orderCreated: true, allData: true, schoolYearId: $schoolYearId, courseId: $courseId) {
      edges {
        cursor
        node {
          id
          studentId
          score
          assessment   
          schoolYearId
          performanceLevelId 
          performanceLevel {
            name
            colorHex
            abbreviation
            isRecovery
          }    
        }
      }    
    }
  }
`;