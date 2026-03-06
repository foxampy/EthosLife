import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * ExerciseLibraryV1 - Библиотека упражнений
 * /health/fitness/exercises-v1
 * 
 * Функционал:
 * - Search exercises
 * - Filters (muscle group, equipment, difficulty)
 * - Exercise cards (500+ заглушек)
 * - Video demo placeholder
 * - Instructions
 * - Muscles worked diagram
 */

// ============================================
// MOCK DATA - 500+ Exercises Generator
// ============================================

const EXERCISE_TEMPLATES = {
  chest: [
    { name: 'Жим лёжа', icon: '🏋️' },
    { name: 'Жим гантелей', icon: '🏋️' },
    { name: 'Жим на наклонной', icon: '🏋️' },
    { name: 'Отжимания', icon: '🤲' },
    { name: 'Разводка', icon: '🏋️' },
    { name: 'Сведение в кроссовере', icon: '🏋️' },
    { name: 'Пуловер', icon: '🏋️' },
    { name: 'Жим в хаммере', icon: '🏋️' },
    { name: 'Отжимания на брусьях', icon: '🤸' },
    { name: 'Жим обратным хватом', icon: '🏋️' },
  ],
  back: [
    { name: 'Становая тяга', icon: '🏋️' },
    { name: 'Подтягивания', icon: '🤸' },
    { name: 'Тяга штанги', icon: '🏋️' },
    { name: 'Тяга гантели', icon: '🏋️' },
    { name: 'Тяга верхнего блока', icon: '🏋️' },
    { name: 'Тяга горизонтального', icon: '🏋️' },
    { name: 'Гиперэкстензия', icon: '🤸' },
    { name: 'Шраги', icon: '🏋️' },
    { name: 'Тяга Т-грифа', icon: '🏋️' },
    { name: 'Пуловер верхнего блока', icon: '🏋️' },
  ],
  legs: [
    { name: 'Приседания', icon: '🏋️' },
    { name: 'Жим ногами', icon: '🏋️' },
    { name: 'Выпады', icon: '🏋️' },
    { name: 'Румынская тяга', icon: '🏋️' },
    { name: 'Сгибание ног', icon: '🏋️' },
    { name: 'Разгибание ног', icon: '🏋️' },
    { name: 'Подъём на носки', icon: '🏋️' },
    { name: 'Фронтальные приседания', icon: '🏋️' },
    { name: 'Болгарские сплит', icon: '🏋️' },
    { name: 'Ягодичный мост', icon: '🤸' },
  ],
  shoulders: [
    { name: 'Жим штанги стоя', icon: '🏋️' },
    { name: 'Махи в стороны', icon: '🏋️' },
    { name: 'Махи вперёд', icon: '🏋️' },
    { name: 'Махи в наклоне', icon: '🏋️' },
    { name: 'Тяга к подбородку', icon: '🏋️' },
    { name: 'Жим Арнольда', icon: '🏋️' },
    { name: 'Разведение в тренажёре', icon: '🏋️' },
    { name: 'Подъём рук', icon: '🤸' },
    { name: 'Шраги с гантелями', icon: '🏋️' },
    { name: 'Лицевая тяга', icon: '🏋️' },
  ],
  biceps: [
    { name: 'Подъём штанги', icon: '🏋️' },
    { name: 'Молотки', icon: '🏋️' },
    { name: 'Концентрированный', icon: '🏋️' },
    { name: 'На скамье Скотта', icon: '🏋️' },
    { name: 'Подъём гантелей', icon: '🏋️' },
    { name: '21', icon: '🏋️' },
    { name: 'На бицепс-машине', icon: '🏋️' },
    { name: 'Обратные сгибания', icon: '🏋️' },
    { name: 'Паучьи сгибания', icon: '🏋️' },
    { name: 'Z-штанга подъём', icon: '🏋️' },
  ],
  triceps: [
    { name: 'Французский жим', icon: '🏋️' },
    { name: 'Отжимания узко', icon: '🤲' },
    { name: 'Разгибания на блоке', icon: '🏋️' },
    { name: 'Жим лёжа узко', icon: '🏋️' },
    { name: 'Кикбэки', icon: '🏋️' },
    { name: 'Алмазные отжимания', icon: '🤲' },
    { name: 'Разгибания из-за головы', icon: '🏋️' },
    { name: 'Даймонд пуш-ап', icon: '🤲' },
    { name: 'Трицепс на блоке', icon: '🏋️' },
    { name: 'JM Press', icon: '🏋️' },
  ],
  core: [
    { name: 'Планка', icon: '🧘' },
    { name: 'Скручивания', icon: '🧘' },
    { name: 'Велосипед', icon: '🧘' },
    { name: 'Подъём ног', icon: '🤸' },
    { name: 'Русский твист', icon: '🧘' },
    { name: 'Мёртвый жук', icon: '🧘' },
    { name: 'Боковая планка', icon: '🧘' },
    { name: 'V-up', icon: '🧘' },
    { name: 'Hollow hold', icon: '🧘' },
    { name: 'Паллоф пресс', icon: '🏋️' },
  ],
  cardio: [
    { name: 'Бег', icon: '🏃' },
    { name: 'Велосипед', icon: '🚴' },
    { name: 'Эллипс', icon: '🏃' },
    { name: 'Гребля', icon: '🚣' },
    { name: 'Бёрпи', icon: '🔥' },
    { name: 'Джампинг джек', icon: '🤸' },
    { name: 'Скакалка', icon: '🪢' },
    { name: 'Mountain climbers', icon: '🔥' },
    { name: 'High knees', icon: '🏃' },
    { name: 'Box jumps', icon: '📦' },
  ],
};

