import { gql } from '@apollo/client';

export const MUTATION_CREATE_COMPONENT_EVALUATIVE = gql`
  mutation createEvaluativeComponent($input: NewEvaluativeComponent!) {
    create: createEvaluativeComponent(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_COMPONENT_EVALUATIVE = gql`
  mutation updateEvaluativeComponent($id: String!, $input: NewEvaluativeComponent!) {
    update: updateEvaluativeComponent(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_COMPONENT_EVALUATIVE = gql`
  mutation changeActiveEvaluativeComponent($id: String!, $active: Boolean!) {
    changeActive: changeActiveEvaluativeComponent(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_COMPONENT_EVALUATIVE = gql`
  mutation deleteEvaluativeComponent($id: String!) {
    delete: deleteEvaluativeComponent(id: $id)
  }
`;