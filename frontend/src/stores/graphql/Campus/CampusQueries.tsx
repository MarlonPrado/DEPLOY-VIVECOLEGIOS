import { gql } from '@apollo/client';

export const QUERY_GET_ALL_CAMPUS = gql`
  query getAllCampus($schoolId: String!) {
    data: getAllCampus(orderCreated: true, allData: true, schoolId: $schoolId) {
      edges {
        cursor
        node {
          id
          name
          consecutive
          daneCodeCampus
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_CAMPUS = gql`
  query getCampus($id: String!) {
    data: getCampus(id: $id) {
      id
      name
      version
      consecutive
      daneCodeCampus
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

export const QUERY_GET_DROPDOWNS_CAMPUS = gql`
  query getDropdownsAcademicArea {
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
