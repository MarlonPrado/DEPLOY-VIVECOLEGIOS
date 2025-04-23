import { gql } from '@apollo/client';

export const MUTATION_CREATE_MENU = gql`
  mutation createMenu($input: NewMenu!) {
    create: createMenu(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_MENU = gql`
  mutation updateMenu($id: String!, $input: NewMenu!) {
    update: updateMenu(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_MENU = gql`
  mutation changeActiveMenu($id: String!, $active: Boolean!) {
    changeActive: changeActiveMenu(id: $id, active: $active)
  }
`;


export const MUTATION_DELETE_MENU = gql`
  mutation deleteMenu($id: String!) {
    delete: deleteMenu(id: $id)
  }
`;