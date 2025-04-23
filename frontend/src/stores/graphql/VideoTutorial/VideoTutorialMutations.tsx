import { gql } from '@apollo/client';

export const MUTATION_CREATE_VIDEO_TUTORIAL = gql`
  mutation createVideoTutorial($input: NewVideoTutorial!) {
    create: createVideoTutorial(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_VIDEO_TUTORIAL = gql`
  mutation updateVideoTutorial($id: String!, $input: NewVideoTutorial!) {
    update: updateVideoTutorial(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_VIDEO_TUTORIAL = gql`
  mutation changeActiveVideoTutorial($id: String!, $active: Boolean!) {
    changeActive: changeActiveVideoTutorial(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_VIDEO_TUTORIAL = gql`
  mutation deleteVideoTutorial($id: String!) {
    delete: deleteVideoTutorial(id: $id)
  }
`;