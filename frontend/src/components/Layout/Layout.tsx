import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVersion } from '../../contexts/VersionContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Activity,
  Users,
  User,
  Settings,
  Heart,
  Brain,
  Dumbbell,
  Utensils,
  Moon,
  TrendingUp,
  Zap,
  Sparkles,
  Stethoscope,
  Building2,
  Wallet
} from 'lucide-react';
import VersionToggle from './VersionToggle';

export interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, versions: ['v1', 'v2'] },
  { name: 'Health', href: '/health/nutrition', icon: Heart, versions: ['v1', 'v2'],
    submenu: [
      { name: 'Nutrition', href: '/health/nutrition', icon: Utensils },
      { name: 'Movement', href: '/health/movement', icon: Dumbbell },
      { name: 'Sleep', href: '/health/sleep', icon: Moon },
      { name: 'Psychology', href: '/health/psychology', icon: Brain },
      { name: 'Habits', href: '/health/habits', icon: Sparkles },
      { name: 'Medicine', href: '/health/medicine', icon: Stethoscope },
      { name: 'Relationships', href: '/health/relationships', icon: Users },
    ]
  },
  { name: 'Social', href: '/social', icon: Users, versions: ['v1', 'v2'] },
  { name: 'Specialists', href: '/specialists', icon: User, versions: ['v2'] },
  { name: 'Centers', href: '/centers', icon: Building2, versions: ['v2'] },
  { name: 'AI Chat', href: '/ai-chat', icon: Zap, versions: ['v2'] },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, versions: ['v2'] },
  { name: 'Wallet', href: '/wallet', icon: Wallet, versions: ['v2'] },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthMenuOpen, setHealthMenuOpen] = useState(false);
  const { version, isV2 } = useVersion();
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Header - Mobile Optimized */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#dcd3c6]/90 border-b border-[#c9b8a6]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Compact on mobile */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                E
              </motion.div>
              <span className="font-bold text-base sm:text-xl text-[#2d2418] hidden xs:block">EthosLife</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-[#5c5243] text-white">
                {version.toUpperCase()}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.filter(item => item.versions?.includes(version)).map((item) => (
                item.submenu ? (
                  <div key={item.name} className="relative" onMouseEnter={() => setHealthMenuOpen(true)} onMouseLeave={() => setHealthMenuOpen(false)}>
                    <button
                      className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 text-sm ${
                        isActive(item.href) || healthMenuOpen
                          ? 'bg-[#5c5243] text-white shadow-lg'
                          : 'text-[#5c5243] hover:bg-[#d4ccb8]'
                      }`}
                    >
                      <item.icon size={16} />
                      {item.name}
                    </button>

                    <AnimatePresence>
                      {healthMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-1 w-56 rounded-2xl bg-[#e4dfd5] shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)] overflow-hidden z-50"
                        >
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              to={subitem.href}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4ccb8] transition-colors"
                            >
                              <subitem.icon size={16} className="text-[#5c5243]" />
                              <span className="text-[#2d2418] font-medium text-sm">{subitem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 text-sm ${
                      isActive(item.href)
                        ? 'bg-[#5c5243] text-white shadow-lg'
                        : 'text-[#5c5243] hover:bg-[#d4ccb8]'
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="hidden xl:block">{item.name}</span>
                  </Link>
                )
              ))}
            </nav>

            {/* Right side - Mobile optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Version Toggle */}
              <VersionToggle />

              {/* Profile - Hidden on small mobile */}
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <User size={16} />
                <span className="hidden lg:block text-sm">Profile</span>
              </Link>

              {/* Mobile menu button - Larger touch target */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Optimized */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#c9b8a6]/30 bg-[#dcd3c6]/95 backdrop-blur-md overflow-hidden"
            >
              <nav className="px-3 py-3 space-y-1.5 max-h-[70vh] overflow-y-auto">
                {navigation.filter(item => item.versions?.includes(version)).map((item) => (
                  item.submenu ? (
                    <div key={item.name}>
                      <div className="flex items-center gap-2 px-3 py-2.5 text-[#5c5243] font-medium text-sm">
                        <item.icon size={18} />
                        {item.name}
                      </div>
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8] transition-colors text-sm"
                          >
                            <subitem.icon size={16} />
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all text-sm min-h-[44px] ${
                        isActive(item.href)
                          ? 'bg-[#5c5243] text-white'
                          : 'text-[#5c5243] hover:bg-[#d4ccb8]'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  )
                ))}
                
                {/* Profile link for mobile */}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-medium text-sm min-h-[44px]"
                >
                  <User size={18} />
                  Profile
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content - Mobile optimized padding */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>

      {/* Footer - Compact on mobile */}
      <footer className="border-t border-[#c9b8a6]/30 py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-sm text-[#5c5243]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-xs">
                E
              </div>
              <span className="text-xs sm:text-sm">© 2026 EthosLife. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm flex-wrap justify-center">
              <Link to="/features" className="hover:text-[#2d2418] transition-colors">Features</Link>
              <Link to="/pricing" className="hover:text-[#2d2418] transition-colors">Pricing</Link>
              <Link to="/team" className="hover:text-[#2d2418] transition-colors">Team</Link>
              <Link to="/faq" className="hover:text-[#2d2418] transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
