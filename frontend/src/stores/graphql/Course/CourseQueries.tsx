import { gql } from '@apollo/client';

export const QUERY_GET_ALL_COURSE = gql`
  query getAllCourse($campusId: String!, $academicGradeId: String!, $schoolId: String, $allData: Boolean!) {
    data: getAllCourse(orderCreated: true, allData: $allData, campusId: $campusId, academicGradeId: $academicGradeId, schoolId: $schoolId) {
      edges {
        cursor
        node {
          id
          name
          campus {
            id
            name
          }
          teacher {
            user {
            id
            name
            lastName
            }
          }
          academicDay{
            id
            name
          }
          academicGrade {
            name
          }
          order           
          active          
        }
      }
      totalCount
    }
  }

`;
export const QUERY_GET_ALL_COURSE_TEACHER = gql`
  query getAllCourseTeacher($teacherId: String!, $schoolYearId: String) {
    data: getAllCourseTeacher(teacherId: $teacherId,schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          name
          campus {
            id
            name
          }
          teacher {
            user {
            id
            name
            lastName
            }
          }
          academicGrade {
            id
            name
          }
          academicDay{
            id
            name
          }
          order           
          active          
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_COURSE = gql`
  query getCourse($id: String!) {
    data: getCourse(id: $id) {
      id   
      version 
      name
      order  
      teacherId
      teacher {
        user {
          id
          name
          lastName
        }
      }
      academicDayId
      academicDay {
        id
        name
      }
      studentsId
      students {
        id
        code
        user{
          id
          name
          lastName
          email
          phone
          gender {
            name
          }
          documentNumber
          documentType {
            name
          }
        }        
      }          
      academicGradeId              
      academicGrade {
        id 
        name
      }                  
      campusId
      campus {
        id
        name
      }  
      schoolYearId
      schoolYear {
        id
        schoolYear
      } 
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

export const QUERY_GET_DROPDOWNS_COURSE = gql`
  query getDropdownsCourse($schoolId: String!) {
    dataCampus: getAllCampus(allData: false, orderCreated: false, schoolId: $schoolId) {
      edges {
        node {
          id
          name
        }
      }
    }    
  }
`;
