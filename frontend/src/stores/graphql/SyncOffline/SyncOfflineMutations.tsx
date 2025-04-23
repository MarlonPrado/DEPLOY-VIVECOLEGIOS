import { gql } from '@apollo/client';

export const MUTATION_CREATE_SYNC_OFFLINE = gql`
  mutation createSyncOffline($input: NewSyncOffline!) {
    create: createSyncOffline(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SYNC_OFFLINE = gql`
  mutation updateSyncOffline($id: String!, $input: NewSyncOffline!) {
    update: updateSyncOffline(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SYNC_OFFLINE = gql`
  mutation changeActiveSyncOffline($id: String!, $active: Boolean!) {
    changeActive: changeActiveSyncOffline(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SYNC_OFFLINE = gql`
  mutation deleteSyncOffline($id: String!) {
    delete: deleteSyncOffline(id: $id)
  }
`;
