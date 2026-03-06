import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';

/**
 * ActivityV1 - Лента активности
 * Отслеживание всех действий пользователя
 */

// ============================================
// MOCK DATA
// ============================================

const generateActivities = () => [
  {
    id: 1,
    type: 'workout',
    category: 'fitness',
    title: 'Утренняя пробежка',
    description: '5 км в среднем темпе',
    duration: 28,
    calories: 420,
    points: 150,
    date: '2026-03-06T07:30:00',
    icon: '🏃',
    color: '#f59e0b',
    details: {
      distance: '5.0 км',
      pace: '5:36 мин/км',
      avgHeartRate: 142,
      maxHeartRate: 168,
      elevation: '45 м',
    },
  },
  {
    id: 2,
    type: 'meal',
    category: 'nutrition',
    title: 'Завтрак',
    description: 'Овсянка с ягодами и орехами',
    calories: 450,
    protein: 15,
    carbs: 65,
    fat: 12,
    points: 50,
    date: '2026-03-06T08:15:00',
    icon: '🥣',
    color: '#10b981',
    details: {
      fiber: '8г',
      sugar: '12г',
      sodium: '180мг',
    },
  },
  {
    id: 3,
    type: 'water',
    category: 'nutrition',
    title: 'Приём воды',
    description: 'Стакан воды',
    amount: 350,
    points: 10,
    date: '2026-03-06T09:00:00',
    icon: '💧',
    color: '#06b6d4',
    details: {},
  },
  {
    id: 4,
    type: 'meditation',
    category: 'mental',
    title: 'Утренняя медитация',
    description: 'Осознанность и дыхание',
    duration: 15,
    points: 75,
    date: '2026-03-06T06:45:00',
    icon: '🧘',
    color: '#8b5cf6',
    details: {
      moodBefore: 6,
      moodAfter: 8,
      sessionType: 'Focused Attention',
    },
  },
  {
    id: 5,
    type: 'sleep',
    category: 'sleep',
    title: 'Ночной сон',
    description: 'Качественный 7.5-часовой сон',
    duration: 450,
    quality: 85,
    points: 100,
    date: '2026-03-05T23:00:00',
    icon: '😴',
    color: '#6366f1',
    details: {
      deepSleep: '1ч 48м',
      remSleep: '2ч 15м',
      lightSleep: '3ч 12м',
      awake: '15м',
      sleepScore: 85,
    },
  },
  {
    id: 6,
    type: 'workout',
    category: 'fitness',
    title: 'Силовая тренировка',
    description: 'Верх тела + кор',
    duration: 55,
    calories: 380,
    points: 180,
    date: '2026-03-05T18:00:00',
    icon: '💪',
    color: '#f59e0b',
    details: {
      exercises: 8,
      sets: 24,
      reps: 240,
      weight: '1,250 кг',
    },
  },
  {
    id: 7,
    type: 'meal',
    category: 'nutrition',
    title: 'Обед',
    description: 'Куриная грудка с рисом и овощами',
    calories: 620,
    protein: 45,
    carbs: 58,
    fat: 18,
    points: 60,
    date: '2026-03-05T13:00:00',
    icon: '🍽️',
    color: '#10b981',
    details: {
      fiber: '6г',
      sugar: '4г',
      sodium: '520мг',
    },
  },
  {
    id: 8,
    type: 'stretching',
    category: 'fitness',
    title: 'Вечерняя растяжка',
    description: 'Йога и мобильность',
    duration: 20,
    calories: 45,
    points: 60,
    date: '2026-03-05T21:00:00',
    icon: '🤸',
    color: '#ec4899',
    details: {
      poses: 12,
      flexibility: '+2%',
    },
  },
  {
    id: 9,
    type: 'supplement',
    category: 'nutrition',
    title: 'Витамины',
    description: 'Дневная доза витаминов',
    points: 20,
    date: '2026-03-05T08:00:00',
    icon: '💊',
    color: '#ef4444',
    details: {
      supplements: ['Vitamin D3', 'Omega-3', 'Magnesium'],
    },
  },
  {
    id: 10,
    type: 'walk',
    category: 'fitness',
    title: 'Прогулка',
    description: 'Обеденная прогулка',
    duration: 25,
    steps: 2850,
    calories: 120,
    points: 80,
    date: '2026-03-05T12:30:00',
    icon: '🚶',
    color: '#84cc16',
    details: {
      distance: '2.1 км',
      avgPace: '8:45 мин/км',
    },
  },
  {
    id: 11,
    type: 'meal',
    category: 'nutrition',
    title: 'Ужин',
    description: 'Лосось с салатом',
    calories: 480,
    protein: 38,
    carbs: 12,
    fat: 28,
    points: 55,
    date: '2026-03-05T19:30:00',
    icon: '🥗',
    color: '#10b981',
    details: {
      fiber: '5г',
      omega3: '2.5г',
      sodium: '380мг',
    },
  },
  {
    id: 12,
    type: 'reading',
    category: 'mental',
    title: 'Чтение',
    description: 'Книга о здоровье',
    duration: 30,
    points: 40,
    date: '2026-03-04T21:30:00',
    icon: '📚',
    color: '#f97316',
    details: {
      pages: 25,
      book: 'Why We Sleep',
    },
  },
];