const EQUIPMENT_TYPES = [
  { id: 'all', label: 'Все' },
  { id: 'barbell', label: 'Штанга', icon: '🏋️' },
  { id: 'dumbbell', label: 'Гантели', icon: '🏋️' },
  { id: 'bodyweight', label: 'Свой вес', icon: '🤸' },
  { id: 'machine', label: 'Тренажёры', icon: '🏋️' },
  { id: 'cable', label: 'Блоки', icon: '🏋️' },
  { id: 'kettlebell', label: 'Гири', icon: '🏋️' },
];

const DIFFICULTY_LEVELS = [
  { id: 'all', label: 'Любая' },
  { id: 'beginner', label: 'Новичок', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'intermediate', label: 'Средний', color: 'bg-amber-100 text-amber-700' },
  { id: 'advanced', label: 'Продвинутый', color: 'bg-red-100 text-red-700' },
];

const MUSCLE_GROUPS = [
  { id: 'all', label: 'Все мышцы', icon: '💪' },
  { id: 'chest', label: 'Грудь', icon: '🫁' },
  { id: 'back', label: 'Спина', icon: '🦴' },
  { id: 'legs', label: 'Ноги', icon: '🦵' },
  { id: 'shoulders', label: 'Плечи', icon: '💪' },
  { id: 'biceps', label: 'Бицепс', icon: '🦾' },
  { id: 'triceps', label: 'Трицепс', icon: '🦾' },
  { id: 'core', label: 'Пресс', icon: '🧘' },
  { id: 'cardio', label: 'Кардио', icon: '❤️' },
];

