import { gql } from '@apollo/client';

export const QUERY_GET_ALL_CYCLE = gql`
  query getAllGeneralAcademicCycle {
    data: getAllGeneralAcademicCycle(orderCreated: true, allData: true) {
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

export const QUERY_GET_CYCLE = gql`
  query getGeneralAcademicCycle($id: String!) {
    data: getGeneralAcademicCycle(id: $id) {
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
