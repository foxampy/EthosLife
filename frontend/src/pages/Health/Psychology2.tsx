import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import {
  HeartIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  BoltIcon,
  BookOpenIcon,
  MicrophoneIcon,
  CameraIcon,
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PhoneIcon,
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ClockIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  stress: number;
  anxiety: number;
  focus: number;
  emotions: string[];
  triggers: string[];
  notes?: string;
}

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: number;
  aiAnalysis?: AIAnalysis;
  voiceNote?: string;
  photo?: string;
}

interface AIAnalysis {
  sentiment: number;
  themes: string[];
  suggestedTechniques: string[];
  distortions: string[];
  summary: string;
}

interface AssessmentResult {
  date: Date;
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately severe' | 'severe';
  answers: number[];
}

interface AssessmentHistory {
  type: 'phq9' | 'gad7' | 'pss';
  results: AssessmentResult[];
}

interface ThoughtRecord {
  id: string;
  date: Date;
  situation: string;
  automaticThoughts: string;
  emotions: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  actionPlan: string;
}

interface Technique {
  id: string;
  name: string;
  category: 'breathing' | 'meditation' | 'grounding' | 'relaxation' | 'cbt';
  duration: number;
  description: string;
  steps: string[];
  isFavorite: boolean;
}

interface TechniqueSession {
  techniqueId: string;
  completedAt: Date;
  duration: number;
}

interface PsychologyState {
  todayCheckIn: {
    mood: number;
    energy: number;
    stress: number;
    anxiety: number;
    focus: number;
    emotions: string[];
    triggers: string[];
  };
  journal: {
    entries: JournalEntry[];
    currentEntry: string;
  };
  assessments: {
    phq9: AssessmentResult | null;
    gad7: AssessmentResult | null;
    pss: AssessmentResult | null;
    history: AssessmentHistory[];
  };
  techniques: {
    favorites: string[];
    completed: TechniqueSession[];
  };
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

const MOOD_EMOJIS = [
  { value: 1, emoji: '😢', label: 'Very Low', color: '#ef4444' },
  { value: 2, emoji: '😔', label: 'Low', color: '#f97316' },
  { value: 3, emoji: '😕', label: 'Below Average', color: '#f59e0b' },
  { value: 4, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { value: 5, emoji: '🙂', label: 'Okay', color: '#84cc16' },
  { value: 6, emoji: '😊', label: 'Good', color: '#22c55e' },
  { value: 7, emoji: '😄', label: 'Very Good', color: '#10b981' },
  { value: 8, emoji: '🤗', label: 'Great', color: '#14b8a6' },
  { value: 9, emoji: '🥳', label: 'Excellent', color: '#06b6d4' },
  { value: 10, emoji: '🤩', label: 'Amazing', color: '#0d9488' },
];

const EMOTION_TAGS = [
  { id: 'happy', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'calm', label: 'Calm', color: 'bg-teal-100 text-teal-800' },
  { id: 'anxious', label: 'Anxious', color: 'bg-orange-100 text-orange-800' },
  { id: 'tired', label: 'Tired', color: 'bg-gray-100 text-gray-800' },
  { id: 'motivated', label: 'Motivated', color: 'bg-green-100 text-green-800' },
  { id: 'stressed', label: 'Stressed', color: 'bg-red-100 text-red-800' },
  { id: 'grateful', label: 'Grateful', color: 'bg-pink-100 text-pink-800' },
  { id: 'frustrated', label: 'Frustrated', color: 'bg-purple-100 text-purple-800' },
  { id: 'hopeful', label: 'Hopeful', color: 'bg-blue-100 text-blue-800' },
  { id: 'lonely', label: 'Lonely', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'excited', label: 'Excited', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-rose-100 text-rose-800' },
];

const TRIGGER_TAGS = [
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'finances', label: 'Finances', icon: '💰' },
  { id: 'weather', label: 'Weather', icon: '🌤️' },
  { id: 'exercise', label: 'Exercise', icon: '🏃' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'news', label: 'News', icon: '📰' },
];

const PLUTCHIK_EMOTIONS = [
  { name: 'Joy', color: '#fbbf24', angle: 0, dyads: ['Love', 'Submission', 'Optimism'] },
  { name: 'Trust', color: '#34d399', angle: 45, dyads: ['Love', 'Curiosity', 'Fatalism'] },
  { name: 'Fear', color: '#60a5fa', angle: 90, dyads: ['Submission', 'Curiosity', 'Anxiety'] },
  { name: 'Surprise', color: '#a78bfa', angle: 135, dyads: ['Curiosity', 'Awe', 'Disapproval'] },
  { name: 'Sadness', color: '#94a3b8', angle: 180, dyads: ['Remorse', 'Disapproval', 'Pessimism'] },
  { name: 'Disgust', color: '#a3e635', angle: 225, dyads: ['Remorse', 'Contempt', 'Morbidness'] },
  { name: 'Anger', color: '#f87171', angle: 270, dyads: ['Aggressiveness', 'Contempt', 'Pride'] },
  { name: 'Anticipation', color: '#fb923c', angle: 315, dyads: ['Optimism', 'Aggressiveness', 'Hope'] },
];

const TECHNIQUES: Technique[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    category: 'breathing',
    duration: 3,
    description: 'Inhale for 4 counts, hold for 7, exhale for 8',
    steps: ['Sit comfortably', 'Inhale through nose (4 counts)', 'Hold breath (7 counts)', 'Exhale through mouth (8 counts)', 'Repeat 3-4 times'],
    isFavorite: false,
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'breathing',
    duration: 4,
    description: 'Equal counts for inhale, hold, exhale, hold',
    steps: ['Inhale (4 counts)', 'Hold (4 counts)', 'Exhale (4 counts)', 'Hold (4 counts)', 'Repeat cycle'],
    isFavorite: true,
  },
  {
    id: '5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    category: 'grounding',
    duration: 5,
    description: 'Use your senses to ground yourself in the present',
    steps: ['5 things you can SEE', '4 things you can TOUCH', '3 things you can HEAR', '2 things you can SMELL', '1 thing you can TASTE'],
    isFavorite: false,
  },
  {
    id: 'body-scan',
    name: 'Quick Body Scan',
    category: 'meditation',
    duration: 5,
    description: 'Scan your body for tension and release it',
    steps: ['Close your eyes', 'Start at your toes', 'Move up through body', 'Notice tension areas', 'Breathe into tight spots'],
    isFavorite: false,
  },
  {
    id: 'pmr',
    name: 'Progressive Muscle Relaxation',
    category: 'relaxation',
    duration: 10,
    description: 'Tense and release muscle groups',
    steps: ['Start with hands', 'Tense for 5 seconds', 'Release suddenly', 'Feel the difference', 'Move to next muscle group'],
    isFavorite: false,
  },
  {
    id: 'worry-time',
    name: 'Worry Time',
    category: 'cbt',
    duration: 15,
    description: 'Schedule dedicated time for worries',
    steps: ['Set a timer', 'Write all worries', 'No action needed', 'When timer ends, stop', 'Return to present'],
    isFavorite: false,
  },
];

const CRISIS_RESOURCES = [
  { country: 'USA', hotline: '988', name: 'Suicide & Crisis Lifeline' },
  { country: 'UK', hotline: '116 123', name: 'Samaritans' },
  { country: 'Canada', hotline: '1-833-456-4566', name: 'Talk Suicide Canada' },
  { country: 'Australia', hotline: '13 11 14', name: 'Lifeline Australia' },
  { country: 'Global', hotline: 'Befrienders Worldwide', name: 'International Support' },
];

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateMockMoodData = (): MoodEntry[] => {
  const data: MoodEntry[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      id: `mood-${i}`,
      date,
      mood: Math.floor(Math.random() * 4) + 5 + (Math.random() > 0.8 ? -2 : 0),
      energy: Math.floor(Math.random() * 5) + 5,
      stress: Math.floor(Math.random() * 6) + 2,
      anxiety: Math.floor(Math.random() * 5) + 3,
      focus: Math.floor(Math.random() * 4) + 6,
      emotions: ['calm', Math.random() > 0.5 ? 'happy' : 'tired'].filter(Boolean),
      triggers: Math.random() > 0.7 ? ['work'] : [],
    });
  }
  return data;
};

