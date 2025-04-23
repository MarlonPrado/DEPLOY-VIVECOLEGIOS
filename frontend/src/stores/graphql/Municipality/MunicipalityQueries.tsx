import { gql } from '@apollo/client';

export const QUERY_GET_ALL_MUNICIPALITY = gql`
  query getAllMunicipality {
    data: getAllMunicipality(orderCreated: true, allData: true) {
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

export const QUERY_GET_MUNICIPALITY = gql`
  query getMunicipality($id: String!) {
    data: getMunicipality(id: $id) {
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
