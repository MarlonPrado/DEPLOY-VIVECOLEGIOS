import { gql } from '@apollo/client';

export const MUTATION_CREATE_PERFORMANCE_LEVEL = gql`
  mutation createPerformanceLevel($input: NewPerformanceLevel!) {
    create: createPerformanceLevel(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_PERFORMANCE_LEVEL = gql`
  mutation updatePerformanceLevel($id: String!, $input: NewPerformanceLevel!) {
    update: updatePerformanceLevel(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_PERFORMANCE_LEVEL = gql`
  mutation changeActivePerformanceLevel($id: String!, $active: Boolean!) {
    changeActive: changeActivePerformanceLevel(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_PERFORMANCE_LEVEL = gql`
  mutation deletePerformanceLevel($id: String!) {
    delete: deletePerformanceLevel(id: $id)
  }
`;