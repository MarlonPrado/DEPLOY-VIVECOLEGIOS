import { defaultColor, defaultDirection, defaultLocale, localeOptions, themeColorStorageKey, themeRadiusStorageKey } from '../constants/defaultValues';

export const mapOrder = (array: any[], order: string | string[], key: string | number) => {
  array.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
    const A = a[key];
    const B = b[key];
    if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
      return 1;
    }
    return -1;
  });
  return array;
};

export const getDateWithFormat = () => {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; // January is 0!
  let ddS = '';
  let mmS = '';
  const yyyy = today.getFullYear();
  if (dd < 10) {
    ddS = `0${dd}`;
  }
  if (mm < 10) {
    mmS = `0${mm}`;
  }
  return `${ddS}.${mmS}.${yyyy}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

export const getDirection = () => {
  let direction = defaultDirection;

  try {
    if (localStorage.getItem('direction')) {
      const localValue = localStorage.getItem('direction');
      if (localValue === 'rtl' || localValue === 'ltr') {
        direction = localValue;
      }
    }
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : getDirection -> error', error);
    direction = defaultDirection;
  }
  return {
    direction,
    isRtl: direction === 'rtl',
  };
};
export const setDirection = (localValue: string) => {
  let direction = 'ltr';
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue;
  }
  try {
    localStorage.setItem('direction', direction);
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : setDirection -> error', error);
  }
};

export const getCurrentColor = () => {
  let currentColor = defaultColor;
  try {
    if (localStorage.getItem(themeColorStorageKey)) {
      currentColor = localStorage.getItem(themeColorStorageKey);
    }
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : getCurrentColor -> error', error);
    currentColor = defaultColor;
  }
  return currentColor;
};

export const setCurrentColor = (color: string) => {
  try {
    localStorage.setItem(themeColorStorageKey, color);
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : setCurrentColor -> error', error);
  }
};

export const getCurrentRadius = () => {
  let currentRadius = 'rounded';
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      currentRadius = localStorage.getItem(themeRadiusStorageKey);
    }
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : getCurrentRadius -> error', error,);
    currentRadius = 'rounded';
  }
  return currentRadius;
};
export const setCurrentRadius = (radius: string) => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : setCurrentRadius -> error',error,);
  }
};

export const getCurrentLanguage = () => {
  let language;
  try {
    language =
      localStorage.getItem('currentLanguage') &&
        localeOptions.filter(
          (x) => { return x.id === localStorage.getItem('currentLanguage') },
        ).length > 0
        ? localStorage.getItem('currentLanguage')
        : defaultLocale;
  } catch (error) {
    //console.log( '>>>>: src/helpers/Utils.js : getCurrentLanguage -> error',error, );
    language = defaultLocale;
  }
  return language;
};
export const setCurrentLanguage = (locale: string) => {
  try {
    localStorage.setItem('currentLanguage', locale);
  } catch (error) {
    //console.log( '>>>>: src/helpers/Utils.js : setCurrentLanguage -> error',error, );
  }
};

export const getCurrentUser = () => {
  let user;
  try {
    user =
      localStorage.getItem('gogo_current_user') != null
        ? JSON.parse(localStorage.getItem('gogo_current_user'))
        : null;
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js  : getCurrentUser -> error', error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user: any) => {
  try {
    if (user) {
      localStorage.setItem('gogo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gogo_current_user');
    }
  } catch (error) {
    //console.log('>>>>: src/helpers/Utils.js : setCurrentUser -> error', error);
  }
};

export const getInitialsName = (names: any) => {
  let cad = names.split(' ');
  let initials = cad[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += cad[cad.length - 2].substring(0, 1).toUpperCase();
  }
  return initials;
};

