import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';

/**
 * OverviewV1 - Общий обзор здоровья
 * Детальная аналитика по всем модулям здоровья
 */

// ============================================
// MOCK DATA
// ============================================

const generateMonthlyData = () => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  return months.map((month) => ({
    month,
    healthScore: 65 + Math.random() * 25,
    activity: 50 + Math.random() * 40,
    sleep: 6 + Math.random() * 2.5,
    nutrition: 60 + Math.random() * 35,
    mental: 55 + Math.random() * 40,
  }));
};

const generateBodyMetrics = () => [
  { date: '01.02', weight: 76.2, fat: 19.5, muscle: 57.2, water: 58.5 },
  { date: '08.02', weight: 75.8, fat: 19.2, muscle: 57.5, water: 59.0 },
  { date: '15.02', weight: 75.5, fat: 18.8, muscle: 57.8, water: 59.2 },
  { date: '22.02', weight: 75.2, fat: 18.5, muscle: 58.0, water: 59.5 },
  { date: '01.03', weight: 75.0, fat: 18.2, muscle: 58.2, water: 59.8 },
  { date: '08.03', weight: 74.8, fat: 18.0, muscle: 58.5, water: 60.0 },
];

const generateHeartRateData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      resting: 60 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
      active: 70 + Math.sin(i * 0.5) * 15 + Math.random() * 10,
      max: 120 + Math.random() * 40,
    });
  }
  return hours;
};

const generateSleepWeekData = () => [
  { day: 'Пн', duration: 7.2, quality: 82, deep: 1.8, rem: 2.1, light: 2.8, awake: 0.5 },
  { day: 'Вт', duration: 6.8, quality: 78, deep: 1.5, rem: 1.9, light: 3.0, awake: 0.4 },
  { day: 'Ср', duration: 7.5, quality: 85, deep: 2.0, rem: 2.3, light: 2.7, awake: 0.5 },
  { day: 'Чт', duration: 7.0, quality: 80, deep: 1.7, rem: 2.0, light: 2.9, awake: 0.4 },
  { day: 'Пт', duration: 6.5, quality: 75, deep: 1.4, rem: 1.8, light: 3.0, awake: 0.3 },
  { day: 'Сб', duration: 8.2, quality: 90, deep: 2.3, rem: 2.5, light: 2.9, awake: 0.5 },
  { day: 'Вс', duration: 7.8, quality: 88, deep: 2.1, rem: 2.4, light: 2.8, awake: 0.5 },
];

const generateNutritionData = () => ({
  daily: [
    { name: 'Завтрак', calories: 450, protein: 25, carbs: 55, fat: 12 },
    { name: 'Обед', calories: 650, protein: 45, carbs: 70, fat: 22 },
    { name: 'Ужин', calories: 550, protein: 38, carbs: 55, fat: 18 },
    { name: 'Перекусы', calories: 200, protein: 12, carbs: 25, fat: 8 },
  ],
  weekly: [
    { day: 'Пн', calories: 1850, protein: 125, carbs: 210, fat: 65 },
    { day: 'Вт', calories: 1920, protein: 130, carbs: 220, fat: 68 },
    { day: 'Ср', calories: 1780, protein: 118, carbs: 195, fat: 62 },
    { day: 'Чт', calories: 2050, protein: 140, carbs: 235, fat: 72 },
    { day: 'Пт', calories: 1950, protein: 132, carbs: 225, fat: 70 },
    { day: 'Сб', calories: 2200, protein: 145, carbs: 260, fat: 78 },
    { day: 'Вс', calories: 1900, protein: 128, carbs: 215, fat: 66 },
  ],
});

const generateActivityTypes = () => [
  { name: 'Кардио', value: 35, color: '#ef4444' },
  { name: 'Силовые', value: 30, color: '#f59e0b' },
  { name: 'Гибкость', value: 15, color: '#10b981' },
  { name: 'Баланс', value: 12, color: '#8b5cf6' },
  { name: 'Спорт', value: 8, color: '#06b6d4' },
];

const generateStressLevels = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    morning: 30 + Math.random() * 20,
    afternoon: 40 + Math.random() * 30,
    evening: 25 + Math.random() * 25,
  }));
};

