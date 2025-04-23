import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ADMINISTRATOR = gql`
  query getAllSchoolAdministrator($schoolId: String!) {
    data: getAllSchoolAdministrator(orderCreated: true, allData: true, schoolId: $schoolId) {
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

export const QUERY_GET_ADMINISTRATOR = gql`
  query getSchoolAdministrator($id: String!) {
    data: getSchoolAdministrator(id: $id) {
      id
      schoolId     
      userId
      school  {
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

export const QUERY_GET_DROPDOWNS_ADMINISTRATOR = gql`
  query getDropdownsAdministrator ($type : String!) {
    dataSchools: getAllSchool(allData: false, orderCreated: false) {
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

