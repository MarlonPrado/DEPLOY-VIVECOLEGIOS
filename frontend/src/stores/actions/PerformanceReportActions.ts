import { createNotification } from "../../helpers/Notification";
import { client } from "../graphql";
import { GENERATE_PERFORMANCE_REPORT_COURSE, GENERATE_PERFORMANCE_REPORT_COURSE_2, GENERATE_PERFORMANCE_REPORT_COURSE_3, GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT, GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_2, GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_3 } from "../graphql/PerformanceReport/PerformanceReportMutation";

export const generatePerformanceReportCourse = (id: any, schoolId: any, schoolYearId: any, academicPeriodId: any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE,
            variables: { id, schoolId, schoolYearId, academicPeriodId, format  },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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

  
  export const generatePerformanceReportCourseStudent = (id: any, schoolId: any, schoolYearId: any, academicPeriodId: any,studentId:any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT,
            variables: { id, schoolId, schoolYearId, academicPeriodId, studentId , format },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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

  export const generatePerformanceReportCourse2 = (id: any, schoolId: any, schoolYearId: any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE_2,
            variables: { id, schoolId, schoolYearId, format  },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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

  export const generatePerformanceReportCourseStudent2 = (id: any, schoolId: any, schoolYearId: any, studentId:any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_2,
            variables: { id, schoolId, schoolYearId, studentId , format },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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

  export const generatePerformanceReportCourse3 = (id: any, schoolId: any, schoolYearId: any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE_3,
            variables: { id, schoolId, schoolYearId, format  },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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

  export const generatePerformanceReportCourseStudent3 = (id: any, schoolId: any, schoolYearId: any, studentId:any, format: any, showToast: boolean) => {
    return async (dispatch: any) => {
      try {
        let dataChangeActive = null;
        await client
          .mutate({
            mutation: GENERATE_PERFORMANCE_REPORT_COURSE_STUDENT_3,
            variables: { id, schoolId, schoolYearId, studentId , format },
          })
          .then((dataReponse: any) => {
            if (dataReponse.errors?.length > 0) {
              dataReponse.errors.forEach((error: any) => {
                if (showToast) {
                  createNotification('error', 'error', '');
                }
              });
            } else {
              dataChangeActive = dataReponse.data.generate;
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
  





