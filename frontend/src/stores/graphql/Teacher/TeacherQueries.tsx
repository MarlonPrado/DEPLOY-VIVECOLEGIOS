import { gql } from '@apollo/client';

export const QUERY_GET_ALL_TEACHER = gql`
  query getAllTeacher($campusId: String!,$schoolId: String!, $schoolYearId: String!) {
    data: getAllTeacher(orderCreated: true, allData: true, campusId: [$campusId], schoolId: [$schoolId], schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          school  {
            id
            name
          }                       
          user {
            id
            name
            lastName
            email
            phone
            documentNumber
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_TEACHER_ONLY_SCHOOL = gql`
  query getAllTeacher($schoolId: String!, $schoolYearId: String!) {
    data: getAllTeacher(orderCreated: true, allData: true, schoolId: [$schoolId], schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          school  {
            id
            name
          }                       
          user {
            id
            name
            lastName
            email
            phone
            documentNumber
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_TEACHER_ACTIVE = gql`
  query getAllTeacher($campusId: String!,$schoolId: String!, $schoolYearId: String! ) {
    data: getAllTeacher(orderCreated: true, allData: false, campusId: [$campusId], schoolId: [$schoolId],schoolYearId: $schoolYearId) {
      edges {
        cursor
        node {
          id
          active         
          school  {
            id
            name
          }                       
          user {
            id
            name
            lastName
            email
            phone
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_TEACHER = gql`
  query getTeacher($id: String!) {
    data: getTeacher(id: $id) {
      id
      schoolId     
      school  {
        id
        name
      }   
      schoolYearId     
      schoolYear  {
        id
        schoolYear
      }                  
      campusId     
      campus  {
        id
        name
      }                  
      userId
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
      active
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

export const QUERY_GET_DROPDOWNS_TEACHER = gql`
  query getDropdownsTeacher ($type : String!, $schoolId: String!) {
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
  }
`;
