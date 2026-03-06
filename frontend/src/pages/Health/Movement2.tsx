import React, { useState, useEffect, useRef } from 'react';
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
  AreaChart,
  Area,
} from 'recharts';

// Types
interface ExerciseLog {
  id: string;
  name: string;
  muscleGroup: string;
  sets: { reps: number; weight: number }[];
  notes: string;
}

interface ActiveWorkout {
  name: string;
  startTime: Date;
  exercises: ExerciseLog[];
  currentExerciseIndex: number;
}

interface TodayActivity {
  steps: number;
  calories: number;
  activeMinutes: number;
  standHours: number;
  distance: number;
  floors: number;
}

interface RecoveryData {
  score: number;
  sleepImpact: 'positive' | 'neutral' | 'negative';
  muscleFatigue: Record<string, number>;
  recommendation: string;
}

// Mock Data
const MOCK_EXERCISES = {
  strength: {
    Chest: [
      { id: 'bench', name: 'Barbell Bench Press', muscleGroup: 'Chest' },
      { id: 'incline', name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
      { id: 'flyes', name: 'Cable Flyes', muscleGroup: 'Chest' },
      { id: 'pushups', name: 'Push-ups', muscleGroup: 'Chest' },
    ],
    Back: [
      { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back' },
      { id: 'pullups', name: 'Pull-ups', muscleGroup: 'Back' },
      { id: 'rows', name: 'Barbell Rows', muscleGroup: 'Back' },
      { id: 'latpulldown', name: 'Lat Pulldown', muscleGroup: 'Back' },
    ],
    Legs: [
      { id: 'squat', name: 'Barbell Squat', muscleGroup: 'Legs' },
      { id: 'legpress', name: 'Leg Press', muscleGroup: 'Legs' },
      { id: 'lunges', name: 'Walking Lunges', muscleGroup: 'Legs' },
      { id: 'legcurl', name: 'Leg Curl', muscleGroup: 'Legs' },
    ],
    Arms: [
      { id: 'curls', name: 'Bicep Curls', muscleGroup: 'Arms' },
      { id: 'tricep', name: 'Tricep Pushdowns', muscleGroup: 'Arms' },
      { id: 'hammer', name: 'Hammer Curls', muscleGroup: 'Arms' },
      { id: 'dips', name: 'Dips', muscleGroup: 'Arms' },
    ],
    Shoulders: [
      { id: 'overhead', name: 'Overhead Press', muscleGroup: 'Shoulders' },
      { id: 'lateral', name: 'Lateral Raises', muscleGroup: 'Shoulders' },
      { id: 'facepull', name: 'Face Pulls', muscleGroup: 'Shoulders' },
      { id: 'shrugs', name: 'Barbell Shrugs', muscleGroup: 'Shoulders' },
    ],
  },
  cardio: [
    { id: 'running', name: 'Running', category: 'Cardio' },
    { id: 'cycling', name: 'Cycling', category: 'Cardio' },
    { id: 'swimming', name: 'Swimming', category: 'Cardio' },
    { id: 'rowing', name: 'Rowing', category: 'Cardio' },
    { id: 'elliptical', name: 'Elliptical', category: 'Cardio' },
  ],
  flexibility: [
    { id: 'yoga', name: 'Yoga Flow', category: 'Flexibility' },
    { id: 'stretching', name: 'Static Stretching', category: 'Flexibility' },
    { id: 'mobility', name: 'Mobility Work', category: 'Flexibility' },
    { id: 'pilates', name: 'Pilates', category: 'Flexibility' },
  ],
};

const VOLUME_DATA = [
  { day: 'Mon', volume: 12500 },
  { day: 'Tue', volume: 15800 },
  { day: 'Wed', volume: 9200 },
  { day: 'Thu', volume: 18400 },
  { day: 'Fri', volume: 14300 },
  { day: 'Sat', volume: 21600 },
  { day: 'Sun', volume: 7800 },
  { day: 'Mon', volume: 13200 },
  { day: 'Tue', volume: 16500 },
  { day: 'Wed', volume: 0 },
  { day: 'Thu', volume: 19200 },
  { day: 'Fri', volume: 15400 },
  { day: 'Sat', volume: 22800 },
  { day: 'Sun', volume: 8500 },
];

const BODYWEIGHT_DATA = [
  { date: 'Jan 1', weight: 82.5 },
  { date: 'Jan 8', weight: 82.2 },
  { date: 'Jan 15', weight: 81.8 },
  { date: 'Jan 22', weight: 81.4 },
  { date: 'Jan 29', weight: 81.0 },
  { date: 'Feb 5', weight: 80.7 },
  { date: 'Feb 12', weight: 80.3 },
  { date: 'Feb 19', weight: 79.9 },
  { date: 'Feb 26', weight: 79.6 },
  { date: 'Mar 5', weight: 79.2 },
];

const PERSONAL_RECORDS = [
  { exercise: 'Barbell Squat', weight: 140, reps: 5, date: '2 days ago' },
  { exercise: 'Bench Press', weight: 95, reps: 8, date: '1 week ago' },
  { exercise: 'Deadlift', weight: 180, reps: 3, date: '3 days ago' },
  { exercise: 'Overhead Press', weight: 65, reps: 6, date: '2 weeks ago' },
  { exercise: 'Pull-ups', weight: 20, reps: 10, date: '1 week ago' },
];

const WORKOUT_PROGRAMS = [
  { id: 'beginner', name: 'Beginner Full Body', frequency: '3x/week', duration: '45 min', difficulty: 1 },
  { id: 'intermediate', name: 'Upper/Lower Split', frequency: '4x/week', duration: '60 min', difficulty: 2 },
  { id: 'advanced', name: 'Push/Pull/Legs', frequency: '6x/week', duration: '75 min', difficulty: 3 },
];

// Activity Ring Component
const ActivityRing: React.FC<{
  progress: number;
  color: string;
  size: number;
  strokeWidth: number;
  label: string;
  value: string;
  goal: string;
}> = ({ progress, color, size, strokeWidth, label, value, goal }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`${color}20`}
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-ink">{value}</span>
          <span className="text-xs text-ink-light">/ {goal}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-ink">{label}</span>
    </div>
  );
};

