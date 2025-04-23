import { gql } from '@apollo/client';

export const QUERY_GET_ALL_AREA = gql`
  query getAllAcademicArea($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllAcademicArea(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name
          order
          abbreviation
          active
          generalAcademicAreaId
          generalAcademicArea {
            id 
            name
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_AREA = gql`
  query getAcademicArea($id: String!) {
    data: getAcademicArea(id: $id) {
      id
      name
      abbreviation
      order
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
      generalAcademicAreaId 
      generalAcademicArea {
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

export const QUERY_GET_DROPDOWNS_AREA = gql`
  query getDropdownsAcademicArea {
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
