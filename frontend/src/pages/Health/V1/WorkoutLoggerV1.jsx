import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

/**
 * WorkoutLoggerV1 - Логгер тренировок
 * /health/fitness/workout-v1
 * 
 * Функционал:
 * - Exercise selector
 * - Sets/reps/weight input
 * - Rest timer
 * - Workout duration
 * - Notes
 * - Save workout
 * - History
 */

// ============================================
// MOCK DATA
// ============================================

const generateExerciseLibrary = () => [
  // Chest
  { id: 1, name: 'Жим лёжа', muscle: 'Грудь', equipment: 'Штанга', difficulty: 'medium', icon: '🏋️' },
  { id: 2, name: 'Жим гантелей на наклонной', muscle: 'Грудь', equipment: 'Гантели', difficulty: 'medium', icon: '🏋️' },
  { id: 3, name: 'Отжимания на брусьях', muscle: 'Грудь', equipment: 'Брусья', difficulty: 'hard', icon: '🤸' },
  { id: 4, name: 'Разводка гантелей', muscle: 'Грудь', equipment: 'Гантели', difficulty: 'easy', icon: '🏋️' },
  
  // Back
  { id: 5, name: 'Становая тяга', muscle: 'Спина', equipment: 'Штанга', difficulty: 'hard', icon: '🏋️' },
  { id: 6, name: 'Подтягивания', muscle: 'Спина', equipment: 'Турник', difficulty: 'medium', icon: '🤸' },
  { id: 7, name: 'Тяга штанги в наклоне', muscle: 'Спина', equipment: 'Штанга', difficulty: 'medium', icon: '🏋️' },
  { id: 8, name: 'Тяга верхнего блока', muscle: 'Спина', equipment: 'Блок', difficulty: 'easy', icon: '🏋️' },
  
  // Legs
  { id: 9, name: 'Приседания со штангой', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'hard', icon: '🏋️' },
  { id: 10, name: 'Жим ногами', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'medium', icon: '🏋️' },
  { id: 11, name: 'Выпады', muscle: 'Ноги', equipment: 'Гантели', difficulty: 'medium', icon: '🏋️' },
  { id: 12, name: 'Сгибание ног', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'easy', icon: '🏋️' },
  
  // Shoulders
  { id: 13, name: 'Жим штанги стоя', muscle: 'Плечи', equipment: 'Штанга', difficulty: 'medium', icon: '🏋️' },
  { id: 14, name: 'Махи гантелями', muscle: 'Плечи', equipment: 'Гантели', difficulty: 'easy', icon: '🏋️' },
  { id: 15, name: 'Тяга к подбородку', muscle: 'Плечи', equipment: 'Штанга', difficulty: 'medium', icon: '🏋️' },
  
  // Arms
  { id: 16, name: 'Подъём штанги на бицепс', muscle: 'Руки', equipment: 'Штанга', difficulty: 'easy', icon: '🏋️' },
  { id: 17, name: 'Французский жим', muscle: 'Руки', equipment: 'Штанга', difficulty: 'medium', icon: '🏋️' },
  { id: 18, name: 'Молотки', muscle: 'Руки', equipment: 'Гантели', difficulty: 'easy', icon: '🏋️' },
  
  // Core
  { id: 19, name: 'Планка', muscle: 'Кор', equipment: 'Без оборудования', difficulty: 'easy', icon: '🧘' },
  { id: 20, name: 'Скручивания', muscle: 'Кор', equipment: 'Без оборудования', difficulty: 'easy', icon: '🧘' },
  { id: 21, name: 'Подъём ног', muscle: 'Кор', equipment: 'Турник', difficulty: 'medium', icon: '🤸' },
];

