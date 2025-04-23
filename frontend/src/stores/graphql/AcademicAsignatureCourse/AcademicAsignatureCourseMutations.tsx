import { gql } from '@apollo/client';

export const MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE = gql`
  mutation createAcademicAsignatureCourse($input: NewAcademicAsignatureCourse!) {
    create: createAcademicAsignatureCourse(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE = gql`
  mutation updateAcademicAsignatureCourse($id: String!, $input: NewAcademicAsignatureCourse!) {
    update: updateAcademicAsignatureCourse(id: $id, data: $input) {
      id
    }
  }
`;


export const MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_HOURLY_INTENSITY = gql`
  mutation updateAcademicAsignatureCourseHourltIntensity($id: String!, $input: NewAcademicAsignatureCourse!) {
    update: updateAcademicAsignatureCourseHourltIntensity(id: $id, data: $input) {
      id
    }
  }
`;


export const MUTATION_CHANGE_ACTIVE_ACADEMIC_ASIGNATURE_COURSE = gql`
  mutation changeActiveAcademicAsignatureCourse($id: String!, $active: Boolean!) {
    changeActive: changeActiveAcademicAsignatureCourse(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_ACADEMIC_ASIGNATURE_COURSE = gql`
  mutation deleteAcademicAsignatureCourse($id: String!) {
    delete: deleteAcademicAsignatureCourse(id: $id)
  }
`;