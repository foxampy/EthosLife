import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  TrendingUp,
  MapPin,
  Heart,
  Footprints,
  Mountain,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Dumbbell,
  Zap,
  Target,
  Calendar,
  Clock,
  Check,
  X,
  Navigation,
  Wind,
  Thermometer,
  Waves,
} from 'lucide-react';

// ==================== Types ====================

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
  phase: 'warmup' | 'active' | 'cooldown';
}

interface TodayActivity {
  steps: number;
  calories: number;
  activeMinutes: number;
  standHours: number;
  distance: number;
  floors: number;
  heartRate: number;
}

interface RecoveryData {
  score: number;
  sleepImpact: 'positive' | 'neutral' | 'negative';
  muscleFatigue: Record<string, number>;
  recommendation: string;
}

interface WorkoutPhase {
  name: string;
  duration: number;
  description: string;
}

// ==================== Theme Constants ====================

const COLORS = {
  bone: '#e4dfd5',
  stone: '#5c5243',
  ink: '#2d2418',
  shadowLight: 'rgba(255,255,255,0.6)',
  shadowDark: 'rgba(44,40,34,0.15)',
  move: '#ef4444',
  exercise: '#22c55e',
  stand: '#3b82f6',
};

// ==================== Mock Data ====================

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
    { id: 'running', name: 'Running', category: 'Cardio', icon: '🏃' },
    { id: 'cycling', name: 'Cycling', category: 'Cardio', icon: '🚴' },
    { id: 'swimming', name: 'Swimming', category: 'Cardio', icon: '🏊' },
    { id: 'rowing', name: 'Rowing', category: 'Cardio', icon: '🚣' },
    { id: 'elliptical', name: 'Elliptical', category: 'Cardio', icon: '🏃' },
  ],
  flexibility: [
    { id: 'yoga', name: 'Yoga Flow', category: 'Flexibility', icon: '🧘' },
    { id: 'stretching', name: 'Static Stretching', category: 'Flexibility', icon: '🤸' },
    { id: 'mobility', name: 'Mobility Work', category: 'Flexibility', icon: '🔄' },
    { id: 'pilates', name: 'Pilates', category: 'Flexibility', icon: '🤸' },
  ],
};

const WORKOUT_PHASES: WorkoutPhase[] = [
  { name: 'Warm Up', duration: 300, description: 'Light cardio & dynamic stretching' },
  { name: 'Active', duration: 1800, description: 'Main workout phase' },
  { name: 'Cool Down', duration: 300, description: 'Static stretching & recovery' },
];

const VOLUME_DATA = [
  { day: 'Mon', volume: 12500 },
  { day: 'Tue', volume: 15800 },
  { day: 'Wed', volume: 9200 },
  { day: 'Thu', volume: 18400 },
  { day: 'Fri', volume: 14300 },
  { day: 'Sat', volume: 21600 },
  { day: 'Sun', volume: 7800 },
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
];

const WORKOUT_PROGRAMS = [
  { id: 'beginner', name: 'Beginner Full Body', frequency: '3x/week', duration: '45 min', difficulty: 1, color: '#22c55e' },
  { id: 'intermediate', name: 'Upper/Lower Split', frequency: '4x/week', duration: '60 min', difficulty: 2, color: '#f59e0b' },
  { id: 'advanced', name: 'Push/Pull/Legs', frequency: '6x/week', duration: '75 min', difficulty: 3, color: '#ef4444' },
];

// ==================== Neumorphic Styles ====================

const neuStyles = {
  card: `rounded-3xl bg-[#e4dfd5] p-6 shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)]`,
  cardInset: `rounded-3xl bg-[#e4dfd5] p-6 shadow-[inset_8px_8px_16px_rgba(44,40,34,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]`,
  button: `rounded-2xl bg-[#e4dfd5] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200 font-medium text-[#2d2418]`,
  buttonPrimary: `rounded-2xl bg-[#5c5243] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.2),-6px_-6px_12px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] transition-all duration-200 font-medium text-[#e4dfd5]`,
  buttonActive: `rounded-2xl bg-[#ef4444] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.2),-6px_-6px_12px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] transition-all duration-200 font-medium text-white`,
  input: `w-full rounded-xl bg-[#e4dfd5] px-4 py-3 shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-none outline-none focus:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)] transition-all text-[#2d2418] placeholder-[#5c5243]/50`,
  iconButton: `w-10 h-10 rounded-xl bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.12),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] flex items-center justify-center transition-all text-[#5c5243] hover:text-[#2d2418]`,
};

