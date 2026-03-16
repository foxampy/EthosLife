/**
 * Gamification Unified - Achievements, Levels, and Rewards
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Crown,
  Gem,
  Gift,
  Flame,
  ChevronRight,
  Lock,
  Check,
} from 'lucide-react';
import { ElCard, ElButton } from '../../components/ElCore';

const userStats = {
  level: 12,
  xp: 2840,
  xpToNext: 3000,
  streak: 15,
  totalPoints: 4520,
  badges: 24,
  challenges: 8,
};

const achievements = [
  { id: 1, name: 'Early Bird', desc: 'Wake up before 6 AM for 7 days', icon: '🌅', unlocked: true, rarity: 'common' },
  { id: 2, name: 'Step Master', desc: 'Walk 10,000 steps for 30 days', icon: '👟', unlocked: true, rarity: 'rare' },
  { id: 3, name: 'Hydration Hero', desc: 'Drink 8 glasses of water for 14 days', icon: '💧', unlocked: true, rarity: 'common' },
  { id: 4, name: 'Sleep Expert', desc: 'Get 8 hours of sleep for 21 days', icon: '😴', unlocked: false, rarity: 'epic' },
  { id: 5, name: 'Marathoner', desc: 'Run a total of 42km', icon: '🏃', unlocked: false, rarity: 'legendary' },
  { id: 6, name: 'Nutrition Guru', desc: 'Log meals for 60 days straight', icon: '🥗', unlocked: true, rarity: 'rare' },
];

const activeChallenges = [
  { id: 1, name: 'Summer Shape Up', progress: 65, total: 100, daysLeft: 5, reward: 500, participants: 1234 },
  { id: 2, name: 'Hydration Challenge', progress: 8, total: 14, daysLeft: 6, reward: 200, participants: 3421 },
  { id: 3, name: '10K Steps Daily', progress: 12, total: 30, daysLeft: 18, reward: 1000, participants: 567 },
];

const leaderboard = [
  { rank: 1, name: 'Sarah M.', points: 8930, avatar: 'S', isYou: false },
  { rank: 2, name: 'Mike R.', points: 8450, avatar: 'M', isYou: false },
  { rank: 3, name: 'You', points: 4520, avatar: 'Y', isYou: true },
  { rank: 4, name: 'Alex K.', points: 4100, avatar: 'A', isYou: false },
  { rank: 5, name: 'Emma W.', points: 3890, avatar: 'E', isYou: false },
];

const rarityColors = {
  common: 'bg-gray-400',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500',
};

export const GamificationUnified: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'leaderboard'>('achievements');

  return (
    <div className="min-h-screen bg-[var(--bone-200)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Achievements
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track your progress and earn rewards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-[var(--neon-cyan)]" />
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {userStats.totalPoints.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Level Card */}
        <ElCard variant="glass" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-purple)]/10" />
          <div className="relative flex flex-col md:flex-row items-center gap-6 p-4">
            {/* Level Badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--bone-200)] flex items-center justify-center shadow-neu">
                <span className="text-lg font-bold text-[var(--neon-cyan)]">{userStats.level}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[var(--text-primary)]">Level {userStats.level}</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {userStats.xp} / {userStats.xpToNext} XP
                </span>
              </div>
              <div className="h-4 bg-[var(--bone-400)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full"
                />
              </div>
              <p className="text-sm text-[var(--text-tertiary)] mt-2">
                {userStats.xpToNext - userStats.xp} XP to Level {userStats.level + 1}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[var(--neon-cyan)]">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">{userStats.streak}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Award className="w-5 h-5" />
                  <span className="font-bold">{userStats.badges}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">Badges</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-500">
                  <Target className="w-5 h-5" />
                  <span className="font-bold">{userStats.challenges}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">Challenges</p>
              </div>
            </div>
          </div>
        </ElCard>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[var(--bone-300)] rounded-xl">
          {(['achievements', 'challenges', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[var(--bone-200)] shadow-neu text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ElCard
                  className={`h-full ${!achievement.unlocked ? 'opacity-60' : ''}`}
                  hover={achievement.unlocked}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--text-primary)]">{achievement.name}</h3>
                        {achievement.unlocked ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-[var(--text-tertiary)]" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{achievement.desc}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs text-white ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </ElCard>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ElCard hover>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        <h3 className="font-semibold text-[var(--text-primary)]">{challenge.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                        <span>{challenge.participants.toLocaleString()} participants</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[var(--text-secondary)]">Progress</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {challenge.progress} / {challenge.total}
                        </span>
                      </div>
                      <div className="h-3 bg-[var(--bone-400)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--neon-cyan)]">+{challenge.reward}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">XP Reward</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
                    </div>
                  </div>
                </ElCard>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <ElCard>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    user.isYou ? 'bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30' : 'hover:bg-[var(--bone-300)]/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-amber-400 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-400 text-white' :
                    'bg-[var(--bone-400)] text-[var(--text-secondary)]'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${user.isYou ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-primary)]'}`}>
                      {user.name} {user.isYou && '(You)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--text-primary)]">{user.points.toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ElCard>
        )}
      </div>
    </div>
  );
};

export default GamificationUnified;
