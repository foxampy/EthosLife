import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import BurgerMenu from './BurgerMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
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
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/health', label: 'Health', icon: '❤️' },
    { path: '/ai-chat', label: 'AI Coach', icon: '🤖' },
    { path: '/social', label: 'Community', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
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
              to="/dashboard" 
              className="flex items-center space-x-2 group"
              aria-label="EthosLife Home"
            >
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">🌱</span>
              <span className="text-xl font-bold text-ink tracking-tight">EthosLife</span>
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

            {/* Right Section: Search, Notifications, User, Burger */}
            <div className="flex items-center space-x-2">
              
              {/* Search */}
              <div ref={searchRef} className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-48 sm:w-64 px-4 py-2 rounded-xl bg-bone border border-stone/30 text-ink placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-stone/50 focus:border-transparent shadow-neu-inset text-sm"
                      autoFocus
                      aria-label="Search"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 rounded-xl hover:bg-sand/50 text-stone"
                      aria-label="Close search"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm"
                    aria-label="Open search"
                  >
                    🔍
                  </button>
                )}
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm"
                aria-label={`Notifications (${notificationCount} unread)`}
              >
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-stone text-bone text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu - Desktop */}
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
                  <span className="text-sm font-medium text-ink-light max-w-[100px] truncate">
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
                      👤 Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-ink hover:bg-sand/50 hover:text-ink-light transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="my-2 border-stone/20" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-stone hover:bg-sand/50 hover:text-ink-light transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Burger Button - Mobile/Tablet */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm ml-2"
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

      {/* Mobile User Menu - показываем только в бургере */}
    </>
  );
};

export default Header;
