import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  mutation createExperienceLearningRubricCriteriaValuation($input: NewExperienceLearningRubricCriteriaValuation!) {
    create: createExperienceLearningRubricCriteriaValuation(data: $input) {
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

export const MUTATION_UPDATE_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  mutation updateExperienceLearningRubricCriteriaValuation($id: String!, $input: NewExperienceLearningRubricCriteriaValuation!) {
    update: updateExperienceLearningRubricCriteriaValuation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_EXPERIENCE_RUBRIC_VALUATION = gql`
  mutation updateAssessmentExperienceLearningRubricValuation($id: String!) {
    update: updateAssessmentExperienceLearningRubricValuation(id: $id) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  mutation changeActiveExperienceLearningRubricCriteriaValuation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningRubricCriteriaValuation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_RUBRIC_CRITERIA_VALUATION = gql`
  mutation deleteExperienceLearningRubricCriteriaValuation($id: String!) {
    delete: deleteExperienceLearningRubricCriteriaValuation(id: $id)
  }
`;