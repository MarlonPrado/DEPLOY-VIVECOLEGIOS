import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_AREA_COURSE_PERIOD_VALUATION = gql`
  mutation createAcademicAreaCoursePeriodValuation($input: NewAcademicAreaCoursePeriodValuation!) {
    create: createAcademicAreaCoursePeriodValuation(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_AREA_COURSE_PERIOD_VALUATION = gql`
  mutation updateAcademicAreaCoursePeriodValuation($id: String!, $input: NewAcademicAreaCoursePeriodValuation!) {
    update: updateAcademicAreaCoursePeriodValuation(id: $id, data: $input) {
      id
    }
  }
`;