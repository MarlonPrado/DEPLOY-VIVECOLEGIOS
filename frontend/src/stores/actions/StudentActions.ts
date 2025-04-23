import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_ASSOCIATE_GUARDIAN, MUTATION_CHANGE_ACTIVE_STUDENT, MUTATION_CREATE_STUDENT, MUTATION_DELETE_STUDENT, MUTATION_UPDATE_STUDENT } from '../graphql/Student/StudentMutations';
import { QUERY_GET_ALL_STUDENT, QUERY_GET_ALL_STUDENT_OF_GRADE, QUERY_GET_ALL_STUDENT_WITHOUT_COURSE, QUERY_GET_COURSES_OF_GRADES, QUERY_GET_DROPDOWNS_STUDENT, QUERY_GET_GUARDIANS_BY_CRITERIA, QUERY_GET_STUDENT } from '../graphql/Student/StudentQueries';

export const getListAllStudent = (campusId:string ,schoolId:string, schoolYearId:string) => {
  let c = campusId ? campusId : null;
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_STUDENT,
          variables:{
            c,
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

export const getListAllStudentWithoutCourse = (campusId: string, academicGradeId:string ,schoolId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_STUDENT_WITHOUT_COURSE,
          variables:{
            academicGradeId,
            schoolId,
            campusId
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

export const getListAllStudentAcademicGrade = (campusId: string, academicGradeId:string ,schoolId:string,schoolYearId:string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_STUDENT_OF_GRADE,
          variables:{
            campusId,
            academicGradeId,
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

export const dataStudent = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_STUDENT,
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

export const saveNewStudent = (data: any) => {
  return async (dispatch: any) => {
    try {
      let model:any = {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataCreate = null;
      //model.code = model.code && !isNaN(model.code) ? parseFloat(model.code) : 0;
      await client
        .mutate({
          mutation: MUTATION_CREATE_STUDENT,
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

export const updateStudent = (data: any, id: any) => {
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
      //model.code = model.code && !isNaN(model.code) ? parseFloat(model.code) : 0;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_STUDENT,
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

export const changeActiveStudent = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_STUDENT,
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

export const deleteStudent = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_STUDENT,
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

export const getDropdownsStudent = (type: string, schoolId:string, schoolYearId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_STUDENT,
          variables:{
            type,
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

export const getCoursesOfGrade = (academicGradeId:string, campusId: string, schoolId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_COURSES_OF_GRADES,
          variables:{
            academicGradeId,
            campusId,
            schoolId
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

export const getGuardianByCriteria = (documentNumber:string, documentTypeId:string, ) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_GUARDIANS_BY_CRITERIA,
          variables:{
            documentTypeId,
            documentNumber
          }
        })
        .then((result: any) => {
          listData = result.data;
          createNotification('success', 'guardiansFound', '');
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const associateGuardian = (data: any, id: any) => {
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
          mutation: MUTATION_ASSOCIATE_GUARDIAN,
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