import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING = gql`
  mutation createExperienceLearning($input: NewExperienceLearning!) {
    create: createExperienceLearning(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_EXPERIENCE_LEARNING = gql`
  mutation updateExperienceLearning($id: String!, $input: NewExperienceLearning!) {
    update: updateExperienceLearning(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING = gql`
  mutation changeActiveExperienceLearning($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearning(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING = gql`
  mutation deleteExperienceLearning($id: String!) {
    delete: deleteExperienceLearning(id: $id)
  }
`;