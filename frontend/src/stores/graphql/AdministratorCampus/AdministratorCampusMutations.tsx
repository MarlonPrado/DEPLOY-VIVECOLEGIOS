import { gql } from '@apollo/client';

export const MUTATION_CREATE_ADMINISTRATOR_CAMPUS = gql`
  mutation createCampusAdministrator($input: NewCampusAdministrator!) {
    create: createCampusAdministrator(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ADMINISTRATOR_CAMPUS = gql`
  mutation updateCampusAdministrator($id: String!, $input: NewCampusAdministrator!) {
    update: updateCampusAdministrator(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_ADMINISTRATOR_CAMPUS = gql`
  mutation changeActiveCampusAdministrator($id: String!, $active: Boolean!) {
    changeActive: changeActiveCampusAdministrator(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ADMINISTRATOR_CAMPUS = gql`
  mutation deleteCampusAdministrator($id: String!) {
    delete: deleteCampusAdministrator(id: $id)
  }
`;