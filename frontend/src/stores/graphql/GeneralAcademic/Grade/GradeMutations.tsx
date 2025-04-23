import { gql } from '@apollo/client';

export const MUTATION_CREATE_GRADE = gql`
  mutation createGeneralAcademicGrade($input: NewGeneralAcademicGrade!) {
    create: createGeneralAcademicGrade(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GRADE = gql`
  mutation updateGeneralAcademicGrade($id: String!, $input: NewGeneralAcademicGrade!) {
    update: updateGeneralAcademicGrade(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GRADE = gql`
  mutation changeActiveGeneralAcademicGrade($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralAcademicGrade(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_GRADE = gql`
  mutation deleteGeneralAcademicGrade($id: String!) {
    delete: deleteGeneralAcademicGrade(id: $id)
  }
`;