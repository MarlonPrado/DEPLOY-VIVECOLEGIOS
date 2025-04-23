import { gql } from '@apollo/client';

export const MUTATION_CREATE_NOTIFICATION = gql`
  mutation createNotification($input: NewNotification!) {
    create: createNotification(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_NOTIFICATION = gql`
  mutation updateNotification($id: String!, $input: NewNotification!) {
    update: updateNotification(id: $id, data: $input) {
      id
    }
  }
`;
