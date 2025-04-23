import { gql } from '@apollo/client';

export const MUTATION_CREATE_FORUM = gql`
  mutation createForum($input: NewForum!) {
    create: createForum(data: $input) {
      id
    }
  }
`;

export const MUTATION_CREATE_INTERACTION_FORUM = gql`
  mutation createForumInteraction($input: NewForumInteraction!) {
    create: createForumInteraction(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_FORUM = gql`
  mutation updateForum($id: String!, $input: NewForum!) {
    update: updateForum(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_FORUM = gql`
  mutation changeActiveForum($id: String!, $active: Boolean!) {
    changeActive: changeActiveForum(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_FORUM = gql`
  mutation deleteForum($id: String!) {
    delete: deleteForum(id: $id)
  }
`;