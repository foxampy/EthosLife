import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

/**
 * MedicationsV1 - Лекарства
 * /health/medical/meds-v1
 * 
 * Функционал:
 * - Current medications list
 * - Dosage and frequency
 * - Next dose timer
 * - Medication schedule (weekly)
 * - Refill reminders
 * - Side effects tracker
 */

// ============================================
// MOCK DATA
// ============================================

const generateMedications = () => [
  {
    id: 1,
    name: 'Лизиноприл',
    dosage: '10 мг',
    frequency: '1 раз в день',
    timing: 'morning',
    time: '08:00',
    purpose: 'Снижение давления',
    doctor: 'Др. Иванов А.С.',
    startDate: '2024-03-15',
    endDate: null,
    instructions: 'Принимать утром натощак',
    sideEffects: ['Сухой кашель', 'Головокружение'],
    interactions: ['НПВС', 'Калийсберегающие диуретики'],
    stock: 25,
    refillThreshold: 10,
    icon: '💊',
    color: '#10b981',
    adherence: 95,
  },
  {
    id: 2,
    name: 'Витамин D3',
    dosage: '2000 МЕ',
    frequency: '1 раз в день',
    timing: 'morning',
    time: '08:00',
    purpose: 'Поддержка иммунитета',
    doctor: 'Самоназначение',
    startDate: '2025-10-01',
    endDate: '2026-03-31',
    instructions: 'Принимать с пищей',
    sideEffects: [],
    interactions: [],
    stock: 45,
    refillThreshold: 15,
    icon: '☀️',
    color: '#f59e0b',
    adherence: 88,
  },
  {
    id: 3,
    name: 'Омега-3',
    dosage: '1000 мг',
    frequency: '2 раза в день',
    timing: 'evening',
    time: '20:00',
    purpose: 'Здоровье сердца',
    doctor: 'Самоназначение',
    startDate: '2025-01-01',
    endDate: null,
    instructions: 'Принимать с едой',
    sideEffects: [],
    interactions: ['Антикоагулянты'],
    stock: 12,
    refillThreshold: 15,
    icon: '🐟',
    color: '#3b82f6',
    adherence: 82,
  },
  {
    id: 4,
    name: 'Магний B6',
    dosage: '400 мг',
    frequency: '1 раз в день',
    timing: 'evening',
    time: '21:00',
    purpose: 'Снижение стресса',
    doctor: 'Др. Петрова Е.В.',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    instructions: 'Принимать вечером',
    sideEffects: [],
    interactions: [],
    stock: 35,
    refillThreshold: 10,
    icon: '💪',
    color: '#8b5cf6',
    adherence: 91,
  },
  {
    id: 5,
    name: 'Цетиризин',
    dosage: '10 мг',
    frequency: 'По необходимости',
    timing: 'as_needed',
    time: null,
    purpose: 'Аллергия',
    doctor: 'Др. Петрова Е.В.',
    startDate: '2020-05-20',
    endDate: null,
    instructions: 'Принимать при симптомах аллергии',
    sideEffects: ['Сонливость'],
    interactions: ['Алкоголь'],
    stock: 8,
    refillThreshold: 5,
    icon: '🤧',
    color: '#ec4899',
    adherence: 70,
  },
];

const generateWeeklySchedule = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const medications = generateMedications();
  
  return days.map(day => ({
    day,
    morning: medications.filter(m => m.timing === 'morning').map(m => m.name),
    afternoon: [],
    evening: medications.filter(m => m.timing === 'evening').map(m => m.name),
    asNeeded: medications.filter(m => m.timing === 'as_needed').map(m => m.name),
  }));
};

const generateAdherenceHistory = () => {
  const months = ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев'];
  return months.map((month, index) => ({
    month,
    adherence: 75 + index * 3 + Math.random() * 10,
    missed: Math.max(0, 5 - index),
  }));
};

