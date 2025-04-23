import { gql } from '@apollo/client';

export const MUTATION_CREATE_MODULE = gql`
  mutation createModule($input: NewModule!) {
    create: createModule(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_MODULE = gql`
  mutation updateModule($id: String!, $input: NewModule!) {
    update: updateModule(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_MODULE = gql`
  mutation changeActiveModule($id: String!, $active: Boolean!) {
    changeActive: changeActiveModule(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_MODULE = gql`
  mutation deleteModule($id: String!) {
    delete: deleteModule(id: $id)
  }
`;