const generateWaterIntake = () => {
  const hours = [];
  for (let i = 6; i <= 22; i++) {
    hours.push({
      hour: `${i}:00`,
      amount: Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 100 : 0,
      cumulative: 0,
    });
  }
  let cumulative = 0;
  return hours.map((h) => {
    cumulative += h.amount;
    h.cumulative = cumulative;
    return h;
  });
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * StatCard - Карточка статистики
 */
const StatCard = ({ title, value, change, changeType, icon, color = 'bg-stone' }) => {
  return (
    <div className="neu-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-light mb-1">{title}</p>
          <p className="text-2xl font-bold text-stone">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
              <span>{changeType === 'positive' ? '↑' : '↓'} {change}</span>
              <span className="text-ink-light ml-1">к прошлой неделе</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

/**
 * SectionHeader - Заголовок секции
 */
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-xl font-bold text-stone">{title}</h3>
      {subtitle && <p className="text-sm text-ink-light">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/**
 * ProgressBar - Прогресс бар с деталями
 */
const ProgressBar = ({ label, value, target, color = 'bg-stone', showPercent = true }) => {
  const percent = Math.min(100, Math.round((value / target) * 100));
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-stone">{label}</span>
        <span className="text-sm text-ink">
          <span className="font-bold">{value}</span>
          <span className="text-ink-light"> / {target}</span>
          {showPercent && <span className="text-ink-light ml-2">({percent}%)</span>}
        </span>
      </div>
      <div className="h-3 bg-sand rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

/**
 * MetricGrid - Сетка метрик
 */
const MetricGrid = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {metrics.map((metric, idx) => (
      <div key={idx} className="neu-card p-4 text-center">
        <div className="text-2xl mb-2">{metric.icon}</div>
        <div className="text-lg font-bold text-stone">{metric.value}</div>
        <div className="text-xs text-ink-light">{metric.label}</div>
        {metric.change && (
          <div className={`text-xs mt-1 ${metric.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </div>
        )}
      </div>
    ))}
  </div>
);

/**
 * HealthScoreBreakdown - Детализация Health Score
 */
const HealthScoreBreakdown = ({ score }) => {
  const breakdown = [
    { category: 'Физическое', score: 78, weight: 30, color: 'bg-emerald-500' },
    { category: 'Ментальное', score: 68, weight: 25, color: 'bg-violet-500' },
    { category: 'Социальное', score: 85, weight: 20, color: 'bg-amber-500' },
    { category: 'Питание', score: 72, weight: 15, color: 'bg-cyan-500' },
    { category: 'Сон', score: 75, weight: 10, color: 'bg-pink-500' },
  ];

  const weightedScore = breakdown.reduce((sum, item) => sum + (item.score * item.weight / 100), 0);

  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Детализация Health Score"
        subtitle={`Взвешенная оценка: ${Math.round(weightedScore)}`}
      />
      
      <div className="space-y-4">
        {breakdown.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`} />
                <span className="text-sm font-medium text-stone">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-stone">{item.score}</span>
                <span className="text-xs text-ink-light ml-2">(вес: {item.weight}%)</span>
              </div>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-stone/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone">Общий score</span>
          <span className="text-2xl font-bold text-stone">{Math.round(weightedScore)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * BodyCompositionChart - График композиции тела
 */
const BodyCompositionChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Композиция тела"
        subtitle="Динамика изменений"
        action={
          <Link to="/health/body" className="text-sm font-semibold text-stone hover:text-ink">
            Подробнее →
          </Link>
        }
      />
      
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#5c5243' }} domain={[70, 80]} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 70]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Вес (кг)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fat"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 4 }}
            name="Жир (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="muscle"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            name="Мышцы (%)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * SleepAnalysisChart - Анализ сна
 */
const SleepAnalysisChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Анализ сна"
        subtitle="Недельная статистика"
        action={
          <Link to="/health/sleep" className="text-sm font-semibold text-stone hover:text-ink">
            Подробнее →
          </Link>
        }
      />
      
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-stone">7.4ч</div>
            <div className="text-xs text-ink-light">Средняя</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone">83%</div>
            <div className="text-xs text-ink-light">Качество</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone">1.8ч</div>
            <div className="text-xs text-ink-light">Глубокий</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone">2.1ч</div>
            <div className="text-xs text-ink-light">REM</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 10]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Bar dataKey="deep" stackId="sleep" fill="#8b5cf6" name="Глубокий" />
          <Bar dataKey="rem" stackId="sleep" fill="#a78bfa" name="REM" />
          <Bar dataKey="light" stackId="sleep" fill="#c4b5fd" name="Лёгкий" />
          <Bar dataKey="awake" stackId="sleep" fill="#ddd6fe" name="Бодрствование" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * NutritionOverview - Обзор питания
 */
const NutritionOverview = ({ data }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Питание"
        subtitle="Баланс макронутриентов"
        action={
          <Link to="/health/nutrition" className="text-sm font-semibold text-stone hover:text-ink">
            Подробнее →
          </Link>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-semibold text-stone mb-4">Приёмы пищи</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.daily}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="calories"
              >
                {data.daily.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {data.daily.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-xs text-ink">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macros */}
        <div>
          <h4 className="text-sm font-semibold text-stone mb-4">Макронутриенты (сегодня)</h4>
          <ProgressBar label="Белки" value={142} target={180} color="bg-red-500" />
          <ProgressBar label="Жиры" value={68} target={85} color="bg-amber-500" />
          <ProgressBar label="Углеводы" value={210} target={250} color="bg-emerald-500" />
          <ProgressBar label="Клетчатка" value={22} target={30} color="bg-violet-500" />
        </div>
      </div>
    </div>
  );
};

/**
 * ActivityDistribution - Распределение активности
 */
const ActivityDistribution = ({ types }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Типы активности"
        subtitle="Распределение тренировок"
      />
      
      <div className="flex items-center">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={types}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {types.map((entry, index) => (
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

        <div className="w-1/2 space-y-3">
          {types.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-ink">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-stone">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-stone/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-stone">24</div>
            <div className="text-xs text-ink-light">Тренировки</div>
          </div>
          <div>
            <div className="text-xl font-bold text-stone">18.5ч</div>
            <div className="text-xs text-ink-light">Всего часов</div>
          </div>
          <div>
            <div className="text-xl font-bold text-stone">8,450</div>
            <div className="text-xs text-ink-light">Ккал сожжено</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * HeartRateChart - График пульса
 */
const HeartRateChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Пульс"
        subtitle="Суточная динамика"
      />
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">68</div>
          <div className="text-xs text-ink-light">Покой</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">85</div>
          <div className="text-xs text-ink-light">Средний</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">142</div>
          <div className="text-xs text-ink-light">Максимум</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">58</div>
          <div className="text-xs text-ink-light">Во сне</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#5c5243' }} interval={3} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[40, 180]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="active"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActive)"
            name="Активный"
          />
          <Line
            type="monotone"
            dataKey="resting"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Покой"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * StressLevelChart - График уровня стресса
 */
const StressLevelChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Уровень стресса"
        subtitle="Недельная динамика"
      />
      
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Bar dataKey="morning" fill="#10b981" name="Утро" radius={[4, 4, 0, 0]} />
          <Bar dataKey="afternoon" fill="#f59e0b" name="День" radius={[4, 4, 0, 0]} />
          <Bar dataKey="evening" fill="#8b5cf6" name="Вечер" radius={[4, 4, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="text-center">
          <div className="text-lg font-bold text-stone">42</div>
          <div className="text-xs text-ink-light">Средний</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">28</div>
          <div className="text-xs text-ink-light">Мин</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">68</div>
          <div className="text-xs text-ink-light">Макс</div>
        </div>
      </div>
    </div>
  );
};

/**
 * WaterIntakeChart - Потребление воды
 */
const WaterIntakeChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const target = 2500;
  const percent = Math.round((total / target) * 100);

  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Водный баланс"
        subtitle={`Выпито: ${total}мл из ${target}мл (${percent}%)`}
      />
      
      <div className="mb-4">
        <div className="h-4 bg-sand rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#5c5243' }} interval={2} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Bar dataKey="amount" fill="#06b6d4" name="За приём" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#0891b2"
            strokeWidth={3}
            dot={false}
            name="Накопительно"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * MonthlyTrendChart - Месячный тренд
 */
const MonthlyTrendChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <SectionHeader
        title="Месячный тренд"
        subtitle="Динамика показателей"
      />
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5c5243' }} />
          <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[40, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e4dfd5',
              border: '1px solid #8c7a6b',
              borderRadius: '12px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="healthScore"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            name="Health Score"
          />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 5 }}
            name="Активность"
          />
          <Line
            type="monotone"
            dataKey="nutrition"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
            name="Питание"
          />
          <Line
            type="monotone"
            dataKey="mental"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 5 }}
            name="Ментальное"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const OverviewV1 = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [monthlyData, setMonthlyData] = useState([]);
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [sleepWeekData, setSleepWeekData] = useState([]);
  const [nutritionData, setNutritionData] = useState({ daily: [], weekly: [] });
  const [activityTypes, setActivityTypes] = useState([]);
  const [stressLevels, setStressLevels] = useState([]);
  const [waterData, setWaterData] = useState([]);

  useEffect(() => {
    setMonthlyData(generateMonthlyData());
    setBodyMetrics(generateBodyMetrics());
    setHeartRateData(generateHeartRateData());
    setSleepWeekData(generateSleepWeekData());
    setNutritionData(generateNutritionData());
    setActivityTypes(generateActivityTypes());
    setStressLevels(generateStressLevels());
    setWaterData(generateWaterIntake());
  }, []);

  const overallScore = useMemo(() => {
    return Math.round(monthlyData.length > 0 
      ? monthlyData[monthlyData.length - 1].healthScore 
      : 75);
  }, [monthlyData]);

  const tabs = [
    { id: 'all', label: 'Все', icon: '📊' },
    { id: 'physical', label: 'Физическое', icon: '💪' },
    { id: 'mental', label: 'Ментальное', icon: '🧠' },
    { id: 'nutrition', label: 'Питание', icon: '🥗' },
    { id: 'sleep', label: 'Сон', icon: '😴' },
  ];

  return (
    <div className="min-h-screen bg-bone pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone/10 to-sand/20 border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone mb-2">Обзор здоровья</h1>
              <p className="text-ink-light">
                Детальная аналитика всех показателей
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/dashboard-v1"
                className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                ← Дашборд
              </Link>
              <button className="neu-button px-4 py-2 rounded-xl text-sm font-medium transition-all">
                Экспорт PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-stone text-bone shadow-md'
                    : 'bg-sand/50 text-stone hover:bg-sand'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Health Score"
            value={overallScore}
            change={8.5}
            changeType="positive"
            icon="❤️"
            color="bg-emerald-500"
          />
          <StatCard
            title="Шаги (сегодня)"
            value="8,432"
            change={12}
            changeType="positive"
            icon="👟"
            color="bg-amber-500"
          />
          <StatCard
            title="Сон"
            value="7.5ч"
            change={5}
            changeType="positive"
            icon="😴"
            color="bg-violet-500"
          />
          <StatCard
            title="Калории"
            value="1,850"
            change={3}
            changeType="negative"
            icon="🔥"
            color="bg-red-500"
          />
        </div>

        {/* Monthly Trend */}
        <div className="mb-6">
          <MonthlyTrendChart data={monthlyData} />
        </div>

        {/* Health Score Breakdown & Activity Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HealthScoreBreakdown score={overallScore} />
          <ActivityDistribution types={activityTypes} />
        </div>

        {/* Body Composition & Sleep Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BodyCompositionChart data={bodyMetrics} />
          <SleepAnalysisChart data={sleepWeekData} />
        </div>

        {/* Nutrition & Heart Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NutritionOverview data={nutritionData} />
          <HeartRateChart data={heartRateData} />
        </div>

        {/* Stress & Water */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StressLevelChart data={stressLevels} />
          <WaterIntakeChart data={waterData} />
        </div>

        {/* Quick Metrics */}
        <div className="neu-card p-6 mb-6">
          <SectionHeader
            title="Быстрые метрики"
            subtitle="Текущие показатели"
          />
          <MetricGrid
            metrics={[
              { icon: '💓', label: 'Пульс', value: '68 уд/мин', change: -2 },
              { icon: '🌡️', label: 'Температура', value: '36.6°C', change: 0 },
              { icon: '💨', label: 'Давление', value: '120/80', change: 1 },
              { icon: '🩸', label: 'Сахар', value: '5.2 ммоль/л', change: -3 },
              { icon: '🫁', label: 'SpO2', value: '98%', change: 0 },
              { icon: '⚖️', label: 'BMI', value: '23.4', change: -1 },
              { icon: '💪', label: 'Мышцы', value: '58%', change: 2 },
              { icon: '🔥', label: 'Жир', value: '18%', change: -4 },
            ]}
          />
        </div>

        {/* Recommendations */}
        <div className="neu-card p-6">
          <SectionHeader
            title="Рекомендации"
            subtitle="Персональные советы на основе ваших данных"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💧</span>
                <div>
                  <h4 className="font-semibold text-stone mb-1">Увеличьте потребление воды</h4>
                  <p className="text-sm text-ink">
                    Вы пьёте на 20% меньше нормы. Попробуйте ставить напоминания.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">😴</span>
                <div>
                  <h4 className="font-semibold text-stone mb-1">Улучшите качество сна</h4>
                  <p className="text-sm text-ink">
                    Фаза глубокого сна ниже нормы. Избегайте экранов перед сном.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🧘</span>
                <div>
                  <h4 className="font-semibold text-stone mb-1">Добавьте медитацию</h4>
                  <p className="text-sm text-ink">
                    Уровень стресса повышен. 10 минут медитации помогут снизить его.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/ai-chat"
              className="neu-button px-6 py-3 rounded-xl font-medium transition-all"
            >
              Получить AI рекомендации →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewV1;