// Animated Rings Header Component
const ActivityRingsHeader: React.FC<{ todayActivity: TodayActivity }> = ({ todayActivity }) => {
  const calorieGoal = 600;
  const exerciseGoal = 30;
  const standGoal = 12;

  return (
    <div className="neu-card p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-ink">Movement</h1>
          <p className="text-ink-light">Track your activity and crush your goals</p>
        </div>
        <div className="flex space-x-6">
          <ActivityRing
            progress={(todayActivity.calories / calorieGoal) * 100}
            color="#ef4444"
            size={100}
            strokeWidth={10}
            label="Move"
            value={todayActivity.calories.toString()}
            goal={calorieGoal.toString()}
          />
          <ActivityRing
            progress={(todayActivity.activeMinutes / exerciseGoal) * 100}
            color="#22c55e"
            size={100}
            strokeWidth={10}
            label="Exercise"
            value={todayActivity.activeMinutes.toString()}
            goal={`${exerciseGoal}m`}
          />
          <ActivityRing
            progress={(todayActivity.standHours / standGoal) * 100}
            color="#3b82f6"
            size={100}
            strokeWidth={10}
            label="Stand"
            value={todayActivity.standHours.toString()}
            goal={`${standGoal}h`}
          />
        </div>
      </div>
    </div>
  );
};

// Today's Activity Card
const TodayActivityCard: React.FC<{ todayActivity: TodayActivity }> = ({ todayActivity }) => {
  return (
    <div className="neu-card p-6">
      <h2 className="text-lg font-semibold text-ink mb-4">Today's Activity</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl">👟</div>
          <div>
            <p className="text-2xl font-bold text-ink">{todayActivity.steps.toLocaleString()}</p>
            <p className="text-xs text-ink-light">Steps</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl">📍</div>
          <div>
            <p className="text-2xl font-bold text-ink">{todayActivity.distance.toFixed(1)}</p>
            <p className="text-xs text-ink-light">km distance</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl">🏢</div>
          <div>
            <p className="text-2xl font-bold text-ink">{todayActivity.floors}</p>
            <p className="text-xs text-ink-light">Floors climbed</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl">
          <div className="text-2xl">🔥</div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{todayActivity.calories}</p>
            <p className="text-xs text-ink-light">Active kcal</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-light">Daily goal progress</span>
          <span className="font-medium text-orange-600">68%</span>
        </div>
        <div className="h-2 bg-bone-dark rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: '68%' }} />
        </div>
      </div>
    </div>
  );
};

