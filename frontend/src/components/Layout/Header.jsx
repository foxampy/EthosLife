import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import BurgerMenu from './BurgerMenu';
import LanguageSelector from './LanguageSelector';
import { WalletConnectButton } from '../Web3/WalletConnectButton';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие меню при навигации
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
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

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { path: '/health', label: t('nav.health'), icon: '❤️' },
    { path: '/ai-chat', label: t('nav.aiCoach'), icon: '🤖' },
    { path: '/social', label: t('nav.community'), icon: '👥' },
    { path: '/profile', label: t('nav.profile'), icon: '👤' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-bone/90 backdrop-blur-md border-b border-stone/20 shadow-neu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="EthosLife Home"
            >
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">🌱</span>
              <span className="text-xl font-bold text-ink tracking-tight hidden sm:inline">EthosLife</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1
                    ${isActive(item.path)
                      ? 'bg-stone text-bone shadow-md transform scale-105'
                      : 'text-ink hover:text-ink-light hover:bg-sand/50 hover:shadow-sm'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* V2 & Investor Demo Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                to="/v2"
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200
                  ${location.pathname === '/v2' || location.pathname.startsWith('/v2/')
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 hover:shadow-sm'
                  }`}
                title={t('nav.v2')}
              >
                <span>✨</span>
                <span>V2</span>
              </Link>
              
              <Link
                to="/saft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:shadow-sm transition-all duration-200"
                title={t('nav.investorDemo')}
              >
                <span>💎</span>
                <span className="hidden xl:inline">{t('nav.investorDemo')}</span>
                <span className="xl:hidden">{t('nav.buyTokens')}</span>
              </Link>

              {/* Wallet Connect */}
              <WalletConnectButton />
            </div>

            {/* Right Section: Language, Search, Notifications, User, Burger */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              
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
                      placeholder={t('common.search') + "..."}
                      className="w-48 sm:w-64 px-4 py-2 rounded-xl bg-bone border border-stone/30 text-ink placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-stone/50 focus:border-transparent shadow-neu-inset text-sm"
                      autoFocus
                      aria-label={t('common.search')}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 rounded-xl hover:bg-sand/50 text-stone"
                      aria-label={t('common.close')}
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm"
                    aria-label={t('common.search')}
                  >
                    🔍
                  </button>
                )}
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm hidden sm:flex"
                aria-label={`${t('nav.notifications')} (${notificationCount})`}
              >
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-stone text-bone text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu - Desktop */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="hidden md:block relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-sand/50 transition-all duration-200 hover:shadow-sm"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone to-ink flex items-center justify-center text-bone font-bold text-sm shadow-md">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-ink-light max-w-[100px] truncate hidden lg:inline">
                      {user?.fullName || 'User'}
                    </span>
                    <span className={`transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-bone rounded-xl shadow-neu border border-stone/20 py-2 z-50 animate-fadeIn">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-ink hover:bg-sand/50 hover:text-ink-light transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        👤 {t('nav.profile')}
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-ink hover:bg-sand/50 hover:text-ink-light transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ⚙️ {t('nav.settings')}
                      </Link>
                      <hr className="my-2 border-stone/20" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-stone hover:bg-sand/50 hover:text-ink-light transition-colors"
                      >
                        🚪 {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-ink hover:bg-sand/50 transition-all duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-stone text-bone hover:bg-ink transition-all duration-200"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}

              {/* Burger Button - Mobile/Tablet */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm"
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
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Header;
