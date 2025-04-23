import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_AVERAGE_VALUATION_STUDENTS = gql`
  mutation createExperienceLearningAverageValuationStudents($evaluativeComponentId : String!, $academicPeriodId: String!, $academicAsignatureCourseId: String!) {
    create: createExperienceLearningAverageValuationStudents(evaluativeComponentId : $evaluativeComponentId, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId)
  }
`;

export const MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION_STUDENTS = gql`
  mutation createAcademicAsignatureCoursePeriodValuationStudents($schoolId : String!, $academicPeriodId: String!, $academicAsignatureCourseId: String!) {
    create: createAcademicAsignatureCoursePeriodValuationStudents(schoolId : $schoolId, academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId)
  }
`;

export const MUTATION_UPDATE_ALL_STUDENT_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION = gql`
  mutation updateAllStudentAcademicAsignatureCoursePeriodValuation($academicPeriodId: String!, $academicAsignatureCourseId: String!) {
    create: updateAllStudentAcademicAsignatureCoursePeriodValuation(academicPeriodId: $academicPeriodId, academicAsignatureCourseId: $academicAsignatureCourseId, experienceLearningType: NORMAL)
  }
`;

export const MUTATION_UPDATE_ALL_STUDENT_COURSE_PERIOD_VALUATION = gql`
  mutation updateAllStudentCoursePeriodValuation($courseId: String!, $academicPeriodId: String!, $experienceLearningType: ExperienceLearningType!) {
    create: updateAllStudentCoursePeriodValuation(courseId: $courseId, academicPeriodId: $academicPeriodId, experienceLearningType: $experienceLearningType)
  }
`;

export const MUTATION_UPDATE_ALL_AVERAGE_STUDENT_COURSE_PERIOD = gql`
  mutation updateAllAverageStudentCoursePeriod($courseId: String!, $academicPeriodId: String!) {
    create: updateAllAverageStudentCoursePeriod(courseId: $courseId, academicPeriodId: $academicPeriodId)
  }
`;

export const MUTATION_UPDATE_ALL_STUDENT_COURSE_YEAR_VALUATION = gql`
  mutation updateAllStudentCourseYearValuation($courseId: String!, $schoolId: String!, $schoolYearId: String!) {
    create: updateAllStudentCourseYearValuation(courseId: $courseId, schoolId: $schoolId, schoolYearId: $schoolYearId)
  }
`;

export const MUTATION_CREATE_AVERAGE_BEHAVIOUR_YEAR_VALUATION_COURSE = gql`
  mutation createAverageBehaviourYearValuationCourse($courseId: String!, $schoolYearId: String!) {
    create: createAverageBehaviourYearValuationCourse(courseId: $courseId, schoolYearId: $schoolYearId)
  }
`;