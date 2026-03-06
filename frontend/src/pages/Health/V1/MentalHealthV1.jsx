import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Legend
} from 'recharts';

/**
 * MentalHealthV1 - Главная страница модуля Ментальное здоровье
 * /health/mental-v1
 * 
 * Функционал:
 * - Mood check-in
 * - Stress level
 * - Anxiety level
 * - Energy level
 * - Journal entry
 * - Meditation timer
 * - Breathing exercises
 * - Mood calendar
 */

// ============================================
// MOCK DATA
// ============================================

const generateCurrentMood = () => ({
  overall: 7,
  stress: 4,
  anxiety: 3,
  energy: 6,
  focus: 7,
  happiness: 8,
  lastCheckIn: '08:30',
  streak: 12,
});

const generateMoodHistory = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day, index) => ({
    day,
    mood: [6, 7, 5, 8, 7, 9, 7][index],
    stress: [5, 4, 6, 3, 4, 2, 4][index],
    anxiety: [4, 3, 5, 2, 3, 2, 3][index],
    energy: [5, 6, 4, 7, 6, 8, 6][index],
  }));
};

const generateMoodCalendar = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return days.map(day => ({
    day,
    mood: Math.floor(3 + Math.random() * 7),
    hasJournal: Math.random() > 0.5,
    hasMeditation: Math.random() > 0.6,
  }));
};

const generateMeditationSessions = () => [
  { id: 1, name: 'Утренняя осознанность', duration: 10, level: 'beginner', icon: '🌅' },
  { id: 2, name: 'Снижение стресса', duration: 15, level: 'intermediate', icon: '🧘' },
  { id: 3, name: 'Глубокая релаксация', duration: 20, level: 'advanced', icon: '🌙' },
  { id: 4, name: 'Фокус и концентрация', duration: 12, level: 'intermediate', icon: '🎯' },
  { id: 5, name: 'Любящая доброта', duration: 15, level: 'beginner', icon: '❤️' },
  { id: 6, name: 'Сканирование тела', duration: 25, level: 'advanced', icon: '🔍' },
];

const generateBreathingExercises = () => [
  { 
    id: 1, 
    name: '4-7-8 Дыхание', 
    description: 'Расслабление и сон', 
    duration: 60, 
    icon: '😴',
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ['Снижение тревоги', 'Улучшение сна', 'Расслабление'],
  },
  { 
    id: 2, 
    name: 'Квадратное дыхание', 
    description: 'Фокус и концентрация', 
    duration: 120, 
    icon: '🎯',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
    benefits: ['Улучшение фокуса', 'Снижение стресса', 'Баланс'],
  },
  { 
    id: 3, 
    name: 'Энергизирующее', 
    description: 'Повышение энергии', 
    duration: 90, 
    icon: '⚡',
    pattern: { inhale: 6, hold: 2, exhale: 4 },
    benefits: ['Повышение энергии', 'Ясность ума', 'Бодрость'],
  },
  { 
    id: 4, 
    name: 'Когерентное дыхание', 
    description: 'Баланс нервной системы', 
    duration: 300, 
    icon: '💓',
    pattern: { inhale: 5, hold: 0, exhale: 5 },
    benefits: ['Баланс нервной системы', 'Снижение давления', 'Гармония'],
  },
];

const generateJournalPrompts = () => [
  { id: 1, prompt: 'За что я благодарен сегодня?', category: 'gratitude', icon: '🙏' },
  { id: 2, prompt: 'Что вызвало у меня стресс сегодня?', category: 'reflection', icon: '🤔' },
  { id: 3, prompt: 'Какие три хорошие вещи произошли?', category: 'positivity', icon: '✨' },
  { id: 4, prompt: 'Что я могу сделать для себя завтра?', category: 'selfcare', icon: '💆' },
  { id: 5, prompt: 'Какие эмоции я испытывал сегодня?', category: 'emotions', icon: '💭' },
];

const generateWeeklyInsights = () => [
  {
    id: 1,
    type: 'positive',
    title: 'Отличный прогресс!',
    description: 'Ваше настроение улучшилось на 15% на этой неделе',
    icon: '🎉',
  },
  {
    id: 2,
    type: 'insight',
    title: 'Замечена закономерность',
    description: 'По выходным ваш уровень стресса значительно ниже',
    icon: '💡',
  },
  {
    id: 3,
    type: 'recommendation',
    title: 'Рекомендация',
    description: 'Попробуйте медитацию перед сном для улучшения качества отдыха',
    icon: '🧘',
  },
];

