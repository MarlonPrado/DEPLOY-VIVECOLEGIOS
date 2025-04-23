import { createNotification } from "../../helpers/Notification";
import { client, clientUpload } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_USER, MUTATION_CHANGE_PASSWORD_USER, MUTATION_CREATE_USER, MUTATION_DELETE_USER, MUTATION_RESET_PASSWORD_USER, MUTATION_UPDATE_PROFILE_PHOTO_USER, MUTATION_UPDATE_USER, MUTATION_UPDATE_USER_IMG_SIGNATURE_UPLOAD_IMAGE } from '../graphql/Users/UserMutations';
import { QUERY_GET_ALL_USER, QUERY_GET_DROPDOWNS_USER, QUERY_GET_USER, QUERY_GET_USER_BY_DOCUMENT_NUMBER } from '../graphql/Users/UserQueries';

export const getListAllUser = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_USER,
        })
        .then((result: any) => {
          listData = result.data.data.edges;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const dataUser = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_USER,
          variables: {
            id,
          },
        })
        .then((result: any) => {
          data = result.data;
        });
      return data;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const saveNewUser = (data: any) => {
  return async (dispatch: any) => {
    try {
      let model: {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataCreate = null;
      await client
        .mutate({
          mutation: MUTATION_CREATE_USER,
          variables: { input: model },
        })
        .then((dataResponse: any) => {
          if (dataResponse.errors?.length > 0) {
            dataResponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataCreate = dataResponse.data.create.id;
            createNotification('success', 'success', '');
          }
        });
      return dataCreate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const updateUser = (data: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let model: {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataUpdate = null;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_USER,
          variables: { id, input: model },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataUpdate = dataReponse.data.update.id;
            createNotification('success', 'success', '');
          }
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const changeActiveUser = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_USER,
          variables: { id, active },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if(showToast){
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataChangeActive = dataReponse.data.changeActive;
            if(showToast){
            createNotification('success', 'success', '');
            }
          }
        });
      return dataChangeActive as any;
    } catch (error) {
      if(showToast){
      createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const changePasswordUser = (password: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_PASSWORD_USER,
          variables: { id, password },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
                createNotification('error', 'error', '');
            });
          } else {
            dataChangeActive = dataReponse.data.changeActive;
            createNotification('success', 'success', '');            
          }
        });
      return dataChangeActive as any;
    } catch (error) {
      createNotification('error', 'error', '');      
      return error;
    }
  };
};


export const deleteUser = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_USER,
          variables: { id },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if(showToast){
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataDelete = dataReponse.data;
            if(showToast){
            createNotification('success', 'success', '');
            }
          }
        });
      return dataDelete as any;
    } catch (error) {
      if(showToast){
      createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const getDropdownsUser = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_USER
        })
        .then((result: any) => {
          listData = result.data;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const updateProfilePhotoUser = (file: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataUpdate = null;
      await clientUpload
        .mutate({
          mutation: MUTATION_UPDATE_PROFILE_PHOTO_USER,
          variables: { id, file},
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataUpdate = dataReponse.data.update;
            createNotification('success', 'success', '');
          }
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const resetPasswordUser = (id: any) => {
  return async (dispatch: any) => {
    try {
      await client
        .mutate({
          mutation: MUTATION_RESET_PASSWORD_USER,
          variables: { id},
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            createNotification('success', 'success', '');
          }
        });
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const getUserByDocumentNumber = (documentNumber: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .mutate({
          mutation: QUERY_GET_USER_BY_DOCUMENT_NUMBER,
          variables: { documentNumber},
        })
        .then((result: any) => {
          data = result.data.data;
        });
      return data;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const uploadImgSignature = (file: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataUpdate = null;
      await clientUpload
        .mutate({
          mutation: MUTATION_UPDATE_USER_IMG_SIGNATURE_UPLOAD_IMAGE,
          variables: { id, file},
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataUpdate = dataReponse.data.update;
            createNotification('success', 'success', '');
          }
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};