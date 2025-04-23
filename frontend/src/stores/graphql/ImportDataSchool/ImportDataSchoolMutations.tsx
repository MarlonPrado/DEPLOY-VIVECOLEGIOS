import { gql } from '@apollo/client';

export const MUTATION_UPDATE_DATA_SIMAT = gql`
  mutation updateDataSimat($schoolId: String!, $schoolYearId: String!) {
    update: updateDataSimat(schoolId: $schoolId, schoolYearId: $schoolYearId)
  }
`;
