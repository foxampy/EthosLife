import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * MedicalV1 - Главная страница модуля Медицина
 * /health/medical-v1
 * 
 * Функционал:
 * - Health profile summary
 * - Conditions list
 * - Allergies
 * - Last lab results
 * - Upcoming appointments
 * - Health reminders
 */

// ============================================
// MOCK DATA
// ============================================

const generateHealthProfile = () => ({
  basic: {
    age: 32,
    gender: 'Мужской',
    height: 178,
    weight: 75.5,
    bmi: 23.8,
    bloodType: 'A+',
  },
  vitals: {
    heartRate: 68,
    bloodPressure: '120/80',
    temperature: 36.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
  },
  goals: {
    weight: 72,
    steps: 10000,
    sleep: 8,
    water: 2.5,
  },
  lastCheckup: '15.01.2026',
  nextCheckup: '15.07.2026',
});

const generateMedicalConditions = () => [
  {
    id: 1,
    name: 'Гипертония I степени',
    status: 'controlled',
    diagnosed: '2024-03-15',
    doctor: 'Др. Иванов А.С.',
    medications: ['Лизиноприл 10мг'],
    notes: 'Контроль давления ежедневно',
    icon: '❤️',
  },
  {
    id: 2,
    name: 'Сезонная аллергия',
    status: 'active',
    diagnosed: '2020-05-20',
    doctor: 'Др. Петрова Е.В.',
    medications: ['Цетиризин 10мг'],
    notes: 'Обострение весной и осенью',
    icon: '🤧',
  },
  {
    id: 3,
    name: 'Остеохондроз шейного отдела',
    status: 'chronic',
    diagnosed: '2023-11-10',
    doctor: 'Др. Сидоров В.К.',
    medications: [],
    notes: 'ЛФК, массаж 2 раза в год',
    icon: '🦴',
  },
];

const generateAllergies = () => [
  {
    id: 1,
    type: 'food',
    allergen: 'Арахис',
    severity: 'severe',
    reaction: 'Анафилактический шок',
    icon: '🥜',
  },
  {
    id: 2,
    type: 'medication',
    allergen: 'Пенициллин',
    severity: 'moderate',
    reaction: 'Кожная сыпь',
    icon: '💊',
  },
  {
    id: 3,
    type: 'environmental',
    allergen: 'Пыльца берёзы',
    severity: 'mild',
    reaction: 'Насморк, слезотечение',
    icon: '🌸',
  },
  {
    id: 4,
    type: 'food',
    allergen: 'Морепродукты',
    severity: 'moderate',
    reaction: 'Крапивница',
    icon: '🦐',
  },
];

const generateLabResults = () => [
  {
    id: 1,
    date: '2026-02-15',
    type: 'Общий анализ крови',
    status: 'normal',
    results: [
      { name: 'Гемоглобин', value: 145, unit: 'г/л', min: 130, max: 170 },
      { name: 'Эритроциты', value: 4.8, unit: '10¹²/л', min: 4.0, max: 5.5 },
      { name: 'Лейкоциты', value: 6.5, unit: '10⁹/л', min: 4.0, max: 9.0 },
      { name: 'Тромбоциты', value: 250, unit: '10⁹/л', min: 180, max: 320 },
    ],
  },
  {
    id: 2,
    date: '2026-02-15',
    type: 'Биохимия',
    status: 'warning',
    results: [
      { name: 'Глюкоза', value: 5.8, unit: 'ммоль/л', min: 3.9, max: 5.5 },
      { name: 'Холестерин', value: 5.2, unit: 'ммоль/л', min: 0, max: 5.0 },
      { name: 'ЛПНП', value: 3.1, unit: 'ммоль/л', min: 0, max: 2.6 },
      { name: 'ЛПВП', value: 1.4, unit: 'ммоль/л', min: 1.0, max: 2.0 },
      { name: 'Триглицериды', value: 1.5, unit: 'ммоль/л', min: 0, max: 1.7 },
    ],
  },
  {
    id: 3,
    date: '2026-01-20',
    type: 'Гормоны',
    status: 'normal',
    results: [
      { name: 'ТТГ', value: 2.1, unit: 'мЕд/л', min: 0.4, max: 4.0 },
      { name: 'Т3 свободный', value: 5.2, unit: 'пмоль/л', min: 3.1, max: 6.8 },
      { name: 'Т4 свободный', value: 15.8, unit: 'пмоль/л', min: 12, max: 22 },
      { name: 'Кортизол', value: 380, unit: 'нмоль/л', min: 170, max: 540 },
    ],
  },
];

