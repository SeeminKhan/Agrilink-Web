import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    fallbackLng: 'en',
    lng: localStorage.getItem('agrilink_lang') || 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'agrilink_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;

/** Change language and persist */
export const setLanguage = (lang: 'en' | 'hi' | 'mr') => {
  i18n.changeLanguage(lang);
  localStorage.setItem('agrilink_lang', lang);
};

export type SupportedLang = 'en' | 'hi' | 'mr';

export const LANG_OPTIONS: { code: SupportedLang; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी',   flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी',   flag: '🇮🇳' },
];
