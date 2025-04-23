// eslint-disable-next-line import/no-cycle
import {
  SURVEY_LIST_GET_LIST,
  SURVEY_LIST_GET_LIST_SUCCESS,
  SURVEY_LIST_GET_LIST_ERROR,
  SURVEY_LIST_GET_LIST_WITH_FILTER,
  SURVEY_LIST_GET_LIST_WITH_ORDER,
  SURVEY_LIST_GET_LIST_SEARCH,
  SURVEY_LIST_ADD_ITEM,
  SURVEY_LIST_ADD_ITEM_SUCCESS,
  SURVEY_LIST_ADD_ITEM_ERROR,
  SURVEY_LIST_SELECTED_ITEMS_CHANGE,
} from '../../../reducers/types/aplicationsTypes';

export const getSurveyList = () => ({
  type: SURVEY_LIST_GET_LIST,
});

export const getSurveyListSuccess = (items: any) => ({
  type: SURVEY_LIST_GET_LIST_SUCCESS,
  payload: items,
});

export const getSurveyListError = (error: any) => ({
  type: SURVEY_LIST_GET_LIST_ERROR,
  payload: error,
});

export const getSurveyListWithFilter = (column: any, value: any) => ({
  type: SURVEY_LIST_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getSurveyListWithOrder = (column: any) => ({
  type: SURVEY_LIST_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getSurveyListSearch = (keyword: any) => ({
  type: SURVEY_LIST_GET_LIST_SEARCH,
  payload: keyword,
});

export const addSurveyItem = (item: any) => ({
  type: SURVEY_LIST_ADD_ITEM,
  payload: item,
});

export const addSurveyItemSuccess = (items: any) => ({
  type: SURVEY_LIST_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addSurveyItemError = (error: any) => ({
  type: SURVEY_LIST_ADD_ITEM_ERROR,
  payload: error,
});

export const selectedSurveyItemsChange = (selectedItems: any) => ({
  type: SURVEY_LIST_SELECTED_ITEMS_CHANGE,
  payload: selectedItems,
});
