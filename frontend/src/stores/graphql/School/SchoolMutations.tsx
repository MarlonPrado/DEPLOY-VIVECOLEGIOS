import { gql } from '@apollo/client';

export const MUTATION_CREATE_SCHOOL = gql`
  mutation createSchool($input: NewSchool!) {
    create: createSchool(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_SCHOOL = gql`
  mutation updateSchool($id: String!, $input: NewSchool!) {
    update: updateSchool(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_SCHOOL = gql`
  mutation changeActiveSchool($id: String!, $active: Boolean!) {
    changeActive: changeActiveSchool(id: $id, active: $active)
  }
`;

export const MUTATION_DELETE_SCHOOL = gql`
  mutation deleteSchool($id: String!) {
    delete: deleteSchool(id: $id)
  }
`;

export const MUTATION_UPDATE_SCHOOL_LOGO_UPLOAD_IMAGE = gql`
  mutation schoolLogoUploadImage($id: String!, $file: Upload) {
    update: schoolLogoUploadImage(id: $id, file: $file)
  }
`;

export const MUTATION_UPDATE_SCHOOL_IMG_PRINCIPAL_SIGNATURE_UPLOAD_IMAGE = gql`
  mutation schoolImgPrincipalSignatureUploadImage($id: String!, $file: Upload) {
    update: schoolImgPrincipalSignatureUploadImage(id: $id, file: $file)
  }
`;

export const MUTATION_UPDATE_SCHOOL_IMG_SECRETARY_SIGNATURE_UPLOAD_IMAGE = gql`
  mutation schoolImgSecretarySignatureUploadImage($id: String!, $file: Upload) {
    update: schoolImgSecretarySignatureUploadImage(id: $id, file: $file)
  }
`;
