import { createNotification } from "../../helpers/Notification";
import { client, clientUpload } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_SCHOOL, MUTATION_CREATE_SCHOOL, MUTATION_DELETE_SCHOOL, MUTATION_UPDATE_SCHOOL, MUTATION_UPDATE_SCHOOL_IMG_PRINCIPAL_SIGNATURE_UPLOAD_IMAGE, MUTATION_UPDATE_SCHOOL_IMG_SECRETARY_SIGNATURE_UPLOAD_IMAGE, MUTATION_UPDATE_SCHOOL_LOGO_UPLOAD_IMAGE } from '../graphql/School/SchoolMutations';
import { QUERY_GET_ALL_SCHOOL, QUERY_GET_SCHOOL } from '../graphql/School/SchoolQueries';


export const getListAllSchool = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_SCHOOL,
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

export const dataSchool = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_SCHOOL,
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

export const saveNewSchool = (data: any) => {
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
          mutation: MUTATION_CREATE_SCHOOL,
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

export const updateSchool = (data: any, id: any) => {
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
          mutation: MUTATION_UPDATE_SCHOOL,
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

export const changeActiveSchool = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_SCHOOL,
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

export const deleteSchool = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_SCHOOL,
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

export const uploadLogo = (file: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataUpdate = null;
      await clientUpload
        .mutate({
          mutation: MUTATION_UPDATE_SCHOOL_LOGO_UPLOAD_IMAGE,
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

export const uploadImgPrincipalSignature = (file: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataUpdate = null;
      await clientUpload
        .mutate({
          mutation: MUTATION_UPDATE_SCHOOL_IMG_PRINCIPAL_SIGNATURE_UPLOAD_IMAGE,
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

export const uploadImgSecretarySignature = (file: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let dataUpdate = null;
      await clientUpload
        .mutate({
          mutation: MUTATION_UPDATE_SCHOOL_IMG_SECRETARY_SIGNATURE_UPLOAD_IMAGE,
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