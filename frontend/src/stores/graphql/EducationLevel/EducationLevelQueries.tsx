import { gql } from '@apollo/client';

export const QUERY_GET_ALL_EDUCATION_LEVEL = gql`
  query getAllEducationLevel($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllEducationLevel(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
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

export const QUERY_GET_EDUCATION_LEVEL = gql`
  query getEducationLevel($id: String!) {
    data: getEducationLevel(id: $id) {
      id
      name
      description
      schoolId
      school {
        id
        name
      }
      schoolYearId
      schoolYear {
        id
        schoolYear
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

export const QUERY_GET_DROPDOWNS_EDUCATION_LEVEL = gql`
  query getDropdownsEducationLevel {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;