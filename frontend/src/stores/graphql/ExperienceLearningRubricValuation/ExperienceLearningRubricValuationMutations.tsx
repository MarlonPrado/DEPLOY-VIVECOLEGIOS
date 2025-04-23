import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  mutation createExperienceLearningRubricValuation($input: NewExperienceLearningRubricValuation!) {
    create: createExperienceLearningRubricValuation(data: $input) {
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

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  mutation updateExperienceLearningRubricValuation($id: String!, $input: NewExperienceLearningRubricValuation!) {
    update: updateExperienceLearningRubricValuation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  mutation changeActiveExperienceLearningRubricValuation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningRubricValuation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  mutation deleteExperienceLearningRubricValuation($id: String!) {
    delete: deleteExperienceLearningRubricValuation(id: $id)
  }
`;

export const MUTATION_GENERATE_EXPERIENCE_LEARNING_RUBRIC_VALUATION = gql`
  mutation createExperienceLearningRubricStudents($id: String!) {
    create: createExperienceLearningRubricStudents(id: $id)
  }
`;
