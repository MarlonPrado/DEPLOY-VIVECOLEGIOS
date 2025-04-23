import { createIntl, createIntlCache } from 'react-intl';
import enMessages from '../locales/en_US';

const cache = createIntlCache();

const enLang = createIntl(
  {
    locale: 'en',
    defaultLocale: 'en',
    messages: enMessages,
  },
  cache,
);

export default enLang;
