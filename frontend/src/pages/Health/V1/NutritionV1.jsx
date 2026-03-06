import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Line, Legend
} from 'recharts';

/**
 * NutritionV1 - Главная страница модуля Питания
 * /health/nutrition-v1
 * 
 * Функционал:
 * - Калории сегодня (progress bar)
 * - Макросы (белки/жиры/углеводы chart)
 * - Вода (трекер, 8 стаканов)
 * - Quick add food
 * - Recent meals
 * - Nutrition score
 * - AI recommendations
 */

// ============================================
// MOCK DATA
// ============================================

const generateTodayNutrition = () => ({
  calories: {
    consumed: 1847,
    target: 2200,
    remaining: 353,
    percentage: 84,
  },
  macros: {
    protein: { consumed: 142, target: 180, percentage: 79 },
    carbs: { consumed: 210, target: 250, percentage: 84 },
    fat: { consumed: 68, target: 85, percentage: 80 },
    fiber: { consumed: 28, target: 35, percentage: 80 },
  },
  water: {
    glasses: 5,
    target: 8,
    ml: 1250,
    targetMl: 2000,
  },
  meals: [
    {
      id: 1,
      type: 'breakfast',
      name: 'Овсянка с ягодами',
      time: '07:30',
      calories: 450,
      protein: 15,
      carbs: 65,
      fat: 12,
      icon: '🥣',
    },
    {
      id: 2,
      type: 'snack',
      name: 'Греческий йогурт',
      time: '10:15',
      calories: 180,
      protein: 18,
      carbs: 12,
      fat: 6,
      icon: '🥛',
    },
    {
      id: 3,
      type: 'lunch',
      name: 'Куриная грудка с рисом',
      time: '13:00',
      calories: 620,
      protein: 45,
      carbs: 58,
      fat: 18,
      icon: '🍽️',
    },
    {
      id: 4,
      type: 'snack',
      name: 'Яблоко с орехами',
      time: '16:30',
      calories: 220,
      protein: 6,
      carbs: 28,
      fat: 12,
      icon: '🍎',
    },
    {
      id: 5,
      type: 'dinner',
      name: 'Лосось с овощами',
      time: '19:45',
      calories: 377,
      protein: 58,
      carbs: 47,
      fat: 20,
      icon: '🐟',
    },
  ],
});

const generateWeeklyCalories = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    calories: Math.floor(1800 + Math.random() * 600),
    target: 2200,
    burned: Math.floor(300 + Math.random() * 400),
  }));
};

const generateMacroTrend = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    protein: Math.floor(120 + Math.random() * 80),
    carbs: Math.floor(180 + Math.random() * 100),
    fat: Math.floor(50 + Math.random() * 50),
  }));
};

const generateNutritionScore = () => ({
  overall: 78,
  breakdown: {
    variety: 82,
    balance: 75,
    moderation: 71,
    hydration: 63,
    timing: 85,
  },
  history: [
    { day: 'Пн', score: 72 },
    { day: 'Вт', score: 75 },
    { day: 'Ср', score: 68 },
    { day: 'Чт', score: 81 },
    { day: 'Пт', score: 78 },
    { day: 'Сб', score: 85 },
    { day: 'Вс', score: 78 },
  ],
});

const generateAIRecommendations = () => [
  {
    id: 1,
    type: 'positive',
    title: 'Отличный баланс макросов!',
    message: 'Вы достигли 79% от цели по белку. Продолжайте в том же духе!',
    icon: '🎉',
    priority: 'low',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Недостаточно воды',
    message: 'Вы выпили только 5 из 8 стаканов. Осталось 3 стакана до цели.',
    icon: '💧',
    priority: 'high',
  },
  {
    id: 3,
    type: 'info',
    title: 'Рекомендация по ужину',
    message: 'Попробуйте добавить больше клетчатки в вечерний приём пищи.',
    icon: '🥗',
    priority: 'medium',
  },
  {
    id: 4,
    type: 'tip',
    title: 'Витамин D',
    message: 'Учитывая сезон, рассмотрите добавление витамина D3.',
    icon: '💊',
    priority: 'low',
  },
];

