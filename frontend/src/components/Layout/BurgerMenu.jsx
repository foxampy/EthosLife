import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import LanguageSelector from './LanguageSelector';

const BurgerMenu = ({ isOpen, onClose, isActive }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeVersion, setActiveVersion] = useState('v1'); // 'v1' or 'v2'

  // Определяем активную версию на основе текущего пути
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/v2') || 
        path === '/dashboard2' ||
        path === '/analytics2' ||
        path === '/gamification2' ||
        path === '/specialists2' ||
        path === '/centers2' ||
        path === '/profile2' ||
        path === '/settings2' ||
        path === '/ai-chat2' ||
        path === '/social2' ||
        path.includes('/health/nutrition2') ||
        path.includes('/health/movement2') ||
        path.includes('/health/sleep2') ||
        path.includes('/health/psychology2') ||
        path.includes('/health/medicine2') ||
        path.includes('/health/relationships2') ||
        path.includes('/health/habits2')) {
      setActiveVersion('v2');
    } else {
      setActiveVersion('v1');
    }
  }, [location.pathname]);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  // V1 Menu Categories (Classic)
  const v1MenuCategories = [
    {
      title: t('nav.landing'),
      items: [
        { path: '/', label: t('nav.home') + ' V1', icon: '🏠' },
        { path: '/v1', label: 'Landing V1', icon: '🌟' },
        { path: '/features-v1', label: t('nav.features'), icon: '✨' },
        { path: '/pricing-v1', label: t('nav.pricing'), icon: '💎' },
        { path: '/tokenomics-v1', label: t('nav.tokenomics'), icon: '📈' },
        { path: '/roadmap-v1', label: t('nav.roadmap'), icon: '🗺️' },
        { path: '/whitepaper', label: t('nav.whitepaper'), icon: '📄' },
      ]
    },
    {
      title: t('nav.dashboardV1'),
      items: [
        { path: '/dashboard-v1', label: t('nav.dashboard') + ' V1', icon: '📊' },
        { path: '/overview-v1', label: t('dashboard.overview'), icon: '📋' },
        { path: '/wallet-v1', label: t('dashboard.wallet'), icon: '💰' },
        { path: '/notifications-v1', label: t('nav.notifications'), icon: '🔔' },
        { path: '/activity-v1', label: t('dashboard.activity'), icon: '📈' },
        { path: '/achievements-v1', label: t('dashboard.achievements'), icon: '🏆' },
      ]
    },
    {
      title: t('nav.health') + ' V1',
      items: [
        { path: '/health', label: t('health.center'), icon: '🏥' },
        { path: '/health/nutrition', label: '🥗 ' + t('nav.nutrition'), icon: '' },
        { path: '/health/fitness', label: '💪 ' + t('nav.fitness'), icon: '' },
        { path: '/health/sleep', label: '😴 ' + t('nav.sleep'), icon: '' },
        { path: '/health/mental', label: '🧠 ' + t('nav.mental'), icon: '' },
        { path: '/health/medical', label: '🏥 ' + t('nav.medical'), icon: '' },
        { path: '/health/body', label: '🧬 ' + t('nav.body'), icon: '' },
        { path: '/health/environment', label: '🌿 ' + t('nav.environment'), icon: '' },
      ]
    },
    {
      title: t('nav.social') + ' V1',
      items: [
        { path: '/social', label: t('nav.social') + ' Feed', icon: '📰' },
      ]
    },
    {
      title: t('nav.profile') + ' V1',
      items: [
        { path: '/profile', label: t('nav.profile'), icon: '👤' },
        { path: '/settings', label: t('nav.settings'), icon: '⚙️' },
        { path: '/ai-chat', label: t('nav.aiCoach'), icon: '🤖' },
      ]
    },
  ];

  // V2 Menu Categories (New)
  const v2MenuCategories = [
    {
      title: 'V2 ' + t('nav.platform'),
      items: [
        { path: '/v2', label: t('nav.home') + ' V2', icon: '🚀' },
        { path: '/dashboard2', label: '✨ ' + t('nav.dashboard') + ' 2.0', icon: '📊' },
        { path: '/analytics2', label: '📈 ' + t('nav.analytics') + ' 2.0', icon: '📉' },
        { path: '/gamification2', label: '🎮 ' + t('nav.gamification') + ' 2.0', icon: '🏆' },
      ]
    },
    {
      title: t('nav.health') + ' V2',
      items: [
        { path: '/health/nutrition2', label: '🥗 ' + t('nav.nutrition') + ' 2.0', icon: '✨' },
        { path: '/health/movement2', label: '💪 ' + t('nav.movement') + ' 2.0', icon: '✨' },
        { path: '/health/sleep2', label: '😴 ' + t('nav.sleep') + ' 2.0', icon: '✨' },
        { path: '/health/psychology2', label: '🧠 ' + t('nav.psychology') + ' 2.0', icon: '✨' },
        { path: '/health/medicine2', label: '🏥 ' + t('nav.medicine') + ' 2.0', icon: '✨' },
        { path: '/health/relationships2', label: '💕 ' + t('nav.relationships') + ' 2.0', icon: '✨' },
        { path: '/health/habits2', label: '🔥 ' + t('nav.habits') + ' 2.0', icon: '✨' },
      ]
    },
    {
      title: t('nav.social') + ' V2',
      items: [
        { path: '/social2', label: '✨ ' + t('nav.social') + ' Feed 2.0', icon: '📰' },
      ]
    },
    {
      title: t('nav.specialists') + ' & ' + t('nav.centers') + ' V2',
      items: [
        { path: '/specialists2', label: '✨ ' + t('nav.specialists') + ' 2.0', icon: '👨‍⚕️' },
        { path: '/centers2', label: '✨ ' + t('nav.centers') + ' 2.0', icon: '🏢' },
      ]
    },
    {
      title: t('nav.profile') + ' & AI V2',
      items: [
        { path: '/profile2', label: '✨ ' + t('nav.profile') + ' 2.0', icon: '👤' },
        { path: '/settings2', label: '✨ ' + t('nav.settings') + ' 2.0', icon: '⚙️' },
        { path: '/ai-chat2', label: '✨ ' + t('nav.aiCoach') + ' 2.0', icon: '🤖' },
      ]
    },
  ];

  const currentCategories = activeVersion === 'v1' ? v1MenuCategories : v2MenuCategories;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-bone shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header с кнопкой закрытия */}
        <div className="sticky top-0 bg-bone border-b border-stone/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold text-ink">EthosLife</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-all duration-200 hover:shadow-sm"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>

        {/* Version Toggle */}
        <div className="px-6 py-4 border-b border-stone/20 bg-sand/20">
          <div className="flex bg-sand/50 rounded-xl p-1">
            <button
              onClick={() => {
                setActiveVersion('v1');
                navigate('/');
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeVersion === 'v1'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-stone hover:text-ink'
                }`}
            >
              {t('nav.v1')}
            </button>
            <button
              onClick={() => {
                setActiveVersion('v2');
                navigate('/v2');
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeVersion === 'v2'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                  : 'text-stone hover:text-ink'
                }`}
            >
              ✨ {t('nav.v2')}
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-stone/20 bg-gradient-to-r from-stone/10 to-transparent">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone to-ink flex items-center justify-center text-bone font-bold text-lg shadow-md">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-ink">{user?.fullName}</p>
                <p className="text-sm text-stone">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Categories */}
        <nav className="px-4 py-6 space-y-6">
          {currentCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xs font-bold text-stone uppercase tracking-wider mb-3 px-2">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive?.(item.path)
                        ? 'bg-stone text-bone shadow-md'
                        : 'text-ink hover:bg-sand/50 hover:text-ink-light hover:shadow-sm hover:translate-x-1'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive?.(item.path) && (
                      <span className="ml-auto text-bone/80">●</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Language Selector */}
        <LanguageSelector variant="burger" />

        {/* Investment Link */}
        <div className="px-4 py-4 border-t border-stone/20">
          <a
            href="/saft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-lg">💎</span>
            <span className="font-medium text-sm">{t('nav.buyTokens')} (SAFT)</span>
            <span className="ml-auto text-xs">↗</span>
          </a>
        </div>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div className="sticky bottom-0 bg-bone border-t border-stone/20 px-4 py-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-stone to-ink text-bone font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              <span>🚪</span>
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        ) : (
          <div className="sticky bottom-0 bg-bone border-t border-stone/20 px-4 py-4 space-y-2">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-stone text-stone font-semibold hover:bg-stone/10 transition-all duration-200"
            >
              <span>{t('nav.login')}</span>
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-stone to-ink text-bone font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              <span>{t('nav.register')}</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Анимация появления */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default BurgerMenu;
