import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  mutation createExperienceLearningCoEvaluation($input: NewExperienceLearningCoEvaluation!) {
    create: createExperienceLearningCoEvaluation(data: $input) {
      id
      assessment
      experienceLearningId
      studentId
      student {
        id
        user {
          id 
          name
          lastName          
        }
      }
    }
  }
`;

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  mutation updateExperienceLearningCoEvaluation($id: String!, $input: NewExperienceLearningCoEvaluation!) {
    update: updateExperienceLearningCoEvaluation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  mutation changeActiveExperienceLearningCoEvaluation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningCoEvaluation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  mutation deleteExperienceLearningCoEvaluation($id: String!) {
    delete: deleteExperienceLearningCoEvaluation(id: $id)
  }
`;

export const MUTATION_GENERATE_EXPERIENCE_LEARNING_CO_EVALUATION = gql`
  mutation createExperienceLearningCoEvaluationStudents($id: String!) {
    create: createExperienceLearningCoEvaluationStudents(id: $id)
  }
`;