import { gql } from '@apollo/client';

export const QUERY_GET_ALL_MENU = gql`
  query getAllMenu {
    data: getAllMenu(orderCreated: true, allData: true) {
      edges {
        cursor
        node {
          id
          active
          name
          icon
        }
      }
      totalCount
    }
  }
`;

export const QUERY_GET_MENU = gql`
  query getMenu($id: String!) {
    data: getMenu(id: $id) {
      id
      name
      version
      icon
      order
      createAction
      deleteAction
      updateAction
      readAction
      fullAccess
      activateAction
      inactiveAction
      roles {
        id
        name
      }
      module {
        id
        name
      }
      menuItems {
        id
        name
        icon
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

export const QUERY_GET_DROPDOWNS_MENUS = gql`
  query getDropdownsSubmenus {
    dataRoles: getAllRole(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
