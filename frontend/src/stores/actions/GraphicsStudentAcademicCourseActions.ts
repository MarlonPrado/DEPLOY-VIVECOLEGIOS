import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { QUERY_GET_ALL_ACADEMIC_COURSE_GRAPHICS, QUERY_GET_DROPDOWNS_GRAPHICS_STUDENT_ACADEMIC_COURSE } from "../graphql/GraphicsStudentAcademicCourse/GraphicsStudentAcademicCourseQueries";

export const dataGraphicsStudentAcademicCourse = (id: any, academicGradeId: any) => {
    return async (dispatch: any) => {
      try {
        let data = {};
        await client
          .query({
            query: QUERY_GET_ALL_ACADEMIC_COURSE_GRAPHICS,
            variables: {
              id,
              academicGradeId,
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
  
  export const getDropdownsGraphicsStudentAcademicCourse= (schoolId:string,  schoolYearId:string,) => {
    return async (dispatch: any) => {
      try {
        let listData = {};
        await client
          .query({
            query: QUERY_GET_DROPDOWNS_GRAPHICS_STUDENT_ACADEMIC_COURSE,
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