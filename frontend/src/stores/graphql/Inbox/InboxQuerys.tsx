import { gql } from '@apollo/client';

export const QUERY_GET_ALL_INBOX = gql`
query getAllInbox($userId: String!) {
  data: getAllInbox(orderCreated: true, allData: true, userId: $userId) {
    edges {
      cursor
      node {
        id
        active         
        createdByUser {
          name
        }       
        title
        message
        dateSend
        dateRead           
      }
    }
    totalCount
  }
}
`;

export const QUERY_GET_SOME_INBOX = gql`
query getAllInbox($userId: String!) {
  data: getAllInbox(orderCreated: true, allData: true, first: 5, userId: $userId) {
    edges {
      cursor
      node {
        id
        active         
        user {
          id
          name
          lastName
        }         
        title
        message
        dateSend
        dateRead           
      }
    }
    totalCount
  }
}
`;

export const QUERY_GET_DROPDOWNS_INBOX = gql`
  query getDropdownsInbox {
    dataUsers: getAllUser(allData: true, orderCreated: true) {
      edges {
        node {
          id
          name
          lastName
          active
          phone
          role {
            id
          } 
        }
      }
    }
  }
`;

export const QUERY_GET_DROPDOWNS_INBOX2 = gql`
  query getDropdownsInbox {
    dataUsers: getAllUser(allData: true, orderCreated: true) {
      edges {
        node {
          id
          name
          lastName
          active
          role {
            id
          } 
        }
      }
    }
  }
`;