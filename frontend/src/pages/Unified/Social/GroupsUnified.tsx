/**
 * GroupsUnified - Facebook Groups-like community groups page
 * My groups list, discover groups, group cards
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Plus,
  Settings,
  TrendingUp,
  Clock,
  Globe,
  Lock,
  ChevronRight,
  MoreHorizontal,
  Flame,
  Award,
  Heart,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data for my groups
const mockMyGroups = [
  {
    id: '1',
    name: 'Morning Runners Club',
    description: 'A community for early morning running enthusiasts',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=200&fit=crop',
    memberCount: 12453,
    lastActivity: '2 minutes ago',
    isPrivate: false,
    unreadPosts: 5,
    isAdmin: false,
  },
  {
    id: '2',
    name: 'Healthy Meal Prep',
    description: 'Share and discover nutritious meal prep ideas',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop',
    memberCount: 8932,
    lastActivity: '15 minutes ago',
    isPrivate: false,
    unreadPosts: 12,
    isAdmin: true,
  },
  {
    id: '3',
    name: 'Yoga & Mindfulness',
    description: 'Daily yoga practices and meditation techniques',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
    memberCount: 5671,
    lastActivity: '1 hour ago',
    isPrivate: true,
    unreadPosts: 0,
    isAdmin: false,
  },
  {
    id: '4',
    name: 'Weight Loss Support',
    description: 'Supportive community for weight loss journeys',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop',
    memberCount: 23456,
    lastActivity: '30 minutes ago',
    isPrivate: false,
    unreadPosts: 8,
    isAdmin: false,
  },
];

// Mock data for discover groups
const mockDiscoverGroups = [
  {
    id: '5',
    name: 'HIIT Workout Warriors',
    description: 'High-intensity interval training enthusiasts',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop',
    memberCount: 4567,
    category: 'Fitness',
    trending: true,
  },
  {
    id: '6',
    name: 'Plant-Based Nutrition',
    description: 'Learn about plant-based diets and recipes',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
    memberCount: 3456,
    category: 'Nutrition',
    trending: false,
  },
  {
    id: '7',
    name: 'Sleep Optimization',
    description: 'Improve your sleep quality and recovery',
    image: 'https://images.unsplash.com/photo-1511296933631-18b5e7cc32db?w=400&h=200&fit=crop',
    memberCount: 2891,
    category: 'Wellness',
    trending: true,
  },
  {
    id: '8',
    name: 'Marathon Training',
    description: 'From 5K to full marathon - train together',
    image: 'https://images.unsplash.com/photo-1452626038306-3aae5e091e6a?w=400&h=200&fit=crop',
    memberCount: 6723,
    category: 'Running',
    trending: false,
  },
  {
    id: '9',
    name: 'Mental Health Matters',
    description: 'A safe space for mental health discussions',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=200&fit=crop',
    memberCount: 12345,
    category: 'Mental Health',
    trending: true,
  },
];

// Group Card Component (My Groups)
const MyGroupCard: React.FC<{
  group: typeof mockMyGroups[0];
  onEnter: () => void;
}> = ({ group, onEnter }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <ElCard variant="elevated" padding="none" className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-32">
          <img
            src={group.image}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Privacy Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
            {group.isPrivate ? (
              <>
                <Lock className="w-3 h-3" />
                <span>Private</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </>
            )}
          </div>

          {/* Admin Badge */}
          {group.isAdmin && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[var(--neon-cyan)] text-white text-xs font-medium">
              Admin
            </div>
          )}

          {/* Unread Badge */}
          {group.unreadPosts > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
              {group.unreadPosts}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[var(--text-primary)] mb-1 truncate">
            {group.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
            {group.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{group.memberCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{group.lastActivity}</span>
            </div>
          </div>

          {/* Action Button */}
          <ElButton
            variant={group.unreadPosts > 0 ? 'gradient' : 'elevated'}
            size="sm"
            fullWidth
            onClick={onEnter}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            {group.unreadPosts > 0 ? 'New Posts' : 'Enter Group'}
          </ElButton>
        </div>
      </ElCard>
    </motion.div>
  );
};

// Discover Group Card
const DiscoverGroupCard: React.FC<{
  group: typeof mockDiscoverGroups[0];
  onJoin: () => void;
}> = ({ group, onJoin }) => {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <ElCard variant="flat" padding="sm" className="flex gap-3">
        {/* Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={group.image}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          {group.trending && (
            <div className="absolute top-0 left-0 w-full py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold text-center">
              <Flame className="w-3 h-3 inline mr-0.5" />
              HOT
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[var(--neon-cyan)] font-medium">
                {group.category}
              </span>
              <h4 className="font-semibold text-[var(--text-primary)] truncate">
                {group.name}
              </h4>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">
            {group.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--text-tertiary)]">
              {group.memberCount.toLocaleString()} members
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsJoined(!isJoined)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isJoined
                  ? 'bg-[var(--bone-300)] text-[var(--text-secondary)]'
                  : 'bg-[var(--neon-cyan)] text-white'
              }`}
            >
              {isJoined ? 'Joined' : 'Join'}
            </motion.button>
          </div>
        </div>
      </ElCard>
    </motion.div>
  );
};

// Category Filter
const categories = ['All', 'Fitness', 'Nutrition', 'Wellness', 'Running', 'Mental Health'];

export const GroupsUnified: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredMyGroups = mockMyGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscoverGroups = mockDiscoverGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'All' || g.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Groups</h1>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-[var(--bone-300)]/50"
              >
                <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
              </motion.button>
              <ElButton
                variant="gradient"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowCreateModal(true)}
              >
                Create
              </ElButton>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bone-300)]/50 border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('my-groups')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === 'my-groups'
                  ? 'bg-[var(--neon-cyan)] text-white'
                  : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
              }`}
            >
              My Groups
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === 'discover'
                  ? 'bg-[var(--neon-cyan)] text-white'
                  : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
              }`}
            >
              Discover
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'my-groups' ? (
            <motion.div
              key="my-groups"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <ElCard variant="flat" padding="sm" className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-[var(--neon-cyan)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">4</p>
                  <p className="text-xs text-[var(--text-secondary)]">Groups Joined</p>
                </ElCard>
                <ElCard variant="flat" padding="sm" className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--neon-purple)]/10 flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-[var(--neon-purple)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">1</p>
                  <p className="text-xs text-[var(--text-secondary)]">Admin Of</p>
                </ElCard>
                <ElCard variant="flat" padding="sm" className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--neon-pink)]/10 flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 text-[var(--neon-pink)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">25</p>
                  <p className="text-xs text-[var(--text-secondary)]">New Posts</p>
                </ElCard>
              </div>

              {/* My Groups Grid */}
              {filteredMyGroups.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredMyGroups.map((group) => (
                    <MyGroupCard
                      key={group.id}
                      group={group}
                      onEnter={() => console.log('Enter group:', group.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">No groups found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[var(--neon-cyan)] text-white'
                        : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Trending Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[var(--neon-amber)]" />
                  <h2 className="font-semibold text-[var(--text-primary)]">Trending Now</h2>
                </div>
                <div className="space-y-3">
                  {filteredDiscoverGroups
                    .filter((g) => g.trending)
                    .map((group) => (
                      <DiscoverGroupCard
                        key={group.id}
                        group={group}
                        onJoin={() => console.log('Join:', group.id)}
                      />
                    ))}
                </div>
              </div>

              {/* All Groups */}
              <div>
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">Recommended for You</h2>
                <div className="space-y-3">
                  {filteredDiscoverGroups
                    .filter((g) => !g.trending)
                    .map((group) => (
                      <DiscoverGroupCard
                        key={group.id}
                        group={group}
                        onJoin={() => console.log('Join:', group.id)}
                      />
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Group Modal (placeholder) */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ElCard variant="glass" className="max-w-md w-full">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Create New Group
                </h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  Start a new community around your health interests. Share your journey with others!
                </p>
                <div className="flex gap-3">
                  <ElButton
                    variant="flat"
                    fullWidth
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </ElButton>
                  <ElButton
                    variant="gradient"
                    fullWidth
                    onClick={() => {
                      setShowCreateModal(false);
                      console.log('Create group');
                    }}
                  >
                    Create Group
                  </ElButton>
                </div>
              </ElCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupsUnified;
