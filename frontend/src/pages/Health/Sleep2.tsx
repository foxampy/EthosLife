import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface SleepPhase {
  name: 'Deep' | 'Light' | 'REM' | 'Awake';
  duration: number; // minutes
  percentage: number;
  color: string;
  gradient: string;
}

interface SleepData {
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  score: number;
  phases: SleepPhase[];
  sleepDebt: number; // hours
  efficiency: number; // percentage
}

interface EnvironmentData {
  temperature: number;
  humidity: number;
  noise: number;
  light: number;
}

interface Chronotype {
  id: 'lion' | 'bear' | 'wolf' | 'dolphin';
  name: string;
  description: string;
  optimalBedtime: string;
  optimalWakeTime: string;
  icon: string;
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

const CHRONOTYPES: Chronotype[] = [
  { id: 'lion', name: 'Lion', description: 'Early riser, most alert at noon', optimalBedtime: '22:00', optimalWakeTime: '05:30', icon: '🦁' },
  { id: 'bear', name: 'Bear', description: 'Follows the sun, most productive mid-day', optimalBedtime: '23:00', optimalWakeTime: '07:00', icon: '🐻' },
  { id: 'wolf', name: 'Wolf', description: 'Night owl, most creative at night', optimalBedtime: '00:00', optimalWakeTime: '08:30', icon: '🐺' },
  { id: 'dolphin', name: 'Dolphin', description: 'Light sleeper, anxious but intelligent', optimalBedtime: '23:30', optimalWakeTime: '06:30', icon: '🐬' },
];

const WEEKLY_DATA: SleepData[] = [
  { date: 'Mon', bedTime: '23:00', wakeTime: '06:30', duration: 7.5, score: 78, phases: [], sleepDebt: 0.5, efficiency: 85 },
  { date: 'Tue', bedTime: '22:45', wakeTime: '06:15', duration: 7.5, score: 82, phases: [], sleepDebt: 0.5, efficiency: 88 },
  { date: 'Wed', bedTime: '23:30', wakeTime: '07:00', duration: 7.5, score: 75, phases: [], sleepDebt: 0.5, efficiency: 82 },
  { date: 'Thu', bedTime: '00:00', wakeTime: '07:30', duration: 7.5, score: 68, phases: [], sleepDebt: 0.5, efficiency: 75 },
  { date: 'Fri', bedTime: '23:15', wakeTime: '06:45', duration: 7.5, score: 80, phases: [], sleepDebt: 0.5, efficiency: 86 },
  { date: 'Sat', bedTime: '00:30', wakeTime: '09:00', duration: 8.5, score: 88, phases: [], sleepDebt: -0.5, efficiency: 92 },
  { date: 'Sun', bedTime: '23:00', wakeTime: '07:00', duration: 8.0, score: 85, phases: [], sleepDebt: 0, efficiency: 89 },
];

const LAST_NIGHT: SleepData = {
  date: 'Today',
  bedTime: '23:15',
  wakeTime: '07:00',
  duration: 7.75,
  score: 82,
  phases: [
    { name: 'Deep', duration: 155, percentage: 35, color: '#4f46e5', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Light', duration: 200, percentage: 45, color: '#7c3aed', gradient: 'from-violet-500 to-violet-600' },
    { name: 'REM', duration: 75, percentage: 17, color: '#a855f7', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Awake', duration: 15, percentage: 3, color: '#c084fc', gradient: 'from-fuchsia-400 to-fuchsia-500' },
  ],
  sleepDebt: 0.25,
  efficiency: 88,
};

// ============================================
// NEUMORPHIC STYLES
// ============================================

const neuStyles = {
  container: 'bg-[#e4dfd5] min-h-screen',
  card: 'rounded-3xl bg-[#e4dfd5] p-6 shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]',
  cardInset: 'rounded-3xl bg-[#e4dfd5] p-6 shadow-[inset_6px_6px_12px_rgba(44,40,34,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.5)]',
  button: 'rounded-2xl bg-[#e4dfd5] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200',
  buttonActive: 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
  input: 'rounded-xl bg-[#e4dfd5] px-4 py-3 shadow-[inset_4px_4px_8px_rgba(44,40,34,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-none outline-none focus:ring-2 focus:ring-indigo-400/30',
  circle: 'rounded-full bg-[#e4dfd5] shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)]',
  circleInset: 'rounded-full bg-[#e4dfd5] shadow-[inset_8px_8px_16px_rgba(44,40,34,0.12),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreGradient = (score: number): string => {
  if (score >= 80) return 'from-emerald-400 to-emerald-600';
  if (score >= 60) return 'from-amber-400 to-amber-600';
  return 'from-rose-400 to-rose-600';
};

// ============================================
// COMPONENTS
// ============================================

// Sleep Clock - Circular Phase Chart
const SleepClock: React.FC<{ phases: SleepPhase[]; score: number }> = ({ phases, score }) => {
  const radius = 100;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow ring */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreGradient(score)} opacity-20 blur-xl`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Main clock container */}
      <div className={`absolute inset-0 ${neuStyles.circle} flex items-center justify-center`}>
        <div className={`w-52 h-52 ${neuStyles.circleInset} flex items-center justify-center`}>
          {/* Inner score display */}
          <div className="text-center">
            <motion.span
              className={`text-5xl font-bold ${getScoreColor(score)}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {score}
            </motion.span>
            <p className="text-sm text-[#5c5243] mt-1 font-medium">Sleep Score</p>
          </div>
        </div>
      </div>

      {/* Phase rings */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
        <defs>
          {phases.map((phase, i) => (
            <linearGradient key={phase.name} id={`grad-${phase.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={phase.color} />
              <stop offset="100%" stopColor={phase.color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>
        
        {phases.map((phase, index) => {
          const arcLength = (phase.percentage / 100) * circumference;
          const strokeDasharray = `${arcLength} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += arcLength;

          return (
            <motion.circle
              key={phase.name}
              cx="128"
              cy="128"
              r={radius}
              fill="none"
              stroke={`url(#grad-${phase.name})`}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
            />
          );
        })}
      </svg>

      {/* Phase indicators */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3">
        {phases.map((phase) => (
          <div key={phase.name} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
            <span className="text-xs text-[#5c5243]">{phase.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sleep Score Big Display
const SleepScoreBig: React.FC<{ score: number; quality: string }> = ({ score, quality }) => {
  return (
    <div className={`${neuStyles.card} text-center`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Sleep Quality</h3>
      <div className="relative w-40 h-40 mx-auto mb-4">
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreGradient(score)}`}
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(0,0,0,0.1)',
              '0 0 40px rgba(0,0,0,0.2)',
              '0 0 20px rgba(0,0,0,0.1)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute inset-2 rounded-full bg-[#e4dfd5] flex items-center justify-center">
          <div>
            <span className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</span>
            <p className="text-sm text-[#5c5243] mt-1">{quality}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 text-sm">
        <div className="text-center">
          <p className="text-[#5c5243]">Target</p>
          <p className="font-semibold text-[#2d2418]">85+</p>
        </div>
        <div className="text-center">
          <p className="text-[#5c5243]">Average</p>
          <p className="font-semibold text-[#2d2418]">78</p>
        </div>
        <div className="text-center">
          <p className="text-[#5c5243]">Best</p>
          <p className="font-semibold text-[#2d2418]">94</p>
        </div>
      </div>
    </div>
  );
};

// Sleep Debt Visualizer
const SleepDebt: React.FC<{ debt: number }> = ({ debt }) => {
  const isDebt = debt > 0;
  const percentage = Math.min(Math.abs(debt) / 3 * 100, 100);

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Sleep Debt</h3>
      <div className="relative h-8 rounded-full bg-[#dcd3c6] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] overflow-hidden mb-3">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full ${isDebt ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-[#2d2418]">
            {isDebt ? `-${formatDuration(debt)}` : `+${formatDuration(Math.abs(debt))}`}
          </span>
        </div>
      </div>
      <p className="text-sm text-[#5c5243]">
        {isDebt 
          ? 'You need more sleep to recover. Try going to bed 30 minutes earlier tonight.'
          : 'Great! You have a sleep surplus. Maintain this healthy pattern.'}
      </p>
    </div>
  );
};

// Smart Alarm
const SmartAlarm: React.FC = () => {
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [smartWindow, setSmartWindow] = useState(30);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className={`${neuStyles.card}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2d2418]">Smart Alarm</h3>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`w-14 h-8 rounded-full transition-all duration-300 ${isEnabled ? 'bg-indigo-500' : 'bg-[#dcd3c6]'} shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]`}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-[#e4dfd5] shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
            animate={{ x: isEnabled ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className={`${neuStyles.circleInset} p-6`}>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="text-4xl font-bold text-[#2d2418] bg-transparent border-none outline-none text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#5c5243] mb-2">
          <span>Smart Window</span>
          <span>{smartWindow} min</span>
        </div>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={smartWindow}
          onChange={(e) => setSmartWindow(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(smartWindow - 10) / 50 * 100}%, #dcd3c6 ${(smartWindow - 10) / 50 * 100}%, #dcd3c6 100%)`,
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <p className="text-xs text-[#5c5243] mt-2">Wakes you during light sleep phase</p>
      </div>

      <div className={`${neuStyles.cardInset} p-4`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌅</span>
          <div>
            <p className="text-sm font-medium text-[#2d2418]">Optimal Wake Time</p>
            <p className="text-xs text-[#5c5243]">Between {formatTime('06:30')} - {formatTime('07:00')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sleep Timeline
const SleepTimeline: React.FC<{ data: SleepData }> = ({ data }) => {
  const hours = ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00'];

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Sleep Timeline</h3>
      
      {/* Time markers */}
      <div className="flex justify-between text-xs text-[#5c5243] mb-2 px-2">
        {hours.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      {/* Timeline bar */}
      <div className={`relative h-14 rounded-2xl overflow-hidden mb-4`}>
        <div className="absolute inset-0 bg-[#dcd3c6] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
        
        {/* Phase segments */}
        {data.phases.map((phase, idx) => {
          const width = phase.percentage;
          const left = data.phases.slice(0, idx).reduce((acc, p) => acc + p.percentage, 0);
          
          return (
            <motion.div
              key={phase.name}
              className="absolute h-full cursor-pointer group"
              style={{
                width: `${width}%`,
                left: `${left}%`,
                backgroundColor: phase.color,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ opacity: 0.9 }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#2d2418] text-[#e4dfd5] text-xs px-3 py-1 rounded-lg whitespace-nowrap transition-opacity z-10">
                {phase.name}: {formatDuration(phase.duration / 60)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hypnogram visualization */}
      <div className={`${neuStyles.cardInset} h-32 relative overflow-hidden`}>
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,45 L8,45 L12,35 L16,35 L20,45 L24,25 L28,25 L32,40 L36,40 L40,20 L44,20 L48,35 L52,35 L56,45 L60,30 L64,30 L68,40 L72,40 L76,45 L84,45 L88,35 L92,35 L96,40 L100,40"
            fill="none"
            stroke="url(#sleepGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </svg>
        <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-xs text-[#5c5243]">
          <span>Awake</span>
          <span>REM</span>
          <span>Light</span>
          <span>Deep</span>
        </div>
      </div>
    </div>
  );
};

// Sleep Trends
const SleepTrends: React.FC = () => {
  const maxDuration = Math.max(...WEEKLY_DATA.map(d => d.duration));
  const avgScore = Math.round(WEEKLY_DATA.reduce((acc, d) => acc + d.score, 0) / WEEKLY_DATA.length);

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Weekly Trends</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Avg Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Avg Duration</p>
          <p className="text-2xl font-bold text-[#2d2418]">7.6h</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Consistency</p>
          <p className="text-2xl font-bold text-emerald-600">82%</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className={`${neuStyles.cardInset} p-4`}>
        <div className="flex items-end justify-between gap-2 h-32">
          {WEEKLY_DATA.map((day, idx) => {
            const height = (day.duration / 10) * 100;
            const isBest = day.score === Math.max(...WEEKLY_DATA.map(d => d.score));
            
            return (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <motion.div
                  className="w-full relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={`absolute inset-0 rounded-t-lg ${isBest ? 'bg-gradient-to-t from-indigo-500 to-purple-500' : 'bg-gradient-to-t from-indigo-400/70 to-purple-400/70'}`} />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2d2418] text-[#e4dfd5] text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                    {day.duration}h • {day.score} pts
                  </div>
                </motion.div>
                <span className="text-xs text-[#5c5243] mt-2">{day.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Environment Monitor
const EnvironmentMonitor: React.FC = () => {
  const [envData] = useState<EnvironmentData>({
    temperature: 19,
    humidity: 45,
    noise: 28,
    light: 2,
  });

  const factors = [
    { icon: '🌡️', label: 'Temperature', value: `${envData.temperature}°C`, optimal: '18-20°C', color: 'from-orange-400 to-red-500', percentage: (envData.temperature / 30) * 100 },
    { icon: '💧', label: 'Humidity', value: `${envData.humidity}%`, optimal: '40-60%', color: 'from-blue-400 to-cyan-500', percentage: envData.humidity },
    { icon: '🔊', label: 'Noise', value: `${envData.noise} dB`, optimal: '<30 dB', color: 'from-purple-400 to-violet-500', percentage: (envData.noise / 60) * 100 },
    { icon: '💡', label: 'Light', value: `${envData.light} lux`, optimal: '<5 lux', color: 'from-yellow-400 to-amber-500', percentage: Math.min((envData.light / 10) * 100, 100) },
  ];

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Sleep Environment</h3>
      
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.label} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${neuStyles.cardInset} flex items-center justify-center text-lg`}>
              {factor.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[#5c5243]">{factor.label}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-[#2d2418]">{factor.value}</span>
                  <span className="text-xs text-[#5c5243] ml-2">({factor.optimal})</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${factor.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chronotype Test
const ChronotypeTest: React.FC = () => {
  const [selectedType, setSelectedType] = useState<Chronotype>(CHRONOTYPES[1]);
  const [showTest, setShowTest] = useState(false);

  if (showTest) {
    return (
      <div className={`${neuStyles.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2d2418]">Chronotype Test</h3>
          <button onClick={() => setShowTest(false)} className="text-[#5c5243] hover:text-[#2d2418]">✕</button>
        </div>
        
        <div className="space-y-3 mb-4">
          <p className="text-sm text-[#5c5243]">Select your natural sleep pattern:</p>
          {CHRONOTYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                selectedType.id === type.id
                  ? 'bg-indigo-100 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)]'
                  : 'hover:bg-[#dcd3c6]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <p className="font-medium text-[#2d2418]">{type.name}</p>
                  <p className="text-xs text-[#5c5243]">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            toast.success(`You're a ${selectedType.name}! 🎉`);
            setShowTest(false);
          }}
          className={`${neuStyles.button} w-full text-center font-medium text-[#2d2418]`}
        >
          Confirm Selection
        </button>
      </div>
    );
  }

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Chronotype</h3>
      
      <div className={`${neuStyles.cardInset} p-4 mb-4`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
            {selectedType.icon}
          </div>
          <div>
            <p className="text-xl font-bold text-[#2d2418]">{selectedType.name}</p>
            <p className="text-sm text-[#5c5243]">{selectedType.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Optimal Bedtime</p>
          <p className="text-lg font-semibold text-[#2d2418]">{formatTime(selectedType.optimalBedtime)}</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Optimal Wake</p>
          <p className="text-lg font-semibold text-[#2d2418]">{formatTime(selectedType.optimalWakeTime)}</p>
        </div>
      </div>

      <button
        onClick={() => setShowTest(true)}
        className={`${neuStyles.button} w-full text-center font-medium text-[#2d2418]`}
      >
        Take Test Again
      </button>
    </div>
  );
};

// Phase Breakdown
const PhaseBreakdown: React.FC<{ phases: SleepPhase[] }> = ({ phases }) => {
  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Sleep Phases</h3>
      <div className="space-y-3">
        {phases.map((phase, idx) => (
          <motion.div
            key={phase.name}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-10 h-10 rounded-xl ${neuStyles.cardInset} flex items-center justify-center`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: phase.color }} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#2d2418]">{phase.name}</span>
                <span className="text-sm text-[#5c5243]">{formatDuration(phase.duration / 60)}</span>
              </div>
              <div className="h-2 rounded-full bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: phase.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-[#5c5243] w-10 text-right">{phase.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Recommendations
const SleepRecommendations: React.FC<{ score: number }> = ({ score }) => {
  const recommendations = [
    { icon: '🌙', title: 'Consistent Schedule', desc: 'Go to bed at the same time every night' },
    { icon: '📱', title: 'Screen Break', desc: 'No screens 1 hour before bedtime' },
    { icon: '🌡️', title: 'Cool Room', desc: 'Keep bedroom at 18-20°C' },
    { icon: '☕', title: 'Limit Caffeine', desc: 'No caffeine after 2 PM' },
  ];

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.title}
            className={`flex items-center gap-3 p-3 rounded-xl ${neuStyles.cardInset}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl">{rec.icon}</span>
            <div>
              <p className="font-medium text-[#2d2418]">{rec.title}</p>
              <p className="text-xs text-[#5c5243]">{rec.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Sleep2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'trends'>('overview');

  return (
    <div className={`${neuStyles.container} p-4 md:p-6`}>
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#2d2418] flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌙
              </motion.span>
              Sleep
            </h1>
            <p className="text-[#5c5243] mt-1">Track, analyze, and improve your sleep quality</p>
          </div>
          
          {/* Tab Navigation */}
          <div className={`${neuStyles.cardInset} p-1 flex gap-1`}>
            {(['overview', 'timeline', 'trends'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-[#5c5243] hover:text-[#2d2418]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6">
                <SleepClock phases={LAST_NIGHT.phases} score={LAST_NIGHT.score} />
                <PhaseBreakdown phases={LAST_NIGHT.phases} />
                <ChronotypeTest />
              </div>

              {/* Center Column */}
              <div className="lg:col-span-4 space-y-6">
                <SleepScoreBig score={LAST_NIGHT.score} quality="Good" />
                <SleepDebt debt={LAST_NIGHT.sleepDebt} />
                <EnvironmentMonitor />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                <SmartAlarm />
                <SleepRecommendations score={LAST_NIGHT.score} />
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SleepTimeline data={LAST_NIGHT} />
              <div className="space-y-6">
                <PhaseBreakdown phases={LAST_NIGHT.phases} />
                <EnvironmentMonitor />
              </div>
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="lg:col-span-2">
                <SleepTrends />
              </div>
              <div>
                <SleepDebt debt={LAST_NIGHT.sleepDebt} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sleep2;
