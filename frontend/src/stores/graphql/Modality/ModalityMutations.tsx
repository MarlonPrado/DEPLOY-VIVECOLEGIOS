import { gql } from '@apollo/client';

export const MUTATION_CREATE_MODALITY = gql`
  mutation createModality($input: NewModality!) {
    create: createModality(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_MODALITY = gql`
  mutation updateModality($id: String!, $input: NewModality!) {
    update: updateModality(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_MODALITY = gql`
  mutation changeActiveModality($id: String!, $active: Boolean!) {
    changeActive: changeActiveModality(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_MODALITY = gql`
  mutation deleteModality($id: String!) {
    delete: deleteModality(id: $id)
  }
`;