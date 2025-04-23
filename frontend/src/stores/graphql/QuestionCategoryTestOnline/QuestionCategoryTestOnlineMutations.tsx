import { gql } from '@apollo/client';

export const MUTATION_CREATE_QUESTION_CATEGORY_TEST_ONLINE = gql`
  mutation createQuestionCategoryTestOnline($input: NewQuestionCategoryTestOnline!) {
    create: createQuestionCategoryTestOnline(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_QUESTION_CATEGORY_TEST_ONLINE = gql`
  mutation updateQuestionCategoryTestOnline($id: String!, $input: NewQuestionCategoryTestOnline!) {
    update: updateQuestionCategoryTestOnline(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_QUESTION_CATEGORY_TEST_ONLINE = gql`
  mutation changeActiveQuestionCategoryTestOnline($id: String!, $active: Boolean!) {
    changeActive: changeActiveQuestionCategoryTestOnline(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_QUESTION_CATEGORY_TEST_ONLINE = gql`
  mutation deleteQuestionCategoryTestOnline($id: String!) {
    delete: deleteQuestionCategoryTestOnline(id: $id)
  }
`;