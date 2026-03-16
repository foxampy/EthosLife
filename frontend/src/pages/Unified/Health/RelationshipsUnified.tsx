/**
 * RelationshipsUnified - Relationships/Social Health Module Page
 * Social connections, interactions tracking, and check-in reminders
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Phone,
  Video,
  Coffee,
  Gift,
  Star,
  UserPlus,
  Bell,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data
const SOCIAL_SCORE = {
  current: 78,
  lastWeek: 72,
  trend: '+8%',
};

const CONNECTIONS = [
  {
    id: 1,
    name: 'Sarah Chen',
    relationship: 'Friend',
    avatar: 'SC',
    color: 'from-pink-500 to-rose-500',
    lastContact: '2 days ago',
    streak: 5,
    nextCheckIn: 'Tomorrow',
  },
  {
    id: 2,
    name: 'Mike Johnson',
    relationship: 'Family',
    avatar: 'MJ',
    color: 'from-blue-500 to-cyan-500',
    lastContact: '1 week ago',
    streak: 0,
    nextCheckIn: 'Today',
  },
  {
    id: 3,
    name: 'Emma Davis',
    relationship: 'Colleague',
    avatar: 'ED',
    color: 'from-violet-500 to-purple-500',
    lastContact: '3 days ago',
    streak: 12,
    nextCheckIn: 'In 2 days',
  },
];

const RECENT_INTERACTIONS = [
  { id: 1, name: 'Sarah Chen', type: 'call', time: '2 days ago', duration: '45 min', icon: Phone },
  { id: 2, name: 'Emma Davis', type: 'coffee', time: '3 days ago', duration: '2 hours', icon: Coffee },
  { id: 3, name: 'Mike Johnson', type: 'message', time: '1 week ago', duration: '', icon: MessageCircle },
];

const CHECKIN_REMINDERS = [
  { id: 1, name: 'Mike Johnson', due: 'Today', overdue: true, avatar: 'MJ', color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Sarah Chen', due: 'Tomorrow', overdue: false, avatar: 'SC', color: 'from-pink-500 to-rose-500' },
];

const WEEKLY_STATS = [
  { day: 'Mon', interactions: 3 },
  { day: 'Tue', interactions: 1 },
  { day: 'Wed', interactions: 4 },
  { day: 'Thu', interactions: 2 },
  { day: 'Fri', interactions: 0 },
  { day: 'Sat', interactions: 5 },
  { day: 'Sun', interactions: 2 },
];

// Social Score Ring
const SocialScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 140 }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bone-400)"
          strokeWidth="10"
        />
        <defs>
          <linearGradient id="socialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#socialGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Heart className="w-6 h-6 text-rose-500 mb-1" />
        <motion.span
          className="text-3xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[var(--text-secondary)]">Social Score</span>
      </div>
    </div>
  );
};

// Connection Card
const ConnectionCard: React.FC<{
  connection: typeof CONNECTIONS[0];
  delay?: number;
}> = ({ connection, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-3 rounded-xl bg-[var(--bone-300)]/30 hover:bg-[var(--bone-300)]/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${connection.color} flex items-center justify-center text-white font-bold`}>
        {connection.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--text-primary)] text-sm truncate">{connection.name}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{connection.relationship}</p>
      </div>
      {connection.streak > 0 && (
        <div className="flex items-center gap-1 text-amber-500">
          <span className="text-xs">🔥</span>
          <span className="text-xs font-medium">{connection.streak}</span>
        </div>
      )}
    </div>
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--bone-400)]/20">
      <span className="text-xs text-[var(--text-tertiary)]">Last: {connection.lastContact}</span>
      <span className="text-xs text-[var(--text-secondary)]">Next: {connection.nextCheckIn}</span>
    </div>
  </motion.div>
);

// Quick Action Button
const QuickActionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
  delay?: number;
}> = ({ icon: Icon, label, color, onClick, delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center p-3 rounded-xl bg-[var(--bone-300)]/30 hover:bg-[var(--bone-300)]/50 transition-colors"
  >
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-2`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-xs text-[var(--text-secondary)]">{label}</span>
  </motion.button>
);

export const RelationshipsUnified: React.FC = () => {
  const { t } = useTranslation();
  const [connections] = useState(CONNECTIONS);

  return (
    <div className="min-h-screen bg-[var(--bone-200)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('relationships.title', 'Relationships')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('relationships.subtitle', 'Nurture your connections')}
              </p>
            </div>
          </div>
          <ElButton variant="gradient" leftIcon={<UserPlus className="w-4 h-4" />}>
            {t('relationships.addPerson', 'Add Person')}
          </ElButton>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Social Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ElCard className="h-full">
              <div className="flex flex-col items-center">
                <SocialScoreRing score={SOCIAL_SCORE.current} />
                
                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">{SOCIAL_SCORE.trend}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">vs last week</span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">17</p>
                    <p className="text-xs text-[var(--text-secondary)]">Connections</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">3</p>
                    <p className="text-xs text-[var(--text-secondary)]">This Week</p>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="mt-6">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Weekly Interactions</p>
                <div className="flex items-end justify-between gap-1 h-20">
                  {WEEKLY_STATS.map((day, idx) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.interactions / 5) * 100}%` }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.4 }}
                        className="w-full rounded-t bg-gradient-to-t from-pink-400 to-rose-400"
                      />
                      <span className="text-xs text-[var(--text-tertiary)] mt-1">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Recent Interactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                {t('relationships.recentInteractions', 'Recent Interactions')}
              </h3>

              <div className="space-y-3">
                {RECENT_INTERACTIONS.map((interaction, idx) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bone-300)]/30"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                      <interaction.icon className="w-5 h-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)] text-sm">{interaction.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{interaction.time}</p>
                    </div>
                    {interaction.duration && (
                      <span className="text-xs text-[var(--text-secondary)]">{interaction.duration}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <p className="text-xs text-[var(--text-secondary)] mb-3">Quick Actions</p>
                <div className="grid grid-cols-4 gap-2">
                  <QuickActionButton icon={Phone} label="Call" color="bg-emerald-500" delay={0.5} />
                  <QuickActionButton icon={Video} label="Video" color="bg-blue-500" delay={0.55} />
                  <QuickActionButton icon={Coffee} label="Meet" color="bg-amber-500" delay={0.6} />
                  <QuickActionButton icon={Gift} label="Gift" color="bg-rose-500" delay={0.65} />
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Check-in Reminders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                {t('relationships.checkInReminders', 'Check-in Reminders')}
              </h3>

              <div className="space-y-3">
                {CHECKIN_REMINDERS.map((reminder, idx) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`p-3 rounded-xl ${
                      reminder.overdue 
                        ? 'bg-amber-50 border border-amber-100' 
                        : 'bg-[var(--bone-300)]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${reminder.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {reminder.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--text-primary)] text-sm">{reminder.name}</p>
                        <p className={`text-xs ${reminder.overdue ? 'text-amber-600 font-medium' : 'text-[var(--text-tertiary)]'}`}>
                          {reminder.overdue ? '⚠️ Overdue: ' : 'Due: '}{reminder.due}
                        </p>
                      </div>
                      <ElButton variant="flat" size="xs">
                        Check In
                      </ElButton>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Top Connections */}
              <div className="mt-6 pt-4 border-t border-[var(--bone-400)]/30">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  {t('relationships.topConnections', 'Top Connections')}
                </h4>
                <div className="space-y-2">
                  {connections.map((connection, idx) => (
                    <ConnectionCard 
                      key={connection.id} 
                      connection={connection} 
                      delay={0.5 + idx * 0.1}
                    />
                  ))}
                </div>
              </div>
            </ElCard>
          </motion.div>
        </div>

        {/* Add Relationship Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">{t('relationships.addRelationship', 'Add New Relationship')}</p>
                <p className="text-xs text-white/80">
                  {t('relationships.addRelationshipDesc', 'Track and nurture new connections')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RelationshipsUnified;
