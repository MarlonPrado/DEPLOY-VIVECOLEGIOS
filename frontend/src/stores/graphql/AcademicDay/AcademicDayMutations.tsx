import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_DAY = gql`
  mutation createAcademicDay($input: NewAcademicDay!) {
    create: createAcademicDay(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_DAY = gql`
  mutation updateAcademicDay($id: String!, $input: NewAcademicDay!) {
    update: updateAcademicDay(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ACADEMIC_DAY = gql`
  mutation changeActiveAcademicDay($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicDay(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ACADEMIC_DAY = gql`
  mutation deleteAcademicDay($id: String!) {
    delete: deleteAcademicDay(id: $id)
  }
`;