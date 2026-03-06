import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'activity' | 'nutrition' | 'sleep' | 'mental' | 'streaks' | 'special';
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
  category: 'activity' | 'nutrition' | 'sleep' | 'mental' | 'social' | 'streaks';
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

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  type: 'levelup' | 'achievement' | 'streak' | 'milestone';
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const RARITY_COLORS: Record<Rarity, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'from-slate-400 to-slate-500', border: 'border-slate-400', text: 'text-slate-400', glow: 'shadow-slate-400/20' },
  rare: { bg: 'from-blue-400 to-cyan-500', border: 'border-blue-400', text: 'text-blue-400', glow: 'shadow-blue-400/30' },
  epic: { bg: 'from-purple-500 to-pink-500', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/40' },
  legendary: { bg: 'from-amber-400 via-orange-500 to-rose-500', border: 'border-amber-400', text: 'text-amber-400', glow: 'shadow-amber-400/50' },
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-rose-500',
  extreme: 'bg-purple-600',
};

const CATEGORY_ICONS: Record<string, string> = {
  activity: '🏃',
  nutrition: '🥗',
  sleep: '😴',
  mental: '🧠',
  streaks: '🔥',
  special: '🌟',
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

const MOCK_ACHIEVEMENTS: Achievement[] = [
  // Activity Achievements
  { id: 'a1', name: 'First Steps', description: 'Walk 1,000 steps in a day', icon: '👟', category: 'activity', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-15', progress: 1000, maxProgress: 1000 },
  { id: 'a2', name: 'Step Master', description: 'Walk 10,000 steps in a day', icon: '🏃', category: 'activity', rarity: 'rare', xpReward: 150, unlocked: true, unlockedAt: '2026-02-03', progress: 10000, maxProgress: 10000 },
  { id: 'a3', name: 'Marathon Runner', description: 'Walk 100,000 steps in a week', icon: '🏆', category: 'activity', rarity: 'epic', xpReward: 500, unlocked: false, progress: 65000, maxProgress: 100000 },
  { id: 'a4', name: 'Iron Man', description: 'Complete 30 workouts', icon: '💪', category: 'activity', rarity: 'legendary', xpReward: 1000, unlocked: false, progress: 18, maxProgress: 30 },
  
  // Nutrition Achievements
  { id: 'n1', name: 'Logger', description: 'Log your first meal', icon: '📝', category: 'nutrition', rarity: 'common', xpReward: 25, unlocked: true, unlockedAt: '2026-01-10', progress: 1, maxProgress: 1 },
  { id: 'n2', name: 'Meal Prepper', description: 'Log meals for 7 days straight', icon: '🥗', category: 'nutrition', rarity: 'rare', xpReward: 200, unlocked: true, unlockedAt: '2026-02-10', progress: 7, maxProgress: 7 },
  { id: 'n3', name: 'Nutrition Ninja', description: 'Hit protein goal for 30 days', icon: '🥩', category: 'nutrition', rarity: 'epic', xpReward: 400, unlocked: false, progress: 12, maxProgress: 30 },
  { id: 'n4', name: 'Hydration Hero', description: 'Drink 2L water for 30 days', icon: '💧', category: 'nutrition', rarity: 'rare', xpReward: 250, unlocked: false, progress: 15, maxProgress: 30 },
  
  // Sleep Achievements
  { id: 's1', name: 'Early Bird', description: 'Sleep before 10 PM', icon: '🌙', category: 'sleep', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-20', progress: 1, maxProgress: 1 },
  { id: 's2', name: 'Sleep Champion', description: 'Get 8 hours for 7 nights', icon: '😴', category: 'sleep', rarity: 'rare', xpReward: 200, unlocked: true, unlockedAt: '2026-02-15', progress: 7, maxProgress: 7 },
  { id: 's3', name: 'Sleep Master', description: 'Maintain sleep score >85 for 30 days', icon: '✨', category: 'sleep', rarity: 'epic', xpReward: 500, unlocked: false, progress: 8, maxProgress: 30 },
  
  // Mental Health Achievements
  { id: 'm1', name: 'Mindful Beginner', description: 'Meditate for 5 minutes', icon: '🧘', category: 'mental', rarity: 'common', xpReward: 50, unlocked: true, unlockedAt: '2026-01-12', progress: 1, maxProgress: 1 },
  { id: 'm2', name: 'Zen Master', description: 'Meditate for 100 minutes total', icon: '☮️', category: 'mental', rarity: 'rare', xpReward: 300, unlocked: false, progress: 45, maxProgress: 100 },
  { id: 'm3', name: 'Mood Tracker', description: 'Log mood for 30 days', icon: '😊', category: 'mental', rarity: 'epic', xpReward: 400, unlocked: false, progress: 23, maxProgress: 30 },
  
  // Streak Achievements
  { id: 'st1', name: 'On Fire', description: '7 day streak', icon: '🔥', category: 'streaks', rarity: 'common', xpReward: 100, unlocked: true, unlockedAt: '2026-01-18', progress: 7, maxProgress: 7 },
  { id: 'st2', name: 'Unstoppable', description: '30 day streak', icon: '⚡', category: 'streaks', rarity: 'rare', xpReward: 300, unlocked: true, unlockedAt: '2026-02-20', progress: 30, maxProgress: 30 },
  { id: 'st3', name: 'Legend', description: '100 day streak', icon: '👑', category: 'streaks', rarity: 'legendary', xpReward: 2000, unlocked: false, progress: 23, maxProgress: 100 },
  
  // Special Achievements
  { id: 'sp1', name: 'Explorer', description: 'Visit all app sections', icon: '🗺️', category: 'special', rarity: 'rare', xpReward: 150, unlocked: true, unlockedAt: '2026-01-25', progress: 6, maxProgress: 6 },
  { id: 'sp2', name: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', category: 'special', rarity: 'epic', xpReward: 350, unlocked: false, progress: 2, maxProgress: 5 },
  { id: 'sp3', name: 'Early Adopter', description: 'Join in the first month', icon: '🚀', category: 'special', rarity: 'legendary', xpReward: 1000, unlocked: true, unlockedAt: '2026-01-01', progress: 1, maxProgress: 1 },
];

const MOCK_CHALLENGES: Challenge[] = [
  // Daily Challenges
  { id: 'd1', title: 'Step Sprint', description: 'Walk 8,000 steps today', type: 'daily', difficulty: 'easy', xpReward: 100, tokenReward: 10, progress: 6500, target: 8000, timeRemaining: '14h 32m', joined: true, participants: 1243, category: 'activity' },
  { id: 'd2', title: 'Hydration Check', description: 'Drink 2L of water', type: 'daily', difficulty: 'easy', xpReward: 80, tokenReward: 8, progress: 1500, target: 2000, timeRemaining: '14h 32m', joined: true, participants: 2156, category: 'nutrition' },
  { id: 'd3', title: 'Mindful Moment', description: 'Meditate for 10 minutes', type: 'daily', difficulty: 'easy', xpReward: 120, tokenReward: 12, progress: 0, target: 10, timeRemaining: '14h 32m', joined: false, participants: 892, category: 'mental' },
  
  // Weekly Challenges
  { id: 'w1', title: 'Perfect Week', description: 'Log all meals for 7 days', type: 'weekly', difficulty: 'medium', xpReward: 500, tokenReward: 50, progress: 4, target: 7, timeRemaining: '3d 14h', joined: true, participants: 567, category: 'nutrition' },
  { id: 'w2', title: 'Sleep Champion', description: 'Get 8h sleep for 5 nights', type: 'weekly', difficulty: 'medium', xpReward: 600, tokenReward: 60, progress: 3, target: 5, timeRemaining: '3d 14h', joined: true, participants: 423, category: 'sleep' },
  { id: 'w3', title: 'Weekend Warrior', description: 'Complete 3 workouts', type: 'weekly', difficulty: 'hard', xpReward: 800, tokenReward: 80, progress: 1, target: 3, timeRemaining: '3d 14h', joined: false, participants: 234, category: 'activity' },
  
  // Monthly Challenges
  { id: 'mo1', title: 'Marathon Month', description: 'Walk 300,000 steps', type: 'monthly', difficulty: 'hard', xpReward: 2000, tokenReward: 200, progress: 125000, target: 300000, timeRemaining: '18d', joined: true, participants: 2341, category: 'activity' },
  { id: 'mo2', title: 'Consistency King', description: '30-day login streak', type: 'monthly', difficulty: 'extreme', xpReward: 3000, tokenReward: 300, progress: 23, target: 30, timeRemaining: '18d', joined: true, participants: 1567, category: 'streaks' },
  
  // Special Events
  { id: 'sp1', title: 'Spring Fitness Fest', description: 'Complete all daily challenges for 7 days', type: 'special', difficulty: 'extreme', xpReward: 5000, tokenReward: 500, progress: 2, target: 7, timeRemaining: '5d', joined: false, participants: 5678, category: 'activity' },
];

const MOCK_REWARDS: Reward[] = [
  // Themes
  { id: 't1', name: 'Midnight Purple', description: 'Dark theme with purple accents', icon: '🌌', category: 'theme', price: 500, owned: true, limited: false },
  { id: 't2', name: 'Ocean Blue', description: 'Calming ocean-inspired theme', icon: '🌊', category: 'theme', price: 500, owned: false, limited: false },
  { id: 't3', name: 'Sunset Gold', description: 'Warm sunset gradient theme', icon: '🌅', category: 'theme', price: 750, owned: false, limited: false },
  { id: 't4', name: 'Neon Cyber', description: 'Cyberpunk neon aesthetic', icon: '⚡', category: 'theme', price: 1000, owned: false, limited: true, limitedUntil: '2026-03-31' },
  
  // Avatar Customizations
  { id: 'av1', name: 'Golden Frame', description: 'Shiny gold avatar frame', icon: '🖼️', category: 'frame', price: 300, owned: true, limited: false },
  { id: 'av2', name: 'Diamond Frame', description: 'Premium diamond border', icon: '💎', category: 'frame', price: 1000, owned: false, limited: false },
  { id: 'av3', name: 'Fire Aura', description: 'Animated fire effect', icon: '🔥', category: 'avatar', price: 800, owned: false, limited: false },
  { id: 'av4', name: 'Celestial Halo', description: 'Heavenly golden halo', icon: '👼', category: 'avatar', price: 1200, owned: false, limited: true, limitedUntil: '2026-04-15' },
  
  // Content
  { id: 'c1', name: 'Advanced Workouts', description: 'Unlock premium workout plans', icon: '📚', category: 'content', price: 600, owned: false, limited: false },
  { id: 'c2', name: 'Meditation Pack', description: '50 guided meditations', icon: '🎵', category: 'content', price: 400, owned: true, limited: false },
  { id: 'c3', name: 'Nutrition Masterclass', description: 'Expert nutrition course', icon: '🎓', category: 'content', price: 800, owned: false, limited: false },
  
  // Premium
  { id: 'p1', name: 'Premium Discount', description: '20% off yearly subscription', icon: '🎁', category: 'premium', price: 2000, owned: false, limited: true, limitedUntil: '2026-03-20' },
  { id: 'p2', name: '1-Month Premium', description: 'Free month of premium', icon: '⭐', category: 'premium', price: 5000, owned: false, limited: false },
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
    { rank: 4, username: 'NightOwl', avatar: '🦉', score: 94.5, level: 20, isCurrentUser: false, trend: 'up' },
    { rank: 5, username: 'EarlyBird', avatar: '🐦', score: 93.2, level: 19, isCurrentUser: false, trend: 'down' },
    { rank: 8, username: 'HealthHero', avatar: '🦁', score: 89.4, level: 12, isCurrentUser: true, trend: 'up' },
  ],
  nutrition: [
    { rank: 1, username: 'NutritionNinja', avatar: '🥗', score: 2450, level: 26, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'HealthyEater', avatar: '🍎', score: 2380, level: 24, isCurrentUser: false, trend: 'up' },
    { rank: 3, username: 'MealPrepPro', avatar: '🍱', score: 2290, level: 22, isCurrentUser: false, trend: 'same' },
    { rank: 4, username: 'ProteinKing', avatar: '🥩', score: 2150, level: 21, isCurrentUser: false, trend: 'down' },
    { rank: 5, username: 'VeganChamp', avatar: '🌱', score: 2080, level: 20, isCurrentUser: false, trend: 'up' },
    { rank: 15, username: 'HealthHero', avatar: '🦁', score: 1680, level: 12, isCurrentUser: true, trend: 'same' },
  ],
  overall: [
    { rank: 1, username: 'WellnessGuru', avatar: '🏆', score: 45890, level: 35, isCurrentUser: false, trend: 'same' },
    { rank: 2, username: 'HealthMaster', avatar: '💎', score: 42300, level: 32, isCurrentUser: false, trend: 'up' },
    { rank: 3, username: 'FitnessKing', avatar: '👑', score: 39800, level: 30, isCurrentUser: false, trend: 'same' },
    { rank: 4, username: 'BalancedLife', avatar: '⚖️', score: 36500, level: 28, isCurrentUser: false, trend: 'up' },
    { rank: 5, username: 'TotalWellness', avatar: '🌟', score: 34200, level: 27, isCurrentUser: false, trend: 'down' },
    { rank: 23, username: 'HealthHero', avatar: '🦁', score: 15450, level: 12, isCurrentUser: true, trend: 'up' },
  ],
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 't1', date: '2026-01-01', title: 'Journey Begins', description: 'Started your wellness journey', icon: '🚀', type: 'milestone' },
  { id: 't2', date: '2026-01-05', title: 'Level 2 Reached', description: 'Gained 100 XP and unlocked new features', icon: '⬆️', type: 'levelup' },
  { id: 't3', date: '2026-01-10', title: 'First Achievement', description: 'Unlocked "Logger" achievement', icon: '🏅', type: 'achievement' },
  { id: 't4', date: '2026-01-18', title: '7-Day Streak', description: 'First week of consistency', icon: '🔥', type: 'streak' },
  { id: 't5', date: '2026-01-25', title: 'Level 5 Reached', description: 'Became a Health Apprentice', icon: '⬆️', type: 'levelup' },
  { id: 't6', date: '2026-02-10', title: '30-Day Streak', description: 'One month of dedication', icon: '⚡', type: 'streak' },
  { id: 't7', date: '2026-02-15', title: 'Sleep Champion', description: 'Mastered sleep schedule', icon: '😴', type: 'achievement' },
  { id: 't8', date: '2026-02-20', title: 'Level 10 Reached', description: 'Became a Wellness Warrior', icon: '⬆️', type: 'levelup' },
  { id: 't9', date: '2026-03-01', title: 'Epic Achievement', description: 'Unlocked "Marathon Runner"', icon: '🏆', type: 'achievement' },
];

const RANKS = [
  { level: 1, rank: 'Health Novice' },
  { level: 5, rank: 'Health Apprentice' },
  { level: 10, rank: 'Wellness Warrior' },
  { level: 20, rank: 'Fitness Champion' },
  { level: 30, rank: 'Health Master' },
  { level: 50, rank: 'Legend' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getRankForLevel = (level: number): string => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].level) return RANKS[i].rank;
  }
  return 'Health Novice';
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getNextRank = (currentLevel: number): { rank: string; level: number } | null => {
  const nextRank = RANKS.find(r => r.level > currentLevel);
  return nextRank || null;
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
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899'];
    
    for (let i = 0; i < 100; i++) {
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

const XPNotification: React.FC<{ xp: number; message: string; onComplete: () => void }> = ({ xp, message, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed top-24 right-4 z-50 animate-slideInRight">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 border border-amber-400/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            ✨
          </div>
          <div>
            <p className="font-bold text-lg">+{xp} XP</p>
            <p className="text-amber-100 text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
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

const ShimmerBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      {children}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const LevelProgress: React.FC<{ user: User; animated?: boolean }> = ({ user, animated = false }) => {
  const progress = (user.currentXP / user.nextLevelXP) * 100;
  const nextRank = getNextRank(user.level);
  
  return (
    <div className="relative">
      {/* Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-1 shadow-2xl shadow-amber-500/30">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                {animated ? <AnimatedCounter value={user.level} /> : user.level}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Level</span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg animate-pulse">
            {user.avatar}
          </div>
        </div>
      </div>
      
      {/* Rank Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">{user.rank}</h3>
        {nextRank && (
          <p className="text-sm text-slate-400">Next: {nextRank.rank} at Level {nextRank.level}</p>
        )}
      </div>
      
      {/* XP Progress Bar */}
      <div className="relative">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-amber-400 font-semibold">{formatNumber(user.currentXP)} XP</span>
          <span className="text-slate-400">{formatNumber(user.nextLevelXP)} XP</span>
        </div>
        <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-2">
          {formatNumber(user.nextLevelXP - user.currentXP)} XP to next level
        </p>
      </div>
    </div>
  );
};

const StreakCard: React.FC<{ streak: number; bestStreak: number }> = ({ streak, bestStreak }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completed = [true, true, true, true, true, true, false];
  
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-rose-500/20 rounded-2xl p-5 border border-orange-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-2xl font-bold text-white">{streak}</p>
            <p className="text-sm text-slate-400">Day Streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Best</p>
          <p className="text-lg font-semibold text-orange-400">{bestStreak}</p>
        </div>
      </div>
      
      {/* Week View */}
      <div className="flex justify-between gap-1">
        {days.map((day, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${
              completed[idx] 
                ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-slate-700/50 text-slate-500'
            }`}>
              {completed[idx] ? '✓' : day}
            </div>
          </div>
        ))}
      </div>
      
      {streak > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
          <span>⚡</span>
          <span>Keep it up! {7 - (streak % 7)} days to perfect week bonus!</span>
        </div>
      )}
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement; onClick?: () => void }> = ({ achievement, onClick }) => {
  const colors = RARITY_COLORS[achievement.rarity];
  const progress = (achievement.progress / achievement.maxProgress) * 100;
  
  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-300 ${
        achievement.unlocked ? 'hover:scale-105' : 'opacity-70 grayscale hover:opacity-90'
      }`}
    >
      <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border-2 ${
        achievement.unlocked ? colors.border : 'border-slate-700'
      } overflow-hidden`}>
        {/* Shine Effect for Unlocked */}
        {achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        {/* Rarity Glow */}
        {achievement.unlocked && achievement.rarity !== 'common' && (
          <div className={`absolute inset-0 rounded-2xl ${colors.glow} blur-xl opacity-20`} />
        )}
        
        {/* Icon */}
        <div className="relative mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-3xl shadow-lg ${colors.glow}`}>
            {achievement.icon}
          </div>
          {achievement.unlocked && achievement.rarity === 'legendary' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs">
              👑
            </div>
          )}
        </div>
        
        {/* Content */}
        <h4 className="font-bold text-white mb-1 truncate">{achievement.name}</h4>
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{achievement.description}</p>
        
        {/* Progress or Unlocked Date */}
        {achievement.unlocked ? (
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${colors.text}`}>{RARITY_LABELS[achievement.rarity]}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              ✓ Unlocked
            </span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{achievement.progress}/{achievement.maxProgress}</span>
              <span className="text-slate-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* XP Reward */}
        <div className="mt-3 flex items-center gap-1 text-xs text-amber-400">
          <span>✨</span>
          <span>+{achievement.xpReward} XP</span>
        </div>
      </div>
    </div>
  );
};

const ChallengeCard: React.FC<{ 
  challenge: Challenge; 
  onJoin: () => void;
  onProgress?: () => void;
}> = ({ challenge, onJoin, onProgress }) => {
  const progress = (challenge.progress / challenge.target) * 100;
  const difficultyColor = DIFFICULTY_COLORS[challenge.difficulty];
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${difficultyColor} flex items-center justify-center text-2xl shadow-lg`}>
            {CATEGORY_ICONS[challenge.category]}
          </div>
          <div>
            <h4 className="font-bold text-white">{challenge.title}</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full text-white ${difficultyColor}`}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
              <span className="text-slate-400">{challenge.type}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
            <span>✨</span>
            <span>{challenge.xpReward}</span>
          </div>
          <div className="flex items-center gap-1 text-purple-400 text-xs">
            <span>🪙</span>
            <span>{challenge.tokenReward}</span>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-slate-400 mb-4">{challenge.description}</p>
      
      {/* Progress */}
      {challenge.joined && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-semibold">{challenge.progress}/{challenge.target}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>⏱️ {challenge.timeRemaining}</span>
          <span>•</span>
          <span>👥 {formatNumber(challenge.participants)}</span>
        </div>
        
        {challenge.joined ? (
          <button 
            onClick={onProgress}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Log Progress
          </button>
        ) : (
          <button 
            onClick={onJoin}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
};

const RewardCard: React.FC<{ reward: Reward; onRedeem: () => void; balance: number }> = ({ reward, onRedeem, balance }) => {
  const canAfford = balance >= reward.price;
  
  return (
    <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border transition-all ${
      reward.owned 
        ? 'border-emerald-500/50' 
        : canAfford 
          ? 'border-slate-700/50 hover:border-slate-600' 
          : 'border-slate-800 opacity-60'
    }`}>
      {/* Limited Badge */}
      {reward.limited && !reward.owned && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
          ⏰ Limited
        </div>
      )}
      
      {/* Owned Badge */}
      {reward.owned && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
          ✓ Owned
        </div>
      )}
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl mb-4 shadow-inner">
        {reward.icon}
      </div>
      
      {/* Content */}
      <h4 className="font-bold text-white mb-1">{reward.name}</h4>
      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{reward.description}</p>
      
      {/* Price & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-400">
          <span className="text-lg">🪙</span>
          <span className="font-bold">{formatNumber(reward.price)}</span>
        </div>
        
        {reward.owned ? (
          <button className="px-4 py-2 bg-slate-700 text-slate-400 rounded-xl text-sm cursor-default">
            Owned
          </button>
        ) : canAfford ? (
          <button 
            onClick={onRedeem}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Redeem
          </button>
        ) : (
          <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 rounded-xl text-sm cursor-not-allowed">
            Need {formatNumber(reward.price - balance)}
          </button>
        )}
      </div>
      
      {reward.limitedUntil && !reward.owned && (
        <p className="text-xs text-rose-400 mt-3 text-center">
          Until {new Date(reward.limitedUntil).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const LeaderboardEntryCard: React.FC<{ entry: LeaderboardEntry; index: number }> = ({ entry, index }) => {
  const isTop3 = index < 3;
  const rankColors = ['from-amber-400 to-yellow-500', 'from-slate-300 to-slate-400', 'from-orange-400 to-amber-500'];
  
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
      entry.isCurrentUser 
        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50' 
        : 'bg-slate-800/50 hover:bg-slate-800'
    }`}>
      {/* Rank */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
        isTop3 
          ? `bg-gradient-to-br ${rankColors[index]} text-slate-900 shadow-lg` 
          : 'bg-slate-700 text-slate-400'
      }`}>
        {isTop3 ? ['🥇', '🥈', '🥉'][index] : entry.rank}
      </div>
      
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl">
        {entry.avatar}
      </div>
      
      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{entry.username}</span>
          {entry.isCurrentUser && (
            <span className="text-xs bg-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full">You</span>
          )}
        </div>
        <span className="text-xs text-slate-400">Level {entry.level}</span>
      </div>
      
      {/* Score */}
      <div className="text-right">
        <p className="font-bold text-white">{formatNumber(entry.score)}</p>
        <div className="flex items-center justify-end gap-1 text-xs">
          {entry.trend === 'up' && <span className="text-emerald-400">↑</span>}
          {entry.trend === 'down' && <span className="text-rose-400">↓</span>}
          {entry.trend === 'same' && <span className="text-slate-400">−</span>}
        </div>
      </div>
    </div>
  );
};

const Podium: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const top3 = entries.slice(0, 3);
  
  return (
    <div className="flex items-end justify-center gap-4 mb-8 py-8">
      {/* 2nd Place */}
      {top3[1] && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-3xl mb-2 shadow-xl shadow-slate-400/30 ring-4 ring-slate-400/20">
            {top3[1].avatar}
          </div>
          <p className="text-white font-semibold text-sm">{top3[1].username}</p>
          <p className="text-slate-400 text-xs">{formatNumber(top3[1].score)}</p>
          <div className="w-20 h-24 bg-gradient-to-t from-slate-400 to-slate-300 rounded-t-lg mt-3 flex items-center justify-center">
            <span className="text-3xl">🥈</span>
          </div>
        </div>
      )}
      
      {/* 1st Place */}
      {top3[0] && (
        <div className="flex flex-col items-center -mt-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-4xl mb-2 shadow-xl shadow-amber-500/40 ring-4 ring-amber-400/30 animate-pulse">
            {top3[0].avatar}
          </div>
          <p className="text-white font-bold">{top3[0].username}</p>
          <p className="text-amber-400 text-sm">{formatNumber(top3[0].score)}</p>
          <div className="w-24 h-32 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg mt-3 flex items-center justify-center">
            <span className="text-4xl">🥇</span>
          </div>
        </div>
      )}
      
      {/* 3rd Place */}
      {top3[2] && (
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-2xl mb-2 shadow-xl shadow-orange-500/30 ring-4 ring-orange-400/20">
            {top3[2].avatar}
          </div>
          <p className="text-white font-semibold text-sm">{top3[2].username}</p>
          <p className="text-slate-400 text-xs">{formatNumber(top3[2].score)}</p>
          <div className="w-18 h-16 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg mt-3 flex items-center justify-center w-16">
            <span className="text-2xl">🥉</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div className="relative">
      {/* Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-slate-700" />
      
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4 mb-8 last:mb-0">
          {/* Icon */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center text-xl shadow-lg">
            {event.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-white">{event.title}</h4>
              <span className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-400">{event.description}</p>
            {event.type === 'levelup' && (
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                <span>⬆️</span>
                <span>Level Up!</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const AchievementsTab: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  
  const categories = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'activity', label: 'Activity', icon: '🏃' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'mental', label: 'Mental', icon: '🧠' },
    { id: 'streaks', label: 'Streaks', icon: '🔥' },
    { id: 'special', label: 'Special', icon: '🌟' },
  ];
  
  const filteredAchievements = achievements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (showUnlockedOnly && !a.unlocked) return false;
    return true;
  });
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const recentAchievements = achievements.filter(a => a.unlocked).slice(-3);
  
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
          <p className="text-3xl font-bold text-white">{unlockedCount}</p>
          <p className="text-sm text-slate-400">Unlocked</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
          <p className="text-3xl font-bold text-white">{achievements.length}</p>
          <p className="text-sm text-slate-400">Total</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
          <p className="text-3xl font-bold text-amber-400">{achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}</p>
          <p className="text-sm text-slate-400">Legendary</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
          <p className="text-3xl font-bold text-purple-400">
            {achievements.filter(a => a.unlocked).reduce((acc, a) => acc + a.xpReward, 0)}
          </p>
          <p className="text-sm text-slate-400">XP Earned</p>
        </div>
      </div>
      
      {/* Recently Unlocked */}
      {recentAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🏆</span> Recently Unlocked
          </h3>
          <div className="flex flex-wrap gap-4">
            {recentAchievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${RARITY_COLORS[a.rarity].bg} flex items-center justify-center text-xl`}>
                  {a.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{a.name}</p>
                  <p className="text-xs text-slate-400">+{a.xpReward} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ml-auto ${
            showUnlockedOnly
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          {showUnlockedOnly ? '✓ Show All' : 'Show Unlocked Only'}
        </button>
      </div>
      
      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            onClick={() => {
              if (achievement.unlocked) {
                toast.success(`${achievement.name} - ${achievement.description}`);
              } else {
                toast(`Progress: ${achievement.progress}/${achievement.maxProgress}`, { icon: '📊' });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ChallengesTab: React.FC<{ challenges: Challenge[] }> = ({ challenges }) => {
  const [activeFilter, setActiveFilter] = useState<ChallengeType | 'all'>('all');
  
  const filters: { id: ChallengeType | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'special', label: 'Special' },
  ];
  
  const filteredChallenges = activeFilter === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === activeFilter);
  
  const handleJoin = (challenge: Challenge) => {
    toast.success(`Joined "${challenge.title}"! Good luck!`, { icon: '🎯' });
  };
  
  const handleProgress = (challenge: Challenge) => {
    toast.success(`Progress logged for "${challenge.title}"!`, { icon: '✓' });
  };
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {/* Active Challenges Section */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Challenges
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.filter(c => c.joined).map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge}
              onJoin={() => handleJoin(challenge)}
              onProgress={() => handleProgress(challenge)}
            />
          ))}
        </div>
      </div>
      
      {/* Available Challenges Section */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Available Challenges</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.filter(c => !c.joined).map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge}
              onJoin={() => handleJoin(challenge)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RewardsTab: React.FC<{ rewards: Reward[]; balance: number }> = ({ rewards, balance }) => {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  
  const categories: { id: RewardCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '🛍️' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'avatar', label: 'Avatars', icon: '👤' },
    { id: 'frame', label: 'Frames', icon: '🖼️' },
    { id: 'content', label: 'Content', icon: '📚' },
    { id: 'premium', label: 'Premium', icon: '⭐' },
  ];
  
  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(r => r.category === selectedCategory);
  
  const handleRedeem = (reward: Reward) => {
    toast.success(`Redeemed "${reward.name}"!`, { icon: '🎉' });
  };
  
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 rounded-2xl p-6 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Your Balance</p>
            <p className="text-4xl font-bold text-white flex items-center gap-2">
              <span className="text-5xl">🪙</span>
              <AnimatedCounter value={balance} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Items Owned</p>
            <p className="text-2xl font-bold text-white">{rewards.filter(r => r.owned).length}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Earn more tokens by completing challenges and maintaining streaks!
        </p>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
      
      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRewards.map(reward => (
          <RewardCard 
            key={reward.id} 
            reward={reward} 
            balance={balance}
            onRedeem={() => handleRedeem(reward)}
          />
        ))}
      </div>
    </div>
  );
};

const LeaderboardTab: React.FC<{ leaderboard: Record<LeaderboardCategory, LeaderboardEntry[]> }> = ({ leaderboard }) => {
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  
  const categories: { id: LeaderboardCategory; label: string; icon: string }[] = [
    { id: 'overall', label: 'Overall', icon: '🏆' },
    { id: 'steps', label: 'Steps', icon: '👟' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  ];
  
  const periods: { id: LeaderboardPeriod; label: string }[] = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all-time', label: 'All Time' },
  ];
  
  const entries = leaderboard[category];
  const currentUserEntry = entries.find(e => e.isCurrentUser);
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                category === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                period === p.id
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Podium */}
      <Podium entries={entries} />
      
      {/* Your Rank */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
              #{currentUserEntry.rank}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Your Ranking</p>
              <p className="text-sm text-slate-400">
                Top {((currentUserEntry.rank / entries.length) * 100).toFixed(0)}% of all users
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{formatNumber(currentUserEntry.score)}</p>
              <p className="text-sm text-slate-400">points</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard List */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
        {entries.map((entry, index) => (
          <LeaderboardEntryCard key={entry.username} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Gamification2() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'rewards' | 'leaderboard' | 'timeline'>('achievements');
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpNotification, setXpNotification] = useState<{ xp: number; message: string } | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);
  
  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'challenges', label: 'Challenges', icon: '🎯' },
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏅' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
  ] as const;
  
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);
  
  const triggerXP = useCallback((xp: number, message: string) => {
    setXpNotification({ xp, message });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* XP Notification */}
      {xpNotification && (
        <XPNotification 
          xp={xpNotification.xp} 
          message={xpNotification.message} 
          onComplete={() => setXpNotification(null)} 
        />
      )}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Level Progress */}
            <div className="lg:col-span-1">
              <LevelProgress user={user} animated />
            </div>
            
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  ✨
                </div>
                <p className="text-2xl font-bold text-white">
                  <AnimatedCounter value={user.totalXP} />
                </p>
                <p className="text-sm text-slate-400">Total XP</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🪙
                </div>
                <p className="text-2xl font-bold text-white">
                  <AnimatedCounter value={user.unityTokens} />
                </p>
                <p className="text-sm text-slate-400">Unity Tokens</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <p className="text-2xl font-bold text-white">
                  {MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length}
                </p>
                <p className="text-sm text-slate-400">Achievements</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <p className="text-2xl font-bold text-white">
                  {MOCK_CHALLENGES.filter(c => c.joined).length}
                </p>
                <p className="text-sm text-slate-400">Active Challenges</p>
              </div>
            </div>
          </div>
          
          {/* Streak & Next Rank */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCard streak={user.streak} bestStreak={user.bestStreak} />
            
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20">
              <h3 className="text-lg font-bold text-white mb-3">Next Milestone</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl border-2 border-dashed border-slate-600">
                  🏃
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Marathon Runner</p>
                  <p className="text-sm text-slate-400 mb-2">Walk 100,000 steps in a week</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">65,000 / 100,000 steps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'achievements' && <AchievementsTab achievements={MOCK_ACHIEVEMENTS} />}
        {activeTab === 'challenges' && <ChallengesTab challenges={MOCK_CHALLENGES} />}
        {activeTab === 'rewards' && <RewardsTab rewards={MOCK_REWARDS} balance={user.unityTokens} />}
        {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={MOCK_LEADERBOARD} />}
        {activeTab === 'timeline' && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Your Journey</h3>
            <Timeline events={TIMELINE_EVENTS} />
          </div>
        )}
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => triggerXP(50, 'Daily login bonus!')}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform"
          title="Claim Daily Bonus"
        >
          🎁
        </button>
        <button 
          onClick={triggerConfetti}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
          title="Celebrate!"
        >
          🎉
        </button>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        
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
