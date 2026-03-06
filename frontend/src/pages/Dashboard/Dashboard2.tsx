import { useState, useEffect, useCallback, useMemo } from 'react';
import './Dashboard2.css';
import {
  Activity,
  Moon,
  Sun,
  Droplets,
  Heart,
  Flame,
  Trophy,
  Calendar,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Plus,
  Check,
  Bell,
  Zap,
  Target,
  Users,
  Award,
  Clock,
  Utensils,
  Brain,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MoreHorizontal,
  Expand,
  X,
} from 'lucide-react';
import type {
  DashboardState,
  ChecklistItem,
  MoodEntry,
  AIInsight,
} from '../../types/dashboard';
import {
  getMockDashboardState,
  getTodayFormatted,
  calculateRingProgress,
  getMoodEmoji,
  getQualityColor,
  getInsightIcon,
} from '../../utils/dashboard';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Circular Progress Ring Component
const CircularProgress = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = '#5c5243',
  bgColor = '#d4ccb8',
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="shadow-inner"
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
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

// Activity Ring (Apple Watch style)
const ActivityRing = ({
  progress,
  color,
  size = 70,
  strokeWidth = 10,
}: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
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
        stroke={`${color}30`}
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
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

// Sparkline Chart Component
const Sparkline = ({
  data,
  width = 100,
  height = 30,
  color = '#5c5243',
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
    </svg>
  );
};

// Mini Bar Chart for Health Breakdown
const MiniBarChart = ({
  data,
}: {
  data: Record<string, number>;
}) => {
  const entries = Object.entries(data);
  
  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs font-medium capitalize w-16 text-[#5c5243]">{key}</span>
          <div className="flex-1 h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${value}%`,
                background: `linear-gradient(90deg, #5c5243, ${value > 80 ? '#22c55e' : value > 60 ? '#84cc16' : '#eab308'})`,
              }}
            />
          </div>
          <span className="text-xs font-bold w-8 text-right text-[#2d2418]">{value}</span>
        </div>
      ))}
    </div>
  );
};