// ==================== Components ====================

// Activity Ring Component
const ActivityRing: React.FC<{
  progress: number;
  color: string;
  size: number;
  strokeWidth: number;
  label: string;
  value: string;
  goal: string;
  icon: React.ElementType;
}> = ({ progress, color, size, strokeWidth, label, value, goal, icon: Icon }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#dcd3c6"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-[#2d2418]">{value}</span>
          <span className="text-xs text-[#5c5243]">/ {goal}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold text-[#2d2418]">{label}</span>
    </div>
  );
};

// Workout Player Component
const WorkoutPlayer: React.FC<{
  isActive: boolean;
  workoutTimer: number;
  currentPhase: string;
  phaseTimeRemaining: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}> = ({ isActive, workoutTimer, currentPhase, phaseTimeRemaining, onStart, onPause, onStop }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const phaseProgress = {
    warmup: currentPhase === 'warmup' ? ((300 - phaseTimeRemaining) / 300) * 100 : currentPhase === 'active' || currentPhase === 'cooldown' ? 100 : 0,
    active: currentPhase === 'active' ? ((1800 - phaseTimeRemaining) / 1800) * 100 : currentPhase === 'cooldown' ? 100 : 0,
    cooldown: currentPhase === 'cooldown' ? ((300 - phaseTimeRemaining) / 300) * 100 : 0,
  };

  return (
    <div className={neuStyles.card}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#2d2418] flex items-center gap-2">
          <Timer className="w-5 h-5 text-[#5c5243]" />
          Workout Player
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isActive ? 'Active' : 'Ready'}
        </div>
      </div>

      {/* Main Timer */}
      <div className="text-center mb-6">
        <div className={`${neuStyles.cardInset} py-8 mb-4`}>
          <motion.span 
            className="text-6xl font-bold text-[#2d2418] font-mono"
            key={workoutTimer}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {formatTime(workoutTimer)}
          </motion.span>
          <p className="text-sm text-[#5c5243] mt-2 capitalize">{currentPhase} Phase</p>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="space-y-3 mb-6">
        {WORKOUT_PHASES.map((phase, idx) => {
          const isActive = phase.name.toLowerCase().replace(' ', '') === currentPhase;
          const progress = phaseProgress[phase.name.toLowerCase().replace(' ', '') as keyof typeof phaseProgress];
          return (
            <div key={phase.name} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                progress >= 100 ? 'bg-emerald-500 text-white' : isActive ? 'bg-[#5c5243] text-[#e4dfd5]' : 'bg-[#e4dfd5] text-[#5c5243]'
              }`}>
                {progress >= 100 ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isActive ? 'font-medium text-[#2d2418]' : 'text-[#5c5243]'}>{phase.name}</span>
                  <span className="text-xs text-[#5c5243]">{formatTime(phase.duration)}</span>
                </div>
                <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-[#5c5243]/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className={`flex-1 ${neuStyles.buttonPrimary} flex items-center justify-center gap-2`}
          >
            <Play className="w-5 h-5" />
            Start Workout
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPause}
              className={`flex-1 ${neuStyles.button} flex items-center justify-center gap-2`}
            >
              <Pause className="w-5 h-5" />
              Pause
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStop}
              className={`${neuStyles.buttonActive} flex items-center justify-center gap-2 px-4`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

// Rest Timer Component
const RestTimer: React.FC<{
  isActive: boolean;
  defaultTime?: number;
  onComplete: () => void;
}> = ({ isActive, defaultTime = 90, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [initialTime, setInitialTime] = useState(defaultTime);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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
    <div className={neuStyles.card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2d2418]">Rest Timer</h3>
        <span className="text-2xl font-bold text-[#5c5243]">{formatTime(timeLeft)}</span>
      </div>
      <div className="flex gap-2 mb-4">
        {[30, 60, 90, 120, 180].map((sec) => (
          <motion.button
            key={sec}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setInitialTime(sec); setTimeLeft(sec); }}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              initialTime === sec 
                ? 'bg-[#5c5243] text-[#e4dfd5]' 
                : 'bg-[#e4dfd5] shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)] text-[#5c5243]'
            }`}
          >
            {sec}s
          </motion.button>
        ))}
      </div>
      <div className="h-3 bg-[#dcd3c6] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ width: '100%' }}
          animate={{ width: `${100 - progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
};

// Exercise Library Card
const ExerciseCard: React.FC<{
  exercise: { id: string; name: string; muscleGroup?: string; category?: string; icon?: string };
  isActive: boolean;
  onAdd: () => void;
}> = ({ exercise, isActive, onAdd }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      disabled={!isActive}
      className={`w-full ${neuStyles.cardInset} p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.15)]`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center text-2xl">
            {exercise.icon || <Dumbbell className="w-6 h-6 text-[#5c5243]" />}
          </div>
          <div>
            <p className="font-medium text-[#2d2418]">{exercise.name}</p>
            <p className="text-xs text-[#5c5243]">{exercise.muscleGroup || exercise.category}</p>
          </div>
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"
          >
            <Plus className="w-5 h-5" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

// Recovery Score Component
const RecoveryScore: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const radius = 50;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={neuStyles.card}>
      <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-500" />
        Recovery Score
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#dcd3c6" strokeWidth="10" />
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={getColor(score)}
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: getColor(score) }}>{score}</span>
            <span className="text-xs text-[#5c5243]">Score</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-[#5c5243]">
          {score >= 80 ? 'Great recovery! Ready for intensity.' : 
           score >= 60 ? 'Moderate recovery. Consider lighter workout.' : 
           'Poor recovery. Focus on rest today.'}
        </p>
      </div>
    </div>
  );
};

// Muscle Fatigue Map
const MuscleFatigueMap: React.FC<{ fatigue: Record<string, number> }> = ({ fatigue }) => {
  const getColor = (level: number) => {
    if (level > 80) return '#ef4444';
    if (level > 50) return '#f97316';
    if (level > 30) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className={neuStyles.card}>
      <h3 className="font-semibold text-[#2d2418] mb-4">Muscle Fatigue</h3>
      <div className="space-y-3">
        {Object.entries(fatigue).map(([muscle, level]) => (
          <div key={muscle} className="flex items-center gap-3">
            <span className="text-sm text-[#5c5243] w-20 capitalize">{muscle}</span>
            <div className="flex-1 h-3 bg-[#dcd3c6] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all duration-700"
                initial={{ width: 0 }}
                animate={{ width: `${level}%` }}
                style={{ backgroundColor: getColor(level) }}
              />
            </div>
            <span className="text-sm font-medium text-[#2d2418] w-10 text-right">{level}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}> = ({ label, value, unit, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={neuStyles.card}
  >
    <div className="flex items-center justify-between mb-3">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div>
      <span className="text-2xl font-bold text-[#2d2418]">{value}</span>
      {unit && <span className="text-sm text-[#5c5243] ml-1">{unit}</span>}
    </div>
    <p className="text-sm text-[#5c5243] mt-1">{label}</p>
  </motion.div>
);

// GPS Tracker Component (Stylized)
const GPSTracker: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTracking) {
      interval = setInterval(() => {
        setDistance((prev) => prev + 0.01);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Generate random route points
  const routePoints = [
    { x: 20, y: 80 },
    { x: 35, y: 70 },
    { x: 50, y: 75 },
    { x: 65, y: 60 },
    { x: 80, y: 50 },
    { x: 85, y: 35 },
    { x: 70, y: 25 },
    { x: 50, y: 30 },
    { x: 35, y: 40 },
    { x: 25, y: 55 },
  ];

  const pathData = routePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className={neuStyles.card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2d2418] flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#5c5243]" />
          GPS Tracker
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsTracking(!isTracking)}
          className={isTracking ? neuStyles.buttonActive : neuStyles.buttonPrimary}
        >
          {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Stylized Map */}
      <div className={`${neuStyles.cardInset} h-48 mb-4 relative overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#dcd3c6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Route path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#5c5243"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          
          {/* Current position */}
          {isTracking && (
            <motion.circle
              cx={routePoints[routePoints.length - 1].x}
              cy={routePoints[routePoints.length - 1].y}
              r="4"
              fill="#ef4444"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Distance</p>
          <p className="text-xl font-bold text-[#2d2418]">{distance.toFixed(2)} km</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Pace</p>
          <p className="text-xl font-bold text-[#2d2418]">5:30 /km</p>
        </div>
      </div>
    </div>
  );
};

