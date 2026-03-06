import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/health', label: 'Health', icon: '❤️' },
    { path: '/ai-chat', label: 'AI Coach', icon: '🤖' },
    { path: '/social', label: 'Community', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bone/80 backdrop-blur-md border-b border-clay/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold text-ink">EthosLife</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                      ? 'bg-stone text-bone'
                      : 'text-ink-light hover:text-ink hover:bg-sand'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-ink-light">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-stone hover:text-ink font-medium"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-sand"
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-bone border-t border-clay/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-stone text-bone'
                      : 'text-ink hover:bg-sand'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-xl text-base font-medium text-stone hover:bg-sand"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