const generateWeeklyStats = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day, idx) => ({
    day,
    activities: 8 + Math.floor(Math.random() * 8),
    calories: 1800 + Math.floor(Math.random() * 600),
    steps: 6000 + Math.floor(Math.random() * 6000),
    sleep: (6.5 + Math.random() * 2).toFixed(1),
    water: (1.5 + Math.random() * 1.5).toFixed(1),
    points: 400 + Math.floor(Math.random() * 300),
  }));
};

const generateCategoryDistribution = () => [
  { name: 'Фитнес', value: 35, color: '#f59e0b', icon: '💪' },
  { name: 'Питание', value: 30, color: '#10b981', icon: '🥗' },
  { name: 'Сон', value: 15, color: '#6366f1', icon: '😴' },
  { name: 'Ментальное', value: 12, color: '#8b5cf6', icon: '🧘' },
  { name: 'Прогулки', value: 8, color: '#84cc16', icon: '🚶' },
];

const generateMonthlyProgress = () => {
  const weeks = ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'];
  return weeks.map((week) => ({
    week,
    activities: 45 + Math.floor(Math.random() * 20),
    points: 2500 + Math.floor(Math.random() * 1000),
    streak: 5 + Math.floor(Math.random() * 10),
  }));
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ActivityCard - Карточка активности
 */
const ActivityCard = ({ activity, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours}ч назад`;
    if (days < 7) return `${days}дн назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div
      className={`neu-card transition-all duration-300 ${
        isExpanded ? 'shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${activity.color}20` }}
          >
            {activity.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-stone">{activity.title}</h4>
                <p className="text-sm text-ink-light mt-1">{activity.description}</p>
              </div>
              <span className="text-xs text-ink-light whitespace-nowrap">
                {formatDate(activity.date)}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center flex-wrap gap-3 mt-3">
              {activity.calories && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-red-50 text-red-600">
                  🔥 {activity.calories} ккал
                </span>
              )}
              {activity.duration && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-violet-50 text-violet-600">
                  ⏱️ {activity.duration} мин
                </span>
              )}
              {activity.steps && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                  👟 {activity.steps.toLocaleString()} шагов
                </span>
              )}
              {activity.points && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-amber-50 text-amber-600">
                  ⭐ +{activity.points} очков
                </span>
              )}
            </div>

            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 text-xs font-medium text-stone hover:text-ink transition-colors"
            >
              {isExpanded ? 'Свернуть' : 'Подробнее'} {isExpanded ? '↑' : '↓'}
            </button>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-stone/10 animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <div key={key} className="bg-sand/30 rounded-lg p-3">
                      <div className="text-xs text-ink-light capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="font-bold text-stone">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Link
                    to={`/health/${activity.category}`}
                    className="text-xs neu-button-secondary px-3 py-1.5 rounded-lg transition-all"
                  >
                    Подробнее о категории
                  </Link>
                  <button className="text-xs neu-button-secondary px-3 py-1.5 rounded-lg transition-all">
                    Поделиться
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * FilterButton - Кнопка фильтра
 */
const FilterButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
      active
        ? 'bg-stone text-bone shadow-md'
        : 'bg-sand/50 text-stone hover:bg-sand'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {count !== undefined && (
      <span className="text-xs bg-bone/50 px-2 py-0.5 rounded-full">{count}</span>
    )}
  </button>
);

/**
 * StatSidebar - Боковая панель статистики
 */
