import { gql } from '@apollo/client';

export const MUTATION_CREATE_USER = gql`
  mutation createUser($input: NewUser!) {
    create: createUser(data: $input) {
      id
    }
  }
`;

export const MUTATION_UPDATE_USER = gql`
  mutation updateUser($id: String!, $input: NewUser!) {
    update: updateUser(id: $id, data: $input) {
      id
    }
  }
`;

export const MUTATION_CHANGE_ACTIVE_USER = gql`
  mutation changeActiveUser($id: String!, $active: Boolean!) {
    changeActive: changeActiveUser(id: $id, active: $active)
  }
`;

export const MUTATION_CHANGE_PASSWORD_USER = gql`
  mutation changePasswordUser($password: String!, $id: String!) {
    changePasswordUser: changePasswordUser(password: $password, id: $id)
  }
`;

export const MUTATION_DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    delete: deleteUser(id: $id)
  }
`;

export const MUTATION_UPDATE_PROFILE_PHOTO_USER = gql`
  mutation userProfileUploadImage($id: String!, $file: Upload) {
    update: userProfileUploadImage(id: $id, file: $file)
  }
`;

export const MUTATION_RESET_PASSWORD_USER = gql`
  mutation resetPasswordUser($id: String!) {
    update: resetPasswordUser(id: $id)
  }
`;

export const MUTATION_UPDATE_USER_IMG_SIGNATURE_UPLOAD_IMAGE = gql`
  mutation userSignatureUploadImage($id: String!, $file: Upload) {
    update: userSignatureUploadImage(id: $id, file: $file)
  }
`;