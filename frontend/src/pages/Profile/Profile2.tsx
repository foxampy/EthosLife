import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  User,
  Heart,
  Target,
  Trophy,
  Settings,
  Link as LinkIcon,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  Award,
  Star,
  Zap,
  Flame,
  Check,
  X,
  Edit3,
  Camera,
  Upload,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Key,
  LogOut,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  Filter,
  Search,
  Dumbbell,
  Utensils,
  Bed,
  Brain,
  Weight,
  Droplets,
  Thermometer,
  Pill,
  Phone,
  MessageCircle,
  Music,
  Watch,
  CreditCard,
  Palette,
  Languages,
  Ruler,
  Gauge,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES & INTERFACES
// ============================================

type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
type GoalCategory = 'weight' | 'nutrition' | 'fitness' | 'sleep' | 'mental' | 'hydration';
type GoalStatus = 'active' | 'completed' | 'paused';
type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
type AchievementCategory = 'streaks' | 'milestones' | 'explorer' | 'social';
type PrivacyLevel = 'public' | 'friends' | 'private';
type Theme = 'light' | 'dark' | 'auto';
type UnitSystem = 'metric' | 'imperial';
type IntegrationStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

interface UserProfile {
  fullName: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  timezone: string;
  dateOfBirth: Date;
  gender: Gender;
  memberSince: Date;
  lastActive: Date;
  email: string;
  phone?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    strava?: string;
  };
  privacyLevel: PrivacyLevel;
}

interface HealthData {
  height: number;
  weight: number;
  bloodType: BloodType;
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  metricsHistory: BodyMetric[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  notes?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

interface BodyMetric {
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
}

interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: GoalStatus;
  createdAt: Date;
  completedAt?: Date;
  description?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  unlockedAt?: Date;
  progress: number;
  target: number;
  points: number;
}

interface UserSettings {
  theme: Theme;
  language: string;
  unitSystem: UnitSystem;
  timeFormat: '12h' | '24h';
  emailNotifications: {
    weeklySummary: boolean;
    goalReminders: boolean;
    achievementAlerts: boolean;
    marketingEmails: boolean;
  };
  pushNotifications: {
    dailyReminders: boolean;
    goalProgress: boolean;
    achievements: boolean;
    socialUpdates: boolean;
  };
  reminderTimes: {
    morning: string;
    evening: string;
  };
  privacy: {
    profileVisible: boolean;
    shareDataWithApps: boolean;
    allowTagging: boolean;
  };
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  category: 'wearable' | 'app';
  status: IntegrationStatus;
  lastSync?: Date;
  connectedAt?: Date;
  dataTypes: string[];
}

interface QuickStats {
  daysActiveStreak: number;
  totalLogsRecorded: number;
  healthScore: number;
  healthScoreTrend: number;
  achievementsCount: number;
}

// ============================================
// MOCK DATA & CONSTANTS
// ============================================

const MOCK_USER: UserProfile = {
  fullName: 'Alex Johnson',
  username: 'alexwellness',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  bio: 'Health enthusiast on a journey to better wellness. Love running, meditation, and healthy cooking! 🏃‍♂️🧘‍♂️🥗',
  location: 'San Francisco, CA',
  timezone: 'America/Los_Angeles',
  dateOfBirth: new Date('1990-05-15'),
  gender: 'male',
  memberSince: new Date('2024-01-15'),
  lastActive: new Date(),
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  socialLinks: {
    twitter: '@alexwellness',
    instagram: '@alex.wellness',
    strava: 'alexjohnson',
  },
  privacyLevel: 'friends',
};

const MOCK_HEALTH_DATA: HealthData = {
  height: 175,
  weight: 72,
  bloodType: 'O+',
  allergies: ['Peanuts', 'Shellfish', 'Penicillin'],
  conditions: ['Mild Asthma', 'Seasonal Allergies'],
  medications: [
    {
      id: '1',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Daily',
      timeOfDay: ['Morning'],
      notes: 'Take with food',
    },
    {
      id: '2',
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'Daily',
      timeOfDay: ['Morning', 'Evening'],
    },
  ],
  emergencyContacts: [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
      email: 'sarah@example.com',
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Mike Johnson',
      relationship: 'Brother',
      phone: '+1 (555) 456-7890',
      isPrimary: false,
    },
  ],
  metricsHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    weight: 72 + Math.sin(i / 5) * 1.5 + Math.random() * 0.5,
    bodyFat: 18 + Math.sin(i / 7) * 1,
    muscleMass: 55 + Math.sin(i / 6) * 0.8,
    bmi: 23.5 + Math.sin(i / 5) * 0.5,
  })),
};

