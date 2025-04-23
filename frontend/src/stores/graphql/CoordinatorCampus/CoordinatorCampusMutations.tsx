import { gql } from '@apollo/client';

export const MUTATION_CREATE_COORDINATOR_CAMPUS = gql`
  mutation createCampusCoordinator($input: NewCampusCoordinator!) {
    create: createCampusCoordinator(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_COORDINATOR_CAMPUS = gql`
  mutation updateCampusCoordinator($id: String!, $input: NewCampusCoordinator!) {
    update: updateCampusCoordinator(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_COORDINATOR_CAMPUS = gql`
  mutation changeActiveCampusCoordinator($id: String!, $active: Boolean!) {
    changeActive: changeActiveCampusCoordinator(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_COORDINATOR_CAMPUS = gql`
  mutation deleteCampusCoordinator($id: String!) {
    delete: deleteCampusCoordinator(id: $id)
  }
`;