const StatSidebar = ({ stats, distribution, progress }) => (
  <div className="space-y-6">
    {/* Weekly Summary */}
    <div className="neu-card p-5">
      <h3 className="font-bold text-stone mb-4">За неделю</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">Активности</span>
          <span className="font-bold text-stone">{stats.activities}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">Калории</span>
          <span className="font-bold text-stone">{stats.calories.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">Шаги</span>
          <span className="font-bold text-stone">{stats.steps.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">Сон</span>
          <span className="font-bold text-stone">{stats.sleep}ч</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">Очки</span>
          <span className="font-bold text-amber-600">{stats.points}</span>
        </div>
      </div>
    </div>

    {/* Category Distribution */}
    <div className="neu-card p-5">
      <h3 className="font-bold text-stone mb-4">Категории</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={distribution}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {distribution.map((entry, index) => (
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
      <div className="mt-4 space-y-2">
        {distribution.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-ink">{cat.icon} {cat.name}</span>
            </div>
            <span className="font-medium text-stone">{cat.value}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Monthly Progress */}
    <div className="neu-card p-5">
      <h3 className="font-bold text-stone mb-4">Прогресс месяца</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={progress}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 10, fill: '#5c5243' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="activities" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Export */}
    <div className="neu-card p-5">
      <h3 className="font-bold text-stone mb-3">Экспорт данных</h3>
      <p className="text-xs text-ink-light mb-4">
        Скачайте полную историю активности
      </p>
      <div className="space-y-2">
        <button className="w-full neu-button-secondary py-2 rounded-xl text-sm font-medium transition-all">
          📄 PDF Отчёт
        </button>
        <button className="w-full neu-button-secondary py-2 rounded-xl text-sm font-medium transition-all">
          📊 CSV Данные
        </button>
        <button className="w-full neu-button-secondary py-2 rounded-xl text-sm font-medium transition-all">
          📱 Apple Health
        </button>
      </div>
    </div>
  </div>
);

/**
 * ActivityTimeline - Временная шкала
 */
const ActivityTimeline = ({ activities }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourData = hours.map((hour) => {
    const hourActivities = activities.filter((a) => {
      const activityHour = new Date(a.date).getHours();
      return activityHour === hour;
    });
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count: hourActivities.length,
      calories: hourActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
    };
  });

  return (
    <div className="neu-card p-6">
      <h3 className="font-bold text-stone mb-4">Активность по часам</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={hourData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#5c5243' }} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: '#5c5243' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Активности" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ActivityV1 = () => {
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('week');
  const [activities, setActivities] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [monthlyProgress, setMonthlyProgress] = useState([]);

  useEffect(() => {
    setActivities(generateActivities());
    setWeeklyStats(generateWeeklyStats());
    setCategoryDistribution(generateCategoryDistribution());
    setMonthlyProgress(generateMonthlyProgress());
  }, []);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesFilter =
        activeFilter === 'all' || activity.category === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activities, activeFilter, searchQuery]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      all: activities.length,
      fitness: activities.filter((a) => a.category === 'fitness').length,
      nutrition: activities.filter((a) => a.category === 'nutrition').length,
      sleep: activities.filter((a) => a.category === 'sleep').length,
      mental: activities.filter((a) => a.category === 'mental').length,
    };
  }, [activities]);

  // Weekly totals
  const weeklyTotals = useMemo(() => {
    return weeklyStats.reduce(
      (acc, day) => ({
        activities: acc.activities + day.activities,
        calories: acc.calories + day.calories,
        steps: acc.steps + day.steps,
        points: acc.points + day.points,
      }),
      { activities: 0, calories: 0, steps: 0, points: 0 }
    );
  }, [weeklyStats]);

  const filters = [
    { id: 'all', label: 'Все', icon: '📋' },
    { id: 'fitness', label: 'Фитнес', icon: '💪' },
    { id: 'nutrition', label: 'Питание', icon: '🥗' },
    { id: 'sleep', label: 'Сон', icon: '😴' },
    { id: 'mental', label: 'Ментальное', icon: '🧘' },
  ];

  return (
    <div className="min-h-screen bg-bone pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone/10 to-sand/20 border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone mb-2">Лента активности</h1>
              <p className="text-ink-light">Все ваши действия и достижения</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="neu-button px-4 py-2 rounded-xl text-sm font-medium"
              >
                <option value="day">Сегодня</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
              <Link to="/dashboard-v1" className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
                ← Дашборд
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск активностей..."
              className="neu-input py-3"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <FilterButton
                key={filter.id}
                active={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                icon={filter.icon}
                label={filter.label}
                count={counts[filter.id]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Activity Timeline Chart */}
            <ActivityTimeline activities={activities} />

            {/* Activities List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone">
                  {filteredActivities.length} активностей
                </h2>
                <div className="flex items-center space-x-2 text-sm text-ink-light">
                  <span>Сортировка:</span>
                  <select className="neu-button px-3 py-1 rounded-lg text-sm">
                    <option>По времени</option>
                    <option>По очкам</option>
                    <option>По калориям</option>
                  </select>
                </div>
              </div>

              {filteredActivities.length > 0 ? (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="neu-card p-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-stone mb-2">Нет активностей</h3>
                  <p className="text-ink-light mb-6">
                    Начните отслеживать свою активность
                  </p>
                  <Link
                    to="/health"
                    className="neu-button px-6 py-3 rounded-xl font-medium"
                  >
                    Начать тренировку
                  </Link>
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredActivities.length >= 10 && (
              <div className="text-center">
                <button className="neu-button-secondary px-8 py-3 rounded-xl font-medium">
                  Загрузить ещё
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <StatSidebar
              stats={weeklyTotals}
              distribution={categoryDistribution}
              progress={monthlyProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityV1;
