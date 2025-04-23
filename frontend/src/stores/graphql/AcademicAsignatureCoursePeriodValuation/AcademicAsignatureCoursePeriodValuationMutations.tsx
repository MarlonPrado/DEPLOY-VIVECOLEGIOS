import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION = gql`
  mutation createAcademicAsignatureCoursePeriodValuation($input: NewAcademicAsignatureCoursePeriodValuation!) {
    create: createAcademicAsignatureCoursePeriodValuation(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION = gql`
  mutation updateAcademicAsignatureCoursePeriodValuation($id: String!, $input: NewAcademicAsignatureCoursePeriodValuation!) {
    update: updateAcademicAsignatureCoursePeriodValuation(id: $id, data: $input) {
      id
    }
  }
`;