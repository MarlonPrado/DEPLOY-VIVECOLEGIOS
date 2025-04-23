import { gql } from '@apollo/client';

export const MUTATION_CREATE_INBOX = gql`
  mutation createInbox($input: NewInbox!) {
    create: createInbox(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_INBOX = gql`
  mutation updateInbox($id: String!, $input: NewInbox!) {
    update: updateInbox(id: $id, data: $input) {
      id
    }
  }
`;
