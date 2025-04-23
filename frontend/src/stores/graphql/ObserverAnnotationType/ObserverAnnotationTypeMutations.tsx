import { gql } from '@apollo/client';

export const MUTATION_CREATE_OBSERVER_ANNOTACION_TYPE = gql`
  mutation createObserverAnnotationType($input: NewObserverAnnotationType!) {
    create: createObserverAnnotationType(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_OBSERVER_ANNOTACION_TYPE = gql`
  mutation updateObserverAnnotationType($id: String!, $input: NewObserverAnnotationType!) {
    update: updateObserverAnnotationType(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_OBSERVER_ANNOTACION_TYPE = gql`
  mutation changeActiveObserverAnnotationType($id: String!, $active: Boolean!) {
    changeActive: changeActiveObserverAnnotationType(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_OBSERVER_ANNOTACION_TYPE = gql`
  mutation deleteObserverAnnotationType($id: String!) {
    delete: deleteObserverAnnotationType(id: $id)
  }
`;