/**
 * BurgerMenu V2 - Full Navigation Menu
 * Shows all V2 (main) and V1 (legacy) features
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const BurgerMenu = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // Блокировка скролла
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#e4dfd5] shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#e4dfd5] border-b border-[#5c5243]/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2d2418]">Menu</h2>
          <p className="text-xs text-[#5c5243]">EthosLife Human OS</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-[#d4ccb8]/70 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-[#2d2418]" />
        </button>
      </div>

      {/* Main V2 Navigation */}
      <div className="px-4 py-6">
        <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3">Main (V2)</h3>
        <nav className="space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Home</span>
          </Link>
          
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/dashboard') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/health/nutrition"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/health') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">❤️</span>
            <span className="font-medium">Health</span>
          </Link>

          <Link
            to="/social"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/social') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">👥</span>
            <span className="font-medium">Social</span>
          </Link>

          <Link
            to="/ai-chat"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/ai-chat') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">🤖</span>
            <span className="font-medium">AI Chat</span>
          </Link>

          <Link
            to="/wallet"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/wallet') 
                ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] shadow-lg' 
                : 'text-[#5c5243] hover:bg-[#d4ccb8]/70'
            }`}
          >
            <span className="text-xl">💰</span>
            <span className="font-medium">Wallet</span>
          </Link>
        </nav>
      </div>

      {/* Extended Features (V1 Legacy) */}
      <div className="px-4 py-6 border-t border-[#5c5243]/10">
        <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3">Extended Features</h3>
        <nav className="space-y-1">
          <Link
            to="/challenges"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">🏆</span>
            <span className="font-medium">Challenges</span>
          </Link>

          <Link
            to="/friends"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">👫</span>
            <span className="font-medium">Friends</span>
          </Link>

          <Link
            to="/groups"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">👨‍👩‍👧‍👦</span>
            <span className="font-medium">Groups</span>
          </Link>

          <Link
            to="/messages"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">💬</span>
            <span className="font-medium">Messages</span>
          </Link>

          <Link
            to="/leaders"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">📈</span>
            <span className="font-medium">Leaderboards</span>
          </Link>

          <Link
            to="/tokenomics"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span className="text-xl">📊</span>
            <span className="font-medium">Tokenomics</span>
          </Link>
        </nav>
      </div>

      {/* Health Extended */}
      <div className="px-4 py-6 border-t border-[#5c5243]/10">
        <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3">Health Tools</h3>
        <nav className="space-y-1">
          <Link
            to="/health/nutrition/diary"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>📝</span>
            <span>Food Diary</span>
          </Link>

          <Link
            to="/health/nutrition/meal-plan"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>📅</span>
            <span>Meal Planner</span>
          </Link>

          <Link
            to="/health/nutrition/recipes"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>👨‍🍳</span>
            <span>Recipes</span>
          </Link>

          <Link
            to="/health/fitness"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>💪</span>
            <span>Fitness</span>
          </Link>

          <Link
            to="/health/fitness/exercises"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>🏋️</span>
            <span>Exercise Library</span>
          </Link>

          <Link
            to="/health/sleep/analysis"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>😴</span>
            <span>Sleep Analysis</span>
          </Link>

          <Link
            to="/health/mental/mood"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>😊</span>
            <span>Mood Tracker</span>
          </Link>

          <Link
            to="/health/medical/medications"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
          >
            <span>💊</span>
            <span>Medications</span>
          </Link>
        </nav>
      </div>

      {/* User Section */}
      <div className="px-4 py-6 border-t border-[#5c5243]/10">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[#dcd3c6] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-[#e4dfd5] font-bold">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d2418] truncate">{user.full_name}</p>
                <p className="text-xs text-[#5c5243] truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
              >
                <span className="text-xl">👤</span>
                <span className="font-medium">Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5c5243] hover:bg-[#d4ccb8]/70 transition-all"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium">Settings</span>
              </Link>
            </nav>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] font-medium hover:shadow-lg transition-all"
          >
            <span>🔐</span>
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Language Selector */}
      <div className="px-4 py-6 border-t border-[#5c5243]/10">
        <h3 className="text-xs font-bold text-[#5c5243] uppercase tracking-wider mb-3">Language</h3>
        <LanguageSelector />
      </div>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-[#5c5243]/10 text-center">
        <p className="text-xs text-[#5c5243]">© 2026 EthosLife. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[#5c5243]">
          <Link to="/privacy" onClick={onClose} className="hover:text-[#2d2418]">Privacy</Link>
          <Link to="/terms" onClick={onClose} className="hover:text-[#2d2418]">Terms</Link>
          <Link to="/contact" onClick={onClose} className="hover:text-[#2d2418]">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
