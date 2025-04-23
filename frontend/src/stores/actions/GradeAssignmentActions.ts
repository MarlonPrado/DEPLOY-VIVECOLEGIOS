import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_GRADE_ASSIGNMENT, MUTATION_CREATE_GRADE_ASSIGNMENT, MUTATION_DELETE_GRADE_ASSIGNMENT, MUTATION_UPDATE_GRADE_ASSIGNMENT } from '../graphql/GradeAssignment/GradeAssignmentMutations';
import { QUERY_GET_ALL_GRADE_ASSIGNMENT, QUERY_GET_ALL_GRADE_ASSIGNMENT_BY_ASIGNATURE, QUERY_GET_DROPDOWNS_GRADE_ASSIGNMENT, QUERY_GET_GRADE_ASSIGNMENT } from '../graphql/GradeAssignment/GradeAssignmentQueries';

export const getListAllGradeAssignment = (schoolId:string, academicGradeId: string, fullAccess: boolean) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_GRADE_ASSIGNMENT,
          variables:{
            schoolId,
            academicGradeId,
            allData: fullAccess ? fullAccess : false,
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

export const getListAllGradeAssignmentByAsignature = (schoolId:string, academicAsignatureId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_GRADE_ASSIGNMENT_BY_ASIGNATURE,
          variables:{
            schoolId,
            academicAsignatureId ,
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

export const dataGradeAssignment = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_GRADE_ASSIGNMENT,
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

export const saveNewGradeAssignment = (data: any) => {
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
      model.minHourlyIntensity = model.minHourlyIntensity && !isNaN(model.minHourlyIntensity) ? parseFloat(model.minHourlyIntensity) : 0;
      model.maxHourlyIntensity = model.maxHourlyIntensity && !isNaN(model.maxHourlyIntensity) ? parseFloat(model.maxHourlyIntensity) : 0;
      await client
        .mutate({
          mutation: MUTATION_CREATE_GRADE_ASSIGNMENT,
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

export const updateGradeAssignment = (data: any, id: any) => {
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
      model.minHourlyIntensity = model.minHourlyIntensity && !isNaN(model.minHourlyIntensity) ? parseFloat(model.minHourlyIntensity) : 0;
      model.maxHourlyIntensity = model.maxHourlyIntensity && !isNaN(model.maxHourlyIntensity) ? parseFloat(model.maxHourlyIntensity) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_GRADE_ASSIGNMENT,
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

export const changeActiveGradeAssignment = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_GRADE_ASSIGNMENT,
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

export const deleteGradeAssignment = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_GRADE_ASSIGNMENT,
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

export const getDropdownsGradeAssignment = (schoolId:string, academicGradeId:string, schoolYearId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_GRADE_ASSIGNMENT,
          variables:{
            schoolId,
            academicGradeId,
            schoolYearId
          }
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
