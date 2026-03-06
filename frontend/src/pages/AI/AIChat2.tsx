import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Paperclip,
  MoreHorizontal,
  Copy,
  Edit3,
  Trash2,
  Check,
  ChevronDown,
  Search,
  Star,
  Download,
  Settings,
  Sparkles,
  Zap,
  Heart,
  Activity,
  Moon,
  Brain,
  Utensils,
  Dumbbell,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight,
  X,
  Plus,
  BarChart3,
  Leaf,
  Sun,
  CloudRain,
  Smile,
  Frown,
  Meh,
  FileText,
  Camera,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Wand2,
  History,
  Bookmark,
  Share2,
  Maximize2,
  Minimize2,
  Flame,
} from 'lucide-react';

// ==================== Types ====================

interface Attachment {
  id: string;
  type: 'image' | 'document' | 'voice' | 'screenshot';
  url: string;
  name: string;
  size?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isEdited?: boolean;
  isStreaming?: boolean;
  metadata?: {
    usedContext?: boolean;
    processingTime?: number;
    persona?: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isStarred: boolean;
  messageCount: number;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  systemPrompt: string;
}

interface HealthContext {
  includeNutrition: boolean;
  includeSleep: boolean;
  includeActivity: boolean;
  includeMood: boolean;
}

interface QuickPrompt {
  id: string;
  text: string;
  icon: React.ElementType;
  category: string;
}

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  action: string;
}

interface HealthMetric {
  label: string;
  value: number | string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  icon: React.ElementType;
  color: string;
}

// ==================== Mock Data ====================

const PERSONAS: Persona[] = [
  {
    id: 'health-coach',
    name: 'Health Coach',
    description: 'General wellness & lifestyle guidance',
    icon: Heart,
    color: 'emerald',
    systemPrompt: 'You are a holistic health coach focused on overall wellness.',
  },
  {
    id: 'nutritionist',
    name: 'Nutritionist',
    description: 'Diet advice & meal planning',
    icon: Utensils,
    color: 'orange',
    systemPrompt: 'You are a certified nutritionist specializing in healthy eating.',
  },
  {
    id: 'trainer',
    name: 'Trainer',
    description: 'Workout guidance & fitness plans',
    icon: Dumbbell,
    color: 'blue',
    systemPrompt: 'You are a personal trainer specializing in fitness and exercise.',
  },
  {
    id: 'sleep-expert',
    name: 'Sleep Expert',
    description: 'Sleep optimization & recovery',
    icon: Moon,
    color: 'indigo',
    systemPrompt: 'You are a sleep specialist focused on sleep quality and recovery.',
  },
  {
    id: 'mental-health',
    name: 'Mental Health Coach',
    description: 'Psychological support & mindfulness',
    icon: Brain,
    color: 'purple',
    systemPrompt: 'You are a mental health coach providing emotional support and mindfulness guidance.',
  },
];

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: 'Analyze my nutrition today', icon: Utensils, category: 'Nutrition' },
  { id: '2', text: 'Suggest a workout for today', icon: Dumbbell, category: 'Fitness' },
  { id: '3', text: 'How can I improve my sleep?', icon: Moon, category: 'Sleep' },
  { id: '4', text: "I'm feeling stressed, help me relax", icon: Brain, category: 'Mental Health' },
  { id: '5', text: 'Review my health data', icon: Activity, category: 'Overview' },
  { id: '6', text: 'Create a meal plan for this week', icon: Calendar, category: 'Nutrition' },
  { id: '7', text: 'Track my water intake', icon: Activity, category: 'Habits' },
  { id: '8', text: 'Morning meditation guide', icon: Sun, category: 'Mental Health' },
];

const AI_TOOLS: AITool[] = [
  { id: 'meal-plan', name: 'Generate Meal Plan', description: 'Create personalized meal plans', icon: Utensils, action: 'meal-planner' },
  { id: 'workout', name: 'Create Workout', description: 'Design custom workouts', icon: Dumbbell, action: 'workout-generator' },
  { id: 'sleep', name: 'Analyze Sleep', description: 'Deep sleep insights', icon: Moon, action: 'sleep-insights' },
  { id: 'journal', name: 'Journal Analysis', description: 'Mood & pattern insights', icon: Brain, action: 'mood-insights' },
];

