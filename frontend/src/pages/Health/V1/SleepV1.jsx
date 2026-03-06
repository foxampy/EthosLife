import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Legend
} from 'recharts';

/**
 * SleepV1 - Главная страница модуля Сон
 * /health/sleep-v1
 * 
 * Функционал:
 * - Last night's sleep summary
 * - Sleep stages (deep/light/REM)
 * - Sleep score
 * - Bedtime reminder
 * - Sleep quality factors
 * - Weekly trend chart
 * - Smart alarm
 */

// ============================================
// MOCK DATA
// ============================================

const generateLastNightSleep = () => ({
  duration: {
    hours: 7,
    minutes: 32,
    total: 452,
    target: 480,
  },
  quality: 85,
  score: 82,
  bedtime: '23:15',
  wakeTime: '06:47',
  timesWoken: 2,
  sleepLatency: 12, // minutes to fall asleep
  efficiency: 94, // percentage of time in bed actually sleeping
});

const generateSleepStages = () => ({
  awake: { minutes: 28, percentage: 6, color: '#ef4444' },
  rem: { minutes: 108, percentage: 24, color: '#8b5cf6' },
  light: { minutes: 198, percentage: 44, color: '#3b82f6' },
  deep: { minutes: 118, percentage: 26, color: '#10b981' },
});

const generateWeeklySleep = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day, index) => ({
    day,
    duration: [7.2, 6.8, 7.5, 8.1, 7.0, 8.5, 7.5][index],
    quality: [82, 75, 88, 91, 80, 95, 85][index],
    deepSleep: [1.8, 1.5, 2.1, 2.3, 1.7, 2.5, 2.0][index],
    remSleep: [2.0, 1.8, 2.2, 2.4, 1.9, 2.6, 2.1][index],
    bedtime: ['23:30', '00:15', '23:00', '22:45', '23:45', '23:00', '23:15'][index],
  }));
};

const generateSleepScoreHistory = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    score: [78, 72, 85, 88, 76, 92, 82][parseInt(day) - 1] || 80,
  }));
};

const generateSleepQualityFactors = () => [
  { id: 1, factor: 'Время отхода ко сну', value: '23:15', status: 'good', icon: '🌙', impact: '+5' },
  { id: 2, factor: 'Продолжительность', value: '7ч 32м', status: 'good', icon: '⏱️', impact: '+8' },
  { id: 3, factor: 'Пробуждения', value: '2 раза', status: 'warning', icon: '⚠️', impact: '-3' },
  { id: 4, factor: 'Глубокий сон', value: '26%', status: 'excellent', icon: '💤', impact: '+10' },
  { id: 5, factor: 'REM сон', value: '24%', status: 'good', icon: '🧠', impact: '+5' },
  { id: 6, factor: 'Эффективность', value: '94%', status: 'excellent', icon: '✅', impact: '+7' },
];

const generateBedtimeReminders = () => [
  { time: '21:00', message: 'Начните расслабляться', icon: '📖', enabled: true },
  { time: '22:00', message: 'Уберите гаджеты', icon: '📱', enabled: true },
  { time: '22:30', message: 'Приглушите свет', icon: '💡', enabled: true },
  { time: '23:00', message: 'Пора в кровать', icon: '🛏️', enabled: true },
];

const generateSmartAlarmSettings = () => ({
  wakeTime: '06:30',
  window: 30, // minutes
  enabled: true,
  sound: 'nature',
  volume: 50,
  snooze: 5,
});

const generateSleepTips = () => [
  {
    id: 1,
    title: 'Оптимизируйте температуру',
    description: 'Идеальная температура для сна: 18-20°C',
    icon: '🌡️',
    category: 'environment',
  },
  {
    id: 2,
    title: 'Избегайте кофеина вечером',
    description: 'Не употребляйте кофеин за 6 часов до сна',
    icon: '☕',
    category: 'nutrition',
  },
  {
    id: 3,
    title: 'Создайте ритуал',
    description: 'Одинаковые действия перед сном помогают заснуть',
    icon: '📿',
    category: 'habit',
  },
  {
    id: 4,
    title: 'Ограничьте синий свет',
    description: 'Используйте режим чтения на устройствах',
    icon: '📱',
    category: 'environment',
  },
];

