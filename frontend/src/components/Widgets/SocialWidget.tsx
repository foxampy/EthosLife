import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, ChevronRight, Trophy } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuOrb, NeuStatusOrb } from '../Neumorphism/NeuOrb';

export interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export interface Challenge {
  id: string;
  name: string;
  progress: number;
  total: number;
  participants: number;
  endDate: string;
}

export interface SocialWidgetProps {
  activities: ActivityItem[];
  challenges: Challenge[];
  onlineFriends: number;
  unreadMessages: number;
  className?: string;
  onCommunityClick?: () => void;
}

export const SocialWidget: React.FC<SocialWidgetProps> = ({
  activities,
  challenges,
  onlineFriends,
  unreadMessages,
  className,
  onCommunityClick,
}) => {
  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Social"
        icon={<Users className="w-5 h-5" />}
        action={
          <div className="flex items-center gap-2">
            {unreadMessages > 0 && (
              <motion.div
                className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {unreadMessages}
              </motion.div>
            )}
            <NeuButton variant="flat" size="sm" onClick={onCommunityClick} rightIcon={<ChevronRight className="w-3 h-3" />}>
              Community
            </NeuButton>
          </div>
        }
      />

      {/* Online friends indicator */}
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <NeuOrb size="sm" variant="elevated">
            <Users className="w-4 h-4 text-[#5c5243]" />
          </NeuOrb>
          <div className="absolute -bottom-0.5 -right-0.5">
            <NeuStatusOrb status="online" size="sm" pulse />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#2d2418]">{onlineFriends} friends online</p>
          <p className="text-xs text-[#5c5243]">Join the conversation</p>
        </div>
        <NeuButton variant="inset" size="sm">
          <MessageCircle className="w-4 h-4" />
        </NeuButton>
      </motion.div>

      {/* Recent activity */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Recent Activity</p>
        {activities.slice(0, 3).map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#dcd3c6]/30 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <span className="text-2xl">{activity.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#2d2418] truncate">
                <span className="font-semibold">{activity.user}</span>{' '}
                <span className="text-[#5c5243]">{activity.action}</span>{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-[10px] text-[#8c7a6b]">{activity.time}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-red-100 transition-colors">
              <Heart className="w-3.5 h-3.5 text-[#8c7a6b] hover:text-red-500" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Active challenges */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Active Challenges</p>
        {challenges.slice(0, 2).map((challenge, index) => (
          <motion.div
            key={challenge.id}
            className="p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-[#2d2418] text-sm">{challenge.name}</span>
              </div>
              <span className="text-xs text-[#5c5243]">{challenge.progress}/{challenge.total}</span>
            </div>
            <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                transition={{ delay: 0.4 + index * 0.1 }}
              />
            </div>
            <p className="text-[10px] text-[#5c5243] mt-1">
              {challenge.participants.toLocaleString()} participants • Ends {challenge.endDate}
            </p>
          </motion.div>
        ))}
      </div>
    </NeuCard>
  );
};
