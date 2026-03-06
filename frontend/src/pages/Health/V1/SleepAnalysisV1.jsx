import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * SleepAnalysisV1 - Анализ сна
 * /health/sleep/analysis-v1
 * 
 * Функционал:
 * - Детальный анализ фаз сна
 * - Тренды и статистика
 * - Корреляции с активностью
 * - Рекомендации по улучшению
 * - История сна
 * - Сравнение с нормами
 */

// ============================================
// MOCK DATA
// ============================================

const generateDetailedSleepData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    depth: Math.random() * 100,
    movement: Math.random() * 50,
    heartRate: 50 + Math.random() * 30,
    isAwake: Math.random() > 0.9,
  }));
};

const generateMonthlySleepStats = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return days.map(day => ({
    day: day.toString(),
    duration: 6 + Math.random() * 3,
    quality: 60 + Math.random() * 35,
    deepSleep: 1 + Math.random() * 2,
    remSleep: 1.5 + Math.random() * 1.5,
    timesWoken: Math.floor(Math.random() * 5),
    sleepLatency: 5 + Math.random() * 30,
  }));
};

const generateSleepCorrelations = () => [
  { factor: 'Кофеин после 14:00', correlation: -0.72, impact: 'negative', icon: '☕' },
  { factor: 'Физическая активность', correlation: 0.65, impact: 'positive', icon: '🏃' },
  { factor: 'Синий свет вечером', correlation: -0.58, impact: 'negative', icon: '📱' },
  { factor: 'Температура комнаты', correlation: 0.45, impact: 'positive', icon: '🌡️' },
  { factor: 'Алкоголь вечером', correlation: -0.52, impact: 'negative', icon: '🍷' },
  { factor: 'Медитация перед сном', correlation: 0.48, impact: 'positive', icon: '🧘' },
];

const generateSleepComparison = () => ({
  user: {
    avgDuration: 7.4,
    avgQuality: 82,
    avgDeepSleep: 24,
    avgRemSleep: 22,
    avgLatency: 15,
  },
  norm: {
    avgDuration: 8,
    avgQuality: 85,
    avgDeepSleep: 25,
    avgRemSleep: 25,
    avgLatency: 15,
  },
  percentile: {
    duration: 65,
    quality: 72,
    deepSleep: 58,
    remSleep: 52,
  },
});

const generateSleepImprovementPlan = () => [
  {
    id: 1,
    priority: 'high',
    title: 'Устраните частые пробуждения',
    description: 'Вы просыпаетесь в среднем 3 раза за ночь. Проверьте комфорт спального места.',
    action: 'Проверить матрас и подушку',
    expectedImpact: '+15 к качеству',
    icon: '⚠️',
  },
  {
    id: 2,
    priority: 'medium',
    title: 'Увеличьте глубокий сон',
    description: 'Ваш глубокий сон составляет 22% от нормы 25%. Добавьте вечернюю прогулку.',
    action: 'Прогулка за 2 часа до сна',
    expectedImpact: '+8 к глубокому сну',
    icon: '💤',
  },
  {
    id: 3,
    priority: 'low',
    title: 'Оптимизируйте время засыпания',
    description: 'Вы засыпаете за 18 минут, что нормально. Можно улучшить до 10-15 минут.',
    action: 'Ритуал перед сном',
    expectedImpact: '-5 мин засыпание',
    icon: '⏱️',
  },
];

