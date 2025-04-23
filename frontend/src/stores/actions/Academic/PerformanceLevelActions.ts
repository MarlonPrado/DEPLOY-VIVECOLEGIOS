import { createNotification } from "../../../helpers/Notification";
import { client } from '../../graphql';
import { MUTATION_CHANGE_ACTIVE_PERFORMANCE_LEVEL, MUTATION_CREATE_PERFORMANCE_LEVEL, MUTATION_DELETE_PERFORMANCE_LEVEL, MUTATION_UPDATE_PERFORMANCE_LEVEL } from '../../graphql/Academic/PerformanceLevel/PerformanceLevelMutations';
import { QUERY_GET_ALL_PERFORMANCE_LEVEL, QUERY_GET_ALL_PERFORMANCE_LEVEL_ASIGNATURE_COURSE, QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE, QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE_FINAL, QUERY_GET_DROPDOWNS_PERFORMANCE_LEVEL, QUERY_GET_PERFORMANCE_LEVEL, QUERY_GET_PERFORMANCE_LEVEL_TYPE } from '../../graphql/Academic/PerformanceLevel/PerformanceLevelQueries';

export const getListAllPerformanceLevel = (schoolId:string, schoolYearId:string, fullAccess: boolean) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_PERFORMANCE_LEVEL,
          variables:{
            schoolId,
            schoolYearId,
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

export const getListAllPerformanceLevelAsignatureCourse = (academicAsignatureCourseId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_PERFORMANCE_LEVEL_ASIGNATURE_COURSE,
          variables:{
            academicAsignatureCourseId
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

export const getListAllPerformanceLevelCourse = (courseId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE,
          variables:{
            courseId
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

export const getListAllPerformanceLevelCourseFinal = (courseId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_PERFORMANCE_LEVEL_COURSE_FINAL,
          variables:{
            courseId
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


export const dataPerformanceLevel = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_PERFORMANCE_LEVEL,
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

export const saveNewPerformanceLevel = (data: any) => {
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
      model.minimumScore = model.minimumScore && !isNaN(model.minimumScore) ? parseFloat(model.minimumScore) : 0;
      model.topScore = model.topScore && !isNaN(model.topScore) ? parseFloat(model.topScore) : 0;
      await client
        .mutate({
          mutation: MUTATION_CREATE_PERFORMANCE_LEVEL,
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

export const updatePerformanceLevel = (data: any, id: any) => {
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
      model.minimumScore = model.minimumScore && !isNaN(model.minimumScore) ? parseFloat(model.minimumScore) : 0;
      model.topScore = model.topScore && !isNaN(model.topScore) ? parseFloat(model.topScore) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_PERFORMANCE_LEVEL,
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

export const changeActivePerformanceLevel = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_PERFORMANCE_LEVEL,
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

export const deletePerformanceLevel = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_PERFORMANCE_LEVEL,
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

export const getDropdownsPerformanceLevel = (schoolId: string, schoolYearId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_PERFORMANCE_LEVEL,
          variables:{
            schoolId,
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

export const getPerformanceLevelTypes = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_PERFORMANCE_LEVEL_TYPE,
        })
        .then((result: any) => {
          listData = result.data.__type.enumValues;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};