import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./src/lang";

const resources = {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  //language to use if translations in user language are not available
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;