const SLEEP_SCORE_COLORS = {
  excellent: '#10b981',
  good: '#3b82f6',
  fair: '#f59e0b',
  poor: '#ef4444',
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * SleepScoreGauge - Индикатор оценки сна
 */
const SleepScoreGauge = ({ score }) => {
  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Отлично', color: SLEEP_SCORE_COLORS.excellent };
    if (score >= 70) return { label: 'Хорошо', color: SLEEP_SCORE_COLORS.good };
    if (score >= 50) return { label: 'Нормально', color: SLEEP_SCORE_COLORS.fair };
    return { label: 'Плохо', color: SLEEP_SCORE_COLORS.poor };
  };

  const status = getScoreLabel(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#dcd3c6"
          strokeWidth="20"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={status.color}
          strokeWidth="20"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-stone">{score}</span>
        <span className="text-sm text-ink-light mt-1">из 100</span>
        <span className="text-sm font-medium mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
          {status.label}
        </span>
      </div>
    </div>
  );
};

/**
 * LastNightSummary - Сводка за прошлую ночь
 */
const LastNightSummary = ({ sleep }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Прошлая ночь</h3>
          <p className="text-xs text-ink-light">5-6 марта 2026</p>
        </div>
        <span className="text-4xl">🌙</span>
      </div>

      <div className="flex items-center justify-center mb-6">
        <SleepScoreGauge score={sleep.score} />
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-sand/50 rounded-xl text-center">
          <div className="text-2xl font-bold text-stone">
            {sleep.duration.hours}ч {sleep.duration.minutes}м
          </div>
          <div className="text-xs text-ink-light mt-1">Продолжительность</div>
          <div className="text-xs text-emerald-600 mt-1">
            {sleep.duration.total >= sleep.duration.target ? '✓ Цель достигнута' : `-${sleep.duration.target - sleep.duration.total} мин`}
          </div>
        </div>
        <div className="p-4 bg-sand/50 rounded-xl text-center">
          <div className="text-2xl font-bold text-stone">{sleep.quality}%</div>
          <div className="text-xs text-ink-light mt-1">Качество</div>
          <div className="text-xs text-emerald-600 mt-1">Отлично</div>
        </div>
        <div className="p-4 bg-sand/50 rounded-xl text-center">
          <div className="text-2xl font-bold text-stone">{sleep.bedtime}</div>
          <div className="text-xs text-ink-light mt-1">Отбой</div>
          <div className="text-xs text-amber-600 mt-1">Оптимально</div>
        </div>
        <div className="p-4 bg-sand/50 rounded-xl text-center">
          <div className="text-2xl font-bold text-stone">{sleep.wakeTime}</div>
          <div className="text-xs text-ink-light mt-1">Подъём</div>
          <div className="text-xs text-emerald-600 mt-1">✓</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-stone">{sleep.timesWoken}</div>
            <div className="text-xs text-ink-light">Пробуждений</div>
          </div>
          <div>
            <div className="text-lg font-bold text-stone">{sleep.sleepLatency} мин</div>
            <div className="text-xs text-ink-light">Засыпание</div>
          </div>
          <div>
            <div className="text-lg font-bold text-stone">{sleep.efficiency}%</div>
            <div className="text-xs text-ink-light">Эффективность</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SleepStagesChart - Диаграмма фаз сна
 */
const SleepStagesChart = ({ stages }) => {
  const data = Object.entries(stages).map(([key, value]) => ({
    name: key === 'awake' ? 'Бодрствование' : key === 'rem' ? 'REM' : key === 'light' ? 'Лёгкий' : 'Глубокий',
    minutes: value.minutes,
    percentage: value.percentage,
    color: value.color,
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Фазы сна</h3>
        <Link to="/health/sleep/analysis-v1" className="text-sm font-medium text-stone hover:text-ink">
          Анализ →
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
              dataKey="minutes"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
              formatter={(value, name, props) => [`${value} мин`, props.payload.name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with Details */}
      <div className="space-y-3">
        {data.map((stage, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="font-medium text-stone">{stage.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-stone">{stage.minutes} мин</div>
              <div className="text-xs text-ink-light">{stage.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <h4 className="text-sm font-semibold text-stone mb-3">Рекомендации по фазам</h4>
        <div className="space-y-2">
          {stages.deep.percentage < 20 && (
            <div className="flex items-start space-x-2 text-sm">
              <span className="text-emerald-500">💡</span>
              <span className="text-ink">Увеличьте физическую активность днём для большего глубокого сна</span>
            </div>
          )}
          {stages.rem.percentage < 20 && (
            <div className="flex items-start space-x-2 text-sm">
              <span className="text-emerald-500">💡</span>
              <span className="text-ink">Избегайте алкоголя вечером для улучшения REM фазы</span>
            </div>
          )}
          {stages.awake.percentage > 10 && (
            <div className="flex items-start space-x-2 text-sm">
              <span className="text-amber-500">⚠️</span>
              <span className="text-ink">Частые пробуждения - проверьте комфорт спального места</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * WeeklyTrendChart - График тренда за неделю
 */
const WeeklyTrendChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Тренд за неделю</h3>
          <p className="text-xs text-ink-light">Продолжительность и качество</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-xs text-ink-light">Сон (ч)</span>
          <div className="w-3 h-3 bg-violet-500 rounded-full ml-2" />
          <span className="text-xs text-ink-light">Качество (%)</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 12]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="duration" fill="#10b981" radius={[8, 8, 0, 0]} name="Продолжительность (ч)" />
            <Line yAxisId="right" dataKey="quality" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Качество" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">
            {(data.reduce((sum, d) => sum + d.duration, 0) / data.length).toFixed(1)}ч
          </div>
          <div className="text-xs text-ink-light">Среднее</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-violet-600">
            {(data.reduce((sum, d) => sum + d.quality, 0) / data.length).toFixed(0)}%
          </div>
          <div className="text-xs text-ink-light">Ср. качество</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">
            {Math.max(...data.map(d => d.duration))}ч
          </div>
          <div className="text-xs text-ink-light">Максимум</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">
            {Math.min(...data.map(d => d.duration))}ч
          </div>
          <div className="text-xs text-ink-light">Минимум</div>
        </div>
      </div>
    </div>
  );
};

/**
 * BedtimeReminders - Напоминания о сне
 */
const BedtimeReminders = ({ reminders, onToggle }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔔</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Напоминания</h3>
            <p className="text-xs text-ink-light">Подготовка ко сну</p>
          </div>
        </div>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          Настроить
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-sand/50 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{reminder.icon}</span>
              <div>
                <div className="font-medium text-stone">{reminder.time}</div>
                <div className="text-sm text-ink-light">{reminder.message}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminder.enabled}
                onChange={() => onToggle?.(index)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * SleepQualityFactors - Факторы качества сна
 */
const SleepQualityFactors = ({ factors }) => {
  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-emerald-100 text-emerald-700',
      good: 'bg-blue-100 text-blue-700',
      warning: 'bg-amber-100 text-amber-700',
      poor: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.good;
  };

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Факторы качества</h3>
      
      <div className="space-y-3">
        {factors.map((factor) => (
          <div
            key={factor.id}
            className="flex items-center justify-between p-4 bg-sand/50 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{factor.icon}</span>
              <div>
                <div className="font-medium text-stone">{factor.factor}</div>
                <div className="text-sm text-ink-light">{factor.value}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(factor.status)}`}>
                {factor.status === 'excellent' ? 'Отлично' : factor.status === 'good' ? 'Хорошо' : factor.status === 'warning' ? 'Внимание' : 'Плохо'}
              </span>
              <span className={`text-sm font-bold ${factor.impact.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {factor.impact}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Score Breakdown */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="flex items-center justify-between">
          <span className="font-medium text-stone">Итоговая оценка</span>
          <span className="text-2xl font-bold text-emerald-600">+32 балла</span>
        </div>
      </div>
    </div>
  );
};

/**
 * SmartAlarmWidget - Виджет умного будильника
 */
const SmartAlarmWidget = ({ settings, onUpdate }) => {
  const [wakeTime, setWakeTime] = useState(settings.wakeTime);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⏰</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Умный будильник</h3>
            <p className="text-xs text-ink-light">Пробуждение в нужную фазу</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={() => onUpdate?.({ ...settings, enabled: !settings.enabled })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-stone/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Время подъёма</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="neu-input w-full text-center text-2xl py-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Окно пробуждения</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUpdate?.({ ...settings, window: 15 })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                settings.window === 15 ? 'bg-stone text-white' : 'bg-sand/50 text-stone'
              }`}
            >
              15 мин
            </button>
            <button
              onClick={() => onUpdate?.({ ...settings, window: 30 })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                settings.window === 30 ? 'bg-stone text-white' : 'bg-sand/50 text-stone'
              }`}
            >
              30 мин
            </button>
            <button
              onClick={() => onUpdate?.({ ...settings, window: 45 })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                settings.window === 45 ? 'bg-stone text-white' : 'bg-sand/50 text-stone'
              }`}
            >
              45 мин
            </button>
          </div>
        </div>

        <div className="p-4 bg-violet-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div>
              <div className="font-medium text-stone">Как это работает</div>
              <div className="text-sm text-ink-light mt-1">
                Будильник сработает в оптимальную фазу лёгкого сна в выбранном окне времени
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SleepTips - Советы по улучшению сна
 */
const SleepTips = ({ tips }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Советы для лучшего сна</h3>
        <Link to="/health/sleep/analysis-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все советы →
        </Link>
      </div>

      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{tip.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-stone mb-1">{tip.title}</h4>
                <p className="text-sm text-ink-light">{tip.description}</p>
                <span className="text-xs px-2 py-1 bg-stone/20 rounded-full text-stone mt-2 inline-block">
                  {tip.category === 'environment' ? 'Окружение' : tip.category === 'nutrition' ? 'Питание' : 'Привычки'}
                </span>
              </div>
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

const SleepV1 = () => {
  const [lastNightSleep] = useState(generateLastNightSleep());
  const [sleepStages] = useState(generateSleepStages());
  const [weeklySleep] = useState(generateWeeklySleep());
  const [sleepScoreHistory] = useState(generateSleepScoreHistory());
  const [qualityFactors] = useState(generateSleepQualityFactors());
  const [bedtimeReminders, setBedtimeReminders] = useState(generateBedtimeReminders());
  const [smartAlarm, setSmartAlarm] = useState(generateSmartAlarmSettings());
  const [sleepTips] = useState(generateSleepTips());

  const handleReminderToggle = (index) => {
    setBedtimeReminders(prev =>
      prev.map((r, i) => i === index ? { ...r, enabled: !r.enabled } : r)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">😴</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Сон</h1>
                <p className="text-ink-light">Отслеживайте и улучшайте свой сон</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/sleep/analysis-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Анализ
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              Начать сон 🌙
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <LastNightSummary sleep={lastNightSleep} />
          <SleepStagesChart stages={sleepStages} />
          <SmartAlarmWidget settings={smartAlarm} onUpdate={setSmartAlarm} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WeeklyTrendChart data={weeklySleep} />
          <SleepQualityFactors factors={qualityFactors} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BedtimeReminders reminders={bedtimeReminders} onToggle={handleReminderToggle} />
          <SleepTips tips={sleepTips} />
          
          {/* Sleep Score History */}
          <div className="neu-card p-6">
            <h3 className="text-xl font-bold text-stone mb-6">Оценка сна</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepScoreHistory}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Навигация по модулю</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/health/sleep/analysis-v1"
              className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Анализ сна</div>
            </Link>
            <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">⏰</div>
              <div className="font-medium">Будильник</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🎵</div>
              <div className="font-medium">Звуки сна</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📖</div>
              <div className="font-medium">Дневник</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepV1;
