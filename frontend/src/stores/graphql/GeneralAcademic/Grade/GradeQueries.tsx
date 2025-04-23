import { gql } from '@apollo/client';

export const QUERY_GET_ALL_GRADE = gql`
  query getAllGeneralAcademicGrade {
    data: getAllGeneralAcademicGrade(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id          
          active
          name
          generalAcademicCycle  {
            name
          }     
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_GRADE = gql`
  query getGeneralAcademicGrade($id: String!) {
    data: getGeneralAcademicGrade(id: $id) {
      id
      name
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


export const QUERY_GET_DROPDOWNS_GRADE = gql`
  query getDropdownsGeneralCycles {
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