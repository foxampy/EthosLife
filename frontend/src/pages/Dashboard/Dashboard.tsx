/**
 * Dashboard V2 - Modern widget-based dashboard
 * Android-style widget management with clean, minimal UI
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Settings,
  Bell,
  User,
  Menu,
  LayoutGrid,
  ChevronDown,
  Sparkles,
  Calendar,
} from 'lucide-react';

import { ElCard, ElButton } from '../../components/ElCore';
import { WidgetGrid, WidgetLibrary } from '../../components/WidgetSystem';
import { useWidgetStore } from '../../store/widgetStore';
import { useNavigate } from 'react-router-dom';

// Simple user avatar component
const UserAvatar: React.FC<{ name: string; image?: string }> = ({ name, image }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-[var(--bone-400)]"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold text-sm">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

// Date display component
const DateDisplay: React.FC = () => {
  const { t } = useTranslation();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-[var(--text-primary)]">{dayName}</p>
      <p className="text-sm text-[var(--text-secondary)]">{dateStr}</p>
    </div>
  );
};

// Notification badge
const NotificationBell: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Daily goal reached!', message: 'You hit 10,000 steps today', time: '2m ago', read: false },
    { id: 2, title: 'Sleep reminder', message: 'It\'s time to wind down for bed', time: '1h ago', read: false },
    { id: 3, title: 'Weekly report', message: 'Your health summary is ready', time: '3h ago', read: true },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-[var(--bone-300)] shadow-neu flex items-center justify-center"
      >
        <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 z-40"
            >
              <ElCard variant="glass" className="max-h-96 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
                  <button className="text-xs text-[var(--neon-cyan)]">Mark all read</button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl ${n.read ? 'bg-transparent' : 'bg-[var(--neon-cyan)]/10'}`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] mt-1.5" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{n.message}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ElCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile menu popup
const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <UserAvatar name="Alex" />
        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-56 z-40"
            >
              <ElCard variant="glass">
                <div className="space-y-1">
                  <button
                    onClick={() => { navigate('/profile'); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bone-400)]/30 text-sm text-[var(--text-primary)]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bone-400)]/30 text-sm text-[var(--text-primary)]"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { navigate('/devices'); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bone-400)]/30 text-sm text-[var(--text-primary)]"
                  >
                    Devices
                  </button>
                  <hr className="border-[var(--bone-400)]/30" />
                  <button
                    onClick={() => { navigate('/'); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </ElCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// AI Prompt button
const AIPromptButton: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="relative">
      <ElCard variant="glass" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI about your health..."
          className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />
        <ElButton variant="gradient" size="sm">
          Ask
        </ElButton>
      </ElCard>
    </div>
  );
};

export const DashboardV2: React.FC = () => {
  const { t } = useTranslation();
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu + Date */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-[var(--bone-300)] shadow-neu flex items-center justify-center"
              >
                <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
              </motion.button>
              <DateDisplay />
            </div>

            {/* Center: AI Prompt (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <AIPromptButton />
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
              <NotificationBell />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[var(--text-primary)]"
          >
            Good morning, Alex! 👋
          </motion.h1>
          <p className="text-[var(--text-secondary)]">
            Here's your daily health overview
          </p>
        </div>

        {/* Mobile AI Prompt */}
        <div className="md:hidden mb-6">
          <AIPromptButton />
        </div>

        {/* Widget Controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Dashboard</h2>
          <div className="flex items-center gap-2">
            <ElButton
              variant="flat"
              size="sm"
              leftIcon={<LayoutGrid className="w-4 h-4" />}
            >
              Layout
            </ElButton>
            <ElButton
              variant="gradient"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowWidgetLibrary(true)}
            >
              Add Widget
            </ElButton>
          </div>
        </div>

        {/* Widget Grid */}
        <WidgetGrid />
      </main>

      {/* Widget Library Modal */}
      <AnimatePresence>
        {showWidgetLibrary && (
          <WidgetLibrary onClose={() => setShowWidgetLibrary(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardV2;
