import { gql } from '@apollo/client';

export const QUERY_GET_ALL_STANDARD = gql`
  query getAllAcademicStandard($schoolId: String!, $academicAsignatureId: String!, $academicGradeId: String!) {
    data: getAllAcademicStandard(orderCreated: true, allData: true, schoolId: $schoolId,academicAsignatureId: $academicAsignatureId, academicGradeId: $academicGradeId) {
      edges {
        cursor
        node {
          id          
          active
          standard                
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_STANDARD = gql`
  query getAcademicStandard($id: String!) {
    data: getAcademicStandard(id: $id) {
      id
      standard
      schoolId
      school {
        id
        name
      }
      generalAcademicStandardId
      generalAcademicStandard {
        id
        standard
      }
      academicAsignatureId 
      academicAsignature {
        id
        name
      }
      academicGradeId 
      academicGrade {
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
  query getDropdownsAcademicStandard($schoolId: String!) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAsignatures: getAllAcademicAsignature(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
          generalAcademicAsignatureId
        }
      }
    }
    dataGrades: getAllAcademicGrade(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
          generalAcademicCycleId
        }
      }
    }
  }
`;
