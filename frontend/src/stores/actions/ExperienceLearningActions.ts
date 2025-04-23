import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING, MUTATION_CREATE_EXPERIENCE_LEARNING, MUTATION_DELETE_EXPERIENCE_LEARNING, MUTATION_UPDATE_EXPERIENCE_LEARNING } from '../graphql/ExperienceLearning/ExperienceLearningMutations';
import { QUERY_GET_ACADEMIC_PERIODS_EXPERIENCE_LEARNING, QUERY_GET_ALL_EXPERIENCE_LEARNING, QUERY_GET_ALL_EXPERIENCE_LEARNING_ASIGNATURE_COURSE, QUERY_GET_ALL_EXPERIENCE_LEARNING_ASIGNATURE_COURSE_WHITOUT_CAMPUSID, QUERY_GET_ALL_EXPERIENCE_LEARNING_TYPE, QUERY_GET_ALL_EXPERIENCE_RECOVERY_PLAN_TYPE, QUERY_GET_ALL_EXPERIENCE_TYPE, QUERY_GET_ALL_NAVIGATION_METHOD_QUESTION_TEST_ONLINE, QUERY_GET_DROPDOWNS_EXPERIENCE_LEARNING, QUERY_GET_EXPERIENCE_LEARNING } from '../graphql/ExperienceLearning/ExperienceLearningQueries';

export const getListAllExperienceLearning = (campusId:string, academicAsignatureCourseId : string, academicPeriodId: string, experienceLearningType:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING,
          variables:{
            campusId,
            academicAsignatureCourseId,
            academicPeriodId,
            experienceLearningType,
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

export const getAllExperienceLearningWhitoutCampusId = (academicAsignatureCourseId : string, academicPeriodId: string, experienceLearningType:string)  => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING_ASIGNATURE_COURSE_WHITOUT_CAMPUSID,
          variables:{
            academicAsignatureCourseId,
            academicPeriodId,
            experienceLearningType,
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

export const getAllExperienceLearningAcademicAsignatureCourse = (id : string, academicPeriodId: string, evaluativeComponentId: string, experienceLearningType:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING_ASIGNATURE_COURSE,
          variables:{
            id,
            academicPeriodId,
            evaluativeComponentId,
            experienceLearningType,
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

export const dataExperienceLearning = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_EXPERIENCE_LEARNING,
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

export const saveNewExperienceLearning = (data: any) => {
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
          mutation: MUTATION_CREATE_EXPERIENCE_LEARNING,
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

export const updateExperienceLearning = (data: any, id: any) => {
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
          mutation: MUTATION_UPDATE_EXPERIENCE_LEARNING,
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

export const changeActiveExperienceLearning = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING,
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

export const deleteExperienceLearning = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_EXPERIENCE_LEARNING,
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

export const getDropdownsExperienceLearning = (schoolId: string, academicAsignatureId: string, academicGradeId: string, schoolYearId: string, academicAsignatureCourseId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_EXPERIENCE_LEARNING,
          variables:{
            schoolId,
            academicAsignatureId,
            academicGradeId,
            schoolYearId,
            academicAsignatureCourseId
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

export const getAcademicPeriodsExperienceLearning = (schoolId: string, schoolYearId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ACADEMIC_PERIODS_EXPERIENCE_LEARNING,
          variables:{
            schoolId,
            schoolYearId
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

export const getExperienceType = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_TYPE,
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

export const getExperienceLearningType = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING_TYPE,
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

export const getExperienceRecoveryPlanType = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_RECOVERY_PLAN_TYPE,
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

export const getNavigationMethodTestOnline = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_NAVIGATION_METHOD_QUESTION_TEST_ONLINE,
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
