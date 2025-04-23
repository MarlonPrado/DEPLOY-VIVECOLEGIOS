import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  query getAllExperienceLearningRubricValuation($experienceLearningId: String!) {
    data: getAllExperienceLearningRubricValuation(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId) {
      edges {
        cursor
        node {
          id                                      
          active  
          assessment    
          performanceLevel {
            id
            name
          }    
          observations
          studentId
          student {
            id
            code
            user {
              id
              name
              lastName
              profilePhoto
            }
          }        
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  query getExperienceLearningRubricValuation($id: String!) {
    data: getExperienceLearningRubricValuation(id: $id) {
      id       
      assessment 
      observations
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
