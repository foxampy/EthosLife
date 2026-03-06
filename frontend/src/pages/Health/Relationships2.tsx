import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import {
  HeartIcon,
  UserGroupIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  VideoCameraIcon,
  CalendarIcon,
  StarIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  GiftIcon,
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  FaceSmileIcon,
  FireIcon,
  TrophyIcon,
  LightBulbIcon,
  ChevronRightIcon,
  XMarkIcon,
  CameraIcon,
  MusicalNoteIcon,
  BookmarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  UsersIcon,
  HomeIcon,
  BriefcaseIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  HeartHandshakeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// ============================================
// TYPE DEFINITIONS
// ============================================

type RelationshipType = 'family' | 'friend' | 'partner' | 'colleague' | 'other';
type ContactType = 'call' | 'message' | 'video' | 'meetup' | 'activity';
type ActivityCategory = 'family' | 'friends' | 'partner' | 'group';

interface Connection {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  avatar?: string;
  lastContactDate: Date;
  contactFrequencyGoal: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  isPriority: boolean;
  notes?: string;
  birthday?: Date;
  phone?: string;
  email?: string;
  tags: string[];
}

interface ContactEntry {
  id: string;
  connectionId: string;
  connectionName: string;
  type: ContactType;
  date: Date;
  duration: number; // minutes
  quality: number; // 1-10
  notes?: string;
  photos?: string[];
  location?: string;
}

interface SocialGoal {
  id: string;
  title: string;
  type: 'contact' | 'activity' | 'quality' | 'milestone';
  target: number;
  current: number;
  deadline?: Date;
  completed: boolean;
  streak?: number;
}

interface ActivityIdea {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  duration: string;
  cost: 'free' | '$' | '$$' | '$$$';
  tags: string[];
}

interface AssessmentResult {
  type: 'satisfaction' | 'communication' | 'lovelanguage' | 'attachment';
  date: Date;
  score: number;
  primaryResult: string;
  secondaryResult?: string;
  insights: string[];
}

interface WeeklyStats {
  qualityTime: number; // minutes
  goal: number;
  breakdown: Record<string, number>;
  previousWeek: number;
}

interface SocialScore {
  overall: number;
  connections: number;
  frequency: number;
  quality: number;
  trend: 'up' | 'down' | 'stable';
}

interface RelationshipsState {
  connections: Connection[];
  socialScore: SocialScore;
  contactLog: ContactEntry[];
  weeklyStats: WeeklyStats;
  goals: SocialGoal[];
  assessments: AssessmentResult[];
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

const RELATIONSHIP_COLORS: Record<RelationshipType, { bg: string; text: string; border: string; icon: string }> = {
  family: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', icon: '🏠' },
  friend: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: '🤝' },
  partner: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', icon: '💕' },
  colleague: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '💼' },
  other: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: '🌟' },
};

const CONTACT_TYPE_ICONS: Record<ContactType, string> = {
  call: '📞',
  message: '💬',
  video: '📹',
  meetup: '☕',
  activity: '🎯',
};

const CONTACT_TYPE_COLORS: Record<ContactType, string> = {
  call: '#ec4899',
  message: '#8b5cf6',
  video: '#06b6d4',
  meetup: '#f59e0b',
  activity: '#10b981',
};

const ACTIVITY_IDEAS: ActivityIdea[] = [
  // Family
  { id: '1', title: 'Sunday Family Dinner', category: 'family', description: 'Cook a meal together and share stories', duration: '2-3 hours', cost: '$$', tags: ['cooking', 'bonding', 'tradition'] },
  { id: '2', title: 'Board Game Night', category: 'family', description: 'Classic board games with snacks', duration: '2 hours', cost: '$', tags: ['fun', 'competition', 'nostalgia'] },
  { id: '3', title: 'Nature Hike', category: 'family', description: 'Explore local trails together', duration: '3-4 hours', cost: 'free', tags: ['outdoors', 'exercise', 'fresh air'] },
  { id: '4', title: 'Movie Marathon', category: 'family', description: 'Watch favorite family movies', duration: '3-4 hours', cost: '$', tags: ['relaxing', 'movies', 'cozy'] },
  
  // Friends
  { id: '5', title: 'Coffee Catch-up', category: 'friends', description: 'Meet at a cozy café', duration: '1-2 hours', cost: '$', tags: ['casual', 'conversation', 'relaxing'] },
  { id: '6', title: 'Game Night', category: 'friends', description: 'Video games or party games', duration: '2-4 hours', cost: '$', tags: ['fun', 'competitive', 'laughter'] },
  { id: '7', title: 'Cooking Together', category: 'friends', description: 'Try a new recipe together', duration: '2-3 hours', cost: '$$', tags: ['creative', 'food', 'learning'] },
  { id: '8', title: 'Concert or Show', category: 'friends', description: 'Live music or theater', duration: '3-4 hours', cost: '$$$', tags: ['entertainment', 'memories', 'exciting'] },
  
  // Partner
  { id: '9', title: 'Date Night Dinner', category: 'partner', description: 'Romantic dinner at a nice restaurant', duration: '2-3 hours', cost: '$$$', tags: ['romantic', 'intimate', 'special'] },
  { id: '10', title: 'Sunset Walk', category: 'partner', description: 'Romantic evening stroll', duration: '1 hour', cost: 'free', tags: ['romantic', 'peaceful', 'connection'] },
  { id: '11', title: 'DIY Project', category: 'partner', description: 'Work on a home project together', duration: '3-4 hours', cost: '$$', tags: ['creative', 'teamwork', 'productive'] },
  { id: '12', title: 'Couples Massage', category: 'partner', description: 'Relaxing spa experience', duration: '1-2 hours', cost: '$$$', tags: ['relaxing', 'intimate', 'wellness'] },
  
  // Group
  { id: '13', title: 'Group Brunch', category: 'group', description: 'Weekend brunch with friends', duration: '2 hours', cost: '$$', tags: ['social', 'food', 'weekend'] },
  { id: '14', title: 'Outdoor Picnic', category: 'group', description: 'Park picnic with games', duration: '3-4 hours', cost: '$', tags: ['outdoors', 'casual', 'summer'] },
  { id: '15', title: 'Trivia Night', category: 'group', description: 'Pub trivia with the crew', duration: '2-3 hours', cost: '$', tags: ['fun', 'competitive', 'intellectual'] },
  { id: '16', title: 'Volunteer Together', category: 'group', description: 'Give back to the community', duration: '3-4 hours', cost: 'free', tags: ['meaningful', 'giving', 'teamwork'] },
];

