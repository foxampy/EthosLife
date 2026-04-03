/**
 * ElHeader - Unified Header with Burger Menu
 * All pages navigation through burger menu
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Heart,
  Brain,
  Activity,
  Users,
  Stethoscope,
  Moon,
  Utensils,
  Dumbbell,
  Target,
  MessageCircle,
  Zap,
  TrendingUp,
  Award,
  User,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ElLanguageSelector } from './ElLanguageSelector';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ElHeader: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [healthMenuOpen, setHealthMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  const healthModules = [
    { name: t('nav.nutrition'), href: '/health/nutrition', icon: Utensils },
    { name: t('nav.movement'), href: '/health/movement', icon: Dumbbell },
    { name: t('nav.sleep'), href: '/health/sleep', icon: Moon },
    { name: t('nav.psychology'), href: '/health/psychology', icon: Brain },
    { name: t('nav.medicine'), href: '/health/medicine', icon: Stethoscope },
    { name: t('nav.relationships'), href: '/health/relationships', icon: Users },
    { name: t('nav.habits'), href: '/health/habits', icon: Target },
  ];

  const allPages = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: 'Landing 2', href: '/landing2', icon: Home },
    { name: 'Landing 3', href: '/landing3', icon: Home },
    { name: t('nav.dashboard'), href: '/dashboard', icon: Activity },
    { name: t('nav.aiCoach'), href: '/ai-chat', icon: Zap },
    { name: t('nav.analytics'), href: '/analytics', icon: TrendingUp },
    { name: t('nav.gamification'), href: '/gamification', icon: Award },
    { name: t('nav.specialists'), href: '/specialists', icon: User },
    { name: t('nav.centers'), href: '/centers', icon: Users },
    { name: t('nav.community'), href: '/social', icon: MessageCircle },
    { name: t('nav.profile'), href: '/profile', icon: User },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  const featuresPages = [
    { name: t('nav.features'), href: '/features', icon: Zap },
    { name: t('nav.pricing'), href: '/pricing', icon: Award },
    { name: t('nav.team'), href: '/team', icon: Users },
    { name: t('nav.roadmap'), href: '/roadmap', icon: TrendingUp },
    { name: t('nav.faq'), href: '/faq', icon: MessageCircle },
    { name: t('nav.blog'), href: '/blog', icon: MessageCircle },
    { name: t('nav.tokenomics'), href: '/tokenomics', icon: Award },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#dcd3c6]/90 backdrop-blur-md border-b border-[#c9b8a6]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                E
              </motion.div>
              <span className="font-bold text-lg sm:text-xl text-[#2d2418] hidden xs:block">EthosLife</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Selector */}
              <ElLanguageSelector variant="minimal" className="hidden sm:flex" />

              {/* Burger Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 rounded-xl bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMenuOpen(false);
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85vw] sm:w-full sm:max-w-sm bg-[#e4dfd5] z-50 shadow-2xl overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="sticky top-0 bg-[#e4dfd5] border-b border-[#c9b8a6]/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <span className="font-bold text-lg text-[#2d2418]">{t('common.info')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ElLanguageSelector variant="minimal" className="sm:hidden" />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#dcd3c6] text-[#5c5243] min-h-[44px] min-w-[44px]"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-6">
                {/* Main Pages */}
                <div>
                  <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3 px-2">{t('dashboard.overview')}</h3>
                  <div className="space-y-1">
                    {allPages.map((page) => (
                      <Link
                        key={page.href}
                        to={page.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all min-h-[48px]',
                          isActive(page.href)
                            ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                            : 'text-[#5c5243] hover:bg-[#dcd3c6]'
                        )}
                      >
                        <page.icon className="w-5 h-5" />
                        <span className="font-medium text-sm flex-1">{page.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Health Modules */}
                <div>
                  <button
                    onClick={() => setHealthMenuOpen(!healthMenuOpen)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#5c5243] hover:bg-[#dcd3c6] transition-all min-h-[48px]"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium text-sm flex-1 text-left">{t('nav.health')}</span>
                    <motion.div
                      animate={{ rotate: healthMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {healthMenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 mt-2 space-y-1">
                          {healthModules.map((module) => (
                            <Link
                              key={module.href}
                              to={module.href}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm min-h-[44px]',
                                isActive(module.href)
                                  ? 'bg-[#5c5243] text-white'
                                  : 'text-[#5c5243] hover:bg-[#dcd3c6]'
                              )}
                            >
                              <module.icon className="w-4 h-4" />
                              <span className="flex-1">{module.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Features Pages */}
                <div>
                  <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3 px-2">{t('common.info')}</h3>
                  <div className="space-y-1">
                    {featuresPages.map((page) => (
                      <Link
                        key={page.href}
                        to={page.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all min-h-[48px] text-sm',
                          isActive(page.href)
                            ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                            : 'text-[#5c5243] hover:bg-[#dcd3c6]'
                        )}
                      >
                        <page.icon className="w-5 h-5" />
                        <span className="font-medium flex-1">{page.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Guest Mode Info */}
                <div className="p-4 rounded-xl bg-[#dcd3c6] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#5c5243]" />
                    <span className="text-xs font-bold text-[#2d2418]">{t('nav.v1')}</span>
                  </div>
                  <p className="text-xs text-[#5c5243]">
                    {t('app.description')}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ElHeader;
    </>
  );
};

export default ElHeader;
