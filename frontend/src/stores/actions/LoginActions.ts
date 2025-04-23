import { createNotification } from '../../helpers/Notification';
import { client } from '../graphql';
import { MUTATION_LOGIN, MUTATION_LOGIN_SYNC_OFFLINE, QUERY_GET_LOGIN_COUNT_USER, QUERY_ME } from '../graphql/Login/LoginMutations';
import { LOGIN, ME, RESET_APP } from '../reducers/types/loginTypes';

export const login = (user: any) => {
  return async (dispatch: any) => {
    try {
      let data: any = null;
      await client
        .query({
          query: MUTATION_LOGIN,
          variables: {
            username: user.username,
            password: user.password,
          },
        })
        .then((result: any) => {
          data = result.data;
          if(data !=null){
            localStorage.setItem('token', data.data.jwt);         
            dispatch({
              type: LOGIN,
              payload: {
                userId: data.data.userId,
                entityId: data?.data?.student?.id,
                studentId: data?.data?.student?.id,
                courseId: data?.data?.student && data?.data?.student?.courseId ?data?.data?.student?.courseId :null,
                teacherId: data?.data?.teacher?.id,
                role: data.data.role,
                roleMenus: data.data.roleMenus,
                name: data.data.name,
                lastName: data.data.lastName,
                profilePhoto: data.data.profilePhoto,
                campus: data.data.campus && data.data.campus[0] ? data.data.campus[0].name : "",
                campusMulti: data?.data?.campus,
                school: data.data.schools && data.data.schools[0] ? data.data.schools[0].name : "",
                schoolMulti: data?.data?.schools,
                campusId: data.data.campus && data.data.campus[0] ? data.data.campus[0].id : "",
                schoolId: data.data.schools && data.data.schools[0] ? data.data.schools[0].id : "",
                schoolYear: data.data.schools &&  data.data.schools[0]?.schoolYear[0] ? data.data.schools[0].schoolYear[0]?.id : "",
                schoolYearName: data?.data.schools &&  data.data.schools[0]?.schoolYear[0] ? data.data.schools[0].schoolYear[0]?.schoolYear : "",
                schoolData: data.data.schools && data.data.schools[0] ? data.data.schools[0] : "",
                studentData: data.data.students && data.data.students[0] ? data.data.students[0] : "",
                studentMulti: data?.data?.students,
              },
            });
          }else{
            createNotification('error', 'errorSesion', '');
          }
        });
      return data != null;
    } catch (error) {
      console.log(error)
      createNotification('error', 'errorSesion', '');
      return error;
    }
  };
};

export const logout = () => {
  return async (dispatch: any) => {
    try {
      localStorage.setItem('token', null);
      localStorage.clear();
      dispatch({
        type: RESET_APP,
      });
    } catch (error) {
      return error;
    }
  };
};

export const resetApp = () => {
  return async (dispatch: any) => {
    try {
      localStorage.setItem('token', null);
      localStorage.clear();
      dispatch({
        type: RESET_APP,
      });
    } catch (error) {
      return error;
    }
  };
};

export const me = (schoolYearId:any) => {
  return async (dispatch: any) => {
    try {
      let data: any = {};
      console.log(schoolYearId, "VARIABLES")
      await client
        .query({
          query: QUERY_ME,   
          variables: {
            schoolYearId
          }      
        })
        .then((result: any) => {
          data = result.data;
          if(data !=null){
            dispatch({
              type: ME,
              payload: {
                teacherId: data?.me?.teacher?.id,
                studentId: data?.data?.student?.id,
                courseId: data?.data?.student && data?.data?.student?.courseId ?data?.data?.student?.courseId :null,
                role: data.me.role,
                roleMenus: data.me.roleMenus,
                name: data.me.name,
                lastName: data.me.lastName,
                profilePhoto: data.me.profilePhoto,              
              },
            });  
          }      
        });
      return data;
    } catch (error) {
      console.log(error)
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const changeSchool = (data: any, dataReducer:any) => {
  return async (dispatch: any) => {
    try {
      if(data !=null){
        await dispatch({
          type: LOGIN,
          payload: {
            ...dataReducer,
            school: data.name ? data.name : "",
            schoolId: data.id ? data.id : "",
            schoolYear: data.schoolYear ? data.schoolYear[0]?.id : "",
            schoolYearName: data?.schoolYear ?  data.schoolYear[0]?.schoolYear : "",
            schoolData: data ?  data: "",
          },
        });
      };
      return data != null;
    } catch (error) {
      createNotification('error', 'errorSesion', '');
      return error;
    }
  };
};

export const changeSchoolYear = (data: any, dataReducer:any) => {
  return async (dispatch: any) => {
    try {
      if(data !=null){
        await dispatch({
          type: LOGIN,
          payload: {
            ...dataReducer,
            schoolYear: data.id ? data.id : "",
            schoolYearName: data?.schoolYear ?  data.schoolYear : "",
          },
        });
      };
      return data != null;
    } catch (error) {
      createNotification('error', 'errorSesion', '');
      return error;
    }
  };
};

export const changeStudent = (data: any, dataReducer:any) => {
  return async (dispatch: any) => {
    try {
      if(data !=null){
        await dispatch({
          type: LOGIN,
          payload: {
            ...dataReducer,
            studentData: data ? data : "",
            studentId: data.id ? data.id : "",
          },
        });
      };
      return data != null;
    } catch (error) {
      createNotification('error', 'errorSesion', '');
      return error;
    }
  };
};

export const getLoginUserCount = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_LOGIN_COUNT_USER,
        })
        .then((result: any) => {
          listData = result.data.data.totalCount;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const loginSyncOffline = (user: any) => {
  return async (dispatch: any) => {
    try {
      let data: any = null;
      await client
        .query({
          query: MUTATION_LOGIN_SYNC_OFFLINE,
          variables: {
            username: user.username,
            password: user.password,
          },
        })
        .then((result: any) => {
          data = result.data;
          if(data !=null){
            
          }else{
            createNotification('error', 'errorSesion', '');
          }
        });
      return data != null;
    } catch (error) {
      console.log(error)
      createNotification('error', 'errorSesion', '');
      return error;
    }
  };
};