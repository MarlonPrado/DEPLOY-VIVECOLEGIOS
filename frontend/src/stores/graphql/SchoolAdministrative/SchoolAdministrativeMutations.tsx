import { gql } from '@apollo/client';

export const MUTATION_CREATE_SCHOOL_ADMINISTRATIVE = gql`
  mutation createSchoolAdministrative($input: NewSchoolAdministrative!) {
    create: createSchoolAdministrative(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SCHOOL_ADMINISTRATIVE = gql`
  mutation updateSchoolAdministrative($id: String!, $input: NewSchoolAdministrative!) {
    update: updateSchoolAdministrative(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SCHOOL_ADMINISTRATIVE = gql`
  mutation changeActiveSchoolAdministrative($id: String!, $active: Boolean!) {
    changeActive: changeActiveSchoolAdministrative(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SCHOOL_ADMINISTRATIVE = gql`
  mutation deleteSchoolAdministrative($id: String!) {
    delete: deleteSchoolAdministrative(id: $id)
  }
`;