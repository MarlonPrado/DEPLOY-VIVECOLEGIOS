import { gql } from '@apollo/client';

export const MUTATION_CREATE_ASIGNATURE = gql`
  mutation createGeneralAcademicAsignature($input: NewGeneralAcademicAsignature!) {
    create: createGeneralAcademicAsignature(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ASIGNATURE = gql`
  mutation updateGeneralAcademicAsignature($id: String!, $input: NewGeneralAcademicAsignature!) {
    update: updateGeneralAcademicAsignature(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ASIGNATURE = gql`
  mutation changeActiveGeneralAcademicAsignature($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralAcademicAsignature(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ASIGNATURE = gql`
  mutation deleteGeneralAcademicAsignature($id: String!) {
    delete: deleteGeneralAcademicAsignature(id: $id)
  }
`;