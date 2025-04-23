import { setCurrentLanguage } from '../../helpers/Utils';
import { CHANGE_LOCALE } from '../reducers/types/translateTypes';

export const changeLocale = (locale:any) => {
  setCurrentLanguage(locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
};
