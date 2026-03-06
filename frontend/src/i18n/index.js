import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import esTranslations from './locales/es.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import zhTranslations from './locales/zh.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';
import ptTranslations from './locales/pt.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';
import trTranslations from './locales/tr.json';

const resources = {
  en: { translation: enTranslations },
  ru: { translation: ruTranslations },
  es: { translation: esTranslations },
  de: { translation: deTranslations },
  fr: { translation: frTranslations },
  zh: { translation: zhTranslations },
  ar: { translation: arTranslations },
  hi: { translation: hiTranslations },
  pt: { translation: ptTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  tr: { translation: trTranslations },
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
];

export default i18n;
