import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  query getAllExperienceLearningCoEvaluationValuation($experienceLearningId: String!) {
    data: getAllExperienceLearningCoEvaluationValuation(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId) {
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
          experienceLearning {
            id
            criteria
            experienceLearningPerformanceLevel {
              criteria
              performanceLevelId
              performanceLevel {
                name
                minimumScore
                topScore
              }
            }
          }         
          studentId
          student {
            id
            code
            user {
              id
              name
              lastName
            }
          }        
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  query getExperienceLearningCoEvaluationValuation($id: String!) {
    data: getExperienceLearningCoEvaluationValuation(id: $id) {
      id        
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
