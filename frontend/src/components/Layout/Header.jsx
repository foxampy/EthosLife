import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useVersion } from '../../contexts/VersionContext';
import BurgerMenu from './BurgerMenu';
import LanguageSelector from './LanguageSelector';
import { WalletConnectButton } from '../Web3/WalletConnectButton';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { version, toggleVersion, isV2 } = useVersion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVersionMenuOpen, setIsVersionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const versionMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (versionMenuRef.current && !versionMenuRef.current.contains(event.target)) {
        setIsVersionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsVersionMenuOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsVersionMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleVersionSwitch = (newVersion) => {
    if (newVersion !== version) {
      toggleVersion();
    }
    setIsVersionMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { path: '/health/nutrition', label: t('nav.health'), icon: '❤️' },
    { path: '/ai-chat', label: t('nav.aiCoach'), icon: '🤖' },
    { path: '/social', label: t('nav.community'), icon: '👥' },
    { path: '/specialists', label: 'Специалисты', icon: '👨‍⚕️', v2Only: true },
    { path: '/centers', label: 'Центры', icon: '🏥', v2Only: true },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label="EthosLife Home"
            >
              <motion.div
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5c5243] via-[#8c7a6b] to-[#a89880] flex items-center justify-center text-white font-bold text-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                🌱
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-[#2d2418] tracking-tight block">EthosLife</span>
                <span className="text-xs text-[#5c5243] font-medium">Human Operating System</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navItems.filter(item => !item.v2Only || isV2).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg transform scale-105'
                      : 'text-[#5c5243] hover:bg-[#d4ccb8]/70 hover:shadow-md hover:scale-105'
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Section: Version Toggle, Wallet, Search, Notifications, User */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Version Switcher with Dropdown */}
              <div ref={versionMenuRef} className="relative hidden sm:block">
                <motion.button
                  onClick={() => setIsVersionMenuOpen(!isVersionMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${isV2
                      ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-[#e4dfd5] text-[#5c5243] shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.7)]'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isV2 ? (
                    <>
                      <span className="text-lg">⚡</span>
                      <span>V2 Premium</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">📱</span>
                      <span>V1 Classic</span>
                    </>
                  )}
                  <span className={`transform transition-transform duration-300 ${isVersionMenuOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isVersionMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-[#e4dfd5] rounded-2xl shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)] border border-white/40 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-[#c9b8a6]/30">
                        <p className="text-xs font-semibold text-[#5c5243] uppercase tracking-wider">Select Version</p>
                      </div>
                      
                      <button
                        onClick={() => handleVersionSwitch('v2')}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3
                          ${isV2 ? 'bg-gradient-to-r from-[#10b981]/20 to-[#06b6d4]/20' : 'hover:bg-[#d4ccb8]/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                          ${isV2 
                            ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white shadow-lg' 
                            : 'bg-[#d4ccb8] text-[#5c5243]'}`}>
                          ⚡
                        </div>
                        <div>
                          <p className={`font-semibold ${isV2 ? 'text-[#10b981]' : 'text-[#5c5243]'}`}>V2 Premium</p>
                          <p className="text-xs text-[#7a6e5d]">Advanced features, modern UI</p>
                        </div>
                        {isV2 && <span className="ml-auto text-[#10b981]">✓</span>}
                      </button>

                      <button
                        onClick={() => handleVersionSwitch('v1')}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3
                          ${!isV2 ? 'bg-[#d4ccb8]/50' : 'hover:bg-[#d4ccb8]/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                          ${!isV2 
                            ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg' 
                            : 'bg-[#d4ccb8] text-[#5c5243]'}`}>
                          📱
                        </div>
                        <div>
                          <p className={`font-semibold ${!isV2 ? 'text-[#5c5243]' : 'text-[#5c5243]'}`}>V1 Classic</p>
                          <p className="text-xs text-[#7a6e5d]">Simple, familiar interface</p>
                        </div>
                        {!isV2 && <span className="ml-auto text-[#5c5243]">✓</span>}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SAFT/Investor Button */}
              <Link
                to="/saft"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                title="Investor SAFT"
              >
                <span className="text-lg">💎</span>
                <span className="hidden xl:inline">Investor</span>
              </Link>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Search */}
              <div ref={searchRef} className="relative hidden sm:block">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`${t('common.search')}...`}
                      className="w-48 sm:w-64 px-4 py-2.5 rounded-xl bg-[#e4dfd5] border border-[#c9b8a6]/40 text-[#2d2418] placeholder-[#7a6e5d] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 focus:border-transparent shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] text-sm transition-all"
                      autoFocus
                      aria-label={t('common.search')}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 rounded-xl hover:bg-[#d4ccb8] text-[#5c5243]"
                      aria-label={t('common.close')}
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-xl hover:bg-[#d4ccb8] text-[#5c5243] transition-all duration-200 hover:shadow-md"
                    aria-label={t('common.search')}
                  >
                    🔍
                  </button>
                )}
              </div>

              {/* Notifications */}
              <button
                className="relative p-2.5 rounded-xl hover:bg-[#d4ccb8] text-[#5c5243] transition-all duration-200 hover:shadow-md hidden sm:flex"
                aria-label={`${t('nav.notifications')} (${notificationCount})`}
              >
                🔔
                {notificationCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#f43f5e] to-[#ec4899] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </button>

              {/* Wallet Connect */}
              <div className="hidden md:block">
                <WalletConnectButton />
              </div>

              {/* User Menu */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="hidden md:block relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#d4ccb8]/70 transition-all duration-200 hover:shadow-md"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-[#5c5243] max-w-[100px] truncate hidden lg:inline">
                      {user?.fullName || 'User'}
                    </span>
                    <span className={`transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 bg-[#e4dfd5] rounded-2xl shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.7)] border border-white/40 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-[#c9b8a6]/30">
                          <p className="text-sm font-semibold text-[#2d2418]">{user?.fullName || 'User'}</p>
                          <p className="text-xs text-[#7a6e5d] truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 hover:text-[#2d2418] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          👤 {t('nav.profile')}
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2.5 text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 hover:text-[#2d2418] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ⚙️ {t('nav.settings')}
                        </Link>
                        <Link
                          to="/subscriptions"
                          className="block px-4 py-2.5 text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 hover:text-[#2d2418] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          💎 Premium
                        </Link>
                        <hr className="my-2 border-[#c9b8a6]/30" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#f43f5e] hover:bg-[#d4ccb8]/70 transition-colors"
                        >
                          🚪 {t('nav.logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              {/* Burger Button - Mobile */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-[#d4ccb8] text-[#5c5243] transition-all duration-200 hover:shadow-md"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Burger Menu Sidebar */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isActive={isActive}
      />

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2d2418]/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
