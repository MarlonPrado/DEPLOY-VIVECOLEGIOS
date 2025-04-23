import { gql } from '@apollo/client';

export const MUTATION_CREATE_GUARDIAN = gql`
  mutation createGuardian($input: NewGuardian!) {
    create: createGuardian(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GUARDIAN = gql`
  mutation updateGuardian($id: String!, $input: NewGuardian!) {
    update: updateGuardian(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GUARDIAN = gql`
  mutation changeActiveGuardian($id: String!, $active: Boolean!) {
    changeActive: changeActiveGuardian(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_GUARDIAN = gql`
  mutation deleteGuardian($id: String!) {
    delete: deleteGuardian(id: $id)
  }
`;