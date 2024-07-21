import i18n, { use } from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguageDetector } from 'i18next-express-middleware';
import { join } from 'path';

use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      loadPath: join(__dirname, '/locales/{{lng}}/{{ns}}.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'ar'],
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie']
    }
  });

export default i18n;
