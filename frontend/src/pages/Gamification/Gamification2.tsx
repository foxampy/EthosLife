import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'special';
type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
type RewardCategory = 'theme' | 'avatar' | 'frame' | 'content' | 'premium';
type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';
type LeaderboardCategory = 'steps' | 'sleep' | 'nutrition' | 'overall';
type BadgeCategory = 'activity' | 'nutrition' | 'sleep' | 'mental' | 'social' | 'streaks';

interface User {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  rank: string;
  streak: number;
  bestStreak: number;
  unityTokens: number;
  username: string;
  avatar: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: Rarity;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  tokenReward: number;
  progress: number;
  target: number;
  timeRemaining: string;
  joined: boolean;
  participants: number;
  category: BadgeCategory;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: RewardCategory;
  price: number;
  owned: boolean;
  limited: boolean;
  limitedUntil?: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  level: number;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'same';
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  completed: boolean;
  progress: number;
  target: number;
}

// ============================================================================
// NEUMORPHISM STYLES
// ============================================================================

const neuStyles = {
  flat: `bg-[#e4dfd5] rounded-2xl`,
  pressed: `bg-[#e4dfd5] rounded-2xl shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]`,
  convex: `bg-[#e4dfd5] rounded-2xl shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)]`,
  concave: `bg-[#e4dfd5] rounded-2xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]`,
  button: `bg-[#e4dfd5] rounded-xl shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] transition-all duration-200`,
  buttonPressed: `bg-[#e4dfd5] rounded-xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]`,
  input: `bg-[#e4dfd5] rounded-xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30`,
  card: `bg-[#e4dfd5] rounded-2xl shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)]`,
  cardHover: `hover:shadow-[8px_8px_16px_rgba(44,40,34,0.2),-8px_-8px_16px_rgba(255,255,255,0.7)] transition-all duration-300`,
  badge: `bg-[#e4dfd5] rounded-xl shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]`,
  xpBar: `h-4 rounded-full bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]`,
};

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const RARITY_COLORS: Record<Rarity, { bg: string; text: string; border: string }> = {
  common: { bg: 'from-[#9ca3af] to-[#6b7280]', text: 'text-[#6b7280]', border: 'border-[#9ca3af]' },
  rare: { bg: 'from-[#60a5fa] to-[#3b82f6]', text: 'text-blue-500', border: 'border-blue-400' },
  epic: { bg: 'from-[#c084fc] to-[#a855f7]', text: 'text-purple-500', border: 'border-purple-400' },
  legendary: { bg: 'from-[#fbbf24] via-[#f59e0b] to-[#ea580c]', text: 'text-amber-500', border: 'border-amber-400' },
};

const CATEGORY_ICONS: Record<string, string> = {
  activity: '🏃',
  nutrition: '🥗',
  sleep: '😴',
  mental: '🧠',
  streaks: '🔥',
  special: '✨',
  social: '👥',
};

const MOCK_USER: User = {
  level: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalXP: 15450,
  rank: 'Wellness Warrior',
  streak: 23,
  bestStreak: 45,
  unityTokens: 1250,
  username: 'HealthHero',
  avatar: '🦁',
};