// Radar Chart Component (simplified)
const RadarChart = ({
  data,
  size = 150,
}: {
  data: Record<string, number>;
  size?: number;
}) => {
  const entries = Object.entries(data);
  const numPoints = entries.length;
  const center = size / 2;
  const radius = size / 2 - 20;

  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = entries.map(([, value], index) => getPoint(index, value));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size}>
      {/* Background grid */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={entries.map((_, i) => {
            const p = getPoint(i, scale * 100);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="#d4ccb8"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}
      {/* Data polygon */}
      <path d={pathD} fill="rgba(92, 82, 67, 0.2)" stroke="#5c5243" strokeWidth="2" />
      {/* Labels */}
      {entries.map(([key], index) => {
        const p = getPoint(index, 110);
        return (
          <text
            key={key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="#5c5243"
            className="font-medium"
          >
            {key.slice(0, 3)}
          </text>
        );
      })}
    </svg>
  );
};

// Mood Sparkline
const MoodSparkline = ({ data }: { data: MoodEntry[] }) => {
  const moodValues = data.map(d => d.mood);
  
  return (
    <div className="flex items-end justify-between h-12 gap-1">
      {data.map((entry, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <div
            className="w-6 rounded-t-md transition-all duration-300"
            style={{
              height: `${entry.mood * 8}px`,
              backgroundColor: entry.mood >= 4 ? '#22c55e' : entry.mood >= 3 ? '#84cc16' : entry.mood >= 2 ? '#eab308' : '#ef4444',
            }}
          />
          <span className="text-[10px] text-[#5c5243]">{entry.date}</span>
        </div>
      ))}
    </div>
  );
};

// Widget Card Component
const WidgetCard = ({
  children,
  title,
  icon: Icon,
  action,
  onAction,
  className = '',
  expanded = false,
  onToggleExpand,
}: {
  children: React.ReactNode;
  title: string;
  icon?: React.ElementType;
  action?: string;
  onAction?: () => void;
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) => {
  return (
    <div
      className={`module-ivory p-4 rounded-2xl transition-all duration-300 hover:shadow-xl ${className}`}
      style={{
        boxShadow: '8px 8px 16px #a8a093, -8px -8px 16px #ffffff, inset 1px 1px 3px rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#d4ccb8] shadow-inner">
              <Icon className="w-4 h-4 text-[#5c5243]" />
            </div>
          )}
          <h3 className="font-bold text-[#2d2418] text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-lg hover:bg-[#d4ccb8] transition-colors"
            >
              {expanded ? <X className="w-4 h-4 text-[#5c5243]" /> : <Expand className="w-4 h-4 text-[#5c5243]" />}
            </button>
          )}
          {action && (
            <button
              onClick={onAction}
              className="text-xs font-semibold text-[#5c5243] hover:text-[#2d2418] transition-colors flex items-center gap-1"
            >
              {action} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function Dashboard2() {
  const [data, setData] = useState<DashboardState>(getMockDashboardState());
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(data.widgets.mood.todayMood);
  const [checklist, setChecklist] = useState(data.todayProgress.checklist);
  const [waterAmount, setWaterAmount] = useState(data.widgets.nutrition.waterIntake);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        widgets: {
          ...prev.widgets,
          activity: {
            ...prev.widgets.activity,
            steps: {
              ...prev.widgets.activity.steps,
              current: prev.widgets.activity.steps.current + Math.floor(Math.random() * 5),
            },
          },
        },
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle checklist item
  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const completed = updated.filter(i => i.completed).length;
      setData(d => ({
        ...d,
        todayProgress: { ...d.todayProgress, completionRate: Math.round((completed / updated.length) * 100) },
      }));
      return updated;
    });
  }, []);

  // Add water
  const addWater = useCallback((amount: number) => {
    setWaterAmount(prev => {
      const newAmount = Math.min(prev + amount, data.widgets.nutrition.waterGoal * 1.5);
      setData(d => ({
        ...d,
        widgets: { ...d.widgets, nutrition: { ...d.widgets.nutrition, waterIntake: newAmount } },
      }));
      return newAmount;
    });
  }, [data.widgets.nutrition.waterGoal]);

  // Completion rate calculation
  const completionRate = useMemo(() => {
    return Math.round((checklist.filter(i => i.completed).length / checklist.length) * 100);
  }, [checklist]);

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-5 h-5 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-[#dcd3c6] texture-bone font-display text-[#2d2418]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 matte-bar">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="deep-bay rounded-full p-1">
                <button className="flex size-10 items-center justify-center nav-btn">
                  <span className="text-[#2d2418] text-lg">☰</span>
                </button>
              </div>
              <div>
                <h1 className="text-lg font-bold text-stamped uppercase tracking-wider">Dashboard</h1>
                <p className="text-xs text-[#5c5243]">{getTodayFormatted()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 module-ivory px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-[#5c5243]" />
                <span className="text-sm font-semibold">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <button className="relative deep-bay rounded-full p-1">
                <div className="flex size-10 items-center justify-center nav-btn">
                  <Bell className="w-5 h-5 text-[#2d2418]" />
                </div>
                {data.social.unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {data.social.unreadMessages}
                  </span>
                )}
              </button>
              
              <button className="deep-bay rounded-full p-1 flex items-center justify-center">
                <div className="flex size-10 items-center justify-center nav-btn bg-[#5c5243]">
                  <span className="text-[#e4dfd5] font-bold text-sm">JD</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Health Score & Daily Checklist */}
          <div className="lg:col-span-3 space-y-6">
            {/* Health Score Widget */}
            <WidgetCard
              title="Health Score"
              icon={Heart}
              action="Details"
              expanded={expandedWidget === 'health'}
              onToggleExpand={() => setExpandedWidget(expandedWidget === 'health' ? null : 'health')}
              className="relative overflow-hidden"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <CircularProgress
                    progress={data.healthScore.overall}
                    size={140}
                    strokeWidth={14}
                    color={data.healthScore.overall > 80 ? '#22c55e' : data.healthScore.overall > 60 ? '#84cc16' : '#eab308'}
                    bgColor="#d4ccb8"
                  >
                    <div className="text-center">
                      <span className="text-4xl font-bold text-[#2d2418]">{data.healthScore.overall}</span>
                      <span className="text-xs text-[#5c5243] block">/100</span>
                    </div>
                  </CircularProgress>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#e4dfd5] shadow-lg flex items-center justify-center">
                    {getTrendIcon(data.healthScore.trend)}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-[#5c5243]">vs last week:</span>
                  <span className={`font-bold ${data.healthScore.trend === 'up' ? 'text-green-600' : data.healthScore.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                    {data.healthScore.trend === 'up' ? '+' : ''}{data.healthScore.overall - data.healthScore.lastWeekScore}
                  </span>
                </div>
                
                <div className="mt-4 w-full">
                  <MiniBarChart data={data.healthScore.breakdown} />
                </div>
                
                {expandedWidget === 'health' && (
                  <div className="mt-4 pt-4 border-t border-[#d4ccb8] w-full">
                    <p className="text-xs text-[#5c5243] text-center">
                      Last 30 days: You're in the top 15% of users in your age group!
                    </p>
                  </div>
                )}
              </div>
            </WidgetCard>

            {/* Daily Checklist Widget */}
            <WidgetCard
              title="Daily Checklist"
              icon={Check}
              action="Edit"
              className="h-fit"
            >
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#5c5243] font-medium">Progress</span>
                  <span className="font-bold text-[#2d2418]">{completionRate}%</span>
                </div>
                <div className="h-3 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completionRate}%`,
                      background: 'linear-gradient(90deg, #5c5243, #22c55e)',
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      item.completed
                        ? 'bg-[#22c55e]/10 shadow-inner'
                        : 'bg-[#d4ccb8]/30 hover:bg-[#d4ccb8]/50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-[#22c55e] shadow-lg'
                          : 'bg-[#d4ccb8] shadow-inner'
                      }`}
                    >
                      {item.completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${item.completed ? 'line-through text-[#5c5243]' : 'text-[#2d2418]'}`}>
                        {item.title}
                      </p>
                      {item.time && <p className="text-[10px] text-[#5c5243]">{item.time}</p>}
                    </div>
                    <span className="text-lg">{
                      item.type === 'morning' ? '☀️' :
                      item.type === 'medication' ? '💊' :
                      item.type === 'water' ? '💧' :
                      item.type === 'sleep' ? '😴' : '🧠'
                    }</span>
                  </button>
                ))}
              </div>
            </WidgetCard>

            {/* Habits Streak Widget */}
            <WidgetCard title="Habit Streaks" icon={Target}>
              <div className="space-y-3">
                {data.widgets.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#d4ccb8]/30"
                  >
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#2d2418]">{habit.name}</p>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-[#5c5243]">{habit.streak} day streak</span>
                      </div>
                    </div>
                    <button
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        habit.completedToday
                          ? 'bg-[#22c55e] shadow-lg'
                          : 'bg-[#d4ccb8] shadow-inner hover:shadow-md'
                      }`}
                    >
                      <Check className={`w-5 h-5 ${habit.completedToday ? 'text-white' : 'text-[#5c5243]'}`} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Don't break the chain visualization */}
              <div className="mt-4 pt-3 border-t border-[#d4ccb8]">
                <p className="text-[10px] text-[#5c5243] mb-2 uppercase tracking-wider">Last 14 Days</p>
                <div className="flex gap-1">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-6 rounded-md ${
                        i < 11 ? 'bg-[#22c55e] shadow-sm' : i === 11 ? 'bg-orange-400' : 'bg-[#d4ccb8]'
                      }`}
                      title={i < 11 ? 'Completed' : i === 11 ? 'Today' : 'Upcoming'}
                    />
                  ))}
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* CENTER COLUMN - Main Widgets Grid */}
          <div className="lg:col-span-6 space-y-6">
            {/* Activity Rings Widget */}
            <WidgetCard
              title="Activity"
              icon={Activity}
              action="Movement"
              onAction={() => console.log('Navigate to Movement')}
              expanded={expandedWidget === 'activity'}
              onToggleExpand={() => setExpandedWidget(expandedWidget === 'activity' ? null : 'activity')}
            >
              <div className="flex items-center justify-around">
                <div className="relative">
                  <ActivityRing
                    progress={calculateRingProgress(data.widgets.activity.move.current, data.widgets.activity.move.goal)}
                    color={data.widgets.activity.move.color}
                    size={90}
                    strokeWidth={14}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Flame className="w-5 h-5 mx-auto text-red-500" />
                      <span className="text-xs font-bold">{data.widgets.activity.move.current}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <ActivityRing
                    progress={calculateRingProgress(data.widgets.activity.exercise.current, data.widgets.activity.exercise.goal)}
                    color={data.widgets.activity.exercise.color}
                    size={90}
                    strokeWidth={14}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-5 h-5 mx-auto text-green-500" />
                      <span className="text-xs font-bold">{data.widgets.activity.exercise.current}m</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <ActivityRing
                    progress={calculateRingProgress(data.widgets.activity.stand.current, data.widgets.activity.stand.goal)}
                    color={data.widgets.activity.stand.color}
                    size={90}
                    strokeWidth={14}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Sun className="w-5 h-5 mx-auto text-blue-500" />
                      <span className="text-xs font-bold">{data.widgets.activity.stand.current}h</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-xl bg-[#d4ccb8]/30">
                  <p className="text-2xl font-bold text-[#2d2418]">{data.widgets.activity.steps.current.toLocaleString()}</p>
                  <p className="text-[10px] text-[#5c5243] uppercase tracking-wider">Steps</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-[#d4ccb8]/30">
                  <p className="text-2xl font-bold text-[#2d2418]">{data.widgets.activity.calories}</p>
                  <p className="text-[10px] text-[#5c5243] uppercase tracking-wider">Kcal</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-[#d4ccb8]/30">
                  <p className="text-2xl font-bold text-[#2d2418]">{data.widgets.activity.activeMinutes}m</p>
                  <p className="text-[10px] text-[#5c5243] uppercase tracking-wider">Active</p>
                </div>
              </div>
            </WidgetCard>

            {/* Nutrition & Sleep Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nutrition Quick View */}
              <WidgetCard
                title="Nutrition"
                icon={Utensils}
                action="Log"
              >
                <div className="flex items-center gap-4">
                  <CircularProgress
                    progress={calculateRingProgress(data.widgets.nutrition.caloriesConsumed, data.widgets.nutrition.caloriesGoal)}
                    size={100}
                    strokeWidth={10}
                    color="#f59e0b"
                  >
                    <div className="text-center">
                      <span className="text-lg font-bold text-[#2d2418]">{data.widgets.nutrition.caloriesGoal - data.widgets.nutrition.caloriesConsumed}</span>
                      <span className="text-[10px] text-[#5c5243] block">kcal left</span>
                    </div>
                  </CircularProgress>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5c5243]">Protein</span>
                        <span className="font-bold">{data.widgets.nutrition.protein.current}g</span>
                      </div>
                      <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${calculateRingProgress(data.widgets.nutrition.protein.current, data.widgets.nutrition.protein.goal)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5c5243]">Carbs</span>
                        <span className="font-bold">{data.widgets.nutrition.carbs.current}g</span>
                      </div>
                      <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                          style={{ width: `${calculateRingProgress(data.widgets.nutrition.carbs.current, data.widgets.nutrition.carbs.goal)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5c5243]">Fats</span>
                        <span className="font-bold">{data.widgets.nutrition.fats.current}g</span>
                      </div>
                      <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${calculateRingProgress(data.widgets.nutrition.fats.current, data.widgets.nutrition.fats.goal)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-2 rounded-lg bg-[#d4ccb8]/30 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#2d2418]">{data.widgets.nutrition.lastMeal.name}</p>
                    <p className="text-[10px] text-[#5c5243]">{data.widgets.nutrition.lastMeal.time} • {data.widgets.nutrition.lastMeal.calories} kcal</p>
                  </div>
                </div>
                
                <button className="mt-3 w-full py-2 rounded-xl bg-[#5c5243] text-[#e4dfd5] font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Log Meal
                </button>
              </WidgetCard>

              {/* Sleep Summary Widget */}
              <WidgetCard
                title="Sleep"
                icon={Moon}
                action="Details"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <CircularProgress
                      progress={data.widgets.sleep.score}
                      size={90}
                      strokeWidth={10}
                      color={getQualityColor(data.widgets.sleep.quality)}
                    >
                      <div className="text-center">
                        <Moon className="w-6 h-6 mx-auto text-indigo-500" />
                        <span className="text-lg font-bold text-[#2d2418]">{data.widgets.sleep.score}</span>
                      </div>
                    </CircularProgress>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#2d2418]">{data.widgets.sleep.duration}</span>
                      <span className="text-xs text-[#5c5243]">hours</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#5c5243]">{data.widgets.sleep.bedTime} → {data.widgets.sleep.wakeTime}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${getQualityColor(data.widgets.sleep.quality)}20`,
                          color: getQualityColor(data.widgets.sleep.quality),
                        }}
                      >
                        {data.widgets.sleep.quality}
                      </span>
                    </div>
                  </div>
                </div>
                
                {data.widgets.sleep.sleepDebt > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                    <AlertIcon className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-600">
                      <span className="font-bold">Sleep debt:</span> {Math.floor(data.widgets.sleep.sleepDebt / 60)}h {data.widgets.sleep.sleepDebt % 60}m
                    </p>
                  </div>
                )}
              </WidgetCard>
            </div>

            {/* Mood Tracker & Body Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Tracker Widget */}
              <WidgetCard
                title="Mood Tracker"
                icon={Brain}
                action="Journal"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                        selectedMood === mood
                          ? 'bg-[#5c5243] shadow-lg scale-110'
                          : 'bg-[#d4ccb8]/50 hover:bg-[#d4ccb8] shadow-inner'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
                
                <MoodSparkline data={data.widgets.mood.weekData} />
                
                <div className="mt-4 flex items-center justify-between p-2 rounded-xl bg-[#d4ccb8]/30">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-[#5c5243]">Stress Level</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-4 h-4 rounded-sm ${
                          level <= data.widgets.mood.stressLevel ? 'bg-yellow-500' : 'bg-[#d4ccb8]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </WidgetCard>

              {/* Body Metrics Widget */}
              <WidgetCard
                title="Body Metrics"
                icon={TrendingUp}
                action="History"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#2d2418]">{data.bodyMetrics.weight.current}</p>
                    <p className="text-xs text-[#5c5243]">{data.bodyMetrics.weight.unit}</p>
                  </div>
                  <div className="flex-1">
                    <Sparkline data={data.bodyMetrics.weight.trend} width={120} height={40} />
                    <p className="text-[10px] text-[#5c5243] mt-1">Last 7 days</p>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-xl bg-[#d4ccb8]/30 text-center">
                    <p className="text-lg font-bold text-[#2d2418]">{data.bodyMetrics.bmi.value}</p>
                    <p className="text-[10px] text-[#5c5243]">BMI • {data.bodyMetrics.bmi.category}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#d4ccb8]/30">
                    <p className="text-[10px] text-[#5c5243] mb-1">Goal Progress</p>
                    <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                        style={{ width: `${data.bodyMetrics.goalProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[#2d2418] mt-1">{data.bodyMetrics.goalProgress}%</p>
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Gamification & Social Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gamification Widget */}
              <WidgetCard
                title="Achievements"
                icon={Trophy}
                action="View All"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{data.gamification.level}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#2d2418]">Level {data.gamification.level}</p>
                    <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(data.gamification.xp / data.gamification.xpToNext) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#5c5243] mt-1">
                      {data.gamification.xp} / {data.gamification.xpToNext} XP
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {data.gamification.recentBadges.slice(0, 2).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#d4ccb8]/30">
                      <span className="text-xl">{badge.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#2d2418]">{badge.name}</p>
                        <p className="text-[10px] text-[#5c5243]">{badge.description}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          badge.rarity === 'legendary'
                            ? 'bg-purple-100 text-purple-600'
                            : badge.rarity === 'epic'
                            ? 'bg-pink-100 text-pink-600'
                            : badge.rarity === 'rare'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {badge.rarity}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#3d3226] text-[#e4dfd5]">
                  <Award className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold">#{data.gamification.leaderboardPosition} on Leaderboard</p>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </WidgetCard>

              {/* Social Activity Widget */}
              <WidgetCard
                title="Social"
                icon={Users}
                action="Community"
              >
                <div className="space-y-2 mb-4">
                  {data.social.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#d4ccb8]/30">
                      <span className="text-lg">{activity.avatar}</span>
                      <div className="flex-1">
                        <p className="text-xs text-[#2d2418]">
                          <span className="font-bold">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                      </div>
                      <span className="text-[10px] text-[#5c5243]">{activity.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] text-[#5c5243] uppercase tracking-wider">Active Challenges</p>
                  {data.social.challenges.map((challenge) => (
                    <div key={challenge.id} className="p-2 rounded-xl bg-[#d4ccb8]/30">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-[#2d2418]">{challenge.name}</span>
                        <span className="text-[#5c5243]">{challenge.progress}/{challenge.total}</span>
                      </div>
                      <div className="h-2 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#5c5243] mt-1">{challenge.participants.toLocaleString()} participants</p>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>
          </div>

          {/* RIGHT SIDEBAR - AI Insights & Upcoming Events */}
          <div className="lg:col-span-3 space-y-6">
            {/* Water Tracker Mini */}
            <div className="module-ivory p-4 rounded-2xl" style={{
              boxShadow: '8px 8px 16px #a8a093, -8px -8px 16px #ffffff, inset 1px 1px 3px rgba(255,255,255,0.9)',
            }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-100 shadow-inner">
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-[#2d2418] text-sm">Water</h3>
                </div>
                <span className="text-lg font-bold text-blue-600">{Math.round(waterAmount)}ml</span>
              </div>
              
              <div className="relative h-8 bg-[#d4ccb8] rounded-full overflow-hidden shadow-inner mb-3">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min((waterAmount / data.widgets.nutrition.waterGoal) * 100, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#2d2418] mix-blend-difference">
                    {Math.round((waterAmount / data.widgets.nutrition.waterGoal) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 750].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => addWater(amount)}
                    className="py-2 rounded-xl bg-[#d4ccb8]/50 hover:bg-blue-100 transition-all text-xs font-bold text-[#5c5243] hover:text-blue-600"
                  >
                    +{amount}ml
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insights Feed */}
            <WidgetCard
              title="AI Insights"
              icon={Sparkles}
              expanded={expandedWidget === 'ai'}
              onToggleExpand={() => setExpandedWidget(expandedWidget === 'ai' ? null : 'ai')}
            >
              <div className="space-y-3">
                {data.aiInsights.map((insight) => (
                  <AIInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </WidgetCard>

            {/* Upcoming Events Widget */}
            <WidgetCard
              title="Upcoming"
              icon={Calendar}
              action="Full Schedule"
            >
              <div className="space-y-2">
                {data.widgets.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#d4ccb8]/30 hover:bg-[#d4ccb8]/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        event.type === 'medication'
                          ? 'bg-red-100'
                          : event.type === 'appointment'
                          ? 'bg-blue-100'
                          : event.type === 'workout'
                          ? 'bg-green-100'
                          : 'bg-purple-100'
                      }`}
                    >
                      {event.type === 'medication' ? '💊' : event.type === 'appointment' ? '🏥' : event.type === 'workout' ? '💪' : '🎉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2d2418] truncate">{event.title}</p>
                      <p className="text-[10px] text-[#5c5243]">{event.time}</p>
                      {event.description && (
                        <p className="text-[10px] text-[#5c5243] truncate">{event.description}</p>
                      )}
                    </div>
                    <button
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        event.completed
                          ? 'bg-[#22c55e]'
                          : 'bg-[#d4ccb8] hover:bg-[#c2b8a9]'
                      }`}
                    >
                      <Check className={`w-4 h-4 ${event.completed ? 'text-white' : 'text-[#5c5243]'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </WidgetCard>

            {/* Quick Actions */}
            <div className="module-ivory p-4 rounded-2xl" style={{
              boxShadow: '8px 8px 16px #a8a093, -8px -8px 16px #ffffff, inset 1px 1px 3px rgba(255,255,255,0.9)',
            }}>
              <h3 className="font-bold text-[#2d2418] text-sm mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton icon={Plus} label="Log Meal" color="orange" />
                <QuickActionButton icon={Activity} label="Workout" color="green" />
                <QuickActionButton icon={Moon} label="Log Sleep" color="indigo" />
                <QuickActionButton icon={Heart} label="Log Vitals" color="red" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// AI Insight Card Component
function AIInsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div className="p-3 rounded-xl bg-gradient-to-r from-[#f5f3f0] to-[#e4dfd5] border border-[#d4ccb8]">
      <div className="flex items-start gap-2">
        <span className="text-lg">{getInsightIcon(insight.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#2d2418]">{insight.title}</p>
          <p className="text-[11px] text-[#5c5243] mt-0.5 leading-relaxed">{insight.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-[#8c7a6b]">{insight.timestamp}</span>
            {insight.actionable && (
              <button className="text-[10px] font-bold text-[#5c5243] hover:text-[#2d2418] flex items-center gap-0.5">
                {insight.actionText} <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  };

  return (
    <button
      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
        colorClasses[color] || 'bg-gray-100 text-gray-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

// Alert Icon Component
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}


