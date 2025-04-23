import { gql } from '@apollo/client';

export const MUTATION_CREATE_STUDENT_BEHAVIOUR = gql`
  mutation createStudentBehaviour($input: NewStudentBehaviour!) {
    create: createStudentBehaviour(data: $input) {
      id
    }
  }
`;

export const MUTATION_DELETE_STUDENT_BEHAVIOUR = gql`
  mutation deleteStudentBehaviour($id: String!) {
    delete: deleteStudentBehaviour(id: $id)
  }
`;

export const MUTATION_CREATE_PERIOD_STUDENT_BEHAVIOUR = gql`
  mutation createPeriodStudentBehaviour($academicPeriodId: String!, $courseId: String!) {
    create: createPeriodStudentBehaviour( academicPeriodId: $academicPeriodId, courseId: $courseId)
  }
`;

export const MUTATION_UPDATE_STUDENT_BEHAVIOUR = gql`
  mutation updateStudentBehaviour($id: String!, $input: NewStudentBehaviour!) {
    update: updateStudentBehaviour(id: $id, data: $input) {
      id
    }
  }
`;