const generateWorkoutHistory = () => [
  {
    id: 1,
    date: '05.03.2026',
    type: 'Силовая',
    duration: 55,
    exercises: 6,
    totalSets: 18,
    calories: 380,
    volume: '4,250 кг',
  },
  {
    id: 2,
    date: '03.03.2026',
    type: 'Кардио',
    duration: 45,
    exercises: 3,
    totalSets: 0,
    calories: 450,
    volume: '5.2 км',
  },
  {
    id: 3,
    date: '01.03.2026',
    type: 'Силовая',
    duration: 60,
    exercises: 7,
    totalSets: 21,
    calories: 420,
    volume: '5,100 кг',
  },
  {
    id: 4,
    date: '27.02.2026',
    type: 'Фулбоди',
    duration: 70,
    exercises: 8,
    totalSets: 24,
    calories: 520,
    volume: '6,800 кг',
  },
];

const MUSCLE_GROUPS = [
  { id: 'all', label: 'Все', icon: '💪' },
  { id: 'chest', label: 'Грудь', icon: '🫁' },
  { id: 'back', label: 'Спина', icon: '🦴' },
  { id: 'legs', label: 'Ноги', icon: '🦵' },
  { id: 'shoulders', label: 'Плечи', icon: '💪' },
  { id: 'arms', label: 'Руки', icon: '🦾' },
  { id: 'core', label: 'Кор', icon: '🧘' },
];

