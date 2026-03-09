import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  notes?: string;
}

interface Technique {
  id: string;
  name: string;
  category: 'breathing' | 'meditation' | 'grounding' | 'cbt';
  duration: number;
  description: string;
  color: string;
}

interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

const MOOD_LEVELS = [
  { value: 1, emoji: '😢', label: 'Very Low', color: '#ef4444', gradient: 'from-red-400 to-red-600' },
  { value: 2, emoji: '😔', label: 'Low', color: '#f97316', gradient: 'from-orange-400 to-orange-600' },
  { value: 3, emoji: '😕', label: 'Below Avg', color: '#f59e0b', gradient: 'from-amber-400 to-amber-600' },
  { value: 4, emoji: '😐', label: 'Neutral', color: '#eab308', gradient: 'from-yellow-400 to-yellow-600' },
  { value: 5, emoji: '🙂', label: 'Okay', color: '#84cc16', gradient: 'from-lime-400 to-lime-600' },
  { value: 6, emoji: '😊', label: 'Good', color: '#22c55e', gradient: 'from-green-400 to-green-600' },
  { value: 7, emoji: '😄', label: 'Very Good', color: '#10b981', gradient: 'from-emerald-400 to-emerald-600' },
  { value: 8, emoji: '🤗', label: 'Great', color: '#14b8a6', gradient: 'from-teal-400 to-teal-600' },
  { value: 9, emoji: '🥳', label: 'Excellent', color: '#06b6d4', gradient: 'from-cyan-400 to-cyan-600' },
  { value: 10, emoji: '🤩', label: 'Amazing', color: '#0d9488', gradient: 'from-teal-500 to-teal-700' },
];

const MONTHLY_MOOD_DATA: MoodEntry[] = [
  { date: '1', mood: 6, energy: 7, stress: 4 },
  { date: '3', mood: 5, energy: 6, stress: 5 },
  { date: '5', mood: 7, energy: 8, stress: 3 },
  { date: '7', mood: 6, energy: 6, stress: 4 },
  { date: '9', mood: 8, energy: 8, stress: 2 },
  { date: '11', mood: 7, energy: 7, stress: 3 },
  { date: '13', mood: 5, energy: 5, stress: 6 },
  { date: '15', mood: 6, energy: 6, stress: 4 },
  { date: '17', mood: 8, energy: 9, stress: 2 },
  { date: '19', mood: 7, energy: 7, stress: 3 },
  { date: '21', mood: 6, energy: 6, stress: 5 },
  { date: '23', mood: 8, energy: 8, stress: 2 },
  { date: '25', mood: 9, energy: 9, stress: 1 },
  { date: '27', mood: 7, energy: 7, stress: 3 },
  { date: '29', mood: 8, energy: 8, stress: 2 },
];

const TECHNIQUES: Technique[] = [
  { id: '4-7-8', name: '4-7-8 Breathing', category: 'breathing', duration: 3, description: 'Inhale 4s, hold 7s, exhale 8s', color: 'from-teal-400 to-cyan-500' },
  { id: 'box', name: 'Box Breathing', category: 'breathing', duration: 4, description: 'Equal counts for all phases', color: 'from-blue-400 to-indigo-500' },
  { id: '5-4-3-2-1', name: '5-4-3-2-1 Grounding', category: 'grounding', duration: 5, description: 'Use your senses to ground', color: 'from-purple-400 to-pink-500' },
  { id: 'body-scan', name: 'Body Scan', category: 'meditation', duration: 10, description: 'Progressive relaxation', color: 'from-indigo-400 to-purple-500' },
  { id: 'thought-record', name: 'Thought Record', category: 'cbt', duration: 15, description: 'Challenge negative thoughts', color: 'from-amber-400 to-orange-500' },
  { id: 'worry-time', name: 'Worry Time', category: 'cbt', duration: 20, description: 'Scheduled worry period', color: 'from-rose-400 to-red-500' },
];

const CRISIS_RESOURCES = [
  { country: 'USA', number: '988', name: 'Crisis Lifeline' },
  { country: 'UK', number: '116 123', name: 'Samaritans' },
  { country: 'Global', number: 'Befrienders', name: 'Worldwide Support' },
];

