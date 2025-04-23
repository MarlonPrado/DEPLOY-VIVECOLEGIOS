import { gql } from '@apollo/client';

export const QUERY_GET_ALL_MODULE = gql`
  query getAllModule {
    data: getAllModule(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          active
          url
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_MODULE = gql`
  query getModule($id: String!) {
    data: getModule(id: $id) {
      id
      name
      version
      url
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
