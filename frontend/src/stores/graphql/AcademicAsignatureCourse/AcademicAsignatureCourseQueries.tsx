import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE = gql`
  query getAllAcademicAsignatureCourse( $courseId: String, $allData: Boolean!) {
    data: getAllAcademicAsignatureCourse(orderCreated: true, allData: $allData, courseId: $courseId) {
      edges {
        cursor
        node {
          id
          hourlyIntensity
          academicAsignatureId
          academicAsignature {
            name
            generalAcademicAsignatureId
            generalAcademicAsignature {
              name
              hasStandard
              hasDba
            }
            academicAreaId
            academicArea{
              id
              name
              order
              abbreviation
            }
            order
            abbreviation
          }
          course {
            id
            name           
            academicGradeId
            academicGrade {
              name
              generalAcademicCycle {
                name
              }
              generalAcademicGradeId
              generalAcademicGrade {
                name
                generalAcademicCycle {
                  name
                }
              }
            }
          }
          teacherId
          teacher {
            id
            user {
              id
              name
              lastName
            }
          }
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE_TEACHER = gql`
  query getAllAcademicAsignatureCourseTeacher($teacherId: String!, $schoolYearId: String) {
    data: getAllAcademicAsignatureCourseTeacher(teacherId: $teacherId,schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          hourlyIntensity
          academicAsignatureId
          academicAsignature {
            name
            generalAcademicAsignatureId
            generalAcademicAsignature {
              name
              hasStandard
              hasDba
            }
          }
          course {
            id
            name           
            academicGradeId
            academicGrade {
              name
              generalAcademicCycle {
                name
              }
              generalAcademicGradeId
              generalAcademicGrade {
                name
                generalAcademicCycle {
                  name
                }
              }
            }
          }
          teacherId
          teacher {
            id
            user {
              id
              name
              lastName
            }
          }
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ACADEMIC_ASIGNATURE_COURSE = gql`
  query getAcademicAsignatureCourse($id: String!) {
    data: getAcademicAsignatureCourse(id: $id) {
      id
      hourlyIntensity
      version
      gradeAssignmentId
      gradeAssignment {
        minHourlyIntensity
        maxHourlyIntensity
      }
      academicAsignatureId
      academicAsignature {
        name
        generalAcademicAsignatureId
        generalAcademicAsignature {
          name
        }
      }
      course {
        id
        name
        academicDay {
          name
        }
        academicGradeId
        academicGrade {
          name
          generalAcademicCycle {
            name
          }
          generalAcademicGradeId
          generalAcademicGrade {
            name
            generalAcademicCycle {
              name
            }
          }
        }
      }
      campusId
      campus {
        id
        name
      }
      teacherId
      teacher {
        id
        user {
          id
          name
          lastName
        }
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

export const QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE = gql`
  query getDropdownsAcademicArea($schoolId: String!, $campusId: String!, $courseId: String!, $schoolYearId: String) {
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataAsignatures: getAllGradeAssignmentNotAssignedInCourse(
      courseId: $courseId
    ) {
      edges {
        node {
          id
          academicGradeId
          academicGrade {
            name
            id
          }
          academicAsignatureId
          academicAsignature {
            name
            id
          }
          maxHourlyIntensity
          minHourlyIntensity
        }
      }
    }
    dataGrades: getAllAcademicGrade(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataTeachers: getAllTeacher(
      allData: false
      orderCreated: false
      campusId: [$campusId]
      schoolId: [$schoolId]
      schoolYearId: $schoolYearId
    ) {
      edges {
        node {
          id
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

export const QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE_TEACHER_LIST = gql`
  query getDropdownsAcademicAreaTeacherList($schoolId: String!, $campusId: String!, $schoolYearId: String) {
    dataTeachers: getAllTeacher(
      allData: false
      orderCreated: false
      campusId: [$campusId]
      schoolId: [$schoolId]
      schoolYearId: $schoolYearId
    ) {
      edges {
        node {
          id
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

export const QUERY_GET_COURSES_OF_GRADES = gql`
  query getCoursesOfGrade($academicGradeId: String!, $campusId: String!) {
    dataCourses: getAllCourse(
      allData: false
      orderCreated: false
      academicGradeId: $academicGradeId
      campusId: $campusId
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