// ============================================
// NEUMORPHIC STYLES
// ============================================

const neuStyles = {
  container: 'bg-[#e4dfd5] min-h-screen',
  card: 'rounded-3xl bg-[#e4dfd5] p-6 shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]',
  cardInset: 'rounded-3xl bg-[#e4dfd5] p-6 shadow-[inset_6px_6px_12px_rgba(44,40,34,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.5)]',
  button: 'rounded-2xl bg-[#e4dfd5] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200',
  input: 'rounded-xl bg-[#e4dfd5] px-4 py-3 shadow-[inset_4px_4px_8px_rgba(44,40,34,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-none outline-none focus:ring-2 focus:ring-teal-400/30',
  circle: 'rounded-full bg-[#e4dfd5] shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)]',
  circleInset: 'rounded-full bg-[#e4dfd5] shadow-[inset_8px_8px_16px_rgba(44,40,34,0.12),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]',
};

// ============================================
// COMPONENTS
// ============================================

// Mood Orb - Large pulsing sphere
const MoodOrb: React.FC<{ mood: number }> = ({ mood }) => {
  const moodData = MOOD_LEVELS.find(m => m.value === mood) || MOOD_LEVELS[4];
  
  return (
    <div className={`${neuStyles.card} flex flex-col items-center`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-6">Mood Orb</h3>
      
      <div className="relative w-48 h-48 mb-6">
        {/* Outer glow */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${moodData.gradient} opacity-30 blur-2xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Main orb */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${moodData.gradient}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            boxShadow: `0 20px 60px ${moodData.color}40`
          }}
        />
        
        {/* Inner content */}
        <div className="absolute inset-4 rounded-full bg-[#e4dfd5] flex items-center justify-center">
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {moodData.emoji}
          </motion.span>
        </div>
      </div>
      
      <p className="text-2xl font-bold text-[#2d2418]">{moodData.label}</p>
      <p className="text-sm text-[#5c5243] mt-1">Level {mood}/10</p>
    </div>
  );
};

// Daily Check-in
const DailyCheckIn: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState(6);
  const [energy, setEnergy] = useState(6);
  const [stress, setStress] = useState(4);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Daily check-in saved! 🌟');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Daily Check-in</h3>
      
      {/* Mood selector */}
      <div className="mb-6">
        <p className="text-sm text-[#5c5243] mb-3">How are you feeling?</p>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_LEVELS.map((m) => (
            <motion.button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all ${
                selectedMood === m.value
                  ? 'bg-gradient-to-br ' + m.gradient + ' text-white shadow-lg scale-110'
                  : 'bg-[#dcd3c6]/50 hover:bg-[#dcd3c6]'
              }`}
              whileHover={{ scale: selectedMood === m.value ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {m.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#5c5243]">Energy Level</span>
            <span className="font-medium text-[#2d2418]">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(energy - 1) / 9 * 100}%, #dcd3c6 ${(energy - 1) / 9 * 100}%, #dcd3c6 100%)`,
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#5c5243]">Stress Level</span>
            <span className="font-medium text-[#2d2418]">{stress}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(stress - 1) / 9 * 100}%, #dcd3c6 ${(stress - 1) / 9 * 100}%, #dcd3c6 100%)`,
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`${neuStyles.button} w-full text-center font-medium ${saved ? 'text-emerald-600' : 'text-[#2d2418]'}`}
      >
        {saved ? '✓ Saved!' : 'Save Check-in'}
      </button>
    </div>
  );
};

