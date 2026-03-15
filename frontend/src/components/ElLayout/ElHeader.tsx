/**
 * ElHeader - Unified Header Component
 * EthosLife Design System
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Version toggle (V1/V2)
 * - Language selector
 * - Wallet connection
 * - Notifications
 * - User menu
 * - Neumorphic styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  Smartphone,
  Diamond,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useVersion } from '../../contexts/VersionContext';
import { ElLanguageSelector } from './ElLanguageSelector';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// NAVIGATION ITEMS
// ============================================
const navItems = [
  { path: '/dashboard', label: 'nav.dashboard', icon: '⌘', requiresAuth: true },
  { path: '/health', label: 'nav.health', icon: '⚕', requiresAuth: true },
  { path: '/social', label: 'nav.social', icon: '👥', requiresAuth: true },
  { path: '/ai-chat', label: 'nav.aiCoach', icon: '🤖', requiresAuth: true },
  { path: '/wallet', label: 'nav.wallet', icon: '💎', requiresAuth: true, v2Only: true },
  { path: '/specialists', label: 'nav.specialists', icon: '👨‍⚕️', requiresAuth: true, v2Only: true },
];

const landingNavItems = [
  { path: '/features', label: 'nav.features' },
  { path: '/pricing', label: 'nav.pricing' },
  { path: '/roadmap', label: 'nav.roadmap' },
  { path: '/team', label: 'nav.team' },
  { path: '/faq', label: 'nav.faq' },
];

// ============================================
// COMPONENT
// ============================================

export const ElHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { version, toggleVersion, isV2 } = useVersion();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVersionMenuOpen, setIsVersionMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (versionMenuRef.current && !versionMenuRef.current.contains(event.target as Node)) {
        setIsVersionMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsVersionMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Mock user - replace with actual auth
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'AJ',
    level: 12,
    xp: 3450,
  };

  const isAuthenticated = true; // Replace with actual auth check
  const isLandingPage = location.pathname === '/' || 
    landingNavItems.some(item => location.pathname === item.path);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isLandingPage
            ? 'bg-[var(--bone-200)]/90 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className={cn(
                  'w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-white font-bold text-xl',
                  'bg-gradient-to-br from-[var(--stone-600)] via-[var(--stone-500)] to-[var(--stone-400)]',
                  'shadow-[4px_4px_8px_rgba(44,40,34,0.2),-4px_-4px_8px_rgba(255,255,255,0.5)]'
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                🌱
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg lg:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  EthosLife
                </span>
                <span className="block text-[10px] text-[var(--text-tertiary)] -mt-1">
                  {t('app.tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {isAuthenticated ? (
                // Authenticated nav
                navItems
                  .filter(item => !item.v2Only || isV2)
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        'flex items-center gap-2',
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-md'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bone-300)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </Link>
                  ))
              ) : (
                // Landing page nav
                landingNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive(item.path)
                        ? 'text-[var(--neon-cyan)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))
              )}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Version Toggle */}
              {isAuthenticated && (
                <div ref={versionMenuRef} className="relative hidden md:block">
                  <motion.button
                    onClick={() => setIsVersionMenuOpen(!isVersionMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                      isV2
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-[var(--bone-300)] text-[var(--text-secondary)] shadow-[2px_2px_4px_rgba(44,40,34,0.08),-2px_-2px_4px_rgba(255,255,255,0.6)]'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isV2 ? <Zap className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    <span className="hidden xl:inline">{isV2 ? 'V2 Premium' : 'V1 Classic'}</span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform', isVersionMenuOpen && 'rotate-180')} />
                  </motion.button>

                  {/* Version Dropdown */}
                  <AnimatePresence>
                    {isVersionMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          'absolute right-0 mt-2 w-64 rounded-2xl z-50',
                          'bg-[var(--bone-200)]',
                          'shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
                          'overflow-hidden'
                        )}
                      >
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => {
                              if (!isV2) toggleVersion();
                              setIsVersionMenuOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                              isV2 ? 'bg-emerald-500/10' : 'hover:bg-[var(--bone-300)]'
                            )}
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
                              <Zap className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <div className={cn('font-semibold', isV2 ? 'text-emerald-600' : 'text-[var(--text-primary)]')}>
                                V2 Premium
                              </div>
                              <div className="text-xs text-[var(--text-tertiary)]">Advanced features, modern UI</div>
                            </div>
                            {isV2 && <Check className="w-5 h-5 text-emerald-500 ml-auto" />}
                          </button>

                          <button
                            onClick={() => {
                              if (isV2) toggleVersion();
                              setIsVersionMenuOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                              !isV2 ? 'bg-[var(--stone-600)]/10' : 'hover:bg-[var(--bone-300)]'
                            )}
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] flex items-center justify-center text-white">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <div className={cn('font-semibold', !isV2 ? 'text-[var(--stone-600)]' : 'text-[var(--text-primary)]')}>
                                V1 Classic
                              </div>
                              <div className="text-xs text-[var(--text-tertiary)]">Simple, familiar interface</div>
                            </div>
                            {!isV2 && <Check className="w-5 h-5 text-[var(--stone-600)] ml-auto" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* SAFT Button */}
              <Link
                to="/saft"
                className={cn(
                  'hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold',
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                  'shadow-lg hover:shadow-xl transition-all'
                )}
              >
                <Diamond className="w-4 h-4" />
                <span>Invest</span>
              </Link>

              {/* Language Selector */}
              <div className="hidden md:block">
                <ElLanguageSelector variant="minimal" />
              </div>

              {/* Search */}
              {isAuthenticated && (
                <div ref={searchRef} className="relative hidden sm:block">
                  {isSearchOpen ? (
                    <form onSubmit={handleSearch} className="flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('common.search')}
                        className={cn(
                          'w-48 lg:w-64 px-4 py-2 rounded-xl text-sm',
                          'bg-[var(--bone-300)]',
                          'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
                          'focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/30'
                        )}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="ml-2 p-2 rounded-xl hover:bg-[var(--bone-300)] text-[var(--text-secondary)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className={cn(
                        'p-2.5 rounded-xl transition-all',
                        'text-[var(--text-secondary)]',
                        'hover:bg-[var(--bone-300)]'
                      )}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Notifications */}
              {isAuthenticated && (
                <button className={cn(
                  'relative p-2.5 rounded-xl transition-all',
                  'text-[var(--text-secondary)]',
                  'hover:bg-[var(--bone-300)]'
                )}>
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all',
                      'hover:bg-[var(--bone-300)]',
                      isUserMenuOpen && 'bg-[var(--bone-300)]'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm',
                      'bg-gradient-to-br from-[var(--stone-600)] to-[var(--stone-500)]',
                      'shadow-md'
                    )}>
                      {user.avatar}
                    </div>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-[var(--text-tertiary)] transition-transform hidden sm:block',
                      isUserMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          'absolute right-0 mt-2 w-64 rounded-2xl z-50',
                          'bg-[var(--bone-200)]',
                          'shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
                          'overflow-hidden'
                        )}
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-[var(--bone-400)]/30">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--stone-600)] to-[var(--stone-500)] flex items-center justify-center text-white font-bold">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-[var(--text-primary)]">{user.name}</div>
                              <div className="text-xs text-[var(--text-tertiary)]">{user.email}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]">
                                  Lvl {user.level}
                                </span>
                                <span className="text-xs text-[var(--text-tertiary)]">{user.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--bone-300)] transition-colors text-[var(--text-primary)]"
                          >
                            <User className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>{t('nav.profile')}</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--bone-300)] transition-colors text-[var(--text-primary)]"
                          >
                            <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span>{t('nav.settings')}</span>
                          </Link>
                          <button
                            onClick={() => navigate('/login')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors text-red-500"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t('nav.logout')}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-bold',
                      'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white',
                      'shadow-lg hover:shadow-xl transition-all'
                    )}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2.5 rounded-xl transition-all',
                  'text-[var(--text-secondary)]',
                  'hover:bg-[var(--bone-300)]'
                )}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className={cn(
              'fixed inset-0 z-40 lg:hidden',
              'bg-[var(--bone-200)]',
              'pt-20 px-4 pb-4'
            )}
          >
            {/* Mobile Language Selector */}
            <div className="mb-4">
              <ElLanguageSelector variant="flags" />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {isAuthenticated ? (
                navItems
                  .filter(item => !item.v2Only || isV2)
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all',
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-md'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bone-300)]'
                      )}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </Link>
                  ))
              ) : (
                landingNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-lg font-medium transition-all',
                      isActive(item.path)
                        ? 'text-[var(--neon-cyan)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bone-300)]'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))
              )}
            </nav>

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="mt-6 space-y-3">
                <Link
                  to="/login"
                  className={cn(
                    'block w-full text-center px-4 py-3 rounded-xl',
                    'border-2 border-[var(--stone-600)] text-[var(--stone-600)]',
                    'font-semibold'
                  )}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    'block w-full text-center px-4 py-3 rounded-xl',
                    'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white',
                    'font-bold shadow-lg'
                  )}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ElHeader;
