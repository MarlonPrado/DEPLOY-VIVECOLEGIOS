import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  query getAllExperienceLearningRubricCriteriaValuationStudent($experienceLearningId: String! $studentId: String) {
    data: getAllExperienceLearningRubricCriteriaValuationStudent(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId, studentId: $studentId) {
      edges {
        cursor
        node {
          id                                      
          active  
          assessment
          performanceLevel {
            name
            id
            type
          } 
          experienceLearningRubricCriteriaId
          experienceLearningRubricCriteria {
            evidenceLearnig {
              statement
            }
            criteria
            weight
            experienceLearningRubricCriteriaPerformanceLevel {
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

export const QUERY_GET_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  query getExperienceLearningRubricCriteriaValuation($id: String!) {
    data: getExperienceLearningRubricCriteriaValuation(id: $id) {
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
