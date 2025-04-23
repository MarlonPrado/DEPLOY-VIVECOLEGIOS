import { gql } from '@apollo/client';

export const QUERY_GET_ALL_STANDARD = gql`
  query getAllGeneralAcademicStandard($generalAcademicCycleId: String, $generalAcademicAsignatureId: String) {
    data: getAllGeneralAcademicStandard(orderCreated: true, allData: true, generalAcademicCycleId: $generalAcademicCycleId, generalAcademicAsignatureId: $generalAcademicAsignatureId) {
      edges {
        cursor
        node {
          id          
          active
          standard
          type
          subtype          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_STANDARD = gql`
  query getGeneralAcademicStandard($id: String!) {
    data: getGeneralAcademicStandard(id: $id) {
      id
      standard
      type
      subtype
      generalAcademicAsignatureId 
      generalAcademicAsignature {
        id
        name
      }
      generalAcademicCycleId 
      generalAcademicCycle {
        id 
        name
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

export const QUERY_GET_DROPDOWNS_STANDARD = gql`
  query getDropdownsAcademicArea {
    dataAsignatures: getAllGeneralAcademicAsignature(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataCycles: getAllGeneralAcademicCycle(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;