const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000),
    content: 'Today was a challenging day at work. I felt overwhelmed by the deadlines, but I managed to complete most of my tasks. I\'m proud of myself for staying focused.',
    mood: 6,
    aiAnalysis: {
      sentiment: 0.6,
      themes: ['work stress', 'accomplishment', 'resilience'],
      suggestedTechniques: ['4-7-8 Breathing', 'Worry Time'],
      distortions: ['All-or-nothing thinking'],
      summary: 'Mixed day with work challenges but personal growth',
    },
  },
  {
    id: '2',
    date: new Date(Date.now() - 172800000),
    content: 'Had a great workout this morning! Feeling energized and motivated. The endorphins really helped my mood throughout the day.',
    mood: 8,
    aiAnalysis: {
      sentiment: 0.9,
      themes: ['exercise', 'energy', 'wellbeing'],
      suggestedTechniques: ['Body Scan Meditation'],
      distortions: [],
      summary: 'Positive experience with exercise boosting mood',
    },
  },
];

// ============================================
// UTILITY COMPONENTS
// ============================================

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, onChange, min = 1, max = 10, icon, color = 'bg-teal-500' }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-stone">{icon}</span>}
        <span className="text-sm font-medium text-ink">{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color: color.replace('bg-', '').replace('-500', '') === 'teal' ? '#14b8a6' : color }}>
        {value}/{max}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-sand rounded-lg appearance-none cursor-pointer accent-teal-600"
      style={{
        background: `linear-gradient(to right, ${color === 'bg-teal-500' ? '#14b8a6' : color} 0%, ${color === 'bg-teal-500' ? '#14b8a6' : color} ${((value - min) / (max - min)) * 100}%, #d4ccb8 ${((value - min) / (max - min)) * 100}%, #d4ccb8 100%)`
      }}
    />
    <div className="flex justify-between text-xs text-ink-light mt-1">
      <span>Low</span>
      <span>High</span>
    </div>
  </div>
);

