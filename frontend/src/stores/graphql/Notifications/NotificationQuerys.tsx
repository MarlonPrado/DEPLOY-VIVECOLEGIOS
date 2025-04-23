import { gql } from '@apollo/client';

export const QUERY_GET_ALL_NOTIFICATION = gql`
query getAllNotification($userId: String!) {
  data: getAllNotification(orderCreated: true, allData: true, userId: $userId) {
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

export const QUERY_GET_SOME_NOTIFICATION = gql`
query getAllNotification($userId: String!) {
  data: getAllNotification(orderCreated: true, allData: true, first: 5, userId: $userId) {
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

export const QUERY_GET_DROPDOWNS_NOTIFICATION = gql`
  query getDropdownsNotification {
    dataUsers: getAllUser(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
          lastName
        }
      }
    }
  }
`;