const CONVERSATION_STARTERS = [
  "What's been the highlight of your week?",
  "If you could travel anywhere right now, where would you go?",
  "What's something you're looking forward to?",
  "What's the best book or movie you've experienced lately?",
  "What's a goal you're working towards?",
  "What's something that made you smile recently?",
  "If you could learn any skill instantly, what would it be?",
  "What's your favorite memory from childhood?",
  "What's something you're grateful for today?",
];

const GRATITUDE_PROMPTS = [
  "I really appreciate how you...",
  "Thank you for always being there when...",
  "One thing I admire about you is...",
  "I'm grateful for your support with...",
  "You make my life better by...",
  "I love how you...",
  "Thank you for helping me with...",
  "Your kindness shows when you...",
];

const LISTENING_TIPS = [
  { title: 'Maintain Eye Contact', description: 'Show you\'re engaged and present' },
  { title: 'Avoid Interrupting', description: 'Let them finish their thoughts completely' },
  { title: 'Reflect Back', description: 'Paraphrase to show understanding' },
  { title: 'Ask Open Questions', description: 'Use "how" and "what" instead of yes/no' },
  { title: 'Validate Feelings', description: 'Acknowledge their emotions without judgment' },
  { title: 'Put Away Distractions', description: 'Give your full attention' },
];

// ============================================
// MOCK DATA
// ============================================

const MOCK_CONNECTIONS: Connection[] = [
  { id: '1', name: 'Mom', relationshipType: 'family', lastContactDate: new Date(Date.now() - 86400000 * 2), contactFrequencyGoal: 'weekly', isPriority: true, birthday: new Date('1965-03-15'), phone: '+1234567890', tags: ['supportive', 'wise'] },
  { id: '2', name: 'Dad', relationshipType: 'family', lastContactDate: new Date(Date.now() - 86400000 * 5), contactFrequencyGoal: 'weekly', isPriority: true, birthday: new Date('1962-07-22'), phone: '+1234567891', tags: ['funny', 'advice'] },
  { id: '3', name: 'Sarah Johnson', relationshipType: 'friend', lastContactDate: new Date(Date.now() - 86400000 * 7), contactFrequencyGoal: 'biweekly', isPriority: true, birthday: new Date('1990-11-08'), phone: '+1234567892', tags: ['college', 'travel'] },
  { id: '4', name: 'Mike Chen', relationshipType: 'friend', lastContactDate: new Date(Date.now() - 86400000 * 14), contactFrequencyGoal: 'monthly', isPriority: false, tags: ['gaming', 'tech'] },
  { id: '5', name: 'Alex', relationshipType: 'partner', lastContactDate: new Date(Date.now() - 86400000 * 1), contactFrequencyGoal: 'daily', isPriority: true, birthday: new Date('1988-05-20'), phone: '+1234567893', tags: ['love', 'adventure'] },
  { id: '6', name: 'Emily (Sister)', relationshipType: 'family', lastContactDate: new Date(Date.now() - 86400000 * 10), contactFrequencyGoal: 'weekly', isPriority: true, birthday: new Date('1992-09-12'), tags: ['sibling', 'shopping'] },
  { id: '7', name: 'David Kim', relationshipType: 'colleague', lastContactDate: new Date(Date.now() - 86400000 * 3), contactFrequencyGoal: 'weekly', isPriority: false, tags: ['work', 'mentor'] },
  { id: '8', name: 'Grandma', relationshipType: 'family', lastContactDate: new Date(Date.now() - 86400000 * 4), contactFrequencyGoal: 'weekly', isPriority: true, birthday: new Date('1940-12-01'), phone: '+1234567894', tags: ['wise', 'stories'] },
  { id: '9', name: 'Jessica', relationshipType: 'friend', lastContactDate: new Date(Date.now() - 86400000 * 21), contactFrequencyGoal: 'monthly', isPriority: false, tags: ['yoga', 'wellness'] },
  { id: '10', name: 'Mark (Boss)', relationshipType: 'colleague', lastContactDate: new Date(Date.now() - 86400000 * 1), contactFrequencyGoal: 'weekly', isPriority: false, tags: ['professional', 'leader'] },
];