// Breathing Guide - 4-7-8 Technique
const BreathingGuide: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    let timer: NodeJS.Timeout;
    const runBreathing = async () => {
      // Inhale (4s)
      setPhase('inhale');
      for (let i = 4; i > 0; i--) {
        setCount(i);
        await new Promise(r => timer = setTimeout(r, 1000));
      }
      
      // Hold (7s)
      setPhase('hold');
      for (let i = 7; i > 0; i--) {
        setCount(i);
        await new Promise(r => timer = setTimeout(r, 1000));
      }
      
      // Exhale (8s)
      setPhase('exhale');
      for (let i = 8; i > 0; i--) {
        setCount(i);
        await new Promise(r => timer = setTimeout(r, 1000));
      }
      
      runBreathing();
    };

    runBreathing();
    return () => clearTimeout(timer);
  }, [isActive]);

  const phaseConfig = {
    inhale: { scale: 1.3, label: 'Inhale', color: 'from-teal-400 to-cyan-500', duration: 4 },
    hold: { scale: 1.3, label: 'Hold', color: 'from-blue-400 to-indigo-500', duration: 7 },
    exhale: { scale: 1, label: 'Exhale', color: 'from-purple-400 to-pink-500', duration: 8 },
  };

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Breathing Guide</h3>
      <p className="text-sm text-[#5c5243] mb-6">4-7-8 Technique for relaxation</p>

      <div className="flex flex-col items-center mb-6">
        {/* Breathing circle */}
        <div className="relative w-48 h-48 mb-6">
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseConfig[phase].color}`}
            animate={{ 
              scale: phaseConfig[phase].scale,
              opacity: isActive ? 0.6 : 0.3
            }}
            transition={{ 
              duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.3,
              ease: phase === 'exhale' ? 'easeInOut' : 'easeOut'
            }}
          />
          
          <div className={`absolute inset-4 rounded-full ${neuStyles.circleInset} flex items-center justify-center`}>
            <div className="text-center">
              {isActive ? (
                <>
                  <motion.span 
                    className="text-4xl font-bold text-[#2d2418]"
                    key={count}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {count}
                  </motion.span>
                  <p className="text-sm text-[#5c5243] mt-1">{phaseConfig[phase].label}</p>
                </>
              ) : (
                <span className="text-4xl">🧘</span>
              )}
            </div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-4 mb-6">
          {(['inhale', 'hold', 'exhale'] as const).map((p) => (
            <div
              key={p}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                phase === p && isActive
                  ? 'bg-gradient-to-r ' + phaseConfig[p].color + ' text-white'
                  : 'bg-[#dcd3c6]/50 text-[#5c5243]'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)} ({phaseConfig[p].duration}s)
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`${neuStyles.button} px-8 ${isActive ? 'text-rose-500' : 'text-teal-600'}`}
        >
          {isActive ? 'Stop' : 'Start Breathing'}
        </button>
      </div>
    </div>
  );
};

// Mood Timeline
const MoodTimeline: React.FC = () => {
  const maxMood = 10;
  
  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Mood Timeline</h3>
      
      <div className={`${neuStyles.cardInset} p-4 mb-4`}>
        <div className="h-40 relative">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute w-full border-t border-[#dcd3c6]"
              style={{ top: `${pct}%` }}
            />
          ))}
          
          {/* SVG Chart */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <motion.path
              d={`M 0,${100 - (MONTHLY_MOOD_DATA[0].mood / maxMood) * 100} ` +
                MONTHLY_MOOD_DATA.slice(1).map((d, i) => 
                  `L ${((i + 1) / (MONTHLY_MOOD_DATA.length - 1)) * 100},${100 - (d.mood / maxMood) * 100}`
                ).join(' ')}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            {/* Area fill */}
            <motion.path
              d={`M 0,100 L 0,${100 - (MONTHLY_MOOD_DATA[0].mood / maxMood) * 100} ` +
                MONTHLY_MOOD_DATA.slice(1).map((d, i) => 
                  `L ${((i + 1) / (MONTHLY_MOOD_DATA.length - 1)) * 100},${100 - (d.mood / maxMood) * 100}`
                ).join(' ') +
                ` L 100,100 Z`}
              fill="url(#moodGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </svg>
          
          {/* Data points */}
          {MONTHLY_MOOD_DATA.map((d, i) => (
            <motion.div
              key={d.date}
              className="absolute w-3 h-3 rounded-full bg-teal-500 border-2 border-[#e4dfd5]"
              style={{
                left: `${(i / (MONTHLY_MOOD_DATA.length - 1)) * 100}%`,
                top: `${100 - (d.mood / maxMood) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-[#5c5243] mt-2">
          <span>1st</span>
          <span>15th</span>
          <span>30th</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Average</p>
          <p className="text-xl font-bold text-teal-600">6.8</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Best</p>
          <p className="text-xl font-bold text-emerald-600">9</p>
        </div>
        <div className={`${neuStyles.cardInset} p-3 text-center`}>
          <p className="text-xs text-[#5c5243]">Streak</p>
          <p className="text-xl font-bold text-indigo-600">5 days</p>
        </div>
      </div>
    </div>
  );
};

