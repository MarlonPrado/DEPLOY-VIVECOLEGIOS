import { gql } from '@apollo/client';

export const QUERY_GET_ALL_PERFORMANCE_LEVEL = gql`
  query getAllGeneralPerformanceLevel {
    data: getAllGeneralPerformanceLevel(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_PERFORMANCE_LEVEL = gql`
  query getGeneralPerformanceLevel($id: String!) {
    data: getGeneralPerformanceLevel(id: $id) {
      id
      name
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
