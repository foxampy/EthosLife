import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../../i18n';

const LanguageSelector = ({ variant = 'header' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = availableLanguages.find(lang => lang.code === i18n.language) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Set direction for RTL languages
    const lang = availableLanguages.find(l => l.code === langCode);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = langCode;
    }
  };

  if (variant === 'burger') {
    return (
      <div className="px-4 py-4 border-t border-stone/20">
        <h3 className="text-xs font-bold text-stone uppercase tracking-wider mb-3 px-2">
          {t('common.language')}
        </h3>
        <div className="space-y-1">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${i18n.language === lang.code
                  ? 'bg-stone text-bone'
                  : 'text-ink hover:bg-sand/50'
                }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto">●</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200"
        title={t('common.selectLanguage')}
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium uppercase">{currentLang.code}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-bone rounded-xl shadow-neu border border-stone/20 py-2 z-50 max-h-80 overflow-y-auto">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-colors text-left
                ${i18n.language === lang.code
                  ? 'bg-stone/10 text-ink'
                  : 'text-ink hover:bg-sand/50'
                }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto text-stone">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
