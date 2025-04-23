import { gql } from '@apollo/client';

export const MUTATION_CREATE_STUDENT = gql`
  mutation createStudent($input: NewStudent!) {
    create: createStudent(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_STUDENT = gql`
  mutation updateStudent($id: String!, $input: NewStudent!) {
    update: updateStudent(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_STUDENT = gql`
  mutation changeActiveStudent($id: String!, $active: Boolean!) {
    changeActive: changeActiveStudent(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_STUDENT = gql`
  mutation deleteStudent($id: String!) {
    delete: deleteStudent(id: $id)
  }
`;

export const MUTATION_ASSOCIATE_GUARDIAN = gql`
  mutation updateGuardian($id: String!, $input: NewGuardian!) {
    update: updateGuardian(id: $id, data: $input) {
      id
    }
  }
`;