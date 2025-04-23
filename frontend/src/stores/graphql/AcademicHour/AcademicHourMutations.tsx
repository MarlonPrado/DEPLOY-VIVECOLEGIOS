import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_HOUR = gql`
  mutation createAcademicHour($input: NewAcademicHour!) {
    create: createAcademicHour(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_HOUR = gql`
  mutation updateAcademicHour($id: String!, $input: NewAcademicHour!) {
    update: updateAcademicHour(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ACADEMIC_HOUR = gql`
  mutation changeActiveAcademicHour($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicHour(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ACADEMIC_HOUR = gql`
  mutation deleteAcademicHour($id: String!) {
    delete: deleteAcademicHour(id: $id)
  }
`;