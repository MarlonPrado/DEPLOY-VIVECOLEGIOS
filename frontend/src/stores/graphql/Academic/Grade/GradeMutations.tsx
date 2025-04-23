import { gql } from '@apollo/client';

export const MUTATION_CREATE_GRADE = gql`
  mutation createAcademicGrade($input: NewAcademicGrade!) {
    create: createAcademicGrade(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GRADE = gql`
  mutation updateAcademicGrade($id: String!, $input: NewAcademicGrade!) {
    update: updateAcademicGrade(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GRADE = gql`
  mutation changeActiveAcademicGrade($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicGrade(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_GRADE = gql`
  mutation deleteAcademicGrade($id: String!) {
    delete: deleteAcademicGrade(id: $id)
  }
`;