import { gql } from '@apollo/client';

export const QUERY_GET_ALL_AREA = gql`
  query getAllGeneralAcademicArea {
    data: getAllGeneralAcademicArea(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          hasStandard
          hasDba
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_AREA = gql`
  query getGeneralAcademicArea($id: String!) {
    data: getGeneralAcademicArea(id: $id) {
      id
      name
      hasStandard
      hasDba
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