const generateSideEffectsLog = () => [
  {
    id: 1,
    medication: 'Лизиноприл',
    effect: 'Сухой кашель',
    severity: 'mild',
    date: '2026-02-20',
    duration: 'Постоянно',
    action: 'Наблюдение',
    resolved: false,
  },
  {
    id: 2,
    medication: 'Цетиризин',
    effect: 'Сонливость',
    severity: 'moderate',
    date: '2026-02-15',
    duration: '2-3 часа',
    action: 'Принимать вечером',
    resolved: true,
  },
  {
    id: 3,
    medication: 'Омега-3',
    effect: 'Отрыжка',
    severity: 'mild',
    date: '2026-01-28',
    duration: '30 минут',
    action: 'Принимать с едой',
    resolved: true,
  },
];

const generateNextDoses = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return [
    {
      id: 1,
      medication: 'Лизиноприл',
      dosage: '10 мг',
      scheduledTime: '08:00',
      status: currentHour >= 8 ? 'taken' : 'pending',
      timeUntil: currentHour >= 8 ? null : `${8 - currentHour - 1}ч ${60 - currentMinute}м`,
      icon: '💊',
      color: '#10b981',
    },
    {
      id: 2,
      medication: 'Витамин D3',
      dosage: '2000 МЕ',
      scheduledTime: '08:00',
      status: currentHour >= 8 ? 'taken' : 'pending',
      timeUntil: currentHour >= 8 ? null : `${8 - currentHour - 1}ч ${60 - currentMinute}м`,
      icon: '☀️',
      color: '#f59e0b',
    },
    {
      id: 3,
      medication: 'Омега-3',
      dosage: '1000 мг',
      scheduledTime: '20:00',
      status: 'pending',
      timeUntil: `${20 - currentHour - 1}ч ${60 - currentMinute}м`,
      icon: '🐟',
      color: '#3b82f6',
    },
    {
      id: 4,
      medication: 'Магний B6',
      dosage: '400 мг',
      scheduledTime: '21:00',
      status: 'pending',
      timeUntil: `${21 - currentHour - 1}ч ${60 - currentMinute}м`,
      icon: '💪',
      color: '#8b5cf6',
    },
  ];
};

