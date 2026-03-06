import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const BurgerMenu = ({ isOpen, onClose, isActive }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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

  // Категории навигации
  const menuCategories = [
    {
      title: 'Landing',
      items: [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/#features', label: 'Features', icon: '✨' },
        { path: '/#pricing', label: 'Pricing', icon: '💎' },
        { path: '/#tokenomics', label: 'Tokenomics', icon: '📈' },
        { path: '/#roadmap', label: 'Roadmap', icon: '🗺️' },
        { path: '/whitepaper', label: 'Whitepaper', icon: '📄' },
      ]
    },
    {
      title: 'Dashboard v2 (New)',
      items: [
        { path: '/dashboard2', label: '✨ Dashboard 2.0', icon: '📊' },
        { path: '/analytics2', label: '📈 Analytics 2.0', icon: '📉' },
        { path: '/gamification2', label: '🎮 Gamification 2.0', icon: '🏆' },
      ]
    },
    {
      title: 'Dashboard (Classic)',
      items: [
        { path: '/dashboard', label: 'Overview', icon: '📊' },
      ]
    },
    {
      title: 'Health Modules v2 (New)',
      items: [
        { path: '/health/nutrition2', label: '🥗 Nutrition 2.0', icon: '✨' },
        { path: '/health/movement2', label: '💪 Movement 2.0', icon: '✨' },
        { path: '/health/sleep2', label: '😴 Sleep 2.0', icon: '✨' },
        { path: '/health/psychology2', label: '🧠 Psychology 2.0', icon: '✨' },
        { path: '/health/medicine2', label: '🏥 Medicine 2.0', icon: '✨' },
        { path: '/health/relationships2', label: '💕 Relationships 2.0', icon: '✨' },
        { path: '/health/habits2', label: '🔥 Habits 2.0', icon: '✨' },
      ]
    },
    {
      title: 'Health Modules (Classic)',
      items: [
        { path: '/health/nutrition', label: '🥗 Nutrition', icon: '' },
        { path: '/health/fitness', label: '💪 Fitness', icon: '' },
        { path: '/health/sleep', label: '😴 Sleep', icon: '' },
        { path: '/health/mental', label: '🧠 Mental Health', icon: '' },
        { path: '/health/medical', label: '🏥 Medical', icon: '' },
      ]
    },
    {
      title: 'Social & Community v2 (New)',
      items: [
        { path: '/social2', label: '✨ Social Feed 2.0', icon: '📰' },
      ]
    },
    {
      title: 'Social (Classic)',
      items: [
        { path: '/social', label: 'Feed', icon: '📰' },
        { path: '/social/groups', label: 'Groups', icon: '👥' },
        { path: '/social/challenges', label: 'Challenges', icon: '🏆' },
        { path: '/social/messages', label: 'Messages', icon: '💬' },
      ]
    },
    {
      title: 'Specialists & Centers v2 (New)',
      items: [
        { path: '/specialists2', label: '✨ Specialists 2.0', icon: '👨‍⚕️' },
        { path: '/centers2', label: '✨ Centers 2.0', icon: '🏢' },
      ]
    },
    {
      title: 'Specialists (Classic)',
      items: [
        { path: '/specialists', label: 'Find Specialists', icon: '👨‍⚕️' },
        { path: '/appointments', label: 'Appointments', icon: '📅' },
      ]
    },
    {
      title: 'Profile & AI v2 (New)',
      items: [
        { path: '/profile2', label: '✨ Profile 2.0', icon: '👤' },
        { path: '/settings2', label: '✨ Settings 2.0', icon: '⚙️' },
        { path: '/ai-chat2', label: '✨ AI Coach 2.0', icon: '🤖' },
      ]
    },
    {
      title: 'Profile & Settings (Classic)',
      items: [
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
        { path: '/ai-chat', label: 'AI Coach', icon: '🤖' },
      ]
    },
  ];

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
            aria-label="Close menu"
          >
            ✕
          </button>
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
          {menuCategories.map((category, categoryIndex) => (
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

        {/* Logout Button */}
        <div className="sticky bottom-0 bg-bone border-t border-stone/20 px-4 py-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-stone to-ink text-bone font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
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
