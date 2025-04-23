import { gql } from '@apollo/client';

export const QUERY_GET_ALL_QUESTION_TEST_ONLINE = gql`
  query getAllQuestionTestOnline($campusId: String!) {
    data: getAllQuestionTestOnline(orderCreated: true, allData: true, campusId: $campusId) {
      edges {
        cursor
        node {
          id
          name
          statement
          questionType
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_QUESTION_TYPES = gql`
    query getAllQuestionTypeTestOnline {
      __type(name: "QuestionTypeTestOnline") {
        name
        enumValues {
          name
        }
      }
    }
`;

export const QUERY_GET_QUESTION_TEST_ONLINE = gql`
  query getQuestionTestOnline($id: String!) {
    data: getQuestionTestOnline(id: $id) {
      id
      name
      statement
      questionType
      questionCategoryTestOnlineId
      questionCategoryTestOnline {
        id
        name
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



export const QUERY_GET_DROPDOWNS_QUESTION_TEST_ONLINE = gql`
  query getDropdownsQuestionsTestOnline($campusId: String!) {
    dataCategories: getAllQuestionCategoryTestOnline(orderCreated: true, allData: true, campusId: $campusId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
