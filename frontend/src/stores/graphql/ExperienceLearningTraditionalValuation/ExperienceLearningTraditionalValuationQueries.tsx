import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  query getAllExperienceLearningTraditionalValuation($experienceLearningId: String!) {
    data: getAllExperienceLearningTraditionalValuation(orderCreated: true, allData: true, experienceLearningId: $experienceLearningId) {
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
            colorHex
            abbreviation
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

export const QUERY_GET_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  query getExperienceLearningTraditionalValuation($id: String!) {
    data: getExperienceLearningTraditionalValuation(id: $id) {
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