const MOCK_BADGES: Badge[] = [
  // Activity
  { id: 'a1', name: 'First Steps', description: 'Walk 1,000 steps', icon: '👟', category: 'activity', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-15', progress: 1000, maxProgress: 1000 },
  { id: 'a2', name: 'Step Master', description: 'Walk 10,000 steps', icon: '🏃', category: 'activity', rarity: 'rare', xpReward: 150, unlocked: true, unlockedAt: '2026-02-03', progress: 10000, maxProgress: 10000 },
  { id: 'a3', name: 'Marathon Runner', description: '100K steps/week', icon: '🏆', category: 'activity', rarity: 'epic', xpReward: 500, unlocked: false, progress: 65000, maxProgress: 100000 },
  { id: 'a4', name: 'Iron Man', description: '30 workouts', icon: '💪', category: 'activity', rarity: 'legendary', xpReward: 1000, unlocked: false, progress: 18, maxProgress: 30 },
  
  // Nutrition
  { id: 'n1', name: 'Logger', description: 'Log first meal', icon: '📝', category: 'nutrition', rarity: 'common', xpReward: 25, unlocked: true, unlockedAt: '2026-01-10', progress: 1, maxProgress: 1 },
  { id: 'n2', name: 'Meal Prepper', description: '7 days logging', icon: '🥗', category: 'nutrition', rarity: 'rare', xpReward: 200, unlocked: true, unlockedAt: '2026-02-10', progress: 7, maxProgress: 7 },
  { id: 'n3', name: 'Protein Pro', description: '30 days protein goal', icon: '🥩', category: 'nutrition', rarity: 'epic', xpReward: 400, unlocked: false, progress: 12, maxProgress: 30 },
  { id: 'n4', name: 'Hydration Hero', description: '2L water x 30 days', icon: '💧', category: 'nutrition', rarity: 'rare', xpReward: 250, unlocked: false, progress: 15, maxProgress: 30 },
  
  // Sleep
  { id: 's1', name: 'Early Bird', description: 'Sleep before 10 PM', icon: '🌙', category: 'sleep', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-20', progress: 1, maxProgress: 1 },
  { id: 's2', name: 'Sleep Champion', description: '8h x 7 nights', icon: '😴', category: 'sleep', rarity: 'rare', xpReward: 200, unlocked: true, unlockedAt: '2026-02-15', progress: 7, maxProgress: 7 },
  { id: 's3', name: 'Sleep Master', description: 'Score >85 x 30 days', icon: '✨', category: 'sleep', rarity: 'epic', xpReward: 500, unlocked: false, progress: 8, maxProgress: 30 },
  
  // Mental
  { id: 'm1', name: 'Mindful Beginner', description: '5 min meditation', icon: '🧘', category: 'mental', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-12', progress: 1, maxProgress: 1 },
  { id: 'm2', name: 'Zen Master', description: '100 min total', icon: '☮️', category: 'mental', rarity: 'rare', xpReward: 300, unlocked: false, progress: 45, maxProgress: 100 },
  { id: 'm3', name: 'Mood Tracker', description: '30 days logging', icon: '😊', category: 'mental', rarity: 'epic', xpReward: 400, unlocked: false, progress: 23, maxProgress: 30 },
  
  // Streaks
  { id: 'st1', name: 'On Fire', description: '7 day streak', icon: '🔥', category: 'streaks', rarity: 'common', xpReward: 100, unlocked: true, unlockedAt: '2026-01-18', progress: 7, maxProgress: 7 },
  { id: 'st2', name: 'Unstoppable', description: '30 day streak', icon: '⚡', category: 'streaks', rarity: 'rare', xpReward: 300, unlocked: true, unlockedAt: '2026-02-20', progress: 30, maxProgress: 30 },
  { id: 'st3', name: 'Legend', description: '100 day streak', icon: '👑', category: 'streaks', rarity: 'legendary', xpReward: 2000, unlocked: false, progress: 23, maxProgress: 100 },
  
  // Social
  { id: 'so1', name: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', category: 'social', rarity: 'rare', xpReward: 350, unlocked: false, progress: 2, maxProgress: 5 },
  { id: 'so2', name: 'Team Player', description: 'Join 3 challenges', icon: '🤝', category: 'social', rarity: 'common', xpReward: 75, unlocked: true, unlockedAt: '2026-01-25', progress: 3, maxProgress: 3 },
];

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'd1', title: 'Step Sprint', description: 'Walk 8,000 steps today', type: 'daily', difficulty: 'easy', xpReward: 100, tokenReward: 10, progress: 6500, target: 8000, timeRemaining: '14h 32m', joined: true, participants: 1243, category: 'activity' },
  { id: 'd2', title: 'Hydration Check', description: 'Drink 2L of water', type: 'daily', difficulty: 'easy', xpReward: 80, tokenReward: 8, progress: 1500, target: 2000, timeRemaining: '14h 32m', joined: true, participants: 2156, category: 'nutrition' },
  { id: 'd3', title: 'Mindful Moment', description: 'Meditate 10 min', type: 'daily', difficulty: 'easy', xpReward: 120, tokenReward: 12, progress: 0, target: 10, timeRemaining: '14h 32m', joined: false, participants: 892, category: 'mental' },
  { id: 'w1', title: 'Perfect Week', description: 'Log meals 7 days', type: 'weekly', difficulty: 'medium', xpReward: 500, tokenReward: 50, progress: 4, target: 7, timeRemaining: '3d 14h', joined: true, participants: 567, category: 'nutrition' },
  { id: 'w2', title: 'Sleep Champion', description: '8h sleep x 5 nights', type: 'weekly', difficulty: 'medium', xpReward: 600, tokenReward: 60, progress: 3, target: 5, timeRemaining: '3d 14h', joined: true, participants: 423, category: 'sleep' },
  { id: 'mo1', title: 'Marathon Month', description: 'Walk 300K steps', type: 'monthly', difficulty: 'hard', xpReward: 2000, tokenReward: 200, progress: 125000, target: 300000, timeRemaining: '18d', joined: true, participants: 2341, category: 'activity' },
];

const MOCK_REWARDS: Reward[] = [
  { id: 't1', name: 'Midnight Theme', description: 'Dark mode variant', icon: '🌌', category: 'theme', price: 500, owned: true, limited: false },
  { id: 't2', name: 'Ocean Theme', description: 'Calming blues', icon: '🌊', category: 'theme', price: 500, owned: false, limited: false },
  { id: 'av1', name: 'Golden Frame', description: 'Premium avatar border', icon: '🖼️', category: 'frame', price: 300, owned: true, limited: false },
  { id: 'av2', name: 'Diamond Frame', description: 'Rare diamond border', icon: '💎', category: 'frame', price: 1000, owned: false, limited: false },
  { id: 'av3', name: 'Fire Aura', description: 'Animated effect', icon: '🔥', category: 'avatar', price: 800, owned: false, limited: false },
  { id: 'c1', name: 'Workout Pack', description: 'Premium workouts', icon: '📚', category: 'content', price: 600, owned: false, limited: false },
  { id: 'c2', name: 'Meditation Pack', description: '50 guided sessions', icon: '🎵', category: 'content', price: 400, owned: true, limited: false },
  { id: 'p1', name: 'Premium Month', description: 'Free premium month', icon: '⭐', category: 'premium', price: 5000, owned: false, limited: false },
];

const MOCK_LEADERBOARD: Record<LeaderboardCategory, LeaderboardEntry[]> = {
  steps: [
    { rank: 1, username: 'StepKing', avatar: '👟', score: 154320, level: 25, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'WalkerPro', avatar: '🚶', score: 142890, level: 22, isCurrentUser: false, trend: 'up' },
    { rank: 3, username: 'MarathonMaster', avatar: '🏃', score: 138450, level: 21, isCurrentUser: false, trend: 'down' },
    { rank: 4, username: 'DailyMover', avatar: '💨', score: 125600, level: 19, isCurrentUser: false, trend: 'up' },
    { rank: 5, username: 'ActiveLife', avatar: '⚡', score: 119800, level: 18, isCurrentUser: false, trend: 'same' },
    { rank: 12, username: 'HealthHero', avatar: '🦁', score: 98750, level: 12, isCurrentUser: true, trend: 'up' },
  ],
  sleep: [
    { rank: 1, username: 'SleepGuru', avatar: '😴', score: 98.5, level: 28, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'Dreamer', avatar: '💤', score: 97.2, level: 24, isCurrentUser: false, trend: 'up' },
    { rank: 3, username: 'RestMaster', avatar: '🌙', score: 96.8, level: 23, isCurrentUser: false, trend: 'same' },
    { rank: 8, username: 'HealthHero', avatar: '🦁', score: 89.4, level: 12, isCurrentUser: true, trend: 'up' },
  ],
  nutrition: [
    { rank: 1, username: 'NutritionNinja', avatar: '🥗', score: 2450, level: 26, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'HealthyEater', avatar: '🍎', score: 2380, level: 24, isCurrentUser: false, trend: 'up' },
    { rank: 15, username: 'HealthHero', avatar: '🦁', score: 1680, level: 12, isCurrentUser: true, trend: 'same' },
  ],
  overall: [
    { rank: 1, username: 'WellnessGuru', avatar: '🏆', score: 45890, level: 35, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'HealthMaster', avatar: '💎', score: 42300, level: 32, isCurrentUser: false, trend: 'up' },
    { rank: 3, username: 'FitnessKing', avatar: '👑', score: 39800, level: 30, isCurrentUser: false, trend: 'same' },
    { rank: 23, username: 'HealthHero', avatar: '🦁', score: 15450, level: 12, isCurrentUser: true, trend: 'up' },
  ],
};

const MOCK_DAILY_QUESTS: DailyQuest[] = [
  { id: 'q1', title: 'Morning Stretch', description: 'Complete 5 min stretching', emoji: '🧘', xpReward: 25, completed: true, progress: 5, target: 5 },
  { id: 'q2', title: 'Water Break', description: 'Drink 500ml water', emoji: '💧', xpReward: 15, completed: true, progress: 500, target: 500 },
  { id: 'q3', title: 'Step Goal', description: 'Walk 5,000 steps', emoji: '👟', xpReward: 50, completed: false, progress: 3200, target: 5000 },
  { id: 'q4', title: 'Log Meals', description: 'Track all meals today', emoji: '🥗', xpReward: 30, completed: false, progress: 1, target: 3 },
  { id: 'q5', title: 'Early Sleep', description: 'Sleep before 11 PM', emoji: '😴', xpReward: 40, completed: false, progress: 0, target: 1 },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

const Confetti: React.FC<{ active: boolean; onComplete: () => void }> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; vr: number }[] = [];
    const colors = ['#5c5243', '#e4dfd5', '#fbbf24', '#a855f7', '#3b82f6'];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      });
    }
    
    let animationId: number;
    let frameCount = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.vr;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      
      if (frameCount < 120) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [active, onComplete]);
  
  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ position: 'fixed', top: 0, left: 0 }}
    />
  );
};

