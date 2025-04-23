import { gql } from '@apollo/client';

export const QUERY_GET_ALL_COMPONENT_EVALUATIVE = gql`
  query getAllEvaluativeComponent($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllEvaluativeComponent(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name
          weight
          active
          type
          academicAreasId
          academicAsignaturesId
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_COMPONENT_EVALUATIVE_ACADEMIC_ASIGNATURE_COURSE = gql`
  query getAllEvaluativeComponentAcademicAsignatureCourse($academicAsignatureCourseId: String!) {
    data: getAllEvaluativeComponentAcademicAsignatureCourse(
      academicAsignatureCourseId : $academicAsignatureCourseId 
    ) {
      edges {
        cursor
        node {
          id
          name
          weight
          type
        }
      }
    } 
  }
`;

export const QUERY_GET_COMPONENT_EVALUATIVE = gql`
  query getEvaluativeComponent($id: String!) {
    data: getEvaluativeComponent(id: $id) {
      id
      name
      weight
      type
      academicAreasId
      academicAreas {
        id
        name
      }
      academicAsignaturesId
      academicAsignatures {
        id
        name
      }
      version
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

export const QUERY_GET_DROPDOWNS_COMPONENT_EVALUATIVE = gql`
  query getDropdownsComponentEvaluative($schoolId: String!,$schoolYearId: String ) {
    dataAsignatures: getAllAcademicAsignature(
      allData: false,
      orderCreated: false,
      schoolId: $schoolId,
      schoolYearId: $schoolYearId
    ) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAreas: getAllAcademicArea(allData: false, orderCreated: false, schoolId: $schoolId,  schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const QUERY_GET_EVALUATIVE_COMPONENT_TYPE = gql`
  query getAllEvaluativeComponentType {
    __type(name: "EvaluativeComponentType") {
      name
      enumValues {
        name
      }
    }
  }
`;