const Tag: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
  icon?: string;
}> = ({ label, selected, onClick, color = 'bg-teal-100 text-teal-800', icon }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      selected
        ? 'ring-2 ring-offset-1 ring-teal-500 scale-105'
        : 'hover:scale-105'
    } ${color}`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </button>
);

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, className = '', title, icon, action }) => (
  <div className={`neu-card p-5 ${className}`}>
    {(title || icon || action) && (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-teal-600">{icon}</span>}
          {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Psychology2() {
  // State
  const [activeTab, setActiveTab] = useState<'checkin' | 'journal' | 'assessments' | 'techniques'>('checkin');
  const [moodData] = useState<MoodEntry[]>(generateMockMoodData());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [currentJournal, setCurrentJournal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeAssessment, setActiveAssessment] = useState<'phq9' | 'gad7' | 'pss' | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [bodySensations, setBodySensations] = useState<string[]>([]);
  const [playingTechnique, setPlayingTechnique] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');

  // Check-in state
  const [checkIn, setCheckIn] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    anxiety: 5,
    focus: 5,
    emotions: [] as string[],
    triggers: [] as string[],
  });

  // Thought record state
  const [thoughtRecord, setThoughtRecord] = useState<Partial<ThoughtRecord>>({
    situation: '',
    automaticThoughts: '',
    emotions: '',
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    actionPlan: '',
  });

  // Assessment answers
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);

  // Derived values
  const currentMoodEmoji = useMemo(() => {
    return MOOD_EMOJIS.find(m => m.value === checkIn.mood) || MOOD_EMOJIS[4];
  }, [checkIn.mood]);

  const averageMood = useMemo(() => {
    return moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length;
  }, [moodData]);

  // Effects
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handlers
  const handleSaveCheckIn = () => {
    toast.success('Daily check-in saved! 🌟');
  };

  const handleSaveJournal = () => {
    if (!currentJournal.trim()) {
      toast.error('Please write something first');
      return;
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      content: currentJournal,
      mood: checkIn.mood,
      aiAnalysis: {
        sentiment: 0.7,
        themes: ['self-reflection', 'daily check-in'],
        suggestedTechniques: ['Mindful Breathing', 'Gratitude Practice'],
        distortions: [],
        summary: 'Personal reflection entry',
      },
    };
    setJournalEntries([newEntry, ...journalEntries]);
    setCurrentJournal('');
    toast.success('Journal entry saved! 📔');
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingTime(0);
      toast.success('Voice note saved! 🎙️');
    } else {
      setIsRecording(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // RENDER SECTIONS
  // ============================================

  const renderDailyCheckIn = () => (
    <div className="space-y-6">
      {/* Mood Selector */}
      <Card title="How are you feeling today?" icon={<HeartIcon className="w-5 h-5" />}>
        <div className="flex flex-col items-center mb-6">
          <div 
            className="text-6xl mb-2 transition-transform hover:scale-110 cursor-pointer"
            style={{ filter: `drop-shadow(0 4px 8px ${currentMoodEmoji.color}40)` }}
          >
            {currentMoodEmoji.emoji}
          </div>
          <p className="text-lg font-medium text-ink">{currentMoodEmoji.label}</p>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-6">
          {MOOD_EMOJIS.map((m) => (
            <button
              key={m.value}
              onClick={() => setCheckIn({ ...checkIn, mood: m.value })}
              className={`p-2 rounded-xl transition-all ${
                checkIn.mood === m.value
                  ? 'bg-teal-500 text-white scale-110 shadow-lg'
                  : 'hover:bg-sand'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sliders */}
      <Card title="Wellness Metrics" icon={<ChartBarIcon className="w-5 h-5" />}>
        <Slider
          label="Energy Level"
          value={checkIn.energy}
          onChange={(v) => setCheckIn({ ...checkIn, energy: v })}
          icon={<BoltIcon className="w-4 h-4" />}
          color="#f59e0b"
        />
        <Slider
          label="Stress Level"
          value={checkIn.stress}
          onChange={(v) => setCheckIn({ ...checkIn, stress: v })}
          icon={<FireIcon className="w-4 h-4" />}
          color="#ef4444"
        />
        <Slider
          label="Anxiety Level"
          value={checkIn.anxiety}
          onChange={(v) => setCheckIn({ ...checkIn, anxiety: v })}
          icon={<ExclamationTriangleIcon className="w-4 h-4" />}
          color="#f97316"
        />
        <Slider
          label="Focus Level"
          value={checkIn.focus}
          onChange={(v) => setCheckIn({ ...checkIn, focus: v })}
          icon={<SunIcon className="w-4 h-4" />}
          color="#3b82f6"
        />
      </Card>

      {/* Emotion Tags */}
      <Card title="Emotions" icon={<SparklesIcon className="w-5 h-5" />}>
        <div className="flex flex-wrap gap-2">
          {EMOTION_TAGS.map((emotion) => (
            <Tag
              key={emotion.id}
              label={emotion.label}
              selected={checkIn.emotions.includes(emotion.id)}
              onClick={() => {
                const newEmotions = checkIn.emotions.includes(emotion.id)
                  ? checkIn.emotions.filter(e => e !== emotion.id)
                  : [...checkIn.emotions, emotion.id];
                setCheckIn({ ...checkIn, emotions: newEmotions });
              }}
              color={emotion.color}
            />
          ))}
        </div>
      </Card>

      {/* Trigger Tags */}
      <Card title="What influenced your mood?" icon={<LightBulbIcon className="w-5 h-5" />}>
        <div className="flex flex-wrap gap-2">
          {TRIGGER_TAGS.map((trigger) => (
            <Tag
              key={trigger.id}
              label={trigger.label}
              icon={trigger.icon}
              selected={checkIn.triggers.includes(trigger.id)}
              onClick={() => {
                const newTriggers = checkIn.triggers.includes(trigger.id)
                  ? checkIn.triggers.filter(t => t !== trigger.id)
                  : [...checkIn.triggers, trigger.id];
                setCheckIn({ ...checkIn, triggers: newTriggers });
              }}
              color="bg-sand text-ink"
            />
          ))}
        </div>
      </Card>

      <button
        onClick={handleSaveCheckIn}
        className="neu-button w-full flex items-center justify-center space-x-2"
      >
        <CheckCircleIcon className="w-5 h-5" />
        <span>Save Check-in</span>
      </button>
    </div>
  );

  const renderEmotionWheel = () => (
    <Card title="Emotion Wheel" icon={<HeartIcon className="w-5 h-5" />} className="mb-6">
      <div className="flex flex-col items-center">
        {/* SVG Emotion Wheel */}
        <svg width="280" height="280" viewBox="0 0 280 280" className="mb-4">
          <defs>
            {PLUTCHIK_EMOTIONS.map((emotion, i) => (
              <linearGradient key={emotion.name} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={emotion.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={emotion.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
          </defs>
          
          {/* Center circle */}
          <circle cx="140" cy="140" r="40" fill="#e4dfd5" stroke="#8c7a6b" strokeWidth="2" />
          <text x="140" y="145" textAnchor="middle" className="text-xs fill-ink">Core</text>
          
          {/* Emotion segments */}
          {PLUTCHIK_EMOTIONS.map((emotion, i) => {
            const angle = (emotion.angle * Math.PI) / 180;
            const x1 = 140 + 45 * Math.cos(angle - 0.35);
            const y1 = 140 + 45 * Math.sin(angle - 0.35);
            const x2 = 140 + 100 * Math.cos(angle - 0.35);
            const y2 = 140 + 100 * Math.sin(angle - 0.35);
            const x3 = 140 + 100 * Math.cos(angle + 0.35);
            const y3 = 140 + 100 * Math.sin(angle + 0.35);
            const x4 = 140 + 45 * Math.cos(angle + 0.35);
            const y4 = 140 + 45 * Math.sin(angle + 0.35);
            
            const isSelected = selectedEmotion === emotion.name;
            
            return (
              <g key={emotion.name}>
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2} A 100 100 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 45 45 0 0 0 ${x1} ${y1}`}
                  fill={`url(#grad-${i})`}
                  stroke={isSelected ? '#14b8a6' : '#fff'}
                  strokeWidth={isSelected ? 3 : 1}
                  className="cursor-pointer transition-all hover:opacity-90"
                  onClick={() => setSelectedEmotion(emotion.name)}
                />
                <text
                  x={140 + 72 * Math.cos(angle)}
                  y={140 + 72 * Math.sin(angle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium pointer-events-none"
                  fill="#2d2418"
                >
                  {emotion.name}
                </text>
              </g>
            );
          })}
        </svg>
        
        {selectedEmotion && (
          <div className="w-full mt-4 p-4 bg-sand rounded-xl">
            <p className="font-semibold text-ink mb-2">{selectedEmotion}</p>
            <div className="mb-3">
              <label className="text-sm text-ink-light">Intensity: {emotionIntensity}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={emotionIntensity}
                onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <p className="text-sm text-ink-light">
              Related: {PLUTCHIK_EMOTIONS.find(e => e.name === selectedEmotion)?.dyads.join(', ')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  const renderJournal = () => (
    <div className="space-y-6">
      <Card 
        title="Daily Journal" 
        icon={<BookOpenIcon className="w-5 h-5" />}
        action={
          <div className="flex space-x-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-sand hover:bg-clay'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-sand hover:bg-clay transition-colors">
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>
        }
      >
        {isRecording && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 font-medium">Recording... {formatTime(recordingTime)}</span>
          </div>
        )}
        
        <textarea
          value={currentJournal}
          onChange={(e) => setCurrentJournal(e.target.value)}
          placeholder="How are you feeling? What's on your mind today? Write freely..."
          className="neu-input min-h-[200px] resize-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-ink-light">
            {currentJournal.length} characters
          </span>
          <button
            onClick={handleSaveJournal}
            className="neu-button flex items-center space-x-2"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </Card>

      {/* AI Analysis Preview */}
      {currentJournal.length > 50 && (
        <Card title="AI Analysis Preview" icon={<SparklesIcon className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-ink-light">Sentiment:</span>
              <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              </div>
              <span className="text-sm font-medium text-teal-600">Positive</span>
            </div>
            
            <div>
              <span className="text-sm text-ink-light">Detected Themes:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['self-reflection', 'daily life', 'emotions'].map(theme => (
                  <span key={theme} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-ink-light">Suggested Techniques:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Breathing Exercise', 'Mindfulness'].map(tech => (
                  <span key={tech} className="px-2 py-1 bg-sand text-ink rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Previous Entries */}
      <Card title="Previous Entries" icon={<CalendarIcon className="w-5 h-5" />}>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="p-4 bg-sand rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink-light">
                  {entry.date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{MOOD_EMOJIS[entry.mood - 1]?.emoji}</span>
                  {entry.aiAnalysis && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">
                      AI Analyzed
                    </span>
                  )}
                </div>
              </div>
              <p className="text-ink text-sm line-clamp-3">{entry.content}</p>
              
              {entry.aiAnalysis && (
                <div className="mt-3 pt-3 border-t border-clay/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <SparklesIcon className="w-4 h-4 text-teal-500" />
                    <span className="text-xs font-medium text-teal-600">AI Insights</span>
                  </div>
                  <p className="text-xs text-ink-light">{entry.aiAnalysis.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.aiAnalysis.suggestedTechniques.map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-clay/30 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderMoodAnalytics = () => {
    const chartData = moodData.map(m => ({
      date: m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: m.mood,
      energy: m.energy,
      stress: m.stress,
      anxiety: m.anxiety,
      focus: m.focus,
    }));

    const emotionCounts = EMOTION_TAGS.map(emotion => ({
      name: emotion.label,
      value: moodData.filter(m => m.emotions.includes(emotion.id)).length,
      color: emotion.color.includes('yellow') ? '#fbbf24' :
             emotion.color.includes('teal') ? '#14b8a6' :
             emotion.color.includes('orange') ? '#f97316' :
             emotion.color.includes('green') ? '#22c55e' :
             emotion.color.includes('red') ? '#ef4444' :
             emotion.color.includes('pink') ? '#ec4899' :
             emotion.color.includes('blue') ? '#3b82f6' :
             emotion.color.includes('purple') ? '#a855f7' :
             emotion.color.includes('cyan') ? '#06b6d4' :
             emotion.color.includes('indigo') ? '#6366f1' :
             emotion.color.includes('rose') ? '#f43f5e' : '#94a3b8'
    })).filter(e => e.value > 0);

    return (
      <div className="space-y-6">
        <Card title="30-Day Mood Trend" icon={<ChartBarIcon className="w-5 h-5" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4ccb8" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#e4dfd5', 
                    border: '1px solid #d4ccb8',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#14b8a6" 
                  fillOpacity={1} 
                  fill="url(#colorMood)" 
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-teal-500 rounded" />
              <span>Mood</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span>Energy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span>Stress</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Emotion Frequency" icon={<HeartIcon className="w-5 h-5" />}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emotionCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Weekly Summary" icon={<CalendarIcon className="w-5 h-5" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm text-teal-800">Average Mood</span>
                <span className="text-lg font-bold text-teal-600">
                  {averageMood.toFixed(1)}/10
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm text-amber-800">Best Day</span>
                <span className="text-sm font-medium text-amber-600">Tuesday</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                <span className="text-sm text-rose-800">Challenging Day</span>
                <span className="text-sm font-medium text-rose-600">Sunday</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights */}
        <Card title="AI-Generated Insights" icon={<LightBulbIcon className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-teal-50 rounded-lg">
              <SparklesIcon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-teal-800">Pattern Detected</p>
                <p className="text-sm text-teal-600">
                  Your anxiety tends to be higher on Sunday evenings. Consider planning a relaxing Sunday routine.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <ChartBarIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Correlation Found</p>
                <p className="text-sm text-blue-600">
                  Good sleep correlates with 23% better mood scores. Prioritize your sleep schedule.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <SunIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">Positive Trend</p>
                <p className="text-sm text-purple-600">
                  Your mood has improved by 15% over the last week. Keep up the great work!
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderAssessments = () => {
    const phq9Questions = [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking slowly or being fidgety/restless',
      'Thoughts that you would be better off dead or hurting yourself',
    ];

    const gad7Questions = [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen',
    ];

    const calculateSeverity = (score: number, type: 'phq9' | 'gad7' | 'pss') => {
      if (type === 'phq9') {
        if (score <= 4) return 'minimal';
        if (score <= 9) return 'mild';
        if (score <= 14) return 'moderate';
        if (score <= 19) return 'moderately severe';
        return 'severe';
      } else {
        if (score <= 4) return 'minimal';
        if (score <= 9) return 'mild';
        if (score <= 14) return 'moderate';
        return 'severe';
      }
    };

    const handleAssessmentSubmit = () => {
      if (!activeAssessment) return;
      const score = assessmentAnswers.reduce((a, b) => a + b, 0);
      const severity = calculateSeverity(score, activeAssessment);
      
      toast.success(`Assessment completed! Score: ${score} - ${severity}`);
      setActiveAssessment(null);
      setAssessmentAnswers([]);
    };

    if (activeAssessment === 'phq9') {
      return (
        <Card 
          title="PHQ-9 Depression Screening" 
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          action={
            <button 
              onClick={() => setActiveAssessment(null)}
              className="text-sm text-ink-light hover:text-ink"
            >
              Back
            </button>
          }
        >
          <p className="text-sm text-ink-light mb-4">
            Over the last 2 weeks, how often have you been bothered by the following problems?
          </p>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {phq9Questions.map((q, i) => (
              <div key={i} className="p-3 bg-sand rounded-lg">
                <p className="text-sm font-medium text-ink mb-2">{i + 1}. {q}</p>
                <div className="flex flex-wrap gap-2">
                  {['Not at all', 'Several days', 'More than half', 'Nearly every day'].map((label, val) => (
                    <button
                      key={val}
                      onClick={() => {
                        const newAnswers = [...assessmentAnswers];
                        newAnswers[i] = val;
                        setAssessmentAnswers(newAnswers);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        assessmentAnswers[i] === val
                          ? 'bg-teal-500 text-white'
                          : 'bg-white hover:bg-clay/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAssessmentSubmit}
            disabled={assessmentAnswers.length < phq9Questions.length}
            className="neu-button w-full mt-4 disabled:opacity-50"
          >
            Submit Assessment
          </button>
        </Card>
      );
    }

    if (activeAssessment === 'gad7') {
      return (
        <Card 
          title="GAD-7 Anxiety Screening" 
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          action={
            <button 
              onClick={() => setActiveAssessment(null)}
              className="text-sm text-ink-light hover:text-ink"
            >
              Back
            </button>
          }
        >
          <p className="text-sm text-ink-light mb-4">
            Over the last 2 weeks, how often have you been bothered by the following problems?
          </p>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {gad7Questions.map((q, i) => (
              <div key={i} className="p-3 bg-sand rounded-lg">
                <p className="text-sm font-medium text-ink mb-2">{i + 1}. {q}</p>
                <div className="flex flex-wrap gap-2">
                  {['Not at all', 'Several days', 'More than half', 'Nearly every day'].map((label, val) => (
                    <button
                      key={val}
                      onClick={() => {
                        const newAnswers = [...assessmentAnswers];
                        newAnswers[i] = val;
                        setAssessmentAnswers(newAnswers);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        assessmentAnswers[i] === val
                          ? 'bg-teal-500 text-white'
                          : 'bg-white hover:bg-clay/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAssessmentSubmit}
            disabled={assessmentAnswers.length < gad7Questions.length}
            className="neu-button w-full mt-4 disabled:opacity-50"
          >
            Submit Assessment
          </button>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveAssessment('phq9')}
            className="neu-card p-5 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <ChevronRightIcon className="w-5 h-5 text-ink-light group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-ink mb-1">PHQ-9</h3>
            <p className="text-sm text-ink-light">Depression screening questionnaire</p>
            <p className="text-xs text-ink-light mt-2">9 questions • 2-3 minutes</p>
          </button>

          <button
            onClick={() => setActiveAssessment('gad7')}
            className="neu-card p-5 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BoltIcon className="w-6 h-6 text-amber-600" />
              </div>
              <ChevronRightIcon className="w-5 h-5 text-ink-light group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-ink mb-1">GAD-7</h3>
            <p className="text-sm text-ink-light">Anxiety screening questionnaire</p>
            <p className="text-xs text-ink-light mt-2">7 questions • 2 minutes</p>
          </button>

          <button
            onClick={() => toast('PSS Assessment coming soon!')}
            className="neu-card p-5 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-red-600" />
              </div>
              <ChevronRightIcon className="w-5 h-5 text-ink-light group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-ink mb-1">PSS</h3>
            <p className="text-sm text-ink-light">Perceived Stress Scale</p>
            <p className="text-xs text-ink-light mt-2">10 questions • 3 minutes</p>
          </button>

          <button
            onClick={() => toast('Quick Self-Check coming soon!')}
            className="neu-card p-5 text-left hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <ChevronRightIcon className="w-5 h-5 text-ink-light group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-ink mb-1">Quick Self-Check</h3>
            <p className="text-sm text-ink-light">Daily wellness check-in</p>
            <p className="text-xs text-ink-light mt-2">5 questions • 1 minute</p>
          </button>
        </div>

        {/* Assessment History */}
        <Card title="Assessment History" icon={<ClockIcon className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-sand rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">4</span>
                </div>
                <div>
                  <p className="font-medium text-ink">PHQ-9</p>
                  <p className="text-xs text-ink-light">2 weeks ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Minimal
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sand rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-600">8</span>
                </div>
                <div>
                  <p className="font-medium text-ink">GAD-7</p>
                  <p className="text-xs text-ink-light">3 weeks ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Mild
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderCBTTools = () => (
    <div className="space-y-6">
      <Card title="Thought Record Worksheet" icon={<BookOpenIcon className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Situation</label>
            <textarea
              value={thoughtRecord.situation}
              onChange={(e) => setThoughtRecord({ ...thoughtRecord, situation: e.target.value })}
              placeholder="What happened? Where? When? Who with?"
              className="neu-input min-h-[80px] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Automatic Thoughts</label>
            <textarea
              value={thoughtRecord.automaticThoughts}
              onChange={(e) => setThoughtRecord({ ...thoughtRecord, automaticThoughts: e.target.value })}
              placeholder="What went through your mind?"
              className="neu-input min-h-[80px] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Emotions & Intensity</label>
            <input
              type="text"
              value={thoughtRecord.emotions}
              onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotions: e.target.value })}
              placeholder="e.g., Anxious (80%), Sad (40%)"
              className="neu-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Evidence For</label>
              <textarea
                value={thoughtRecord.evidenceFor}
                onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceFor: e.target.value })}
                placeholder="Facts supporting the thought"
                className="neu-input min-h-[80px] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Evidence Against</label>
              <textarea
                value={thoughtRecord.evidenceAgainst}
                onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceAgainst: e.target.value })}
                placeholder="Facts against the thought"
                className="neu-input min-h-[80px] resize-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Balanced Thought</label>
            <textarea
              value={thoughtRecord.balancedThought}
              onChange={(e) => setThoughtRecord({ ...thoughtRecord, balancedThought: e.target.value })}
              placeholder="What's a more balanced perspective?"
              className="neu-input min-h-[80px] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Action Plan</label>
            <input
              type="text"
              value={thoughtRecord.actionPlan}
              onChange={(e) => setThoughtRecord({ ...thoughtRecord, actionPlan: e.target.value })}
              placeholder="What will you do differently?"
              className="neu-input"
            />
          </div>
          <button
            onClick={() => {
              toast.success('Thought record saved!');
              setThoughtRecord({
                situation: '',
                automaticThoughts: '',
                emotions: '',
                evidenceFor: '',
                evidenceAgainst: '',
                balancedThought: '',
                actionPlan: '',
              });
            }}
            className="neu-button w-full"
          >
            Save Thought Record
          </button>
        </div>
      </Card>

      {/* ABC Worksheet */}
      <Card title="ABC Worksheet" icon={<SparklesIcon className="w-5 h-5" />}>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-rose-50 rounded-xl">
            <h4 className="font-semibold text-rose-800 mb-2">A - Activating Event</h4>
            <p className="text-sm text-rose-600 mb-2">What triggered the emotion?</p>
            <textarea
              placeholder="Describe the situation..."
              className="neu-input min-h-[100px] resize-none text-sm"
            />
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <h4 className="font-semibold text-amber-800 mb-2">B - Beliefs</h4>
            <p className="text-sm text-amber-600 mb-2">What did you tell yourself?</p>
            <textarea
              placeholder="Your thoughts..."
              className="neu-input min-h-[100px] resize-none text-sm"
            />
          </div>
          <div className="p-4 bg-teal-50 rounded-xl">
            <h4 className="font-semibold text-teal-800 mb-2">C - Consequences</h4>
            <p className="text-sm text-teal-600 mb-2">What was the outcome?</p>
            <textarea
              placeholder="Emotions & behaviors..."
              className="neu-input min-h-[100px] resize-none text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Worry Tree */}
      <Card title="Worry Tree Decision Tool" icon={<LightBulbIcon className="w-5 h-5" />}>
        <div className="p-4 bg-sand rounded-xl">
          <div className="text-center">
            <p className="font-medium text-ink mb-4">What am I worrying about?</p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="p-3 bg-amber-100 rounded-lg mb-2">
                  <p className="text-sm font-medium text-amber-800">Hypothetical worry?</p>
                  <p className="text-xs text-amber-600">"What if..."</p>
                </div>
                <p className="text-sm text-ink-light">→ Let it go, focus on present</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-teal-100 rounded-lg mb-2">
                  <p className="text-sm font-medium text-teal-800">Current problem?</p>
                  <p className="text-xs text-teal-600">Something happening now</p>
                </div>
                <p className="text-sm text-ink-light">→ Can I do something?</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <p className="text-sm font-medium text-green-800">Yes - Take Action</p>
                <p className="text-xs text-green-600">Make a plan and do it</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-800">No - Let it Go</p>
                <p className="text-xs text-blue-600">Use acceptance techniques</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTechniques = () => {
    const categories = ['all', 'breathing', 'grounding', 'meditation', 'relaxation', 'cbt'] as const;
    const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('all');
    
    const filteredTechniques = selectedCategory === 'all' 
      ? TECHNIQUES 
      : TECHNIQUES.filter(t => t.category === selectedCategory);

    return (
      <div className="space-y-6">
        {/* Breathing Exercise Visual */}
        <Card title="Guided Breathing" icon={<HeartIcon className="w-5 h-5" />}>
          <div className="flex flex-col items-center py-8">
            <div 
              className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center transition-all duration-4000"
              style={{
                transform: playingTechnique === 'breathing' ? 'scale(1.3)' : 'scale(1)',
                opacity: playingTechnique === 'breathing' ? 0.8 : 1,
              }}
            >
              <span className="text-white text-lg font-medium">
                {playingTechnique === 'breathing' ? breathPhase : 'Ready'}
              </span>
            </div>
            <p className="mt-4 text-ink-light">
              {playingTechnique === 'breathing' 
                ? 'Follow the circle with your breath' 
                : 'Press play to start guided breathing'}
            </p>
            <button
              onClick={() => {
                if (playingTechnique === 'breathing') {
                  setPlayingTechnique(null);
                } else {
                  setPlayingTechnique('breathing');
                  // Simulate breathing phases
                  const phases: ('inhale' | 'hold' | 'exhale' | 'pause')[] = ['inhale', 'hold', 'exhale', 'pause'];
                  let i = 0;
                  const interval = setInterval(() => {
                    setBreathPhase(phases[i % 4]);
                    i++;
                  }, 4000);
                  setTimeout(() => {
                    clearInterval(interval);
                    setPlayingTechnique(null);
                    toast.success('Breathing exercise complete! 🧘');
                  }, 60000);
                }
              }}
              className="neu-button mt-4 flex items-center space-x-2"
            >
              {playingTechnique === 'breathing' ? (
                <><PauseIcon className="w-5 h-5" /><span>Stop</span></>
              ) : (
                <><PlayIcon className="w-5 h-5" /><span>Start 4-7-8 Breathing</span></>
              )}
            </button>
          </div>
        </Card>

        {/* Quick Relief */}
        <Card title="Quick Relief (&lt; 5 min)" icon={<BoltIcon className="w-5 h-5" />}>
          <div className="grid grid-cols-2 gap-3">
            {TECHNIQUES.filter(t => t.duration <= 5).map(tech => (
              <button
                key={tech.id}
                className="p-3 bg-sand rounded-xl text-left hover:bg-clay/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-ink text-sm">{tech.name}</span>
                  <span className="text-xs text-teal-600">{tech.duration}m</span>
                </div>
                <p className="text-xs text-ink-light">{tech.description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-sand text-ink hover:bg-clay/30'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Techniques List */}
        <div className="space-y-3">
          {filteredTechniques.map(tech => (
            <Card key={tech.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-ink">{tech.name}</h4>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">
                      {tech.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-ink-light mb-2">{tech.description}</p>
                  <ol className="text-xs text-ink-light space-y-1">
                    {tech.steps.map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
                <button
                  onClick={() => toast.success(`Starting ${tech.name}...`)}
                  className="ml-4 p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCrisisResources = () => (
    <Card title="Crisis Resources" icon={<ShieldCheckIcon className="w-5 h-5" />} className="bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200">
      <div className="text-center mb-6">
        <p className="text-ink-light mb-4">
          If you\'re experiencing a mental health crisis, help is available 24/7.
        </p>
        <button
          onClick={() => toast('Connecting to crisis support...')}
          className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 transition-colors shadow-lg"
        >
          <PhoneIcon className="w-6 h-6 inline mr-2" />
          Get Help Now
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-ink mb-2">Crisis Hotlines</h4>
        {CRISIS_RESOURCES.map(resource => (
          <div key={resource.country} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-4 h-4 text-ink-light" />
              <div>
                <p className="font-medium text-ink text-sm">{resource.country}</p>
                <p className="text-xs text-ink-light">{resource.name}</p>
              </div>
            </div>
            <a 
              href={`tel:${resource.hotline.replace(/\D/g, '')}`}
              className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors"
            >
              {resource.hotline}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-rose-200">
        <h4 className="font-semibold text-ink mb-3">Find a Therapist</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter your location..."
            className="neu-input flex-1"
          />
          <button
            onClick={() => toast('Searching for therapists...')}
            className="px-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-1">Mental Wellness</h1>
            <p className="text-ink-light">Track, understand, and nurture your mental health</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="neu-card px-4 py-2 flex items-center space-x-2">
              <SunIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-ink-light">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="neu-card px-4 py-2 flex items-center space-x-2">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium text-ink">
                Streak: 12 days 🔥
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'checkin', label: 'Daily Check-in', icon: HeartIcon },
            { id: 'journal', label: 'Journal', icon: BookOpenIcon },
            { id: 'assessments', label: 'Assessments', icon: ShieldCheckIcon },
            { id: 'techniques', label: 'Techniques', icon: SparklesIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'neu-card text-ink-light hover:text-ink'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Journal & Assessments */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'checkin' && (
              <>
                {renderEmotionWheel()}
                <Card title="Quick Actions" icon={<BoltIcon className="w-5 h-5" />}>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="w-full p-3 bg-sand rounded-lg text-left hover:bg-clay/30 transition-colors flex items-center space-x-2"
                    >
                      <BookOpenIcon className="w-4 h-4" />
                      <span className="text-sm">Write in Journal</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className="w-full p-3 bg-sand rounded-lg text-left hover:bg-clay/30 transition-colors flex items-center space-x-2"
                    >
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span className="text-sm">Take Assessment</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('techniques')}
                      className="w-full p-3 bg-sand rounded-lg text-left hover:bg-clay/30 transition-colors flex items-center space-x-2"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      <span className="text-sm">Breathing Exercise</span>
                    </button>
                  </div>
                </Card>
              </>
            )}
            {activeTab === 'journal' && renderJournal()}
            {activeTab === 'assessments' && (
              <Card title="Assessment Info" icon={<LightBulbIcon className="w-5 h-5" />}>
                <div className="space-y-3 text-sm text-ink-light">
                  <p><strong>PHQ-9:</strong> Screens for depression severity</p>
                  <p><strong>GAD-7:</strong> Screens for anxiety severity</p>
                  <p><strong>PSS:</strong> Measures perceived stress</p>
                  <p className="text-xs text-ink-light mt-4">
                    These assessments are for screening purposes only and do not replace professional diagnosis.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Center Panel - Main Content */}
          <div className="lg:col-span-6">
            {activeTab === 'checkin' && (
              <>
                {renderDailyCheckIn()}
                <div className="mt-6">
                  {renderMoodAnalytics()}
                </div>
              </>
            )}
            {activeTab === 'journal' && renderMoodAnalytics()}
            {activeTab === 'assessments' && renderAssessments()}
            {activeTab === 'techniques' && (
              <>
                {renderCBTTools()}
                <div className="mt-6">
                  {renderTechniques()}
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Techniques & Crisis */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'checkin' && (
              <>
                {renderTechniques()}
                <div className="mt-6">
                  {renderCrisisResources()}
                </div>
              </>
            )}
            {activeTab === 'journal' && renderCrisisResources()}
            {activeTab === 'assessments' && (
              <>
                {renderTechniques()}
                {renderCrisisResources()}
              </>
            )}
            {activeTab === 'techniques' && renderCrisisResources()}
          </div>
        </div>
      </div>
    </div>
  );
}
