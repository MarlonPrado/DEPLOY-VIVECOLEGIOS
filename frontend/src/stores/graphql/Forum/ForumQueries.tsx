import { gql } from '@apollo/client';

export const QUERY_GET_ALL_FORUM = gql`
  query getAllForum($schoolId: String!) {
    data: getAllForum(orderCreated: true, allData: true, schoolId: $schoolId) {
      edges {
        cursor
        node {
          id
          name
          details
          description
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_FORUM = gql`
  query getForum($id: String!) {
    data: getForum(id: $id) {
      id
      name
      details
      description
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

export const QUERY_GET_INTERACTION_FORUM = gql`
  query getAllForumInteraction($forumId: String!) {
    data: getAllForumInteraction(forumId: $forumId) {
      edges {
        cursor
        node {
          id
          comment
          active
          createdByUser {
            name
            lastName
          }
        }
      }
      totalCount
    }
  }
`;