const generateAppointments = () => [
  {
    id: 1,
    type: 'checkup',
    doctor: 'Терапевт',
    name: 'Др. Иванов А.С.',
    date: '2026-03-15',
    time: '10:00',
    location: 'Клиника "Здоровье"',
    notes: 'Плановый осмотр',
    status: 'confirmed',
    icon: '👨‍⚕️',
  },
  {
    id: 2,
    type: 'specialist',
    doctor: 'Кардиолог',
    name: 'Др. Петрова Е.В.',
    date: '2026-03-22',
    time: '14:30',
    location: 'Кардиоцентр',
    notes: 'Контроль давления',
    status: 'pending',
    icon: '❤️',
  },
  {
    id: 3,
    type: 'procedure',
    doctor: 'Стоматолог',
    name: 'Др. Сидоров В.К.',
    date: '2026-04-05',
    time: '11:00',
    location: 'Стоматология "Улыбка"',
    notes: 'Профессиональная чистка',
    status: 'confirmed',
    icon: '🦷',
  },
];

const generateHealthReminders = () => [
  {
    id: 1,
    type: 'medication',
    title: 'Лизиноприл 10мг',
    frequency: 'Ежедневно утром',
    lastTaken: 'Сегодня, 08:00',
    icon: '💊',
    color: 'bg-emerald-500',
  },
  {
    id: 2,
    type: 'measurement',
    title: 'Измерение давления',
    frequency: '2 раза в день',
    lastTaken: 'Сегодня, 07:30',
    icon: '🩺',
    color: 'bg-blue-500',
  },
  {
    id: 3,
    type: 'exercise',
    title: 'ЛФК для шеи',
    frequency: 'Ежедневно',
    lastTaken: 'Вчера',
    icon: '🧘',
    color: 'bg-violet-500',
  },
  {
    id: 4,
    type: 'appointment',
    title: 'Визит к терапевту',
    frequency: 'Раз в 6 месяцев',
    lastTaken: '15.01.2026',
    icon: '📅',
    color: 'bg-amber-500',
  },
];

const generateHealthMetrics = () => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  return months.map((month, index) => ({
    month,
    weight: 76.5 - index * 0.3 + Math.random() * 0.5,
    heartRate: 70 - index * 0.5 + Math.random() * 3,
    systolic: 125 - index * 1 + Math.random() * 5,
    diastolic: 82 - index * 0.5 + Math.random() * 3,
  }));
};

