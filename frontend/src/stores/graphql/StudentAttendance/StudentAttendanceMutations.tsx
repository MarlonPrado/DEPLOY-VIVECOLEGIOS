import { gql } from '@apollo/client';

export const MUTATION_CREATE_STUDENT_ATTENDANCE = gql`
  mutation createStudentAttendance($input: NewStudentAttendance!) {
    create: createStudentAttendance(data: $input) {
      id
    }
  }
`;

export const MUTATION_DELETE_STUDENT_ATTENDANCE = gql`
  mutation deleteStudentAttendance($id: String!) {
    delete: deleteStudentAttendance(id: $id)
  }
`;