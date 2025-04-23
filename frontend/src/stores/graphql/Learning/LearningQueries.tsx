import { gql } from '@apollo/client';

export const QUERY_GET_ALL_LEARNING = gql`
  query getAllLearning($schoolId: String!, $academicAsignatureId: String!, $academicGradeId: String!, $academicPeriodsId: [String!]) {
    data: getAllLearning(orderCreated: true, allData: true,schoolId: $schoolId, academicAsignatureId: $academicAsignatureId, academicGradeId: $academicGradeId, academicPeriodsId: $academicPeriodsId) {
      edges {
        cursor
        node {
          id
          statement
          active
          academicAsignatureId
          academicStandard {
            id
            standard
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_LEARNING = gql`
  query getLearning($id: String!) {
    data: getLearning(id: $id) {
      id
      version
      statement
      evidenceLearnings {
        statement
        id
      }
      academicAsignatureId
      academicAsignature {
        id
        name
      }
      academicPeriodsId
      academicPeriods {
        id
        name
      }
      academicGradeId
      academicGrade {
        id
        name
      }
      academicStandardId
      academicStandard {
        id
        standard
      }
      generalBasicLearningRightId
      generalBasicLearningRight {
        id
        dba
      }
      schoolId
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

export const QUERY_GET_ACADEMIC_PERIODS_LEARNING = gql`
  query getAcademicPeriodSchoolYear(
    $schoolId: String!  
    $schoolYearId: String!) {
    data: getAcademicPeriodSchoolYear(schoolId: $schoolId,schoolYearId: $schoolYearId ) {
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

export const QUERY_GET_DROPDOWNS_LEARNING = gql`
  query getDropdownsLearning($schoolId: String!, $academicAsignatureId: String, $academicGradeId: String, $schoolYearId: String) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAcademicPeriods: getAllAcademicPeriod(allData: false, orderCreated: false, schoolId: $schoolId, orderCustom: true, schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataStandards: getAllAcademicStandard(
      allData: false
      orderCreated: false
      schoolId: $schoolId,
      academicAsignatureId: $academicAsignatureId, 
      academicGradeId: $academicGradeId
    ) {
      edges {
        node {
          id
          standard
        }
      }
    }
  }
`;

export const QUERY_GET_GENERAL_BASIC_LEARNING_RIGHT = gql`
query getAllGeneralBasicLearningRight($generalAcademicAsignatureId: String!, $generalAcademicGradeId: String!) {
  data: getAllGeneralBasicLearningRight(orderCreated: true, allData: true, generalAcademicAsignatureId: $generalAcademicAsignatureId, generalAcademicGradeId: $generalAcademicGradeId) {
    edges {
      cursor
      node {
        id
        dba                
      }
    }
    totalCount
  }
}
`;