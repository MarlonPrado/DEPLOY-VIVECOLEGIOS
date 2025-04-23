import { gql } from '@apollo/client';

export const QUERY_GET_ALL_MODALITY = gql`
  query getAllModality($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllModality(orderCreated: true, allData: $allData, schoolId: $schoolId,schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name  
          code       
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_MODALITY = gql`
  query getModality($id: String!) {
    data: getModality(id: $id) {
      id
      name  
      code   
      version
      school {
        id
        name
      }
      schoolYearId
      schoolYear {
        id
        schoolYear
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

export const QUERY_GET_DROPDOWNS_MODALITY = gql`
  query getDropdownsModality {
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
