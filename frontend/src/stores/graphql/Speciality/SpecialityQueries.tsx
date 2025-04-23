import { gql } from '@apollo/client';

export const QUERY_GET_ALL_SPECIALITY = gql`
  query getAllSpecialty($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllSpecialty(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name  
          code    
          modality {
            name
          }   
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_SPECIALITY = gql`
  query getSpecialty($id: String!) {
    data: getSpecialty(id: $id) {
      id
      name     
      code    
      version
      modalityId
      modality {
        id
        name
      }
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

export const QUERY_GET_DROPDOWNS_SPECIALITY = gql`
  query getDropdownsSpeciality($schoolId: String!, $schoolYearId: String,) {
    dataModalities: getAllModality(allData: false, orderCreated: false, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;