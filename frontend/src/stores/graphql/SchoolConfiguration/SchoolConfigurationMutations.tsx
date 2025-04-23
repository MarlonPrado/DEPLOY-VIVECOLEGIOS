import { gql } from '@apollo/client';

export const MUTATION_CREATE_SCHOOL_CONFIGURATION = gql`
  mutation createSchoolConfiguration($input: NewSchoolConfiguration!) {
    create: createSchoolConfiguration(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SCHOOL_CONFIGURATION = gql`
  mutation updateSchoolConfiguration($id: String!, $input: NewSchoolConfiguration!) {
    update: updateSchoolConfiguration(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SCHOOL_CONFIGURATION = gql`
  mutation changeActiveSchoolConfiguration($id: String!, $active: Boolean!) {
    changeActive: changeActiveSchoolConfiguration(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SCHOOL_CONFIGURATION = gql`
  mutation deleteSchoolConfiguration($id: String!) {
    delete: deleteSchoolConfiguration(id: $id)
  }
`;