const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Reach Goal Weight',
    category: 'weight',
    targetValue: 70,
    currentValue: 72,
    unit: 'kg',
    deadline: new Date('2024-12-31'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    description: 'Get to my ideal weight through diet and exercise',
    reminderEnabled: true,
    reminderTime: '08:00',
  },
  {
    id: '2',
    title: 'Daily Steps',
    category: 'fitness',
    targetValue: 10000,
    currentValue: 8500,
    unit: 'steps',
    deadline: new Date('2024-12-31'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    description: 'Walk at least 10,000 steps every day',
    reminderEnabled: true,
    reminderTime: '18:00',
  },
  {
    id: '3',
    title: 'Sleep Duration',
    category: 'sleep',
    targetValue: 8,
    currentValue: 7.2,
    unit: 'hours',
    deadline: new Date('2024-12-31'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    description: 'Get consistent 8 hours of quality sleep',
    reminderEnabled: true,
    reminderTime: '22:00',
  },
  {
    id: '4',
    title: 'Water Intake',
    category: 'hydration',
    targetValue: 2500,
    currentValue: 2100,
    unit: 'ml',
    deadline: new Date('2024-12-31'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    description: 'Drink at least 2.5L of water daily',
    reminderEnabled: true,
    reminderTime: '14:00',
  },
  {
    id: '5',
    title: 'Protein Intake',
    category: 'nutrition',
    targetValue: 150,
    currentValue: 145,
    unit: 'g',
    deadline: new Date('2024-12-31'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    description: 'Consume 150g of protein daily',
    reminderEnabled: false,
  },
  {
    id: '6',
    title: 'Meditation Streak',
    category: 'mental',
    targetValue: 30,
    currentValue: 30,
    unit: 'days',
    deadline: new Date('2024-06-01'),
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    completedAt: new Date('2024-06-01'),
    description: 'Meditate for 10 minutes daily for 30 days',
    reminderEnabled: false,
  },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first health log',
    icon: 'footprints',
    category: 'milestones',
    rarity: 'common',
    unlockedAt: new Date('2024-01-15'),
    progress: 100,
    target: 1,
    points: 10,
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: 'flame',
    category: 'streaks',
    rarity: 'common',
    unlockedAt: new Date('2024-01-22'),
    progress: 100,
    target: 7,
    points: 25,
  },
  {
    id: '3',
    name: 'Goal Crusher',
    description: 'Complete 5 health goals',
    icon: 'target',
    category: 'milestones',
    rarity: 'rare',
    unlockedAt: new Date('2024-03-10'),
    progress: 100,
    target: 5,
    points: 50,
  },
  {
    id: '4',
    name: 'Social Butterfly',
    description: 'Connect with 10 friends',
    icon: 'users',
    category: 'social',
    rarity: 'rare',
    progress: 7,
    target: 10,
    points: 75,
  },
  {
    id: '5',
    name: 'Explorer',
    description: 'Try all health tracking features',
    icon: 'compass',
    category: 'explorer',
    rarity: 'rare',
    progress: 85,
    target: 100,
    points: 100,
  },
  {
    id: '6',
    name: 'Century Club',
    description: 'Log 100 consecutive days',
    icon: 'award',
    category: 'streaks',
    rarity: 'epic',
    progress: 100,
    target: 100,
    points: 200,
  },
  {
    id: '7',
    name: 'Health Master',
    description: 'Achieve a health score of 95+',
    icon: 'crown',
    category: 'milestones',
    rarity: 'epic',
    progress: 87,
    target: 95,
    points: 250,
  },
  {
    id: '8',
    name: 'Legendary Status',
    description: 'Unlock all other achievements',
    icon: 'star',
    category: 'milestones',
    rarity: 'legendary',
    progress: 5,
    target: 20,
    points: 1000,
  },
];

const MOCK_SETTINGS: UserSettings = {
  theme: 'auto',
  language: 'en',
  unitSystem: 'metric',
  timeFormat: '24h',
  emailNotifications: {
    weeklySummary: true,
    goalReminders: true,
    achievementAlerts: true,
    marketingEmails: false,
  },
  pushNotifications: {
    dailyReminders: true,
    goalProgress: true,
    achievements: true,
    socialUpdates: false,
  },
  reminderTimes: {
    morning: '08:00',
    evening: '20:00',
  },
  privacy: {
    profileVisible: true,
    shareDataWithApps: true,
    allowTagging: true,
  },
};

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: '1',
    name: 'Apple Health',
    icon: 'apple',
    category: 'wearable',
    status: 'connected',
    lastSync: new Date(),
    connectedAt: new Date('2024-01-15'),
    dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts'],
  },
  {
    id: '2',
    name: 'Google Fit',
    icon: 'google',
    category: 'wearable',
    status: 'disconnected',
    dataTypes: ['Steps', 'Activity', 'Heart Points'],
  },
  {
    id: '3',
    name: 'Fitbit',
    icon: 'watch',
    category: 'wearable',
    status: 'connected',
    lastSync: new Date(Date.now() - 3600000),
    connectedAt: new Date('2024-02-01'),
    dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'SpO2'],
  },
  {
    id: '4',
    name: 'Garmin',
    icon: 'watch',
    category: 'wearable',
    status: 'disconnected',
    dataTypes: ['GPS', 'Heart Rate', 'Training Status'],
  },
  {
    id: '5',
    name: 'MyFitnessPal',
    icon: 'utensils',
    category: 'app',
    status: 'connected',
    lastSync: new Date(Date.now() - 7200000),
    connectedAt: new Date('2024-01-20'),
    dataTypes: ['Nutrition', 'Calories', 'Macros'],
  },
  {
    id: '6',
    name: 'Strava',
    icon: 'activity',
    category: 'app',
    status: 'connected',
    lastSync: new Date(Date.now() - 1800000),
    connectedAt: new Date('2024-03-01'),
    dataTypes: ['Runs', 'Rides', 'Swims'],
  },
  {
    id: '7',
    name: 'Spotify',
    icon: 'music',
    category: 'app',
    status: 'disconnected',
    dataTypes: ['Workout Playlists'],
  },
];

