import { combineReducers } from "redux";
import { RESET_APP } from "./types/loginTypes";
import loginReducer from './loginReducer';
import translateReducer from './translateReducer';
import menuReducer from "./menuReducer";
import chatReducer from "../actions/Chat/ChatReducer";
import surveyDetailReducer from "../actions/Survey/SurveyDetail/SurveyDetailReducer";
import surveyListReducer from "../actions/Survey/SurveyList/SurveyListReducer";

export const appReducer = combineReducers({
    loginReducer,
    translateReducer,
    menuReducer,
    chatReducer,
    surveyDetailReducer,
    surveyListReducer
})

export const rootReducer = (state:any, action: any) =>{
    if(action.type === RESET_APP){
        state = undefined;
    }
    return appReducer(state, action)
}