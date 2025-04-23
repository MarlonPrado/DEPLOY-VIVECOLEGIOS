import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  mutation createExperienceLearningTraditionalValuation($input: NewExperienceLearningTraditionalValuation!) {
    create: createExperienceLearningTraditionalValuation(data: $input) {
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

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  mutation updateExperienceLearningTraditionalValuation($id: String!, $input: NewExperienceLearningTraditionalValuation!) {
    update: updateExperienceLearningTraditionalValuation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  mutation changeActiveExperienceLearningTraditionalValuation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningTraditionalValuation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  mutation deleteExperienceLearningTraditionalValuation($id: String!) {
    delete: deleteExperienceLearningTraditionalValuation(id: $id)
  }
`;

export const MUTATION_GENERATE_EXPERIENCE_LEARNING_TRADITIONAL_VALUATION = gql`
  mutation createExperienceLearningTraditionalValuationStudents($id: String!) {
    create: createExperienceLearningTraditionalValuationStudents(id: $id)
  }
`;