// CBT Tools
const CBTTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState({ for: '', against: '' });

  const tools = [
    { id: 'thought-record', name: 'Thought Record', icon: '📝', color: 'from-blue-400 to-indigo-500' },
    { id: 'abc', name: 'ABC Worksheet', icon: '🔤', color: 'from-purple-400 to-pink-500' },
    { id: 'behavioral', name: 'Behavioral Activation', icon: '🎯', color: 'from-amber-400 to-orange-500' },
    { id: 'worry-tree', name: 'Worry Tree', icon: '🌳', color: 'from-emerald-400 to-teal-500' },
  ];

  if (activeTool === 'thought-record') {
    return (
      <div className={`${neuStyles.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2d2418]">Thought Record</h3>
          <button onClick={() => setActiveTool(null)} className="text-[#5c5243] hover:text-[#2d2418]">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#5c5243] block mb-2">Negative Thought</label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="What thought is bothering you?"
              className={`${neuStyles.input} w-full min-h-[80px] resize-none`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#5c5243] block mb-2">Evidence For</label>
              <textarea
                value={evidence.for}
                onChange={(e) => setEvidence({ ...evidence, for: e.target.value })}
                placeholder="Facts that support this thought"
                className={`${neuStyles.input} w-full min-h-[80px] resize-none`}
              />
            </div>
            <div>
              <label className="text-sm text-[#5c5243] block mb-2">Evidence Against</label>
              <textarea
                value={evidence.against}
                onChange={(e) => setEvidence({ ...evidence, against: e.target.value })}
                placeholder="Facts that contradict this thought"
                className={`${neuStyles.input} w-full min-h-[80px] resize-none`}
              />
            </div>
          </div>

          <button
            onClick={() => {
              toast.success('Thought record saved!');
              setThought('');
              setEvidence({ for: '', against: '' });
              setActiveTool(null);
            }}
            className={`${neuStyles.button} w-full text-center font-medium text-[#2d2418]`}
          >
            Save Record
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">CBT Tools</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`${neuStyles.cardInset} p-4 text-left transition-all hover:scale-[1.02]`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl mb-2`}>
              {tool.icon}
            </div>
            <p className="font-medium text-[#2d2418] text-sm">{tool.name}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Meditation Player
const MeditationPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    { name: 'Morning Calm', duration: 600, color: 'from-amber-400 to-orange-500' },
    { name: 'Stress Relief', duration: 900, color: 'from-teal-400 to-cyan-500' },
    { name: 'Deep Sleep', duration: 1200, color: 'from-indigo-400 to-purple-500' },
    { name: 'Focus Boost', duration: 480, color: 'from-emerald-400 to-teal-500' },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return p + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Meditation</h3>
      
      {/* Player */}
      <div className={`${neuStyles.cardInset} p-6 mb-4 text-center`}>
        <motion.div
          className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${tracks[currentTrack].color} mb-4 flex items-center justify-center`}
          animate={{ 
            scale: isPlaying ? [1, 1.05, 1] : 1,
            rotate: isPlaying ? 360 : 0
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
        >
          <span className="text-3xl">🧘</span>
        </motion.div>
        
        <h4 className="text-lg font-semibold text-[#2d2418]">{tracks[currentTrack].name}</h4>
        <p className="text-sm text-[#5c5243]">{formatTime(tracks[currentTrack].duration)}</p>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 rounded-full bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${tracks[currentTrack].color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)}
            className={`${neuStyles.button} p-3`}
          >
            ⏮
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${neuStyles.button} p-4 text-2xl`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
            className={`${neuStyles.button} p-3`}
          >
            ⏭
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {tracks.map((track, idx) => (
          <button
            key={track.name}
            onClick={() => {
              setCurrentTrack(idx);
              setProgress(0);
              setIsPlaying(false);
            }}
            className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all ${
              currentTrack === idx
                ? 'bg-gradient-to-r ' + track.color + ' text-white'
                : 'bg-[#dcd3c6]/30 hover:bg-[#dcd3c6]/50'
            }`}
          >
            <span className="font-medium">{track.name}</span>
            <span className="text-sm opacity-70">{formatTime(track.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Stress Thermometer
const StressThermometer: React.FC = () => {
  const [level, setLevel] = useState(4);
  
  const getColor = (l: number) => {
    if (l <= 3) return 'from-emerald-400 to-green-500';
    if (l <= 6) return 'from-amber-400 to-yellow-500';
    return 'from-rose-400 to-red-500';
  };

  const getLabel = (l: number) => {
    if (l <= 2) return 'Relaxed';
    if (l <= 4) return 'Mild';
    if (l <= 6) return 'Moderate';
    if (l <= 8) return 'High';
    return 'Severe';
  };

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Stress Level</h3>
      
      <div className="flex items-center gap-4">
        {/* Thermometer visual */}
        <div className="relative w-12 h-48">
          <div className="absolute inset-0 rounded-full bg-[#dcd3c6] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)]" />
          <motion.div
            className={`absolute bottom-0 left-1 right-1 rounded-full bg-gradient-to-t ${getColor(level)}`}
            animate={{ height: `${(level / 10) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-red-500" />
        </div>
        
        {/* Controls */}
        <div className="flex-1">
          <div className="text-center mb-4">
            <motion.span
              className="text-4xl font-bold"
              key={level}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {level}
            </motion.span>
            <p className={`text-lg font-medium ${level > 6 ? 'text-rose-500' : level > 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {getLabel(level)}
            </p>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full h-4 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)'
            }}
          />
          
          <div className="flex justify-between text-xs text-[#5c5243] mt-2">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      {level > 6 && (
        <motion.div
          className="mt-4 p-3 bg-rose-50 rounded-xl text-sm text-rose-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          High stress detected. Try a breathing exercise or take a short walk.
        </motion.div>
      )}
    </div>
  );
};

// Gratitude Journal
const GratitudeJournal: React.FC = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([
    { id: '1', content: 'Sunny weather today', date: 'Today' },
    { id: '2', content: 'Great conversation with a friend', date: 'Yesterday' },
    { id: '3', content: 'Delicious home-cooked meal', date: '2 days ago' },
  ]);
  const [newEntry, setNewEntry] = useState('');

  const handleAdd = () => {
    if (!newEntry.trim()) return;
    setEntries([{ id: Date.now().toString(), content: newEntry, date: 'Today' }, ...entries]);
    setNewEntry('');
    toast.success('Gratitude entry added! 💚');
  };

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Gratitude Journal</h3>
      
      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What are you grateful for?"
          className={`${neuStyles.input} flex-1`}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className={`${neuStyles.button} px-4`}
        >
          💚
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            className={`${neuStyles.cardInset} p-3 flex items-start gap-3`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span className="text-lg">💚</span>
            <div className="flex-1">
              <p className="text-sm text-[#2d2418]">{entry.content}</p>
              <p className="text-xs text-[#5c5243] mt-1">{entry.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Assessment Cards (PHQ-9, GAD-7, PSS)
const AssessmentCards: React.FC = () => {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const assessments = [
    { id: 'phq9', name: 'PHQ-9', desc: 'Depression screening', questions: 9, color: 'from-blue-400 to-indigo-500', icon: '💙' },
    { id: 'gad7', name: 'GAD-7', desc: 'Anxiety screening', questions: 7, color: 'from-amber-400 to-orange-500', icon: '💛' },
    { id: 'pss', name: 'PSS', desc: 'Stress scale', questions: 10, color: 'from-rose-400 to-red-500', icon: '❤️' },
  ];

  if (activeAssessment) {
    const assessment = assessments.find(a => a.id === activeAssessment)!;
    return (
      <div className={`${neuStyles.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2d2418]">{assessment.name}</h3>
          <button onClick={() => { setActiveAssessment(null); setAnswers([]); }} className="text-[#5c5243] hover:text-[#2d2418]">✕</button>
        </div>
        
        <p className="text-sm text-[#5c5243] mb-4">Over the last 2 weeks, how often have you been bothered by:</p>
        
        <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
          {Array.from({ length: Math.min(assessment.questions, 4) }).map((_, i) => (
            <div key={i} className={`${neuStyles.cardInset} p-3`}>
              <p className="text-sm text-[#2d2418] mb-2">Question {i + 1}</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[i] = val;
                      setAnswers(newAnswers);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                      answers[i] === val
                        ? 'bg-gradient-to-r ' + assessment.color + ' text-white'
                        : 'bg-[#dcd3c6]/50 hover:bg-[#dcd3c6]'
                    }`}
                  >
                    {['Not at all', 'Several days', 'More than half', 'Nearly every day'][val]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            toast.success('Assessment completed! Check your results.');
            setActiveAssessment(null);
            setAnswers([]);
          }}
          className={`${neuStyles.button} w-full text-center font-medium bg-gradient-to-r ${assessment.color} text-white`}
        >
          Complete Assessment
        </button>
      </div>
    );
  }

  return (
    <div className={`${neuStyles.card}`}>
      <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Assessments</h3>
      
      <div className="space-y-3">
        {assessments.map((a) => (
          <motion.button
            key={a.id}
            onClick={() => setActiveAssessment(a.id)}
            className={`w-full ${neuStyles.cardInset} p-4 flex items-center gap-4 text-left transition-all hover:scale-[1.02]`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl`}>
              {a.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2d2418]">{a.name}</h4>
              <p className="text-sm text-[#5c5243]">{a.desc}</p>
            </div>
            <span className="text-xs text-[#5c5243]">{a.questions} Qs</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Emergency Help
const EmergencyHelp: React.FC = () => {
  const [showContacts, setShowContacts] = useState(false);

  if (showContacts) {
    return (
      <div className={`${neuStyles.card} border-2 border-rose-300`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-rose-600">Crisis Support</h3>
          <button onClick={() => setShowContacts(false)} className="text-[#5c5243]">✕</button>
        </div>
        
        <div className="space-y-3">
          {CRISIS_RESOURCES.map((resource) => (
            <div key={resource.country} className={`${neuStyles.cardInset} p-3 flex items-center justify-between`}>
              <div>
                <p className="font-medium text-[#2d2418]">{resource.country}</p>
                <p className="text-xs text-[#5c5243]">{resource.name}</p>
              </div>
              <a
                href={`tel:${resource.number.replace(/\D/g, '')}`}
                className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-rose-600 transition-colors"
              >
                {resource.number}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => setShowContacts(true)}
      className={`w-full ${neuStyles.card} border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center text-2xl shadow-lg">
          🆘
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-rose-600">Need Help Now?</h3>
          <p className="text-sm text-[#5c5243]">Tap for crisis support resources</p>
        </div>
      </div>
    </motion.button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Psychology2: React.FC = () => {
  const [currentMood, setCurrentMood] = useState(6);
  const [activeTab, setActiveTab] = useState<'mood' | 'tools' | 'progress'>('mood');

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
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                🧠
              </motion.span>
              Psychology
            </h1>
            <p className="text-[#5c5243] mt-1">Nurture your mental wellness</p>
          </div>
          
          {/* Tab Navigation */}
          <div className={`${neuStyles.cardInset} p-1 flex gap-1`}>
            {(['mood', 'tools', 'progress'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
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
          {activeTab === 'mood' && (
            <motion.div
              key="mood"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6">
                <MoodOrb mood={currentMood} />
                <DailyCheckIn />
              </div>

              {/* Center Column */}
              <div className="lg:col-span-4 space-y-6">
                <BreathingGuide />
                <StressThermometer />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                <MoodTimeline />
                <GratitudeJournal />
                <EmergencyHelp />
              </div>
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CBTTools />
              <MeditationPlayer />
              <BreathingGuide />
              <AssessmentCards />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="lg:col-span-2">
                <MoodTimeline />
              </div>
              <div className="space-y-6">
                <AssessmentCards />
                <GratitudeJournal />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Psychology2;
