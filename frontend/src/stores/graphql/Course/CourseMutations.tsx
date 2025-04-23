import { gql } from '@apollo/client';

export const MUTATION_CREATE_COURSE = gql`
  mutation createCourse($input: NewCourse!) {
    create: createCourse(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_COURSE = gql`
  mutation updateCourse($id: String!, $input: NewCourse!) {
    update: updateCourse(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_COURSE = gql`
  mutation changeActiveCourse($id: String!, $active: Boolean!) {
    changeActive: changeActiveCourse(id: $id, active: $active)
  }
`;


export const MUTATION_DELETE_COURSE = gql`
  mutation deleteCourse($id: String!) {
    delete: deleteCourse(id: $id)
  }
`;

export const MUTATION_GENERATE_CODES = gql`
  mutation updateCodeStudentsCourse($id: String!) {
    update: updateCodeStudentsCourse(id: $id)
  }
`;

export const MUTATION_GENERATE_CODES_ACADEMIC_GRADE = gql`
  mutation updateCodeStudentsCoursesAcademicGrade($id: String!) {
    update: updateCodeStudentsCoursesAcademicGrade(id: $id)
  }
`;