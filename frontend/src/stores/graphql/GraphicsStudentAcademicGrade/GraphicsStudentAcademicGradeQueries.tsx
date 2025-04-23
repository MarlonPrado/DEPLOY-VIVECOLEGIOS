import { gql } from '@apollo/client';

export const QUERY_GET_ALL_ACADEMIC_GRADE_GRAPHICS = gql`
query getAllAcademicGrade($schoolId: String!, $schoolYearId: String) {
  data: getAllAcademicGrade(orderCreated: true, allData: false, schoolId: $schoolId,  schoolYearId: $schoolYearId) {
    edges {
        node {
          name
          countStudent
        }
      }
  }
}
`;
