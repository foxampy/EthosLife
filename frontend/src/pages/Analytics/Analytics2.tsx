import React, { useState, useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Moon,
  Footprints,
  Smile,
  Dumbbell,
  Pill,
  Target,
  Flame,
  Award,
  AlertCircle,
  Download,
  FileText,
  Share2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Zap,
  Brain,
  Utensils,
  Heart,
  FileDown,
  Settings,
  Printer,
  Mail,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  LayoutDashboard,
  FileSpreadsheet,
  Apple,
  Smartphone,
  Shield,
  Eye,
  Lock,
  Users,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface CorrelationPoint {
  x: number;
  y: number;
  label?: string;
}

interface Correlation {
  id: string;
  metric1: string;
  metric2: string;
  coefficient: number;
  strength: 'strong' | 'moderate' | 'weak';
  insight: string;
}

interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'opportunity' | 'pattern';
  title: string;
  description: string;
  confidence: number;
  metric?: string;
  change?: number;
}

interface Report {
  id: string;
  type: 'weekly' | 'monthly' | 'quarterly';
  title: string;
  dateRange: { start: string; end: string };
  summary: string;
  achievements: string[];
  improvements: string[];
  recommendations: string[];
  isRead: boolean;
}

interface WeeklySummary {
  calories: { value: number; change: number; unit: string };
  steps: { value: number; change: number; unit: string };
  sleep: { value: number; change: number; unit: string };
  mood: { value: number; change: number; unit: string };
  workouts: { value: number; change: number; unit: string };
  medication: { value: number; change: number; unit: string };
}

