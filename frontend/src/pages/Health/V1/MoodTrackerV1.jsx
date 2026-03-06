import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * MoodTrackerV1 - Трекер настроения
 * /health/mental/mood-v1
 * 
 * Функционал:
 * - Детальный трекер настроения
 * - История и паттерны
 * - Факторы влияния
 * - Корреляции
 * - Экспорт данных
 */

// ============================================
// MOCK DATA
// ============================================

const generateMoodEntries = () => {
  const entries = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    entries.push({
      id: i + 1,
      date: date.toISOString().split('T')[0],
      time: `${8 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      mood: Math.floor(3 + Math.random() * 7),
      stress: Math.floor(2 + Math.random() * 7),
      anxiety: Math.floor(1 + Math.random() * 6),
      energy: Math.floor(3 + Math.random() * 7),
      focus: Math.floor(4 + Math.random() * 6),
      happiness: Math.floor(4 + Math.random() * 6),
      factors: ['Сон', 'Питание', 'Тренировка', 'Работа', 'Отношения'].slice(0, Math.floor(1 + Math.random() * 3)),
      note: Math.random() > 0.5 ? 'Чувствую себя хорошо сегодня' : '',
      weather: ['Солнечно', 'Облачно', 'Дождь', 'Ясно'][Math.floor(Math.random() * 4)],
    });
  }
  
  return entries;
};

const generateMoodPatterns = () => ({
  byDayOfWeek: [
    { day: 'Пн', avgMood: 6.2, avgStress: 5.1, entries: 24 },
    { day: 'Вт', avgMood: 6.5, avgStress: 4.8, entries: 26 },
    { day: 'Ср', avgMood: 6.8, avgStress: 4.5, entries: 28 },
    { day: 'Чт', avgMood: 6.4, avgStress: 5.0, entries: 25 },
    { day: 'Пт', avgMood: 7.2, avgStress: 4.2, entries: 30 },
    { day: 'Сб', avgMood: 8.1, avgStress: 2.8, entries: 28 },
    { day: 'Вс', avgMood: 7.8, avgStress: 3.2, entries: 26 },
  ],
  byTimeOfDay: [
    { time: 'Утро (6-12)', avgMood: 7.2, avgEnergy: 7.5 },
    { time: 'День (12-18)', avgMood: 6.8, avgEnergy: 6.2 },
    { time: 'Вечер (18-24)', avgMood: 6.5, avgEnergy: 5.0 },
    { time: 'Ночь (0-6)', avgMood: 5.8, avgEnergy: 3.5 },
  ],
});

const generateFactorCorrelations = () => [
  { factor: 'Качество сна', correlation: 0.72, icon: '😴', color: '#8b5cf6' },
  { factor: 'Физическая активность', correlation: 0.65, icon: '🏃', color: '#10b981' },
  { factor: 'Социальные взаимодействия', correlation: 0.58, icon: '👥', color: '#3b82f6' },
  { factor: 'Питание', correlation: 0.45, icon: '🥗', color: '#22c55e' },
  { factor: 'Рабочая нагрузка', correlation: -0.52, icon: '💼', color: '#ef4444' },
  { factor: 'Время на экране', correlation: -0.38, icon: '📱', color: '#f59e0b' },
  { factor: 'Медитация', correlation: 0.42, icon: '🧘', color: '#ec4899' },
  { factor: 'Погода', correlation: 0.28, icon: '🌤️', color: '#06b6d4' },
];

const generateMoodDistribution = () => [
  { name: 'Отлично (8-10)', value: 18, color: '#10b981' },
  { name: 'Хорошо (6-7)', value: 35, color: '#84cc16' },
  { name: 'Нормально (4-5)', value: 32, color: '#f59e0b' },
  { name: 'Плохо (2-3)', value: 12, color: '#f97316' },
  { name: 'Ужасно (1)', value: 3, color: '#ef4444' },
];

const generateWeeklyComparison = () => {
  const weeks = ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'];
  return weeks.map((week, index) => ({
    week,
    mood: 6.2 + Math.random() * 1.5,
    stress: 5.5 - Math.random() * 2,
    energy: 5.8 + Math.random() * 2,
  }));
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * MoodEntryForm - Форма добавления записи
 */
const MoodEntryForm = ({ onSubmit }) => {
  const [mood, setMood] = useState(5);
  const [factors, setFactors] = useState([]);
  const [note, setNote] = useState('');

  const moodEmojis = ['😫', '😞', '😕', '😐', '🙂', '😊', '😄', '🤩', '🌟', '🏆'];

  const allFactors = [
    { id: 'sleep', label: 'Сон', icon: '😴' },
    { id: 'nutrition', label: 'Питание', icon: '🥗' },
    { id: 'exercise', label: 'Тренировка', icon: '🏃' },
    { id: 'work', label: 'Работа', icon: '💼' },
    { id: 'social', label: 'Отношения', icon: '👥' },
    { id: 'weather', label: 'Погода', icon: '🌤️' },
    { id: 'meditation', label: 'Медитация', icon: '🧘' },
    { id: 'health', label: 'Здоровье', icon: '💊' },
  ];

  const toggleFactor = (factorId) => {
    setFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      mood,
      factors,
      note,
      timestamp: new Date().toISOString(),
    });
    setMood(5);
    setFactors([]);
    setNote('');
  };

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Новая запись</h3>

      {/* Mood Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-3">Настроение</label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              key={level}
              onClick={() => setMood(level)}
              className={`p-3 rounded-xl transition-all ${
                mood === level
                  ? 'bg-stone text-white scale-110'
                  : 'bg-sand/50 hover:bg-sand'
              }`}
            >
              <div className="text-2xl">{moodEmojis[level - 1]}</div>
              <div className="text-xs font-medium">{level}</div>
            </button>
          ))}
        </div>
        <div className="text-center mt-3 text-lg font-bold text-stone">
          {moodEmojis[mood - 1]} {['Ужасно', 'Плохо', 'Не очень', 'Нормально', 'Хорошо', 'Очень хорошо', 'Отлично', 'Превосходно', 'Великолепно', 'Лучше не бывает'][mood - 1]}
        </div>
      </div>

      {/* Factors */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-3">Факторы влияния</label>
        <div className="flex flex-wrap gap-2">
          {allFactors.map((factor) => (
            <button
              key={factor.id}
              onClick={() => toggleFactor(factor.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                factors.includes(factor.id)
                  ? 'bg-stone text-white'
                  : 'bg-sand/50 text-stone hover:bg-sand'
              }`}
            >
              {factor.icon} {factor.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-2">Заметки</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="neu-input w-full"
          rows="3"
          placeholder="Что вы чувствуете? Что повлияло на ваше настроение?"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-stone mb-2">Стресс (1-10)</label>
          <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone mb-2">Энергия (1-10)</label>
          <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone mb-2">Тревога (1-10)</label>
          <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} className="w-full neu-button py-3">
        Сохранить запись
      </button>
    </div>
  );
};

