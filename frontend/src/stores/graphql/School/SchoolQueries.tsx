import { gql } from '@apollo/client';

export const QUERY_GET_ALL_SCHOOL = gql`
  query getAllSchool {
    data: getAllSchool(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          daneCode
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_SCHOOL = gql`
  query getSchool($id: String!) {
    data: getSchool(id: $id) {
      id
      name
      daneCode
      pedagogicalModel
      educationalModel
      curricularComponent
      textResolution
      textAddress
      textDaneNit
      textPrincipalSignature
      logo
      imgPrincipalSignature
      textSecretarySignature
      imgSecretarySignature
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
