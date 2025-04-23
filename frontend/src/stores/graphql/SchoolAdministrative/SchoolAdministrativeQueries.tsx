import { gql } from '@apollo/client';

export const QUERY_GET_ALL_SCHOOL_ADMINISTRATIVE = gql`
  query getAllSchoolAdministrative($campusId: String!,$schoolId: String!) {
    data: getAllSchoolAdministrative(orderCreated: true, allData: true, campusId: [$campusId], schoolId: [$schoolId]) {
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

export const QUERY_GET_ALL_SCHOOL_ADMINISTRATIVE_ONLY_SCHOOL = gql`
  query getAllSchoolAdministrative($schoolId: String!) {
    data: getAllSchoolAdministrative(orderCreated: true, allData: true, schoolId: [$schoolId]) {
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

export const QUERY_GET_ALL_SCHOOL_ADMINISTRATIVE_ACTIVE = gql`
  query getAllSchoolAdministrative($schoolId: String!) {
    data: getAllSchoolAdministrative(orderCreated: true, allData: false, schoolId: $schoolId) {
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

export const QUERY_GET_SCHOOL_ADMINISTRATIVE = gql`
  query getSchoolAdministrative($id: String!) {
    data: getSchoolAdministrative(id: $id) {
      id
      schoolId     
      school  {
        id
        name
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

export const QUERY_GET_DROPDOWNS_SCHOOL_ADMINISTRATIVE = gql`
  query getDropdownsSchoolAdministrative ($type : String!, $schoolId: String!) {
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
