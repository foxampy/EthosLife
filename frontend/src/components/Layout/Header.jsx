/**
 * EthosLife V2 Header - Permanent Fixed Header
 * Style: Retrofuturism Neumorphism (V2 Design)
 * Features: Burger menu, permanent navigation, responsive
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Bell, User, ChevronDown, LogOut, Settings, Home, Heart, MessageCircle, Zap, Wallet, Shield } from 'lucide-react';
import BurgerMenu from './BurgerMenu';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus on outside click
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

  // Close menus on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

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

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/health/nutrition', label: 'Health', icon: Heart },
    { path: '/social', label: 'Social', icon: MessageCircle },
    { path: '/ai-chat', label: 'AI Chat', icon: Zap },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Permanent Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#e4dfd5]/95 backdrop-blur-xl border-b border-[#5c5243]/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo + Burger Menu */}
            <div className="flex items-center gap-3">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-[#dcd3c6] hover:bg-[#c8c2b6] transition-colors shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(44,40,34,0.1)]"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-[#2d2418]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#2d2418]" />
                )}
              </button>

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 group"
                aria-label="EthosLife Home"
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] via-[#8c7a6b] to-[#a89880] flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  🌱
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-[#2d2418] tracking-tight block">EthosLife</span>
                  <span className="text-[10px] text-[#5c5243] font-medium">Human OS</span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg transform scale-105'
                        : 'text-[#5c5243] hover:bg-[#d4ccb8]/70 hover:shadow-md'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Notifications, User, Language */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <AnimatePresence>
                  {isSearchOpen ? (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={handleSearch}
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-4 py-2 rounded-xl bg-[#dcd3c6] text-[#2d2418] placeholder-[#5c5243] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30"
                        autoFocus
                      />
                    </motion.form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 rounded-xl hover:bg-[#d4ccb8]/70 transition-colors"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5 text-[#5c5243]" />
                    </button>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-xl hover:bg-[#d4ccb8]/70 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#5c5243]" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#d4ccb8]/70 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-[#e4dfd5] font-bold">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#5c5243]" />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 neu-card p-2 shadow-xl"
                        >
                          <div className="px-3 py-2 border-b border-[#5c5243]/10">
                            <p className="font-semibold text-[#2d2418]">{user.full_name}</p>
                            <p className="text-xs text-[#5c5243]">{user.email}</p>
                          </div>
                          
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          
                          <Link
                            to="/settings"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-[#d4ccb8]/70 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] font-medium text-sm hover:shadow-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Burger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Menu Panel */}
            <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;