const MOOD_LEVELS = [
  { value: 1, label: 'Ужасно', emoji: '😫', color: '#ef4444' },
  { value: 2, label: 'Плохо', emoji: '😞', color: '#f97316' },
  { value: 3, label: 'Не очень', emoji: '😕', color: '#f59e0b' },
  { value: 4, label: 'Нормально', emoji: '😐', color: '#eab308' },
  { value: 5, label: 'Хорошо', emoji: '🙂', color: '#84cc16' },
  { value: 6, label: 'Очень хорошо', emoji: '😊', color: '#22c55e' },
  { value: 7, label: 'Отлично', emoji: '😄', color: '#10b981' },
  { value: 8, label: 'Превосходно', emoji: '🤩', color: '#06b6d4' },
  { value: 9, label: 'Великолепно', emoji: '🌟', color: '#8b5cf6' },
  { value: 10, label: 'Лучше не бывает', emoji: '🏆', color: '#ec4899' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * MoodCheckIn - Проверка настроения
 */
const MoodCheckIn = ({ currentMood, onCheckIn }) => {
  const [selectedMood, setSelectedMood] = useState(currentMood.overall);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Как вы себя чувствуете?</h3>
          <p className="text-xs text-ink-light">Последняя проверка: {currentMood.lastCheckIn}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-sm font-bold text-stone">{currentMood.streak} дней</span>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {MOOD_LEVELS.slice(0, 10).map((level) => (
          <button
            key={level.value}
            onClick={() => setSelectedMood(level.value)}
            className={`p-3 rounded-xl transition-all ${
              selectedMood === level.value
                ? 'bg-stone text-white scale-110 shadow-lg'
                : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-1">{level.emoji}</div>
            <div className="text-xs font-medium">{level.value}</div>
          </button>
        ))}
      </div>

      {/* Selected Mood Info */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-stone">
          {MOOD_LEVELS[selectedMood - 1]?.label}
        </div>
      </div>

      {/* Quick Factors */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-3">Что влияет на ваше настроение?</label>
        <div className="flex flex-wrap gap-2">
          {['Сон', 'Питание', 'Тренировка', 'Работа', 'Отношения', 'Погода'].map((factor) => (
            <label key={factor} className="inline-flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-stone text-stone focus:ring-stone" />
              <span className="text-sm text-stone">{factor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-2">Заметки (опционально)</label>
        <textarea
          className="neu-input w-full"
          rows="2"
          placeholder="Что вы чувствуете?"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => onCheckIn?.({ mood: selectedMood })}
          className="neu-button flex-1 py-3"
        >
          Сохранить
        </button>
        <button className="neu-button-secondary flex-1 py-3">
          Пропустить
        </button>
      </div>
    </div>
  );
};

/**
 * StressAnxietyEnergy - Виджеты стресса, тревоги и энергии
 */
const StressAnxietyEnergy = ({ currentMood }) => {
  const metrics = [
    { 
      key: 'stress', 
      label: 'Стресс', 
      value: currentMood.stress, 
      icon: '😰',
      color: '#ef4444',
      reverse: true,
    },
    { 
      key: 'anxiety', 
      label: 'Тревога', 
      value: currentMood.anxiety, 
      icon: '😟',
      color: '#f59e0b',
      reverse: true,
    },
    { 
      key: 'energy', 
      label: 'Энергия', 
      value: currentMood.energy, 
      icon: '⚡',
      color: '#10b981',
      reverse: false,
    },
    { 
      key: 'focus', 
      label: 'Фокус', 
      value: currentMood.focus, 
      icon: '🎯',
      color: '#8b5cf6',
      reverse: false,
    },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Состояние</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{metric.icon}</span>
                <span className="font-medium text-stone">{metric.label}</span>
              </div>
              <span className="text-lg font-bold" style={{ color: metric.color }}>
                {metric.value}/10
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: metric.color,
                  width: `${(metric.value / 10) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-medium text-stone">Совет</div>
            <div className="text-sm text-ink-light mt-1">
              Ваш уровень стресса выше среднего. Попробуйте 5-минутную дыхательную практику.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MoodCalendar - Календарь настроения
 */
const MoodCalendar = ({ data }) => {
  const getMoodColor = (mood) => {
    if (mood >= 8) return 'bg-emerald-500';
    if (mood >= 6) return 'bg-emerald-300';
    if (mood >= 4) return 'bg-amber-400';
    if (mood >= 2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 8) return '🤩';
    if (mood >= 6) return '😊';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😞';
    return '😫';
  };

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Календарь настроения</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-sand">←</button>
          <span className="font-medium text-stone">Март 2026</span>
          <button className="p-2 rounded-lg hover:bg-sand">→</button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-ink-light py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${getMoodColor(day.mood)} ${!day ? 'bg-transparent' : ''}`}
            >
              {day && (
                <>
                  <span className="text-white text-lg">{getMoodEmoji(day.mood)}</span>
                  <span className="text-white font-medium">{day.day}</span>
                  {day.hasJournal && <span className="text-white/70 text-xs">📝</span>}
                </>
              )}
            </div>
          ))
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-stone/10">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-xs text-ink-light">Отлично</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-amber-400" />
          <span className="text-xs text-ink-light">Нормально</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span className="text-xs text-ink-light">Плохо</span>
        </div>
      </div>
    </div>
  );
};

/**
 * MeditationTimer - Таймер медитации
 */
const MeditationTimer = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessions[0].duration * 60);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    setTimeLeft(selectedSession.duration * 60);
  }, [selectedSession]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedSession.duration * 60 - timeLeft) / (selectedSession.duration * 60)) * 100;

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Медитация</h3>
        <Link to="/meditation" className="text-sm font-medium text-stone hover:text-ink">
          Все сессии →
        </Link>
      </div>

      {/* Session Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => {
              setSelectedSession(session);
              setIsRunning(false);
            }}
            className={`p-3 rounded-xl transition-all ${
              selectedSession.id === session.id
                ? 'bg-stone text-white'
                : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-1">{session.icon}</div>
            <div className="text-xs font-medium">{session.duration} мин</div>
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle cx="100" cy="100" r="80" stroke="#dcd3c6" strokeWidth="8" fill="none" />
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-stone font-mono">{formatTime(timeLeft)}</span>
            <span className="text-sm text-ink-light mt-2">{selectedSession.name}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => {
            setTimeLeft(selectedSession.duration * 60);
            setIsRunning(false);
          }}
          className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-xl"
        >
          🔄
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-16 h-16 rounded-full bg-stone text-white flex items-center justify-center text-2xl"
        >
          {isRunning ? '⏸️' : '▶️'}
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-xl"
        >
          ⏹️
        </button>
      </div>
    </div>
  );
};

/**
 * BreathingExercises - Дыхательные упражнения
 */
const BreathingExercises = ({ exercises }) => {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [phaseTime, setPhaseTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const pattern = selectedExercise.pattern;
          
          if (phase === 'idle' || phase === 'inhale') {
            if (phaseTime < pattern.inhale) {
              setPhase('inhale');
              return prev + 1;
            } else if (pattern.hold) {
              setPhase('hold');
              return 0;
            } else {
              setPhase('exhale');
              return 0;
            }
          } else if (phase === 'hold') {
            if (phaseTime < pattern.hold) {
              return prev + 1;
            } else {
              setPhase('exhale');
              return 0;
            }
          } else if (phase === 'exhale') {
            if (phaseTime < pattern.exhale) {
              return prev + 1;
            } else {
              setPhase('inhale');
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, phase, phaseTime, selectedExercise]);

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Вдох 🌬️';
      case 'hold': return 'Задержка ⏸️';
      case 'exhale': return 'Выдох 💨';
      default: return 'Готовы?';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-emerald-500';
      case 'hold': return 'bg-amber-500';
      case 'exhale': return 'bg-blue-500';
      default: return 'bg-stone';
    }
  };

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Дыхание</h3>
        <span className="text-sm text-ink-light">{exercises.length} упражнений</span>
      </div>

      {/* Exercise Selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise);
              setIsRunning(false);
              setPhase('idle');
              setPhaseTime(0);
            }}
            className={`p-4 rounded-xl transition-all text-left ${
              selectedExercise.id === exercise.id
                ? 'bg-stone text-white'
                : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <div className="text-2xl mb-2">{exercise.icon}</div>
            <div className="font-medium text-sm">{exercise.name}</div>
            <div className="text-xs opacity-70">{exercise.duration} сек</div>
          </button>
        ))}
      </div>

      {/* Breathing Visualizer */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full transition-all duration-1000 ${getPhaseColor()} flex items-center justify-center`}
            style={{
              transform: phase === 'inhale' ? 'scale(1.2)' : phase === 'exhale' ? 'scale(0.8)' : 'scale(1)',
            }}
          >
            <span className="text-white text-xl font-bold">{getPhaseInstruction()}</span>
          </div>
        </div>
      </div>

      {/* Pattern Info */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-center">
          <div className="text-xs text-ink-light">Вдох</div>
          <div className="font-bold text-stone">{selectedExercise.pattern.inhale}с</div>
        </div>
        {selectedExercise.pattern.hold && (
          <div className="text-center">
            <div className="text-xs text-ink-light">Задержка</div>
            <div className="font-bold text-stone">{selectedExercise.pattern.hold}с</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-xs text-ink-light">Выдох</div>
          <div className="font-bold text-stone">{selectedExercise.pattern.exhale}с</div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="w-full neu-button py-3"
      >
        {isRunning ? 'Пауза' : 'Начать упражнение'}
      </button>
    </div>
  );
};

/**
 * JournalWidget - Виджет дневника
 */
const JournalWidget = ({ prompts, onWrite }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📔</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Дневник</h3>
            <p className="text-xs text-ink-light">Рефлексия и благодарность</p>
          </div>
        </div>
        <Link to="/journal" className="text-sm font-medium text-stone hover:text-ink">
          Все записи →
        </Link>
      </div>

      {/* Today's Prompt */}
      <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl mb-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{prompts[0].icon}</span>
          <div>
            <div className="text-xs text-violet-600 font-medium mb-1">Вопрос дня</div>
            <div className="font-medium text-stone">{prompts[0].prompt}</div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-2">
        {prompts.slice(1).map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onWrite?.(prompt)}
            className="w-full flex items-center justify-between p-3 bg-sand/50 rounded-xl hover:bg-sand transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{prompt.icon}</span>
              <span className="text-sm font-medium text-stone">{prompt.prompt}</span>
            </div>
            <span className="text-stone">→</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onWrite?.({ prompt: 'Свободное письмо', category: 'free' })}
        className="mt-4 w-full neu-button-secondary py-3 rounded-xl font-medium"
      >
        ✍️ Свободное письмо
      </button>
    </div>
  );
};

/**
 * WeeklyInsights - Недельные инсайты
 */
const WeeklyInsights = ({ insights }) => {
  const getTypeStyles = (type) => {
    const styles = {
      positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🎉' },
      insight: { bg: 'bg-violet-50', border: 'border-violet-200', icon: '💡' },
      recommendation: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🧘' },
    };
    return styles[type] || styles.insight;
  };

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Инсайты недели</h3>
      
      <div className="space-y-4">
        {insights.map((insight) => {
          const styles = getTypeStyles(insight.type);
          return (
            <div
              key={insight.id}
              className={`p-4 ${styles.bg} ${styles.border} border-2 rounded-xl`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h4 className="font-bold text-stone mb-1">{insight.title}</h4>
                  <p className="text-sm text-ink">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MentalHealthV1 = () => {
  const [currentMood] = useState(generateCurrentMood());
  const [moodHistory] = useState(generateMoodHistory());
  const [moodCalendar] = useState(generateMoodCalendar());
  const [meditationSessions] = useState(generateMeditationSessions());
  const [breathingExercises] = useState(generateBreathingExercises());
  const [journalPrompts] = useState(generateJournalPrompts());
  const [weeklyInsights] = useState(generateWeeklyInsights());

  const handleMoodCheckIn = (data) => {
    console.log('Mood check-in:', data);
    // Здесь будет логика сохранения
  };

  const handleJournalWrite = (prompt) => {
    console.log('Journal prompt:', prompt);
    // Здесь будет логика открытия дневника
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">🧠</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Ментальное здоровье</h1>
                <p className="text-ink-light">Забота о вашем психологическом состоянии</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/mental/mood-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Трекер
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              Проверка 📝
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <MoodCheckIn currentMood={currentMood} onCheckIn={handleMoodCheckIn} />
          <StressAnxietyEnergy currentMood={currentMood} />
          <WeeklyInsights insights={weeklyInsights} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MoodCalendar data={moodCalendar} />
          <MeditationTimer sessions={meditationSessions} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BreathingExercises exercises={breathingExercises} />
          <JournalWidget prompts={journalPrompts} onWrite={handleJournalWrite} />
          
          {/* Mood Trend Chart */}
          <div className="neu-card p-6">
            <h3 className="text-xl font-bold text-stone mb-6">Тренд настроения</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodHistory}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#5c5243' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#moodGradient)"
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
              to="/health/mental/mood-v1"
              className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Трекер настроения</div>
            </Link>
            <button className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🧘</div>
              <div className="font-medium">Медитации</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📔</div>
              <div className="font-medium">Дневник</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium">Дыхание</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthV1;
