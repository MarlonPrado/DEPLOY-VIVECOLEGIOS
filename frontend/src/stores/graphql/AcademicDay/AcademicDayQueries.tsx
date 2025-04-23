import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ACADEMIC_DAY = gql`
  query getAllAcademicDay($campusId: String!, $schoolId: String, $schoolYearId: String, $allData: Boolean!) {
    data: getAllAcademicDay(orderCreated: true, allData: $allData, campusId: $campusId, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          day
          name  
          campus {
            id
            name
          }     
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_ACADEMIC_DAY_CAMPUS = gql`
  query getAllAcademicDayCampus($campusId: String!, $schoolId: String, $schoolYearId: String, $allData: Boolean!) {
    data: getAllAcademicDayCampus(orderCreated: true, allData: $allData, campusId: $campusId, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          day
          name  
          campus {
            id
            name
          }     
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_ACADEMIC_DAY_ACTIVES = gql`
  query getAllAcademicDay($campusId: String!, $schoolId: String, $schoolYearId: String) {
    data: getAllAcademicDay(orderCreated: true, allData: false, campusId: $campusId, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          day
          name  
          campus {
            id
            name
          }     
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ACADEMIC_DAY = gql`
  query getAcademicDay($id: String!) {
    data: getAcademicDay(id: $id) {
      id
      day
      name                       
      campusId     
      campus  {
        id
        name
      }         
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

export const QUERY_GET_DROPDOWNS_ACADEMIC_DAY = gql`
  query getDropdownsAcademicDay($schoolId: String!) {
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const QUERY_GET_DAYS = gql`
    query getAllDay {
      __type(name: "Day") {
        name
        enumValues {
          name
        }
      }
    }
`;
