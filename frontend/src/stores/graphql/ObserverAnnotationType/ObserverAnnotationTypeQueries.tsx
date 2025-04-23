import { gql } from '@apollo/client';

export const QUERY_GET_ALL_OBSERVER_ANNOTACION_TYPE = gql`
  query getAllObserverAnnotationType($schoolId: String!) {
    data: getAllObserverAnnotationType(orderCreated: true, allData: true, schoolId: $schoolId) {
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

export const QUERY_GET_OBSERVER_ANNOTACION_TYPE = gql`
  query getObserverAnnotationType($id: String!) {
    data: getObserverAnnotationType(id: $id) {
      id
      name  
      code   
      version
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

export const QUERY_GET_DROPDOWNS_OBSERVER_ANNOTACION_TYPE = gql`
  query getDropdownsObserverAnnotationType {
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
