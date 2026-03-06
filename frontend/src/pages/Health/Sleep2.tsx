import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Type Definitions
interface SleepPhase {
  name: string;
  duration: number; // minutes
  percentage: number;
  color: string;
  icon: string;
}

interface SleepFactor {
  id: string;
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
  icon: string;
}

interface HygieneItem {
  id: string;
  label: string;
  completed: boolean;
  icon: string;
}

interface TrendPoint {
  day: string;
  duration: number;
  quality: number;
}

interface Chronotype {
  id: 'lion' | 'bear' | 'wolf' | 'dolphin';
  name: string;
  description: string;
  optimalBedtime: string;
  optimalWakeTime: string;
  icon: string;
}

interface AlarmSound {
  id: string;
  name: string;
  icon: string;
}

interface SleepState {
  lastNight: {
    date: string;
    bedTime: string;
    wakeTime: string;
    duration: number;
    score: number;
    phases: {
      deep: number;
      light: number;
      rem: number;
      awake: number;
    };
    factors: SleepFactor[];
  };
  goals: {
    duration: number;
    bedTime: string;
    wakeTime: string;
    chronotype: 'lion' | 'bear' | 'wolf' | 'dolphin';
  };
  hygiene: {
    checklist: HygieneItem[];
    score: number;
  };
}

// Constants
const CHRONOTYPES: Chronotype[] = [
  { id: 'lion', name: 'Lion', description: 'Early riser, most alert at noon', optimalBedtime: '22:00', optimalWakeTime: '05:30', icon: '🦁' },
  { id: 'bear', name: 'Bear', description: 'Follows the sun, most productive mid-day', optimalBedtime: '23:00', optimalWakeTime: '07:00', icon: '🐻' },
  { id: 'wolf', name: 'Wolf', description: 'Night owl, most creative at night', optimalBedtime: '00:00', optimalWakeTime: '08:30', icon: '🐺' },
  { id: 'dolphin', name: 'Dolphin', description: 'Light sleeper, anxious but intelligent', optimalBedtime: '23:30', optimalWakeTime: '06:30', icon: '🐬' },
];

const ALARM_SOUNDS: AlarmSound[] = [
  { id: 'gentle', name: 'Gentle Bells', icon: '🔔' },
  { id: 'nature', name: 'Forest Birds', icon: '🐦' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
  { id: 'melody', name: 'Soft Melody', icon: '🎵' },
  { id: 'energy', name: 'Energizing', icon: '⚡' },
];

const PHASES: SleepPhase[] = [
  { name: 'Deep', duration: 155, percentage: 35, color: '#4f46e5', icon: '🌙' },
  { name: 'Light', duration: 200, percentage: 45, color: '#7c3aed', icon: '☁️' },
  { name: 'REM', duration: 89, percentage: 20, color: '#a855f7', icon: '✨' },
  { name: 'Awake', duration: 10, percentage: 2, color: '#c084fc', icon: '👁️' },
];

const INITIAL_HYGIENE: HygieneItem[] = [
  { id: 'caffeine', label: 'No caffeine after 14:00', completed: true, icon: '☕' },
  { id: 'meal', label: 'Light dinner 3h before bed', completed: true, icon: '🍽️' },
  { id: 'screens', label: 'No screens 1h before bed', completed: false, icon: '📱' },
  { id: 'temperature', label: 'Cool room (18-20°)', completed: true, icon: '🌡️' },
  { id: 'bedtime', label: 'Consistent bedtime', completed: true, icon: '🕐' },
  { id: 'winddown', label: 'Wind-down routine', completed: true, icon: '🧘' },
  { id: 'darkness', label: 'Dark & quiet room', completed: true, icon: '🌑' },
];

const SLEEP_FACTORS: SleepFactor[] = [
  { id: 'caffeine', name: 'Caffeine', impact: 'neutral', value: 'Last coffee at 2pm', icon: '☕' },
  { id: 'meal', name: 'Late Meal', impact: 'positive', value: 'Dinner 4h before bed', icon: '🍽️' },
  { id: 'exercise', name: 'Exercise', impact: 'positive', value: 'Workout 6h ago', icon: '💪' },
  { id: 'screen', name: 'Screen Time', impact: 'negative', value: '2h before bed', icon: '📱' },
  { id: 'stress', name: 'Stress Level', impact: 'neutral', value: 'Moderate (5/10)', icon: '😌' },
];

const TREND_DATA: TrendPoint[] = [
  { day: 'Mon', duration: 7.2, quality: 78 },
  { day: 'Tue', duration: 6.8, quality: 72 },
  { day: 'Wed', duration: 7.5, quality: 85 },
  { day: 'Thu', duration: 7.0, quality: 75 },
  { day: 'Fri', duration: 6.5, quality: 68 },
  { day: 'Sat', duration: 8.2, quality: 88 },
  { day: 'Sun', duration: 7.4, quality: 82 },
];

// Helper Functions
const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}min`;
};

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-rose-500';
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-rose-500';
};

// Components
const CircularScore: React.FC<{ score: number; size?: number }> = ({ score, size = 160 }) => {
  const radius = (size - 16) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#dcd3c6"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${getScoreBg(score)} transition-all duration-1000 ease-out`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-ink-light">Sleep Score</span>
      </div>
    </div>
  );
};

