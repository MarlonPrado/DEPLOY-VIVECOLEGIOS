import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_ACADEMIC_ASIGNATURE_COURSE, MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE, MUTATION_DELETE_ACADEMIC_ASIGNATURE_COURSE, MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE, MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_HOURLY_INTENSITY } from '../graphql/AcademicAsignatureCourse/AcademicAsignatureCourseMutations';
import { QUERY_GET_ACADEMIC_ASIGNATURE_COURSE, QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE, QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE_TEACHER, QUERY_GET_COURSES_OF_GRADES, QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE, QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE_TEACHER_LIST } from '../graphql/AcademicAsignatureCourse/AcademicAsignatureCourseQueries';

export const getListAllAcademicAsignatureCourse = (courseId:string, fullAccess: boolean) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE,
          variables:{
            courseId,
            allData: fullAccess ? fullAccess : false,
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

export const getListAllAcademicAsignatureCourseTeacher = (teacherId:string,schoolYearId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE_TEACHER,
          variables:{
            teacherId,
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

export const getListAllAcademicAsignatureCourseByCourse = (campusId:string,courseId: string, fullAccess: boolean) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_ACADEMIC_ASIGNATURE_COURSE,
          variables:{
            courseId,
            allData: fullAccess ? fullAccess : false,
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

export const dataAcademicAsignatureCourse = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_ACADEMIC_ASIGNATURE_COURSE,
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


export const saveNewAcademicAsignatureCourse = (data: any) => {
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
      model.hourlyIntensity = model.hourlyIntensity && !isNaN(model.hourlyIntensity) ? parseFloat(model.hourlyIntensity) : 0;
      await client
        .mutate({
          mutation: MUTATION_CREATE_ACADEMIC_ASIGNATURE_COURSE,
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

export const updateAcademicAsignatureCourse = (data: any, id: any) => {
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
      model.hourlyIntensity = model.hourlyIntensity && !isNaN(model.hourlyIntensity) ? parseFloat(model.hourlyIntensity) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE,
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


export const updateAcademicAsignatureCourseHourltIntensity = (data: any, id: any) => {
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
      model.hourlyIntensity = model.hourlyIntensity && !isNaN(model.hourlyIntensity) ? parseFloat(model.hourlyIntensity) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE_HOURLY_INTENSITY,
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

export const changeActiveAcademicAsignatureCourse = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_ACADEMIC_ASIGNATURE_COURSE,
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

export const deleteAcademicAsignatureCourse = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_ACADEMIC_ASIGNATURE_COURSE,
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

export const getDropdownsAcademicAsignatureCourseTeacherList = (schoolId:string, campusId: string, schoolYearId:string ) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE_TEACHER_LIST,
          variables:{
            schoolId,
            campusId,
            schoolYearId
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

export const getDropdownsAcademicAsignatureCourse = (schoolId:string, campusId: string, courseId: string, schoolYearId:string ) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_ACADEMIC_ASIGNATURE_COURSE,
          variables:{
            schoolId,
            campusId,
            courseId,
            schoolYearId
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

export const getCoursesOfGrade = (academicGradeId:string, campusId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_COURSES_OF_GRADES,
          variables:{
            academicGradeId,
            campusId,
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

export const updateAcademicAsignatureCourseTeacher = (data: any, id: any) => {
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
      model.weight = model.weight && !isNaN(model.weight) ? parseFloat(model.weight) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_ACADEMIC_ASIGNATURE_COURSE,
          variables: { id, input: model },
        })
        .then((dataReponse: any) => {
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};