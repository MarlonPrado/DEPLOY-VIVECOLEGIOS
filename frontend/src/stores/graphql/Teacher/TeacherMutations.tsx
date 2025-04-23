import { gql } from '@apollo/client';

export const MUTATION_CREATE_TEACHER = gql`
  mutation createTeacher($input: NewTeacher!) {
    create: createTeacher(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_TEACHER = gql`
  mutation updateTeacher($id: String!, $input: NewTeacher!) {
    update: updateTeacher(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_TEACHER = gql`
  mutation changeActiveTeacher($id: String!, $active: Boolean!) {
    changeActive: changeActiveTeacher(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_TEACHER = gql`
  mutation deleteTeacher($id: String!) {
    delete: deleteTeacher(id: $id)
  }
`;