const MOCK_CHAT_HISTORY: ChatSession[] = [
  { id: '1', title: 'Weekly Nutrition Review', lastMessage: 'Based on your data, you should increase protein intake...', timestamp: new Date(Date.now() - 1000 * 60 * 30), isStarred: true, messageCount: 12 },
  { id: '2', title: 'Sleep Troubleshooting', lastMessage: 'Try reducing screen time 1 hour before bed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isStarred: false, messageCount: 8 },
  { id: '3', title: 'Workout Plan Discussion', lastMessage: 'Here is a 4-week strength training plan', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isStarred: true, messageCount: 24 },
  { id: '4', title: 'Meditation Techniques', lastMessage: 'Practice box breathing for 5 minutes daily', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isStarred: false, messageCount: 6 },
  { id: '5', title: 'Hydration Goals', lastMessage: 'Great progress! You hit your water goal 5 days this week', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isStarred: false, messageCount: 10 },
];

const HEALTH_METRICS: HealthMetric[] = [
  { label: 'Steps', value: '8,432', unit: 'steps', trend: 'up', change: '+12%', icon: Activity, color: 'emerald' },
  { label: 'Sleep', value: '7.5', unit: 'hours', trend: 'stable', change: '0%', icon: Moon, color: 'indigo' },
  { label: 'Calories', value: '1,850', unit: 'kcal', trend: 'down', change: '-5%', icon: Flame, color: 'orange' },
  { label: 'Heart Rate', value: '68', unit: 'bpm', trend: 'stable', change: '-2%', icon: Heart, color: 'rose' },
];

// ==================== Components ====================

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1.5 px-4 py-3">
    <motion.div
      className="w-2 h-2 bg-emerald-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-emerald-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
    />
    <motion.div
      className="w-2 h-2 bg-emerald-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
    />
  </div>
);