// Generate 500+ exercises
const generateExercises = () => {
  const exercises = [];
  let id = 1;

  Object.entries(EXERCISE_TEMPLATES).forEach(([muscle, templates]) => {
    // Original exercises
    templates.forEach((template, index) => {
      exercises.push({
        id: id++,
        name: template.name,
        muscle,
        equipment: Object.keys(EQUIPMENT_TYPES)[1 + (index % 6)],
        difficulty: ['beginner', 'intermediate', 'advanced'][index % 3],
        icon: template.icon,
        description: `Эффективное упражнение для проработки ${muscle === 'chest' ? 'грудных мышц' : muscle === 'back' ? 'спины' : muscle === 'legs' ? 'ног' : muscle === 'shoulders' ? 'плеч' : muscle === 'biceps' ? 'бицепса' : muscle === 'triceps' ? 'трицепса' : muscle === 'core' ? 'кора' : 'сердечно-сосудистой системы'}.`,
        instructions: [
          'Подготовьте рабочее место и оборудование',
          'Примите правильное исходное положение',
          'Выполните движение с правильной техникой',
          'Вернитесь в исходное положение',
          'Повторите нужное количество раз',
        ],
        musclesWorked: [muscle, ...(muscle === 'chest' ? ['triceps', 'shoulders'] : muscle === 'back' ? ['biceps', 'core'] : [])],
        videoUrl: null,
        calories: Math.floor(5 + Math.random() * 15),
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(50 + Math.random() * 500),
      });
    });

    // Variations to reach 500+
    for (let i = 0; i < 55; i++) {
      const template = templates[i % templates.length];
      const variations = [
        'с гантелями', 'со штангой', 'на блоке', 'в тренажёре',
        'одной рукой', 'с паузой', 'негативные', 'взрывные',
        'с упором', 'на наклонной', 'обратные', 'классические',
      ];
      exercises.push({
        id: id++,
        name: `${template.name} ${variations[i % variations.length]}`,
        muscle,
        equipment: Object.keys(EQUIPMENT_TYPES)[1 + (i % 6)],
        difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
        icon: template.icon,
        description: `Вариация упражнения "${template.name}" для разнообразия тренировки.`,
        instructions: [
          'Подготовьте рабочее место',
          'Примите исходное положение',
          'Выполните упражнение',
          'Контролируйте движение',
          'Завершите подход',
        ],
        musclesWorked: [muscle],
        videoUrl: null,
        calories: Math.floor(5 + Math.random() * 15),
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(20 + Math.random() * 200),
      });
    }
  });

  return exercises;
};

const generateExerciseDetail = (exercise) => ({
  ...exercise,
  sets: {
    beginner: { sets: 3, reps: '12-15', weight: 'Лёгкий' },
    intermediate: { sets: 4, reps: '8-12', weight: 'Средний' },
    advanced: { sets: 5, reps: '6-8', weight: 'Тяжёлый' },
  },
  tips: [
    'Держите спину прямой на протяжении всего движения',
    'Контролируйте вес на всех фазах упражнения',
    'Дышите правильно: выдох на усилии',
    'Разогрейтесь перед выполнением',
    'Не блокируйте суставы в конечной точке',
  ],
  commonMistakes: [
    'Слишком большой вес',
    'Неправильная техника',
    'Недостаточная амплитуда',
    'Задержка дыхания',
  ],
});

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ExerciseCard - Карточка упражнения
 */
