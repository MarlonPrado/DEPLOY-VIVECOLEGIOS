import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ASIGNATURE = gql`
  query getAllGeneralAcademicAsignature {
    data: getAllGeneralAcademicAsignature(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          hasStandard
          hasDba
          active      
          generalAcademicArea {
            name
          }    
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ASIGNATURE = gql`
  query getGeneralAcademicAsignature($id: String!) {
    data: getGeneralAcademicAsignature(id: $id) {
      id
      name
      hasStandard
      hasDba
      version
      generalAcademicAreaId
      generalAcademicArea {
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

export const QUERY_GET_DROPDOWNS_ASIGNATURE = gql`
  query getDropdownsGeneralAsignature {
    dataGeneralAreas: getAllGeneralAcademicArea(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
