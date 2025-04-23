import { gql } from '@apollo/client';

export const MUTATION_CREATE_LEARNING = gql`
  mutation createLearning($input: NewLearning!) {
    create: createLearning(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_LEARNING = gql`
  mutation updateLearning($id: String!, $input: NewLearning!) {
    update: updateLearning(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_LEARNING = gql`
  mutation changeActiveLearning($id: String!, $active: Boolean!) {
    changeActive: changeActiveLearning(id: $id, active: $active)
  }
`;


export const MUTATION_DELETE_LEARNING = gql`
  mutation deleteLearning($id: String!) {
    delete: deleteLearning(id: $id)
  }
`;