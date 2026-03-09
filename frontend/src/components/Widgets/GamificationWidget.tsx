import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Target, 
  Medal, 
  Star, 
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Users
} from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface GamificationWidgetProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  rank: number;
  totalUsers: number;
  className?: string;
  onLeaderboardClick?: () => void;
  onBadgesClick?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-amber-600',
};

const rarityGlow = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-amber-400/50',
};

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  level,
  xp,
  xpToNextLevel,
  streak,
  badges,
  rank,
  totalUsers,
  className,
  onLeaderboardClick,
  onBadgesClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercent = (xp / xpToNextLevel) * 100;

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <NeuCard 
      className={className} 
      hover
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NeuCardHeader
        title="Игровой Прогресс"
        icon={<Trophy className="w-5 h-5 text-[#5c5243]" />}
        action={
          <NeuButton
            variant="flat"
            size="sm"
            onClick={onLeaderboardClick}
            rightIcon={<ChevronRight className="w-3 h-3" />}
          >
            Топ
          </NeuButton>
        }
      />

      {/* Level & XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-2xl font-bold">{level}</span>
            </motion.div>
            <div>
              <div className="text-sm text-[#5c5243]">Уровень</div>
              <div className="text-lg font-bold text-[#2d2418]">
                {level < 10 ? 'Новичок' : level < 20 ? 'Любитель' : level < 30 ? 'Продвинутый' : level < 50 ? 'Эксперт' : 'Мастер'}
              </div>
            </div>
          </div>
          
          <motion.div 
            className="text-right"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="text-xl font-bold">{streak}</span>
            </div>
            <div className="text-xs text-[#5c5243]">дней подряд</div>
          </motion.div>
        </div>

        {/* XP Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#5c5243]">XP: {xp.toLocaleString()} / {xpToNextLevel.toLocaleString()}</span>
            <span className="text-[#5c5243] font-medium">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#5c5243] via-[#8c7a6b] to-[#a69b8c] rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-full shadow-lg"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rank Badge */}
      <div className="mb-6 p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-[#5c5243]">Ваш ранг</div>
              <div className="text-lg font-bold text-[#2d2418]">#{rank.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#5c5243]">из {totalUsers.toLocaleString()}</div>
            <div className="text-xs font-medium text-[#5c5243]">
              {((rank / totalUsers) * 100).toFixed(1)}% лучших
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#5c5243]" />
            <span className="text-sm font-medium text-[#5c5243]">
              Награды: {unlockedBadges.length} / {badges.length}
            </span>
          </div>
          <NeuButton
            variant="flat"
            size="xs"
            onClick={onBadgesClick}
          >
            Все
          </NeuButton>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {badges.slice(0, 10).map((badge, index) => (
            <motion.div
              key={badge.id}
              className={`relative w-full aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all ${
                badge.unlocked 
                  ? `bg-gradient-to-br ${rarityColors[badge.rarity]} shadow-lg ${rarityGlow[badge.rarity]}` 
                  : 'bg-[#dcd3c6] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] opacity-50'
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: badge.unlocked ? 5 : 0 }}
              title={badge.name}
            >
              {badge.icon}
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-[#5c5243]/20 rotate-45" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <motion.div 
          className="text-center p-3 rounded-xl bg-[#d4ccb8]/30"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-[#2d2418]">{xp.toLocaleString()}</div>
          <div className="text-xs text-[#5c5243]">Всего XP</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 rounded-xl bg-[#d4ccb8]/30"
          whileHover={{ scale: 1.05 }}
        >
          <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-[#2d2418]">{unlockedBadges.length}</div>
          <div className="text-xs text-[#5c5243]">Наград</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 rounded-xl bg-[#d4ccb8]/30"
          whileHover={{ scale: 1.05 }}
        >
          <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-[#2d2418]">
            {rank <= 100 ? 'Top' : rank <= 1000 ? 'Pro' : 'New'}
          </div>
          <div className="text-xs text-[#5c5243]">Статус</div>
        </motion.div>
      </div>
    </NeuCard>
  );
};
