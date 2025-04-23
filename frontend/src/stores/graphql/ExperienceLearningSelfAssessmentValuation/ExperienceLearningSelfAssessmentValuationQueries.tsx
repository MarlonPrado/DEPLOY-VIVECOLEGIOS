import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  query getAllExperienceLearningSelfAssessmentValuation($experienceLearningId: String!, $studentId: String) {
    data: getAllExperienceLearningSelfAssessmentValuation(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId, studentId: $studentId) {
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
              profilePhoto
            }
          }        
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  query getExperienceLearningSelfAssessmentValuation($id: String!) {
    data: getExperienceLearningSelfAssessmentValuation(id: $id) {
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