const SleepTimeline: React.FC<{ bedTime: string; wakeTime: string; phases: SleepPhase[] }> = ({ bedTime, wakeTime, phases }) => {
  const totalMinutes = phases.reduce((acc, p) => acc + p.duration, 0);
  const startHour = 23;
  const hours = Array.from({ length: 9 }, (_, i) => (startHour + i) % 24);

  return (
    <div className="space-y-4">
      {/* Time markers */}
      <div className="flex justify-between text-xs text-ink-light px-2">
        {hours.map((h) => (
          <span key={h}>{h}:00</span>
        ))}
      </div>
      
      {/* Timeline bar */}
      <div className="relative h-12 bg-sand rounded-xl overflow-hidden shadow-neu-inset">
        {phases.map((phase, idx) => {
          const width = (phase.duration / totalMinutes) * 100;
          const prevWidth = phases.slice(0, idx).reduce((acc, p) => acc + (p.duration / totalMinutes) * 100, 0);
          return (
            <div
              key={phase.name}
              className="absolute h-full transition-all duration-500 hover:opacity-80 cursor-pointer group"
              style={{
                width: `${width}%`,
                left: `${prevWidth}%`,
                backgroundColor: phase.color,
                opacity: 0.85,
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-ink text-bone text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                {phase.name}: {formatDuration(phase.duration)}
              </div>
            </div>
          );
        })}
        
        {/* Awake markers */}
        <div className="absolute top-0 w-1 h-full bg-rose-400" style={{ left: '35%' }}>
          <div className="absolute -top-5 -left-3 text-xs text-rose-500">Awake</div>
        </div>
        <div className="absolute top-0 w-1 h-full bg-rose-400" style={{ left: '72%' }}>
          <div className="absolute -top-5 -left-3 text-xs text-rose-500">Awake</div>
        </div>
      </div>
      
      {/* Hypnogram visualization */}
      <div className="h-24 bg-sand rounded-xl p-3 shadow-neu-inset relative overflow-hidden">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hypnoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d="M0,45 L5,45 L10,35 L15,35 L20,45 L25,25 L30,25 L35,45 L40,45 L45,15 L50,15 L55,35 L60,35 L65,45 L70,25 L75,25 L80,35 L85,45 L90,45 L95,35 L100,35"
            fill="none"
            stroke="url(#hypnoGradient)"
            strokeWidth="2"
            className="drop-shadow-md"
          />
          {/* Deep sleep zones */}
          <rect x="20" y="20" width="15" height="30" fill="#4f46e5" opacity="0.3" rx="2" />
          <rect x="45" y="10" width="12" height="40" fill="#4f46e5" opacity="0.3" rx="2" />
          <rect x="70" y="20" width="10" height="30" fill="#4f46e5" opacity="0.3" rx="2" />
        </svg>
        <div className="absolute left-2 top-2 text-xs text-ink-light flex flex-col gap-1">
          <span>Awake</span>
          <span>REM</span>
          <span>Light</span>
          <span>Deep</span>
        </div>
      </div>
    </div>
  );
};

const PhaseBreakdown: React.FC<{ phases: SleepPhase[] }> = ({ phases }) => {
  return (
    <div className="space-y-3">
      {phases.map((phase) => (
        <div key={phase.name} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${phase.color}20` }}>
            {phase.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-ink">{phase.name} Sleep</span>
              <span className="text-sm text-ink-light">{formatDuration(phase.duration)}</span>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden shadow-neu-inset">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${phase.percentage}%`, backgroundColor: phase.color }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-ink-light w-12 text-right">{phase.percentage}%</span>
        </div>
      ))}
    </div>
  );
};

const FactorCard: React.FC<{ factor: SleepFactor }> = ({ factor }) => {
  const impactColors = {
    positive: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    negative: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-sand text-ink-light border-clay/30',
  };

  const impactLabels = {
    positive: 'Good',
    negative: 'Poor',
    neutral: 'Okay',
  };

  return (
    <div className="neu-card p-4 hover:scale-[1.02] transition-transform cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-xl">
            {factor.icon}
          </div>
          <div>
            <p className="font-medium text-ink">{factor.name}</p>
            <p className="text-xs text-ink-light">{factor.value}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-lg border ${impactColors[factor.impact]}`}>
          {impactLabels[factor.impact]}
        </span>
      </div>
    </div>
  );
};

const HygieneChecklist: React.FC<{ 
  items: HygieneItem[]; 
  onToggle: (id: string) => void;
  score: number;
}> = ({ items, onToggle, score }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-light">Checklist Score</span>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}%</span>
      </div>
      <div className="h-2 bg-sand rounded-full overflow-hidden shadow-neu-inset">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              item.completed ? 'bg-indigo-50' : 'bg-sand/50 hover:bg-sand'
            }`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggle(item.id)}
              className="w-5 h-5 rounded border-clay text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-lg">{item.icon}</span>
            <span className={`flex-1 text-sm ${item.completed ? 'text-ink line-through opacity-60' : 'text-ink'}`}>
              {item.label}
            </span>
            {item.completed && <span className="text-emerald-500 text-lg">✓</span>}
          </label>
        ))}
      </div>
    </div>
  );
};

