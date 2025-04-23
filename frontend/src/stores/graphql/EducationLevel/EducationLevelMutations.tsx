import { gql } from '@apollo/client';

export const MUTATION_CREATE_EDUCATION_LEVEL = gql`
  mutation createEducationLevel($input: NewEducationLevel!) {
    create: createEducationLevel(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_EDUCATION_LEVEL = gql`
  mutation updateEducationLevel($id: String!, $input: NewEducationLevel!) {
    update: updateEducationLevel(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EDUCATION_LEVEL = gql`
  mutation changeActiveEducationLevel($id: String!, $active: Boolean!) {
    changeActive: changeActiveEducationLevel(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EDUCATION_LEVEL = gql`
  mutation deleteEducationLevel($id: String!) {
    delete: deleteEducationLevel(id: $id)
  }
`;