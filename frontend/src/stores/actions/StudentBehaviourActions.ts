import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CREATE_PERIOD_STUDENT_BEHAVIOUR, MUTATION_CREATE_STUDENT_BEHAVIOUR, MUTATION_DELETE_STUDENT_BEHAVIOUR, MUTATION_UPDATE_STUDENT_BEHAVIOUR } from '../graphql/StudentBehaviour/StudentBehaviourMutations';
import { QUERY_GET_All_STUDENT_BEHAVIOUR } from '../graphql/StudentBehaviour/StudentBehaviourQueries';

export const getAllStudentBehaviour = (academicPeriodId: string, courseId: string) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_All_STUDENT_BEHAVIOUR,
            variables: {
              academicPeriodId, courseId,
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

  
export const saveNewStudentBehaviour = (data: any) => {
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
            mutation: MUTATION_CREATE_STUDENT_BEHAVIOUR,
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

  
  export const updateStudentBehaviour = (data: any, id: any, showToast: boolean) => {
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
            mutation: MUTATION_UPDATE_STUDENT_BEHAVIOUR,
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

  export const updateStudentBehaviourObservation = (data: any, id: any, showToast: boolean) => {
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
        await client
          .mutate({
            mutation: MUTATION_UPDATE_STUDENT_BEHAVIOUR,
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


  export const deleteStudentBehaviour = (id: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataDelete = null;
        await client
          .mutate({
            mutation: MUTATION_DELETE_STUDENT_BEHAVIOUR,
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


  export const createPeriodStudentBehaviour = (academicPeriodId: any, courseId:any) => {
    return async (dispatch: any) => {
      try {    
        let dataCreate = null; 
        await client
          .mutate({
            mutation: MUTATION_CREATE_PERIOD_STUDENT_BEHAVIOUR,
            variables: { academicPeriodId, courseId },
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
  