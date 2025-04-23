import { gql } from '@apollo/client';

export const QUERY_GET_ALL_GRADE_ASSIGNMENT = gql`
  query getAllGradeAssignment($schoolId: String!, $academicGradeId: String, $allData: Boolean!) {
    data: getAllGradeAssignment(orderCreated: true, allData: $allData, schoolId: $schoolId, academicGradeId: $academicGradeId) {
      edges {
        cursor
        node {
          id
          maxHourlyIntensity                            
          minHourlyIntensity                            
          academicAsignature {
            name
            id
            academicArea {
              id
              name
              order
            }
            order
            academicAreaId
          }           
          academicAsignatureId
          academicGrade {    
            name
            id
          }             
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_GRADE_ASSIGNMENT_BY_ASIGNATURE = gql`
  query getAllGradeAssignment($schoolId: String!, $academicAsignatureId: String) {
    data: getAllGradeAssignment(orderCreated: true, allData: true, schoolId: $schoolId, academicAsignatureId: $academicAsignatureId) {
      edges {
        cursor
        node {
          id
          maxHourlyIntensity                            
          minHourlyIntensity                            
          academicAsignatureId
          academicAsignature {
            id
            name
            generalAcademicAsignatureId
            academicArea {
              id
              name
            }
          }           
          academicGradeId 
          academicGrade {             
            id   
            name
            generalAcademicGradeId
          }                   
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_GRADE_ASSIGNMENT = gql`
  query getGradeAssignment($id: String!) {
    data: getGradeAssignment(id: $id) {
      id   
      version
      maxHourlyIntensity                            
      minHourlyIntensity            
      academicAsignatureId              
      academicAsignature {
        id 
        name
        generalAcademicAsignature {
           id
           name
        }
      }
      academicGradeId              
      academicGrade {
        id 
        name
        generalAcademicCycle {
           id
           name
        }
      }                  
      schoolId
      school {
        id
        name
      }   
      createdAt
      updatedAt
      createdByUser {
        name
      }
      updatedByUser {
        name
      }
    }
  }
`;

export const QUERY_GET_DROPDOWNS_GRADE_ASSIGNMENT = gql`
  query getDropdownsAcademicArea($schoolId: String!, $academicGradeId: String!, $schoolYearId: String) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAsignatures: getAllAcademicAsignatureNotAssignedInAcademicGrade(schoolId: $schoolId, academicGradeId: $academicGradeId, schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGrades: getAllAcademicGrade(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
