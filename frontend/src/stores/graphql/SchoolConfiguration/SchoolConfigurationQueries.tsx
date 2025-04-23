import { gql } from '@apollo/client';

export const QUERY_GET_ALL_SCHOOL_CONFIGURATION = gql`
  query getAllSchoolConfiguration($schoolId: String!) {
    data: getAllSchoolConfiguration(orderCreated: true, allData: true, schoolId: $schoolId) {
      edges {
        cursor
        node {
          id
          code
          valueNumber
          valueString
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_SCHOOL_CONFIGURATION = gql`
  query getSchoolConfiguration($id: String!) {
    data: getSchoolConfiguration(id: $id) {
      id   
      code
      valueNumber
      valueString
      schoolId
      school {
        id
        name
      }   
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