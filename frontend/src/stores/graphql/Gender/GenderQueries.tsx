import { gql } from '@apollo/client';

export const QUERY_GET_ALL_GENDER = gql`
  query getAllGender {
    data: getAllGender(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name   
          code
          description  
          active               
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_GENDER = gql`
  query getGender($id: String!) {
    data: getGender(id: $id) {
      id
      name
      code
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
