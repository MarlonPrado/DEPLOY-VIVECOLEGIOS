import { gql } from '@apollo/client';

export const MUTATION_CREATE_ADMINISTRATOR = gql`
  mutation createSchoolAdministrator($input: NewSchoolAdministrator!) {
    create: createSchoolAdministrator(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ADMINISTRATOR = gql`
  mutation updateSchoolAdministrator($id: String!, $input: NewSchoolAdministrator!) {
    update: updateSchoolAdministrator(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ADMINISTRATOR = gql`
  mutation changeActiveSchoolAdministrator($id: String!, $active: Boolean!) {
    changeActive: changeActiveSchoolAdministrator(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ADMINISTRATOR = gql`
  mutation deleteSchoolAdministrator($id: String!) {
    delete: deleteSchoolAdministrator(id: $id)
  }
`;