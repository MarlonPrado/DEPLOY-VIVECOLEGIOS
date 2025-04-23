import { gql } from '@apollo/client';

export const MUTATION_CREATE_ASIGNATURE = gql`
  mutation createAcademicAsignature($input: NewAcademicAsignature!) {
    create: createAcademicAsignature(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ASIGNATURE = gql`
  mutation updateAcademicAsignature($id: String!, $input: NewAcademicAsignature!) {
    update: updateAcademicAsignature(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ASIGNATURE = gql`
  mutation changeActiveAcademicAsignature($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicAsignature(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ASIGNATURE = gql`
  mutation deleteAcademicAsignature($id: String!) {
    delete: deleteAcademicAsignature(id: $id)
  }
`;