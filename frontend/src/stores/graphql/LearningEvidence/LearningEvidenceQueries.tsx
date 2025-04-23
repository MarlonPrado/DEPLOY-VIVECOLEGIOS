import { gql } from '@apollo/client';

export const QUERY_GET_ALL_LEARNING_EVIDENCE = gql`
  query getAllEvidenceLearning($schoolId: String!, $learningId: String!) {
    data: getAllEvidenceLearning(orderCreated: true, allData: true, schoolId: $schoolId, learningId: $learningId) {
      edges {
        cursor
        node {
          id
          statement
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_LEARNING_EVIDENCE = gql`
  query getEvidenceLearning($id: String!) {
    data: getEvidenceLearning(id: $id) {
      id
      statement
      schoolId
      school {
        id
        name
      }
      learningId 
      learning {
        id 
        statement
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

export const QUERY_GET_DROPDOWNS_LEARNING_EVIDENCE = gql`
  query getDropdownsEvidenceLearning {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
