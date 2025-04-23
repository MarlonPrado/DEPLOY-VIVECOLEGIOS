import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_AREA_COURSE_YEAR_VALUATION = gql`
  mutation createAcademicAreaCourseYearValuation($input: NewAcademicAreaCourseYearValuation!) {
    create: createAcademicAreaCourseYearValuation(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_AREA_COURSE_YEAR_VALUATION = gql`
  mutation updateAcademicAreaCourseYearValuation($id: String!, $input: NewAcademicAreaCourseYearValuation!) {
    update: updateAcademicAreaCourseYearValuation(id: $id, data: $input) {
      id
    }
  }
`;