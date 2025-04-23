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

const INIT_STATE: any = {
  allSurveyItems: null,
  surveyItems: null,
  error: '',
  filter: null,
  searchKeyword: '',
  orderColumn: null,
  loading: false,
  labels: [
    { label: 'INICIAL', color: 'secondary' },
    { label: 'MEDIO', color: 'primary' },
    { label: 'AVANZADO', color: 'info' },
  ],
  orderColumns: [
    { column: 'title', label: 'Title' },
    { column: 'category', label: 'Category' },
    { column: 'status', label: 'Status' },
    { column: 'label', label: 'Label' },
  ],
  categories: ['Diagnóstica', 'Formativa', 'Intermedia'],
  selectedItems: [],
};

export default (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case SURVEY_LIST_GET_LIST:
      return { ...state, loading: false };

    case SURVEY_LIST_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allSurveyItems: action.payload,
        surveyItems: action.payload,
      };

    case SURVEY_LIST_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case SURVEY_LIST_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loading: true,
          surveyItems: state.allSurveyItems,
          filter: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const filteredItems = state.allSurveyItems.filter(
        (item: any) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        surveyItems: filteredItems,
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case SURVEY_LIST_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loading: true,
          surveyItems: state.surveyItems,
          orderColumn: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const sortedItems = state.surveyItems.sort((a: any, b: any) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        surveyItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x: any) => x.column === action.payload
        ),
      };

    case SURVEY_LIST_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, surveyItems: state.allSurveyItems };
      }
      // eslint-disable-next-line no-case-declarations
      const keyword = action.payload.toLowerCase();
      // eslint-disable-next-line no-case-declarations
      const searchItems = state.allSurveyItems.filter(
        (item: any) =>
          item.title.toLowerCase().indexOf(keyword) > -1 ||
          item.detail.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.category.toLowerCase().indexOf(keyword) > -1 ||
          item.label.toLowerCase().indexOf(keyword) > -1
      );
      return {
        ...state,
        loading: true,
        surveyItems: searchItems,
        searchKeyword: action.payload,
      };

    case SURVEY_LIST_ADD_ITEM:
      return { ...state, loading: false };

    case SURVEY_LIST_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allSurveyItems: action.payload,
        surveyItems: action.payload,
      };

    case SURVEY_LIST_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case SURVEY_LIST_SELECTED_ITEMS_CHANGE:
      return { ...state, loading: true, selectedItems: action.payload };
    default:
      return { ...state };
  }
};