const CONDITION_STATUS = {
  controlled: { label: 'Контролируется', color: 'bg-emerald-100 text-emerald-700' },
  active: { label: 'Активно', color: 'bg-amber-100 text-amber-700' },
  chronic: { label: 'Хроническое', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Решено', color: 'bg-gray-100 text-gray-700' },
};

const ALLERGY_SEVERITY = {
  severe: { label: 'Тяжёлая', color: 'bg-red-100 text-red-700' },
  moderate: { label: 'Умеренная', color: 'bg-amber-100 text-amber-700' },
  mild: { label: 'Лёгкая', color: 'bg-emerald-100 text-emerald-700' },
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * HealthProfileCard - Карточка профиля здоровья
 */
const HealthProfileCard = ({ profile }) => {
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { label: 'Недостаток', color: 'text-amber-600' };
    if (bmi < 25) return { label: 'Норма', color: 'text-emerald-600' };
    if (bmi < 30) return { label: 'Избыток', color: 'text-amber-600' };
    return { label: 'Ожирение', color: 'text-red-600' };
  };

  const bmiStatus = getBMIStatus(profile.basic.bmi);

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Профиль здоровья</h3>
        <Link to="/profile" className="text-sm font-medium text-stone hover:text-ink">
          Редактировать →
        </Link>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-stone">{profile.basic.age}</div>
          <div className="text-xs text-ink-light">Лет</div>
        </div>
        <div className="text-center p-4 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-stone">{profile.basic.height}</div>
          <div className="text-xs text-ink-light">См</div>
        </div>
        <div className="text-center p-4 bg-sand/50 rounded-xl">
          <div className="text-2xl font-bold text-stone">{profile.basic.weight}</div>
          <div className="text-xs text-ink-light">Кг</div>
        </div>
      </div>

      {/* BMI */}
      <div className="p-4 bg-sand/50 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone">ИМТ (BMI)</span>
          <span className={`text-lg font-bold ${bmiStatus.color}`}>{profile.basic.bmi}</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-blue-300 via-emerald-300 via-amber-300 to-red-300 rounded-full relative">
          <div 
            className="absolute w-4 h-4 bg-stone rounded-full border-2 border-white shadow-md transform -translate-x-1/2"
            style={{ left: `${Math.min(((profile.basic.bmi - 15) / 25) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-ink-light">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
        <div className="text-center mt-2 text-sm">
          <span className={bmiStatus.color}>{bmiStatus.label}</span>
        </div>
      </div>

      {/* Vitals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xl">❤️</span>
            <span className="text-sm font-medium text-stone">Пульс</span>
          </div>
          <span className="font-bold text-stone">{profile.vitals.heartRate} уд/мин</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🩺</span>
            <span className="text-sm font-medium text-stone">Давление</span>
          </div>
          <span className="font-bold text-stone">{profile.vitals.bloodPressure}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌡️</span>
            <span className="text-sm font-medium text-stone">Температура</span>
          </div>
          <span className="font-bold text-stone">{profile.vitals.temperature}°C</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xl">💨</span>
            <span className="text-sm font-medium text-stone">Сатурация</span>
          </div>
          <span className="font-bold text-stone">{profile.vitals.oxygenSaturation}%</span>
        </div>
      </div>

      {/* Checkup Info */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-light">Последний осмотр:</span>
          <span className="font-medium text-stone">{profile.lastCheckup}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-ink-light">Следующий осмотр:</span>
          <span className="font-medium text-emerald-600">{profile.nextCheckup}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ConditionsList - Список заболеваний
 */
const ConditionsList = ({ conditions }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Заболевания</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          + Добавить
        </button>
      </div>

      <div className="space-y-4">
        {conditions.map((condition) => {
          const status = CONDITION_STATUS[condition.status];
          return (
            <div
              key={condition.id}
              className="p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{condition.icon}</span>
                  <div>
                    <div className="font-bold text-stone">{condition.name}</div>
                    <div className="text-xs text-ink-light">
                      Диагноз от: {new Date(condition.diagnosed).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              
              {condition.medications.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-ink-light mb-1">Лекарства:</div>
                  <div className="flex flex-wrap gap-1">
                    {condition.medications.map((med, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white rounded-lg text-stone">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {condition.notes && (
                <div className="text-xs text-ink-light italic">📝 {condition.notes}</div>
              )}
              
              <div className="text-xs text-ink-light mt-2">
                👨‍⚕️ {condition.doctor}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * AllergiesList - Список аллергий
 */
const AllergiesList = ({ allergies }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Аллергии</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {allergies.map((allergy) => {
          const severity = ALLERGY_SEVERITY[allergy.severity];
          return (
            <div
              key={allergy.id}
              className="flex items-center justify-between p-4 bg-sand/50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{allergy.icon}</span>
                <div>
                  <div className="font-medium text-stone">{allergy.allergen}</div>
                  <div className="text-xs text-ink-light">{allergy.reaction}</div>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${severity.color}`}>
                {severity.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Warning Card */}
      <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-bold text-red-700">Важно!</div>
            <div className="text-sm text-red-600 mt-1">
              Всегда сообщайте медицинскому персоналу о ваших аллергиях перед назначением лечения.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * LabResultsWidget - Виджет лабораторных результатов
 */
const LabResultsWidget = ({ results }) => {
  const getStatusColor = (status) => {
    const colors = {
      normal: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      critical: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.normal;
  };

  const latestResult = results[0];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Лабораторные результаты</h3>
          <p className="text-xs text-ink-light">Последние: {new Date(latestResult.date).toLocaleDateString('ru-RU')}</p>
        </div>
        <Link to="/health/medical/labs" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>

      {/* Latest Results Summary */}
      <div className="space-y-3 mb-6">
        {latestResult.results.slice(0, 4).map((result, index) => {
          const isNormal = result.value >= result.min && result.value <= result.max;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
              <span className="text-sm font-medium text-stone">{result.name}</span>
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${isNormal ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {result.value} {result.unit}
                </span>
                {isNormal ? (
                  <span className="text-emerald-500">✓</span>
                ) : (
                  <span className="text-amber-500">⚠️</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <div className={`p-3 rounded-xl text-center font-medium ${getStatusColor(latestResult.status)}`}>
        {latestResult.status === 'normal' ? '✓ Все показатели в норме' : '⚠️ Есть отклонения'}
      </div>
    </div>
  );
};

/**
 * AppointmentsWidget - Виджет назначений
 */
const AppointmentsWidget = ({ appointments }) => {
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.pending;
  };

  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date());

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Предстоящие визиты</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          + Записаться
        </button>
      </div>

      <div className="space-y-4">
        {upcomingAppointments.map((appointment) => {
          const status = getStatusColor(appointment.status);
          return (
            <div
              key={appointment.id}
              className="p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{appointment.icon}</span>
                  <div>
                    <div className="font-bold text-stone">{appointment.doctor}</div>
                    <div className="text-xs text-ink-light">{appointment.name}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status}`}>
                  {appointment.status === 'confirmed' ? 'Подтверждено' : appointment.status === 'pending' ? 'Ожидает' : 'Отменено'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-ink-light">
                  <span>📅 {new Date(appointment.date).toLocaleDateString('ru-RU')}</span>
                  <span>🕐 {appointment.time}</span>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="text-xs text-ink-light mt-2 italic">📝 {appointment.notes}</div>
              )}
              
              <div className="flex space-x-2 mt-3">
                <button className="neu-button-secondary px-3 py-1 text-xs rounded-lg">
                  Перенести
                </button>
                <button className="neu-button-secondary px-3 py-1 text-xs rounded-lg">
                  Напомнить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * HealthRemindersWidget - Виджет напоминаний
 */
const HealthRemindersWidget = ({ reminders }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Напоминания</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between p-4 bg-sand/50 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${reminder.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {reminder.icon}
              </div>
              <div>
                <div className="font-medium text-stone">{reminder.title}</div>
                <div className="text-xs text-ink-light">{reminder.frequency}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink-light">Последнее:</div>
              <div className="text-sm font-medium text-stone">{reminder.lastTaken}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * HealthMetricsChart - График показателей здоровья
 */
const HealthMetricsChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Динамика показателей</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#5c5243' }} domain={[70, 80]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#5c5243' }} domain={[110, 140]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line yAxisId="left" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Вес (кг)" />
            <Line yAxisId="left" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Пульс" />
            <Line yAxisId="right" dataKey="systolic" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Давление (сис.)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MedicalV1 = () => {
  const [healthProfile] = useState(generateHealthProfile());
  const [conditions] = useState(generateMedicalConditions());
  const [allergies] = useState(generateAllergies());
  const [labResults] = useState(generateLabResults());
  const [appointments] = useState(generateAppointments());
  const [reminders] = useState(generateHealthReminders());
  const [healthMetrics] = useState(generateHealthMetrics());

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">🏥</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Медицина</h1>
                <p className="text-ink-light">Управление здоровьем и медицинскими данными</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/medical/meds-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Лекарства
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              + Добавить данные
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <HealthProfileCard profile={healthProfile} />
          <ConditionsList conditions={conditions} />
          <AllergiesList allergies={allergies} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LabResultsWidget results={labResults} />
          <AppointmentsWidget appointments={appointments} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <HealthRemindersWidget reminders={reminders} />
          <HealthMetricsChart data={healthMetrics} />
          
          {/* Quick Stats */}
          <div className="neu-card p-6">
            <h3 className="text-xl font-bold text-stone mb-6">Быстрая статистика</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">Заболеваний</span>
                  <span className="text-2xl font-bold text-emerald-700">{conditions.length}</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-700">Аллергий</span>
                  <span className="text-2xl font-bold text-amber-700">{allergies.length}</span>
                </div>
              </div>
              <div className="p-4 bg-violet-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-violet-700">Анализов</span>
                  <span className="text-2xl font-bold text-violet-700">{labResults.length}</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Визитов</span>
                  <span className="text-2xl font-bold text-blue-700">{appointments.filter(a => new Date(a.date) >= new Date()).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Навигация по модулю</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/health/medical/meds-v1"
              className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl text-white text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">💊</div>
              <div className="font-medium">Лекарства</div>
            </Link>
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Анализы</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Визиты</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Отчёты</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalV1;
