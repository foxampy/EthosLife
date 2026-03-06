import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Legend
} from 'recharts';

/**
 * FitnessV1 - Главная страница модуля Фитнес
 * /health/fitness-v1
 * 
 * Функционал:
 * - Today's activity
 * - Weekly workout chart
 * - Exercise quick add
 * - Personal records
 * - Workout streaks
 * - AI workout suggestions
 */

// ============================================
// MOCK DATA
// ============================================

const generateTodayActivity = () => ({
  steps: 8432,
  stepsTarget: 10000,
  calories: 2340,
  caloriesTarget: 2500,
  activeMinutes: 45,
  activeTarget: 60,
  distance: 6.2,
  distanceTarget: 8,
  floors: 12,
  floorsTarget: 15,
});

const generateWeeklyWorkouts = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day, index) => ({
    day,
    workouts: [0, 1, 0, 1, 1, 0, 1][index],
    duration: [0, 55, 0, 45, 60, 0, 30][index],
    calories: [0, 420, 0, 380, 450, 0, 280][index],
    type: [null, 'Силовая', null, 'Кардио', 'Силовая', null, 'Йога'][index],
  }));
};

const generateActivityHistory = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    steps: Math.floor(6000 + Math.random() * 6000),
    calories: Math.floor(2000 + Math.random() * 800),
    activeMinutes: Math.floor(30 + Math.random() * 60),
  }));
};

const generatePersonalRecords = () => [
  { id: 1, exercise: 'Жим лёжа', value: '100 кг', date: '15.02.2026', icon: '🏋️', category: 'strength' },
  { id: 2, exercise: 'Становая тяга', value: '140 кг', date: '20.02.2026', icon: '💪', category: 'strength' },
  { id: 3, exercise: 'Приседания', value: '120 кг', date: '10.02.2026', icon: '🦵', category: 'strength' },
  { id: 4, exercise: '5 км бег', value: '24:30', date: '25.02.2026', icon: '🏃', category: 'cardio' },
  { id: 5, exercise: 'Планка', value: '5:30', date: '01.03.2026', icon: '🧘', category: 'endurance' },
  { id: 6, exercise: 'Подтягивания', value: '20 раз', date: '05.03.2026', icon: '🤸', category: 'strength' },
];

const generateWorkoutStreaks = () => [
  { id: 'current', label: 'Текущая серия', value: 8, best: 21, icon: '🔥', color: 'bg-amber-500' },
  { id: 'weekly', label: 'Тренировок за неделю', value: 4, best: 7, icon: '📅', color: 'bg-emerald-500' },
  { id: 'monthly', label: 'Тренировок за месяц', value: 18, best: 28, icon: '📊', color: 'bg-violet-500' },
  { id: 'steps', label: 'Дней 10к+ шагов', value: 12, best: 30, icon: '👟', color: 'bg-cyan-500' },
];

const generateAIWorkoutSuggestions = () => [
  {
    id: 1,
    title: 'Восстановление после вчерашней тренировки',
    description: 'Рекомендуется лёгкая активность: прогулка, растяжка или йога',
    type: 'recovery',
    duration: 30,
    calories: 150,
    icon: '🧘',
    exercises: ['Лёгкая растяжка', 'Прогулка', 'Медитация'],
  },
  {
    id: 2,
    title: 'Кардио сессия',
    description: 'Интервальный бег для улучшения выносливости',
    type: 'cardio',
    duration: 45,
    calories: 450,
    icon: '🏃',
    exercises: ['Разминка 5 мин', 'Интервалы 30 мин', 'Заминка 10 мин'],
  },
  {
    id: 3,
    title: 'Верх тела',
    description: 'Силовая тренировка на грудь, спину и руки',
    type: 'strength',
    duration: 60,
    calories: 380,
    icon: '💪',
    exercises: ['Жим лёжа', 'Тяга в наклоне', 'Жим гантелей', 'Подтягивания'],
  },
];

const generateQuickExercises = () => [
  { id: 1, name: 'Отжимания', calories: 5, muscle: 'Грудь', icon: '🤲' },
  { id: 2, name: 'Приседания', calories: 8, muscle: 'Ноги', icon: '🦵' },
  { id: 3, name: 'Планка', calories: 4, muscle: 'Кор', icon: '🧘' },
  { id: 4, name: 'Бёрпи', calories: 12, muscle: 'Всё тело', icon: '🔥' },
  { id: 5, name: 'Выпады', calories: 7, muscle: 'Ноги', icon: '🦶' },
  { id: 6, name: 'Подтягивания', calories: 10, muscle: 'Спина', icon: '🤸' },
];

