import { gql } from '@apollo/client';

export const MUTATION_CREATE_GRADE_ASSIGNMENT = gql`
  mutation createGradeAssignment($input: NewGradeAssignment!) {
    create: createGradeAssignment(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GRADE_ASSIGNMENT = gql`
  mutation updateGradeAssignment($id: String!, $input: NewGradeAssignment!) {
    update: updateGradeAssignment(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GRADE_ASSIGNMENT = gql`
  mutation changeActiveGradeAssignment($id: String!, $active: Boolean!) {
    changeActive: changeActiveGradeAssignment(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_GRADE_ASSIGNMENT = gql`
  mutation deleteGradeAssignment($id: String!) {
    delete: deleteGradeAssignment(id: $id)
  }
`;