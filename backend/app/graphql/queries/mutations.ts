import { gql } from 'graphql-request';

export const MUTATION_LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    data: login(username: $username, password: $password) {
      userId
    }
  }
`;
