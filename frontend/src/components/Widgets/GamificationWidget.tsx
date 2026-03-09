import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, ChevronRight, Zap, Target } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuOrb } from '../Neumorphism/NeuOrb';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

export interface GamificationWidgetProps {
  level: number;
  xp: number;
  xpToNext: number;
  leaderboardPosition: number;
  recentBadges: Badge[];
  dailyChallenges: {
    id: string;
    title: string;
    progress: number;
    total: number;
    reward: number;
  }[];
  className?: string;
  onViewAllClick?: () => void;
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-600 border-gray-200',
  rare: 'bg-blue-100 text-blue-600 border-blue-200',
  epic: 'bg-purple-100 text-purple-600 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

const rarityGlow = {
  common: '',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-200',
  legendary: 'shadow-yellow-200',
};

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  level,
  xp,
  xpToNext,
  leaderboardPosition,
  recentBadges,
  dailyChallenges,
  className,
  onViewAllClick,
}) => {
  const xpProgress = (xp / xpToNext) * 100;

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Achievements"
        icon={<Trophy className="w-5 h-5 text-yellow-500" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onViewAllClick} rightIcon={<ChevronRight className="w-3 h-3" />}>
            View All
          </NeuButton>
        }
      />

      {/* Level and XP */}
      <div className="flex items-center gap-4 mb-5">
        <NeuOrb size="lg" variant="glow" color="#fef3c7">
          <span className="text-2xl font-bold text-yellow-700">{level}</span>
        </NeuOrb>

        <div className="flex-1">
          <p className="font-bold text-[#2d2418]">Level {level}</p>
          <div className="mt-1 h-2.5 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-[#5c5243] mt-1">
            {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
          </p>
        </div>
      </div>

      {/* Leaderboard badge */}
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#3d3226] text-white mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Award className="w-5 h-5" />
        <div className="flex-1">
          <p className="text-xs opacity-80">Leaderboard Position</p>
          <p className="font-bold">#{leaderboardPosition}</p>
        </div>
        <ChevronRight className="w-4 h-4 opacity-60" />
      </motion.div>

      {/* Recent badges */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Recent Badges</p>
        {recentBadges.slice(0, 2).map((badge, index) => (
          <motion.div
            key={badge.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white shadow-sm ${rarityGlow[badge.rarity]}`}>
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2d2418] truncate">{badge.name}</p>
              <p className="text-xs text-[#5c5243] truncate">{badge.description}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rarityColors[badge.rarity]}`}>
              {badge.rarity}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Daily challenges */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Daily Challenges</p>
        {dailyChallenges.slice(0, 2).map((challenge, index) => (
          <motion.div
            key={challenge.id}
            className="p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[#2d2418]">{challenge.title}</span>
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Zap className="w-3 h-3" />
                <span>+{challenge.reward} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]">
                <motion.div
                  className="h-full rounded-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              </div>
              <span className="text-xs font-medium text-[#5c5243]">{challenge.progress}/{challenge.total}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </NeuCard>
  );
};
