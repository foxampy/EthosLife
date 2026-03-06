import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Scatter
} from 'recharts';
import { useAuthStore } from '../../store/authStore';

/**
 * DashboardV1 - Главный дашборд с Health Score
 * Максимально детализированный интерфейс с 7 модулями здоровья
 */

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateHealthScoreHistory = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day, index) => ({
    day,
    score: 65 + Math.random() * 30 + (index * 2),
    sleep: 6 + Math.random() * 3,
    activity: 30 + Math.random() * 70,
    nutrition: 50 + Math.random() * 45,
  }));
};

const generateModuleData = () => [
  {
    id: 'nutrition',
    name: 'Питание',
    icon: '🥗',
    score: 78,
    progress: 78,
    color: '#10b981',
    bgColor: 'bg-emerald-500',
    description: 'Баланс макронутриентов',
    metrics: [
      { label: 'Калории', value: '1,850', target: '2,200', unit: 'ккал' },
      { label: 'Белки', value: '142', target: '180', unit: 'г' },
      { label: 'Жиры', value: '68', target: '85', unit: 'г' },
      { label: 'Углеводы', value: '210', target: '250', unit: 'г' },
    ],
    tips: ['Увеличьте потребление белка', 'Добавьте больше овощей'],
    streak: 12,
  },
  {
    id: 'fitness',
    name: 'Фитнес',
    icon: '💪',
    score: 85,
    progress: 85,
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    description: 'Физическая активность',
    metrics: [
      { label: 'Шаги', value: '8,432', target: '10,000', unit: 'шагов' },
      { label: 'Тренировки', value: '4', target: '5', unit: 'в неделю' },
      { label: 'Активность', value: '45', target: '60', unit: 'мин/день' },
      { label: 'Расход', value: '2,340', target: '2,500', unit: 'ккал' },
    ],
    tips: ['Добавьте кардио тренировку', 'Растяжка после тренировки'],
    streak: 8,
  },
  {
    id: 'sleep',
    name: 'Сон',
    icon: '😴',
    score: 72,
    progress: 72,
    color: '#8b5cf6',
    bgColor: 'bg-violet-500',
    description: 'Качество и продолжительность',
    metrics: [
      { label: 'Продолжительность', value: '7.2', target: '8', unit: 'часов' },
      { label: 'Качество', value: '82', target: '90', unit: '%' },
      { label: 'Глубокий сон', value: '1.8', target: '2', unit: 'часов' },
      { label: 'REM', value: '2.1', target: '2.5', unit: 'часов' },
    ],
    tips: ['Ложитесь в одно время', 'Избегайте экранов перед сном'],
    streak: 5,
  },
  {
    id: 'mental',
    name: 'Ментальное',
    icon: '🧠',
    score: 68,
    progress: 68,
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    description: 'Психологическое здоровье',
    metrics: [
      { label: 'Стресс', value: '42', target: '30', unit: 'уровень' },
      { label: 'Медитация', value: '10', target: '20', unit: 'мин/день' },
      { label: 'Настроение', value: '7.5', target: '9', unit: '/10' },
      { label: 'Фокус', value: '6.8', target: '8', unit: '/10' },
    ],
    tips: ['Практикуйте благодарность', 'Делайте перерывы'],
    streak: 3,
  },
  {
    id: 'medical',
    name: 'Медицинское',
    icon: '🏥',
    score: 91,
    progress: 91,
    color: '#ef4444',
    bgColor: 'bg-red-500',
    description: 'Показатели здоровья',
    metrics: [
      { label: 'Пульс', value: '68', target: '60-80', unit: 'уд/мин' },
      { label: 'Давление', value: '120/80', target: '120/80', unit: 'мм рт.ст.' },
      { label: 'Сахар', value: '5.2', target: '4-6', unit: 'ммоль/л' },
      { label: 'Холестерин', value: '4.8', target: '<5', unit: 'ммоль/л' },
    ],
    tips: ['Регулярные чекапы', 'Следите за давлением'],
    streak: 30,
  },
  {
    id: 'body',
    name: 'Тело',
    icon: '🏃',
    score: 76,
    progress: 76,
    color: '#06b6d4',
    bgColor: 'bg-cyan-500',
    description: 'Композиция тела',
    metrics: [
      { label: 'Вес', value: '75.5', target: '72', unit: 'кг' },
      { label: 'BMI', value: '23.4', target: '18.5-25', unit: '' },
      { label: 'Жир', value: '18', target: '15', unit: '%' },
      { label: 'Мышцы', value: '58', target: '60', unit: '%' },
    ],
    tips: ['Силовые тренировки', 'Контроль калорий'],
    streak: 15,
  },
  {
    id: 'environment',
    name: 'Окружение',
    icon: '🌿',
    score: 82,
    progress: 82,
    color: '#84cc16',
    bgColor: 'bg-lime-500',
    description: 'Внешние факторы',
    metrics: [
      { label: 'Вода', value: '1.8', target: '2.5', unit: 'л' },
      { label: 'Воздух', value: '85', target: '90', unit: 'качество' },
      { label: 'Свет', value: '8', target: '10', unit: 'часов' },
      { label: 'Шум', value: '45', target: '<50', unit: 'дБ' },
    ],
    tips: ['Пейте больше воды', 'Проветривайте помещение'],
    streak: 7,
  },
];