/**
 * MoodHistoryChart - График истории настроения
 */
const MoodHistoryChart = ({ entries }) => {
  const chartData = entries.slice(0, 14).reverse().map(entry => ({
    date: entry.date.split('-').slice(1).join('/'),
    mood: entry.mood,
    stress: entry.stress,
    energy: entry.energy,
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">История настроения</h3>
          <p className="text-xs text-ink-light">Последние 14 дней</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-xs text-ink-light">Настроение</span>
          <div className="w-3 h-3 bg-red-500 rounded-full ml-2" />
          <span className="text-xs text-ink-light">Стресс</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5c5243' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#5c5243' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="mood" fill="#10b981" radius={[4, 4, 0, 0]} name="Настроение" />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} name="Стресс" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * FactorCorrelations - Корреляции факторов
 */
const FactorCorrelations = ({ correlations }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Влияние факторов</h3>
      
      <div className="space-y-4">
        {correlations.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-stone">{item.factor}</span>
              </div>
              <span className={`text-sm font-bold ${item.correlation > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {item.correlation > 0 ? '+' : ''}{(item.correlation * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.correlation > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ 
                  width: `${Math.abs(item.correlation) * 100}%`,
                  marginLeft: item.correlation < 0 ? `${(1 - Math.abs(item.correlation)) * 100}%` : '0'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-medium text-stone">Главный инсайт</div>
            <div className="text-sm text-ink-light mt-1">
              Качество сна имеет наибольшее положительное влияние на ваше настроение. 
              Увеличение продолжительности сна на 1 час может повысить настроение на 12%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MoodDistribution - Распределение настроения
 */
const MoodDistribution = ({ distribution }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Распределение</h3>
      
      <div className="flex items-center space-x-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {distribution.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-stone">{item.name}</span>
              <span className="text-sm font-bold text-stone">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {(distribution[0].value + distribution[1].value)}%
          </div>
          <div className="text-xs text-ink-light">Хороших дней</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">
            {distribution[2].value}%
          </div>
          <div className="text-xs text-ink-light">Нормальных</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {(distribution[3].value + distribution[4].value)}%
          </div>
          <div className="text-xs text-ink-light">Плохих дней</div>
        </div>
      </div>
    </div>
  );
};

/**
 * DayOfWeekPattern - Паттерн по дням недели
 */
const DayOfWeekPattern = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">По дням недели</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#5c5243' }} />
            <Tooltip />
            <Bar dataKey="avgMood" fill="#10b981" radius={[4, 4, 0, 0]} name="Настроение" />
            <Bar dataKey="avgStress" fill="#ef4444" radius={[4, 4, 0, 0]} name="Стресс" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-stone/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-light">Лучший день:</span>
          <span className="font-bold text-emerald-600">Суббота ({data[5].avgMood})</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-ink-light">Самый стрессовый:</span>
          <span className="font-bold text-red-600">Понедельник ({data[0].avgStress})</span>
        </div>
      </div>
    </div>
  );
};

/**
 * RecentEntries - Последние записи
 */
const RecentEntries = ({ entries }) => {
  const getMoodEmoji = (mood) => {
    const emojis = ['😫', '😞', '😕', '😐', '🙂', '😊', '😄', '🤩', '🌟', '🏆'];
    return emojis[mood - 1] || '😐';
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Последние записи</h3>
        <Link to="/health/mental/mood-v1/history" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
              <div>
                <div className="font-medium text-stone">
                  {new Date(entry.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </div>
                <div className="text-xs text-ink-light">
                  {entry.factors.map(f => f).join(', ')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-stone">{entry.mood}/10</div>
              <div className="text-xs text-ink-light">{entry.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * WeeklyComparison - Сравнение недель
 */
const WeeklyComparison = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Сравнение недель</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#5c5243' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#5c5243' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="mood" fill="#10b981" radius={[4, 4, 0, 0]} name="Настроение" />
            <Bar dataKey="energy" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Энергия" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend */}
      <div className="mt-4 pt-4 border-t border-stone/10">
        <div className="flex items-center space-x-2">
          <span className="text-emerald-500">📈</span>
          <span className="text-sm text-stone">
            Среднее настроение улучшилось на <span className="font-bold text-emerald-600">+0.8</span> за месяц
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MoodTrackerV1 = () => {
  const [entries] = useState(generateMoodEntries());
  const [patterns] = useState(generateMoodPatterns());
  const [correlations] = useState(generateFactorCorrelations());
  const [distribution] = useState(generateMoodDistribution());
  const [weeklyComparison] = useState(generateWeeklyComparison());

  const handleNewEntry = (data) => {
    console.log('New mood entry:', data);
    // Здесь будет логика сохранения
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
                <h1 className="text-3xl font-bold text-stone">Трекер настроения</h1>
                <p className="text-ink-light">Отслеживайте и анализируйте своё настроение</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/mental-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              📤 Экспорт
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <MoodEntryForm onSubmit={handleNewEntry} />
            <RecentEntries entries={entries} />
          </div>

          {/* Right Column - Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <MoodHistoryChart entries={entries} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodDistribution distribution={distribution} />
              <FactorCorrelations correlations={correlations} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DayOfWeekPattern data={patterns.byDayOfWeek} />
              <WeeklyComparison data={weeklyComparison} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerV1;
