import { gql } from '@apollo/client';

export const MUTATION_CREATE_CLASSROOM_PLAN = gql`
  mutation createClassroomPlan($input: NewClassroomPlan!) {
    create: createClassroomPlan(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_CLASSROOM_PLAN = gql`
  mutation updateClassroomPlan($id: String!, $input: NewClassroomPlan!) {
    update: updateClassroomPlan(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_CLASSROOM_PLAN = gql`
  mutation changeActiveClassroomPlan($id: String!, $active: Boolean!) {
    changeActive: changeActiveClassroomPlan(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_CLASSROOM_PLAN = gql`
  mutation deleteClassroomPlan($id: String!) {
    delete: deleteClassroomPlan(id: $id)
  }
`;