const generateActivityData = () => [
  {
    id: 1,
    type: 'workout',
    title: 'Утренняя пробежка',
    description: '5 км за 28 минут',
    time: '2 часа назад',
    icon: '🏃',
    points: 150,
  },
  {
    id: 2,
    type: 'meal',
    title: 'Завтрак',
    description: 'Овсянка с ягодами - 450 ккал',
    time: '4 часа назад',
    icon: '🥣',
    points: 50,
  },
  {
    id: 3,
    type: 'sleep',
    title: 'Ночной сон',
    description: '7.5 часов, качество 85%',
    time: '8 часов назад',
    icon: '😴',
    points: 100,
  },
  {
    id: 4,
    type: 'meditation',
    title: 'Медитация',
    description: '15 минут осознанности',
    time: '1 день назад',
    icon: '🧘',
    points: 75,
  },
  {
    id: 5,
    type: 'water',
    title: 'Водный баланс',
    description: '2.5 л воды за день',
    time: '1 день назад',
    icon: '💧',
    points: 80,
  },
];

const generateAIInsights = () => [
  {
    id: 1,
    type: 'positive',
    title: 'Отличный прогресс!',
    message: 'Ваш Health Score вырос на 12% за последнюю неделю. Продолжайте в том же духе!',
    icon: '🎉',
    action: 'Посмотреть детали',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Обратите внимание',
    message: 'Потребление воды ниже рекомендуемого. Постарайтесь пить больше в течение дня.',
    icon: '⚠️',
    action: 'Напоминания',
  },
  {
    id: 3,
    type: 'info',
    title: 'Рекомендация',
    message: 'На основе вашей активности, сегодня стоит добавить легкую растяжку.',
    icon: '💡',
    action: 'Упражнения',
  },
];

const generateWeeklyStats = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map(day => ({
    name: day,
    calories: Math.floor(1800 + Math.random() * 600),
    steps: Math.floor(6000 + Math.random() * 6000),
    sleep: (6 + Math.random() * 3).toFixed(1),
    water: (1.5 + Math.random() * 1.5).toFixed(1),
  }));
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * CircularProgress - Кольцевой индикатор прогресса
 */
