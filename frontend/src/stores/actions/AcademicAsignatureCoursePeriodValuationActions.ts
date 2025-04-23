import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION, MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION } from "../graphql/AcademicAsignatureCoursePeriodValuation/AcademicAsignatureCoursePeriodValuationMutations";

export const saveNewAcademicAsignatureCoursePeriodValuation = (data: any) => {
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
            mutation: MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION,
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
  
  export const updateAcademicAsignatureCoursePeriodValuation = (data: any, id: any) => {
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
            mutation: MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_PERIOD_VALUATION,
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