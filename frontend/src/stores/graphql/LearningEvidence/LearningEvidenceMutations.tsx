import { gql } from '@apollo/client';

export const MUTATION_CREATE_LEARNING_EVIDENCE = gql`
  mutation createEvidenceLearning($input: NewEvidenceLearning!) {
    create: createEvidenceLearning(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_LEARNING_EVIDENCE = gql`
  mutation updateEvidenceLearning($id: String!, $input: NewEvidenceLearning!) {
    update: updateEvidenceLearning(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_LEARNING_EVIDENCE = gql`
  mutation changeActiveEvidenceLearning($id: String!, $active: Boolean!) {
    changeActive: changeActiveEvidenceLearning(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_LEARNING_EVIDENCE = gql`
  mutation deleteEvidenceLearning($id: String!) {
    delete: deleteEvidenceLearning(id: $id)
  }
`;