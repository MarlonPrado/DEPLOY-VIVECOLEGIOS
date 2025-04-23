import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { MUTATION_CHANGE_ACTIVE_SCHOOL_CONFIGURATION, MUTATION_CREATE_SCHOOL_CONFIGURATION, MUTATION_DELETE_SCHOOL_CONFIGURATION, MUTATION_UPDATE_SCHOOL_CONFIGURATION } from "../graphql/SchoolConfiguration/SchoolConfigurationMutations";
import { QUERY_GET_ALL_SCHOOL_CONFIGURATION, QUERY_GET_SCHOOL_CONFIGURATION } from "../graphql/SchoolConfiguration/SchoolConfigurationQueries";

export const getListAllSchoolConfiguration = (schoolId:string) => {
    return async (dispatch: any) => {
      try {
        let listData = {};
        await client
          .query({
            query: QUERY_GET_ALL_SCHOOL_CONFIGURATION,
            variables:{
              schoolId
            }
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
  
export const dataSchoolConfiguration = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_SCHOOL_CONFIGURATION,
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

export const saveNewSchoolConfiguration = (data: any) => {
  return async (dispatch: any) => {
    try {
      let model: any = {};
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
          mutation: MUTATION_CREATE_SCHOOL_CONFIGURATION,
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

export const updateSchoolConfiguration = (data: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let model: any = {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      //console.log(data)
      //if(model?.valueString2){
        //model.valueString = data?.valueString2;
        delete model.valueString2;
      //}
      model.valueNumber = model.valueNumber && !isNaN(model.valueNumber) ? parseFloat(model.valueNumber) : 0;
      let dataUpdate = null;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_SCHOOL_CONFIGURATION,
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

export const changeActiveSchoolConfiguration = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_SCHOOL_CONFIGURATION,
          variables: { id, active },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataChangeActive = dataReponse.data.changeActive;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataChangeActive as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};


export const deleteSchoolConfiguration = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_SCHOOL_CONFIGURATION,
          variables: { id },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataDelete = dataReponse.data;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataDelete as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};