const MOCK_CONTACT_LOG: ContactEntry[] = [
  { id: '1', connectionId: '1', connectionName: 'Mom', type: 'call', date: new Date(Date.now() - 86400000 * 2), duration: 25, quality: 9, notes: 'Great chat about weekend plans', location: 'Home' },
  { id: '2', connectionId: '5', connectionName: 'Alex', type: 'meetup', date: new Date(Date.now() - 86400000 * 1), duration: 180, quality: 10, notes: 'Dinner date at Italian restaurant', location: 'Downtown' },
  { id: '3', connectionId: '3', connectionName: 'Sarah Johnson', type: 'message', date: new Date(Date.now() - 86400000 * 2), duration: 5, quality: 7, notes: 'Quick catch-up about work' },
  { id: '4', connectionId: '2', connectionName: 'Dad', type: 'video', date: new Date(Date.now() - 86400000 * 5), duration: 40, quality: 8, notes: 'Video call, discussed home repairs' },
  { id: '5', connectionId: '7', connectionName: 'David Kim', type: 'meetup', date: new Date(Date.now() - 86400000 * 3), duration: 60, quality: 8, notes: 'Coffee chat about project', location: 'Starbucks' },
  { id: '6', connectionId: '6', connectionName: 'Emily (Sister)', type: 'call', date: new Date(Date.now() - 86400000 * 10), duration: 35, quality: 9, notes: 'Long chat about life updates' },
  { id: '7', connectionId: '8', connectionName: 'Grandma', type: 'call', date: new Date(Date.now() - 86400000 * 4), duration: 20, quality: 10, notes: 'She shared stories from her youth' },
  { id: '8', connectionId: '4', connectionName: 'Mike Chen', type: 'activity', date: new Date(Date.now() - 86400000 * 14), duration: 120, quality: 8, notes: 'Gaming session - won 3 matches!', location: 'Online' },
];

const MOCK_GOALS: SocialGoal[] = [
  { id: '1', title: 'Call Mom weekly', type: 'contact', target: 4, current: 3, streak: 12, completed: false },
  { id: '2', title: 'Quality time with partner', type: 'quality', target: 300, current: 240, streak: 5, completed: false },
  { id: '3', title: 'Catch up with 2 friends', type: 'contact', target: 2, current: 2, streak: 3, completed: true },
  { id: '4', title: 'Family dinner this month', type: 'activity', target: 1, current: 1, completed: true },
  { id: '5', title: 'Meet new people', type: 'milestone', target: 3, current: 1, completed: false },
];

