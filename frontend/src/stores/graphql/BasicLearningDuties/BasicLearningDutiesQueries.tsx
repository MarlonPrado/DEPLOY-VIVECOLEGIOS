import { gql } from '@apollo/client';

export const QUERY_GET_ALL_GENERAL_BASIC_LEARNING_RIGHT = gql`
  query getAllGeneralBasicLearningRight($generalAcademicAsignatureId: String!, $generalAcademicGradeId: String!) {
    data: getAllGeneralBasicLearningRight(orderCreated: true, allData: true, generalAcademicAsignatureId: $generalAcademicAsignatureId, generalAcademicGradeId: $generalAcademicGradeId) {
      edges {
        cursor
        node {
          id
          dba
          category                   
          active   
          generalAcademicAsignature {
            id 
            name
          }             
          generalAcademicGrade {
            id 
            name
          }            
        }
      }
      totalCount
    }
  }
  `;

export const QUERY_GET_GENERAL_BASIC_LEARNING_RIGHT = gql`
  query getGeneralBasicLearningRight($id: String!) {
    data: getGeneralBasicLearningRight(id: $id) {
      id   
      version
      dba
      category  
      generalAcademicAsignatureId              
      generalAcademicAsignature {
        id 
        name
      }
      generalAcademicGradeId              
      generalAcademicGrade {
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

export const QUERY_GET_DROPDOWNS_GENERAL_BASIC_LEARNING_RIGHT = gql`
  query getDropdownsGeneralBasicLearningRight {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAsignatures: getAllGeneralAcademicAsignature(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGrades: getAllGeneralAcademicGrade(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
