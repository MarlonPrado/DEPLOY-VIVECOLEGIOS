import { gql } from '@apollo/client';

export const MUTATION_CREATE_SPECIALITY = gql`
  mutation createSpecialty($input: NewSpecialty!) {
    create: createSpecialty(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SPECIALITY = gql`
  mutation updateSpecialty($id: String!, $input: NewSpecialty!) {
    update: updateSpecialty(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SPECIALITY = gql`
  mutation changeActiveSpecialty($id: String!, $active: Boolean!) {
    changeActive: changeActiveSpecialty(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SPECIALITY = gql`
  mutation deleteSpecialty($id: String!) {
    delete: deleteSpecialty(id: $id)
  }
`;