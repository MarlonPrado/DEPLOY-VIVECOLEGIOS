import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { QUERY_GET_ALL_ACADEMIC_GRADE_GRAPHICS } from "../graphql/GraphicsStudentAcademicGrade/GraphicsStudentAcademicGradeQueries";

export const dataGraphicsStudentAcademicGrade = (schoolId:string,  schoolYearId:string,) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_ALL_ACADEMIC_GRADE_GRAPHICS,
            variables: {
              schoolId,
              schoolYearId,
            },
          })
          .then((result: any) => {
            data = result.data.data.edges;
          });
        return data;
      } catch (error) {
        createNotification('error', 'error', '');
        return error;
      }
    };
  };
  