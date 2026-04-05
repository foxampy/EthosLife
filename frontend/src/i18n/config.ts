/**
 * i18n Configuration - EthosLife
 * Complete internationalization setup with 25 languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import tr from './locales/tr.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import vi from './locales/vi.json';
import th from './locales/th.json';
import id from './locales/id.json';
import uk from './locales/uk.json';
import ro from './locales/ro.json';
import cs from './locales/cs.json';
import el from './locales/el.json';
import he from './locales/he.json';
import sv from './locales/sv.json';
import hu from './locales/hu.json';

// Language configurations
export const languageConfig = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  zh: { name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', rtl: false },
  ro: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', rtl: false },
  cs: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', rtl: false },
  el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', rtl: false },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', rtl: false },
  hu: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', rtl: false },
};

// Resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
  ar: { translation: ar },
  fr: { translation: fr },
  de: { translation: de },
  ja: { translation: ja },
  pt: { translation: pt },
  ru: { translation: ru },
  ko: { translation: ko },
  it: { translation: it },
  tr: { translation: tr },
  nl: { translation: nl },
  pl: { translation: pl },
  vi: { translation: vi },
  th: { translation: th },
  id: { translation: id },
  uk: { translation: uk },
  ro: { translation: ro },
  cs: { translation: cs },
  el: { translation: el },
  he: { translation: he },
  sv: { translation: sv },
  hu: { translation: hu },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('ethoslife-language') || 'en',
    supportedLngs: Object.keys(languageConfig),

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ethoslife-language',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    // RTL support
    initImmediate: false,
  });

// Function to change language with RTL support
export const changeLanguage = (lng: string) => {
  const config = languageConfig[lng as keyof typeof languageConfig];
  if (config) {
    // Set RTL direction
    document.documentElement.dir = config.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Change language
    i18n.changeLanguage(lng);
    
    // Save preference
    localStorage.setItem('ethoslife-language', lng);
    
    return true;
  }
  return false;
};

// Get current language info
export const getCurrentLanguage = () => {
  const lng = i18n.language;
  return languageConfig[lng as keyof typeof languageConfig] || languageConfig.en;
};

// Check if current language is RTL
export const isRTL = () => {
  const lng = i18n.language;
  const config = languageConfig[lng as keyof typeof languageConfig];
  return config?.rtl || false;
};

export default i18n;
