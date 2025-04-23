import { getCurrentLanguage } from '../../helpers/Utils';
import { CHANGE_LOCALE } from './types/translateTypes';

const INIT_STATE = {
  locale: getCurrentLanguage(),
};

export default (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.payload };
    default:
      return { ...state };
  }
};