interface AnalyticsState {
  dateRange: {
    start: Date;
    end: Date;
  };
  overview: {
    healthScore: number;
    trend: 'up' | 'down' | 'stable';
    moduleScores: Record<string, number>;
  };
  trends: {
    weight: DataPoint[];
    sleep: DataPoint[];
    steps: DataPoint[];
    mood: DataPoint[];
    energy: DataPoint[];
  };
  correlations: Correlation[];
  insights: AIInsight[];
  reports: Report[];
  weeklySummary: WeeklySummary;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const generateDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates30 = generateDateRange(30);
const dates90 = generateDateRange(90);

const generateTrendData = (base: number, variance: number, dates: string[]): DataPoint[] => {
  return dates.map((date, index) => ({
    date,
    value: Math.round((base + Math.sin(index / 5) * variance + (Math.random() - 0.5) * variance * 0.5) * 10) / 10,
  }));
};

const mockAnalyticsState: AnalyticsState = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  },
  overview: {
    healthScore: 87,
    trend: 'up',
    moduleScores: {
      sleep: 85,
      nutrition: 78,
      fitness: 92,
      mental: 88,
      hydration: 75,
      medication: 95,
    },
  },
  trends: {
    weight: generateTrendData(75, 2, dates30),
    sleep: generateTrendData(7.5, 1.5, dates30),
    steps: generateTrendData(8500, 3000, dates30),
    mood: generateTrendData(7.2, 1.5, dates30),
    energy: generateTrendData(7.8, 1.2, dates30),
  },
  correlations: [
    {
      id: '1',
      metric1: 'Sleep Duration',
      metric2: 'Mood Score',
      coefficient: 0.82,
      strength: 'strong',
      insight: 'When you sleep 7+ hours, your mood improves by 20% on average',
    },
    {
      id: '2',
      metric1: 'Exercise',
      metric2: 'Sleep Quality',
      coefficient: 0.68,
      strength: 'moderate',
      insight: 'Workout days correlate with 15% better sleep quality',
    },
    {
      id: '3',
      metric1: 'Nutrition',
      metric2: 'Energy Levels',
      coefficient: 0.71,
      strength: 'moderate',
      insight: 'Balanced meals increase afternoon energy by 25%',
    },
    {
      id: '4',
      metric1: 'Stress',
      metric2: 'Productivity',
      coefficient: -0.64,
      strength: 'moderate',
      insight: 'High stress days show 30% decrease in productivity',
    },
  ],
  insights: [
    {
      id: '1',
      type: 'positive',
      title: 'Fitness Streak!',
      description: 'You\'ve completed workouts 5 days in a row. Keep it up!',
      confidence: 95,
      metric: 'workouts',
      change: 25,
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Sleep Opportunity',
      description: 'Your sleep on weekends is 1.5h longer than weekdays. Try to balance this.',
      confidence: 88,
      metric: 'sleep',
      change: -15,
    },
    {
      id: '3',
      type: 'pattern',
      title: 'Hydration Pattern',
      description: 'You drink 40% more water on workout days. Great awareness!',
      confidence: 92,
      metric: 'hydration',
      change: 40,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Stress Alert',
      description: 'Your stress levels have increased 20% this week. Consider mindfulness exercises.',
      confidence: 85,
      metric: 'stress',
      change: 20,
    },
  ],
  reports: [
    {
      id: '1',
      type: 'weekly',
      title: 'Weekly Health Report - Week 12',
      dateRange: { start: '2024-03-18', end: '2024-03-24' },
      summary: 'Overall health score improved by 5 points this week. Exercise consistency is your strongest area.',
      achievements: ['Completed all 5 planned workouts', 'Maintained medication adherence at 100%', 'Averaged 8,200 steps daily'],
      improvements: ['Sleep duration below target on 3 nights', 'Water intake could improve on non-workout days'],
      recommendations: ['Try to establish a consistent bedtime routine', 'Set hourly water reminders during work hours'],
      isRead: true,
    },
    {
      id: '2',
      type: 'monthly',
      title: 'Monthly Health Summary - March 2024',
      dateRange: { start: '2024-03-01', end: '2024-03-31' },
      summary: 'March was a strong month with significant improvements in fitness and mental wellness.',
      achievements: ['Lost 2kg through consistent exercise', 'Meditation streak: 21 days', 'Improved sleep quality score by 12%'],
      improvements: ['Nutrition tracking consistency dropped mid-month', 'Weekend meal planning needs attention'],
      recommendations: ['Meal prep on Sundays to improve nutrition tracking', 'Consider increasing workout intensity'],
      isRead: false,
    },
  ],
  weeklySummary: {
    calories: { value: 2150, change: -3, unit: 'kcal' },
    steps: { value: 82400, change: 12, unit: 'steps' },
    sleep: { value: 7.2, change: -5, unit: 'h' },
    mood: { value: 7.8, change: 8, unit: '/10' },
    workouts: { value: 5, change: 25, unit: 'sessions' },
    medication: { value: 98, change: 0, unit: '%' },
  },
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, subtitle, change, icon, color }) => (
  <Card className="p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="font-medium">{Math.abs(change)}%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = ({
  children,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; max?: number; color?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  value,
  max = 100,
  color = 'bg-blue-500',
  size = 'md',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`w-full bg-gray-200 rounded-full ${heights[size]}`}>
      <div
        className={`${color} rounded-full transition-all duration-500 ${heights[size]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

const HealthScoreChart: React.FC<{ data: DataPoint[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="healthScoreGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} stroke="#9CA3AF" fontSize={12} />
      <YAxis domain={[60, 100]} stroke="#9CA3AF" fontSize={12} />
      <Tooltip
        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
        formatter={(value: number) => [`${value}`, 'Health Score']}
        labelFormatter={(label) => new Date(label).toLocaleDateString()}
      />
      <Area
        type="monotone"
        dataKey="value"
        stroke="#3B82F6"
        strokeWidth={2}
        fill="url(#healthScoreGradient)"
      />
      <ReferenceLine y={85} stroke="#10B981" strokeDasharray="5 5" label={{ value: 'Target', fill: '#10B981', fontSize: 12 }} />
    </AreaChart>
  </ResponsiveContainer>
);

const MultiLineTrendChart: React.FC<{ data: any[]; lines: { key: string; color: string; name: string }[] }> = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} stroke="#9CA3AF" fontSize={12} />
      <YAxis stroke="#9CA3AF" fontSize={12} />
      <Tooltip
        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
        labelFormatter={(label) => new Date(label).toLocaleDateString()}
      />
      <Legend />
      {lines.map((line) => (
        <Line
          key={line.key}
          type="monotone"
          dataKey={line.key}
          name={line.name}
          stroke={line.color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const RadarHealthChart: React.FC<{ data: { subject: string; value: number; fullMark: number }[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid stroke="#E5E7EB" />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
      <Radar name="Health Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
    </RadarChart>
  </ResponsiveContainer>
);

const CorrelationHeatmap: React.FC<{ correlations: Correlation[] }> = ({ correlations }) => {
  const metrics = ['Sleep', 'Mood', 'Exercise', 'Nutrition', 'Stress', 'Energy'];
  const matrix = metrics.map((m1) =>
    metrics.map((m2) => {
      if (m1 === m2) return 1;
      const corr = correlations.find(
        (c) =>
          (c.metric1.includes(m1) && c.metric2.includes(m2)) ||
          (c.metric1.includes(m2) && c.metric2.includes(m1))
      );
      return corr ? Math.abs(corr.coefficient) : Math.random() * 0.5;
    })
  );

  return (
    <div className="grid gap-1">
      <div className="flex">
        <div className="w-20" />
        {metrics.map((m) => (
          <div key={m} className="flex-1 text-xs text-center text-gray-500 py-1">
            {m.slice(0, 3)}
          </div>
        ))}
      </div>
      {metrics.map((m1, i) => (
        <div key={m1} className="flex items-center">
          <div className="w-20 text-xs text-gray-500 pr-2">{m1}</div>
          {metrics.map((m2, j) => {
            const value = matrix[i][j];
            const intensity = Math.round(value * 255);
            const color = i === j ? '#E5E7EB' : `rgb(${255 - intensity}, ${255 - intensity * 0.5}, ${255})`;
            return (
              <div
                key={m2}
                className="flex-1 aspect-square rounded m-0.5 flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: color }}
              >
                {value > 0.3 ? value.toFixed(2) : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const ScatterPlot: React.FC<{
  data: CorrelationPoint[];
  xLabel: string;
  yLabel: string;
  color?: string;
}> = ({ data, xLabel, yLabel, color = '#3B82F6' }) => (
  <ResponsiveContainer width="100%" height={250}>
    <ScatterChart>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis type="number" dataKey="x" name={xLabel} stroke="#9CA3AF" fontSize={12} label={{ value: xLabel, position: 'bottom', fill: '#6B7280', fontSize: 11 }} />
      <YAxis type="number" dataKey="y" name={yLabel} stroke="#9CA3AF" fontSize={12} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
      <Scatter data={data} fill={color} />
    </ScatterChart>
  </ResponsiveContainer>
);

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC<{ data: AnalyticsState }> = ({ data }) => {
  const radarData = Object.entries(data.overview.moduleScores).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fullMark: 100,
  }));

  const healthScoreData = generateTrendData(data.overview.healthScore, 5, dates30);

  const moduleColors: Record<string, string> = {
    sleep: 'bg-indigo-100 text-indigo-600',
    nutrition: 'bg-green-100 text-green-600',
    fitness: 'bg-orange-100 text-orange-600',
    mental: 'bg-purple-100 text-purple-600',
    hydration: 'bg-cyan-100 text-cyan-600',
    medication: 'bg-rose-100 text-rose-600',
  };

  const moduleIcons: Record<string, React.ReactNode> = {
    sleep: <Moon size={20} />,
    nutrition: <Utensils size={20} />,
    fitness: <Dumbbell size={20} />,
    mental: <Brain size={20} />,
    hydration: <Activity size={20} />,
    medication: <Pill size={20} />,
  };

  const { weeklySummary } = data;

  return (
    <div className="space-y-6">
      {/* Health Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Health Score Trend</h3>
              <p className="text-sm text-gray-500">Your overall wellness over the last 30 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-blue-600">{data.overview.healthScore}</span>
              <Badge variant={data.overview.trend === 'up' ? 'success' : data.overview.trend === 'down' ? 'danger' : 'default'}>
                {data.overview.trend === 'up' && <TrendingUp size={12} className="mr-1" />}
                {data.overview.trend === 'down' && <TrendingDown size={12} className="mr-1" />}
                {data.overview.trend === 'stable' && <Minus size={12} className="mr-1" />}
                {data.overview.trend}
              </Badge>
            </div>
          </div>
          <HealthScoreChart data={healthScoreData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Balance</h3>
          <RadarHealthChart data={radarData} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(data.overview.moduleScores).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${moduleColors[key]}`}>
                  {moduleIcons[key]}
                </div>
                <div>
                  <p className="text-xs text-gray-500 capitalize">{key}</p>
                  <p className="text-sm font-semibold">{value}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Summary Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Avg Calories"
            value={`${weeklySummary.calories.value}`}
            subtitle={weeklySummary.calories.unit}
            change={weeklySummary.calories.change}
            icon={<Flame size={24} className="text-orange-600" />}
            color="bg-orange-100"
          />
          <MetricCard
            title="Total Steps"
            value={weeklySummary.steps.value.toLocaleString()}
            subtitle={weeklySummary.steps.unit}
            change={weeklySummary.steps.change}
            icon={<Footprints size={24} className="text-emerald-600" />}
            color="bg-emerald-100"
          />
          <MetricCard
            title="Avg Sleep"
            value={`${weeklySummary.sleep.value}h`}
            subtitle={weeklySummary.sleep.unit}
            change={weeklySummary.sleep.change}
            icon={<Moon size={24} className="text-indigo-600" />}
            color="bg-indigo-100"
          />
          <MetricCard
            title="Avg Mood"
            value={`${weeklySummary.mood.value}/10`}
            subtitle={weeklySummary.mood.unit}
            change={weeklySummary.mood.change}
            icon={<Smile size={24} className="text-yellow-600" />}
            color="bg-yellow-100"
          />
          <MetricCard
            title="Workouts"
            value={weeklySummary.workouts.value}
            subtitle={weeklySummary.workouts.unit}
            change={weeklySummary.workouts.change}
            icon={<Dumbbell size={24} className="text-blue-600" />}
            color="bg-blue-100"
          />
          <MetricCard
            title="Medication"
            value={`${weeklySummary.medication.value}%`}
            subtitle={weeklySummary.medication.unit}
            change={weeklySummary.medication.change}
            icon={<Pill size={24} className="text-rose-600" />}
            color="bg-rose-100"
          />
        </div>
      </div>

      {/* Goal Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Daily Steps (8,000)', current: 8240, target: 8000, color: 'bg-emerald-500' },
            { label: 'Sleep Hours (8h)', current: 7.2, target: 8, color: 'bg-indigo-500' },
            { label: 'Water Intake (2.5L)', current: 2.1, target: 2.5, color: 'bg-cyan-500' },
            { label: 'Workouts/Week (5)', current: 5, target: 5, color: 'bg-blue-500' },
            { label: 'Meditation (15min)', current: 12, target: 15, color: 'bg-purple-500' },
            { label: 'Protein (120g)', current: 95, target: 120, color: 'bg-orange-500' },
          ].map((goal) => (
            <div key={goal.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{goal.label}</span>
                <span className="font-medium text-gray-900">
                  {Math.round((goal.current / goal.target) * 100)}%
                </span>
              </div>
              <ProgressBar value={goal.current} max={goal.target} color={goal.color} />
              <p className="text-xs text-gray-400">
                {typeof goal.current === 'number' && goal.current % 1 !== 0
                  ? goal.current.toFixed(1)
                  : goal.current}{' '}
                / {goal.target}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Best Area', value: 'Fitness', sub: '92% score', icon: <Award size={20} />, color: 'text-green-600 bg-green-50' },
          { label: 'Needs Attention', value: 'Hydration', sub: '75% score', icon: <AlertCircle size={20} />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Biggest Improvement', value: '+12%', sub: 'Sleep quality', icon: <TrendingUp size={20} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Longest Streak', value: '21 days', sub: 'Meditation', icon: <Flame size={20} />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Daily Score', value: '87', sub: 'Avg this week', icon: <Target size={20} />, color: 'text-purple-600 bg-purple-50' },
          { label: 'Consistency', value: '94%', sub: 'All modules', icon: <CheckCircle2 size={20} />, color: 'text-teal-600 bg-teal-50' },
        ].map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${metric.color}`}>
              {metric.icon}
            </div>
            <p className="text-xs text-gray-500">{metric.label}</p>
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-400">{metric.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TrendsTab: React.FC<{ data: AnalyticsState }> = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['weight', 'sleep', 'mood']);
  const [timeRange, setTimeRange] = useState<'30d' | '90d'>('30d');

  const dates = timeRange === '30d' ? dates30 : dates90;

  const combinedData = useMemo(() => {
    return dates.map((date, i) => ({
      date,
      weight: data.trends.weight[i % data.trends.weight.length]?.value,
      sleep: data.trends.sleep[i % data.trends.sleep.length]?.value,
      steps: data.trends.steps[i % data.trends.steps.length]?.value,
      mood: data.trends.mood[i % data.trends.mood.length]?.value,
      energy: data.trends.energy[i % data.trends.energy.length]?.value,
    }));
  }, [dates, data.trends]);

  const metrics = [
    { key: 'weight', label: 'Weight (kg)', color: '#8B5CF6' },
    { key: 'sleep', label: 'Sleep (hours)', color: '#6366F1' },
    { key: 'steps', label: 'Steps', color: '#10B981' },
    { key: 'mood', label: 'Mood (1-10)', color: '#F59E0B' },
    { key: 'energy', label: 'Energy (1-10)', color: '#EF4444' },
  ];

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedMetrics.includes(m.key)
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedMetrics.includes(m.key) ? m.color : undefined,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              timeRange === '30d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              timeRange === '90d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Multi-line Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} stroke="#9CA3AF" fontSize={12} />
            <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
            <Legend />
            {selectedMetrics.includes('weight') && (
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Weight (kg)" />
            )}
            {selectedMetrics.includes('sleep') && (
              <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="#6366F1" strokeWidth={2} dot={false} name="Sleep (h)" />
            )}
            {selectedMetrics.includes('steps') && (
              <Line yAxisId="right" type="monotone" dataKey="steps" stroke="#10B981" strokeWidth={2} dot={false} name="Steps" />
            )}
            {selectedMetrics.includes('mood') && (
              <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#F59E0B" strokeWidth={2} dot={false} name="Mood" />
            )}
            {selectedMetrics.includes('energy') && (
              <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#EF4444" strokeWidth={2} dot={false} name="Energy" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Individual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const metricData = data.trends[metric.key as keyof typeof data.trends];
          return (
            <Card key={metric.key} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                  <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                </div>
                <Badge variant="info">
                  Avg: {metricData && metricData.length > 0 ? (metricData.reduce((a, b) => a + b.value, 0) / metricData.length).toFixed(1) : 0}
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={metricData}>
                  <defs>
                    <linearGradient id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { day: 'numeric' })} stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                  <Area type="monotone" dataKey="value" stroke={metric.color} fill={`url(#gradient-${metric.key})`} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const CorrelationsTab: React.FC<{ data: AnalyticsState }> = ({ data }) => {
  // Generate scatter data
  const sleepMoodData: CorrelationPoint[] = Array.from({ length: 50 }, () => ({
    x: 5 + Math.random() * 4, // sleep hours
    y: 4 + Math.random() * 5 + (Math.random() > 0.5 ? 1 : 0), // mood
  }));

  const exerciseSleepData: CorrelationPoint[] = Array.from({ length: 50 }, () => ({
    x: 0 + Math.random() * 120, // exercise minutes
    y: 50 + Math.random() * 40 + (Math.random() > 0.6 ? 15 : 0), // sleep quality
  }));

  const nutritionEnergyData: CorrelationPoint[] = Array.from({ length: 50 }, () => ({
    x: 1500 + Math.random() * 1500, // calories
    y: 3 + Math.random() * 5 + (Math.random() > 0.5 ? 1.5 : 0), // energy
  }));

  const stressProductivityData: CorrelationPoint[] = Array.from({ length: 50 }, () => ({
    x: 1 + Math.random() * 9, // stress level
    y: 100 - Math.random() * 40 - (Math.random() > 0.6 ? 20 : 0), // productivity
  }));

  return (
    <div className="space-y-6">
      {/* Correlation Matrix */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cross-Module Correlation Matrix</h3>
            <p className="text-sm text-gray-500">Strength of relationships between health metrics</p>
          </div>
          <ScatterChartIcon size={24} className="text-gray-400" />
        </div>
        <div className="max-w-2xl">
          <CorrelationHeatmap correlations={data.correlations} />
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="text-gray-500">Correlation strength:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-50" />
            <span className="text-gray-600">Weak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-200" />
            <span className="text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600" />
            <span className="text-gray-600">Strong</span>
          </div>
        </div>
      </Card>

      {/* Scatter Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Sleep vs Mood</h4>
            <Badge variant="success">r = 0.82</Badge>
          </div>
          <ScatterPlot data={sleepMoodData} xLabel="Sleep (hours)" yLabel="Mood Score" color="#6366F1" />
          <p className="text-sm text-gray-500 mt-3">
            <strong className="text-gray-700">Insight:</strong> When you sleep 7+ hours, your mood improves by 20% on average
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Exercise vs Sleep Quality</h4>
            <Badge variant="success">r = 0.68</Badge>
          </div>
          <ScatterPlot data={exerciseSleepData} xLabel="Exercise (min)" yLabel="Sleep Quality (%)" color="#10B981" />
          <p className="text-sm text-gray-500 mt-3">
            <strong className="text-gray-700">Insight:</strong> Workout days correlate with 15% better sleep quality
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Nutrition vs Energy</h4>
            <Badge variant="success">r = 0.71</Badge>
          </div>
          <ScatterPlot data={nutritionEnergyData} xLabel="Calories" yLabel="Energy Level" color="#F59E0B" />
          <p className="text-sm text-gray-500 mt-3">
            <strong className="text-gray-700">Insight:</strong> Balanced meals increase afternoon energy by 25%
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Stress vs Productivity</h4>
            <Badge variant="danger">r = -0.64</Badge>
          </div>
          <ScatterPlot data={stressProductivityData} xLabel="Stress Level" yLabel="Productivity (%)" color="#EF4444" />
          <p className="text-sm text-gray-500 mt-3">
            <strong className="text-gray-700">Insight:</strong> High stress days show 30% decrease in productivity
          </p>
        </Card>
      </div>

      {/* AI Discovered Insights */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Discovered Patterns</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: <Moon size={18} />, text: 'When you sleep <6h, calorie intake +15%', color: 'bg-indigo-100 text-indigo-600' },
            { icon: <Dumbbell size={18} />, text: 'Workout days → Mood +20%', color: 'bg-blue-100 text-blue-600' },
            { icon: <Utensils size={18} />, text: 'High protein breakfast → Better focus', color: 'bg-green-100 text-green-600' },
            { icon: <Brain size={18} />, text: 'Meditation 10min+ → Sleep quality +12%', color: 'bg-purple-100 text-purple-600' },
            { icon: <Activity size={18} />, text: 'Weekend hydration drops 30%', color: 'bg-cyan-100 text-cyan-600' },
            { icon: <Smile size={18} />, text: 'Social activities → Next day mood +15%', color: 'bg-yellow-100 text-yellow-600' },
          ].map((pattern, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${pattern.color}`}>{pattern.icon}</div>
              <span className="text-sm text-gray-700">{pattern.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const ReportsTab: React.FC<{ data: AnalyticsState }> = ({ data }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(data.reports[0]);
  const [autoSchedule, setAutoSchedule] = useState({ weekly: true, monthly: true });

  return (
    <div className="space-y-6">
      {/* Report Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Generated Reports</h3>
              <Badge variant="info">{data.reports.length}</Badge>
            </div>
            <div className="space-y-2">
              {data.reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedReport?.id === report.id
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={report.type === 'weekly' ? 'default' : report.type === 'monthly' ? 'info' : 'success'}>
                      {report.type}
                    </Badge>
                    {!report.isRead && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <p className="font-medium text-gray-900 mt-1 text-sm">{report.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Auto Schedule */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Auto-Generate Reports</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Weekly Reports</span>
                <input
                  type="checkbox"
                  checked={autoSchedule.weekly}
                  onChange={(e) => setAutoSchedule((p) => ({ ...p, weekly: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Monthly Summaries</span>
                <input
                  type="checkbox"
                  checked={autoSchedule.monthly}
                  onChange={(e) => setAutoSchedule((p) => ({ ...p, monthly: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </Card>

          {/* Share Options */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Share With</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Users size={16} />
                Healthcare Provider
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Target size={16} />
                Fitness Coach
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Users size={16} />
                Family Member
              </button>
            </div>
          </Card>
        </div>

        {/* Report Preview */}
        <Card className="lg:col-span-2 p-6">
          {selectedReport ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                    <p className="text-gray-500 mt-1">
                      {new Date(selectedReport.dateRange.start).toLocaleDateString('en', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(selectedReport.dateRange.end).toLocaleDateString('en', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      <Printer size={16} />
                      Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-gray-600 leading-relaxed">{selectedReport.summary}</p>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award size={20} className="text-green-600" />
                  Achievements This Period
                </h3>
                <ul className="space-y-2">
                  {selectedReport.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb size={20} className="text-amber-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {selectedReport.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Recommendations */}
              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-600" />
                  AI Recommendations
                </h3>
                <ul className="space-y-2">
                  {selectedReport.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Zap size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Goal Progress Mini Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Goal Progress</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Fitness', progress: 92, color: 'bg-blue-500' },
                    { label: 'Sleep', progress: 78, color: 'bg-indigo-500' },
                    { label: 'Nutrition', progress: 65, color: 'bg-green-500' },
                  ].map((goal) => (
                    <div key={goal.label} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${goal.progress * 1.76} 176`}
                            className={goal.color.replace('bg-', 'text-')}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {goal.progress}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{goal.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a report to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const ExportTab: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedModules, setSelectedModules] = useState<string[]>(['sleep', 'fitness', 'nutrition']);
  const [privacyLevel, setPrivacyLevel] = useState('standard');

  const modules = [
    { id: 'sleep', label: 'Sleep Data', icon: <Moon size={16} /> },
    { id: 'fitness', label: 'Fitness & Exercise', icon: <Dumbbell size={16} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils size={16} /> },
    { id: 'mental', label: 'Mental Wellness', icon: <Brain size={16} /> },
    { id: 'medication', label: 'Medication', icon: <Pill size={16} /> },
    { id: 'vitals', label: 'Vital Signs', icon: <Heart size={16} /> },
  ];

  const exportOptions = [
    { id: 'csv', label: 'CSV Export', desc: 'Raw data for spreadsheets', icon: <FileSpreadsheet size={24} />, color: 'bg-green-100 text-green-600' },
    { id: 'pdf', label: 'PDF Report', desc: 'Formatted health report', icon: <FileText size={24} />, color: 'bg-red-100 text-red-600' },
    { id: 'json', label: 'JSON Export', desc: 'Structured data format', icon: <FileDown size={24} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'apple', label: 'Apple Health', desc: 'Export to Apple Health', icon: <Apple size={24} />, color: 'bg-gray-100 text-gray-800' },
    { id: 'google', label: 'Google Fit', desc: 'Export to Google Fit', icon: <Smartphone size={24} />, color: 'bg-orange-100 text-orange-600' },
  ];

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <Card key={option.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${option.color} group-hover:scale-110 transition-transform`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{option.label}</h4>
                <p className="text-sm text-gray-500">{option.desc}</p>
                <button className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Export Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Settings size={20} />
          Export Configuration
        </h3>

        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="flex flex-wrap gap-2">
              {['7d', '30d', '90d', '1y', 'custom'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'custom' ? 'Custom' : range.replace('d', ' Days').replace('y', ' Year')}
                </button>
              ))}
            </div>
          </div>

          {/* Module Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Modules</label>
            <div className="flex flex-wrap gap-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedModules.includes(module.id)
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {module.icon}
                  {module.label}
                  {selectedModules.includes(module.id) && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Privacy Level</label>
            </div>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="standard"
                  checked={privacyLevel === 'standard'}
                  onChange={(e) => setPrivacyLevel(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Standard</span>
                  <p className="text-xs text-gray-500">Include all health metrics with personal notes</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="anonymized"
                  checked={privacyLevel === 'anonymized'}
                  onChange={(e) => setPrivacyLevel(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Anonymized</span>
                  <p className="text-xs text-gray-500">Remove personal identifiers and notes</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="minimal"
                  checked={privacyLevel === 'minimal'}
                  onChange={(e) => setPrivacyLevel(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Minimal</span>
                  <p className="text-xs text-gray-500">Only essential metrics, no detailed data</p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye size={16} />
              <span>Preview shows {selectedModules.length} modules, {selectedDateRange} of data</span>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Preview
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download size={18} />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Security Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <Lock size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Your data is secure</p>
          <p className="text-sm text-blue-700">
            All exports are encrypted and comply with HIPAA guidelines. You can revoke access to shared data at any time from your privacy settings.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Analytics2() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'correlations' | 'reports' | 'export'>('overview');
  const [dateRange, setDateRange] = useState({ start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeChange = useCallback((direction: 'prev' | 'next') => {
    setIsLoading(true);
    const days = 30;
    const msPerDay = 24 * 60 * 60 * 1000;
    setTimeout(() => {
      setDateRange((prev) => ({
        start: new Date(prev.start.getTime() + (direction === 'prev' ? -days : days) * msPerDay),
        end: new Date(prev.end.getTime() + (direction === 'prev' ? -days : days) * msPerDay),
      }));
      setIsLoading(false);
    }, 300);
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'trends' as const, label: 'Trends', icon: <TrendingUp size={18} /> },
    { id: 'correlations' as const, label: 'Correlations', icon: <ScatterChartIcon size={18} /> },
    { id: 'reports' as const, label: 'Reports', icon: <FileText size={18} /> },
    { id: 'export' as const, label: 'Export', icon: <Download size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Analytics</h1>
              <p className="text-sm text-gray-500 mt-0.5">Comprehensive health insights and reports</p>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5">
              <button
                onClick={() => handleDateRangeChange('prev')}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2 px-3">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {dateRange.start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} -{' '}
                  {dateRange.end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={() => handleDateRangeChange('next')}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 pb-1 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Loading analytics...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab data={mockAnalyticsState} />}
            {activeTab === 'trends' && <TrendsTab data={mockAnalyticsState} />}
            {activeTab === 'correlations' && <CorrelationsTab data={mockAnalyticsState} />}
            {activeTab === 'reports' && <ReportsTab data={mockAnalyticsState} />}
            {activeTab === 'export' && <ExportTab />}
          </>
        )}
      </main>
    </div>
  );
}
