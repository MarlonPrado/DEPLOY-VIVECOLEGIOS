import { createIntl, createIntlCache } from 'react-intl';
import esMessages from '../locales/es_ES';

const cache = createIntlCache();

const esLang = createIntl(
  {
    locale: 'es',
    defaultLocale: 'es',
    messages: esMessages,
  },
  cache,
);

export default esLang;
