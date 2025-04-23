import { gql } from '@apollo/client';

export const MUTATION_CREATE_PERFORMANCE_LEVEL = gql`
  mutation createGeneralPerformanceLevel($input: NewGeneralPerformanceLevel!) {
    create: createGeneralPerformanceLevel(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_PERFORMANCE_LEVEL = gql`
  mutation updateGeneralPerformanceLevel($id: String!, $input: NewGeneralPerformanceLevel!) {
    update: updateGeneralPerformanceLevel(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_PERFORMANCE_LEVEL = gql`
  mutation changeActiveGeneralPerformanceLevel($id: String!, $active: Boolean!) {
    changeActive: changeActiveGeneralPerformanceLevel(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_PERFORMANCE_LEVEL = gql`
  mutation deleteGeneralPerformanceLevel($id: String!) {
    delete: deleteGeneralPerformanceLevel(id: $id)
  }
`;