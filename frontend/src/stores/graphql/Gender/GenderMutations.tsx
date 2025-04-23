import { gql } from '@apollo/client';

export const MUTATION_CREATE_GENDER = gql`
  mutation createGender($input: NewGender!) {
    create: createGender(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GENDER = gql`
  mutation updateGender($id: String!, $input: NewGender!) {
    update: updateGender(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GENDER = gql`
  mutation changeActiveGender($id: String!, $active: Boolean!) {
    changeActive: changeActiveGender(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_GENDER = gql`
  mutation deleteGender($id: String!) {
    delete: deleteGender(id: $id)
  }
`;