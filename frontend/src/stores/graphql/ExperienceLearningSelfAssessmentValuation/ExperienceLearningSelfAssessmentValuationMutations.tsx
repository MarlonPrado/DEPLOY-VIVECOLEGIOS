import { gql } from '@apollo/client';

export const MUTATION_CREATE_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  mutation createExperienceLearningSelfAssessmentValuation($input: NewExperienceLearningSelfAssessmentValuation!) {
    create: createExperienceLearningSelfAssessmentValuation(data: $input) {
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

export const MUTATION_UPDATE_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  mutation updateExperienceLearningSelfAssessmentValuation($id: String!, $input: NewExperienceLearningSelfAssessmentValuation!) {
    update: updateExperienceLearningSelfAssessmentValuation(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  mutation changeActiveExperienceLearningSelfAssessmentValuation($id: String!, $active: Boolean!) {
    changeActive: changeActiveExperienceLearningSelfAssessmentValuation(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  mutation deleteExperienceLearningSelfAssessmentValuation($id: String!) {
    delete: deleteExperienceLearningSelfAssessmentValuation(id: $id)
  }
`;

export const MUTATION_GENERATE_EXPERIENCE_LEARNING_SELF_ASSESSMENT_VALUATION = gql`
  mutation createExperienceLearningSelfAssessmentValuationStudents($id: String!) {
    create: createExperienceLearningSelfAssessmentValuationStudents(id: $id)
  }
`;