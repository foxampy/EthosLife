/**
 * AIChatUnified - Унифицированный Чат с ИИ и Общий Чат
 * Объединяет ИИ-ассистента и общий чат в одном интерфейсе
 * 
 * Features:
 * - Переключение между режимами: ИИ-ассистент / Общий чат
 * - Выбор персон для ИИ (Dr. Wellness, FitCoach, NutriBot, и т.д.)
 * - Настройки окружения внутри чата
 * - История сообщений для обоих режимов
 * - Health context integration
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Paperclip,
  Copy,
  Edit3,
  Trash2,
  Check,
  ChevronDown,
  Search,
  Sparkles,
  Heart,
  Activity,
  Moon,
  Brain,
  Utensils,
  Dumbbell,
  Flame,
  X,
  Plus,
  FileText,
  Volume2,
  VolumeX,
  History,
  Bookmark,
  Share2,
  Maximize2,
  Minimize2,
  ChevronRight,
  Zap,
  Camera,
  Clock,
  Target,
  BarChart3,
  Wand2,
  Users,
  Bot,
  MessageSquare,
  Settings,
  Globe,
  Shield,
  Palette,
  Code,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Calendar,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

// ==================== Types ====================

type ChatMode = 'ai' | 'general';

interface Attachment {
  id: string;
  type: 'image' | 'document' | 'voice';
  url: string;
  name: string;
  size?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'member';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isEdited?: boolean;
  isStreaming?: boolean;
  actionCards?: ActionCard[];
  memberId?: string;
  memberName?: string;
  memberAvatar?: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isStarred: boolean;
  messageCount: number;
  mode: ChatMode;
  members?: number;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  emoji: string;
  color: string;
  systemPrompt?: string;
}

interface QuickPrompt {
  id: string;
  text: string;
  icon: React.ElementType;
  emoji: string;
}

interface ActionCard {
  id: string;
  title: string;
  description: string;
  action: string;
  emoji: string;
}

interface ChatSettings {
  temperature: number;
  maxTokens: number;
  contextEnabled: boolean;
  autoSave: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

// ==================== Colors ====================
const COLORS = {
  bone: '#e4dfd5',
  sand: '#dcd3c6',
  stone: '#5c5243',
  ink: '#2d2418',
  shadowLight: 'rgba(255,255,255,0.6)',
  shadowDark: 'rgba(44,40,34,0.15)',
};

// ==================== Neumorphism Styles ====================
const neuStyles = {
  flat: `bg-[#e4dfd5] rounded-2xl`,
  pressed: `bg-[#e4dfd5] rounded-2xl shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]`,
  convex: `bg-[#e4dfd5] rounded-2xl shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)]`,
  concave: `bg-[#e4dfd5] rounded-2xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]`,
  button: `bg-[#e4dfd5] rounded-xl shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] transition-all duration-200`,
  buttonPressed: `bg-[#e4dfd5] rounded-xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]`,
  input: `bg-[#e4dfd5] rounded-xl shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30`,
  card: `bg-[#e4dfd5] rounded-2xl shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)]`,
  cardHover: `hover:shadow-[8px_8px_16px_rgba(44,40,34,0.2),-8px_-8px_16px_rgba(255,255,255,0.7)] transition-all duration-300`,
  badge: `bg-[#e4dfd5] rounded-xl shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]`,
};

// ==================== AI Personas ====================

const AI_PERSONAS: Persona[] = [
  {
    id: 'dr-wellness',
    name: 'Dr. Wellness',
    description: 'General health & lifestyle guidance',
    icon: Heart,
    emoji: '👨‍⚕️',
    color: '#e4dfd5',
    systemPrompt: 'You are Dr. Wellness, a knowledgeable and supportive health assistant specializing in general health & lifestyle guidance.',
  },
  {
    id: 'fitcoach',
    name: 'FitCoach',
    description: 'Personal trainer & workouts',
    icon: Dumbbell,
    emoji: '💪',
    color: '#e4dfd5',
    systemPrompt: 'You are FitCoach, a certified personal trainer specializing in workout routines and fitness guidance.',
  },
  {
    id: 'nutribot',
    name: 'NutriBot',
    description: 'Nutrition & meal planning',
    icon: Utensils,
    emoji: '🥗',
    color: '#e4dfd5',
    systemPrompt: 'You are NutriBot, a nutritionist expert specializing in meal planning and dietary advice.',
  },
  {
    id: 'sleepguide',
    name: 'SleepGuide',
    description: 'Sleep optimization & recovery',
    icon: Moon,
    emoji: '🌙',
    color: '#e4dfd5',
    systemPrompt: 'You are SleepGuide, a sleep specialist helping users optimize their sleep and recovery.',
  },
  {
    id: 'mindmate',
    name: 'MindMate',
    description: 'Mental health & mindfulness',
    icon: Brain,
    emoji: '🧘',
    color: '#e4dfd5',
    systemPrompt: 'You are MindMate, a mental health companion specializing in mindfulness and stress management.',
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'General purpose AI assistant',
    icon: Sparkles,
    emoji: '🤖',
    color: '#e4dfd5',
    systemPrompt: 'You are a helpful general purpose AI assistant.',
  },
];

// ==================== Quick Prompts ====================

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: 'Analyze my nutrition today', icon: Utensils, emoji: '🥗' },
  { id: '2', text: 'Suggest a workout for today', icon: Dumbbell, emoji: '💪' },
  { id: '3', text: 'How can I improve my sleep?', icon: Moon, emoji: '😴' },
  { id: '4', text: "I'm feeling stressed, help me relax", icon: Brain, emoji: '🧘' },
  { id: '5', text: 'Review my health data', icon: Activity, emoji: '📊' },
  { id: '6', text: 'Track my water intake', icon: Activity, emoji: '💧' },
];

// ==================== Mock Data ====================

const MOCK_CHAT_HISTORY: ChatSession[] = [
  { id: '1', title: 'Weekly Nutrition Review', lastMessage: 'Based on your data...', timestamp: new Date(Date.now() - 1000 * 60 * 30), isStarred: true, messageCount: 12, mode: 'ai' },
  { id: '2', title: 'Sleep Troubleshooting', lastMessage: 'Try reducing screen time', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isStarred: false, messageCount: 8, mode: 'ai' },
  { id: '3', title: 'General Chat - Team', lastMessage: 'Meeting at 3 PM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isStarred: true, messageCount: 24, mode: 'general', members: 5 },
  { id: '4', title: 'Meditation Techniques', lastMessage: 'Practice box breathing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isStarred: false, messageCount: 6, mode: 'ai' },
  { id: '5', title: 'General Chat - Family', lastMessage: 'See you tonight!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isStarred: false, messageCount: 156, mode: 'general', members: 4 },
];

const MOCK_ACTION_CARDS: ActionCard[] = [
  { id: '1', title: 'View Sleep Stats', description: 'See detailed sleep analysis', action: 'sleep-stats', emoji: '📈' },
  { id: '2', title: 'Set Bedtime Reminder', description: 'Get notifications at 10 PM', action: 'bedtime-reminder', emoji: '⏰' },
  { id: '3', title: 'Try Sleep Meditation', description: '10-min guided session', action: 'meditation', emoji: '🧘' },
];

// ==================== Components ====================

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-[#5c5243] rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const ActionCardComponent: React.FC<{ card: ActionCard; onClick: () => void }> = ({ card, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${neuStyles.card} ${neuStyles.cardHover} p-4 text-left w-full`}
  >
    <div className="flex items-start gap-3">
      <span className="text-2xl">{card.emoji}</span>
      <div className="flex-1">
        <h4 className="font-semibold text-[#2d2418] text-sm">{card.title}</h4>
        <p className="text-xs text-[#5c5243]/70 mt-1">{card.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#5c5243]/50" />
    </div>
  </motion.button>
);

const MessageBubble: React.FC<{
  message: Message;
  mode: ChatMode;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}> = ({ message, mode, onEdit, onDelete, onCopy }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isMember = message.role === 'member';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);

  const handleSaveEdit = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <motion.div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUser
              ? `${neuStyles.convex} text-[#5c5243]`
              : isAssistant
              ? `${neuStyles.convex} text-[#5c5243]`
              : `${neuStyles.convex} text-[#5c5243]`
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isUser ? (
            <span className="text-lg">👤</span>
          ) : isAssistant ? (
            <Sparkles className="w-5 h-5 text-[#5c5243]" />
          ) : (
            <span className="text-lg">{message.memberAvatar || '👤'}</span>
          )}
        </motion.div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {isMember && message.memberName && (
            <span className="text-xs text-[#5c5243] ml-1 mb-1">{message.memberName}</span>
          )}
          <div className={`relative px-5 py-3.5 ${
            isUser
              ? `${neuStyles.convex} text-[#2d2418] rounded-br-md`
              : `${neuStyles.flat} text-[#2d2418] rounded-bl-md shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)]`
          }`}>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={`w-64 p-3 text-sm ${neuStyles.input} resize-none text-[#2d2418]`}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`px-3 py-1.5 text-xs ${neuStyles.button} text-[#5c5243]`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className={`px-3 py-1.5 text-xs ${neuStyles.button} text-[#2d2418] font-medium`}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-sm max-w-none text-[#2d2418]">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`flex items-center gap-2 p-2 rounded-lg ${neuStyles.pressed}`}
                      >
                        {att.type === 'image' && <ImageIcon className="w-4 h-4 text-[#5c5243]" />}
                        {att.type === 'document' && <FileText className="w-4 h-4 text-[#5c5243]" />}
                        {att.type === 'voice' && <Mic className="w-4 h-4 text-[#5c5243]" />}
                        <span className="text-sm text-[#2d2418] truncate max-w-[150px]">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Cards */}
                {message.actionCards && message.actionCards.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {message.actionCards.map((card) => (
                      <ActionCardComponent
                        key={card.id}
                        card={card}
                        onClick={() => console.log(card.action)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Timestamp & Actions */}
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span className="text-xs text-[#5c5243]/60">
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
                    className={`p-1.5 rounded-lg ${neuStyles.button} text-[#5c5243]`}
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {isUser && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-1.5 rounded-lg ${neuStyles.button} text-[#5c5243]`}
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(message.id)}
                    className={`p-1.5 rounded-lg ${neuStyles.button} text-red-600`}
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
  const selected = AI_PERSONAS.find(p => p.id === currentPersona) || AI_PERSONAS[0];
  const Icon = selected.icon;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 ${neuStyles.button}`}
      >
        <span className="text-xl">{selected.emoji}</span>
        <span className="text-sm font-medium text-[#2d2418]">{selected.name}</span>
        <ChevronDown className={`w-4 h-4 text-[#5c5243] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute top-full left-0 mt-2 w-72 ${neuStyles.card} z-50 overflow-hidden`}
            >
              <div className="p-3 border-b border-[#dcd3c6]">
                <span className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">AI Persona</span>
              </div>
              {AI_PERSONAS.map((persona) => {
                const PIcon = persona.icon;
                return (
                  <motion.button
                    key={persona.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      onSelect(persona.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 hover:bg-[#dcd3c6]/30 transition-colors ${
                      currentPersona === persona.id ? 'bg-[#dcd3c6]/50' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${neuStyles.buttonPressed}`}>
                      <span className="text-xl">{persona.emoji}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#2d2418]">{persona.name}</span>
                        {currentPersona === persona.id && <Check className="w-4 h-4 text-[#5c5243]" />}
                      </div>
                      <p className="text-xs text-[#5c5243]/70 mt-0.5">{persona.description}</p>
                    </div>
                  </motion.button>
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
  return (
    <div className="space-y-3">
      <span className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Quick Prompts</span>
      <div className="grid grid-cols-1 gap-2">
        {QUICK_PROMPTS.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={prompt.id}
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(prompt.text)}
              className={`flex items-center gap-3 p-3 ${neuStyles.button} text-left`}
            >
              <div className={`p-1.5 rounded-lg ${neuStyles.pressed}`}>
                <span className="text-lg">{prompt.emoji}</span>
              </div>
              <span className="text-sm text-[#2d2418]">{prompt.text}</span>
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
  mode: ChatMode;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ sessions, activeId, mode, onSelect, onStar, onDelete, searchQuery, onSearchChange }) => {
  const [filter, setFilter] = useState<'all' | 'starred'>('all');

  const filtered = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'starred' && s.isStarred);
    const matchesMode = s.mode === mode;
    return matchesSearch && matchesFilter && matchesMode;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3">
        <div className={`relative ${neuStyles.input}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c5243]/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-transparent text-sm text-[#2d2418] placeholder-[#5c5243]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-3 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            filter === 'all'
              ? neuStyles.buttonPressed + ' text-[#2d2418]'
              : 'text-[#5c5243] hover:bg-[#dcd3c6]/30'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('starred')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            filter === 'starred'
              ? neuStyles.buttonPressed + ' text-[#2d2418]'
              : 'text-[#5c5243] hover:bg-[#dcd3c6]/30'
          }`}
        >
          Starred
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((session) => (
          <motion.div
            key={session.id}
            whileHover={{ x: 2 }}
            onClick={() => onSelect(session.id)}
            className={`group p-3 cursor-pointer rounded-xl mb-2 transition-all ${
              activeId === session.id
                ? neuStyles.pressed
                : 'hover:bg-[#dcd3c6]/20'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                {session.mode === 'general' && <Users className="w-3 h-3 text-[#5c5243]" />}
                <h4 className={`font-medium text-sm truncate pr-2 ${activeId === session.id ? 'text-[#2d2418]' : 'text-[#2d2418]'}`}>
                  {session.title}
                </h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStar(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-lg">{session.isStarred ? '⭐' : '☆'}</span>
              </button>
            </div>
            <p className="text-xs text-[#5c5243]/70 line-clamp-2 mb-2">{session.lastMessage}</p>
            <div className="flex items-center justify-between text-xs text-[#5c5243]/50">
              <span>{session.messageCount} msgs</span>
              <span>{session.timestamp.toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <History className="w-8 h-8 text-[#5c5243]/30 mx-auto mb-2" />
            <p className="text-sm text-[#5c5243]/50">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HealthContextPanel: React.FC = () => {
  const toggles = [
    { key: 'nutrition', label: 'Nutrition Data', emoji: '🥗', icon: Utensils },
    { key: 'sleep', label: 'Sleep Data', emoji: '😴', icon: Moon },
    { key: 'activity', label: 'Activity Data', emoji: '🏃', icon: Activity },
    { key: 'mood', label: 'Mood Data', emoji: '🧠', icon: Brain },
  ];

  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    nutrition: true,
    sleep: true,
    activity: true,
    mood: false,
  });

  const toggle = (key: string) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {/* Context Toggles */}
      <div className={`${neuStyles.card} p-4`}>
        <h4 className="text-sm font-semibold text-[#2d2418] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#5c5243]" />
          Health Context
        </h4>
        <div className="space-y-2">
          {toggles.map(({ key, label, emoji }) => (
            <label
              key={key}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#dcd3c6]/20 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{emoji}</span>
                <span className="text-sm text-[#2d2418]">{label}</span>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  enabled[key]
                    ? 'bg-[#5c5243]'
                    : `${neuStyles.pressed}`
                }`}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-[#e4dfd5] rounded-full shadow-md"
                  animate={{ left: enabled[key] ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className={`${neuStyles.card} p-4`}>
        <h4 className="text-sm font-semibold text-[#2d2418] mb-3">Today&apos;s Summary</h4>
        <div className="space-y-3">
          {[
            { label: 'Steps', value: '8,432', emoji: '👟', change: '+12%' },
            { label: 'Sleep', value: '7.5h', emoji: '😴', change: '0%' },
            { label: 'Calories', value: '1,850', emoji: '🔥', change: '-5%' },
          ].map((metric) => (
            <div key={metric.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{metric.emoji}</span>
                <span className="text-sm text-[#5c5243]">{metric.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[#2d2418]">{metric.value}</span>
                <span className={`text-xs ml-1 ${metric.change.startsWith('+') ? 'text-green-600' : metric.change === '0%' ? 'text-[#5c5243]/50' : 'text-red-500'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${neuStyles.card} p-4 bg-gradient-to-br from-[#5c5243]/10 to-[#2d2418]/10`}>
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-4 h-4 text-[#5c5243]" />
          <h4 className="text-sm font-semibold text-[#2d2418]">AI Insights</h4>
        </div>
        <p className="text-sm text-[#5c5243] mb-3">
          Based on your sleep data, consider an early bedtime tonight to recover from late nights.
        </p>
        <button className={`px-3 py-1.5 text-xs ${neuStyles.button} text-[#2d2418]`}>
          Tell me more
        </button>
      </div>
    </div>
  );
};

const ChatSettingsPanel: React.FC<{
  settings: ChatSettings;
  onSave: (settings: ChatSettings) => void;
  onClose: () => void;
}> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${neuStyles.card} p-6 w-full max-w-md z-10`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2d2418]">Chat Settings</h3>
          <button onClick={onClose} className={`p-2 ${neuStyles.button}`}>
            <X className="w-4 h-4 text-[#5c5243]" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Temperature */}
          <div>
            <label className="text-sm font-medium text-[#2d2418] mb-2 block">
              AI Temperature: {localSettings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.temperature}
              onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Max Tokens */}
          <div>
            <label className="text-sm font-medium text-[#2d2418] mb-2 block">
              Max Tokens: {localSettings.maxTokens}
            </label>
            <input
              type="range"
              min="256"
              max="4096"
              step="256"
              value={localSettings.maxTokens}
              onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              { key: 'contextEnabled', label: 'Enable Health Context', icon: Activity },
              { key: 'autoSave', label: 'Auto-save Conversations', icon: Bookmark },
              { key: 'notifications', label: 'Notifications', icon: Bell },
            ].map(({ key, label, icon: Icon }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#dcd3c6]/20 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#5c5243]" />
                  <span className="text-sm text-[#2d2418]">{label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings[key as keyof ChatSettings] as boolean}
                  onChange={(e) => setLocalSettings({ ...localSettings, [key]: e.target.checked })}
                  className="w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={`flex-1 py-2.5 ${neuStyles.button} text-[#5c5243]`}>
            Cancel
          </button>
          <button onClick={handleSave} className={`flex-1 py-2.5 ${neuStyles.button} text-[#2d2418] font-medium`}>
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== Main Component ====================

export default function AIChatUnified() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('ai');
  const [currentPersona, setCurrentPersona] = useState('dr-wellness');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(MOCK_CHAT_HISTORY);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 1024,
    contextEnabled: true,
    autoSave: true,
    notifications: false,
    theme: 'system',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

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

    // Simulate AI/General response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: chatMode === 'ai' ? 'assistant' : 'member',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        memberName: chatMode === 'general' ? 'Team Member' : undefined,
        actionCards: chatMode === 'ai' ? MOCK_ACTION_CARDS : undefined,
      };
      setMessages(prev => [...prev, aiMessage]);

      const responses = chatMode === 'ai' 
        ? [
            "Based on your recent health data, you've been making great progress! ",
            "Your average step count this week is 8,432 steps per day. ",
            "Here are some personalized recommendations:\n\n",
            "1. **Nutrition**: Add more protein to breakfast\n",
            "2. **Sleep**: Keep maintaining your bedtime routine\n",
            "3. **Activity**: Include 20 min strength training 2-3x/week\n\n",
            "Would you like me to create a detailed plan?",
          ]
        : [
            "Thanks for sharing! ",
            "I agree with your point. ",
            "Let's discuss this further in our next meeting. ",
            "Sounds good! 👍",
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
      }, 600);
    }, 800);
  }, [inputMessage, attachments, chatMode]);

  const handleQuickPrompt = useCallback((text: string) => {
    setInputMessage(text);
    textareaRef.current?.focus();
  }, []);

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

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setInputMessage('How did I sleep last night?');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('How did I sleep last night?');
      }, 3000);
    }
  }, [isRecording]);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const selectedPersona = AI_PERSONAS.find(p => p.id === currentPersona);

  return (
    <div className={`flex bg-[#e4dfd5] ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]'}`}>
      {/* Mode Switcher Header */}
      <div className={`absolute top-0 left-0 right-0 z-40 mx-3 mt-3 ${neuStyles.convex} px-4 py-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setChatMode('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                chatMode === 'ai'
                  ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                  : `${neuStyles.button} text-[#5c5243]`
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI Assistant</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setChatMode('general')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                chatMode === 'general'
                  ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                  : `${neuStyles.button} text-[#5c5243]`
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">General Chat</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className={`p-2 ${neuStyles.button} text-[#5c5243]`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 ${neuStyles.button} text-[#5c5243]`}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <AnimatePresence mode="wait">
        {showLeftSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col overflow-hidden border-r border-[#dcd3c6] mt-20"
          >
            {/* New Chat Button */}
            <div className="p-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${neuStyles.button} font-medium text-[#2d2418]`}
              >
                <Plus className="w-5 h-5" />
                New {chatMode === 'ai' ? 'Chat' : 'Conversation'}
              </motion.button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-hidden">
              <ChatHistory
                sessions={chatHistory}
                activeId={activeChatId}
                mode={chatMode}
                onSelect={setActiveChatId}
                onStar={handleStarChat}
                onDelete={handleDeleteChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Quick Prompts (AI mode only) */}
            {chatMode === 'ai' && (
              <div className="p-3 border-t border-[#dcd3c6] max-h-64 overflow-y-auto">
                <QuickPrompts onSelect={handleQuickPrompt} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 mt-20">
        {/* Header */}
        <header className={`flex items-center justify-between px-4 py-3 ${neuStyles.convex} mx-3 mb-2`}>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className={`p-2 ${neuStyles.button}`}
            >
              {showLeftSidebar ? <ChevronDown className="w-5 h-5 rotate-90 text-[#5c5243]" /> : <ChevronRight className="w-5 h-5 text-[#5c5243]" />}
            </motion.button>

            {chatMode === 'ai' ? (
              <PersonaSelector currentPersona={currentPersona} onSelect={setCurrentPersona} />
            ) : (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5c5243]" />
                <span className="text-sm font-medium text-[#2d2418]">
                  {activeChatId ? chatHistory.find(c => c.id === activeChatId)?.title : 'General Chat'}
                </span>
              </div>
            )}

            {messages.length > 0 && (
              <span className="text-sm text-[#5c5243]/70">
                {messages.length} messages
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`p-2 ${isVoiceMode ? neuStyles.buttonPressed : neuStyles.button} ${isVoiceMode ? 'text-[#5c5243]' : 'text-[#5c5243]/70'}`}
            >
              {isVoiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`p-2 ${showRightSidebar ? neuStyles.buttonPressed : neuStyles.button} text-[#5c5243]`}
            >
              <BarChart3 className="w-5 h-5" />
            </motion.button>
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
                <motion.div
                  className={`w-24 h-24 mx-auto mb-6 ${neuStyles.card} flex items-center justify-center`}
                  animate={{
                    boxShadow: [
                      '6px 6px 12px rgba(44,40,34,0.15), -6px -6px 12px rgba(255,255,255,0.6)',
                      '8px 8px 16px rgba(44,40,34,0.2), -8px -8px 16px rgba(255,255,255,0.7)',
                      '6px 6px 12px rgba(44,40,34,0.15), -6px -6px 12px rgba(255,255,255,0.6)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-5xl">
                    {chatMode === 'ai' ? selectedPersona?.emoji : '💬'}
                  </span>
                </motion.div>
                <h2 className="text-2xl font-bold text-[#2d2418] mb-2">
                  {chatMode === 'ai' 
                    ? `Welcome to ${selectedPersona?.name}`
                    : 'Welcome to General Chat'}
                </h2>
                <p className="text-[#5c5243]/70 mb-8">
                  {chatMode === 'ai'
                    ? 'Ask me anything about your health, nutrition, fitness, or sleep.'
                    : 'Start a conversation with your team, friends, or family.'}
                </p>

                {chatMode === 'ai' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                      <motion.button
                        key={prompt.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className={`flex items-center gap-3 p-3 ${neuStyles.button} text-left`}
                      >
                        <div className={`p-2 rounded-lg ${neuStyles.pressed}`}>
                          <span className="text-xl">{prompt.emoji}</span>
                        </div>
                        <span className="text-sm text-[#2d2418]">{prompt.text}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[#5c5243]/70">Quick tips:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Say hello 👋', 'Share an update', 'Ask a question', 'Schedule a meeting'].map((tip) => (
                        <button
                          key={tip}
                          onClick={() => setInputMessage(tip)}
                          className={`px-4 py-2 ${neuStyles.button} text-sm text-[#5c5243]`}
                        >
                          {tip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  mode={chatMode}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onCopy={handleCopyMessage}
                />
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${neuStyles.convex}`}>
                      {chatMode === 'ai' ? (
                        <span className="text-xl">{selectedPersona?.emoji}</span>
                      ) : (
                        <span className="text-xl">👤</span>
                      )}
                    </div>
                    <div className={`${neuStyles.flat} shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] rounded-2xl rounded-bl-md`}>
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
        <div className={`p-4 mx-3 mb-3 ${neuStyles.convex}`}>
          {/* Attachments Preview */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-3 flex-wrap"
              >
                {attachments.map((att) => (
                  <motion.div
                    key={att.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-2 px-3 py-1.5 ${neuStyles.pressed} text-sm`}
                  >
                    {att.type === 'image' && <ImageIcon className="w-4 h-4 text-[#5c5243]" />}
                    {att.type === 'document' && <FileText className="w-4 h-4 text-[#5c5243]" />}
                    <span className="text-[#2d2418] truncate max-w-[150px]">{att.name}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="p-0.5 hover:bg-[#dcd3c6]/50 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-[#5c5243]" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 ${neuStyles.button} text-[#5c5243]`}
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Photo Upload */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 ${neuStyles.button} text-[#5c5243]`}
            >
              <Camera className="w-5 h-5" />
            </motion.button>

            {/* Voice Input */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`p-3 ${isRecording ? neuStyles.buttonPressed : neuStyles.button} ${isRecording ? 'text-red-500 animate-pulse' : 'text-[#5c5243]'}`}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? 'Listening...' : chatMode === 'ai' ? 'Ask about your health...' : 'Type a message...'}
                disabled={isRecording}
                rows={1}
                className={`w-full px-4 py-3 ${neuStyles.input} text-[#2d2418] placeholder-[#5c5243]/50 resize-none min-h-[48px] max-h-[200px]`}
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={(!inputMessage.trim() && attachments.length === 0) || isTyping}
              className={`p-3 ${neuStyles.button} ${(!inputMessage.trim() && attachments.length === 0) || isTyping ? 'opacity-50 cursor-not-allowed' : ''} text-[#5c5243]`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          <p className="text-xs text-[#5c5243]/50 text-center mt-3">
            {chatMode === 'ai'
              ? 'AI responses are for informational purposes only. Always consult healthcare professionals.'
              : 'Be respectful and follow community guidelines.'}
          </p>
        </div>
      </div>

      {/* Right Sidebar */}
      <AnimatePresence mode="wait">
        {showRightSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-l border-[#dcd3c6] overflow-hidden mt-20"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMode === 'ai' ? (
                <HealthContextPanel />
              ) : (
                <div className="space-y-4">
                  <div className={`${neuStyles.card} p-4`}>
                    <h4 className="text-sm font-semibold text-[#2d2418] mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#5c5243]" />
                      Chat Members
                    </h4>
                    <div className="space-y-2">
                      {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'].map((member, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#dcd3c6]/20">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white text-xs font-medium">
                            {member.split(' ').map(n => n[0]).join('')}
                          </span>
                          <span className="text-sm text-[#2d2418]">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${neuStyles.card} p-4`}>
                    <h4 className="text-sm font-semibold text-[#2d2418] mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#5c5243]" />
                      Chat Info
                    </h4>
                    <div className="space-y-2 text-sm text-[#5c5243]">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>Jan 15, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Messages:</span>
                        <span>1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Members:</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      {showSettings && (
        <ChatSettingsPanel
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
