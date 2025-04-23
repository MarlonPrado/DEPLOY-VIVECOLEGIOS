import { gql } from '@apollo/client';

export const MUTATION_CREATE_QUESTION_TEST_ONLINE = gql`
  mutation createQuestionTestOnline($input: NewQuestionTestOnline!) {
    create: createQuestionTestOnline(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_QUESTION_TEST_ONLINE = gql`
  mutation updateQuestionTestOnline($id: String!, $input: NewQuestionTestOnline!) {
    update: updateQuestionTestOnline(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_QUESTION_TEST_ONLINE = gql`
  mutation changeActiveQuestionTestOnline($id: String!, $active: Boolean!) {
    changeActive: changeActiveQuestionTestOnline(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_QUESTION_TEST_ONLINE = gql`
  mutation deleteQuestionTestOnline($id: String!) {
    delete: deleteQuestionTestOnline(id: $id)
  }
`;
