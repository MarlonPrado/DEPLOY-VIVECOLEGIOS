import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION, MUTATION_CREATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION, MUTATION_DELETE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION, MUTATION_GENERATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION, MUTATION_UPDATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION } from '../graphql/ExperienceLearningCoEvaluationValuation/ExperienceLearningCoEvaluationValuationMutations';
import { QUERY_GET_ALL_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION, QUERY_GET_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION } from '../graphql/ExperienceLearningCoEvaluationValuation/ExperienceLearningCoEvaluationValuationQueries';


export const getListAllExperienceLearningCoEvaluationValuation = (experienceLearningId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
          variables: {
            experienceLearningId,
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

export const dataExperienceLearningCoEvaluationValuation = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
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

export const saveNewExperienceLearningCoEvaluationValuation = (data: any, showToast: boolean) => {
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
      model.assessment = model.assessment && !isNaN(model.assessment) ? parseFloat(model.assessment) : null;
      await client
        .mutate({
          mutation: MUTATION_CREATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
          variables: { input: model },
        })
        .then((dataResponse: any) => {
          if (dataResponse.errors?.length > 0) {
            dataResponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataCreate = dataResponse.data.create.id;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataCreate as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const generateExperienceLearningCoEvaluationValuation = (id: any) => {
  return async (dispatch: any) => {
    try {    
      let dataCreate = null; 
      await client
        .mutate({
          mutation: MUTATION_GENERATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
          variables: { id },
        })
        .then((dataResponse: any) => {
          if (dataResponse.errors?.length > 0) {
            dataResponse.errors.forEach((error: any) => {            
                createNotification('error', 'error', '');
            });
          } else {
            dataCreate = dataResponse.data.create.id;
          }
        });
      return dataCreate as any;
    } catch (error) {
        createNotification('error', 'error', '');
      return error;
    }
  };
};

export const updateExperienceLearningCoEvaluationValuation = (data: any, id: any, showToast: boolean) => {
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
      model.assessment = model.assessment && !isNaN(model.assessment) ? parseFloat(model.assessment) : null;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
          variables: { id, input: model },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataUpdate = dataReponse.data.update.id;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataUpdate as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const changeActiveExperienceLearningCoEvaluationValuation = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
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

export const deleteExperienceLearningCoEvaluationValuation = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_EXPERIENCE_LEARNING_CO_EVALUATION_VALUATION,
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