const CircularProgress = ({ value, size = 200, strokeWidth = 12, color = '#5c5243', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const actualColor = color === 'auto' ? getColor(value) : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#dcd3c6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={actualColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

/**
 * HealthScoreWidget - Виджет Health Score с детализацией
 */
const HealthScoreWidget = ({ score, history }) => {
  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Отлично', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (score >= 60) return { label: 'Хорошо', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Требует внимания', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const status = getScoreStatus(score);
  const change = history && history.length > 1 
    ? ((history[history.length - 1]?.score - history[0]?.score) / history[0]?.score * 100).toFixed(1)
    : 0;

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Health Score</h3>
          <p className="text-sm text-ink-light">Ваш индекс здоровья</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <CircularProgress value={score} size={220} strokeWidth={14} color="auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-stone mb-1">{score}</div>
            <div className="text-sm text-ink-light">из 100</div>
            {change !== 0 && (
              <div className={`text-sm font-medium mt-2 ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% за неделю
              </div>
            )}
          </div>
        </CircularProgress>

        {/* Score breakdown */}
        <div className="w-full mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Физическое здоровье</span>
            <span className="font-medium text-stone">78%</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Ментальное здоровье</span>
            <span className="font-medium text-stone">68%</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: '68%' }} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Социальное здоровье</span>
            <span className="font-medium text-stone">85%</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/overview-v1"
            className="neu-button-secondary px-3 py-2 rounded-xl text-sm font-medium text-center transition-all hover:shadow-md"
          >
            Обзор
          </Link>
          <Link
            to="/health"
            className="neu-button-secondary px-3 py-2 rounded-xl text-sm font-medium text-center transition-all hover:shadow-md"
          >
            Модули
          </Link>
          <Link
            to="/ai-chat"
            className="neu-button px-3 py-2 rounded-xl text-sm font-medium text-center transition-all hover:shadow-md"
          >
            AI Анализ
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * ModuleCard - Карточка модуля здоровья
 */
const ModuleCard = ({ module, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="neu-card p-5 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{module.icon}</div>
          <div>
            <h4 className="font-bold text-stone">{module.name}</h4>
            <p className="text-xs text-ink-light">{module.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: module.color }}>
            {module.score}
          </div>
          <div className="text-xs text-ink-light">из 100</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-sand rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: module.color, width: `${module.progress}%` }}
        />
      </div>

      {/* Streak */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-medium text-stone">{module.streak} дней</span>
        </div>
        <span className="text-xs text-ink-light">серия</span>
      </div>

      {/* Expanded metrics */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stone/10 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {module.metrics.map((metric, idx) => (
              <div key={idx} className="bg-sand/30 rounded-lg p-3">
                <div className="text-xs text-ink-light mb-1">{metric.label}</div>
                <div className="font-bold text-stone">{metric.value}</div>
                <div className="text-xs text-clay">цель: {metric.target} {metric.unit}</div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone uppercase tracking-wider">Рекомендации</div>
            {module.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-ink">
                <span className="text-emerald-500">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <Link
            to={`/health/${module.id}`}
            className="mt-4 block w-full neu-button-secondary py-2 rounded-lg text-sm font-medium text-center transition-all hover:shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            Подробнее →
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * DailyStreakWidget - Виджет ежедневных серий
 */
const DailyStreakWidget = () => {
  const streaks = [
    { id: 'hydration', label: 'Вода', current: 12, best: 21, icon: '💧', color: 'bg-cyan-500' },
    { id: 'steps', label: 'Шаги', current: 8, best: 30, icon: '👟', color: 'bg-emerald-500' },
    { id: 'sleep', label: 'Сон', current: 5, best: 14, icon: '😴', color: 'bg-violet-500' },
    { id: 'meditation', label: 'Медитация', current: 3, best: 10, icon: '🧘', color: 'bg-pink-500' },
    { id: 'workout', label: 'Тренировки', current: 6, best: 18, icon: '💪', color: 'bg-amber-500' },
  ];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Ежедневные серии</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-sm font-medium text-stone">Общий: 15</span>
        </div>
      </div>

      <div className="space-y-4">
        {streaks.map((streak) => (
          <div key={streak.id} className="flex items-center space-x-4">
            <div className={`w-10 h-10 ${streak.color} rounded-xl flex items-center justify-center text-xl`}>
              {streak.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-stone">{streak.label}</span>
                <span className="text-sm text-ink-light">
                  <span className="font-bold text-stone">{streak.current}</span> / {streak.best}
                </span>
              </div>
              <div className="h-2 bg-sand rounded-full overflow-hidden">
                <div
                  className={`h-full ${streak.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(streak.current / streak.best) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-stone/10">
        <div className="text-center">
          <p className="text-sm text-ink-light mb-2">
            Поддержите серии и получите бонусы!
          </p>
          <Link
            to="/achievements-v1"
            className="text-sm font-semibold text-stone hover:text-ink transition-colors"
          >
            Посмотреть достижения →
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * AIInsightsSection - Секция AI инсайтов
 */
const AIInsightsSection = ({ insights }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'positive':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🎉' };
      case 'warning':
        return { bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️' };
      case 'info':
        return { bg: 'bg-violet-50', border: 'border-violet-200', icon: '💡' };
      default:
        return { bg: 'bg-sand', border: 'border-stone/10', icon: '💬' };
    }
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h3 className="text-xl font-bold text-stone">AI Инсайты</h3>
            <p className="text-xs text-ink-light">Персональные рекомендации</p>
          </div>
        </div>
        <Link
          to="/ai-chat"
          className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
        >
          Чат с AI
        </Link>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const styles = getTypeStyles(insight.type);
          return (
            <div
              key={insight.id}
              className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{insight.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-stone mb-1">{insight.title}</h4>
                  <p className="text-sm text-ink mb-3">{insight.message}</p>
                  <button className="text-sm font-medium text-stone hover:text-ink transition-colors">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * RecentActivityWidget - Виджет недавней активности
 */
const RecentActivityWidget = ({ activities }) => {
  const getTypeColor = (type) => {
    const colors = {
      workout: 'bg-amber-100 text-amber-600',
      meal: 'bg-emerald-100 text-emerald-600',
      sleep: 'bg-violet-100 text-violet-600',
      meditation: 'bg-pink-100 text-pink-600',
      water: 'bg-cyan-100 text-cyan-600',
    };
    return colors[type] || 'bg-sand text-stone';
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Недавняя активность</h3>
        <Link
          to="/activity-v1"
          className="text-sm font-semibold text-stone hover:text-ink transition-colors"
        >
          Все →
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-sand/30 transition-all cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getTypeColor(activity.type)}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-stone">{activity.title}</div>
              <div className="text-sm text-ink-light">{activity.description}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink-light">{activity.time}</div>
              <div className="text-sm font-bold text-stone">+{activity.points}</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/activity-v1"
        className="mt-4 block w-full neu-button-secondary py-3 rounded-xl text-sm font-medium text-center transition-all hover:shadow-md"
      >
        Показать всю активность
      </Link>
    </div>
  );
};

/**
 * QuickActionsWidget - Виджет быстрых действий
 */
const QuickActionsWidget = () => {
  const actions = [
    { to: '/health/nutrition', icon: '🥗', label: 'Приём пищи', color: 'bg-emerald-500' },
    { to: '/health/fitness', icon: '💪', label: 'Тренировка', color: 'bg-amber-500' },
    { to: '/health/sleep', icon: '😴', label: 'Отметить сон', color: 'bg-violet-500' },
    { to: '/health/mental', icon: '🧘', label: 'Медитация', color: 'bg-pink-500' },
    { to: '/wallet-v1', icon: '💧', label: 'Вода', color: 'bg-cyan-500' },
    { to: '/ai-chat', icon: '🤖', label: 'AI чат', color: 'bg-stone' },
    { to: '/social', icon: '👥', label: 'Сообщество', color: 'bg-indigo-500' },
    { to: '/profile', icon: '👤', label: 'Профиль', color: 'bg-clay' },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Быстрые действия</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className="flex flex-col items-center p-3 rounded-xl hover:bg-sand/50 transition-all group"
          >
            <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-2xl mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-xs font-medium text-stone text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * WeeklyActivityChart - График недельной активности
 */
const WeeklyActivityChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Недельная активность</h3>
          <p className="text-xs text-ink-light">Шаги и калории</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-xs text-ink-light">Шаги</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-xs text-ink-light">Калории</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#5c5243' }}
            domain={[0, 15000]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#5c5243' }}
            domain={[0, 3000]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
              boxShadow: '4px 4px 8px #b8ae9f, -4px -4px 8px #ffffff',
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="steps"
            fill="#f59e0b"
            radius={[8, 8, 0, 0]}
            name="Шаги"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="calories"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Калории"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * HealthScoreTrendChart - График тренда Health Score
 */
const HealthScoreTrendChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Тренд Health Score</h3>
          <p className="text-xs text-ink-light">Динамика за неделю</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-emerald-600 text-sm font-bold">+8.5%</div>
          <span className="text-xs text-ink-light">к прошлой неделе</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis
            tick={{ fontSize: 12, fill: '#5c5243' }}
            domain={[40, 100]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
            name="Health Score"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * ModuleComparisonRadar - Radar chart сравнения модулей
 */
const ModuleComparisonRadar = ({ modules }) => {
  const radarData = modules.map(m => ({
    module: m.name,
    score: m.score,
    fullMark: 100,
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Сравнение модулей</h3>
          <p className="text-xs text-ink-light">Баланс здоровья</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="#dcd3c6" />
          <PolarAngleAxis dataKey="module" tick={{ fontSize: 11, fill: '#5c5243' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Текущий"
            dataKey="score"
            stroke="#10b981"
            strokeWidth={3}
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Radar
            name="Цель"
            dataKey="fullMark"
            stroke="#dcd3c6"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="none"
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {modules.slice(0, 7).map((module, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: module.color }}
            />
            <span className="text-xs text-ink-light">{module.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * SleepQualityChart - График качества сна
 */
const SleepQualityChart = () => {
  const sleepData = [
    { name: 'Глубокий', value: 25, color: '#8b5cf6' },
    { name: 'REM', value: 30, color: '#a78bfa' },
    { name: 'Лёгкий', value: 35, color: '#c4b5fd' },
    { name: 'Бодрствование', value: 10, color: '#ddd6fe' },
  ];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Структура сна</h3>
          <p className="text-xs text-ink-light">Прошлая ночь</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-stone">7.5ч</div>
          <div className="text-xs text-ink-light">85% качество</div>
        </div>
      </div>

      <div className="flex items-center">
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie
              data={sleepData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {sleepData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#e4dfd5',
                border: '1px solid #8c7a6b',
                borderRadius: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-1/2 space-y-2">
          {sleepData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-ink">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-stone">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * NutritionBreakdownChart - График макронутриентов
 */
const NutritionBreakdownChart = () => {
  const nutritionData = [
    { name: 'Белки', value: 142, target: 180, color: '#ef4444', percent: 79 },
    { name: 'Жиры', value: 68, target: 85, color: '#f59e0b', percent: 80 },
    { name: 'Углеводы', value: 210, target: 250, color: '#10b981', percent: 84 },
    { name: 'Клетчатка', value: 22, target: 30, color: '#8b5cf6', percent: 73 },
  ];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Макронутриенты</h3>
          <p className="text-xs text-ink-light">Сегодня</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-stone">1,850</div>
          <div className="text-xs text-ink-light">ккал из 2,200</div>
        </div>
      </div>

      <div className="space-y-4">
        {nutritionData.map((macro, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                <span className="text-sm font-medium text-stone">{macro.name}</span>
              </div>
              <span className="text-sm text-ink">
                <span className="font-bold">{macro.value}г</span>
                <span className="text-ink-light"> / {macro.target}г</span>
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: macro.color, width: `${macro.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const DashboardV1 = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [modules, setModules] = useState([]);
  const [healthScoreHistory, setHealthScoreHistory] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  // Initialize data
  useEffect(() => {
    setModules(generateModuleData());
    setHealthScoreHistory(generateHealthScoreHistory());
    setWeeklyStats(generateWeeklyStats());
    setActivities(generateActivityData());
    setAiInsights(generateAIInsights());
  }, []);

  // Calculate overall health score
  const overallHealthScore = useMemo(() => {
    if (modules.length === 0) return 0;
    const total = modules.reduce((sum, m) => sum + m.score, 0);
    return Math.round(total / modules.length);
  }, [modules]);

  return (
    <div className="min-h-screen bg-bone pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-stone/10 to-sand/20 border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone mb-2">
                С возвращением, {user?.fullName?.split(' ')[0] || 'Пользователь'}! 👋
              </h1>
              <p className="text-ink-light">
                {new Date().toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-sm font-bold text-stone">1,250</div>
                  <div className="text-xs text-ink-light">ETHOS токенов</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/wallet-v1')}
                className="neu-button px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                Кошелёк
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mt-6 flex items-center space-x-2">
            {['24ч', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-stone text-bone shadow-md'
                    : 'bg-sand/50 text-stone hover:bg-sand'
                }`}
              >
                {range === '24ч' ? '24 часа' : range === '7d' ? '7 дней' : range === '30d' ? '30 дней' : '90 дней'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row - Health Score & Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <HealthScoreWidget score={overallHealthScore} history={healthScoreHistory} />
          </div>
          <div className="lg:col-span-1">
            <DailyStreakWidget />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsWidget />
          </div>
        </div>

        {/* Health Modules Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-stone">Модули здоровья</h2>
            <Link
              to="/health"
              className="text-sm font-semibold text-stone hover:text-ink transition-colors"
            >
              Все модули →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WeeklyActivityChart data={weeklyStats} />
          <HealthScoreTrendChart data={healthScoreHistory} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ModuleComparisonRadar modules={modules} />
          <SleepQualityChart />
          <NutritionBreakdownChart />
        </div>

        {/* Bottom Row - AI Insights & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsightsSection insights={aiInsights} />
          <RecentActivityWidget activities={activities} />
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 neu-card p-6 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h3 className="text-xl font-bold text-stone mb-2">
            Каждый шаг важен!
          </h3>
          <p className="text-ink-light mb-4">
            Ваш Health Score вырос на 8.5% на этой неделе. Продолжайте заботиться о себе!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/achievements-v1"
              className="neu-button px-6 py-3 rounded-xl font-medium transition-all"
            >
              Достижения
            </Link>
            <Link
              to="/overview-v1"
              className="neu-button-secondary px-6 py-3 rounded-xl font-medium transition-all"
            >
              Подробный обзор
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV1;
