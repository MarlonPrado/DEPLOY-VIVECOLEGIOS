import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  mutation createExperienceLearningRubricCriteria($input: NewExperienceLearningRubricCriteria!) {
    create: createExperienceLearningRubricCriteria(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  mutation updateExperienceLearningRubricCriteria($id: String!, $input: NewExperienceLearningRubricCriteria!) {
    update: updateExperienceLearningRubricCriteria(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  mutation changeActiveExperienceLearningRubricCriteria($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningRubricCriteria(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA = gql`
  mutation deleteExperienceLearningRubricCriteria($id: String!) {
    delete: deleteExperienceLearningRubricCriteria(id: $id)
  }
`;