const generateMuscleGroups = () => [
  { name: 'Грудь', trained: 85, color: '#ef4444' },
  { name: 'Спина', trained: 70, color: '#3b82f6' },
  { name: 'Ноги', trained: 90, color: '#10b981' },
  { name: 'Плечи', trained: 60, color: '#f59e0b' },
  { name: 'Руки', trained: 75, color: '#8b5cf6' },
  { name: 'Кор', trained: 55, color: '#ec4899' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ActivityRing - Кольцо активности
 */
const ActivityRing = ({ value, target, color, size = 120, strokeWidth = 10, icon, label }) => {
  const percentage = Math.min((value / target) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#dcd3c6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl mb-1">{icon}</span>
        <span className="text-lg font-bold text-stone">{value}</span>
        <span className="text-xs text-ink-light">{label}</span>
      </div>
    </div>
  );
};

/**
 * TodayActivityWidget - Виджет сегодняшней активности
 */
const TodayActivityWidget = ({ activity }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Сегодня</h3>
          <p className="text-xs text-ink-light">6 марта 2026</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📊</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            Активен
          </span>
        </div>
      </div>

      {/* Activity Rings */}
      <div className="flex items-center justify-around mb-6">
        <ActivityRing
          value={activity.steps}
          target={activity.stepsTarget}
          color="#10b981"
          icon="👟"
          label="шагов"
        />
        <ActivityRing
          value={activity.calories}
          target={activity.caloriesTarget}
          color="#f59e0b"
          icon="🔥"
          label="ккал"
        />
        <ActivityRing
          value={activity.activeMinutes}
          target={activity.activeTarget}
          color="#8b5cf6"
          icon="⏱️"
          label="мин"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📏</span>
            <div>
              <div className="text-lg font-bold text-stone">{activity.distance} км</div>
              <div className="text-xs text-ink-light">Дистанция</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏢</span>
            <div>
              <div className="text-lg font-bold text-stone">{activity.floors}</div>
              <div className="text-xs text-ink-light">Этажей</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to goals */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-ink-light">Шаги</span>
              <span className="text-sm font-medium text-stone">{Math.round((activity.steps / activity.stepsTarget) * 100)}%</span>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min((activity.steps / activity.stepsTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-ink-light">Калории</span>
              <span className="text-sm font-medium text-stone">{Math.round((activity.calories / activity.caloriesTarget) * 100)}%</span>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min((activity.calories / activity.caloriesTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * WeeklyWorkoutChart - График тренировок за неделю
 */
const WeeklyWorkoutChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Тренировки за неделю</h3>
          <p className="text-xs text-ink-light">4 тренировки, 190 мин</p>
        </div>
        <Link to="/health/fitness/workout-v1" className="text-sm font-medium text-stone hover:text-ink">
          Начать →
        </Link>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="duration" fill="#10b981" radius={[8, 8, 0, 0]} name="Длительность (мин)" />
            <Line yAxisId="right" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="Ккал" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">4</div>
          <div className="text-xs text-ink-light">Тренировки</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">190</div>
          <div className="text-xs text-ink-light">Минут</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-violet-600">1530</div>
          <div className="text-xs text-ink-light">Ккал</div>
        </div>
      </div>
    </div>
  );
};

/**
 * PersonalRecordsWidget - Виджет личных рекордов
 */
const PersonalRecordsWidget = ({ records }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Личные рекорды</h3>
        <Link to="/health/fitness/exercises-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>

      <div className="space-y-3">
        {records.slice(0, 5).map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{record.icon}</span>
              <div>
                <div className="font-bold text-stone">{record.exercise}</div>
                <div className="text-xs text-ink-light">{record.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-amber-600">{record.value}</div>
              <div className="text-xs text-ink-light">рекорд</div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full neu-button-secondary py-3 rounded-xl font-medium">
        Добавить рекорд
      </button>
    </div>
  );
};

/**
 * WorkoutStreaksWidget - Виджет серий тренировок
 */
const WorkoutStreaksWidget = ({ streaks }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Серии</h3>
            <p className="text-xs text-ink-light">Ваши достижения</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {streaks.map((streak) => (
          <div key={streak.id}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{streak.icon}</span>
                <span className="text-sm font-medium text-stone">{streak.label}</span>
              </div>
              <span className="text-sm font-bold text-stone">
                {streak.value} / {streak.best}
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div
                className={`h-full ${streak.color} rounded-full transition-all duration-500`}
                style={{ width: `${(streak.value / streak.best) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-stone/10 text-center">
        <p className="text-sm text-ink-light mb-2">
          Поддержите серию и получите бонусы!
        </p>
        <Link to="/achievements" className="text-sm font-semibold text-stone hover:text-ink">
          Посмотреть достижения →
        </Link>
      </div>
    </div>
  );
};

/**
 * AIWorkoutSuggestions - AI рекомендации по тренировкам
 */
const AIWorkoutSuggestions = ({ suggestions, onSelect }) => {
  const getTypeColor = (type) => {
    const colors = {
      recovery: 'bg-violet-100 text-violet-700',
      cardio: 'bg-amber-100 text-amber-700',
      strength: 'bg-red-100 text-red-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-xl font-bold text-stone">AI Рекомендации</h3>
            <p className="text-xs text-ink-light">Персональные тренировки</p>
          </div>
        </div>
        <Link to="/ai-chat" className="text-sm font-medium text-stone hover:text-ink">
          Чат с AI →
        </Link>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
            onClick={() => onSelect?.(suggestion)}
          >
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{suggestion.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone">{suggestion.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(suggestion.type)}`}>
                    {suggestion.type === 'recovery' ? 'Восстановление' : suggestion.type === 'cardio' ? 'Кардио' : 'Сила'}
                  </span>
                </div>
                <p className="text-sm text-ink-light mb-3">{suggestion.description}</p>
                <div className="flex items-center space-x-4 text-xs text-ink-light">
                  <span>⏱️ {suggestion.duration} мин</span>
                  <span>🔥 {suggestion.calories} ккал</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestion.exercises.slice(0, 3).map((ex, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white rounded-lg text-stone">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * QuickExerciseAdd - Быстрое добавление упражнения
 */
const QuickExerciseAdd = ({ exercises, onAdd }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Быстрое упражнение</h3>
        <Link to="/health/fitness/exercises-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onAdd?.(exercise)}
            className="p-4 bg-sand/50 rounded-xl hover:bg-sand hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-2">{exercise.icon}</div>
            <div className="text-sm font-medium text-stone mb-1">{exercise.name}</div>
            <div className="text-xs text-ink-light">{exercise.muscle}</div>
          </button>
        ))}
      </div>

      <Link
        to="/health/fitness/workout-v1"
        className="mt-4 block w-full neu-button py-3 rounded-xl text-sm font-medium text-center"
      >
        Начать тренировку
      </Link>
    </div>
  );
};

/**
 * MuscleGroupsChart - График проработки мышц
 */
const MuscleGroupsChart = ({ data }) => {
  const radarData = data.map(item => ({
    subject: item.name,
    trained: item.trained,
    fullMark: 100,
  }));

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Проработка мышц</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#dcd3c6" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Проработка"
              dataKey="trained"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-stone">{item.name}</span>
            <span className="text-xs font-bold text-stone">{item.trained}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const FitnessV1 = () => {
  const [todayActivity] = useState(generateTodayActivity());
  const [weeklyWorkouts] = useState(generateWeeklyWorkouts());
  const [activityHistory] = useState(generateActivityHistory());
  const [personalRecords] = useState(generatePersonalRecords());
  const [workoutStreaks] = useState(generateWorkoutStreaks());
  const [aiSuggestions] = useState(generateAIWorkoutSuggestions());
  const [quickExercises] = useState(generateQuickExercises());
  const [muscleGroups] = useState(generateMuscleGroups());

  const handleQuickAddExercise = (exercise) => {
    console.log('Adding exercise:', exercise);
    // Здесь будет логика добавления
  };

  const handleSelectWorkout = (workout) => {
    console.log('Selecting workout:', workout);
    // Здесь будет логика выбора тренировки
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">💪</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Фитнес</h1>
                <p className="text-ink-light">Ваши тренировки и активность</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/fitness/workout-v1" className="neu-button px-4 py-2 rounded-xl font-medium">
              Тренировка
            </Link>
            <Link to="/health/fitness/exercises-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Упражнения
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TodayActivityWidget activity={todayActivity} />
          <WeeklyWorkoutChart data={weeklyWorkouts} />
          <WorkoutStreaksWidget streaks={workoutStreaks} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PersonalRecordsWidget records={personalRecords} />
          <QuickExerciseAdd exercises={quickExercises} onAdd={handleQuickAddExercise} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AIWorkoutSuggestions suggestions={aiSuggestions} onSelect={handleSelectWorkout} />
          <MuscleGroupsChart data={muscleGroups} />
          
          {/* Activity History Chart */}
          <div className="neu-card p-6">
            <h3 className="text-xl font-bold text-stone mb-6">Активность за неделю</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityHistory}>
                  <defs>
                    <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#stepsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Навигация по модулю</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/health/fitness/workout-v1"
              className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🏋️</div>
              <div className="font-medium">Тренировка</div>
            </Link>
            <Link
              to="/health/fitness/exercises-v1"
              className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium">Упражнения</div>
            </Link>
            <Link
              to="/health/fitness-v1#records"
              className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-medium">Рекорды</div>
            </Link>
            <Link
              to="/health/fitness-v1#analytics"
              className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Аналитика</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessV1;
