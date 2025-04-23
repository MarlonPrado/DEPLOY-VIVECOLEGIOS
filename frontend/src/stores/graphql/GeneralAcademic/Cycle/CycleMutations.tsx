import { gql } from '@apollo/client';

export const MUTATION_CREATE_CYCLE = gql`
  mutation createGeneralAcademicCycle($input: NewGeneralAcademicCycle!) {
    create: createGeneralAcademicCycle(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_CYCLE = gql`
  mutation updateGeneralAcademicCycle($id: String!, $input: NewGeneralAcademicCycle!) {
    update: updateGeneralAcademicCycle(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_CYCLE = gql`
  mutation changeActiveGeneralAcademicCycle($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralAcademicCycle(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_CYCLE = gql`
  mutation deleteGeneralAcademicCycle($id: String!) {
    delete: deleteGeneralAcademicCycle(id: $id)
  }
`;