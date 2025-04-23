import { gql } from '@apollo/client';

export const MUTATION_CREATE_STANDARD = gql`
  mutation createGeneralAcademicStandard($input: NewGeneralAcademicStandard!) {
    create: createGeneralAcademicStandard(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_STANDARD = gql`
  mutation updateGeneralAcademicStandard($id: String!, $input: NewGeneralAcademicStandard!) {
    update: updateGeneralAcademicStandard(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_STANDARD = gql`
  mutation changeActiveGeneralAcademicStandard($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralAcademicStandard(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_STANDARD = gql`
  mutation deleteGeneralAcademicStandard($id: String!) {
    delete: deleteGeneralAcademicStandard(id: $id)
  }
`;