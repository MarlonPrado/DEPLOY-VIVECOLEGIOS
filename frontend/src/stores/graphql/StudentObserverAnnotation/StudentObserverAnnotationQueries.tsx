import { gql } from '@apollo/client';

export const QUERY_GET_ALL_STUDENT_OBSERVER_ANNOTATION = gql`
  query getAllStudentObserverAnnotation($courseId: String!, $studentId: String!) {
    data: getAllStudentObserverAnnotation(orderCreated: true, allData: true, courseId: $courseId, studentId: $studentId) {
      edges {
        cursor
        node {
          id
          observerAnnotationTypeId
          observerAnnotationType{
            name
          }
          academicPeriodId
          academicPeriod{
            name
          }
          observation
          commitment
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_STUDENT_OBSERVER_ANNOTATION = gql`
  query getStudentObserverAnnotation($id: String!) {
    data: getStudentObserverAnnotation(id: $id) {
      id
      observerAnnotationTypeId
      observerAnnotationType{
        name
      }
      academicPeriodId
      academicPeriod{
        name
      }
      observation
      commitment
      active         
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

export const QUERY_GET_DROPDOWNS_STUDENT_OBSERVER_ANNOTATION = gql`
  query getDropdownsStudentObserverAnnotation($schoolId: String!, $schoolYearId: String!) {
    dataObserverAnnotationType: getAllObserverAnnotationType(schoolId: $schoolId, allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
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
