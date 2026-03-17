/**
 * Dashboard2 Preview - Visual Design Only
 * Shows the UI/Design without complex logic
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  Menu,
  User,
  Check,
  Trophy,
  Star,
  Award,
  Zap,
  Heart,
  Activity,
  Moon,
  Utensils,
  Dumbbell,
  Droplets,
} from 'lucide-react';

// Simple NeuCard component for preview
const NeuCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#e4dfd5] rounded-2xl shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] ${className}`}>
    {children}
  </div>
);

const NeuButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <button
    onClick={onClick}
    className={`bg-[#e4dfd5] rounded-xl shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] transition-all ${className}`}
  >
    {children}
  </button>
);

export default function Dashboard2Preview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#dcd3c6]/90 backdrop-blur-md border-b border-[#c9b8a6]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NeuButton className="!p-2.5 lg:hidden">
                <Menu className="w-5 h-5" />
              </NeuButton>
              <div>
                <h1 className="text-lg font-bold text-[#2d2418] uppercase tracking-wider">Dashboard</h1>
                <p className="text-xs text-[#5c5243]">Tuesday, March 17, 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
                <Clock className="w-4 h-4 text-[#5c5243]" />
                <span className="text-sm font-semibold">12:30 PM</span>
              </div>

              <NeuButton className="!p-2.5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
              </NeuButton>

              <NeuButton className="!p-2.5">
                <User className="w-5 h-5" />
              </NeuButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Health Score Widget */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Health Score</h3>
                <p className="text-xs text-[#5c5243]">Overall wellness</p>
              </div>
            </div>
            <div className="text-center py-4">
              <motion.div
                className="text-5xl font-bold text-[#2d2418]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                87
              </motion.div>
              <p className="text-xs text-[#5c5243] mt-2">Excellent</p>
            </div>
          </NeuCard>

          {/* Daily Rings */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Daily Rings</h3>
                <p className="text-xs text-[#5c5243]">Activity goals</p>
              </div>
            </div>
            <div className="flex justify-center gap-4 py-4">
              {[
                { label: 'Move', value: 450, goal: 600, color: 'text-red-500' },
                { label: 'Exercise', value: 25, goal: 30, color: 'text-green-500' },
                { label: 'Stand', value: 10, goal: 12, color: 'text-blue-500' },
              ].map((ring) => (
                <div key={ring.label} className="text-center">
                  <div className={`text-lg font-bold ${ring.color}`}>{ring.value}</div>
                  <div className="text-xs text-[#5c5243]">{ring.label}</div>
                </div>
              ))}
            </div>
          </NeuCard>

          {/* Steps Counter */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Steps</h3>
                <p className="text-xs text-[#5c5243]">Daily goal</p>
              </div>
            </div>
            <div className="text-center py-4">
              <motion.div
                className="text-4xl font-bold text-[#2d2418]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                8,432
              </motion.div>
              <div className="mt-2 text-xs text-[#5c5243]">
                <span className="font-semibold text-emerald-600">+12%</span> vs yesterday
              </div>
            </div>
          </NeuCard>

          {/* Water Tracker */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Water</h3>
                <p className="text-xs text-[#5c5243]">Hydration</p>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-[#2d2418]">5/8</div>
              <p className="text-xs text-[#5c5243] mt-2">glasses</p>
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-6 rounded-full ${i < 5 ? 'bg-cyan-500' : 'bg-[#dcd3c6]'}`}
                  />
                ))}
              </div>
            </div>
          </NeuCard>

          {/* Sleep Widget */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Sleep</h3>
                <p className="text-xs text-[#5c5243]">Last night</p>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-[#2d2418]">7.5h</div>
              <p className="text-xs text-[#5c5243] mt-2">Good quality</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Deep: 2.1h</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">REM: 1.8h</span>
              </div>
            </div>
          </NeuCard>

          {/* Nutrition Widget */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Nutrition</h3>
                <p className="text-xs text-[#5c5243]">Today's intake</p>
              </div>
            </div>
            <div className="space-y-3 py-2">
              {[
                { label: 'Calories', current: 1450, goal: 2000, color: 'bg-red-500' },
                { label: 'Protein', current: 95, goal: 150, color: 'bg-blue-500' },
                { label: 'Carbs', current: 180, goal: 250, color: 'bg-yellow-500' },
              ].map((macro) => (
                <div key={macro.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#5c5243]">{macro.label}</span>
                    <span className="text-[#2d2418] font-medium">{macro.current}/{macro.goal}</span>
                  </div>
                  <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${macro.color} rounded-full`}
                      style={{ width: `${(macro.current / macro.goal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </NeuCard>

          {/* Gamification Widget */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Level 15</h3>
                <p className="text-xs text-[#5c5243]">Fitness Enthusiast</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#5c5243]">XP</span>
                <span className="text-[#2d2418] font-medium">2,450 / 3,000</span>
              </div>
              <div className="h-3 bg-[#dcd3c6] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5c5243]">Rank: #23</span>
              <span className="text-emerald-600 font-medium">Top 5%</span>
            </div>
          </NeuCard>

          {/* Daily Checklist */}
          <NeuCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2418] text-sm">Daily Tasks</h3>
                <p className="text-xs text-[#5c5243]">3/5 completed</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { text: 'Morning stretch', done: true },
                { text: 'Hydrate (500ml)', done: true },
                { text: 'Take vitamins', done: true },
                { text: '30 min workout', done: false },
                { text: 'Log all meals', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-[#dcd3c6]'}`}>
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-[#5c5243] line-through' : 'text-[#2d2418]'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </NeuCard>

        </div>
      </main>
    </div>
  );
}
