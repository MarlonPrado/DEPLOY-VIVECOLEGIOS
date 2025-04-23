import { gql } from '@apollo/client';

export const QUERY_GET_ALL_VIDEO_TUTORIAL = gql`
  query getAllVideoTutorial {
    data: getAllVideoTutorial(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          name
          description
          image
          miniumResolutionFileUrl
          mediumResolutionFileUrl
          maxResolutionFileUrl
          roles{
            name
          }
          active
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ALL_VIDEO_TUTORIAL_BY_ROL = gql`
  query getAllVideoTutorialByRol ($roleId : String!){
    data: getAllVideoTutorialByRol(roleId: $roleId) {
      edges {
        cursor
        node {
          id
          name
          description
          image
          miniumResolutionFileUrl
          mediumResolutionFileUrl
          maxResolutionFileUrl
          roles{
            name
          }
          active
        }
      }
      totalCount
    }
  }
`;


export const QUERY_GET_VIDEO_TUTORIAL = gql`
  query getVideoTutorial($id: String!) {
    data: getVideoTutorial(id: $id) {
      id
      name
      description
      image
      miniumResolutionFileUrl
      mediumResolutionFileUrl
      maxResolutionFileUrl
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