const generateHypnogramData = () => {
  const stages = ['awake', 'light', 'deep', 'rem'];
  const stageValues = { awake: 0, light: 1, deep: 2, rem: 3 };
  const data = [];
  let currentTime = 0;
  
  for (let i = 0; i < 50; i++) {
    const stage = stages[Math.floor(Math.random() * 4)];
    const duration = Math.floor(Math.random() * 20) + 10;
    
    for (let j = 0; j < duration; j++) {
      data.push({
        time: currentTime,
        stage: stageValues[stage],
        stageName: stage,
      });
      currentTime += 10; // 10 minutes intervals
    }
  }
  
  return data.slice(0, 50);
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * HypnogramChart - Гипнограмма сна
 */
const HypnogramChart = ({ data }) => {
  const stageColors = {
    awake: '#ef4444',
    light: '#3b82f6',
    deep: '#10b981',
    rem: '#8b5cf6',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-stone text-white rounded-lg shadow-lg">
          <div className="text-sm font-medium">
            {Math.floor(data.time / 60)}ч {data.time % 60}м
          </div>
          <div className="text-sm" style={{ color: stageColors[data.stageName] }}>
            {data.stageName === 'awake' ? 'Бодрствование' : 
             data.stageName === 'light' ? 'Лёгкий сон' :
             data.stageName === 'deep' ? 'Глубокий сон' : 'REM'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Гипнограмма</h3>
        <div className="flex items-center space-x-4">
          {Object.entries(stageColors).map(([key, color]) => (
            <div key={key} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-stone">
                {key === 'awake' ? 'Бодрствование' : key === 'light' ? 'Лёгкий' : key === 'deep' ? 'Глубокий' : 'REM'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#5c5243' }}
              tickFormatter={(value) => `${Math.floor(value / 60)}ч`}
            />
            <YAxis 
              hide 
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(value) => ['Б', 'Л', 'Г', 'REM'][value]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="step"
              dataKey="stage"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center text-sm text-ink-light">
        Визуализация фаз сна в течение ночи
      </div>
    </div>
  );
};

/**
 * MonthlyTrendChart - График за месяц
 */
const MonthlyTrendChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Тренд за месяц</h3>
          <p className="text-xs text-ink-light">Декабрь 2025</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-xs text-ink-light">Длительность (ч)</span>
          <div className="w-3 h-3 bg-violet-500 rounded-full ml-2" />
          <span className="text-xs text-ink-light">Качество (%)</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5c5243' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#5c5243' }} domain={[0, 12]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#5c5243' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Bar yAxisId="left" dataKey="duration" fill="#10b981" radius={[2, 2, 0, 0]} name="Длительность" />
            <Line yAxisId="right" dataKey="quality" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Качество" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">
            {(data.reduce((sum, d) => sum + d.duration, 0) / data.length).toFixed(1)}ч
          </div>
          <div className="text-xs text-ink-light">Средняя</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-violet-600">
            {(data.reduce((sum, d) => sum + d.quality, 0) / data.length).toFixed(0)}%
          </div>
          <div className="text-xs text-ink-light">Ср. качество</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">
            {data.filter(d => d.duration >= 8).length}
          </div>
          <div className="text-xs text-ink-light">Норм (8ч+)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-stone">
            {data.filter(d => d.quality >= 85).length}
          </div>
          <div className="text-xs text-ink-light">Отлично (85%+)</div>
        </div>
      </div>
    </div>
  );
};

/**
 * CorrelationAnalysis - Анализ корреляций
 */
const CorrelationAnalysis = ({ correlations }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Влияние факторов на сон</h3>
      
      <div className="space-y-4">
        {correlations.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-stone">{item.factor}</span>
              </div>
              <span className={`text-sm font-bold ${item.impact === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                {item.impact === 'positive' ? '+' : ''}{(item.correlation * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  item.impact === 'positive' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.abs(item.correlation) * 100}%`,
                  marginLeft: item.impact === 'negative' ? `${(1 - Math.abs(item.correlation)) * 100}%` : '0'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-medium text-stone">Рекомендация</div>
            <div className="text-sm text-ink-light mt-1">
              Наибольшее негативное влияние оказывает кофеин после 14:00. 
              Попробуйте перейти на декаф или травяной чай.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * NormComparison - Сравнение с нормами
 */
const NormComparison = ({ comparison }) => {
  const data = [
    { name: 'Длительность', user: comparison.user.avgDuration, norm: comparison.norm.avgDuration, unit: 'ч' },
    { name: 'Качество', user: comparison.user.avgQuality, norm: comparison.norm.avgQuality, unit: '%' },
    { name: 'Глубокий сон', user: comparison.user.avgDeepSleep, norm: comparison.norm.avgDeepSleep, unit: '%' },
    { name: 'REM сон', user: comparison.user.avgRemSleep, norm: comparison.norm.avgRemSleep, unit: '%' },
    { name: 'Засыпание', user: comparison.user.avgLatency, norm: comparison.norm.avgLatency, unit: 'мин' },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Сравнение с нормами</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.user / item.norm) * 100;
          const isBetter = index === 4 ? item.user <= item.norm : item.user >= item.norm;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-stone">{item.user}{item.unit}</span>
                  <span className="text-xs text-ink-light">норма: {item.norm}{item.unit}</span>
                  {isBetter && <span className="text-emerald-500">✓</span>}
                </div>
              </div>
              <div className="h-3 bg-sand rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isBetter ? 'bg-emerald-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Percentile Info */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-3xl font-bold text-stone mb-2">
            {Object.values(comparison.percentile).reduce((a, b) => a + b, 0) / 4 | 0}
          </div>
          <div className="text-sm text-ink-light">
            Ваш сон лучше, чем у {Object.values(comparison.percentile).reduce((a, b) => a + b, 0) / 4 | 0}% людей вашего возраста
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ImprovementPlan - План улучшения
 */
const ImprovementPlan = ({ plan }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">План улучшения сна</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          Экспорт PDF
        </button>
      </div>

      <div className="space-y-4">
        {plan.map((item) => (
          <div
            key={item.id}
            className={`p-4 border-2 rounded-xl ${getPriorityColor(item.priority)}`}
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{item.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority === 'high' ? 'Важно' : item.priority === 'medium' ? 'Средне' : 'Рекомендуется'}
                  </span>
                </div>
                <p className="text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">📋 {item.action}</span>
                  <span className="text-sm font-bold text-emerald-600">{item.expectedImpact}</span>
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
 * SleepDistribution - Распределение сна
 */
const SleepDistribution = ({ data }) => {
  const pieData = [
    { name: 'Глубокий', value: data.deepSleep, color: '#10b981' },
    { name: 'REM', value: data.remSleep, color: '#8b5cf6' },
    { name: 'Лёгкий', value: data.lightSleep, color: '#3b82f6' },
    { name: 'Бодрствование', value: data.awake, color: '#ef4444' },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Распределение фаз</h3>
      
      <div className="flex items-center space-x-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-stone">{item.name}</span>
              <span className="text-sm font-bold text-stone">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Norms Comparison */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-ink-light">Глубокий</div>
            <div className="text-sm font-bold text-emerald-600">{data.deepSleep}%</div>
            <div className="text-xs text-ink-light">норма: 20-25%</div>
          </div>
          <div>
            <div className="text-xs text-ink-light">REM</div>
            <div className="text-sm font-bold text-violet-600">{data.remSleep}%</div>
            <div className="text-xs text-ink-light">норма: 20-25%</div>
          </div>
          <div>
            <div className="text-xs text-ink-light">Лёгкий</div>
            <div className="text-sm font-bold text-blue-600">{data.lightSleep}%</div>
            <div className="text-xs text-ink-light">норма: 45-55%</div>
          </div>
          <div>
            <div className="text-xs text-ink-light">Бодрствование</div>
            <div className="text-sm font-bold text-red-600">{data.awake}%</div>
            <div className="text-xs text-ink-light">норма: &lt;5%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SleepAnalysisV1 = () => {
  const [detailedData] = useState(generateDetailedSleepData());
  const [monthlyStats] = useState(generateMonthlySleepStats());
  const [correlations] = useState(generateSleepCorrelations());
  const [comparison] = useState(generateSleepComparison());
  const [improvementPlan] = useState(generateSleepImprovementPlan());
  const [hypnogramData] = useState(generateHypnogramData());

  const sleepDistribution = {
    deepSleep: 24,
    remSleep: 22,
    lightSleep: 48,
    awake: 6,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Анализ сна</h1>
                <p className="text-ink-light">Детальная аналитика и рекомендации</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/sleep-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              📤 Экспорт отчёта
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HypnogramChart data={hypnogramData} />
          <SleepDistribution data={sleepDistribution} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyTrendChart data={monthlyStats} />
          <CorrelationAnalysis correlations={correlations} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NormComparison comparison={comparison} />
          <ImprovementPlan plan={improvementPlan} />
        </div>

        {/* Detailed Data Table */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-6">Детальная статистика</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-stone">Показатель</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-stone">Среднее</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-stone">Мин</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-stone">Макс</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-stone">Норма</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-stone">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone/10">
                  <td className="py-3 px-4 text-stone">Продолжительность</td>
                  <td className="text-center py-3 px-4 text-stone">7.4 ч</td>
                  <td className="text-center py-3 px-4 text-stone">5.8 ч</td>
                  <td className="text-center py-3 px-4 text-stone">9.2 ч</td>
                  <td className="text-center py-3 px-4 text-stone">7-9 ч</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">✓</span></td>
                </tr>
                <tr className="border-b border-stone/10">
                  <td className="py-3 px-4 text-stone">Качество сна</td>
                  <td className="text-center py-3 px-4 text-stone">82%</td>
                  <td className="text-center py-3 px-4 text-stone">65%</td>
                  <td className="text-center py-3 px-4 text-stone">95%</td>
                  <td className="text-center py-3 px-4 text-stone">&gt;85%</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">~</span></td>
                </tr>
                <tr className="border-b border-stone/10">
                  <td className="py-3 px-4 text-stone">Глубокий сон</td>
                  <td className="text-center py-3 px-4 text-stone">24%</td>
                  <td className="text-center py-3 px-4 text-stone">18%</td>
                  <td className="text-center py-3 px-4 text-stone">32%</td>
                  <td className="text-center py-3 px-4 text-stone">20-25%</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">✓</span></td>
                </tr>
                <tr className="border-b border-stone/10">
                  <td className="py-3 px-4 text-stone">REM сон</td>
                  <td className="text-center py-3 px-4 text-stone">22%</td>
                  <td className="text-center py-3 px-4 text-stone">15%</td>
                  <td className="text-center py-3 px-4 text-stone">28%</td>
                  <td className="text-center py-3 px-4 text-stone">20-25%</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">~</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-stone">Время засыпания</td>
                  <td className="text-center py-3 px-4 text-stone">15 мин</td>
                  <td className="text-center py-3 px-4 text-stone">5 мин</td>
                  <td className="text-center py-3 px-4 text-stone">45 мин</td>
                  <td className="text-center py-3 px-4 text-stone">&lt;20 мин</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepAnalysisV1;
