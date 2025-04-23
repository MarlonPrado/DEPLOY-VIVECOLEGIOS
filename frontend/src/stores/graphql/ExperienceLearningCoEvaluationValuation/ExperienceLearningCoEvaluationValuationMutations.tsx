import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  mutation createExperienceLearningCoEvaluationValuation($input: NewExperienceLearningCoEvaluationValuation!) {
    create: createExperienceLearningCoEvaluationValuation(data: $input) {
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

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  mutation updateExperienceLearningCoEvaluationValuation($id: String!, $input: NewExperienceLearningCoEvaluationValuation!) {
    update: updateExperienceLearningCoEvaluationValuation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  mutation changeActiveExperienceLearningCoEvaluationValuation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningCoEvaluationValuation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  mutation deleteExperienceLearningCoEvaluationValuation($id: String!) {
    delete: deleteExperienceLearningCoEvaluationValuation(id: $id)
  }
`;

export const MUTATION_GENERATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION = gql`
  mutation createExperienceLearningCoEvaluationValuationStudents($id: String!) {
    create: createExperienceLearningCoEvaluationValuationStudents(id: $id)
  }
`;