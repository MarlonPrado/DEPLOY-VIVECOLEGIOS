import { gql } from '@apollo/client';

export const QUERY_GET_ALL_USER = gql`
  query getAllUser {
    data: getAllUser(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          active        
          lastName                  
          phone
          email
          role {
            name
          }
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_USER = gql`
  query getUser($id: String!) {
    data: getUser(id: $id) {
      id
      name
      lastName                  
      phone
      email
      birthdate
      genderId
      roleId
      documentTypeId
      documentNumber
      profilePhoto
      signaturePhoto
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

export const QUERY_GET_DROPDOWNS_USER = gql`
  query getDropdownsUser {
    dataRoles: getAllRole(allData: false, orderCreated: false) {
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


export const QUERY_GET_USER_BY_DOCUMENT_NUMBER = gql`
  query getUserByDocumentNumber($documentNumber: String!) {
    data: getUserByDocumentNumber(documentNumber: $documentNumber) {
      id
      name
      lastName                  
      phone
      email
      birthdate
      genderId
      username
      roleId
      documentTypeId
      documentNumber
      profilePhoto
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