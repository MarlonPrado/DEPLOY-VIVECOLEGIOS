import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  query getAllExperienceLearningCoEvaluation($experienceLearningId: String!) {
    data: getAllExperienceLearningCoEvaluation(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId) {
      edges {
        cursor
        node {
          id                                      
          active  
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
          assessment
          observations
          coEvaluatorId
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

export const QUERY_GET_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  query getExperienceLearningCoEvaluation($id: String!) {
    data: getExperienceLearningCoEvaluation(id: $id) {
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
