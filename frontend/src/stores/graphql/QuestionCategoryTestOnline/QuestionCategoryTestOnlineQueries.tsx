import { gql } from '@apollo/client';

export const QUERY_GET_ALL_QUESTION_CATEGORY_TEST_ONLINE = gql`
  query getAllQuestionCategoryTestOnline($campusId: String!) {
    data: getAllQuestionCategoryTestOnline(orderCreated: true, allData: true, campusId: $campusId) {
      edges {
        cursor
        node {
          id
          name
          description
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_QUESTION_CATEGORY_TEST_ONLINE = gql`
  query getQuestionCategoryTestOnline($id: String!) {
    data: getQuestionCategoryTestOnline(id: $id) {
      id
      name
      description
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
