import { gql } from '@apollo/client';

export const MUTATION_CREATE_GENERAL_BASIC_LEARNING_RIGHT = gql`
  mutation createGeneralBasicLearningRight($input: NewGeneralBasicLearningRight!) {
    create: createGeneralBasicLearningRight(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_GENERAL_BASIC_LEARNING_RIGHT = gql`
  mutation updateGeneralBasicLearningRight($id: String!, $input: NewGeneralBasicLearningRight!) {
    update: updateGeneralBasicLearningRight(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_GENERAL_BASIC_LEARNING_RIGHT = gql`
  mutation changeActiveGeneralBasicLearningRight($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralBasicLearningRight(id: $id, active: $active)
  }
`;


export const MUTATION_DELETE_GENERAL_BASIC_LEARNING_RIGHT = gql`
  mutation deleteGeneralBasicLearningRight($id: String!) {
    delete: deleteGeneralBasicLearningRight(id: $id)
  }
`;