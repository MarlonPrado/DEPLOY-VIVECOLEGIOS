import { gql } from '@apollo/client';

export const MUTATION_CREATE_CAMPUS = gql`
  mutation createCampus($input: NewCampus!) {
    create: createCampus(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_CAMPUS = gql`
  mutation updateCampus($id: String!, $input: NewCampus!) {
    update: updateCampus(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_CAMPUS = gql`
  mutation changeActiveCampus($id: String!, $active: Boolean!) {
    changeActive: changeActiveCampus(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_CAMPUS = gql`
  mutation deleteCampus($id: String!) {
    delete: deleteCampus(id: $id)
  }
`;