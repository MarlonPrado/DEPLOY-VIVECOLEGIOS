/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client';

export const QUERY_GET_VALUATIONS_STUDENT = gql`
  query getValuationStudents($id: String!) {
    data: getValuationStudents(id: $id) {
      id
      studentId
      experienceLearningId
      assessment       
      performanceLevel {
        name
        colorHex
        abbreviation
      }   
    }
  }
`;

export const QUERY_GET_All_EXPERIENCE_LEARNING_AVERAGE_VALUATION = gql`
  query getAllExperienceLearningAverageValuation($evaluativeComponentId : String!, $academicPeriodId: String!, $academicAsignatureCourseId: String!,     $experienceLearningType: ExperienceLearningType!) {
    data: getAllExperienceLearningAverageValuation(orderCreated: true, allData: true, evaluativeComponentId:$evaluativeComponentId, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId, experienceLearningType: $experienceLearningType) {
      edges {
        cursor
        node {
          id
          studentId
          evaluativeComponentId
          average 
          performanceLevel {
            name
            colorHex
            abbreviation
          }   
        }
      }    
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION = gql`
  query getAllAcademicAsignatureCoursePeriodValuation($academicPeriodId: String!, $academicAsignatureCourseId: String!) {
    data: getAllAcademicAsignatureCoursePeriodValuation(orderCreated: true, allData: true, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId) {
      edges {
        cursor
        node {
          id
          studentId
          valuationType
          assessment   
          academicAsignatureCourseId
          academicPeriodId
          performanceLevelId 
          performanceLevel {
            name
            colorHex
            abbreviation
            isRecovery
          }    
          valuationType  
        }
      }    
       
    }
  }
`;


export const QUERY_GET_All_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION_STUDENT = gql`
  query getAllAcademicAsignatureCoursePeriodValuation($academicPeriodId: String!, $academicAsignatureCourseId: String!, $studentId: String!) {
    data: getAllAcademicAsignatureCoursePeriodValuation(orderCreated: true, allData: true, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId, studentId: $studentId) {
      edges {
        cursor
        node {
          id
          studentId
          assessment    
          academicAsignatureCourseId
          academicPeriodId
          performanceLevelId
          performanceLevel {
            name
            colorHex
            abbreviation
          }      
          valuationType
        }
      }    
       
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_AREA_COURSE_PERIOD_VALUATION = gql`
  query getAllAcademicAreaCoursePeriodValuation($academicPeriodId: String!, $academicAreaId: String!) {
    data: getAllAcademicAreaCoursePeriodValuation(orderCreated: true, allData: true, academicPeriodId: $academicPeriodId, academicAreaId: $academicAreaId) {
      edges {
        cursor
        node {
          id
          studentId
          assessment    
          academicAreaId
          academicPeriodId 
          performanceLevelId
          performanceLevel {
            name
            colorHex
            abbreviation
          }      
          valuationType
        }
      }    
       
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_AREA_COURSE_PERIOD_VALUATION_STUDENT = gql`
  query getAllAcademicAreaCoursePeriodValuation($academicPeriodId: String!, $academicAreaId: String!, $studentId: String!) {
    data: getAllAcademicAreaCoursePeriodValuation(orderCreated: true, allData: true, academicPeriodId: $academicPeriodId, academicAreaId: $academicAreaId, studentId: $studentId) {
      edges {
        cursor
        node {
          id
          studentId
          assessment   
          academicAreaId
          academicPeriodId 
          performanceLevelId
          performanceLevel {
            name
            colorHex
            abbreviation
          }   
          valuationType   
        }
      }    
       
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_ASIGNATURE_COURSE_YEAR_VALUATION = gql`
  query getAllAcademicAsignatureCourseYearValuation($schoolYearId: String!, $academicAsignatureCourseId: String!) {
    data: getAllAcademicAsignatureCourseYearValuation(orderCreated: true, allData: true, schoolYearId: $schoolYearId, academicAsignatureCourseId: $academicAsignatureCourseId) {
      edges {
        cursor
        node {
          id
          studentId
          valuationType
          assessment   
          academicAsignatureCourseId
          schoolYearId
          performanceLevelId 
          performanceLevel {
            name
            colorHex
            abbreviation
            isRecovery
          }    
          valuationType  
        }
      }    
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_AREA_COURSE_YEAR_VALUATION = gql`
  query getAllAcademicAreaCourseYearValuation($schoolYearId: String!, $academicAreaId: String!) {
    data: getAllAcademicAreaCourseYearValuation(orderCreated: true, allData: true, schoolYearId: $schoolYearId, academicAreaId: $academicAreaId) {
      edges {
        cursor
        node {
          id
          studentId
          valuationType
          assessment   
          academicAreaId
          schoolYearId
          performanceLevelId 
          performanceLevel {
            name
            colorHex
            abbreviation
            isRecovery
          }    
          valuationType  
        }
      }    
    }
  }
`;


export const QUERY_GET_All_ACADEMIC_ASIGNATURE_COURSE_YEAR_VALUATION_STUDENT = gql`
  query getAllAcademicAsignatureCourseYearValuation($schoolYearId: String!, $academicAsignatureCourseId: String!, $studentId: String!) {
    data: getAllAcademicAsignatureCourseYearValuation(orderCreated: true, allData: true, schoolYearId: $schoolYearId, academicAsignatureCourseId: $academicAsignatureCourseId, studentId: $studentId) {
      edges {
        cursor
        node {
          id
          studentId
          assessment    
          academicAsignatureCourseId
          schoolYearId
          performanceLevelId
          performanceLevel {
            name
            colorHex
            abbreviation
          }      
          valuationType
        }
      }    
       
    }
  }
`;

export const QUERY_GET_All_ACADEMIC_AREA_COURSE_YEAR_VALUATION_STUDENT = gql`
  query getAllAcademicAreaCourseYearValuation($schoolYearId: String!, $academicAreaId: String!, $studentId: String!) {
    data: getAllAcademicAreaCourseYearValuation(orderCreated: true, allData: true, schoolYearId: $schoolYearId, academicAreaId: $academicAreaId, studentId: $studentId) {
      edges {
        cursor
        node {
          id
          studentId
          assessment   
          academicAreaId
          schoolYearId 
          performanceLevelId
          performanceLevel {
            name
            colorHex
            abbreviation
          }   
          valuationType   
        }
      }    
       
    }
  }
`;