import { gql } from '@apollo/client';

export const MUTATION_CREATE_AREA = gql`
  mutation createAcademicArea($input: NewAcademicArea!) {
    create: createAcademicArea(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_AREA = gql`
  mutation updateAcademicArea($id: String!, $input: NewAcademicArea!) {
    update: updateAcademicArea(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_AREA = gql`
  mutation changeActiveAcademicArea($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicArea(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_AREA = gql`
  mutation deleteAcademicArea($id: String!) {
    delete: deleteAcademicArea(id: $id)
  }
`;