import { gql } from '@apollo/client';

export const MUTATION_CREATE_MUNICIPALITY = gql`
  mutation createMunicipality($input: NewMunicipality!) {
    create: createMunicipality(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_MUNICIPALITY = gql`
  mutation updateMunicipality($id: String!, $input: NewMunicipality!) {
    update: updateMunicipality(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_MUNICIPALITY = gql`
  mutation changeActiveMunicipality($id: String!, $active: Boolean!) {
    changeActive: changeActiveMunicipality(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_MUNICIPALITY = gql`
  mutation deleteMunicipality($id: String!) {
    delete: deleteMunicipality(id: $id)
  }
`;