const generateQuickAddFoods = () => [
  { id: 1, name: 'Яблоко', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, icon: '🍎' },
  { id: 2, name: 'Банан', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, icon: '🍌' },
  { id: 3, name: 'Яйцо', calories: 78, protein: 6, carbs: 0.6, fat: 5, icon: '🥚' },
  { id: 4, name: 'Орехи (30г)', calories: 170, protein: 6, carbs: 6, fat: 15, icon: '🥜' },
  { id: 5, name: 'Йогурт', calories: 100, protein: 10, carbs: 12, fat: 2, icon: '🥛' },
  { id: 6, name: 'Тост', calories: 80, protein: 3, carbs: 15, fat: 1, icon: '🍞' },
];

const COLORS = {
  protein: '#10b981',
  carbs: '#f59e0b',
  fat: '#ef4444',
  fiber: '#8b5cf6',
  water: '#06b6d4',
  primary: '#5c5243',
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * CaloriesProgress - Прогресс калорий за день
 */
const CaloriesProgress = ({ data }) => {
  const percentage = Math.min((data.consumed / data.target) * 100, 100);
  const remaining = data.target - data.consumed;
  
  const getStatusColor = () => {
    if (percentage < 70) return '#10b981';
    if (percentage < 90) return '#f59e0b';
    if (percentage <= 100) return '#10b981';
    return '#ef4444';
  };

  const getStatusText = () => {
    if (percentage < 70) return 'Недостаточно';
    if (percentage < 90) return 'В норме';
    if (percentage <= 100) return 'Отлично';
    return 'Превышение';
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-stone">Калории сегодня</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          percentage >= 70 && percentage <= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {getStatusText()}
        </span>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#dcd3c6"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={getStatusColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 264} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-stone">{data.consumed}</span>
            <span className="text-sm text-ink-light">из {data.target} ккал</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-stone">{data.consumed}</div>
          <div className="text-xs text-ink-light">Съедено</div>
        </div>
        <div className="p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{remaining > 0 ? remaining : 0}</div>
          <div className="text-xs text-ink-light">Осталось</div>
        </div>
        <div className="p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-amber-600">{data.percentage}%</div>
          <div className="text-xs text-ink-light">Прогресс</div>
        </div>
      </div>

      {/* Hourly breakdown */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <h4 className="text-sm font-semibold text-stone mb-3">По часам</h4>
        <div className="h-2 bg-sand rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-ink-light">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
};

/**
 * MacrosChart - Диаграмма макронутриентов
 */
const MacrosChart = ({ macros }) => {
  const data = [
    { name: 'Белки', value: macros.protein.consumed, target: macros.protein.target, color: COLORS.protein },
    { name: 'Жиры', value: macros.fat.consumed, target: macros.fat.target, color: COLORS.fat },
    { name: 'Углеводы', value: macros.carbs.consumed, target: macros.carbs.target, color: COLORS.carbs },
    { name: 'Клетчатка', value: macros.fiber.consumed, target: macros.fiber.target, color: COLORS.fiber },
  ];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Макронутриенты</h3>
        <Link to="/health/nutrition/diary-v1" className="text-sm font-medium text-stone hover:text-ink">
          Подробнее →
        </Link>
      </div>

      {/* Pie Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fefae8', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Macro Cards */}
      <div className="grid grid-cols-2 gap-3">
        {data.map((macro, index) => (
          <div key={index} className="p-3 bg-sand/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone">{macro.name}</span>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: macro.color }}
              />
            </div>
            <div className="text-lg font-bold text-stone">
              {macro.value}г / {macro.target}г
            </div>
            <div className="h-2 bg-sand rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: macro.color,
                  width: `${Math.min((macro.value / macro.target) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * WaterTracker - Трекер воды
 */
const WaterTracker = ({ water, onUpdate }) => {
  const [glasses, setGlasses] = useState(water.glasses);

  const addGlass = () => {
    if (glasses < 12) {
      setGlasses(glasses + 1);
      onUpdate?.(glasses + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(glasses - 1);
      onUpdate?.(glasses - 1);
    }
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💧</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Вода</h3>
            <p className="text-xs text-ink-light">Гидратация</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-600">{glasses}</div>
          <div className="text-xs text-ink-light">из {water.target} стаканов</div>
        </div>
      </div>

      {/* Water Glasses Visual */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({ length: water.target }).map((_, index) => (
          <div
            key={index}
            className={`h-16 rounded-lg transition-all duration-300 ${
              index < glasses 
                ? 'bg-gradient-to-t from-cyan-500 to-cyan-300' 
                : 'bg-sand/50'
            }`}
            style={{
              background: index < glasses 
                ? `linear-gradient(to top, #06b6d4 ${100 - (glasses - index) * 10}%, #67e8f9 100%)`
                : undefined
            }}
          >
            {index < glasses && (
              <div className="h-full flex items-center justify-center text-white text-lg">
                🌊
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={removeGlass}
          disabled={glasses === 0}
          className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-xl font-bold text-stone hover:bg-stone/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          −
        </button>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">{glasses * 250} мл</div>
          <div className="text-xs text-ink-light">из {water.targetMl} мл</div>
        </div>
        <button
          onClick={addGlass}
          disabled={glasses >= water.target}
          className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          +
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-3 bg-sand rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-500"
          style={{ width: `${(glasses / water.target) * 100}%` }}
        />
      </div>
    </div>
  );
};

/**
 * QuickAddFood - Быстрое добавление еды
 */
const QuickAddFood = ({ onAdd }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleQuickAdd = (food) => {
    onAdd?.(food);
    setSelectedFood(food);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Быстрое добавление</h3>
        <Link 
          to="/health/nutrition/products-v1" 
          className="text-sm font-medium text-stone hover:text-ink"
        >
          Все продукты →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {generateQuickAddFoods().map((food) => (
          <button
            key={food.id}
            onClick={() => handleQuickAdd(food)}
            className="p-3 bg-sand/50 rounded-xl hover:bg-sand transition-all group"
          >
            <div className="text-2xl mb-2">{food.icon}</div>
            <div className="text-sm font-medium text-stone truncate">{food.name}</div>
            <div className="text-xs text-ink-light">{food.calories} ккал</div>
          </button>
        ))}
      </div>

      {/* Toast notification */}
      {showModal && selectedFood && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✓ Добавлено: {selectedFood.name} ({selectedFood.calories} ккал)
        </div>
      )}
    </div>
  );
};

/**
 * RecentMeals - Последние приёмы пищи
 */
const RecentMeals = ({ meals }) => {
  const getTypeColor = (type) => {
    const colors = {
      breakfast: 'bg-amber-100 text-amber-600',
      lunch: 'bg-emerald-100 text-emerald-600',
      dinner: 'bg-violet-100 text-violet-600',
      snack: 'bg-pink-100 text-pink-600',
    };
    return colors[type] || 'bg-sand text-stone';
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Приёмы пищи сегодня</h3>
        <Link to="/health/nutrition/diary-v1" className="text-sm font-medium text-stone hover:text-ink">
          Дневник →
        </Link>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center space-x-4 p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getTypeColor(meal.type)}`}>
              {meal.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone">{meal.name}</span>
                <span className="text-sm text-ink-light">{meal.time}</span>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-ink-light">
                <span className="text-emerald-600">Б: {meal.protein}г</span>
                <span className="text-amber-600">У: {meal.carbs}г</span>
                <span className="text-red-600">Ж: {meal.fat}г</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-stone">{meal.calories}</div>
              <div className="text-xs text-ink-light">ккал</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/health/nutrition/diary-v1"
        className="mt-4 block w-full neu-button-secondary py-3 rounded-xl text-sm font-medium text-center transition-all hover:shadow-md"
      >
        Добавить приём пищи
      </Link>
    </div>
  );
};

/**
 * NutritionScore - Оценка питания
 */
const NutritionScore = ({ score }) => {
  const getScoreColor = (value) => {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const breakdownData = Object.entries(score.breakdown).map(([key, value]) => ({
    name: {
      variety: 'Разнообразие',
      balance: 'Баланс',
      moderation: 'Умеренность',
      hydration: 'Гидратация',
      timing: 'Тайминг',
    }[key],
    value,
    color: getScoreColor(value),
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Nutrition Score</h3>
          <p className="text-xs text-ink-light">Оценка качества питания</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold" style={{ color: getScoreColor(score.overall) }}>
            {score.overall}
          </div>
          <div className="text-xs text-ink-light">из 100</div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-4">
        {breakdownData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone">{item.name}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: item.color, width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly trend */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <h4 className="text-sm font-semibold text-stone mb-4">Тренд за неделю</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={score.history}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5c5243' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fefae8', 
                  border: 'none', 
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#scoreGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/**
 * AIRecommendations - AI рекомендации
 */
const AIRecommendations = ({ recommendations }) => {
  const getTypeStyles = (type) => {
    const styles = {
      positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
      warning: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100' },
      info: { bg: 'bg-violet-50', border: 'border-violet-200', iconBg: 'bg-violet-100' },
      tip: { bg: 'bg-cyan-50', border: 'border-cyan-200', iconBg: 'bg-cyan-100' },
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-xl font-bold text-stone">AI Рекомендации</h3>
            <p className="text-xs text-ink-light">Персональные советы</p>
          </div>
        </div>
        <Link to="/ai-chat" className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          Чат с AI
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const styles = getTypeStyles(rec.type);
          return (
            <div
              key={rec.id}
              className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${styles.iconBg} w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-stone mb-1">{rec.title}</h4>
                  <p className="text-sm text-ink mb-2">{rec.message}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.priority === 'high' ? 'Важно' : rec.priority === 'medium' ? 'Средне' : 'Инфо'}
                    </span>
                  </div>
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
 * WeeklyCaloriesChart - График калорий за неделю
 */
const WeeklyCaloriesChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Калории за неделю</h3>
          <p className="text-xs text-ink-light">Потребление и расход</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-xs text-ink-light">Съедено</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-xs text-ink-light">Цель</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 3000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="calories" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const NutritionV1 = () => {
  const [nutrition, setNutrition] = useState(generateTodayNutrition());
  const [weeklyCalories] = useState(generateWeeklyCalories());
  const [macroTrend] = useState(generateMacroTrend());
  const [nutritionScore] = useState(generateNutritionScore());
  const [aiRecommendations] = useState(generateAIRecommendations());
  const [waterGlasses, setWaterGlasses] = useState(nutrition.water.glasses);

  const handleWaterUpdate = (glasses) => {
    setWaterGlasses(glasses);
  };

  const handleQuickAddFood = (food) => {
    console.log('Adding food:', food);
    // Здесь будет логика добавления в дневник
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">🥗</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Питание</h1>
                <p className="text-ink-light">Управляйте своим рационом</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/nutrition/diary-v1" className="neu-button px-4 py-2 rounded-xl font-medium">
              Дневник
            </Link>
            <Link to="/health/nutrition/meal-plan-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              План
            </Link>
            <Link to="/health/nutrition/recipes-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Рецепты
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row - Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CaloriesProgress data={nutrition.calories} />
          <MacrosChart macros={nutrition.macros} />
          <WaterTracker water={{ ...nutrition.water, glasses: waterGlasses }} onUpdate={handleWaterUpdate} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentMeals meals={nutrition.meals} />
          <QuickAddFood onAdd={handleQuickAddFood} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <NutritionScore score={nutritionScore} />
          <AIRecommendations recommendations={aiRecommendations} />
          <WeeklyCaloriesChart data={weeklyCalories} />
        </div>

        {/* Navigation to other nutrition pages */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Навигация по модулю</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/health/nutrition/diary-v1"
              className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Дневник питания</div>
            </Link>
            <Link
              to="/health/nutrition/meal-plan-v1"
              className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Планировщик</div>
            </Link>
            <Link
              to="/health/nutrition/recipes-v1"
              className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">👨‍🍳</div>
              <div className="font-medium">Рецепты</div>
            </Link>
            <Link
              to="/health/nutrition/products-v1"
              className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium">Продукты</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionV1;