// Weekly Calendar
const WeeklyCalendar: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDay, setSelectedDay] = useState(2);
  const workouts = [1, 3, 5]; // Days with workouts

  return (
    <div className={neuStyles.card}>
      <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#5c5243]" />
        Weekly Schedule
      </h3>
      <div className="flex justify-between gap-1">
        {days.map((day, index) => (
          <motion.button
            key={day}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDay(index)}
            className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all ${
              selectedDay === index 
                ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.2)]' 
                : 'bg-[#e4dfd5] shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)] text-[#5c5243]'
            }`}
          >
            <span className="text-xs">{day}</span>
            <div className={`w-2 h-2 rounded-full mt-1 ${
              workouts.includes(index) ? 'bg-emerald-500' : 'bg-[#dcd3c6]'
            }`} />
          </motion.button>
        ))}
      </div>
      <div className={`${neuStyles.cardInset} mt-4 p-4`}>
        <p className="font-medium text-[#2d2418]">
          {selectedDay === 1 ? 'Upper Body Strength' : 
           selectedDay === 3 ? 'Lower Body Power' :
           selectedDay === 5 ? 'Cardio & Core' : 'Rest Day'}
        </p>
        <p className="text-xs text-[#5c5243] mt-1">
          {selectedDay === 1 ? 'Chest, Back, Shoulders • 60 min' : 
           selectedDay === 3 ? 'Legs, Glutes, Calves • 75 min' :
           selectedDay === 5 ? '45 min HIIT session' : 'Focus on recovery and stretching'}
        </p>
      </div>
    </div>
  );
};

// ==================== Main Component ====================

export default function Movement2() {
  const [activeCategory, setActiveCategory] = useState<'strength' | 'cardio' | 'flexibility'>('strength');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string>('Chest');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [currentSet, setCurrentSet] = useState({ reps: 10, weight: 0 });
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'active' | 'cooldown'>('warmup');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(300);

  const [todayActivity] = useState<TodayActivity>({
    steps: 8432,
    calories: 412,
    activeMinutes: 25,
    standHours: 8,
    distance: 5.8,
    floors: 12,
    heartRate: 72,
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
    let interval: ReturnType<typeof setInterval>;
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
        setPhaseTimeRemaining((prev) => {
          if (prev > 0) return prev - 1;
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused]);

  // Phase management
  useEffect(() => {
    if (workoutTimer === 300) {
      setCurrentPhase('active');
      setPhaseTimeRemaining(1800);
    } else if (workoutTimer === 2100) {
      setCurrentPhase('cooldown');
      setPhaseTimeRemaining(300);
    }
  }, [workoutTimer]);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setIsPaused(false);
    setActiveWorkout({
      name: selectedProgram ? WORKOUT_PROGRAMS.find(p => p.id === selectedProgram)?.name || 'Workout' : 'Quick Workout',
      startTime: new Date(),
      exercises: [],
      currentExerciseIndex: 0,
      phase: 'warmup',
    });
    setWorkoutTimer(0);
    setCurrentPhase('warmup');
    setPhaseTimeRemaining(300);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    setActiveWorkout(null);
    setWorkoutTimer(0);
    setShowRestTimer(false);
    setCurrentPhase('warmup');
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
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#e4dfd5]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${neuStyles.card} p-0`}>
              <Activity className="w-6 h-6 text-[#5c5243]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d2418]">Movement</h1>
              <p className="text-sm text-[#5c5243]">Track your activity and crush goals</p>
            </div>
          </div>

          {/* Activity Rings Header */}
          <div className="hidden md:flex items-center gap-6">
            <ActivityRing
              progress={(todayActivity.calories / 600) * 100}
              color={COLORS.move}
              size={80}
              strokeWidth={8}
              label="Move"
              value={todayActivity.calories.toString()}
              goal="600"
              icon={Flame}
            />
            <ActivityRing
              progress={(todayActivity.activeMinutes / 30) * 100}
              color={COLORS.exercise}
              size={80}
              strokeWidth={8}
              label="Exercise"
              value={todayActivity.activeMinutes.toString()}
              goal="30m"
              icon={Timer}
            />
            <ActivityRing
              progress={(todayActivity.standHours / 12) * 100}
              color={COLORS.stand}
              size={80}
              strokeWidth={8}
              label="Stand"
              value={todayActivity.standHours.toString()}
              goal="12h"
              icon={Zap}
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${neuStyles.button} flex items-center gap-2`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Records</span>
            </motion.button>
            <div className={`w-10 h-10 rounded-full ${neuStyles.card} p-0 flex items-center justify-center text-[#5c5243] font-semibold`}>
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Stats & Programs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Steps"
                value={todayActivity.steps.toLocaleString()}
                icon={Footprints}
                color="#3b82f6"
                trend="+12%"
              />
              <StatCard
                label="Distance"
                value={todayActivity.distance}
                unit="km"
                icon={MapPin}
                color="#22c55e"
              />
              <StatCard
                label="Floors"
                value={todayActivity.floors}
                icon={Mountain}
                color="#f59e0b"
              />
              <StatCard
                label="Heart Rate"
                value={todayActivity.heartRate}
                unit="bpm"
                icon={Heart}
                color="#ef4444"
              />
            </div>

            {/* Recovery Score */}
            <RecoveryScore score={recovery.score} />

            {/* Muscle Fatigue */}
            <MuscleFatigueMap fatigue={recovery.muscleFatigue} />

            {/* Workout Programs */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4">Programs</h3>
              <div className="space-y-3">
                {WORKOUT_PROGRAMS.map((program) => (
                  <motion.button
                    key={program.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      selectedProgram === program.id 
                        ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]' 
                        : neuStyles.cardInset
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className={`text-xs ${selectedProgram === program.id ? 'text-[#e4dfd5]/70' : 'text-[#5c5243]'}`}>
                          {program.frequency} • {program.duration}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((star) => (
                          <div
                            key={star}
                            className={`w-2 h-2 rounded-full ${
                              star <= program.difficulty ? 'bg-current' : 'bg-current opacity-30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Weekly Calendar */}
            <WeeklyCalendar />
          </div>

          {/* Center Column - Workout Player & Exercise Library */}
          <div className="lg:col-span-6 space-y-6">
            {/* Workout Player */}
            <WorkoutPlayer
              isActive={isWorkoutActive}
              workoutTimer={workoutTimer}
              currentPhase={currentPhase}
              phaseTimeRemaining={phaseTimeRemaining}
              onStart={startWorkout}
              onPause={pauseWorkout}
              onStop={endWorkout}
            />

            {/* Active Exercise Logger */}
            {isWorkoutActive && activeWorkout && activeWorkout.exercises.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={neuStyles.card}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-[#2d2418]">
                      {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.name}
                    </p>
                    <p className="text-xs text-[#5c5243]">
                      {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.muscleGroup}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#5c5243]">Previous Best</p>
                    <p className="text-sm font-medium text-emerald-600">12 reps × 60kg</p>
                  </div>
                </div>

                {/* Sets Display */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeWorkout.exercises[activeWorkout.currentExerciseIndex]?.sets.map((set, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
                      Set {idx + 1}: {set.reps} × {set.weight}kg
                    </span>
                  ))}
                </div>

                {/* Set Logger */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-[#5c5243] block mb-1">Reps</label>
                    <input
                      type="number"
                      value={currentSet.reps}
                      onChange={(e) => setCurrentSet({ ...currentSet, reps: parseInt(e.target.value) || 0 })}
                      className={neuStyles.input}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#5c5243] block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={currentSet.weight}
                      onChange={(e) => setCurrentSet({ ...currentSet, weight: parseInt(e.target.value) || 0 })}
                      className={neuStyles.input}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logSet}
                    className={`${neuStyles.buttonPrimary} self-end`}
                  >
                    <Check className="w-5 h-5" />
                  </motion.button>
                </div>

                {showRestTimer && <RestTimer isActive={showRestTimer} onComplete={() => setShowRestTimer(false)} />}
              </motion.div>
            )}

            {/* GPS Tracker */}
            <GPSTracker />

            {/* Exercise Library */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#5c5243]" />
                Exercise Library
              </h3>
              
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4 p-1 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                {(['strength', 'cardio', 'flexibility'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                      activeCategory === cat 
                        ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.2)]' 
                        : 'text-[#5c5243] hover:text-[#2d2418]'
                    }`}
                  >
                    {cat}
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        activeMuscleGroup === group 
                          ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[2px_2px_4px_rgba(44,40,34,0.2)]' 
                          : 'bg-[#e4dfd5] text-[#5c5243] shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)]'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              )}

              {/* Exercise List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeCategory === 'strength' ? (
                  MOCK_EXERCISES.strength[activeMuscleGroup as keyof typeof MOCK_EXERCISES.strength]?.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      isActive={isWorkoutActive}
                      onAdd={() => addExercise(exercise.name, exercise.muscleGroup)}
                    />
                  ))
                ) : (
                  MOCK_EXERCISES[activeCategory].map((exercise: any) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      isActive={isWorkoutActive}
                      onAdd={() => addExercise(exercise.name, exercise.category)}
                    />
                  ))
                )}
              </div>

              {!isWorkoutActive && (
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl text-center">
                  <p className="text-sm text-amber-700">Start a workout to add exercises</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startWorkout}
                    className={`mt-2 ${neuStyles.buttonPrimary}`}
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Start Workout
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Records */}
          <div className="lg:col-span-3 space-y-6">
            {/* Training Volume Chart */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#5c5243]" />
                Volume (2 weeks)
              </h3>
              <div className="flex items-end justify-between gap-1 h-32">
                {VOLUME_DATA.map((day, idx) => {
                  const height = (day.volume / 25000) * 100;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                      className="flex-1 bg-gradient-to-t from-[#5c5243] to-[#5c5243]/70 rounded-t-lg"
                    />
                  );
                })}
              </div>
            </div>

            {/* Body Weight Trend */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4">Weight Trend</h3>
              <div className="h-32 relative">
                <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5c5243" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#5c5243" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`M ${BODYWEIGHT_DATA.map((d, i) => `${(i / (BODYWEIGHT_DATA.length - 1)) * 100},${50 - ((d.weight - 78) / 5) * 50}`).join(' L ')}`}
                    fill="none"
                    stroke="#5c5243"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  <path
                    d={`M ${BODYWEIGHT_DATA.map((d, i) => `${(i / (BODYWEIGHT_DATA.length - 1)) * 100},${50 - ((d.weight - 78) / 5) * 50}`).join(' L ')} L 100,50 L 0,50 Z`}
                    fill="url(#weightGradient)"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#5c5243]">
                  <span>Jan</span>
                  <span>Mar</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-[#5c5243]">Current</span>
                <span className="text-xl font-bold text-[#2d2418]">79.2 kg</span>
              </div>
            </div>

            {/* Personal Records */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Personal Records
              </h3>
              <div className="space-y-3">
                {PERSONAL_RECORDS.map((pr, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className={`${neuStyles.cardInset} p-3`}
                  >
                    <p className="font-medium text-[#2d2418] text-sm">{pr.exercise}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-bold text-[#5c5243]">{pr.weight}kg × {pr.reps}</span>
                      <span className="text-xs text-[#5c5243]">{pr.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Goals */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4">Weekly Goals</h3>
              <div className="space-y-4">
                {[
                  { label: 'Workouts', current: 3, goal: 4, color: '#ef4444' },
                  { label: 'Active Minutes', current: 180, goal: 240, color: '#22c55e' },
                  { label: 'Calories Burned', current: 2800, goal: 3500, color: '#f59e0b' },
                ].map((goal) => (
                  <div key={goal.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#5c5243]">{goal.label}</span>
                      <span className="font-medium text-[#2d2418]">{goal.current}/{goal.goal}</span>
                    </div>
                    <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: goal.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.goal) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
