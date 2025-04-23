// eslint-disable-next-line import/no-cycle
import {
  SURVEY_GET_DETAILS,
  SURVEY_GET_DETAILS_SUCCESS,
  SURVEY_GET_DETAILS_ERROR,
  SURVEY_DELETE_QUESTION,
  SURVEY_SAVE,
} from '../../../reducers/types/aplicationsTypes';

export const getSurveyDetail = () => ({
  type: SURVEY_GET_DETAILS,
});

export const getSurveyDetailSuccess = (items: any) => ({
  type: SURVEY_GET_DETAILS_SUCCESS,
  payload: items,
});

export const getSurveyDetailError = (error: any) => ({
  type: SURVEY_GET_DETAILS_ERROR,
  payload: error,
});

export const deleteSurveyQuestion = (questionId: any, survey: any) => ({
  type: SURVEY_DELETE_QUESTION,
  payload: { questionId, survey },
});

export const saveSurvey = (survey: any) => ({
  type: SURVEY_SAVE,
  payload: survey,
});
