import { gql } from '@apollo/client';

export const MUTATION_LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    data: login(username: $username, password: $password) {
      jwt
      name
      lastName
      profilePhoto
      student {
        id
        courseId
      }
      students {
        id
        courseId
        userId
        user {
          name
          lastName
        }
      }
      teacher {
        id
      }
      userId
      schools {
        id
        name
        daneCode
        schoolYear {
          id
          schoolYear
        }
      }
      campus {
        id
        name
        schoolId
      }
      role {
        id
        name
      }
      roleMenus {
        id
        name
        icon
        menuItemsLogin {
          id
          name
          icon
          isHidden
          createAction
          deleteAction
          updateAction
          readAction
          fullAccess
          activateAction
          inactiveAction
          module {
            url
          }
        }
      }
      lastLogin {
        ip
        geo
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query ($schoolYearId: String!) {
    me(schoolYearId: $schoolYearId) {
      name
      lastName
      profilePhoto
      student {
        id
      }
      teacher {
        id
      }
      userId
      schools {
        id
        name
      }
      campus {
        id
        name
      }
      role {
        id
        name
      }
      roleMenus {
        id
        name
        icon
        menuItemsLogin {
          id
          name
          icon
          isHidden
          createAction
          deleteAction
          updateAction
          readAction
          fullAccess
          activateAction
          inactiveAction
          module {
            url
          }
        }
      }
    }
  }
`;

export const QUERY_GET_LOGIN_COUNT_USER = gql`
  query getAllUser {
    data: getAllUser(orderCreated: true, allData: true) {
      totalCount
    }
  }
`;

export const MUTATION_LOGIN_SYNC_OFFLINE = gql`
  mutation loginSyncOffline($username: String!, $password: String!) {
    data: loginSyncOffline(username: $username, password: $password)
  }
`;