// Rest Timer Component
const RestTimer: React.FC<{ isActive: boolean; onComplete: () => void }> = ({ isActive, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [initialTime, setInitialTime] = useState(90);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onComplete();
            return initialTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, initialTime, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="neu-card p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-ink">Rest Timer</span>
        <span className="text-2xl font-bold text-orange-600">{formatTime(timeLeft)}</span>
      </div>
      <div className="flex space-x-2 mb-3">
        {[30, 60, 90, 120, 180].map((sec) => (
          <button
            key={sec}
            onClick={() => { setInitialTime(sec); setTimeLeft(sec); }}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              initialTime === sec ? 'bg-orange-500 text-white' : 'bg-sand text-ink-light hover:bg-sand/80'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>
      <div className="h-2 bg-bone-dark rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Muscle Group Visual
const MuscleGroupMap: React.FC<{ fatigue: Record<string, number> }> = ({ fatigue }) => {
  const getColor = (level: number) => {
    if (level > 80) return '#ef4444';
    if (level > 50) return '#f97316';
    if (level > 30) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="neu-card p-4">
      <h3 className="text-sm font-semibold text-ink mb-3">Muscle Fatigue</h3>
      <div className="space-y-2">
        {Object.entries(fatigue).map(([muscle, level]) => (
          <div key={muscle} className="flex items-center space-x-2">
            <span className="text-xs text-ink-light w-16 capitalize">{muscle}</span>
            <div className="flex-1 h-2 bg-bone-dark rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${level}%`, backgroundColor: getColor(level) }}
              />
            </div>
            <span className="text-xs font-medium text-ink">{level}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Weekly Calendar
const WeeklyCalendar: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="neu-card p-4">
      <h3 className="text-sm font-semibold text-ink mb-3">Weekly Schedule</h3>
      <div className="flex justify-between">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              selectedDay === index ? 'bg-orange-500 text-white' : 'bg-sand/50 text-ink-light hover:bg-sand'
            }`}
          >
            <span className="text-xs">{day}</span>
            <div className={`w-2 h-2 rounded-full mt-1 ${
              index === 1 || index === 3 || index === 5 ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </button>
        ))}
      </div>
      <div className="mt-3 p-3 bg-sand/30 rounded-xl">
        <p className="text-sm text-ink font-medium">
          {selectedDay === 1 ? 'Upper Body Strength' : 
           selectedDay === 3 ? 'Lower Body Power' :
           selectedDay === 5 ? 'Cardio & Core' : 'Rest Day'}
        </p>
        <p className="text-xs text-ink-light mt-1">
          {selectedDay === 1 ? 'Chest, Back, Shoulders' : 
           selectedDay === 3 ? 'Legs, Glutes, Calves' :
           selectedDay === 5 ? '45 min session' : 'Focus on recovery'}
        </p>
      </div>
    </div>
  );
};

// Main Component
export default function Movement2() {
  const [activeCategory, setActiveCategory] = useState<'strength' | 'cardio' | 'flexibility'>('strength');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string>('Chest');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentSet, setCurrentSet] = useState({ reps: 10, weight: 0 });
  const [exerciseNotes, setExerciseNotes] = useState('');
  const [showRestTimer, setShowRestTimer] = useState(false);

  const [todayActivity, setTodayActivity] = useState<TodayActivity>({
    steps: 8432,
    calories: 412,
    activeMinutes: 25,
    standHours: 8,
    distance: 5.8,
    floors: 12,
  });

  const [recovery] = useState<RecoveryData>({
    score: 78,
    sleepImpact: 'positive',
    muscleFatigue: {
      chest: 25,
      back: 60,
      legs: 85,
      arms: 40,
      shoulders: 35,
    },
    recommendation: 'Today is good for cardio, avoid heavy leg day',
  });

  // Workout timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const formatWorkoutTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (name: string = 'Quick Workout') => {
    setIsWorkoutActive(true);
    setActiveWorkout({
      name,
      startTime: new Date(),
      exercises: [],
      currentExerciseIndex: 0,
    });
    setWorkoutTimer(0);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setActiveWorkout(null);
    setWorkoutTimer(0);
    setShowRestTimer(false);
  };

  const addExercise = (exerciseName: string, muscleGroup: string) => {
    if (!activeWorkout) return;
    const newExercise: ExerciseLog = {
      id: Date.now().toString(),
      name: exerciseName,
      muscleGroup,
      sets: [],
      notes: '',
    };
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise],
    });
  };

  const logSet = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return;
    const exercises = [...activeWorkout.exercises];
    const currentExercise = exercises[activeWorkout.currentExerciseIndex];
    currentExercise.sets.push({ ...currentSet });
    setActiveWorkout({ ...activeWorkout, exercises });
    setShowRestTimer(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Activity Rings */}
      <ActivityRingsHeader todayActivity={todayActivity} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Today's Activity + Quick Actions */}
        <div className="lg:col-span-3 space-y-6">
          <TodayActivityCard todayActivity={todayActivity} />

          {/* Quick Actions */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => startWorkout()}
                className="w-full neu-button text-sm py-3 flex items-center justify-center space-x-2"
              >
                <span>⚡</span>
                <span>Start Quick Workout</span>
              </button>
              <button className="w-full neu-button neu-button-secondary text-sm py-3 flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>View History</span>
              </button>
              <button className="w-full neu-button neu-button-secondary text-sm py-3 flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Set Goals</span>
              </button>
            </div>
          </div>

          {/* Workout Programs */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Programs</h3>
            <div className="space-y-2">
              {WORKOUT_PROGRAMS.map((program) => (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id === selectedProgram ? null : program.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedProgram === program.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-sand/50 hover:bg-sand text-ink'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{program.name}</p>
                      <p className={`text-xs ${selectedProgram === program.id ? 'text-white/80' : 'text-ink-light'}`}>
                        {program.frequency} • {program.duration}
                      </p>
                    </div>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className={`text-xs ${star <= program.difficulty ? 'text-yellow-400' : 'text-gray-400'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => startWorkout(selectedProgram ? WORKOUT_PROGRAMS.find(p => p.id === selectedProgram)?.name : 'AI Workout')}
              className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
            >
              Start AI-Generated Workout
            </button>
          </div>
        </div>

        {/* Center Panel - Workout Logger */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Workout Display */}
          {isWorkoutActive && activeWorkout && (
            <div className="neu-card p-6 border-2 border-orange-400">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{activeWorkout.name}</h2>
                  <p className="text-sm text-ink-light">
                    Started at {activeWorkout.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-600">{formatWorkoutTime(workoutTimer)}</p>
                  <button 
                    onClick={endWorkout}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    End Workout
                  </button>
                </div>
              </div>

              {/* Exercise Logger */}
              {activeWorkout.exercises.length > 0 && (
                <div className="mb-4 p-4 bg-sand/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-ink">
                        {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.name}
                      </p>
                      <p className="text-xs text-ink-light">
                        {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.muscleGroup}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-light">Previous Best</p>
                      <p className="text-sm font-medium text-green-600">12 reps × 60kg</p>
                    </div>
                  </div>

                  {/* Sets Display */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.sets.map((set, idx) => (
                      <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                        Set {idx + 1}: {set.reps} × {set.weight}kg
                      </span>
                    ))}
                  </div>

                  {/* Set Logger */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <label className="text-xs text-ink-light block mb-1">Reps</label>
                      <input
                        type="number"
                        value={currentSet.reps}
                        onChange={(e) => setCurrentSet({ ...currentSet, reps: parseInt(e.target.value) || 0 })}
                        className="neu-input py-2 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink-light block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={currentSet.weight}
                        onChange={(e) => setCurrentSet({ ...currentSet, weight: parseInt(e.target.value) || 0 })}
                        className="neu-input py-2 text-center"
                      />
                    </div>
                    <button
                      onClick={logSet}
                      className="neu-button py-2 self-end text-sm"
                    >
                      Log Set
                    </button>
                  </div>

                  {/* Notes */}
                  <textarea
                    value={exerciseNotes}
                    onChange={(e) => setExerciseNotes(e.target.value)}
                    placeholder="Add notes about this exercise..."
                    className="neu-input text-sm"
                    rows={2}
                  />
                </div>
              )}

              {showRestTimer && <RestTimer isActive={showRestTimer} onComplete={() => setShowRestTimer(false)} />}
            </div>
          )}

          {/* Exercise Library */}
          <div className="neu-card p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">Exercise Library</h2>
            
            {/* Category Tabs */}
            <div className="flex space-x-2 mb-4">
              {(['strength', 'cardio', 'flexibility'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-sand/50 text-ink-light hover:bg-sand'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Muscle Group Filter (Strength only) */}
            {activeCategory === 'strength' && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(MOCK_EXERCISES.strength).map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveMuscleGroup(group)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeMuscleGroup === group 
                        ? 'bg-stone text-bone' 
                        : 'bg-sand/50 text-ink-light hover:bg-sand'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            )}

            {/* Exercise List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeCategory === 'strength' ? (
                MOCK_EXERCISES.strength[activeMuscleGroup as keyof typeof MOCK_EXERCISES.strength]?.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise.name, exercise.muscleGroup)}
                    disabled={!isWorkoutActive}
                    className="w-full p-3 bg-sand/30 rounded-xl text-left hover:bg-sand/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink text-sm">{exercise.name}</span>
                      {isWorkoutActive && <span className="text-orange-500 text-lg">+</span>}
                    </div>
                  </button>
                ))
              ) : (
                MOCK_EXERCISES[activeCategory].map((exercise: any) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise.name, exercise.category)}
                    disabled={!isWorkoutActive}
                    className="w-full p-3 bg-sand/30 rounded-xl text-left hover:bg-sand/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-ink text-sm">{exercise.name}</span>
                        <span className="text-xs text-ink-light ml-2">({exercise.category})</span>
                      </div>
                      {isWorkoutActive && <span className="text-orange-500 text-lg">+</span>}
                    </div>
                  </button>
                ))
              )}
            </div>

            {!isWorkoutActive && (
              <div className="mt-4 p-4 bg-orange-50 rounded-xl text-center">
                <p className="text-sm text-orange-700">Start a workout to add exercises</p>
                <button 
                  onClick={() => startWorkout()}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all"
                >
                  Start Workout
                </button>
              </div>
            )}
          </div>

          {/* Weekly Calendar */}
          <WeeklyCalendar />
        </div>

        {/* Right Panel - Stats + Recovery + Goals */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recovery Status */}
          <div className="neu-card p-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Recovery Status</h3>
            
            {/* Recovery Score */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#dcd3c6" strokeWidth="8" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke={recovery.score >= 80 ? '#22c55e' : recovery.score >= 60 ? '#eab308' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(recovery.score / 100) * 251} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-ink">{recovery.score}</span>
                </div>
              </div>
            </div>

            {/* Sleep Impact */}
            <div className="flex items-center justify-between p-3 bg-sand/30 rounded-xl mb-3">
              <span className="text-sm text-ink-light">Sleep Impact</span>
              <span className={`text-sm font-medium ${
                recovery.sleepImpact === 'positive' ? 'text-green-600' :
                recovery.sleepImpact === 'negative' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {recovery.sleepImpact === 'positive' ? '😴 Great' :
                 recovery.sleepImpact === 'negative' ? '😴 Poor' : '😴 Okay'}
              </span>
            </div>

            {/* AI Recommendation */}
            <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
              <div className="flex items-start space-x-2">
                <span className="text-lg">🤖</span>
                <p className="text-sm text-ink">{recovery.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Muscle Fatigue Map */}
          <MuscleGroupMap fatigue={recovery.muscleFatigue} />

          {/* Progress Analytics */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Training Volume (2 weeks)</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VOLUME_DATA}>
                  <Bar dataKey="volume" fill="#f97316" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body Weight Trend */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Body Weight Trend</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BODYWEIGHT_DATA}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#f97316" 
                    fill="url(#weightGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Personal Records */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Personal Records 🏆</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {PERSONAL_RECORDS.map((pr, idx) => (
                <div key={idx} className="p-2 bg-sand/30 rounded-lg">
                  <p className="text-sm font-medium text-ink">{pr.exercise}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-orange-600 font-semibold">{pr.weight}kg × {pr.reps}</span>
                    <span className="text-xs text-ink-light">{pr.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="neu-card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">Weekly Goals</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-light">Workouts</span>
                  <span className="font-medium text-ink">3/4</span>
                </div>
                <div className="h-2 bg-bone-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-light">Active Minutes</span>
                  <span className="font-medium text-ink">180/240</span>
                </div>
                <div className="h-2 bg-bone-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-light">Calories Burned</span>
                  <span className="font-medium text-ink">2800/3500</span>
                </div>
                <div className="h-2 bg-bone-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
