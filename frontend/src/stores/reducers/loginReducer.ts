/* eslint-disable @typescript-eslint/default-param-last */
import { LOGIN, LOGOUT, ME } from './types/loginTypes';

const INITIAL_STATE = {
  userId: '',
  entityId: '',
  studentId: '',
  courseId: '',
  teacherId: '',
  schoolYear: '',
  schoolYearName: '',
  role: {},
  roleMenus: {},
  name: '',
  lastName: '',
  profilePhoto: '',
  campus: '',
  campusId: '',
  school: '',
  schoolId: '',
  campusMulti: {},
  schoolMulti: {},
  schoolData: {},
  studentData: {},
  studentMulti: {},
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userId: action.payload.userId,
        entityId: action.payload.entityId,
        studentId: action.payload.studentId,
        courseId: action.payload.courseId,
        teacherId: action.payload.teacherId,
        schoolYear: action.payload.schoolYear,
        role: action.payload.role,
        roleMenus: action.payload.roleMenus,
        name: action.payload.name,
        lastName: action.payload.lastName,
        profilePhoto: action.payload.profilePhoto,
        campus: action.payload.campus,
        campusMulti: action.payload.campusMulti,
        campusId: action.payload.campusId,
        school: action.payload.school,
        schoolMulti: action.payload.schoolMulti,
        schoolId: action.payload.schoolId,
        schoolYearName: action.payload.schoolYearName,
        schoolData: action.payload.schoolData,
        studentData: action.payload.studentData,
        studentMulti: action.payload.studentMulti,
      };
    case ME:
      return {
        ...state,   
        name: action.payload.name,
        lastName: action.payload.lastName,
        teacherId: action.payload.teacherId, 
        role: action.payload.role,  
        roleMenus: action.payload.roleMenus,  
        profilePhoto: action.payload.profilePhoto,      
      };
    case LOGOUT:
      return {
        ...state,
        userId: '',
        entityId: '',
        studentId: '',
        courseId: '',
        teacherId: '',
        schoolYear: '',
        role: {},
        roleMenus : [],
        name: '',
        lastName: '',
        profilePhoto: '',
        campus: '',
        campusMulti: [],
        campusId: '',
        school: '',
        schoolMulti: [],
        schoolId: '',       
        schoolYearName: '',
        schoolData:  {}, 
        studentData:  {}, 
        studentMulti:  {}, 
      };
    default:
      return state;
  }
};