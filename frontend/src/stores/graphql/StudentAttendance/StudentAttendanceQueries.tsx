import { gql } from "@apollo/client";

export const QUERY_GET_All_STUDENT_ATTENDANCE = gql`
  query getAllStudentAttendance( $academicPeriodId: String!, $academicAsignatureCourseId: String!) {
    data: getAllStudentAttendance(orderCreated: true, allData: false, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId) {
      edges {
        cursor
        node {
          id
          studentId
          day
        }
      }    
    }
  }
`;
