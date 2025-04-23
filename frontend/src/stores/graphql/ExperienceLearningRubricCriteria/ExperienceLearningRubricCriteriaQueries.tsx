import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  query getAllExperienceLearningRubricCriteria($experienceLearningId: String!) {
    data: getAllExperienceLearningRubricCriteria(
      orderCreated: true
      allData: true
      experienceLearningId: $experienceLearningId
    ) {
      edges {
        cursor
        node {
          id
          active
          weight
          criteria
          experienceLearningId
          experienceLearning {
            id
            title
          }
          experienceLearningRubricCriteriaPerformanceLevel {
            criteria
            performanceLevelId
            performanceLevel {
              id
              name
            }            
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  query getExperienceLearningRubricCriteria($id: String!) {
    data: getExperienceLearningRubricCriteria(id: $id) {
      id
      weight
      criteria
      evidenceLearningId
      evidenceLearnig {
        id
        statement
      }
      experienceLearningRubricCriteriaPerformanceLevel {
        criteria
        performanceLevelId
        performanceLevel{
          topScore
          minimumScore
        }
      }
      experienceLearningId
      experienceLearning {
        id
        title
      }
      version
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

export const QUERY_GET_DROPDOWNS_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  query getDropdownsExperienceLearningRubricCriteria($id: String!, $schoolId: String!) {
    dataExperienceLearning: getExperienceLearning(id: $id) {
      id
      evidenceLearningsId
      evidenceLearnings {
        id
        statement
      }
    }
    dataPerformanceLevels: getAllPerformanceLevel(orderCreated: true, allData: true, schoolId: $schoolId) {
      edges {
        cursor
        node {
          id
          name
          topScore
          minimumScore
        }
      }
    }
  }
`;
