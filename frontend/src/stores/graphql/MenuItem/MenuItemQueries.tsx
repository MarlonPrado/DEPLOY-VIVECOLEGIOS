import { gql } from '@apollo/client';

export const QUERY_GET_ALL_MENU_ITEM = gql`
  query getAllMenuItem($menuId: String!) {
    data: getAllMenuItem(orderCreated: true, allData: true, menuId: $menuId) {
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

export const QUERY_GET_MENU_ITEM = gql`
  query getMenuItem($id: String!) {
    data: getMenuItem(id: $id) {
      id
      name
      version
      icon
      order
      isHidden
      createAction
      deleteAction
      updateAction
      readAction
      fullAccess
      activateAction
      inactiveAction
      rolesId
      roles {
        id
        name
      }
      moduleId
      module {
        id
        name
      }
      menuId
      menu {
        id
        name
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


export const QUERY_GET_DROPDOWNS_SUBMENUS = gql`
  query getDropdownsSubmenus {
    dataRoles: getAllRole(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataMenus: getAllMenu(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
    dataModules: getAllModule(allData: false, orderCreated: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;