const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ value, duration = 1000, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  
  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue.current + (value - startValue.current) * easeOutQuart);
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{formatNumber(displayValue)}{suffix}</span>;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const LevelProgress: React.FC<{ user: User; animated?: boolean }> = ({ user, animated = false }) => {
  const progress = (user.currentXP / user.nextLevelXP) * 100;
  
  return (
    <div className="relative">
      {/* Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <motion.div 
          className={`relative w-32 h-32 ${neuStyles.convex} rounded-full p-1`}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`w-full h-full rounded-full ${neuStyles.pressed} flex flex-col items-center justify-center`}>
            <motion.span 
              className="text-5xl font-black text-[#5c5243]"
              initial={animated ? { scale: 0 } : {}}
              animate={animated ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {animated ? <AnimatedCounter value={user.level} /> : user.level}
            </motion.span>
            <span className="text-xs text-[#5c5243]/70 uppercase tracking-wider">Level</span>
          </div>
          <motion.div 
            className={`absolute -top-1 -right-1 w-10 h-10 ${neuStyles.convex} rounded-full flex items-center justify-center text-xl`}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {user.avatar}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Rank Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-[#2d2418]">{user.rank}</h3>
        <p className="text-sm text-[#5c5243]/70">Level {user.level + 1} at 3,000 XP</p>
      </div>
      
      {/* XP Progress Bar */}
      <div className="relative">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#5c5243] font-semibold">{formatNumber(user.currentXP)} XP</span>
          <span className="text-[#5c5243]/70">{formatNumber(user.nextLevelXP)} XP</span>
        </div>
        <div className={neuStyles.xpBar}>
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#2d2418]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center text-sm text-[#5c5243]/70 mt-2">
          {formatNumber(user.nextLevelXP - user.currentXP)} XP to next level
        </p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  emoji: string; 
  value: number; 
  label: string; 
  delay?: number;
}> = ({ emoji, value, label, delay = 0 }) => (
  <motion.div 
    className={`${neuStyles.card} ${neuStyles.cardHover} p-5 text-center`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
  >
    <motion.div 
      className={`w-14 h-14 mx-auto mb-3 ${neuStyles.pressed} rounded-xl flex items-center justify-center text-3xl`}
      whileHover={{ rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
    >
      {emoji}
    </motion.div>
    <p className="text-2xl font-bold text-[#2d2418]">
      <AnimatedCounter value={value} />
    </p>
    <p className="text-sm text-[#5c5243]/70">{label}</p>
  </motion.div>
);

const StreakCard: React.FC<{ streak: number; bestStreak: number }> = ({ streak, bestStreak }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completed = [true, true, true, true, true, true, false];
  
  return (
    <motion.div 
      className={`${neuStyles.card} p-5`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className={`w-14 h-14 ${neuStyles.pressed} rounded-xl flex items-center justify-center text-3xl`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            🔥
          </motion.div>
          <div>
            <p className="text-3xl font-bold text-[#2d2418]">{streak}</p>
            <p className="text-sm text-[#5c5243]/70">Day Streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#5c5243]/70">Best</p>
          <p className="text-lg font-semibold text-[#5c5243]">{bestStreak}</p>
        </div>
      </div>
      
      {/* Week View */}
      <div className="flex justify-between gap-1">
        {days.map((day, idx) => (
          <motion.div 
            key={idx} 
            className="flex-1 text-center"
            initial={completed[idx] ? { scale: 0 } : {}}
            animate={completed[idx] ? { scale: 1 } : {}}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${
              completed[idx] 
                ? `${neuStyles.convex} text-[#5c5243]` 
                : `${neuStyles.pressed} text-[#5c5243]/40`
            }`}>
              {completed[idx] ? '✓' : day}
            </div>
          </motion.div>
        ))}
      </div>
      
      {streak > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#5c5243]">
          <span>⚡</span>
          <span>Keep it up! {7 - (streak % 7)} days to perfect week!</span>
        </div>
      )}
    </motion.div>
  );
};

const TokenWallet: React.FC<{ tokens: number }> = ({ tokens }) => (
  <motion.div 
    className={`${neuStyles.card} p-5 bg-gradient-to-br from-[#e4dfd5] to-[#dcd3c6]`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center gap-4">
      <motion.div 
        className={`w-16 h-16 ${neuStyles.convex} rounded-xl flex items-center justify-center text-4xl`}
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      >
        🪙
      </motion.div>
      <div>
        <p className="text-sm text-[#5c5243]/70">Unity Tokens</p>
        <p className="text-3xl font-bold text-[#2d2418]">
          <AnimatedCounter value={tokens} />
        </p>
      </div>
    </div>
  </motion.div>
);

const BadgeCard: React.FC<{ badge: Badge; onClick?: () => void }> = ({ badge, onClick }) => {
  const colors = RARITY_COLORS[badge.rarity];
  const progress = (badge.progress / badge.maxProgress) * 100;
  
  return (
    <motion.div 
      onClick={onClick}
      className={`relative cursor-pointer ${badge.unlocked ? '' : 'opacity-70'}`}
      whileHover={{ scale: badge.unlocked ? 1.03 : 1.01, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${neuStyles.card} p-4 overflow-hidden`}>
        {/* Glow for unlocked rare+ */}
        {badge.unlocked && badge.rarity !== 'common' && (
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10 rounded-2xl`} />
        )}
        
        {/* Icon */}
        <div className="relative mb-3">
          <motion.div 
            className={`w-16 h-16 mx-auto ${neuStyles.pressed} rounded-2xl flex items-center justify-center text-3xl`}
            whileHover={badge.unlocked ? { rotate: [0, -10, 10, 0] } : {}}
          >
            {badge.icon}
          </motion.div>
          {badge.unlocked && badge.rarity === 'legendary' && (
            <motion.div 
              className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              👑
            </motion.div>
          )}
        </div>
        
        {/* Content */}
        <h4 className="font-bold text-[#2d2418] text-sm mb-1 text-center truncate">{badge.name}</h4>
        <p className="text-xs text-[#5c5243]/70 mb-3 text-center line-clamp-2">{badge.description}</p>
        
        {/* Progress */}
        {badge.unlocked ? (
          <div className="flex items-center justify-center gap-2">
            <span className={`text-xs font-semibold ${colors.text}`}>{badge.rarity}</span>
            <span className="text-xs text-green-600">✓ Unlocked</span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#5c5243]/70">{badge.progress}/{badge.maxProgress}</span>
              <span className="text-[#5c5243]/50">{Math.round(progress)}%</span>
            </div>
            <div className={neuStyles.xpBar}>
              <motion.div 
                className={`h-full rounded-full bg-gradient-to-r ${colors.bg}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {/* XP Reward */}
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#5c5243]">
          <span>✨</span>
          <span>+{badge.xpReward} XP</span>
        </div>
      </div>
    </motion.div>
  );
};

const ChallengeCard: React.FC<{ 
  challenge: Challenge; 
  onJoin: () => void;
  onProgress?: () => void;
}> = ({ challenge, onJoin, onProgress }) => {
  const progress = (challenge.progress / challenge.target) * 100;
  const difficultyColors = {
    easy: 'text-green-600',
    medium: 'text-amber-600',
    hard: 'text-orange-600',
    extreme: 'text-red-600',
  };
  
  return (
    <motion.div 
      className={`${neuStyles.card} p-5`}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${neuStyles.pressed} rounded-xl flex items-center justify-center text-2xl`}>
            {CATEGORY_ICONS[challenge.category]}
          </div>
          <div>
            <h4 className="font-bold text-[#2d2418]">{challenge.title}</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-medium ${difficultyColors[challenge.difficulty]}`}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
              <span className="text-[#5c5243]/50">• {challenge.type}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
            <span>✨</span>
            <span>{challenge.xpReward}</span>
          </div>
          <div className="flex items-center gap-1 text-[#5c5243] text-xs">
            <span>🪙</span>
            <span>{challenge.tokenReward}</span>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-[#5c5243]/70 mb-4">{challenge.description}</p>
      
      {/* Progress */}
      {challenge.joined && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#5c5243]/70">Progress</span>
            <span className="text-[#2d2418] font-semibold">{challenge.progress}/{challenge.target}</span>
          </div>
          <div className={neuStyles.xpBar}>
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#5c5243]/70">
          <span>⏱️ {challenge.timeRemaining}</span>
          <span>•</span>
          <span>👥 {formatNumber(challenge.participants)}</span>
        </div>
        
        {challenge.joined ? (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onProgress}
            className={`px-4 py-2 ${neuStyles.button} text-sm font-semibold text-[#2d2418]`}
          >
            Log Progress
          </motion.button>
        ) : (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onJoin}
            className={`px-4 py-2 ${neuStyles.button} text-sm font-semibold text-[#2d2418]`}
          >
            Join
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const RewardCard: React.FC<{ reward: Reward; onRedeem: () => void; balance: number }> = ({ reward, onRedeem, balance }) => {
  const canAfford = balance >= reward.price;
  
  return (
    <motion.div 
      className={`relative ${neuStyles.card} p-5 ${reward.owned ? 'ring-2 ring-green-500/50' : ''}`}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Badges */}
      {reward.limited && !reward.owned && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
          ⏰ Limited
        </div>
      )}
      {reward.owned && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
          ✓ Owned
        </div>
      )}
      
      {/* Icon */}
      <div className={`w-16 h-16 mx-auto mb-4 ${neuStyles.pressed} rounded-2xl flex items-center justify-center text-3xl`}>
        {reward.icon}
      </div>
      
      {/* Content */}
      <h4 className="font-bold text-[#2d2418] mb-1 text-center">{reward.name}</h4>
      <p className="text-xs text-[#5c5243]/70 mb-4 text-center line-clamp-2">{reward.description}</p>
      
      {/* Price & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-600">
          <span className="text-lg">🪙</span>
          <span className="font-bold">{formatNumber(reward.price)}</span>
        </div>
        
        {reward.owned ? (
          <span className="text-sm text-[#5c5243]/50">Owned</span>
        ) : canAfford ? (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onRedeem}
            className={`px-4 py-2 ${neuStyles.button} text-sm font-semibold text-[#2d2418]`}
          >
            Redeem
          </motion.button>
        ) : (
          <span className="text-sm text-[#5c5243]/50">
            Need {formatNumber(reward.price - balance)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const DailyQuestCard: React.FC<{ quest: DailyQuest; onComplete: () => void }> = ({ quest, onComplete }) => {
  const progress = (quest.progress / quest.target) * 100;
  
  return (
    <motion.div 
      className={`${neuStyles.card} p-4 ${quest.completed ? 'opacity-70' : ''}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${neuStyles.pressed} rounded-xl flex items-center justify-center text-2xl ${quest.completed ? 'bg-green-100' : ''}`}>
          {quest.completed ? '✓' : quest.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold text-[#2d2418] ${quest.completed ? 'line-through' : ''}`}>{quest.title}</h4>
            <span className="text-xs text-amber-600">+{quest.xpReward} XP</span>
          </div>
          <p className="text-xs text-[#5c5243]/70">{quest.description}</p>
          
          {!quest.completed && (
            <div className="mt-2">
              <div className={neuStyles.xpBar}>
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#2d2418]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#5c5243]/70">{quest.progress}/{quest.target}</span>
                <span className="text-[#5c5243]/50">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardEntryCard: React.FC<{ entry: LeaderboardEntry; index: number }> = ({ entry, index }) => {
  const isTop3 = index < 3;
  const rankEmojis = ['🥇', '🥈', '🥉'];
  
  return (
    <motion.div 
      className={`flex items-center gap-4 p-4 rounded-xl ${
        entry.isCurrentUser 
          ? `${neuStyles.convex}` 
          : `${neuStyles.card}`
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Rank */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
        isTop3 
          ? `${neuStyles.convex} text-xl` 
          : `${neuStyles.pressed} text-[#5c5243]`
      }`}>
        {isTop3 ? rankEmojis[index] : entry.rank}
      </div>
      
      {/* Avatar */}
      <div className={`w-12 h-12 ${neuStyles.pressed} rounded-full flex items-center justify-center text-2xl`}>
        {entry.avatar}
      </div>
      
      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2d2418]">{entry.username}</span>
          {entry.isCurrentUser && (
            <span className="text-xs bg-[#5c5243] text-white px-2 py-0.5 rounded-full">You</span>
          )}
        </div>
        <span className="text-xs text-[#5c5243]/70">Level {entry.level}</span>
      </div>
      
      {/* Score */}
      <div className="text-right">
        <p className="font-bold text-[#2d2418]">{formatNumber(entry.score)}</p>
        <div className="flex items-center justify-end gap-1 text-xs">
          {entry.trend === 'up' && <span className="text-green-600">↑</span>}
          {entry.trend === 'down' && <span className="text-red-500">↓</span>}
          {entry.trend === 'same' && <span className="text-[#5c5243]/50">−</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const BadgesTab: React.FC<{ badges: Badge[] }> = ({ badges }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', label: 'All', emoji: '🏆' },
    { id: 'activity', label: 'Activity', emoji: '🏃' },
    { id: 'nutrition', label: 'Nutrition', emoji: '🥗' },
    { id: 'sleep', label: 'Sleep', emoji: '😴' },
    { id: 'mental', label: 'Mental', emoji: '🧠' },
    { id: 'streaks', label: 'Streaks', emoji: '🔥' },
  ];
  
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);
  
  const unlockedCount = badges.filter(b => b.unlocked).length;
  
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard emoji="🔓" value={unlockedCount} label="Unlocked" delay={0} />
        <StatCard emoji="🎯" value={badges.length} label="Total" delay={0.1} />
        <StatCard emoji="👑" value={badges.filter(b => b.rarity === 'legendary' && b.unlocked).length} label="Legendary" delay={0.2} />
        <StatCard emoji="✨" value={badges.filter(b => b.unlocked).reduce((acc, b) => acc + b.xpReward, 0)} label="XP Earned" delay={0.3} />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? `${neuStyles.buttonPressed} text-[#2d2418]`
                : `${neuStyles.button} text-[#5c5243]`
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <BadgeCard 
              badge={badge}
              onClick={() => {
                if (badge.unlocked) {
                  toast.success(`${badge.name} unlocked!`);
                } else {
                  toast(`Progress: ${badge.progress}/${badge.maxProgress}`);
                }
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChallengesTab: React.FC<{ challenges: Challenge[] }> = ({ challenges }) => {
  const [activeFilter, setActiveFilter] = useState<ChallengeType | 'all'>('all');
  
  const filters: { id: ChallengeType | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '📋' },
    { id: 'daily', label: 'Daily', emoji: '📅' },
    { id: 'weekly', label: 'Weekly', emoji: '📆' },
    { id: 'monthly', label: 'Monthly', emoji: '🗓️' },
    { id: 'special', label: 'Special', emoji: '⭐' },
  ];
  
  const filteredChallenges = activeFilter === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === activeFilter);
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === filter.id
                ? `${neuStyles.buttonPressed} text-[#2d2418]`
                : `${neuStyles.button} text-[#5c5243]`
            }`}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Active Challenges */}
      <div>
        <h3 className="text-lg font-bold text-[#2d2418] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active Challenges
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.filter(c => c.joined).map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard 
                challenge={challenge}
                onJoin={() => toast.success(`Joined "${challenge.title}"!`)}
                onProgress={() => toast.success('Progress logged!')}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Available Challenges */}
      <div>
        <h3 className="text-lg font-bold text-[#2d2418] mb-4">Available Challenges</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.filter(c => !c.joined).map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard 
                challenge={challenge}
                onJoin={() => toast.success(`Joined "${challenge.title}"!`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RewardsTab: React.FC<{ rewards: Reward[]; balance: number }> = ({ rewards, balance }) => {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  
  const categories: { id: RewardCategory | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'All Items', emoji: '🛍️' },
    { id: 'theme', label: 'Themes', emoji: '🎨' },
    { id: 'avatar', label: 'Avatars', emoji: '👤' },
    { id: 'frame', label: 'Frames', emoji: '🖼️' },
    { id: 'content', label: 'Content', emoji: '📚' },
    { id: 'premium', label: 'Premium', emoji: '⭐' },
  ];
  
  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(r => r.category === selectedCategory);
  
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div 
        className={`${neuStyles.card} p-6`}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-16 h-16 ${neuStyles.pressed} rounded-2xl flex items-center justify-center text-4xl`}
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
            >
              🪙
            </motion.div>
            <div>
              <p className="text-[#5c5243]/70 text-sm">Your Balance</p>
              <p className="text-4xl font-bold text-[#2d2418]">
                <AnimatedCounter value={balance} />
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#5c5243]/70 text-sm">Items Owned</p>
            <p className="text-2xl font-bold text-[#2d2418]">{rewards.filter(r => r.owned).length}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? `${neuStyles.buttonPressed} text-[#2d2418]`
                : `${neuStyles.button} text-[#5c5243]`
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <RewardCard 
              reward={reward} 
              balance={balance}
              onRedeem={() => toast.success(`Redeemed "${reward.name}"!`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardTab: React.FC<{ leaderboard: Record<LeaderboardCategory, LeaderboardEntry[]> }> = ({ leaderboard }) => {
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  
  const categories: { id: LeaderboardCategory; label: string; emoji: string }[] = [
    { id: 'overall', label: 'Overall', emoji: '🏆' },
    { id: 'steps', label: 'Steps', emoji: '👟' },
    { id: 'sleep', label: 'Sleep', emoji: '😴' },
    { id: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  ];
  
  const entries = leaderboard[category];
  const currentUserEntry = entries.find(e => e.isCurrentUser);
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              category === cat.id
                ? `${neuStyles.buttonPressed} text-[#2d2418]`
                : `${neuStyles.button} text-[#5c5243]`
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Your Rank */}
      {currentUserEntry && (
        <motion.div 
          className={`${neuStyles.card} p-5`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${neuStyles.pressed} rounded-xl flex items-center justify-center text-xl font-bold text-[#5c5243]`}>
              #{currentUserEntry.rank}
            </div>
            <div className="flex-1">
              <p className="text-[#2d2418] font-semibold">Your Ranking</p>
              <p className="text-sm text-[#5c5243]/70">
                Top {((currentUserEntry.rank / entries.length) * 100).toFixed(0)}% of all users
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#2d2418]">{formatNumber(currentUserEntry.score)}</p>
              <p className="text-sm text-[#5c5243]/70">points</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Leaderboard List */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-[#2d2418] mb-4">Top Performers</h3>
        {entries.map((entry, index) => (
          <LeaderboardEntryCard key={entry.username} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
};

const DailyQuestsTab: React.FC<{ quests: DailyQuest[] }> = ({ quests }) => {
  const completedCount = quests.filter(q => q.completed).length;
  const totalXP = quests.filter(q => q.completed).reduce((acc, q) => acc + q.xpReward, 0);
  
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard emoji="✅" value={completedCount} label="Completed" delay={0} />
        <StatCard emoji="✨" value={totalXP} label="XP Earned Today" delay={0.1} />
      </div>
      
      {/* Quests */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#2d2418] mb-4">Daily Quests</h3>
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DailyQuestCard 
              quest={quest}
              onComplete={() => toast.success(`+${quest.xpReward} XP!`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Gamification2() {
  const [activeTab, setActiveTab] = useState<'badges' | 'challenges' | 'rewards' | 'leaderboard' | 'quests'>('badges');
  const [showConfetti, setShowConfetti] = useState(false);
  const [user] = useState<User>(MOCK_USER);
  
  const tabs = [
    { id: 'badges', label: 'Badges', emoji: '🏆' },
    { id: 'challenges', label: 'Challenges', emoji: '🎯' },
    { id: 'quests', label: 'Daily Quests', emoji: '📋' },
    { id: 'rewards', label: 'Rewards', emoji: '🎁' },
    { id: 'leaderboard', label: 'Leaderboard', emoji: '🏅' },
  ] as const;
  
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Level Progress */}
            <motion.div 
              className={`${neuStyles.card} p-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LevelProgress user={user} animated />
            </motion.div>
            
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard emoji="✨" value={user.totalXP} label="Total XP" delay={0.1} />
              <StatCard emoji="🪙" value={user.unityTokens} label="Tokens" delay={0.2} />
              <StatCard emoji="🏆" value={MOCK_BADGES.filter(b => b.unlocked).length} label="Badges" delay={0.3} />
              <StatCard emoji="🎯" value={MOCK_CHALLENGES.filter(c => c.joined).length} label="Active" delay={0.4} />
            </div>
          </div>
          
          {/* Streak & Wallet */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCard streak={user.streak} bestStreak={user.bestStreak} />
            <TokenWallet tokens={user.unityTokens} />
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-[#e4dfd5]/95 backdrop-blur-md border-y border-[#dcd3c6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `${neuStyles.buttonPressed} text-[#2d2418]`
                    : `${neuStyles.button} text-[#5c5243]`
                }`}
              >
                <span className="text-lg">{tab.emoji}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'badges' && <BadgesTab badges={MOCK_BADGES} />}
            {activeTab === 'challenges' && <ChallengesTab challenges={MOCK_CHALLENGES} />}
            {activeTab === 'rewards' && <RewardsTab rewards={MOCK_REWARDS} balance={user.unityTokens} />}
            {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={MOCK_LEADERBOARD} />}
            {activeTab === 'quests' && <DailyQuestsTab quests={MOCK_DAILY_QUESTS} />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Floating Action Button */}
      <motion.button 
        onClick={triggerConfetti}
        className={`fixed bottom-6 right-6 w-14 h-14 ${neuStyles.convex} rounded-full flex items-center justify-center text-2xl`}
        whileHover={{ scale: 1.1, rotate: 20 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            '6px 6px 12px rgba(44,40,34,0.15), -6px -6px 12px rgba(255,255,255,0.6)',
            '8px 8px 16px rgba(44,40,34,0.2), -8px -8px 16px rgba(255,255,255,0.7)',
            '6px 6px 12px rgba(44,40,34,0.15), -6px -6px 12px rgba(255,255,255,0.6)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.button>
      
      {/* Custom Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
