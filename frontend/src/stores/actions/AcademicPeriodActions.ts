import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_ACADEMIC_PERIOD, MUTATION_CREATE_ACADEMIC_PERIOD, MUTATION_DELETE_ACADEMIC_PERIOD, MUTATION_UPDATE_ACADEMIC_PERIOD } from '../graphql/AcademicPeriod/AcademicPeriodMutations';
import { QUERY_GET_ACADEMIC_PERIOD, QUERY_GET_ACADEMIC_PERIODS_ORDER, QUERY_GET_ALL_ACADEMIC_PERIOD, QUERY_GET_CURRENT_ACADEMIC_PERIOD, QUERY_GET_DROPDOWNS_ACADEMIC_PERIOD } from '../graphql/AcademicPeriod/AcademicPeriodQueries';

export const getListAllAcademicPeriod = (schoolId:string, schoolYearId:string, fullAccess: boolean ) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_ACADEMIC_PERIOD,
          variables:{
            schoolId,
            schoolYearId,
            allData: fullAccess ? fullAccess : false,
          },
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

export const getListAllAcademicPeriodOrder = (schoolId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ACADEMIC_PERIODS_ORDER,
          variables:{
            schoolId,
          },
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

export const dataAcademicPeriod = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_ACADEMIC_PERIOD,
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

export const dataCurrentAcademicPeriod = (schoolId: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_CURRENT_ACADEMIC_PERIOD,
          variables: {
            schoolId,
          },
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

export const saveNewAcademicPeriod = (data: any) => {
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
      model.weight = model.weight && !isNaN(model.weight) ? parseFloat(model.weight) : 0;
      model.order = model.order && !isNaN(model.order) ? parseFloat(model.order) : 0;
      await client
        .mutate({
          mutation: MUTATION_CREATE_ACADEMIC_PERIOD,
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

export const updateAcademicPeriod = (data: any, id: any) => {
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
      let dataUpdate = null;
      model.weight = model.weight && !isNaN(model.weight) ? parseFloat(model.weight) : 0;
      model.order = model.order && !isNaN(model.order) ? parseFloat(model.order) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_ACADEMIC_PERIOD,
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

export const changeActiveAcademicPeriod = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_ACADEMIC_PERIOD,
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

export const deleteAcademicPeriod = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_ACADEMIC_PERIOD,
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

export const getDropdownsAcademicPeriod = (schoolId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_ACADEMIC_PERIOD,
          variables:{
            schoolId,
          },
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
