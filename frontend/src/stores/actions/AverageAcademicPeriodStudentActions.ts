import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { QUERY_GET_All_AVERAGE_ACADEMIC_PERIOD_STUDENT, QUERY_GET_All_AVERAGE_ACADEMIC_YEAR_STUDENT } from "../graphql/AverageAcademicPeriodStudent/AverageAcademicPeriodStudentQueries";

export const getAllAverageAcademicPeriodStudent = (academicPeriodId: string, courseId: string) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_All_AVERAGE_ACADEMIC_PERIOD_STUDENT,
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

  export const getAllAverageAcademicYearStudent = (schoolYearId: string, courseId: string) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_All_AVERAGE_ACADEMIC_YEAR_STUDENT,
            variables: {
              schoolYearId, courseId,
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