const SmartAlarm: React.FC<{
  alarmTime: string;
  setAlarmTime: (time: string) => void;
  smartWindow: number;
  setSmartWindow: (window: number) => void;
  selectedChronotype: Chronotype;
  setSelectedChronotype: (c: Chronotype) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
}> = ({
  alarmTime,
  setAlarmTime,
  smartWindow,
  setSmartWindow,
  selectedChronotype,
  setSelectedChronotype,
  selectedSound,
  setSelectedSound,
}) => {
  const calculateOptimalBedtime = () => {
    const [hours, minutes] = alarmTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const sleepNeeded = 8 * 60; // 8 hours
    const bedtimeMinutes = totalMinutes - sleepNeeded;
    const bedtimeHours = Math.floor((bedtimeMinutes + 1440) % 1440 / 60);
    const bedtimeMins = (bedtimeMinutes + 1440) % 60;
    return `${String(bedtimeHours).padStart(2, '0')}:${String(bedtimeMins).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Alarm Time */}
      <div>
        <label className="block text-sm font-semibold text-stone mb-2">Alarm Time</label>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="neu-input flex-1 text-center text-2xl font-bold"
          />
          <button className="neu-button px-4 py-3">
            ⏰
          </button>
        </div>
      </div>

      {/* Smart Wake Window */}
      <div>
        <label className="block text-sm font-semibold text-stone mb-2">
          Smart Wake Window: <span className="text-indigo-600">{smartWindow} min</span>
        </label>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={smartWindow}
          onChange={(e) => setSmartWindow(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <p className="text-xs text-ink-light mt-1">Wakes you during light sleep phase</p>
      </div>

      {/* Chronotype Selector */}
      <div>
        <label className="block text-sm font-semibold text-stone mb-2">Chronotype</label>
        <div className="grid grid-cols-2 gap-2">
          {CHRONOTYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedChronotype(type)}
              className={`p-3 rounded-xl text-left transition-all ${
                selectedChronotype.id === type.id
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'bg-sand border-2 border-transparent hover:bg-sand/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{type.icon}</span>
                <span className="font-medium text-sm">{type.name}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-light mt-2">{selectedChronotype.description}</p>
      </div>

      {/* Optimal Bedtime */}
      <div className="neu-card p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-light">Recommended Bedtime</p>
            <p className="text-xl font-bold text-indigo-700">{formatTime(calculateOptimalBedtime())}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-light">Optimal for {selectedChronotype.name}</p>
            <p className="text-sm text-indigo-600">{formatTime(selectedChronotype.optimalBedtime)}</p>
          </div>
        </div>
      </div>

      {/* Sound Selector */}
      <div>
        <label className="block text-sm font-semibold text-stone mb-2">Wake Sound</label>
        <div className="grid grid-cols-2 gap-2">
          {ALARM_SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => setSelectedSound(sound.id)}
              className={`p-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                selectedSound === sound.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-sand text-ink-light hover:bg-sand/80'
              }`}
            >
              <span>{sound.icon}</span>
              <span>{sound.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SleepTrends: React.FC<{ data: TrendPoint[] }> = ({ data }) => {
  const maxDuration = Math.max(...data.map(d => d.duration));
  const minDuration = Math.min(...data.map(d => d.duration));
  const avgQuality = Math.round(data.reduce((acc, d) => acc + d.quality, 0) / data.length);
  const consistencyScore = Math.round(100 - (maxDuration - minDuration) * 10);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="neu-card p-3 text-center">
          <p className="text-xs text-ink-light">Avg Quality</p>
          <p className={`text-xl font-bold ${getScoreColor(avgQuality)}`}>{avgQuality}</p>
        </div>
        <div className="neu-card p-3 text-center">
          <p className="text-xs text-ink-light">Consistency</p>
          <p className={`text-xl font-bold ${getScoreColor(consistencyScore)}`}>{consistencyScore}%</p>
        </div>
        <div className="neu-card p-3 text-center">
          <p className="text-xs text-ink-light">Sleep Debt</p>
          <p className="text-xl font-bold text-rose-500">-2.4h</p>
        </div>
      </div>

      {/* Duration Chart */}
      <div>
        <h4 className="text-sm font-semibold text-stone mb-3">7-Day Duration</h4>
        <div className="h-32 flex items-end justify-between gap-2 bg-sand rounded-xl p-4 shadow-neu-inset">
          {data.map((point, idx) => {
            const height = (point.duration / 10) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="relative w-full group">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-indigo-400 hover:to-purple-300"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-ink text-bone text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                    {point.duration}h
                  </div>
                </div>
                <span className="text-xs text-ink-light mt-2">{point.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality Trend */}
      <div>
        <h4 className="text-sm font-semibold text-stone mb-3">Quality Trend</h4>
        <div className="h-20 relative bg-sand rounded-xl p-3 shadow-neu-inset overflow-hidden">
          <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <polyline
              points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${40 - (d.quality / 100) * 40}`).join(' ')}
              fill="none"
              stroke="url(#trendGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * 100}
                cy={40 - (d.quality / 100) * 40}
                r="3"
                fill={d.quality >= 80 ? '#10b981' : d.quality >= 60 ? '#8b5cf6' : '#f59e0b'}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Insight */}
      <div className="neu-card p-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-ink text-sm">Sleep Insight</p>
            <p className="text-xs text-ink-light mt-1">
              Your sleep quality improves by 15% on days with consistent bedtimes. 
              Try to maintain a regular schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnvironmentalFactors: React.FC = () => {
  const [envData] = useState({
    temperature: 19,
    humidity: 45,
    noise: 28,
    light: 2,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-stone">Environment</h4>
      
      {/* Temperature */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🌡️</div>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-light">Temperature</span>
            <span className="font-medium">{envData.temperature}°C</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 rounded-full"
              style={{ width: `${(envData.temperature / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Humidity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">💧</div>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-light">Humidity</span>
            <span className="font-medium">{envData.humidity}%</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${envData.humidity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Noise */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">🔊</div>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-light">Noise Level</span>
            <span className="font-medium">{envData.noise} dB</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${(envData.noise / 60) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Light */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-xl">💡</div>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-light">Light Exposure</span>
            <span className="font-medium">{envData.light} lux</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${Math.min((envData.light / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Sleep2: React.FC = () => {
  const [sleepState] = useState<SleepState>({
    lastNight: {
      date: '2026-03-05',
      bedTime: '23:15',
      wakeTime: '06:30',
      duration: 454, // 7h 34min
      score: 82,
      phases: { deep: 155, light: 200, rem: 89, awake: 10 },
      factors: SLEEP_FACTORS,
    },
    goals: {
      duration: 480, // 8 hours
      bedTime: '23:00',
      wakeTime: '07:00',
      chronotype: 'bear',
    },
    hygiene: {
      checklist: INITIAL_HYGIENE,
      score: 86,
    },
  });

  const [hygieneItems, setHygieneItems] = useState<HygieneItem[]>(INITIAL_HYGIENE);
  const [alarmTime, setAlarmTime] = useState('06:30');
  const [smartWindow, setSmartWindow] = useState(30);
  const [selectedChronotype, setSelectedChronotype] = useState<Chronotype>(CHRONOTYPES[1]);
  const [selectedSound, setSelectedSound] = useState('gentle');

  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const addSleepMutation = useMutation(
    async (data: any) => {
      const duration = calculateDuration(data.bedtime, data.waketime);
      await api.post('/health/metrics', {
        category: 'sleep',
        metricType: 'duration',
        value: duration,
        unit: 'hours',
        notes: `Quality: ${data.quality}/10`
      });
    },
    {
      onSuccess: () => {
        toast.success('Sleep logged successfully!');
        queryClient.invalidateQueries('dashboard');
        reset();
      },
      onError: () => {
        toast.error('Failed to log sleep');
      }
    }
  );

  const calculateDuration = (bedtime: string, waketime: string): number => {
    const bed = new Date(`2000-01-01T${bedtime}`);
    let wake = new Date(`2000-01-01T${waketime}`);
    if (wake < bed) wake.setDate(wake.getDate() + 1);
    return parseFloat(((wake.getTime() - bed.getTime()) / (1000 * 60 * 60)).toFixed(1));
  };

  const onSubmit = (data: any) => {
    addSleepMutation.mutate(data);
  };

  const handleHygieneToggle = (id: string) => {
    setHygieneItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const score = Math.round((updated.filter(i => i.completed).length / updated.length) * 100);
      return updated;
    });
  };

  const hygieneScore = Math.round((hygieneItems.filter(i => i.completed).length / hygieneItems.length) * 100);

  const durationDiff = sleepState.lastNight.duration - sleepState.goals.duration;
  const durationDiffText = durationDiff >= 0 
    ? `+${formatDuration(durationDiff)} vs goal`
    : `${formatDuration(Math.abs(durationDiff))} under goal`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse">🌙</div>
        <div className="absolute top-40 right-20 text-2xl opacity-30">✨</div>
        <div className="absolute top-60 left-1/4 text-xl opacity-20">⭐</div>
        <div className="absolute top-32 right-1/3 text-lg opacity-25">✦</div>
        <div className="absolute bottom-40 left-20 text-2xl opacity-20">⭐</div>
        <div className="absolute bottom-60 right-40 text-xl opacity-30">✨</div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span>🌙</span>
                Sleep
              </h1>
              <p className="text-indigo-200">Track, analyze, and improve your sleep quality</p>
            </div>
            
            {/* Sleep Score Hero */}
            <div className="neu-card p-6 flex items-center gap-6 bg-white/5 backdrop-blur-sm border-white/10">
              <CircularScore score={sleepState.lastNight.score} size={140} />
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-ink-light">Last Night</p>
                  <p className="text-2xl font-bold text-ink">{formatDuration(sleepState.lastNight.duration)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${durationDiff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {durationDiffText}
                  </span>
                </div>
                <p className="text-xs text-ink-light">
                  {formatTime(sleepState.lastNight.bedTime)} - {formatTime(sleepState.lastNight.wakeTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Sleep Timeline & Phases */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sleep Timeline */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>📊</span> Sleep Timeline
              </h3>
              <SleepTimeline 
                bedTime={sleepState.lastNight.bedTime}
                wakeTime={sleepState.lastNight.wakeTime}
                phases={PHASES}
              />
            </div>

            {/* Phase Breakdown */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>🧠</span> Sleep Phases
              </h3>
              <PhaseBreakdown phases={PHASES} />
            </div>

            {/* Environmental Factors */}
            <div className="neu-card p-5">
              <EnvironmentalFactors />
            </div>
          </div>

          {/* Center Panel - Factors & Trends */}
          <div className="lg:col-span-5 space-y-6">
            {/* Sleep Factors */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>🔍</span> Sleep Quality Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SLEEP_FACTORS.map((factor) => (
                  <FactorCard key={factor.id} factor={factor} />
                ))}
              </div>
            </div>

            {/* Sleep Trends */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>📈</span> Sleep Trends
              </h3>
              <SleepTrends data={TREND_DATA} />
            </div>

            {/* Quick Log */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4">Quick Sleep Log</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-light mb-1">Bedtime</label>
                  <input 
                    type="time" 
                    {...register('bedtime', { required: true })} 
                    defaultValue="23:00"
                    className="neu-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-light mb-1">Wake time</label>
                  <input 
                    type="time" 
                    {...register('waketime', { required: true })} 
                    defaultValue="07:00"
                    className="neu-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-ink-light mb-1">Quality (1-10)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="7"
                    {...register('quality')} 
                    className="w-full accent-indigo-600"
                  />
                </div>
                <button 
                  type="submit" 
                  className="neu-button col-span-2 w-full"
                  disabled={addSleepMutation.isLoading}
                >
                  {addSleepMutation.isLoading ? 'Logging...' : 'Log Sleep'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Smart Alarm & Hygiene */}
          <div className="lg:col-span-3 space-y-6">
            {/* Smart Alarm */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>⏰</span> Smart Alarm
              </h3>
              <SmartAlarm
                alarmTime={alarmTime}
                setAlarmTime={setAlarmTime}
                smartWindow={smartWindow}
                setSmartWindow={setSmartWindow}
                selectedChronotype={selectedChronotype}
                setSelectedChronotype={setSelectedChronotype}
                selectedSound={selectedSound}
                setSelectedSound={setSelectedSound}
              />
            </div>

            {/* Sleep Hygiene Checklist */}
            <div className="neu-card p-5">
              <h3 className="text-lg font-semibold text-stone mb-4 flex items-center gap-2">
                <span>✅</span> Sleep Hygiene
              </h3>
              <HygieneChecklist
                items={hygieneItems}
                onToggle={handleHygieneToggle}
                score={hygieneScore}
              />
            </div>

            {/* Sleep Tips */}
            <div className="neu-card p-5 bg-gradient-to-br from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold text-stone mb-3">💡 Sleep Tips</h3>
              <ul className="space-y-2 text-sm text-ink-light">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Aim for 7-9 hours of quality sleep</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Keep a consistent sleep schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Avoid caffeine after 2 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Create a relaxing bedtime routine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep2;
