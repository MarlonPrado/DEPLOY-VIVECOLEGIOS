import { gql } from '@apollo/client';

export const MUTATION_CREATE_DOCUMENT_TYPE = gql`
  mutation createDocumentType($input: NewDocumentType!) {
    create: createDocumentType(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_DOCUMENT_TYPE = gql`
  mutation updateDocumentType($id: String!, $input: NewDocumentType!) {
    update: updateDocumentType(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_DOCUMENT_TYPE = gql`
  mutation changeActiveDocumentType($id: String!, $active: Boolean!) {
    changeActive: changeActiveDocumentType(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_DOCUMENT_TYPE = gql`
  mutation deleteDocumentType($id: String!) {
    delete: deleteDocumentType(id: $id)
  }
`;