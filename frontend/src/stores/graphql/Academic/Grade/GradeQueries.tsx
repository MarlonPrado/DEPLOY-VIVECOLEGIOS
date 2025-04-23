import { gql } from '@apollo/client';

export const QUERY_GET_ALL_GRADE = gql`
  query getAllAcademicGrade($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllAcademicGrade(orderCreated: true, allData: $allData, schoolId: $schoolId,  schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active
          name
          specialty {
            name
          }
          educationLevel {
            name
          }
          generalAcademicCycle {
            name
          }
          school {
            name
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_GRADE = gql`
  query getAcademicGrade($id: String!) {
    data: getAcademicGrade(id: $id) {
      id
      name
      specialtyId
      specialty {
        id
        name
      }
      educationLevelId
      educationLevel {
        id
        name
      }
      generalAcademicCycleId
      generalAcademicCycle {
        id
        name
      }
      generalAcademicGradeId
      generalAcademicGrade {
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

export const QUERY_GET_DROPDOWNS_GRADE = gql`
  query getDropdownsAcademicArea($schoolId: String!, $schoolYearId: String!) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
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
    dataSpecialities: getAllSpecialty(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataEducationLevels: getAllEducationLevel(allData: false, orderCreated: false, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGeneralGrades: getAllGeneralAcademicGrade(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
