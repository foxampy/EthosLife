/**
 * ChallengesUnified - Health challenges and competitions page
 * Active challenges grid, challenge cards, progress tracking
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Clock,
  Users,
  Target,
  Flame,
  Calendar,
  ChevronRight,
  Plus,
  TrendingUp,
  Award,
  Star,
  Zap,
  CheckCircle2,
  Lock,
  Share2,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data for active challenges
const mockActiveChallenges = [
  {
    id: '1',
    title: '10K Steps Daily',
    description: 'Walk 10,000 steps every day for 30 days. Build a healthy walking habit!',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=200&fit=crop',
    category: 'Fitness',
    difficulty: 'Beginner',
    startDate: '2024-03-01',
    endDate: '2024-03-30',
    participants: 12543,
    maxParticipants: null,
    prize: '$500 Prize Pool',
    progress: 65,
    daysLeft: 12,
    joined: true,
    completed: false,
    streak: 18,
  },
  {
    id: '2',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily. Stay hydrated and feel energized!',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=200&fit=crop',
    category: 'Wellness',
    difficulty: 'Easy',
    startDate: '2024-03-05',
    endDate: '2024-03-19',
    participants: 8932,
    maxParticipants: 10000,
    prize: 'Premium Subscription',
    progress: 80,
    daysLeft: 5,
    joined: true,
    completed: false,
    streak: 10,
  },
  {
    id: '3',
    title: 'Marathon Prep',
    description: 'Train for your first marathon. 12-week structured training program.',
    image: 'https://images.unsplash.com/photo-1452626038306-3aae5e091e6a?w=400&h=200&fit=crop',
    category: 'Running',
    difficulty: 'Advanced',
    startDate: '2024-03-01',
    endDate: '2024-05-24',
    participants: 2341,
    maxParticipants: 5000,
    prize: 'Running Gear Set',
    progress: 25,
    daysLeft: 75,
    joined: true,
    completed: false,
    streak: 5,
  },
  {
    id: '4',
    title: 'Morning Yoga',
    description: 'Start your day with 15 minutes of yoga. Flexibility and mindfulness.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
    category: 'Wellness',
    difficulty: 'Beginner',
    startDate: '2024-03-10',
    endDate: '2024-04-10',
    participants: 5678,
    maxParticipants: null,
    prize: 'Yoga Mat + Classes',
    progress: 0,
    daysLeft: 28,
    joined: false,
    completed: false,
    streak: 0,
  },
  {
    id: '5',
    title: 'No Sugar March',
    description: 'Eliminate added sugar from your diet for 30 days. Feel the difference!',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop',
    category: 'Nutrition',
    difficulty: 'Intermediate',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    participants: 15432,
    maxParticipants: 20000,
    prize: '$1000 Prize Pool',
    progress: 45,
    daysLeft: 18,
    joined: false,
    completed: false,
    streak: 0,
  },
  {
    id: '6',
    title: 'Sleep Optimization',
    description: 'Get 8 hours of quality sleep every night. Track and improve your sleep.',
    image: 'https://images.unsplash.com/photo-1511296933631-18b5e7cc32db?w=400&h=200&fit=crop',
    category: 'Wellness',
    difficulty: 'Easy',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    participants: 3421,
    maxParticipants: 5000,
    prize: 'Sleep Tracker Device',
    progress: 0,
    daysLeft: 32,
    joined: false,
    completed: false,
    streak: 0,
  },
];

// Mock data for past challenges
const mockPastChallenges = [
  {
    id: '7',
    title: 'January Fitness Kickoff',
    description: 'Start the year strong with daily workouts',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop',
    category: 'Fitness',
    participants: 25678,
    result: 'Completed',
    rank: 234,
    reward: 'Gold Badge',
  },
  {
    id: '8',
    title: 'Meditation Challenge',
    description: '21 days of daily meditation practice',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop',
    category: 'Mental Health',
    participants: 12345,
    result: 'Completed',
    rank: 89,
    reward: 'Silver Badge',
  },
  {
    id: '9',
    title: 'Protein Power',
    description: 'Hit your protein goals for 14 days',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=200&fit=crop',
    category: 'Nutrition',
    participants: 8765,
    result: 'Partial',
    rank: null,
    reward: null,
  },
];

// Difficulty badge colors
const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
  Expert: 'bg-purple-100 text-purple-700',
};

// Challenge Card Component
const ChallengeCard: React.FC<{
  challenge: typeof mockActiveChallenges[0];
  onJoin: () => void;
  onView: () => void;
}> = ({ challenge, onJoin, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <ElCard variant="elevated" padding="none" className="h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-40">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category & Difficulty */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              {challenge.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>

          {/* Streak Badge */}
          {challenge.joined && challenge.streak > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
              <Flame className="w-3 h-3" />
              {challenge.streak} day streak
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-bold text-[var(--text-primary)] mb-2">{challenge.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
            {challenge.description}
          </p>

          {/* Progress Bar (if joined) */}
          {challenge.joined && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Progress</span>
                <span className="font-medium text-[var(--neon-cyan)]">{challenge.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bone-300)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${challenge.progress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)]"
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{challenge.participants.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{challenge.daysLeft} days left</span>
            </div>
            {challenge.maxParticipants && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{Math.round((challenge.participants / challenge.maxParticipants) * 100)}% full</span>
              </div>
            )}
          </div>

          {/* Prize */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--neon-amber)]/10 mb-4">
            <Trophy className="w-4 h-4 text-[var(--neon-amber)]" />
            <span className="text-sm font-medium text-[var(--neon-amber)]">{challenge.prize}</span>
          </div>

          {/* Action Button */}
          {challenge.joined ? (
            <ElButton
              variant="gradient"
              size="sm"
              fullWidth
              onClick={onView}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Progress
            </ElButton>
          ) : (
            <ElButton
              variant="elevated"
              size="sm"
              fullWidth
              onClick={onJoin}
            >
              Join Challenge
            </ElButton>
          )}
        </div>
      </ElCard>
    </motion.div>
  );
};