const EQUIPMENT_FILTER = [
  { id: 'all', label: 'Все' },
  { id: 'barbell', label: 'Штанга' },
  { id: 'dumbbell', label: 'Гантели' },
  { id: 'bodyweight', label: 'Свой вес' },
  { id: 'machine', label: 'Тренажёры' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * RestTimer - Таймер отдыха
 */
const RestTimer = ({ initialTime = 90 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone text-white p-4 shadow-lg z-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">⏱️</div>
            <div>
              <div className="font-semibold">Отдых</div>
              <div className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-14 h-14 rounded-full bg-white text-stone flex items-center justify-center text-2xl font-bold hover:bg-sand transition-all"
            >
              {isRunning ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={reset}
              className="w-14 h-14 rounded-full bg-sand/50 text-white flex items-center justify-center text-xl hover:bg-sand transition-all"
            >
              🔄
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex-1 mx-6">
            <div className="h-2 bg-sand/50 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-white'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-stone/70">
              <span>0:00</span>
              <span>{formatTime(initialTime)}</span>
            </div>
          </div>

          {/* Quick rest times */}
          <div className="flex space-x-2">
            {[30, 60, 90, 120].map((time) => (
              <button
                key={time}
                onClick={() => {
                  setTimeLeft(time);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeLeft === time ? 'bg-white text-stone' : 'bg-sand/50 hover:bg-sand'
                }`}
              >
                {time >= 60 ? `${time/60}м` : `${time}с`}
              </button>
            ))}
          </div>
        </div>

        {isCompleted && (
          <div className="mt-3 text-center text-emerald-300 font-semibold animate-pulse">
            🔔 Время продолжать!
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ExerciseSelector - Выбор упражнения
 */
const ExerciseSelector = ({ exercises, onSelect, selectedMuscle, onMuscleChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.muscle === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-4">Выберите упражнение</h3>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск упражнений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-input w-full pl-10 pr-4 py-2"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MUSCLE_GROUPS.map(group => (
          <button
            key={group.id}
            onClick={() => onMuscleChange(group.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedMuscle === group.id
                ? 'bg-stone text-white'
                : 'bg-sand/50 text-stone hover:bg-sand'
            }`}
          >
            {group.icon} {group.label}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className="w-full flex items-center justify-between p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all text-left"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{exercise.icon}</span>
              <div>
                <div className="font-medium text-stone">{exercise.name}</div>
                <div className="text-xs text-ink-light">{exercise.muscle} • {exercise.equipment}</div>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              exercise.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
              exercise.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {exercise.difficulty === 'easy' ? 'Легко' : exercise.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * SetInput - Ввод подхода
 */
const SetInput = ({ setNumber, exercise, onRemove, onUpdate }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    onUpdate?.({
      setNumber,
      exercise,
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      completed: !isCompleted,
    });
  };

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
      isCompleted ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-sand/50'
    }`}>
      <span className="text-sm font-medium text-stone w-8">#{setNumber}</span>
      
      <div className="flex-1 flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Вес (кг)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="neu-input w-full py-2 text-center"
          />
        </div>
        <span className="text-stone">×</span>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Повторы"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="neu-input w-full py-2 text-center"
          />
        </div>
      </div>

      <button
        onClick={handleComplete}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isCompleted 
            ? 'bg-emerald-500 text-white' 
            : 'bg-sand text-stone hover:bg-stone hover:text-white'
        }`}
      >
        {isCompleted ? '✓' : '○'}
      </button>

      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * WorkoutSummary - Итоги тренировки
 */
const WorkoutSummary = ({ workout, onSave }) => {
  const totalVolume = workout.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
  const completedSets = workout.sets.filter(s => s.completed).length;

  const stats = [
    { label: 'Упражнений', value: workout.exercises.length, icon: '🏋️' },
    { label: 'Подходов', value: `${completedSets}/${workout.sets.length}`, icon: '📊' },
    { label: 'Объём', value: `${(totalVolume / 1000).toFixed(1)}т`, icon: '⚖️' },
    { label: 'Время', value: `${workout.duration} мин`, icon: '⏱️' },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Итоги тренировки</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-sand/50 rounded-xl text-center">
            <span className="text-2xl block mb-2">{stat.icon}</span>
            <div className="text-xl font-bold text-stone">{stat.value}</div>
            <div className="text-xs text-ink-light">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Exercise summary */}
      <div className="space-y-3 mb-6">
        {workout.exercises.map((ex, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
            <span className="font-medium text-stone">{ex.name}</span>
            <span className="text-sm text-ink-light">
              {ex.sets.filter(s => s.completed).length} подходов
            </span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone mb-2">Заметки</label>
        <textarea
          value={workout.notes}
          onChange={(e) => workout.notes = e.target.value}
          className="neu-input w-full"
          rows="3"
          placeholder="Как прошла тренировка?"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => onSave(workout)}
          className="neu-button flex-1 py-3"
        >
          💾 Сохранить
        </button>
        <button className="neu-button-secondary flex-1 py-3">
          📤 Поделиться
        </button>
      </div>
    </div>
  );
};

/**
 * WorkoutHistory - История тренировок
 */
const WorkoutHistory = ({ history }) => {
  const weeklyData = history.slice(0, 7).map((workout, index) => ({
    day: workout.date.split('.')[0],
    duration: workout.duration,
    calories: workout.calories,
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">История тренировок</h3>
        <Link to="/health/fitness-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>

      {/* Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis tick={{ fontSize: 11, fill: '#5c5243' }} />
            <Tooltip />
            <Bar dataKey="duration" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* List */}
      <div className="space-y-3">
        {history.slice(0, 4).map((workout) => (
          <div
            key={workout.id}
            className="flex items-center justify-between p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                🏋️
              </div>
              <div>
                <div className="font-medium text-stone">{workout.type}</div>
                <div className="text-xs text-ink-light">{workout.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-stone">{workout.duration} мин</div>
              <div className="text-xs text-ink-light">{workout.calories} ккал</div>
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

const WorkoutLoggerV1 = () => {
  const [exercises] = useState(generateExerciseLibrary());
  const [history] = useState(generateWorkoutHistory());
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [currentWorkout, setCurrentWorkout] = useState({
    exercises: [],
    sets: [],
    notes: '',
    startTime: Date.now(),
    duration: 0,
  });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [workoutPhase, setWorkoutPhase] = useState('select'); // select, active, summary

  // Timer for workout duration
  useEffect(() => {
    let interval;
    if (workoutPhase === 'active') {
      interval = setInterval(() => {
        setCurrentWorkout(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime) / 1000 / 60),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutPhase]);

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, sets: [] }],
    }));
  };

  const handleAddSet = (exerciseIndex) => {
    setCurrentWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets.push({
        setNumber: newExercises[exerciseIndex].sets.length + 1,
        weight: 0,
        reps: 0,
        completed: false,
      });
      return { ...prev, exercises: newExercises };
    });
    setShowRestTimer(true);
  };

  const handleSaveWorkout = (workout) => {
    console.log('Saving workout:', workout);
    // Здесь будет логика сохранения
    setWorkoutPhase('select');
    setCurrentWorkout({
      exercises: [],
      sets: [],
      notes: '',
      startTime: Date.now(),
      duration: 0,
    });
  };

  const startWorkout = () => {
    if (currentWorkout.exercises.length > 0) {
      setWorkoutPhase('active');
      setCurrentWorkout(prev => ({ ...prev, startTime: Date.now() }));
    }
  };

  const finishWorkout = () => {
    setWorkoutPhase('summary');
    setShowRestTimer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6 pb-32">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">🏋️</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Тренировка</h1>
                <p className="text-ink-light">
                  {workoutPhase === 'select' && 'Выберите упражнения'}
                  {workoutPhase === 'active' && `Время: ${currentWorkout.duration} мин`}
                  {workoutPhase === 'summary' && 'Завершение'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {workoutPhase === 'select' && currentWorkout.exercises.length > 0 && (
              <button onClick={startWorkout} className="neu-button px-4 py-2 rounded-xl font-medium">
                ▶️ Начать
              </button>
            )}
            {workoutPhase === 'active' && (
              <button onClick={finishWorkout} className="neu-button px-4 py-2 rounded-xl font-medium">
                ✅ Завершить
              </button>
            )}
            <Link to="/health/fitness-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {workoutPhase === 'select' && (
          <>
            <ExerciseSelector
              exercises={exercises}
              onSelect={handleSelectExercise}
              selectedMuscle={selectedMuscle}
              onMuscleChange={setSelectedMuscle}
            />

            {/* Current Workout Plan */}
            {currentWorkout.exercises.length > 0 && (
              <div className="neu-card p-6 mt-6">
                <h3 className="text-xl font-bold text-stone mb-4">План тренировки</h3>
                <div className="space-y-4">
                  {currentWorkout.exercises.map((ex, exIndex) => (
                    <div key={exIndex} className="p-4 bg-sand/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{ex.icon}</span>
                          <span className="font-bold text-stone">{ex.name}</span>
                        </div>
                        <button
                          onClick={() => handleAddSet(exIndex)}
                          className="neu-button px-3 py-1 text-sm"
                        >
                          + Подход
                        </button>
                      </div>
                      {ex.sets.map((set, setIndex) => (
                        <SetInput
                          key={setIndex}
                          setNumber={set.setNumber}
                          exercise={ex}
                          onRemove={() => {
                            setCurrentWorkout(prev => {
                              const newExercises = [...prev.exercises];
                              newExercises[exIndex].sets.splice(setIndex, 1);
                              return { ...prev, exercises: newExercises };
                            });
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  onClick={startWorkout}
                  className="mt-6 w-full neu-button py-4 text-lg"
                >
                  🚀 Начать тренировку
                </button>
              </div>
            )}

            {/* History */}
            <div className="mt-6">
              <WorkoutHistory history={history} />
            </div>
          </>
        )}

        {workoutPhase === 'active' && (
          <div className="space-y-6">
            {currentWorkout.exercises.map((ex, exIndex) => (
              <div key={exIndex} className="neu-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{ex.icon}</span>
                    <span className="text-xl font-bold text-stone">{ex.name}</span>
                  </div>
                  <button
                    onClick={() => handleAddSet(exIndex)}
                    className="neu-button px-4 py-2"
                  >
                    + Подход
                  </button>
                </div>
                {ex.sets.map((set, setIndex) => (
                  <SetInput
                    key={setIndex}
                    setNumber={set.setNumber}
                    exercise={ex}
                    onRemove={() => {}}
                    onUpdate={(data) => {
                      console.log('Set updated:', data);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {workoutPhase === 'summary' && (
          <WorkoutSummary
            workout={currentWorkout}
            onSave={handleSaveWorkout}
          />
        )}
      </div>

      {/* Rest Timer */}
      {showRestTimer && workoutPhase === 'active' && (
        <RestTimer initialTime={90} />
      )}
    </div>
  );
};

export default WorkoutLoggerV1;
