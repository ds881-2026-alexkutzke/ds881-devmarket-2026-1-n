import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    debug: true,
    resources: {
      'pt-BR': {
        translation: ptBR,
      },
      en: {
        translation: en,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;