const MOCK_ASSESSMENTS: AssessmentResult[] = [
  { type: 'lovelanguage', date: new Date(Date.now() - 86400000 * 30), score: 85, primaryResult: 'Quality Time', secondaryResult: 'Words of Affirmation', insights: ['You value undivided attention', 'Meaningful conversations matter to you', 'Shared activities strengthen bonds'] },
  { type: 'communication', date: new Date(Date.now() - 86400000 * 60), score: 78, primaryResult: 'Assertive', insights: ['You express needs clearly', 'You listen actively', 'You seek win-win solutions'] },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getDaysSinceContact = (lastContact: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastContact.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getFrequencyDays = (frequency: Connection['contactFrequencyGoal']): number => {
  const map = { daily: 1, weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
  return map[frequency];
};

const isOverdue = (connection: Connection): boolean => {
  const daysSince = getDaysSinceContact(connection.lastContactDate);
  const goalDays = getFrequencyDays(connection.contactFrequencyGoal);
  return daysSince > goalDays;
};

const getOverdueLevel = (connection: Connection): 'none' | 'warning' | 'critical' => {
  const daysSince = getDaysSinceContact(connection.lastContactDate);
  const goalDays = getFrequencyDays(connection.contactFrequencyGoal);
  const ratio = daysSince / goalDays;
  if (ratio <= 1) return 'none';
  if (ratio <= 1.5) return 'warning';
  return 'critical';
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// ============================================
// UTILITY COMPONENTS
// ============================================

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
}> = ({ children, className = '', title, icon, action, noPadding }) => (
  <div className={`neu-card ${noPadding ? '' : 'p-5'} ${className}`}>
    {(title || icon || action) && (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-rose-600">{icon}</span>}
          {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

const CircularProgress: React.FC<{ 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}> = ({ value, size = 140, strokeWidth = 10, color = '#ec4899', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#dcd3c6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)`, transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; showStatus?: boolean; status?: 'online' | 'away' | 'offline' }> = ({ 
  name, 
  size = 'md', 
  showStatus = false,
  status = 'offline'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };
  
  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400',
  };

  const colors = [
    'bg-rose-400', 'bg-pink-400', 'bg-purple-400', 'bg-indigo-400',
    'bg-blue-400', 'bg-cyan-400', 'bg-teal-400', 'bg-emerald-400',
    'bg-amber-400', 'bg-orange-400', 'bg-red-400'
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
        {getInitials(name)}
      </div>
      {showStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`} />
      )}
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; max: number; color?: string; showLabel?: boolean; label?: string }> = ({ 
  value, 
  max, 
  color = 'bg-rose-500',
  showLabel = true,
  label
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-light">{label || 'Progress'}</span>
          <span className="font-medium text-ink">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-3 bg-sand rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const Tag: React.FC<{
  label: string;
  selected?: boolean;
  onClick?: () => void;
  color?: string;
  icon?: string;
}> = ({ label, selected = false, onClick, color = 'bg-rose-100 text-rose-800', icon }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      selected
        ? 'ring-2 ring-offset-1 ring-rose-500 scale-105'
        : 'hover:scale-105'
    } ${color}`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </button>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Relationships2() {
  // State
  const [connections, setConnections] = useState<Connection[]>(MOCK_CONNECTIONS);
  const [contactLog, setContactLog] = useState<ContactEntry[]>(MOCK_CONTACT_LOG);
  const [goals, setGoals] = useState<SocialGoal[]>(MOCK_GOALS);
  const [assessments] = useState<AssessmentResult[]>(MOCK_ASSESSMENTS);
  
  const [selectedCategory, setSelectedCategory] = useState<RelationshipType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showLogContact, setShowLogContact] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState<'connections' | 'activities' | 'tools'>('connections');
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    qualityTime: 890,
    goal: 1200,
    breakdown: { family: 240, friend: 180, partner: 300, colleague: 120, other: 50 },
    previousWeek: 720,
  });

  // Social Score Calculation
  const socialScore = useMemo((): SocialScore => {
    const connectionScore = Math.min(connections.filter(c => !isOverdue(c)).length / connections.length * 100, 100);
    const frequencyScore = Math.min(connections.filter(c => {
      const days = getDaysSinceContact(c.lastContactDate);
      const goal = getFrequencyDays(c.contactFrequencyGoal);
      return days <= goal;
    }).length / connections.length * 100, 100);
    
    const qualityScore = contactLog.length > 0 
      ? contactLog.reduce((acc, c) => acc + c.quality, 0) / contactLog.length * 10
      : 70;
    
    const overall = Math.round((connectionScore * 0.3 + frequencyScore * 0.4 + qualityScore * 0.3));
    
    return {
      overall,
      connections: Math.round(connectionScore),
      frequency: Math.round(frequencyScore),
      quality: Math.round(qualityScore),
      trend: overall > 75 ? 'up' : overall < 60 ? 'down' : 'stable',
    };
  }, [connections, contactLog]);

  // Filtered connections
  const filteredConnections = useMemo(() => {
    return connections.filter(c => {
      const matchesCategory = selectedCategory === 'all' || c.relationshipType === selectedCategory;
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      // Priority first, then by last contact
      if (a.isPriority !== b.isPriority) return b.isPriority ? 1 : -1;
      return a.lastContactDate.getTime() - b.lastContactDate.getTime();
    });
  }, [connections, selectedCategory, searchQuery]);

  // Get recent contact log
  const recentContacts = useMemo(() => {
    return [...contactLog].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }, [contactLog]);

  // Handlers
  const handleQuickContact = (connection: Connection, type: ContactType) => {
    const newEntry: ContactEntry = {
      id: Date.now().toString(),
      connectionId: connection.id,
      connectionName: connection.name,
      type,
      date: new Date(),
      duration: type === 'call' ? 15 : type === 'video' ? 30 : type === 'meetup' ? 120 : 5,
      quality: 8,
    };
    
    setContactLog([newEntry, ...contactLog]);
    
    // Update connection last contact
    setConnections(connections.map(c => 
      c.id === connection.id ? { ...c, lastContactDate: new Date() } : c
    ));
    
    // Update weekly stats
    setWeeklyStats(prev => ({
      ...prev,
      qualityTime: prev.qualityTime + newEntry.duration,
    }));
    
    const typeLabels: Record<ContactType, string> = {
      call: '📞 Called',
      message: '💬 Messaged',
      video: '📹 Video chatted',
      meetup: '☕ Met up with',
      activity: '🎯 Did activity with',
    };
    
    toast.success(`${typeLabels[type]} ${connection.name}! 💕`);
  };

  const togglePriority = (connection: Connection) => {
    setConnections(connections.map(c =>
      c.id === connection.id ? { ...c, isPriority: !c.isPriority } : c
    ));
    toast.success(connection.isPriority ? 'Removed from priorities' : 'Added to priorities ⭐');
  };

  // ============================================
  // SUB-COMPONENTS
  // ============================================

  const SocialScoreCard = () => (
    <Card className="relative overflow-hidden" noPadding>
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full -mr-16 -mt-16 opacity-30" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200 rounded-full -ml-12 -mb-12 opacity-30" />
      
      <div className="p-6 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl shadow-lg">
            <HeartIconSolid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Social Health Score</h2>
            <p className="text-sm text-ink-light">Based on connection quality & frequency</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <CircularProgress value={socialScore.overall} size={120} color="#ec4899">
            <div className="text-center">
              <span className="text-3xl font-bold text-rose-600">{socialScore.overall}</span>
              <span className="block text-xs text-ink-light">/100</span>
            </div>
          </CircularProgress>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-light">Connections</span>
              <div className="flex items-center gap-2">
                <ProgressBar value={socialScore.connections} max={100} color="bg-rose-400" showLabel={false} />
                <span className="text-sm font-semibold text-rose-600 w-8">{socialScore.connections}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-light">Frequency</span>
              <div className="flex items-center gap-2">
                <ProgressBar value={socialScore.frequency} max={100} color="bg-pink-400" showLabel={false} />
                <span className="text-sm font-semibold text-pink-600 w-8">{socialScore.frequency}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-light">Quality</span>
              <div className="flex items-center gap-2">
                <ProgressBar value={socialScore.quality} max={100} color="bg-purple-400" showLabel={false} />
                <span className="text-sm font-semibold text-purple-600 w-8">{socialScore.quality}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {socialScore.trend === 'up' && <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />}
            {socialScore.trend === 'down' && <ArrowTrendingDownIcon className="w-5 h-5 text-rose-500" />}
            {socialScore.trend === 'stable' && <MinusIcon className="w-5 h-5 text-amber-500" />}
            <span className={`text-sm font-medium ${
              socialScore.trend === 'up' ? 'text-emerald-600' : 
              socialScore.trend === 'down' ? 'text-rose-600' : 'text-amber-600'
            }`}>
              {socialScore.trend === 'up' ? 'Trending up this week' : 
               socialScore.trend === 'down' ? 'Needs attention' : 'Stable'}
            </span>
          </div>
          <span className="text-xs text-ink-light">
            {connections.filter(c => !isOverdue(c)).length} of {connections.length} connections on track
          </span>
        </div>
      </div>
    </Card>
  );

  const ConnectionsPanel = () => (
    <Card 
      title="Your Connections" 
      icon={<UserGroupIcon className="w-5 h-5" />}
      action={
        <button 
          onClick={() => setShowAddConnection(true)}
          className="p-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4 text-rose-600" />
        </button>
      }
      className="h-full"
    >
      {/* Search & Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-light" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-input pl-10 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(['all', 'family', 'friend', 'partner', 'colleague'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-sand text-ink-light hover:bg-sand/80'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat !== 'all' && (
                <span className="ml-1 opacity-70">
                  ({connections.filter(c => c.relationshipType === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Connections List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredConnections.map(connection => {
          const daysSince = getDaysSinceContact(connection.lastContactDate);
          const goalDays = getFrequencyDays(connection.contactFrequencyGoal);
          const overdueLevel = getOverdueLevel(connection);
          
          return (
            <div 
              key={connection.id}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer group ${
                overdueLevel === 'critical' ? 'border-rose-300 bg-rose-50/50' :
                overdueLevel === 'warning' ? 'border-amber-200 bg-amber-50/30' :
                'border-transparent bg-sand/30 hover:bg-sand/50'
              }`}
              onClick={() => setSelectedConnection(connection)}
            >
              <div className="flex items-start gap-3">
                <Avatar name={connection.name} size="md" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink truncate">{connection.name}</span>
                    {connection.isPriority && <StarIconSolid className="w-4 h-4 text-amber-400" />}
                    {overdueLevel !== 'none' && (
                      <ExclamationCircleIcon className={`w-4 h-4 ${
                        overdueLevel === 'critical' ? 'text-rose-500' : 'text-amber-500'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${RELATIONSHIP_COLORS[connection.relationshipType].bg} ${RELATIONSHIP_COLORS[connection.relationshipType].text}`}>
                      {RELATIONSHIP_COLORS[connection.relationshipType].icon} {connection.relationshipType}
                    </span>
                    <span className={`text-xs ${daysSince > goalDays ? 'text-rose-600 font-medium' : 'text-ink-light'}`}>
                      {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`}
                    </span>
                  </div>
                  
                  {connection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {connection.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-ink-light bg-white/50 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePriority(connection); }}
                    className="p-1.5 hover:bg-sand rounded-lg"
                    title={connection.isPriority ? 'Remove priority' : 'Mark as priority'}
                  >
                    {connection.isPriority ? 
                      <StarIconSolid className="w-4 h-4 text-amber-400" /> : 
                      <StarIcon className="w-4 h-4 text-ink-light" />
                    }
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-3 pt-2 border-t border-sand/50">
                {(['call', 'message', 'video', 'meetup'] as ContactType[]).map(type => (
                  <button
                    key={type}
                    onClick={(e) => { e.stopPropagation(); handleQuickContact(connection, type); }}
                    className="flex-1 py-1.5 text-xs bg-white/60 hover:bg-rose-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{CONTACT_TYPE_ICONS[type]}</span>
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  const ContactLogPanel = () => (
    <Card title="Recent Contact Log" icon={<ClockIcon className="w-5 h-5" />}>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {recentContacts.map(entry => (
          <div key={entry.id} className="flex gap-3 p-3 bg-sand/30 rounded-xl hover:bg-sand/50 transition-colors">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${CONTACT_TYPE_COLORS[entry.type]}20` }}
            >
              {CONTACT_TYPE_ICONS[entry.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{entry.connectionName}</span>
                <span className="text-xs text-ink-light">
                  {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-ink-light capitalize">{entry.type}</span>
                <span className="text-xs text-ink-light">•</span>
                <span className="text-xs text-ink-light">{formatDuration(entry.duration)}</span>
                <span className="text-xs text-ink-light">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{entry.quality >= 8 ? '😊' : entry.quality >= 5 ? '😐' : '😔'}</span>
                  <span className="text-xs text-ink-light">{entry.quality}/10</span>
                </div>
              </div>
              
              {entry.notes && (
                <p className="text-xs text-ink-light mt-1 line-clamp-2">{entry.notes}</p>
              )}
            </div>
          </div>
        ))}
        
        {recentContacts.length === 0 && (
          <div className="text-center py-8 text-ink-light">
            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No recent contacts</p>
            <p className="text-sm">Reach out to someone!</p>
          </div>
        )}
      </div>
    </Card>
  );

  const QualityTimeTracker = () => {
    const progress = Math.min((weeklyStats.qualityTime / weeklyStats.goal) * 100, 100);
    const isAhead = weeklyStats.qualityTime > weeklyStats.previousWeek;
    
    return (
      <Card 
        title="Quality Time Tracker" 
        icon={<HeartIcon className="w-5 h-5" />}
        action={
          <span className="text-xs text-ink-light">This week</span>
        }
      >
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-rose-600">
            {Math.floor(weeklyStats.qualityTime / 60)}h {weeklyStats.qualityTime % 60}m
          </div>
          <p className="text-sm text-ink-light mt-1">
            of {Math.floor(weeklyStats.goal / 60)}h goal
            <span className={`ml-2 ${isAhead ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isAhead ? '↑' : '↓'} {Math.abs(Math.round((weeklyStats.qualityTime - weeklyStats.previousWeek) / weeklyStats.previousWeek * 100))}%
            </span>
          </p>
        </div>
        
        <ProgressBar 
          value={weeklyStats.qualityTime} 
          max={weeklyStats.goal} 
          color="bg-gradient-to-r from-rose-400 to-pink-500"
        />
        
        {/* Breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {Object.entries(weeklyStats.breakdown).map(([category, minutes]) => (
            <div key={category} className="flex items-center gap-2 p-2 bg-sand/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                category === 'family' ? 'bg-rose-400' :
                category === 'friend' ? 'bg-amber-400' :
                category === 'partner' ? 'bg-pink-400' :
                category === 'colleague' ? 'bg-blue-400' : 'bg-purple-400'
              }`} />
              <div className="flex-1">
                <span className="text-xs text-ink-light capitalize">{category}</span>
                <p className="text-sm font-medium">{Math.floor(minutes / 60)}h {minutes % 60}m</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="neu-button w-full mt-4 text-sm py-3">
          <SparklesIcon className="w-4 h-4 inline mr-2" />
          Plan Quality Time
        </button>
      </Card>
    );
  };

  const ActivityIdeasPanel = () => {
    const [selectedActivityCategory, setSelectedActivityCategory] = useState<ActivityCategory | 'all'>('all');
    
    const filteredActivities = ACTIVITY_IDEAS.filter(a => 
      selectedActivityCategory === 'all' || a.category === selectedActivityCategory
    );
    
    return (
      <Card title="Activity Ideas" icon={<LightBulbIcon className="w-5 h-5" />}>
        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['all', 'family', 'friends', 'partner', 'group'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedActivityCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedActivityCategory === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-sand text-ink-light hover:bg-sand/80'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Activity Cards */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="p-3 bg-sand/30 rounded-xl hover:bg-sand/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-ink">{activity.title}</h4>
                  <p className="text-xs text-ink-light mt-1">{activity.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  activity.category === 'family' ? 'bg-rose-100 text-rose-700' :
                  activity.category === 'friends' ? 'bg-amber-100 text-amber-700' :
                  activity.category === 'partner' ? 'bg-pink-100 text-pink-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {activity.category}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-ink-light">
                <span>⏱️ {activity.duration}</span>
                <span>💰 {activity.cost}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {activity.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/60 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Weekend Suggestion */}
        <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <div className="flex items-start gap-2">
            <SparklesIcon className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-rose-800">This weekend you could...</p>
              <p className="text-sm text-rose-600 mt-1">
                Have a picnic in the park with friends and play frisbee! 🌳🥪
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const CommunicationTools = () => (
    <Card title="Communication Tools" icon={<ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />}>
      <div className="space-y-4">
        {/* Conversation Starters */}
        <div>
          <h4 className="text-sm font-medium text-ink mb-2">Conversation Starters</h4>
          <div className="p-3 bg-sand/30 rounded-xl">
            <p className="text-sm text-ink italic">
              "{CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)]}"
            </p>
            <button 
              onClick={() => toast.success('New conversation starter!')}
              className="text-xs text-rose-600 mt-2 hover:underline"
            >
              Get another
            </button>
          </div>
        </div>
        
        {/* Gratitude Prompts */}
        <div>
          <h4 className="text-sm font-medium text-ink mb-2">Gratitude Prompts</h4>
          <div className="flex flex-wrap gap-2">
            {GRATITUDE_PROMPTS.slice(0, 4).map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  navigator.clipboard.writeText(prompt);
                  toast.success('Copied to clipboard!');
                }}
                className="text-xs bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
              >
                {prompt.substring(0, 20)}...
              </button>
            ))}
          </div>
        </div>
        
        {/* Listening Tips */}
        <div>
          <h4 className="text-sm font-medium text-ink mb-2">Active Listening Tips</h4>
          <div className="space-y-2">
            {LISTENING_TIPS.slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-sand/20 rounded-lg">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-ink">{tip.title}</p>
                  <p className="text-xs text-ink-light">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const SocialAnalytics = () => {
    const radarData = [
      { subject: 'Family', A: 80, fullMark: 100 },
      { subject: 'Friends', A: 65, fullMark: 100 },
      { subject: 'Partner', A: 90, fullMark: 100 },
      { subject: 'Work', A: 70, fullMark: 100 },
      { subject: 'Community', A: 45, fullMark: 100 },
      { subject: 'Self-care', A: 75, fullMark: 100 },
    ];

    const trendData = [
      { day: 'Mon', contacts: 3, quality: 8 },
      { day: 'Tue', contacts: 5, quality: 9 },
      { day: 'Wed', contacts: 2, quality: 7 },
      { day: 'Thu', contacts: 4, quality: 8 },
      { day: 'Fri', contacts: 6, quality: 9 },
      { day: 'Sat', contacts: 8, quality: 10 },
      { day: 'Sun', contacts: 4, quality: 8 },
    ];

    return (
      <Card title="Social Analytics" icon={<ChartBarIcon className="w-5 h-5" />}>
        {/* Relationship Balance Wheel */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-ink mb-2">Relationship Balance</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#d4ccb8" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#5c5243' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contact Frequency Trend */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-ink mb-2">Weekly Contact Activity</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4ccb8" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#e4dfd5', 
                    border: '1px solid #d4ccb8',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="contacts" stroke="#ec4899" fillOpacity={1} fill="url(#colorContacts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Battery */}
        <div className="p-4 bg-sand/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink">Social Battery</span>
            <span className="text-xs text-ink-light">65% - Balanced</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 rounded-full" />
          </div>
          <p className="text-xs text-ink-light mt-2">
            You're maintaining healthy social energy levels this week
          </p>
        </div>

        {/* Loneliness Scale */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-600">2.3</p>
            <p className="text-xs text-emerald-700">Loneliness Scale</p>
            <p className="text-xs text-emerald-600">Low (Good!)</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-blue-600">4.2:1</p>
            <p className="text-xs text-blue-700">Social:Alone Ratio</p>
            <p className="text-xs text-blue-600">Healthy balance</p>
          </div>
        </div>
      </Card>
    );
  };

  const GoalsPanel = () => (
    <Card title="Goals & Reminders" icon={<TrophyIcon className="w-5 h-5" />}>
      <div className="space-y-3">
        {goals.map(goal => (
          <div 
            key={goal.id} 
            className={`p-3 rounded-xl border-2 transition-all ${
              goal.completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-transparent bg-sand/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setGoals(goals.map(g => g.id === goal.id ? { ...g, completed: !g.completed } : g));
                    toast.success(goal.completed ? 'Goal reactivated!' : 'Goal completed! 🎉');
                  }}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    goal.completed 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-ink-light hover:border-rose-500'
                  }`}
                >
                  {goal.completed && <CheckCircleIcon className="w-4 h-4 text-white" />}
                </button>
                <span className={`text-sm font-medium ${goal.completed ? 'line-through text-ink-light' : 'text-ink'}`}>
                  {goal.title}
                </span>
              </div>
              {goal.streak && goal.streak > 0 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <FireIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{goal.streak}</span>
                </div>
              )}
            </div>
            
            {!goal.completed && (
              <div className="mt-2">
                <ProgressBar 
                  value={goal.current} 
                  max={goal.target} 
                  color="bg-rose-500"
                  label={`${goal.current}/${goal.target}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Reminders */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-ink mb-3">Upcoming</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
            <GiftIcon className="w-4 h-4 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm">Mom's Birthday</p>
              <p className="text-xs text-ink-light">In 5 days • March 15</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-rose-50 rounded-lg">
            <HeartIcon className="w-4 h-4 text-rose-600" />
            <div className="flex-1">
              <p className="text-sm">Anniversary with Alex</p>
              <p className="text-xs text-ink-light">In 12 days • March 22</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const AssessmentPanel = () => (
    <Card title="Relationship Assessments" icon={<SparklesIcon className="w-5 h-5" />}>
      <div className="space-y-3">
        {/* Assessment Cards */}
        {assessments.map((assessment, i) => (
          <div key={i} className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-rose-800 capitalize">
                {assessment.type.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-xs text-rose-600">
                {assessment.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-lg font-bold text-rose-700 mt-1">{assessment.primaryResult}</p>
            {assessment.secondaryResult && (
              <p className="text-xs text-rose-600">Secondary: {assessment.secondaryResult}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {assessment.insights.slice(0, 2).map((insight, j) => (
                <span key={j} className="text-xs bg-white/60 px-2 py-0.5 rounded text-rose-700">
                  {insight}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Available Assessments */}
        <div className="pt-2 border-t border-sand">
          <p className="text-sm font-medium text-ink mb-2">Available Assessments</p>
          <div className="space-y-2">
            {[
              { name: 'Relationship Satisfaction', icon: '💕', desc: 'How fulfilled are you?' },
              { name: 'Communication Style', icon: '🗣️', desc: 'How do you connect?' },
              { name: 'Love Language', icon: '💝', desc: 'How do you show love?' },
              { name: 'Attachment Style', icon: '🔗', desc: 'How do you bond?' },
            ].map((a) => (
              <button
                key={a.name}
                onClick={() => toast.success(`Starting ${a.name} assessment...`)}
                className="w-full p-3 bg-sand/30 rounded-xl hover:bg-sand/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{a.name}</p>
                    <p className="text-xs text-ink-light">{a.desc}</p>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-ink-light ml-auto" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  // ============================================
  // MODALS
  // ============================================

  const ConnectionDetailModal = () => {
    if (!selectedConnection) return null;
    
    const connectionLogs = contactLog.filter(c => c.connectionId === selectedConnection.id);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="neu-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedConnection.name} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-ink">{selectedConnection.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${RELATIONSHIP_COLORS[selectedConnection.relationshipType].bg} ${RELATIONSHIP_COLORS[selectedConnection.relationshipType].text}`}>
                  {RELATIONSHIP_COLORS[selectedConnection.relationshipType].icon} {selectedConnection.relationshipType}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedConnection(null)} className="p-2 hover:bg-sand rounded-lg">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-sand/30 rounded-xl text-center">
              <p className="text-2xl font-bold text-rose-600">{connectionLogs.length}</p>
              <p className="text-xs text-ink-light">Interactions</p>
            </div>
            <div className="p-3 bg-sand/30 rounded-xl text-center">
              <p className="text-2xl font-bold text-amber-600">{getDaysSinceContact(selectedConnection.lastContactDate)}</p>
              <p className="text-xs text-ink-light">Days since contact</p>
            </div>
            <div className="p-3 bg-sand/30 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {connectionLogs.length > 0 
                  ? Math.round(connectionLogs.reduce((a, b) => a + b.quality, 0) / connectionLogs.length)
                  : '-'}
              </p>
              <p className="text-xs text-ink-light">Avg quality</p>
            </div>
          </div>

          {/* Contact Frequency */}
          <div className="mb-4">
            <label className="text-sm font-medium text-ink">Contact Goal</label>
            <select 
              value={selectedConnection.contactFrequencyGoal}
              onChange={(e) => {
                setConnections(connections.map(c => 
                  c.id === selectedConnection.id 
                    ? { ...c, contactFrequencyGoal: e.target.value as Connection['contactFrequencyGoal'] }
                    : c
                ));
              }}
              className="neu-input mt-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {(['call', 'message', 'video', 'meetup'] as ContactType[]).map(type => (
              <button
                key={type}
                onClick={() => {
                  handleQuickContact(selectedConnection, type);
                  setSelectedConnection(null);
                }}
                className="p-3 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors"
              >
                <span className="text-2xl block mb-1">{CONTACT_TYPE_ICONS[type]}</span>
                <span className="text-xs capitalize">{type}</span>
              </button>
            ))}
          </div>

          {/* History */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-2">Recent History</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {connectionLogs.map(log => (
                <div key={log.id} className="flex items-center gap-2 p-2 bg-sand/20 rounded-lg text-sm">
                  <span>{CONTACT_TYPE_ICONS[log.type]}</span>
                  <span className="text-ink-light">{log.date.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{formatDuration(log.duration)}</span>
                  <span>•</span>
                  <span>Quality: {log.quality}/10</span>
                </div>
              ))}
              {connectionLogs.length === 0 && (
                <p className="text-sm text-ink-light text-center py-4">No interactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-10">💕</div>
        <div className="absolute top-40 right-20 text-3xl opacity-10">🤝</div>
        <div className="absolute top-60 left-1/4 text-2xl opacity-10">❤️</div>
        <div className="absolute bottom-40 left-20 text-3xl opacity-10">🌟</div>
        <div className="absolute bottom-60 right-40 text-2xl opacity-10">💝</div>
        <div className="absolute top-1/3 right-1/3 text-2xl opacity-5">✨</div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-ink mb-2 flex items-center gap-3">
                <span className="bg-gradient-to-br from-rose-400 to-pink-500 text-white p-2 rounded-xl">
                  <HeartIconSolid className="w-8 h-8" />
                </span>
                Relationships
              </h1>
              <p className="text-ink-light">Nurture your connections, strengthen bonds</p>
            </div>
            
            <SocialScoreCard />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Connections & Contact Log */}
          <div className="lg:col-span-4 space-y-6">
            <ConnectionsPanel />
            <ContactLogPanel />
          </div>

          {/* Center Panel - Quality Time & Activities */}
          <div className="lg:col-span-4 space-y-6">
            <QualityTimeTracker />
            <ActivityIdeasPanel />
            <CommunicationTools />
          </div>

          {/* Right Panel - Analytics & Goals */}
          <div className="lg:col-span-4 space-y-6">
            <SocialAnalytics />
            <GoalsPanel />
            <AssessmentPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedConnection && <ConnectionDetailModal />}
    </div>
  );
}
