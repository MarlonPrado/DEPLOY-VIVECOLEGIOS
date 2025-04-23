import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ACADEMIC_PERIOD = gql`
  query getAllAcademicPeriod($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllAcademicPeriod(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name
          schoolYear {
            schoolYear
          }
          startDate
          endDate
          weight
          order
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ACADEMIC_PERIODS_ORDER = gql`
  query getAcademicPeriodsOrder(
    $schoolId: String!
  ) {    
    dataAcademicPeriods: getAllAcademicPeriod(
      allData: false
      orderCreated: false
      schoolId: $schoolId
      orderCustom: true
    ) {
      edges {
        node {
          id
          name
          startDate
          endDate
        }
      }
    }
  }
`;


export const QUERY_GET_ACADEMIC_PERIOD = gql`
  query getAcademicPeriod($id: String!) {
    data: getAcademicPeriod(id: $id) {
      id
      name
      schoolYearId
      schoolYear {
        id
        schoolYear
      }
      startDate
      endDate
      startDateRecovery
      endDateRecovery
      weight
      order
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

export const QUERY_GET_CURRENT_ACADEMIC_PERIOD = gql`
  query getCurrentAcademicPeriod($schoolId: String!) {
    data: getCurrentAcademicPeriod(schoolId: $schoolId) {
      id
      name
      schoolYearId
      schoolYear {
        schoolYear
      }
      startDate
      endDate
      weight
    }
  }
`;

export const QUERY_GET_DROPDOWNS_ACADEMIC_PERIOD = gql`
  query getDropdownsAcademicArea($schoolId: String!) {
    dataSchoolYears: getAllSchoolYear(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          schoolYear
        }
      }
    }
  }
`;
