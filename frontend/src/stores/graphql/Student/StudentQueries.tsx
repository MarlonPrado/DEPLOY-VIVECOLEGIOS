import { gql } from '@apollo/client';

export const QUERY_GET_ALL_STUDENT = gql`
  query getAllStudent($campusId: String, $schoolId: String!, $schoolYearId: String!) {
    data: getAllStudent(
      orderCreated: true
      allData: true
      campusId: $campusId
      schoolId: $schoolId
      schoolYearId: $schoolYearId
    ) {
      edges {
        cursor
        node {
          id
          code
          active
          school {
            id
            name
          }
          campus {
            id
            name
          }
          user {
            id
            name
            lastName
            phone
            email
            documentNumber
            gender {
              id
              name
            }
            documentType {
              id
              name
            }
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_STUDENT_WITHOUT_COURSE = gql`
  query getAllStudentAcademicGradeIdWithoutCourse(
    $campusId: String!
    $academicGradeId: String!
    $schoolId: String!
  ) {
    data: getAllStudentAcademicGradeIdWithoutCourse(
      campusId: $campusId
      academicGradeId: $academicGradeId
      schoolId: $schoolId
    ) {
      edges {
        cursor
        node {
          id
          code
          active
          school {
            id
            name
          }
          campus {
            id
            name
          }
          user {
            id
            name
            lastName
            phone
            email
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_STUDENT_OF_GRADE = gql`
  query getAllStudentAcademicGrade(
    $campusId: String!
    $academicGradeId: String!
    $schoolId: String!
    $schoolYearId: String
  ) {
    data: getAllStudentAcademicGrade(
      campusId: $campusId
      academicGradeId: $academicGradeId
      schoolId: $schoolId
      schoolYearId: $schoolYearId
    ) {
      edges {
        cursor
        node {
          id
          code
          active
          school {
            id
            name
          }
          course {
            name
            campus {
              id
              name
            }
          }
          user {
            id
            name
            lastName
            phone
            email
            documentNumber
            gender {
              id
              name
            }
            documentType {
              id
              name
            }
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_STUDENT = gql`
  query getStudent($id: String!) {
    data: getStudent(id: $id) {
      id
      code
      schoolId
      schoolYearId
      campusId
      userId
      academicGradeId
      academicGrade {
        id
        name
      }
      courseId
      course {
        id
        name
      }
      school {
        id
        name
      }
      campus {
        id
        name
      }
      user {
        id
        name
        lastName
        phone
        email
        birthdate
        username
        password
        genderId
        roleId
        documentTypeId
        documentNumber
        role {
          id
          name
        }
        gender {
          id
          name
        }
        documentType {
          id
          name
        }
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

export const QUERY_GET_DROPDOWNS_STUDENT = gql`
  query getDropdownsStudent($type: String!, $schoolId: String!, $schoolYearId: String!) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataRoles: getAllRoleType(type: $type) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGenders: getAllGender(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataDocumentTypes: getAllDocumentType(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataGrades: getAllAcademicGrade(
      allData: false
      orderCreated: false
      schoolId: $schoolId
      schoolYearId: $schoolYearId
    ) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const QUERY_GET_COURSES_OF_GRADES = gql`
  query getCoursesOfGrade($academicGradeId: String!, $campusId: String!, $schoolId: String!) {
    dataCourses: getAllCourse(
      allData: false
      orderCreated: false
      academicGradeId: $academicGradeId
      campusId: $campusId
      schoolId: $schoolId
    ) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const QUERY_GET_GUARDIANS_BY_CRITERIA = gql`
  query getAllSearchGuardian($documentNumber: String!, $documentTypeId: String!) {
    data: getAllSearchGuardian(documentTypeId: $documentTypeId, documentNumber: $documentNumber) {
      edges {
        node {
          user {
            id
            name
            lastName
          }
        }
      }
    }
  }
`;
