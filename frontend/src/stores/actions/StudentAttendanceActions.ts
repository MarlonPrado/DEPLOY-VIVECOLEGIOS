
import { client } from '../graphql';
import { createNotification } from "../../helpers/Notification";
import { QUERY_GET_All_STUDENT_ATTENDANCE } from '../graphql/StudentAttendance/StudentAttendanceQueries';
import { MUTATION_CREATE_STUDENT_ATTENDANCE, MUTATION_DELETE_STUDENT_ATTENDANCE } from '../graphql/StudentAttendance/StudentAttendanceMutations';

export const getAllStudentAttendance = (academicPeriodId: string, academicAsignatureCourseId: string) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_All_STUDENT_ATTENDANCE,
            variables: {
              academicPeriodId, academicAsignatureCourseId,
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

  
export const saveNewStudentAttendance = (data: any) => {
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
            mutation: MUTATION_CREATE_STUDENT_ATTENDANCE,
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

  export const deleteStudentAttendance = (id: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataDelete = null;
        await client
          .mutate({
            mutation: MUTATION_DELETE_STUDENT_ATTENDANCE,
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