import { gql } from '@apollo/client';

export const MUTATION_CREATE_MENU_ITEM = gql`
  mutation createMenuItem($input: NewMenuItem!) {
    create: createMenuItem(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_MENU_ITEM = gql`
  mutation updateMenuItem($id: String!, $input: NewMenuItem!) {
    update: updateMenuItem(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_MENU_ITEM = gql`
  mutation changeActiveMenuItem($id: String!, $active: Boolean!) {
    changeActive: changeActiveMenuItem(id: $id, active: $active)
  }
`;


export const MUTATION_DELETE_MENU_ITEM = gql`
  mutation deleteMenuItem($id: String!) {
    delete: deleteMenuItem(id: $id)
  }
`;