// Past Challenge Card
const PastChallengeCard: React.FC<{
  challenge: typeof mockPastChallenges[0];
}> = ({ challenge }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <ElCard variant="flat" padding="sm" className="flex gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          {challenge.result === 'Completed' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">{challenge.category}</span>
              <h4 className="font-semibold text-[var(--text-primary)]">{challenge.title}</h4>
            </div>
            {challenge.reward && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--neon-amber)]/10">
                <Award className="w-3 h-3 text-[var(--neon-amber)]" />
                <span className="text-xs text-[var(--neon-amber)] font-medium">{challenge.reward}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
            {challenge.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <span>{challenge.participants.toLocaleString()} participants</span>
              {challenge.rank && (
                <span className="text-[var(--neon-cyan)]">Rank #{challenge.rank}</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--text-secondary)]"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </ElCard>
    </motion.div>
  );
};

export const ChallengesUnified: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['All', 'Fitness', 'Nutrition', 'Wellness', 'Running', 'Mental Health'];

  const filteredActive = mockActiveChallenges.filter(
    (c) => filter === 'All' || c.category === filter
  );

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Challenges</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Join challenges, compete with friends, win rewards
              </p>
            </div>
            <ElButton
              variant="gradient"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create
            </ElButton>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--neon-cyan)]/10 whitespace-nowrap">
              <Trophy className="w-5 h-5 text-[var(--neon-cyan)]" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Completed</p>
                <p className="font-bold text-[var(--text-primary)]">12</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--neon-purple)]/10 whitespace-nowrap">
              <Zap className="w-5 h-5 text-[var(--neon-purple)]" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Active</p>
                <p className="font-bold text-[var(--text-primary)]">3</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--neon-amber)]/10 whitespace-nowrap">
              <Star className="w-5 h-5 text-[var(--neon-amber)]" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Rewards</p>
                <p className="font-bold text-[var(--text-primary)]">$2,500</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-[var(--neon-cyan)] text-white'
                  : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
              }`}
            >
              Active Challenges
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-[var(--neon-cyan)] text-white'
                  : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
              }`}
            >
              Past Challenges
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'active' ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                      filter === category
                        ? 'bg-[var(--neon-cyan)] text-white'
                        : 'bg-[var(--bone-300)]/50 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Featured Challenge */}
              {filteredActive.length > 0 && !filteredActive[0].joined && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-[var(--neon-pink)]" />
                    <h2 className="font-semibold text-[var(--text-primary)]">Featured Challenge</h2>
                  </div>
                  <ElCard variant="neon" glowColor="pink" padding="lg">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                        <img
                          src={filteredActive[0].image}
                          alt={filteredActive[0].title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-medium">
                            Featured
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[filteredActive[0].difficulty]}`}>
                            {filteredActive[0].difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                          {filteredActive[0].title}
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                          {filteredActive[0].description}
                        </p>
                        <div className="flex items-center gap-4">
                          <ElButton variant="gradient">Join Now</ElButton>
                          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                            <Users className="w-4 h-4" />
                            <span>{filteredActive[0].participants.toLocaleString()} joined</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ElCard>
                </div>
              )}

              {/* Challenges Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActive.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => console.log('Join:', challenge.id)}
                    onView={() => console.log('View:', challenge.id)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Summary Stats */}
              <ElCard variant="flat" className="mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-[var(--neon-cyan)]">12</p>
                    <p className="text-sm text-[var(--text-secondary)]">Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--neon-amber)]">8</p>
                    <p className="text-sm text-[var(--text-secondary)]">Top 100</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--neon-purple)]">5</p>
                    <p className="text-sm text-[var(--text-secondary)]">Badges</p>
                  </div>
                </div>
              </ElCard>

              {mockPastChallenges.map((challenge) => (
                <PastChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Challenge Modal */}
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[var(--neon-cyan)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      Create Challenge
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Inspire others to reach their goals
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-6">
                  Create a new health challenge for the community. Set goals, define rewards, 
                  and motivate others to join your journey!
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
                      console.log('Create challenge');
                    }}
                  >
                    Start Creating
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

export default ChallengesUnified;