const ExerciseCard = ({ exercise, onSelect, onFavorite, isFavorite }) => {
  const difficultyConfig = DIFFICULTY_LEVELS.find(d => d.id === exercise.difficulty);

  return (
    <div 
      className="neu-card overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onSelect(exercise)}
    >
      {/* Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
        <span className="text-6xl">{exercise.icon}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(exercise.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:bg-red-100'
          }`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyConfig?.color}`}>
            {difficultyConfig?.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-stone mb-2 line-clamp-1">{exercise.name}</h3>
        <p className="text-sm text-ink-light mb-3 line-clamp-2">{exercise.description}</p>

        {/* Info */}
        <div className="flex items-center justify-between text-xs text-ink-light mb-3">
          <span>🔥 {exercise.calories} ккал/мин</span>
          <span>⭐ {exercise.rating} ({exercise.reviews})</span>
        </div>

        {/* Muscles */}
        <div className="flex flex-wrap gap-1">
          {exercise.musclesWorked.slice(0, 3).map((m, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-sand rounded-lg text-stone">
              {MUSCLE_GROUPS.find(g => g.id === m)?.icon} {MUSCLE_GROUPS.find(g => g.id === m)?.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ExerciseDetail - Детальный просмотр упражнения
 */
const ExerciseDetail = ({ exercise, onClose }) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const detail = exercise ? generateExerciseDetail(exercise) : null;

  if (!detail) return null;

  const difficultyConfig = DIFFICULTY_LEVELS.find(d => d.id === exercise.difficulty);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="neu-card w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{exercise.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-stone">{exercise.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyConfig?.color}`}>
                  {difficultyConfig?.label}
                </span>
                <span className="text-xs text-ink-light">• {exercise.equipment}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-sand flex items-center justify-center text-xl">
            ✕
          </button>
        </div>

        {/* Video Placeholder */}
        <div className="h-64 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <span className="text-6xl block mb-4">🎬</span>
            <p className="text-stone font-medium">Видео демонстрация</p>
            <p className="text-sm text-ink-light">Скоро будет доступно</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{detail.calories}</div>
            <div className="text-xs text-ink-light">ккал/мин</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">{detail.sets[exercise.difficulty].sets}</div>
            <div className="text-xs text-ink-light">подхода</div>
          </div>
          <div className="text-center p-4 bg-violet-50 rounded-xl">
            <div className="text-2xl font-bold text-violet-600">{detail.sets[exercise.difficulty].reps}</div>
            <div className="text-xs text-ink-light">повторов</div>
          </div>
          <div className="text-center p-4 bg-cyan-50 rounded-xl">
            <div className="text-2xl font-bold text-cyan-600">⭐ {exercise.rating}</div>
            <div className="text-xs text-ink-light">{exercise.reviews} отзывов</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-stone/20">
          {['instructions', 'tips', 'mistakes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === tab
                  ? 'text-stone border-b-2 border-stone'
                  : 'text-ink-light hover:text-stone'
              }`}
            >
              {tab === 'instructions' ? 'Техника' : tab === 'tips' ? 'Советы' : 'Ошибки'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            {detail.instructions.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-stone text-white flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-stone pt-1">{step}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            {detail.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-xl">
                <span className="text-xl">💡</span>
                <p className="text-stone">{tip}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="space-y-3">
            {detail.commonMistakes.map((mistake, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                <span className="text-xl">⚠️</span>
                <p className="text-stone">{mistake}</p>
              </div>
            ))}
          </div>
        )}

        {/* Muscles Worked */}
        <div className="mt-6 pt-6 border-t border-stone/20">
          <h4 className="font-bold text-stone mb-4">Задействованные мышцы</h4>
          <div className="flex flex-wrap gap-2">
            {detail.musclesWorked.map((m, i) => (
              <span key={i} className="px-3 py-2 bg-sand rounded-xl text-stone font-medium">
                {MUSCLE_GROUPS.find(g => g.id === m)?.icon} {MUSCLE_GROUPS.find(g => g.id === m)?.label}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6 pt-6 border-t border-stone/20">
          <button className="neu-button flex-1 py-3">
            Добавить в тренировку
          </button>
          <button className="neu-button-secondary flex-1 py-3">
            В избранное
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * SearchFilters - Поиск и фильтры
 */
const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="neu-card p-6 mb-6">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск упражнений..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="neu-input w-full pl-12 pr-4 py-3"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      {/* Muscle Groups */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-stone mb-2">Мышцы</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(group => (
            <button
              key={group.id}
              onClick={() => onFilterChange('muscle', group.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filters.muscle === group.id
                  ? 'bg-stone text-white'
                  : 'bg-sand/50 text-stone hover:bg-sand'
              }`}
            >
              {group.icon} {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment & Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Оборудование</label>
          <select
            value={filters.equipment}
            onChange={(e) => onFilterChange('equipment', e.target.value)}
            className="neu-input w-full"
          >
            {EQUIPMENT_TYPES.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Сложность</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange('difficulty', e.target.value)}
            className="neu-input w-full"
          >
            {DIFFICULTY_LEVELS.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone/10">
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="px-3 py-1 bg-stone text-white rounded-full text-sm">
              Поиск: {filters.search} ✕
            </span>
          )}
          {filters.muscle !== 'all' && (
            <span className="px-3 py-1 bg-stone text-white rounded-full text-sm">
              {MUSCLE_GROUPS.find(g => g.id === filters.muscle)?.label} ✕
            </span>
          )}
        </div>
        <button
          onClick={() => onFilterChange('reset', {})}
          className="text-sm font-medium text-stone hover:text-ink"
        >
          Сбросить все
        </button>
      </div>
    </div>
  );
};

/**
 * MuscleDiagram - Диаграмма мышц
 */
const MuscleDiagram = () => {
  const data = [
    { name: 'Грудь', value: 75, color: '#ef4444' },
    { name: 'Спина', value: 85, color: '#3b82f6' },
    { name: 'Ноги', value: 90, color: '#10b981' },
    { name: 'Плечи', value: 60, color: '#f59e0b' },
    { name: 'Руки', value: 70, color: '#8b5cf6' },
    { name: 'Кор', value: 55, color: '#ec4899' },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Проработка мышц</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data.map(d => ({ subject: d.name, trained: d.value, fullMark: 100 }))}>
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
          <div key={index} className="flex items-center justify-between p-2 bg-sand/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-stone">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-stone">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * PopularExercises - Популярные упражнения
 */
const PopularExercises = ({ exercises, onSelect }) => {
  const popular = exercises.slice(0, 5).sort((a, b) => b.reviews - a.reviews);

  return (
    <div className="neu-card p-6 mb-6">
      <h3 className="text-xl font-bold text-stone mb-4">Популярные упражнения</h3>
      <div className="space-y-3">
        {popular.map((exercise, index) => (
          <div
            key={exercise.id}
            className="flex items-center space-x-4 p-3 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
            onClick={() => onSelect(exercise)}
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
              {index + 1}
            </div>
            <span className="text-2xl">{exercise.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-stone">{exercise.name}</div>
              <div className="text-xs text-ink-light">{exercise.reviews} выполнений</div>
            </div>
            <span className="text-amber-500">⭐ {exercise.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ExerciseLibraryV1 = () => {
  const [exercises] = useState(generateExercises());
  const [favorites, setFavorites] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    muscle: 'all',
    equipment: 'all',
    difficulty: 'all',
  });

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        search: '',
        muscle: 'all',
        equipment: 'all',
        difficulty: 'all',
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleToggleFavorite = (exerciseId) => {
    setFavorites(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMuscle = filters.muscle === 'all' || ex.muscle === filters.muscle;
    const matchesEquipment = filters.equipment === 'all' || ex.equipment === filters.equipment;
    const matchesDifficulty = filters.difficulty === 'all' || ex.difficulty === filters.difficulty;
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">📚</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Библиотека упражнений</h1>
                <p className="text-ink-light">{exercises.length} упражнений в базе</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/fitness-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <Link to="/health/fitness/workout-v1" className="neu-button px-4 py-2 rounded-xl font-medium">
              Тренировка
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PopularExercises exercises={exercises} onSelect={setSelectedExercise} />
            <MuscleDiagram />
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-ink-light">
                Найдено: <span className="font-bold text-stone">{filteredExercises.length}</span> упражнений
              </p>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-stone text-white">▦</button>
                <button className="p-2 rounded-lg hover:bg-sand text-stone">☰</button>
              </div>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.slice(0, 24).map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={setSelectedExercise}
                  onFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(exercise.id)}
                />
              ))}
            </div>

            {/* Load More */}
            {filteredExercises.length > 24 && (
              <div className="text-center mt-8">
                <button className="neu-button px-8 py-3">
                  Показать ещё ({filteredExercises.length - 24})
                </button>
              </div>
            )}

            {filteredExercises.length === 0 && (
              <div className="text-center py-16 neu-card">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="text-xl font-bold text-stone mb-2">Ничего не найдено</h3>
                <p className="text-ink-light">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
};

export default ExerciseLibraryV1;
