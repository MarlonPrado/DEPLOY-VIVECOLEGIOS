import { gql } from '@apollo/client';

export const MUTATION_CREATE_AREA = gql`
  mutation createGeneralAcademicArea($input: NewGeneralAcademicArea!) {
    create: createGeneralAcademicArea(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_AREA = gql`
  mutation updateGeneralAcademicArea($id: String!, $input: NewGeneralAcademicArea!) {
    update: updateGeneralAcademicArea(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_AREA = gql`
  mutation changeActiveGeneralAcademicArea($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralAcademicArea(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_AREA = gql`
  mutation deleteGeneralAcademicArea($id: String!) {
    delete: deleteGeneralAcademicArea(id: $id)
  }
`;