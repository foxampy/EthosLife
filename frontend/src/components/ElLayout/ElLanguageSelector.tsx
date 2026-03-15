/**
 * ElLanguageSelector - Enhanced Language Selector
 * EthosLife Design System
 * 
 * Features:
 * - 20+ languages support
 * - Neumorphic dropdown
 * - Flag display
 * - Search/filter
 * - Recent languages
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// LANGUAGE CONFIGURATION
// ============================================

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
];

// ============================================
// TYPES
// ============================================

export interface ElLanguageSelectorProps {
  variant?: 'dropdown' | 'minimal' | 'flags';
  showSearch?: boolean;
  showFlags?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const ElLanguageSelector: React.FC<ElLanguageSelectorProps> = ({
  variant = 'dropdown',
  showSearch = true,
  showFlags = true,
  className,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load recent languages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLanguages');
    if (saved) {
      setRecentLanguages(JSON.parse(saved));
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language.code);
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
    
    // Update recent languages
    const newRecent = [language.code, ...recentLanguages.filter(l => l !== language.code)].slice(0, 3);
    setRecentLanguages(newRecent);
    localStorage.setItem('recentLanguages', JSON.stringify(newRecent));
    
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get recent language objects
  const recentLanguageObjects = recentLanguages
    .map(code => languages.find(l => l.code === code))
    .filter(Boolean) as Language[];

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-[var(--bone-200)]',
          'shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)]',
          'hover:shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.55)]',
          'text-[var(--text-secondary)] font-medium text-sm',
          'transition-all duration-200',
          className
        )}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="uppercase">{currentLanguage.code}</span>
      </button>
    );
  }

  if (variant === 'flags') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {languages.slice(0, 10).map((language) => (
          <motion.button
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
              'bg-[var(--bone-200)]',
              currentLanguage.code === language.code
                ? 'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] ring-2 ring-[var(--neon-cyan)]'
                : 'shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.55)]'
            )}
            title={language.name}
          >
            {language.flag}
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-2xl',
          'bg-[var(--bone-200)]',
          'shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)]',
          'hover:shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.55)]',
          'active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
          'text-[var(--text-primary)] font-medium',
          'transition-all duration-200',
          isOpen && 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
        )}
      >
        {showFlags && <span className="text-xl">{currentLanguage.flag}</span>}
        <span className="hidden sm:block">{currentLanguage.nativeName}</span>
        <ChevronDown className={cn('w-4 h-4 text-[var(--text-tertiary)] transition-transform', isOpen && 'rotate-180')} />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute right-0 mt-2 w-80 rounded-2xl z-50',
              'bg-[var(--bone-200)]',
              'shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)]',
              'overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--bone-400)]/30">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="font-semibold text-[var(--text-primary)]">Select Language</span>
              </div>
              
              {/* Search */}
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search languages..."
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-xl',
                      'bg-[var(--bone-300)]',
                      'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
                      'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/30'
                    )}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Recent Languages */}
            {recentLanguageObjects.length > 0 && !searchQuery && (
              <div className="p-2 border-b border-[var(--bone-400)]/30">
                <div className="px-3 py-1 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Recent
                </div>
                {recentLanguageObjects.map((language) => (
                  <LanguageItem
                    key={language.code}
                    language={language}
                    isActive={currentLanguage.code === language.code}
                    onClick={() => handleLanguageChange(language)}
                  />
                ))}
              </div>
            )}

            {/* Language List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {!searchQuery && (
                <div className="px-3 py-1 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  All Languages
                </div>
              )}
              {filteredLanguages.map((language) => (
                <LanguageItem
                  key={language.code}
                  language={language}
                  isActive={currentLanguage.code === language.code}
                  onClick={() => handleLanguageChange(language)}
                />
              ))}
              {filteredLanguages.length === 0 && (
                <div className="px-3 py-4 text-center text-[var(--text-tertiary)]">
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// LANGUAGE ITEM COMPONENT
// ============================================

interface LanguageItemProps {
  language: Language;
  isActive: boolean;
  onClick: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ language, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
        isActive
          ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]'
          : 'hover:bg-[var(--bone-300)] text-[var(--text-primary)]'
      )}
    >
      <span className="text-2xl">{language.flag}</span>
      <div className="flex-1 text-left">
        <div className="font-medium text-sm">{language.nativeName}</div>
        <div className="text-xs text-[var(--text-tertiary)]">{language.name}</div>
      </div>
      {isActive && <Check className="w-4 h-4 text-[var(--neon-cyan)]" />}
    </motion.button>
  );
};

export default ElLanguageSelector;
