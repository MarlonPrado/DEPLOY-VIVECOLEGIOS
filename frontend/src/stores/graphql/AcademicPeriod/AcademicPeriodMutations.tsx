import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_PERIOD = gql`
  mutation createAcademicPeriod($input: NewAcademicPeriod!) {
    create: createAcademicPeriod(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_PERIOD = gql`
  mutation updateAcademicPeriod($id: String!, $input: NewAcademicPeriod!) {
    update: updateAcademicPeriod(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ACADEMIC_PERIOD = gql`
  mutation changeActiveAcademicPeriod($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicPeriod(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ACADEMIC_PERIOD = gql`
  mutation deleteAcademicPeriod($id: String!) {
    delete: deleteAcademicPeriod(id: $id)
  }
`;