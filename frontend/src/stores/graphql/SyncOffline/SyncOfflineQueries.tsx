import { gql } from '@apollo/client';

export const QUERY_GET_ALL_SYNC_OFFLINE = gql`
  query getAllSyncOffline($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllSyncOffline(
      orderCreated: true
      allData: $allData
      schoolId: $schoolId
      schoolYearId: $schoolYearId
    ) {
      edges {
        cursor
        node {
          id
          schoolYear {
            schoolYear
          }
          academicPeriod {
            name
          }
          startDate
          endDate
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_SYNC_OFFLINE = gql`
  query getSyncOffline($id: String!) {
    data: getSyncOffline(id: $id) {
      id
      schoolYearId
      schoolYear {
        id
        schoolYear
      }
      startDate
      endDate
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

export const QUERY_GET_DROPDOWNS_SYNC_OFFLINE = gql`
  query getDropdownsSyncOffline($schoolId: String!, $schoolYearId: String!) {
    dataAcademicPeriods: getAcademicPeriodSchoolYear(
      schoolId: $schoolId
      schoolYearId: $schoolYearId
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
