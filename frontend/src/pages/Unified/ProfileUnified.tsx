/**
 * ProfileUnified - User Profile Page
 * EthosLife Account Management
 * 
 * Features:
 * - Editable avatar with gradient cover
 * - Profile info (name, username, bio, location, website)
 * - Stats row (posts, following, followers, streak)
 * - Tabbed content (Overview, Activity, Achievements)
 * - Edit profile modal
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  MapPin,
  Link as LinkIcon,
  Edit3,
  Camera,
  Trophy,
  Flame,
  Users,
  FileText,
  Heart,
  Activity,
  Award,
  Star,
  Zap,
  Shield,
  Target,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ElCard, ElCardHeader, ElButton, ElInput, ElTextArea } from '../../components/ElCore';

// ============================================
// TYPES
// ============================================
interface UserProfile {
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  avatar?: string;
  coverGradient: string;
  stats: {
    posts: number;
    following: number;
    followers: number;
    streak: number;
  };
}

interface Post {
  id: number;
  content: string;
  likes: number;
  comments: number;
  date: string;
  type: 'health' | 'social' | 'achievement';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

// ============================================
// MOCK DATA
// ============================================
const mockUser: UserProfile = {
  name: 'Alexandra Chen',
  username: '@alexchen',
  bio: 'Health enthusiast • Yoga instructor • Building better habits one day at a time 🌱✨',
  location: 'San Francisco, CA',
  website: 'alexchen wellness.co',
  coverGradient: 'from-[var(--neon-cyan)] to-[var(--neon-purple)]',
  stats: {
    posts: 127,
    following: 486,
    followers: 2340,
    streak: 42,
  },
};

const mockPosts: Post[] = [
  {
    id: 1,
    content: 'Just completed my morning 5k run! Feeling energized and ready for the day 🏃‍♀️💪',
    likes: 45,
    comments: 8,
    date: '2 hours ago',
    type: 'health',
  },
  {
    id: 2,
    content: 'Hit my sleep goal for 7 days straight! Consistency is key 😴✨',
    likes: 72,
    comments: 12,
    date: 'Yesterday',
    type: 'achievement',
  },
  {
    id: 3,
    content: 'New personal best on my meditation streak! 30 days of mindfulness 🧘‍♀️',
    likes: 98,
    comments: 15,
    date: '3 days ago',
    type: 'health',
  },
  {
    id: 4,
    content: 'Celebrating with the community! Thanks for all the support 🎉',
    likes: 34,
    comments: 6,
    date: '1 week ago',
    type: 'social',
  },
];

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Early Bird',
    description: 'Complete 5 morning workouts',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-amber-400 to-orange-500',
    earned: true,
    earnedDate: 'Jan 15, 2026',
  },
  {
    id: '2',
    name: 'Step Master',
    description: 'Walk 10,000 steps for 30 days',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-emerald-400 to-teal-500',
    earned: true,
    earnedDate: 'Feb 1, 2026',
  },
  {
    id: '3',
    name: 'Sleep Champion',
    description: 'Maintain 8hr sleep for a week',
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-400 to-indigo-500',
    earned: true,
    earnedDate: 'Feb 10, 2026',
  },
  {
    id: '4',
    name: 'Community Hero',
    description: 'Help 10 community members',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-rose-400 to-pink-500',
    earned: true,
    earnedDate: 'Mar 1, 2026',
  },
  {
    id: '5',
    name: 'Goal Crusher',
    description: 'Complete 50 personal goals',
    icon: <Target className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-500',
    earned: false,
  },
  {
    id: '6',
    name: 'Verified',
    description: 'Complete profile verification',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500',
    earned: true,
    earnedDate: 'Jan 1, 2026',
  },
];

// ============================================
// COMPONENTS
// ============================================

const StatCard: React.FC<{
  value: number;
  label: string;
  icon: React.ReactNode;
}> = ({ value, label, icon }) => (
  <div className="flex flex-col items-center p-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[var(--text-tertiary)]">{icon}</span>
      <span className="text-2xl font-bold text-[var(--text-primary)]">
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </span>
    </div>
    <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
  </div>
);

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const typeColors = {
    health: 'bg-emerald-100 text-emerald-700',
    social: 'bg-blue-100 text-blue-700',
    achievement: 'bg-amber-100 text-amber-700',
  };

  const typeLabels = {
    health: 'Health',
    social: 'Social',
    achievement: 'Achievement',
  };

  return (
    <ElCard variant="elevated" className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-[var(--text-primary)]">{mockUser.name}</span>
            <span className="text-[var(--text-tertiary)] text-sm">{mockUser.username}</span>
            <span className="text-[var(--text-tertiary)] text-sm">·</span>
            <span className="text-[var(--text-tertiary)] text-sm">{post.date}</span>
          </div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${typeColors[post.type]}`}>
            {typeLabels[post.type]}
          </span>
          <p className="text-[var(--text-primary)] mb-3">{post.content}</p>
          <div className="flex items-center gap-6 text-[var(--text-secondary)] text-sm">
            <button className="flex items-center gap-1.5 hover:text-[var(--neon-pink)] transition-colors">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[var(--neon-cyan)] transition-colors">
              <FileText className="w-4 h-4" />
              <span>{post.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </ElCard>
  );
};

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative p-6 rounded-3xl ${
      badge.earned
        ? 'bg-gradient-to-br ' + badge.color
        : 'bg-[var(--bone-300)] opacity-60'
    }`}
  >
    <div className={`${badge.earned ? 'text-white' : 'text-[var(--text-tertiary)]'}`}>
      <div className="mb-3">{badge.icon}</div>
      <h4 className="font-bold text-lg mb-1">{badge.name}</h4>
      <p className={`text-sm ${badge.earned ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
        {badge.description}
      </p>
      {badge.earned && badge.earnedDate && (
        <p className="text-xs text-white/60 mt-2">Earned {badge.earnedDate}</p>
      )}
    </div>
    {badge.earned && (
      <div className="absolute top-4 right-4">
        <Award className="w-5 h-5 text-white/80" />
      </div>
    )}
  </motion.div>
);

const HealthSummary: React.FC = () => (
  <div className="space-y-4">
    <ElCard variant="elevated">
      <ElCardHeader
        title="Health Overview"
        subtitle="Your wellness metrics this week"
        icon={<Activity className="w-5 h-5" />}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bone-300)]">
          <p className="text-3xl font-bold text-[var(--neon-cyan)]">8.2</p>
          <p className="text-sm text-[var(--text-secondary)]">Avg Sleep (hrs)</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bone-300)]">
          <p className="text-3xl font-bold text-[var(--neon-green)]">12,450</p>
          <p className="text-sm text-[var(--text-secondary)]">Avg Steps</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bone-300)]">
          <p className="text-3xl font-bold text-[var(--neon-amber)]">85%</p>
          <p className="text-sm text-[var(--text-secondary)]">Goal Progress</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bone-300)]">
          <p className="text-3xl font-bold text-[var(--neon-purple)]">24</p>
          <p className="text-sm text-[var(--text-secondary)]">Workouts</p>
        </div>
      </div>
    </ElCard>

    <ElCard variant="elevated">
      <ElCardHeader
        title="Current Streaks"
        subtitle="Keep the momentum going!"
        icon={<Flame className="w-5 h-5 text-orange-500" />}
      />
      <div className="space-y-3">
        {[
          { name: 'Daily Steps', days: 42, color: 'var(--neon-green)' },
          { name: 'Sleep Schedule', days: 15, color: 'var(--neon-purple)' },
          { name: 'Meditation', days: 30, color: 'var(--neon-cyan)' },
        ].map((streak) => (
          <div key={streak.name} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]">
            <span className="text-[var(--text-primary)] font-medium">{streak.name}</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: streak.color }} />
              <span className="font-bold" style={{ color: streak.color }}>{streak.days} days</span>
            </div>
          </div>
        ))}
      </div>
    </ElCard>
  </div>
);

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState(user);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ElCard variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Profile</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--bone-300)] flex items-center justify-center hover:bg-[var(--bone-400)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white text-2xl font-bold">
                    {formData.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--bone-200)] shadow-neu flex items-center justify-center hover:shadow-neu-inset transition-shadow">
                    <Camera className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              <ElInput
                label="Display Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />

              <ElInput
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
              />

              <ElTextArea
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                fullWidth
              />

              <ElInput
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                fullWidth
              />

              <ElInput
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                fullWidth
              />

              <div className="flex gap-3 pt-4">
                <ElButton variant="flat" fullWidth onClick={onClose}>
                  Cancel
                </ElButton>
                <ElButton variant="gradient" fullWidth onClick={onClose}>
                  Save Changes
                </ElButton>
              </div>
            </div>
          </ElCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ProfileUnified: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'activity' as const, label: 'Activity', icon: FileText },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-[var(--bone-300)] shadow-neu flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
          </motion.button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Cover & Avatar */}
        <div className="relative mb-20">
          {/* Cover Image */}
          <div className={`h-48 rounded-3xl bg-gradient-to-r ${mockUser.coverGradient} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`
              }} />
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[var(--bone-200)] bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white text-3xl font-bold shadow-neu">
                {mockUser.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--bone-200)] shadow-neu flex items-center justify-center hover:shadow-neu-inset transition-shadow">
                <Camera className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute -bottom-12 right-6">
            <ElButton
              variant="elevated"
              size="sm"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </ElButton>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-2 mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{mockUser.name}</h1>
          <p className="text-[var(--text-secondary)]">{mockUser.username}</p>
          
          <p className="mt-3 text-[var(--text-primary)] max-w-xl">{mockUser.bio}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{mockUser.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <a href="#" className="text-[var(--neon-cyan)] hover:underline">{mockUser.website}</a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <ElCard variant="inset" className="mb-6">
          <div className="grid grid-cols-4 divide-x divide-[var(--bone-400)]/50">
            <StatCard value={mockUser.stats.posts} label="Posts" icon={<FileText className="w-4 h-4" />} />
            <StatCard value={mockUser.stats.following} label="Following" icon={<Users className="w-4 h-4" />} />
            <StatCard value={mockUser.stats.followers} label="Followers" icon={<Users className="w-4 h-4" />} />
            <StatCard value={mockUser.stats.streak} label="Streak" icon={<Flame className="w-4 h-4 text-orange-500" />} />
          </div>
        </ElCard>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-lg'
                  : 'bg-[var(--bone-300)] text-[var(--text-secondary)] hover:bg-[var(--bone-400)]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <HealthSummary />
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <ElCard variant="elevated" className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-amber)] to-orange-500 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Achievement Progress</h3>
                      <p className="text-[var(--text-secondary)]">
                        You've earned <span className="font-bold text-[var(--neon-amber)]">5 out of 6</span> badges
                      </p>
                    </div>
                  </div>
                </ElCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockBadges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={mockUser}
      />
    </div>
  );
};

export default ProfileUnified;
