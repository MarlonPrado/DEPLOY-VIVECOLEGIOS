import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE_YEAR_VALUATION = gql`
  mutation createAcademicAsignatureCourseYearValuation($input: NewAcademicAsignatureCourseYearValuation!) {
    create: createAcademicAsignatureCourseYearValuation(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_YEAR_VALUATION = gql`
  mutation updateAcademicAsignatureCourseYearValuation($id: String!, $input: NewAcademicAsignatureCourseYearValuation!) {
    update: updateAcademicAsignatureCourseYearValuation(id: $id, data: $input) {
      id
    }
  }
`;