const MOCK_QUICK_STATS: QuickStats = {
  daysActiveStreak: 45,
  totalLogsRecorded: 387,
  healthScore: 87,
  healthScoreTrend: 5,
  achievementsCount: 6,
};

const RARITY_COLORS: Record<AchievementRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600', glow: 'shadow-gray-200' },
  rare: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-600', glow: 'shadow-blue-200' },
  epic: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-600', glow: 'shadow-purple-200' },
  legendary: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-600', glow: 'shadow-amber-200' },
};

const CATEGORY_ICONS: Record<GoalCategory, React.ElementType> = {
  weight: Weight,
  nutrition: Utensils,
  fitness: Dumbbell,
  sleep: Bed,
  mental: Brain,
  hydration: Droplets,
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  weight: '#8b5cf6',
  nutrition: '#10b981',
  fitness: '#3b82f6',
  sleep: '#8b5cf6',
  mental: '#ec4899',
  hydration: '#06b6d4',
};

// ============================================
// UTILITY COMPONENTS
// ============================================

const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#8b5cf6',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
};

const ProgressBar: React.FC<{ progress: number; color?: string; height?: number; className?: string }> = ({
  progress,
  color = '#8b5cf6',
  height = 8,
  className = '',
}) => (
  <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`} style={{ height }}>
    <div
      className="h-full rounded-full transition-all duration-500 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color }}
    />
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string }> = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
      ${active 
        ? 'bg-stone text-bone shadow-md' 
        : 'text-ink hover:bg-sand/50 hover:text-ink-light'
      }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-bone rounded-2xl shadow-neu border border-stone/10 p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{ icon: React.ElementType; title: string; action?: React.ReactNode }> = ({
  icon: Icon,
  title,
  action,
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
      <Icon className="text-stone" size={20} />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
    </div>
    {action}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Profile2() {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'goals' | 'achievements' | 'settings' | 'integrations'>('overview');
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER);
  const [health, setHealth] = useState<HealthData>(MOCK_HEALTH_DATA);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [settings, setSettings] = useState<UserSettings>(MOCK_SETTINGS);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [stats] = useState<QuickStats>(MOCK_QUICK_STATS);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // OVERVIEW TAB
  // ============================================

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg"
              />
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="text-white" size={24} />
              </button>
            </div>
            <div className="mt-3 text-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${profile.privacyLevel === 'public' ? 'bg-green-100 text-green-800' :
                  profile.privacyLevel === 'friends' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'}`}
              >
                {profile.privacyLevel === 'public' ? <Globe size={12} className="mr-1" /> :
                 profile.privacyLevel === 'friends' ? <User size={12} className="mr-1" /> :
                 <Lock size={12} className="mr-1" />}
                {profile.privacyLevel.charAt(0).toUpperCase() + profile.privacyLevel.slice(1)}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink">{profile.fullName}</h2>
                <p className="text-stone">@{profile.username}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-xl hover:bg-sand/50 text-stone hover:text-ink transition-colors"
              >
                <Edit3 size={20} />
              </button>
            </div>
            
            <p className="mt-3 text-ink-light">{profile.bio}</p>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone">
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {profile.location}
              </span>
              <span className="flex items-center">
                <Globe size={16} className="mr-1" />
                {profile.timezone}
              </span>
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" />
                Member since {profile.memberSince.toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                Active {profile.lastActive.toLocaleDateString()}
              </span>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {profile.socialLinks.twitter && (
                <a href="#" className="p-2 rounded-xl bg-sand/50 text-stone hover:text-ink hover:bg-sand transition-colors">
                  <Share2 size={18} />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a href="#" className="p-2 rounded-xl bg-sand/50 text-stone hover:text-ink hover:bg-sand transition-colors">
                  <Camera size={18} />
                </a>
              )}
              {profile.socialLinks.strava && (
                <a href="#" className="p-2 rounded-xl bg-sand/50 text-stone hover:text-ink hover:bg-sand transition-colors">
                  <Activity size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <Flame size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink">{stats.daysActiveStreak}</div>
          <div className="text-sm text-stone">Day Streak</div>
        </Card>
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Activity size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink">{stats.totalLogsRecorded}</div>
          <div className="text-sm text-stone">Total Logs</div>
        </Card>
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Heart size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink">{stats.healthScore}</div>
          <div className="text-sm text-stone flex items-center justify-center">
            Health Score
            <TrendingUp size={14} className="ml-1 text-green-500" />
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Trophy size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink">{stats.achievementsCount}</div>
          <div className="text-sm text-stone">Achievements</div>
        </Card>
      </div>

      {/* Health Score Trend */}
      <Card>
        <SectionTitle icon={TrendingUp} title="Health Score Trend" />
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={health.metricsHistory.map(m => ({ date: m.date.toLocaleDateString(), score: 70 + Math.random() * 20 }))}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="url(#scoreGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  // ============================================
  // HEALTH DATA TAB
  // ============================================

  const HealthDataTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <SectionTitle icon={User} title="Personal Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-stone">Date of Birth</label>
            <input
              type="date"
              value={profile.dateOfBirth.toISOString().split('T')[0]}
              className="neu-input mt-1"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-stone">Gender</label>
            <select className="neu-input mt-1" disabled={!isEditing}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-stone">Height (cm)</label>
            <input
              type="number"
              value={health.height}
              className="neu-input mt-1"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-stone">Current Weight (kg)</label>
            <input
              type="number"
              value={health.weight}
              className="neu-input mt-1"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-stone">Blood Type</label>
            <select className="neu-input mt-1" disabled={!isEditing}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Body Metrics History */}
      <Card>
        <SectionTitle icon={Activity} title="Body Metrics History" />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={health.metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
            <span className="text-sm text-stone">Weight (kg)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className="text-sm text-stone">Body Fat (%)</span>
          </div>
        </div>
      </Card>

      {/* Medical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SectionTitle 
            icon={AlertCircle} 
            title="Allergies"
            action={
              <button className="p-1 rounded-lg hover:bg-sand/50 text-stone">
                <Plus size={18} />
              </button>
            }
          />
          <div className="flex flex-wrap gap-2">
            {health.allergies.map((allergy, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm flex items-center">
                {allergy}
                <button className="ml-2 hover:text-red-900"><X size={14} /></button>
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle 
            icon={Thermometer} 
            title="Chronic Conditions"
            action={
              <button className="p-1 rounded-lg hover:bg-sand/50 text-stone">
                <Plus size={18} />
              </button>
            }
          />
          <div className="flex flex-wrap gap-2">
            {health.conditions.map((condition, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm flex items-center">
                {condition}
                <button className="ml-2 hover:text-amber-900"><X size={14} /></button>
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Medications */}
      <Card>
        <SectionTitle 
          icon={Pill} 
          title="Medications"
          action={
            <button className="px-3 py-1 rounded-lg bg-stone text-bone text-sm hover:bg-stone/90">
              <Plus size={16} className="inline mr-1" />
              Add
            </button>
          }
        />
        <div className="space-y-3">
          {health.medications.map((med) => (
            <div key={med.id} className="flex items-center justify-between p-3 rounded-xl bg-sand/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Pill size={20} />
                </div>
                <div>
                  <div className="font-medium text-ink">{med.name}</div>
                  <div className="text-sm text-stone">{med.dosage} • {med.frequency}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-stone">{med.timeOfDay.join(', ')}</span>
                <button className="p-1 rounded-lg hover:bg-sand/50 text-stone">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <SectionTitle 
          icon={Phone} 
          title="Emergency Contacts"
          action={
            <button className="px-3 py-1 rounded-lg bg-stone text-bone text-sm hover:bg-stone/90">
              <Plus size={16} className="inline mr-1" />
              Add
            </button>
          }
        />
        <div className="space-y-3">
          {health.emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl bg-sand/30">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${contact.isPrimary ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <User size={20} />
                </div>
                <div>
                  <div className="font-medium text-ink flex items-center">
                    {contact.name}
                    {contact.isPrimary && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Primary</span>
                    )}
                  </div>
                  <div className="text-sm text-stone">{contact.relationship} • {contact.phone}</div>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-sand/50 text-stone">
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Health Goals Progress */}
      <Card>
        <SectionTitle icon={Target} title="Health Goals Progress" />
        <div className="space-y-4">
          {goals.filter(g => g.status === 'active').slice(0, 4).map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const Icon = CATEGORY_ICONS[goal.category];
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Icon size={16} className="text-stone" />
                    <span className="font-medium text-ink">{goal.title}</span>
                  </div>
                  <span className="text-sm text-stone">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} color={CATEGORY_COLORS[goal.category]} />
                <div className="flex justify-between mt-1 text-xs text-stone">
                  <span>{goal.currentValue} {goal.unit}</span>
                  <span>{goal.targetValue} {goal.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  // ============================================
  // GOALS TAB
  // ============================================

  const GoalsTab = () => {
    const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all');
    const [viewMode, setViewMode] = useState<'active' | 'completed'>('active');

    const filteredGoals = goals.filter(g => {
      const categoryMatch = selectedCategory === 'all' || g.category === selectedCategory;
      const statusMatch = viewMode === 'active' ? g.status === 'active' : g.status === 'completed';
      return categoryMatch && statusMatch;
    });

    const goalsByCategory = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<GoalCategory, number>);

    return (
      <div className="space-y-6">
        {/* Goal Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['all', 'weight', 'nutrition', 'fitness', 'sleep', 'mental'] as const).map((category) => {
            const Icon = category === 'all' ? Target : CATEGORY_ICONS[category];
            const count = category === 'all' ? goals.length : goalsByCategory[category] || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl text-center transition-all
                  ${selectedCategory === category 
                    ? 'bg-stone text-bone shadow-md' 
                    : 'bg-bone text-ink shadow-neu hover:shadow-lg'}`}
              >
                <Icon size={24} className="mx-auto mb-2" />
                <div className="font-medium capitalize">{category}</div>
                <div className="text-sm opacity-70">{count} goals</div>
              </button>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 bg-sand/30 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-all
                ${viewMode === 'active' ? 'bg-stone text-bone' : 'text-ink hover:bg-sand/50'}`}
            >
              Active
            </button>
            <button
              onClick={() => setViewMode('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all
                ${viewMode === 'completed' ? 'bg-stone text-bone' : 'text-ink hover:bg-sand/50'}`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="neu-button flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Goal</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const Icon = CATEGORY_ICONS[goal.category];
            const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <button className="p-1 rounded-lg hover:bg-sand/50 text-stone">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${CATEGORY_COLORS[goal.category]}20`, color: CATEGORY_COLORS[goal.category] }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-ink">{goal.title}</h4>
                    <p className="text-sm text-stone mt-1">{goal.description}</p>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone">Progress</span>
                        <span className="font-medium text-ink">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar progress={progress} color={CATEGORY_COLORS[goal.category]} height={6} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-stone">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      {goal.status === 'active' && (
                        <span className={`${daysLeft < 7 ? 'text-red-500' : 'text-stone'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      )}
                      {goal.status === 'completed' && (
                        <span className="text-green-600 flex items-center">
                          <Check size={14} className="mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* AI Suggestions */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-ink">AI-Powered Goal Suggestions</h4>
              <p className="text-sm text-stone mt-1">
                Based on your activity patterns, we recommend setting a goal to increase your daily water intake to 3L.
              </p>
              <div className="mt-3 flex space-x-2">
                <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700">
                  Create Goal
                </button>
                <button className="px-4 py-2 rounded-lg bg-white text-stone text-sm hover:bg-gray-50">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Goal Timeline */}
        <Card>
          <SectionTitle icon={Calendar} title="Goal Timeline" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jan', goals: 2 },
                { month: 'Feb', goals: 4 },
                { month: 'Mar', goals: 3 },
                { month: 'Apr', goals: 5 },
                { month: 'May', goals: 6 },
                { month: 'Jun', goals: 4 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="goals" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  };

  // ============================================
  // ACHIEVEMENTS TAB
  // ============================================

  const AchievementsTab = () => {
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

    const filteredAchievements = achievements.filter(a => 
      selectedCategory === 'all' || a.category === selectedCategory
    );

    const unlockedCount = achievements.filter(a => a.unlockedAt).length;
    const totalPoints = achievements.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.points, 0);

    return (
      <div className="space-y-6">
        {/* Achievement Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="text-3xl font-bold text-ink">{unlockedCount}</div>
            <div className="text-sm text-stone">Unlocked</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-ink">{achievements.length - unlockedCount}</div>
            <div className="text-sm text-stone">To Unlock</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-ink">{totalPoints}</div>
            <div className="text-sm text-stone">Total Points</div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'streaks', 'milestones', 'explorer', 'social'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all
                ${selectedCategory === category 
                  ? 'bg-stone text-bone shadow-md' 
                  : 'bg-bone text-ink shadow-neu hover:shadow-lg'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const rarityStyle = RARITY_COLORS[achievement.rarity];
            const isUnlocked = !!achievement.unlockedAt;
            const progressPercent = (achievement.progress / achievement.target) * 100;
            
            return (
              <Card 
                key={achievement.id} 
                className={`relative overflow-hidden transition-all duration-300
                  ${isUnlocked ? '' : 'opacity-75 grayscale'}`}
              >
                {/* Rarity Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 ${rarityStyle.border} pointer-events-none`} />
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${rarityStyle.bg} ${isUnlocked ? rarityStyle.text : 'text-gray-400'}`}>
                    <Award size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-ink">{achievement.name}</h4>
                      {isUnlocked && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-stone mt-1">{achievement.description}</p>
                    
                    {/* Rarity Badge */}
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium uppercase ${rarityStyle.bg} ${rarityStyle.text}`}>
                      {achievement.rarity}
                    </span>
                    
                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone">Progress</span>
                        <span className="text-ink">{achievement.progress} / {achievement.target}</span>
                      </div>
                      <ProgressBar progress={progressPercent} color={isUnlocked ? '#10b981' : '#9ca3af'} height={4} />
                    </div>
                    
                    {isUnlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-stone">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <button className="mt-3 flex items-center text-sm text-stone hover:text-ink transition-colors">
                        <Share2 size={14} className="mr-1" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Next Achievement Preview */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-xl bg-amber-100 text-amber-600">
              <Trophy size={32} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-ink">Next Achievement</h4>
              <p className="text-sm text-stone">Social Butterfly - Connect with 3 more friends to unlock</p>
              <div className="mt-2">
                <ProgressBar progress={70} color="#f59e0b" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">+75</div>
              <div className="text-sm text-stone">points</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // ============================================
  // SETTINGS TAB
  // ============================================

  const SettingsTab = () => {
    const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'notifications' | 'privacy' | 'preferences'>('account');

    const toggleSetting = (category: keyof UserSettings, key: string) => {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key],
        },
      }));
    };

    const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-stone' : 'bg-gray-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    );

    return (
      <div className="space-y-6">
        {/* Settings Navigation */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'account', icon: User, label: 'Account' },
            { key: 'notifications', icon: Bell, label: 'Notifications' },
            { key: 'privacy', icon: Shield, label: 'Privacy' },
            { key: 'preferences', icon: Palette, label: 'Preferences' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveSettingsTab(key as typeof activeSettingsTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
                ${activeSettingsTab === key 
                  ? 'bg-stone text-bone shadow-md' 
                  : 'bg-bone text-ink shadow-neu hover:shadow-lg'}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Account Settings */}
        {activeSettingsTab === 'account' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle icon={Mail} title="Email & Password" />
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone">Email Address</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="email"
                      value={profile.email}
                      className="neu-input flex-1"
                      readOnly
                    />
                    <button className="ml-2 px-4 py-2 rounded-xl bg-stone text-bone text-sm hover:bg-stone/90">
                      Change
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-stone">Password</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="password"
                      value="********"
                      className="neu-input flex-1"
                      readOnly
                    />
                    <button className="ml-2 px-4 py-2 rounded-xl bg-stone text-bone text-sm hover:bg-stone/90">
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Shield} title="Two-Factor Authentication" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-ink">Enable 2FA</div>
                  <div className="text-sm text-stone">Add an extra layer of security to your account</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
                  <Check size={16} className="inline mr-1" />
                  Enabled
                </button>
              </div>
            </Card>

            <Card>
              <SectionTitle icon={LinkIcon} title="Connected Accounts" />
              <div className="space-y-3">
                {[
                  { name: 'Google', icon: 'G', connected: true },
                  { name: 'Telegram', icon: 'T', connected: false },
                ].map((account) => (
                  <div key={account.name} className="flex items-center justify-between p-3 rounded-xl bg-sand/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-stone shadow-sm">
                        {account.icon}
                      </div>
                      <span className="font-medium text-ink">{account.name}</span>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${account.connected 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-stone text-bone hover:bg-stone/90'}`}
                    >
                      {account.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-red-200">
              <SectionTitle icon={LogOut} title="Danger Zone" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-600">Delete Account</div>
                  <div className="text-sm text-stone">This action cannot be undone</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200">
                  Delete
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Settings */}
        {activeSettingsTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle icon={Mail} title="Email Notifications" />
              <div className="space-y-3">
                {[
                  { key: 'weeklySummary', label: 'Weekly Summary', desc: 'Get a weekly overview of your progress' },
                  { key: 'goalReminders', label: 'Goal Reminders', desc: 'Receive reminders about your active goals' },
                  { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Get notified when you unlock achievements' },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive updates about new features and offers' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-ink">{label}</div>
                      <div className="text-sm text-stone">{desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.emailNotifications[key as keyof typeof settings.emailNotifications]}
                      onChange={() => toggleSetting('emailNotifications', key)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Smartphone} title="Push Notifications" />
              <div className="space-y-3">
                {[
                  { key: 'dailyReminders', label: 'Daily Reminders', desc: 'Reminders to log your daily activities' },
                  { key: 'goalProgress', label: 'Goal Progress', desc: 'Updates on your goal achievements' },
                  { key: 'achievements', label: 'Achievements', desc: 'Instant achievement unlock notifications' },
                  { key: 'socialUpdates', label: 'Social Updates', desc: 'Friend requests and activity updates' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-ink">{label}</div>
                      <div className="text-sm text-stone">{desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.pushNotifications[key as keyof typeof settings.pushNotifications]}
                      onChange={() => toggleSetting('pushNotifications', key)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Clock} title="Reminder Times" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-stone">Morning Reminder</label>
                  <input
                    type="time"
                    value={settings.reminderTimes.morning}
                    className="neu-input mt-1"
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      reminderTimes: { ...prev.reminderTimes, morning: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-stone">Evening Reminder</label>
                  <input
                    type="time"
                    value={settings.reminderTimes.evening}
                    className="neu-input mt-1"
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      reminderTimes: { ...prev.reminderTimes, evening: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Privacy Settings */}
        {activeSettingsTab === 'privacy' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle icon={Eye} title="Profile Visibility" />
              <div className="space-y-3">
                {[
                  { value: 'public', label: 'Public', desc: 'Anyone can view your profile', icon: Globe },
                  { value: 'friends', label: 'Friends Only', desc: 'Only friends can view your profile', icon: User },
                  { value: 'private', label: 'Private', desc: 'Only you can view your profile', icon: Lock },
                ].map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setProfile(prev => ({ ...prev, privacyLevel: value as PrivacyLevel }))}
                    className={`w-full flex items-center p-3 rounded-xl transition-all
                      ${profile.privacyLevel === value 
                        ? 'bg-stone text-bone' 
                        : 'bg-sand/30 text-ink hover:bg-sand/50'}`}
                  >
                    <Icon size={20} className="mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{label}</div>
                      <div className={`text-sm ${profile.privacyLevel === value ? 'text-bone/70' : 'text-stone'}`}>
                        {desc}
                      </div>
                    </div>
                    {profile.privacyLevel === value && <Check size={20} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Share2} title="Data Sharing" />
              <div className="space-y-3">
                {[
                  { key: 'profileVisible', label: 'Profile Visibility', desc: 'Make your profile visible to others' },
                  { key: 'shareDataWithApps', label: 'Share with Connected Apps', desc: 'Allow apps to access your health data' },
                  { key: 'allowTagging', label: 'Allow Tagging', desc: 'Let friends tag you in activities' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-ink">{label}</div>
                      <div className="text-sm text-stone">{desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.privacy[key as keyof typeof settings.privacy]}
                      onChange={() => toggleSetting('privacy', key)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Download} title="Data Export" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-ink">Export Your Data</div>
                  <div className="text-sm text-stone">Download all your health data in JSON format</div>
                </div>
                <button 
                  className="px-4 py-2 rounded-xl bg-stone text-bone text-sm font-medium hover:bg-stone/90"
                  onClick={() => toast.success('Data export started! Check your email.')}
                >
                  Export
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Settings */}
        {activeSettingsTab === 'preferences' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle icon={Palette} title="Theme" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Clock },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSettings(prev => ({ ...prev, theme: value as Theme }))}
                    className={`p-4 rounded-xl text-center transition-all
                      ${settings.theme === value 
                        ? 'bg-stone text-bone shadow-md' 
                        : 'bg-sand/30 text-ink hover:bg-sand/50'}`}
                  >
                    <Icon size={24} className="mx-auto mb-2" />
                    <div className="font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Languages} title="Language & Region" />
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone">Language</label>
                  <select 
                    className="neu-input mt-1"
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-stone">Timezone</label>
                  <select className="neu-input mt-1" value={profile.timezone}>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Ruler} title="Units & Format" />
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone">Unit System</label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {[
                      { value: 'metric', label: 'Metric (kg, cm)', icon: Gauge },
                      { value: 'imperial', label: 'Imperial (lb, ft)', icon: Ruler },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setSettings(prev => ({ ...prev, unitSystem: value as UnitSystem }))}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-xl transition-all
                          ${settings.unitSystem === value 
                            ? 'bg-stone text-bone' 
                            : 'bg-sand/30 text-ink hover:bg-sand/50'}`}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-stone">Time Format</label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {['12h', '24h'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setSettings(prev => ({ ...prev, timeFormat: format as '12h' | '24h' }))}
                        className={`p-3 rounded-xl transition-all
                          ${settings.timeFormat === format 
                            ? 'bg-stone text-bone' 
                            : 'bg-sand/30 text-ink hover:bg-sand/50'}`}
                      >
                        {format === '12h' ? '12-hour (AM/PM)' : '24-hour'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // INTEGRATIONS TAB
  // ============================================

  const IntegrationsTab = () => {
    const handleSync = (id: string) => {
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, status: 'syncing' as IntegrationStatus } : i
      ));
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => 
          i.id === id ? { ...i, status: 'connected', lastSync: new Date() } : i
        ));
        toast.success('Sync completed!');
      }, 2000);
    };

    const handleConnect = (id: string) => {
      setIntegrations(prev => prev.map(i => 
        i.id === id 
          ? { ...i, status: 'connected' as IntegrationStatus, connectedAt: new Date(), lastSync: new Date() } 
          : i
      ));
      toast.success('Connected successfully!');
    };

    const handleDisconnect = (id: string) => {
      setIntegrations(prev => prev.map(i => 
        i.id === id 
          ? { ...i, status: 'disconnected' as IntegrationStatus, connectedAt: undefined, lastSync: undefined } 
          : i
      ));
      toast.success('Disconnected successfully!');
    };

    const IntegrationCard: React.FC<{ integration: Integration }> = ({ integration }) => {
      const statusColors = {
        connected: 'bg-green-100 text-green-700',
        disconnected: 'bg-gray-100 text-gray-600',
        syncing: 'bg-blue-100 text-blue-700',
        error: 'bg-red-100 text-red-700',
      };

      return (
        <Card className="relative">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${integration.status === 'connected' ? 'bg-stone text-bone' : 'bg-sand/50 text-stone'}`}>
              {integration.category === 'wearable' ? <Watch size={24} /> : <Smartphone size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-ink">{integration.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[integration.status]}`}>
                  {integration.status === 'syncing' && (
                    <RefreshCw size={12} className="inline mr-1 animate-spin" />
                  )}
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {integration.dataTypes.map((type, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-sand/50 text-stone text-xs">
                    {type}
                  </span>
                ))}
              </div>

              {integration.lastSync && (
                <div className="mt-2 text-xs text-stone">
                  Last synced: {integration.lastSync.toLocaleString()}
                </div>
              )}

              <div className="mt-3 flex space-x-2">
                {integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={integration.status === 'syncing'}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone text-bone text-sm hover:bg-stone/90 disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={integration.status === 'syncing' ? 'animate-spin' : ''} />
                      <span>Sync Now</span>
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm hover:bg-red-200"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="px-3 py-1.5 rounded-lg bg-stone text-bone text-sm hover:bg-stone/90"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    };

    const wearables = integrations.filter(i => i.category === 'wearable');
    const apps = integrations.filter(i => i.category === 'app');

    return (
      <div className="space-y-6">
        {/* Wearable Devices */}
        <div>
          <SectionTitle icon={Watch} title="Wearable Devices" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wearables.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>

        {/* Other Apps */}
        <div>
          <SectionTitle icon={Smartphone} title="Connected Apps" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>

        {/* Sync All Button */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-ink">Sync All Data</h4>
              <p className="text-sm text-stone">Pull the latest data from all connected services</p>
            </div>
            <button
              onClick={() => {
                integrations.filter(i => i.status === 'connected').forEach(i => handleSync(i.id));
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-stone text-bone font-medium hover:bg-stone/90"
            >
              <RefreshCw size={18} />
              <span>Sync All</span>
            </button>
          </div>
        </Card>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-bone pb-20">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={profile.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button 
          className="absolute bottom-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          onClick={() => toast('Cover photo upload coming soon!')}
        >
          <Camera size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        {/* Tab Navigation */}
        <div className="bg-bone rounded-2xl shadow-neu p-2 mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={User}
              label="Overview"
            />
            <TabButton
              active={activeTab === 'health'}
              onClick={() => setActiveTab('health')}
              icon={Heart}
              label="Health Data"
            />
            <TabButton
              active={activeTab === 'goals'}
              onClick={() => setActiveTab('goals')}
              icon={Target}
              label="Goals"
            />
            <TabButton
              active={activeTab === 'achievements'}
              onClick={() => setActiveTab('achievements')}
              icon={Trophy}
              label="Achievements"
            />
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={Settings}
              label="Settings"
            />
            <TabButton
              active={activeTab === 'integrations'}
              onClick={() => setActiveTab('integrations')}
              icon={LinkIcon}
              label="Integrations"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats Sidebar */}
            <Card>
              <h3 className="font-semibold text-ink mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone">Streak</span>
                  <span className="font-medium text-ink flex items-center">
                    <Flame size={16} className="mr-1 text-orange-500" />
                    {stats.daysActiveStreak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone">Health Score</span>
                  <span className="font-medium text-ink flex items-center">
                    <Heart size={16} className="mr-1 text-red-500" />
                    {stats.healthScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone">Achievements</span>
                  <span className="font-medium text-ink flex items-center">
                    <Trophy size={16} className="mr-1 text-amber-500" />
                    {stats.achievementsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone">Total Logs</span>
                  <span className="font-medium text-ink">{stats.totalLogsRecorded}</span>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <Card>
              <h3 className="font-semibold text-ink mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                {[
                  { key: 'overview', label: 'Overview', icon: User },
                  { key: 'health', label: 'Health Data', icon: Heart },
                  { key: 'goals', label: 'Goals', icon: Target },
                  { key: 'achievements', label: 'Achievements', icon: Trophy },
                  { key: 'settings', label: 'Settings', icon: Settings },
                  { key: 'integrations', label: 'Integrations', icon: LinkIcon },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all
                      ${activeTab === key 
                        ? 'bg-stone text-bone' 
                        : 'text-ink hover:bg-sand/50'}`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {activeTab === key && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'health' && <HealthDataTab />}
            {activeTab === 'goals' && <GoalsTab />}
            {activeTab === 'achievements' && <AchievementsTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'integrations' && <IntegrationsTab />}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">Update Avatar</h3>
              <button onClick={() => setShowAvatarModal(false)}>
                <X size={20} className="text-stone" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={profile.avatar} alt="Current" className="w-32 h-32 rounded-2xl" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    toast.success('Avatar uploaded!');
                    setShowAvatarModal(false);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl border-2 border-dashed border-stone/30 hover:border-stone/50 transition-colors"
              >
                <Upload size={20} className="text-stone" />
                <span className="text-stone">Click to upload new avatar</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">Create New Goal</h3>
              <button onClick={() => setShowGoalModal(false)}>
                <X size={20} className="text-stone" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-stone">Goal Title</label>
                <input type="text" className="neu-input mt-1" placeholder="e.g., Run 5km daily" />
              </div>
              <div>
                <label className="text-sm text-stone">Category</label>
                <select className="neu-input mt-1">
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="sleep">Sleep</option>
                  <option value="mental">Mental Health</option>
                  <option value="weight">Weight</option>
                  <option value="hydration">Hydration</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-stone">Target Value</label>
                  <input type="number" className="neu-input mt-1" placeholder="100" />
                </div>
                <div>
                  <label className="text-sm text-stone">Unit</label>
                  <input type="text" className="neu-input mt-1" placeholder="steps, kg, hours" />
                </div>
              </div>
              <div>
                <label className="text-sm text-stone">Deadline</label>
                <input type="date" className="neu-input mt-1" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2 rounded-xl bg-sand/50 text-ink hover:bg-sand transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Goal created successfully!');
                    setShowGoalModal(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-stone text-bone hover:bg-stone/90"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