const SEVERITY_LEVELS = {
  mild: { label: 'Лёгкая', color: 'bg-emerald-100 text-emerald-700' },
  moderate: { label: 'Умеренная', color: 'bg-amber-100 text-amber-700' },
  severe: { label: 'Тяжёлая', color: 'bg-red-100 text-red-700' },
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * NextDoseTimer - Таймер следующей дозы
 */
const NextDoseTimer = ({ doses, onTake }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
  
  const nextPendingDose = doses.find(d => d.status === 'pending');

  useEffect(() => {
    if (nextPendingDose && nextPendingDose.timeUntil) {
      const interval = setInterval(() => {
        // Обновление таймера
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [nextPendingDose]);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⏰</span>
          <div>
            <h3 className="text-xl font-bold text-stone">Следующий приём</h3>
            <p className="text-xs text-ink-light">Не пропустите время</p>
          </div>
        </div>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          Напоминания
        </button>
      </div>

      {nextPendingDose ? (
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{nextPendingDose.icon}</div>
          <div className="text-2xl font-bold text-stone mb-1">{nextPendingDose.medication}</div>
          <div className="text-sm text-ink-light mb-4">{nextPendingDose.dosage} • {nextPendingDose.scheduledTime}</div>
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full">
            <span className="text-lg">⏱️</span>
            <span className="font-bold">{nextPendingDose.timeUntil}</span>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-xl font-bold text-emerald-600">Все дозы приняты!</div>
          <div className="text-sm text-ink-light">На сегодня больше нет запланированных приёмов</div>
        </div>
      )}

      {/* Today's Doses */}
      <div className="space-y-3">
        {doses.map((dose) => (
          <div
            key={dose.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all ${
              dose.status === 'taken' 
                ? 'bg-emerald-50 border-2 border-emerald-200' 
                : 'bg-sand/50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                dose.status === 'taken' ? 'bg-emerald-500' : 'bg-sand'
              }`}>
                {dose.status === 'taken' ? '✓' : dose.icon}
              </div>
              <div>
                <div className={`font-medium ${dose.status === 'taken' ? 'text-emerald-700' : 'text-stone'}`}>
                  {dose.medication}
                </div>
                <div className="text-xs text-ink-light">{dose.dosage} • {dose.scheduledTime}</div>
              </div>
            </div>
            {dose.status === 'pending' && (
              <button
                onClick={() => onTake?.(dose.id)}
                className="neu-button px-4 py-2 rounded-xl text-sm font-medium"
              >
                Принять
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MedicationCard - Карточка лекарства
 */
const MedicationCard = ({ medication, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsRefill = medication.stock <= medication.refillThreshold;

  return (
    <div className={`neu-card overflow-hidden ${needsRefill ? 'ring-2 ring-amber-500' : ''}`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-sand/30 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${medication.color}20` }}
            >
              {medication.icon}
            </div>
            <div>
              <div className="font-bold text-stone text-lg">{medication.name}</div>
              <div className="text-sm text-ink-light">{medication.dosage} • {medication.frequency}</div>
            </div>
          </div>
          {needsRefill && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              Заканчивается
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-ink-light">Осталось: {medication.stock} таб.</span>
            <span className="text-ink-light">Порог: {medication.refillThreshold}</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${needsRefill ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${(medication.stock / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Adherence */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-ink-light">
            📊 Приём: <span className="font-medium text-stone">{medication.adherence}%</span>
          </div>
          <span className="text-stone">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone/10 pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-ink-light mb-1">Цель</div>
              <div className="text-sm font-medium text-stone">{medication.purpose}</div>
            </div>
            <div>
              <div className="text-xs text-ink-light mb-1">Врач</div>
              <div className="text-sm font-medium text-stone">{medication.doctor}</div>
            </div>
            <div>
              <div className="text-xs text-ink-light mb-1">Начало</div>
              <div className="text-sm font-medium text-stone">{new Date(medication.startDate).toLocaleDateString('ru-RU')}</div>
            </div>
            <div>
              <div className="text-xs text-ink-light mb-1">Окончание</div>
              <div className="text-sm font-medium text-stone">{medication.endDate ? new Date(medication.endDate).toLocaleDateString('ru-RU') : 'Бессрочно'}</div>
            </div>
          </div>

          {medication.instructions && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="text-xs font-medium text-blue-700 mb-1">📋 Инструкция</div>
              <div className="text-sm text-blue-600">{medication.instructions}</div>
            </div>
          )}

          {medication.sideEffects.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-stone mb-2">⚠️ Побочные эффекты</div>
              <div className="flex flex-wrap gap-2">
                {medication.sideEffects.map((effect, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button onClick={() => onEdit?.(medication)} className="neu-button-secondary flex-1 py-2 rounded-xl text-sm font-medium">
              ✏️ Редактировать
            </button>
            <button onClick={() => onDelete?.(medication.id)} className="neu-button-secondary flex-1 py-2 rounded-xl text-sm font-medium text-red-600">
              🗑️ Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * WeeklySchedule - Недельное расписание
 */
const WeeklySchedule = ({ schedule }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Расписание приёма</h3>
      
      <div className="space-y-4">
        {schedule.map((day, index) => (
          <div key={index} className="p-4 bg-sand/50 rounded-xl">
            <div className="font-bold text-stone mb-3 flex items-center space-x-2">
              <span>{day.day}</span>
            </div>
            
            <div className="space-y-2">
              {day.morning.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Утро</span>
                  <span className="text-sm text-stone">{day.morning.join(', ')}</span>
                </div>
              )}
              {day.afternoon.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">День</span>
                  <span className="text-sm text-stone">{day.afternoon.join(', ')}</span>
                </div>
              )}
              {day.evening.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">Вечер</span>
                  <span className="text-sm text-stone">{day.evening.join(', ')}</span>
                </div>
              )}
              {day.asNeeded.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">По необходимости</span>
                  <span className="text-sm text-stone">{day.asNeeded.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * AdherenceChart - График приёма лекарств
 */
const AdherenceChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Приверженность лечению</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5c5243' }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="adherence"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#adherenceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {data[data.length - 1]?.adherence.toFixed(0)}%
          </div>
          <div className="text-xs text-ink-light">Текущий месяц</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">
            {data.reduce((sum, d) => sum + d.adherence, 0) / data.length | 0}%
          </div>
          <div className="text-xs text-ink-light">Среднее</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">
            {data.reduce((sum, d) => sum + d.missed, 0)}
          </div>
          <div className="text-xs text-ink-light">Пропущено</div>
        </div>
      </div>
    </div>
  );
};

/**
 * RefillReminders - Напоминания о пополнении
 */
const RefillReminders = ({ medications }) => {
  const needsRefill = medications.filter(m => m.stock <= m.refillThreshold);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Пополнение запасов</h3>
        <span className="text-sm text-ink-light">{needsRefill.length} требуют внимания</span>
      </div>

      {needsRefill.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl block mb-2">✅</span>
          <div className="text-stone font-medium">Все лекарства в наличии</div>
        </div>
      ) : (
        <div className="space-y-3">
          {needsRefill.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{med.icon}</span>
                <div>
                  <div className="font-medium text-stone">{med.name}</div>
                  <div className="text-xs text-amber-700">
                    Осталось: {med.stock} таб. • Порог: {med.refillThreshold}
                  </div>
                </div>
              </div>
              <button className="neu-button px-4 py-2 rounded-xl text-sm font-medium">
                Заказать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * SideEffectsTracker - Трекер побочных эффектов
 */
const SideEffectsTracker = ({ logs, onAdd }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Побочные эффекты</h3>
        <button onClick={onAdd} className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {logs.map((log) => {
          const severity = SEVERITY_LEVELS[log.severity];
          return (
            <div
              key={log.id}
              className={`p-4 rounded-xl ${log.resolved ? 'bg-emerald-50' : 'bg-sand/50'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-stone">{log.effect}</div>
                  <div className="text-xs text-ink-light">{log.medication}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${severity.color}`}>
                  {severity.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-light">
                <span>📅 {new Date(log.date).toLocaleDateString('ru-RU')}</span>
                <span>⏱️ {log.duration}</span>
                {log.resolved ? (
                  <span className="text-emerald-600">✓ Решено</span>
                ) : (
                  <span className="text-amber-600">📋 {log.action}</span>
                )}
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

const MedicationsV1 = () => {
  const [medications] = useState(generateMedications());
  const [weeklySchedule] = useState(generateWeeklySchedule());
  const [adherenceHistory] = useState(generateAdherenceHistory());
  const [sideEffectsLogs] = useState(generateSideEffectsLog());
  const [nextDoses] = useState(generateNextDoses());

  const handleTakeDose = (doseId) => {
    console.log('Taking dose:', doseId);
    // Здесь будет логика отметки о приёме
  };

  const handleEditMedication = (medication) => {
    console.log('Edit medication:', medication);
    // Здесь будет логика редактирования
  };

  const handleDeleteMedication = (medId) => {
    console.log('Delete medication:', medId);
    // Здесь будет логика удаления
  };

  const handleAddSideEffect = () => {
    console.log('Add side effect');
    // Здесь будет логика добавления
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">💊</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Лекарства</h1>
                <p className="text-ink-light">Управление медикаментами и напоминания</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/medical-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              + Добавить
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <NextDoseTimer doses={nextDoses} onTake={handleTakeDose} />
          <AdherenceChart data={adherenceHistory} />
          <RefillReminders medications={medications} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WeeklySchedule schedule={weeklySchedule} />
          <SideEffectsTracker logs={sideEffectsLogs} onAdd={handleAddSideEffect} />
        </div>

        {/* Medications List */}
        <div className="neu-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-stone">Мои лекарства</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-ink-light">{medications.length} препаратов</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={handleEditMedication}
                onDelete={handleDeleteMedication}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-medium">Отметить все</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium">Заказать лекарства</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Отчёт врачу</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🔔</div>
              <div className="font-medium">Напоминания</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationsV1;
