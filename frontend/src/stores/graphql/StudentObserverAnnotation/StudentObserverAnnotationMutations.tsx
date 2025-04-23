import { gql } from '@apollo/client';

export const MUTATION_CREATE_STUDENT_OBSERVER_ANNOTATION = gql`
  mutation createStudentObserverAnnotation($input: NewStudentObserverAnnotation!) {
    create: createStudentObserverAnnotation(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_STUDENT_OBSERVER_ANNOTATION = gql`
  mutation updateStudentObserverAnnotation($id: String!, $input: NewStudentObserverAnnotation!) {
    update: updateStudentObserverAnnotation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_STUDENT_OBSERVER_ANNOTATION = gql`
  mutation changeActiveStudentObserverAnnotation($id: String!, $active: Boolean!) {
    changeActive: changeActiveStudentObserverAnnotation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_STUDENT_OBSERVER_ANNOTATION = gql`
  mutation deleteStudentObserverAnnotation($id: String!) {
    delete: deleteStudentObserverAnnotation(id: $id)
  }
`;