import { gql } from '@apollo/client';

export const QUERY_GET_ALL_PERFORMANCE_LEVEL = gql`
  query getAllPerformanceLevel($schoolId: String!, $schoolYearId: String, $allData: Boolean!) {
    data: getAllPerformanceLevel(orderCreated: true, allData: $allData, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name
          type
          topScore
          minimumScore
          active
          category
          categoryGrade
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_PERFORMANCE_LEVEL_ASIGNATURE_COURSE = gql`
  query getAllPerformanceLevelAcademicAsignatureCourse($academicAsignatureCourseId: String!) {
    data: getAllPerformanceLevelAcademicAsignatureCourse(academicAsignatureCourseId: $academicAsignatureCourseId) {
      edges {
        cursor
        node {
          id
          name
          type
          topScore
          minimumScore
          active
          category
          colorHex
          abbreviation
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE = gql`
  query getAllPerformanceLevelAcademicCourse($courseId: String!) {
    data: getAllPerformanceLevelAcademicCourse(courseId: $courseId) {
      edges {
        cursor
        node {
          id
          name
          type
          topScore
          minimumScore
          active
          category
        }
      }
      totalCount
    }
  }
`;


export const QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE_FINAL = gql`
  query getAllPerformanceLevelAcademicCourseFinal($courseId: String!) {
    data: getAllPerformanceLevelAcademicCourseFinal(courseId: $courseId) {
      edges {
        cursor
        node {
          id
          name
          type
          topScore
          minimumScore
          active
          category
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_PERFORMANCE_LEVEL = gql`
  query getPerformanceLevel($id: String!) {
    data: getPerformanceLevel(id: $id) {
      id
      name
      colorHex
      abbreviation
      topScore
      type
      campusId
      isFinal
      isRecovery
      campus {
        id
        name
      }
      minimumScore
      generalPerformanceLevelId
      generalPerformanceLevel {
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
      academicGradesId
      academicGrades {
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

export const QUERY_GET_DROPDOWNS_PERFORMANCE_LEVEL = gql`
  query getDropdownsPerformanceLevel ($schoolId: String!, $schoolYearId: String!) {
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGeneralPerformanceLevels: getAllGeneralPerformanceLevel(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAcademicGrade: getAllAcademicGrade(orderCreated: false, allData: false, schoolId: $schoolId, schoolYearId: $schoolYearId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const QUERY_GET_PERFORMANCE_LEVEL_TYPE = gql`
    query getAllPerformanceLevelType {
      __type(name: "PerformanceLevelType") {
        name
        enumValues {
          name
        }
      }
    }
`;
