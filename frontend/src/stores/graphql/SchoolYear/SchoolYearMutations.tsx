import { gql } from '@apollo/client';

export const MUTATION_CREATE_SCHOOL_YEAR = gql`
  mutation createSchoolYear($input: NewSchoolYear!) {
    create: createSchoolYear(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SCHOOL_YEAR = gql`
  mutation updateSchoolYear($id: String!, $input: NewSchoolYear!) {
    update: updateSchoolYear(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SCHOOL_YEAR = gql`
  mutation changeActiveSchoolYear($id: String!, $active: Boolean!) {
    changeActive: changeActiveSchoolYear(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SCHOOL_YEAR = gql`
  mutation deleteSchoolYear($id: String!) {
    delete: deleteSchoolYear(id: $id)
  }
`;