const StreamingText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const MessageBubble: React.FC<{
  message: Message;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}> = ({ message, onEdit, onDelete, onCopy }) => {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);

  const handleSaveEdit = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        }`}>
          {isUser ? <span className="text-sm font-semibold">You</span> : <Sparkles className="w-5 h-5" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative rounded-2xl px-5 py-3.5 ${
            isUser 
              ? 'bg-emerald-600 text-white rounded-br-md' 
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-md shadow-sm'
          }`}>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-64 p-2 text-sm bg-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs bg-white/20 rounded hover:bg-white/30">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-3 py-1 text-xs bg-white rounded text-emerald-600 hover:bg-white/90">Save</button>
                </div>
              </div>
            ) : (
              <>
                {message.isStreaming ? (
                  <StreamingText text={message.content} />
                ) : (
                  <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((att) => (
                  <div key={att.id} className={`flex items-center gap-2 p-2 rounded-lg ${isUser ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {att.type === 'image' && <ImageIcon className="w-4 h-4" />}
                    {att.type === 'document' && <FileText className="w-4 h-4" />}
                    {att.type === 'voice' && <Mic className="w-4 h-4" />}
                    <span className="text-sm truncate max-w-[150px]">{att.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Context indicator */}
            {message.metadata?.usedContext && (
              <div className={`mt-2 flex items-center gap-1.5 text-xs ${isUser ? 'text-white/70' : 'text-slate-500'}`}>
                <BarChart3 className="w-3 h-3" />
                <span>Used health data context</span>
              </div>
            )}
          </div>

          {/* Timestamp & Actions */}
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span className="text-xs text-slate-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {message.isEdited && ' (edited)'}
            </span>
            
            <AnimatePresence>
              {showActions && !isEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <button
                    onClick={() => onCopy(message.content)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {isUser && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PersonaSelector: React.FC<{
  currentPersona: string;
  onSelect: (id: string) => void;
}> = ({ currentPersona, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = PERSONAS.find(p => p.id === currentPersona) || PERSONAS[0];
  const Icon = selected.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 transition-colors"
      >
        <div className={`p-1.5 rounded-lg bg-${selected.color}-100 dark:bg-${selected.color}-900/30`}>
          <Icon className={`w-4 h-4 text-${selected.color}-600`} />
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selected.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Select AI Persona</span>
              </div>
              {PERSONAS.map((persona) => {
                const PIcon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelect(persona.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      currentPersona === persona.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-${persona.color}-100 dark:bg-${persona.color}-900/30`}>
                      <PIcon className={`w-5 h-5 text-${persona.color}-600`} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-white">{persona.name}</span>
                        {currentPersona === persona.id && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{persona.description}</p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickPrompts: React.FC<{
  onSelect: (text: string) => void;
}> = ({ onSelect }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? QUICK_PROMPTS : QUICK_PROMPTS.slice(0, 4);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Prompts</span>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showAll ? 'Show less' : 'Show all'}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {displayed.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={prompt.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(prompt.text)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-sm transition-all text-left"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300">{prompt.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const ChatHistory: React.FC<{
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ sessions, activeId, onSelect, onStar, onDelete, searchQuery, onSearchChange }) => {
  const [filter, setFilter] = useState<'all' | 'starred'>('all');
  
  const filtered = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'starred' && s.isStarred);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 p-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('starred')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            filter === 'starred' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          Starred
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`group p-3 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
              activeId === session.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className={`font-medium text-sm truncate pr-2 ${activeId === session.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {session.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStar(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Star className={`w-4 h-4 ${session.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{session.lastMessage}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{session.messageCount} messages</span>
              <span>{session.timestamp.toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HealthContextPanel: React.FC<{
  context: HealthContext;
  onToggle: (key: keyof HealthContext) => void;
}> = ({ context, onToggle }) => {
  const toggles = [
    { key: 'includeNutrition' as const, label: 'Nutrition Data', icon: Utensils, color: 'orange' },
    { key: 'includeSleep' as const, label: 'Sleep Data', icon: Moon, color: 'indigo' },
    { key: 'includeActivity' as const, label: 'Activity Data', icon: Activity, color: 'emerald' },
    { key: 'includeMood' as const, label: 'Mood Data', icon: Brain, color: 'purple' },
  ];

  return (
    <div className="space-y-4">
      {/* Context Toggles */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          Include Health Data
        </h4>
        <div className="space-y-2">
          {toggles.map(({ key, label, icon: Icon, color }) => (
            <label
              key={key}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${context[key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <input
                  type="checkbox"
                  checked={context[key]}
                  onChange={() => onToggle(key)}
                  className="sr-only"
                />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${context[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Today&apos;s Summary</h4>
        <div className="space-y-3">
          {HEALTH_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                    <Icon className={`w-4 h-4 text-${metric.color}-600`} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{metric.value}</span>
                  <span className="text-xs text-slate-400 ml-0.5">{metric.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" />
          Active Goals
        </h4>
        <div className="space-y-2">
          {[
            { label: 'Daily Steps', current: 8432, target: 10000, color: 'emerald' },
            { label: 'Sleep Duration', current: 7.5, target: 8, color: 'indigo' },
            { label: 'Water Intake', current: 1750, target: 2500, color: 'cyan' },
          ].map((goal) => (
            <div key={goal.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{goal.label}</span>
                <span className="text-slate-900 dark:text-white font-medium">{goal.current} / {goal.target}</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${goal.color}-500 rounded-full`}
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-4 h-4" />
          <h4 className="text-sm font-semibold">AI Insights</h4>
        </div>
        <p className="text-sm text-white/90 mb-3">
          Based on your sleep data, you might want to consider an early bedtime tonight to recover from the past few late nights.
        </p>
        <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
          Tell me more
        </button>
      </div>
    </div>
  );
};

const AIToolsPanel: React.FC<{
  onToolSelect: (action: string) => void;
}> = ({ onToolSelect }) => {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">AI Tools</span>
      {AI_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToolSelect(tool.action)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-900 dark:text-white">{tool.name}</h4>
              <p className="text-xs text-slate-500">{tool.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </motion.button>
        );
      })}
    </div>
  );
};

// ==================== Main Component ====================

export default function AIChat2() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersona, setCurrentPersona] = useState('health-coach');
  const [healthContext, setHealthContext] = useState<HealthContext>({
    includeNutrition: true,
    includeSleep: true,
    includeActivity: true,
    includeMood: false,
  });
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(MOCK_CHAT_HISTORY);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  // Send message
  const handleSend = useCallback(async () => {
    if (!inputMessage.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAttachments([]);
    setIsTyping(true);

    // Simulate AI response with streaming
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        metadata: {
          usedContext: healthContext.includeNutrition || healthContext.includeSleep,
          persona: currentPersona,
        },
      };
      setMessages(prev => [...prev, aiMessage]);

      // Simulate streaming
      const responses = [
        "Based on your recent health data, I can see you've been making great progress! ",
        "Your average step count this week is 8,432 steps per day, which is excellent. ",
        "Here are some personalized recommendations:\n\n",
        "1. **Nutrition**: Consider adding more protein to your breakfast to maintain energy levels throughout the morning.\n",
        "2. **Sleep**: Your sleep consistency has improved. Keep maintaining your current bedtime routine.\n",
        "3. **Activity**: Try to include at least 20 minutes of strength training 2-3 times per week.\n\n",
        "Would you like me to create a detailed plan for any of these areas?",
      ];

      let fullResponse = '';
      let index = 0;

      const streamInterval = setInterval(() => {
        if (index < responses.length) {
          fullResponse += responses[index];
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMessage.id ? { ...m, content: fullResponse } : m
            )
          );
          index++;
        } else {
          clearInterval(streamInterval);
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMessage.id ? { ...m, isStreaming: false } : m
            )
          );
          setIsTyping(false);
        }
      }, 800);
    }, 1000);
  }, [inputMessage, attachments, healthContext, currentPersona]);

  // Handle quick prompt
  const handleQuickPrompt = useCallback((text: string) => {
    setInputMessage(text);
    textareaRef.current?.focus();
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      setAttachments(prev => [...prev, attachment]);
    });
  }, []);

  // Handle voice recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice transcript
      setInputMessage('Voice message transcript: How did I sleep last night?');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('Voice message transcript: How did I sleep last night?');
      }, 3000);
    }
  }, [isRecording]);

  // Message actions
  const handleEditMessage = useCallback((id: string, content: string) => {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, content, isEdited: true } : m)
    );
  }, []);

  const handleDeleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  // Chat history actions
  const handleStarChat = useCallback((id: string) => {
    setChatHistory(prev =>
      prev.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c)
    );
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveChatId(null);
    setInputMessage('');
    setAttachments([]);
  }, []);

  // Health context toggle
  const toggleHealthContext = useCallback((key: keyof HealthContext) => {
    setHealthContext(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className={`flex bg-slate-50 dark:bg-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]'}`}>
      {/* Left Sidebar - Chat History & Tools */}
      <AnimatePresence mode="wait">
        {showLeftSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
          >
            {/* New Chat Button */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-hidden">
              <ChatHistory
                sessions={chatHistory}
                activeId={activeChatId}
                onSelect={setActiveChatId}
                onStar={handleStarChat}
                onDelete={handleDeleteChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto">
              <QuickPrompts onSelect={handleQuickPrompt} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {showLeftSidebar ? <ChevronDown className="w-5 h-5 rotate-90" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <PersonaSelector currentPersona={currentPersona} onSelect={setCurrentPersona} />
            
            {messages.length > 0 && (
              <span className="text-sm text-slate-500">
                {messages.length} messages
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`p-2 rounded-lg transition-colors ${isVoiceMode ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600'}`}
            >
              {isVoiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-slate-600" /> : <Maximize2 className="w-5 h-5 text-slate-600" />}
            </button>

            <div className="relative group">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-slate-600" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <Download className="w-4 h-4" />
                  Export conversation
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <Share2 className="w-4 h-4" />
                  Share chat
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <Bookmark className="w-4 h-4" />
                  Save to favorites
                </button>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                  Clear chat
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Ask me anything about your health, nutrition, fitness, or sleep. I can analyze your data and provide personalized recommendations.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUICK_PROMPTS.slice(0, 4).map((prompt) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={prompt.id}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                      >
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{prompt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onCopy={handleCopyMessage}
                />
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {attachments.map((att) => (
                <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                  {att.type === 'image' && <ImageIcon className="w-4 h-4 text-slate-500" />}
                  {att.type === 'document' && <FileText className="w-4 h-4 text-slate-500" />}
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{att.name}</span>
                  <button
                    onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <div className="relative">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Voice Input */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'
              }`}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? 'Listening...' : 'Type your message...'}
                disabled={isRecording}
                rows={1}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[48px] max-h-[200px]"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={(!inputMessage.trim() && attachments.length === 0) || isTyping}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-2">
            AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Health Context */}
      <AnimatePresence mode="wait">
        {showRightSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <HealthContextPanel context={healthContext} onToggle={toggleHealthContext} />
              <AIToolsPanel onToolSelect={handleQuickPrompt} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
