/**
 * AIChatUnified - AI Health Assistant Chat Interface
 * ChatGPT/Claude-style chat interface with ElCore components
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  MoreHorizontal,
  Plus,
  Clock,
  Star,
  Zap,
  Heart,
  Activity,
  Moon,
  Sun,
  Apple,
  Dumbbell,
  Brain,
  ChevronRight,
  X,
} from 'lucide-react';
import { ElCard, ElButton, ElInput } from '../../components/ElCore';

// ==================== Types ====================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickPrompt {
  id: string;
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
}

// ==================== Mock Data ====================

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', icon: Apple, label: 'Nutrition', prompt: 'What should I eat for better energy?', color: 'text-green-500' },
  { id: '2', icon: Activity, label: 'Health', prompt: 'How can I improve my sleep quality?', color: 'text-blue-500' },
  { id: '3', icon: Dumbbell, label: 'Fitness', prompt: 'Create a 30-minute home workout', color: 'text-orange-500' },
  { id: '4', icon: Brain, label: 'Mental', prompt: 'Help me reduce stress and anxiety', color: 'text-purple-500' },
  { id: '5', icon: Heart, label: 'Heart', prompt: 'What are the signs of good heart health?', color: 'text-red-500' },
  { id: '6', icon: Moon, label: 'Sleep', prompt: 'Tips for falling asleep faster', color: 'text-indigo-500' },
];

const WELCOME_SUGGESTIONS = [
  'Analyze my health data',
  'Create a meal plan',
  'Suggest a workout routine',
  'Track my mood',
  'Review my sleep patterns',
];

// ==================== Components ====================

const TypingIndicator: React.FC = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <ElCard variant="flat" className="max-w-[80%] py-3">
      <div className="flex gap-1">
        <motion.span
          className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </ElCard>
  </div>
);

const AIMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1 max-w-[80%]">
      <ElCard variant="flat" className="">
        <p className="text-[var(--text-primary)] whitespace-pre-wrap">{message.content}</p>
      </ElCard>
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="px-3 py-1.5 text-sm bg-[var(--bone-300)] hover:bg-[var(--bone-400)] rounded-full text-[var(--text-secondary)] transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const UserMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-end"
  >
    <ElCard variant="gradient" className="max-w-[80%]">
      <p className="text-white">{message.content}</p>
    </ElCard>
  </motion.div>
);

const WelcomeScreen: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-full px-4"
  >
    {/* Logo & Title */}
    <div className="text-center mb-8">
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center shadow-lg">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
        EthosLife AI Assistant
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md">
        Your personal health companion. Ask about nutrition, fitness, sleep, mental health, and more.
      </p>
    </div>

    {/* Quick Prompts Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl mb-8">
      {QUICK_PROMPTS.map((prompt) => (
        <motion.button
          key={prompt.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPromptClick(prompt.prompt)}
          className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bone-200)] shadow-[8px_8px_16px_rgba(44,40,34,0.08),-8px_-8px_16px_rgba(255,255,255,0.6)] hover:shadow-[12px_12px_24px_rgba(44,40,34,0.12),-12px_-12px_24px_rgba(255,255,255,0.7)] transition-all text-left"
        >
          <div className={`p-2 rounded-xl bg-[var(--bone-300)] ${prompt.color}`}>
            <prompt.icon className="w-5 h-5" />
          </div>
          <span className="font-medium text-[var(--text-primary)] text-sm">{prompt.label}</span>
        </motion.button>
      ))}
    </div>

    {/* Suggestion Chips */}
    <div className="flex flex-wrap justify-center gap-2 max-w-xl">
      {WELCOME_SUGGESTIONS.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onPromptClick(suggestion)}
          className="px-4 py-2 text-sm bg-[var(--bone-300)]/50 hover:bg-[var(--bone-300)] rounded-full text-[var(--text-secondary)] transition-colors flex items-center gap-2"
        >
          <Plus className="w-3 h-3" />
          {suggestion}
        </button>
      ))}
    </div>
  </motion.div>
);

// ==================== Main Component ====================

export const AIChatUnified: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const responses: Record<string, string> = {
      'nutrition': `Based on your health profile, I'd recommend focusing on whole foods rich in nutrients. Here are some key suggestions:

1. **Protein**: Include lean meats, fish, legumes, and eggs
2. **Complex carbs**: Oats, quinoa, sweet potatoes
3. **Healthy fats**: Avocados, nuts, olive oil
4. **Hydration**: Aim for 8 glasses of water daily

Would you like me to create a personalized meal plan?`,
      'sleep': `Improving sleep quality is crucial for overall health. Here are evidence-based tips:

• Maintain a consistent sleep schedule
• Create a relaxing bedtime routine
• Keep your bedroom cool (65-68°F)
• Limit screen time 1 hour before bed
• Avoid caffeine after 2 PM
• Consider magnesium supplements

Your sleep tracker shows you've been averaging 6.5 hours. Let's aim for 7-8 hours!`,
      'fitness': `Here's a balanced 30-minute home workout routine:

**Warm-up (5 min)**
- Jumping jacks: 2 min
- Arm circles: 1 min
- Leg swings: 2 min

**Circuit (20 min)** - Repeat 3x
- Push-ups: 10 reps
- Squats: 15 reps
- Plank: 30 sec
- Lunges: 10 each leg
- Mountain climbers: 20 reps

**Cool down (5 min)**
- Stretching and deep breathing`,
      'mental': `Managing stress is essential for your wellbeing. Here are techniques that can help:

🧘 **Mindfulness**: Try 5-minute daily meditation
📝 **Journaling**: Write down thoughts before bed
🌬️ **Breathing**: 4-7-8 technique (inhale 4, hold 7, exhale 8)
🏃 **Movement**: Even a 10-minute walk helps
💤 **Rest**: Prioritize quality sleep

Would you like me to guide you through a quick breathing exercise?`,
    };

    // Simple keyword matching
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return `Thank you for sharing! Based on your question about "${userMessage}", I'd be happy to help you with personalized recommendations.

Your current health metrics show:
• Health Score: 87/100
• Activity Level: Good
• Sleep Quality: Improving
• Nutrition: On track

Would you like me to analyze this further or provide specific action steps?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowWelcome(false);
    setIsTyping(true);

    // Generate AI response
    const aiContent = await generateAIResponse(userMessage.content);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiContent,
      timestamp: new Date(),
      suggestions: ['Tell me more', 'Create a plan', 'Set reminders', 'Track progress'],
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bone-200)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[var(--text-primary)]">AI Health Assistant</h1>
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Online
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!showWelcome && (
              <ElButton variant="flat" size="sm" onClick={clearChat}>
                <Plus className="w-4 h-4" />
                New Chat
              </ElButton>
            )}
            <button className="p-2 rounded-xl hover:bg-[var(--bone-300)] transition-colors">
              <MoreHorizontal className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {showWelcome ? (
              <WelcomeScreen onPromptClick={handlePromptClick} />
            ) : (
              <>
                {messages.map((message) => (
                  message.role === 'user' ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AIMessage key={message.id} message={message} />
                  )
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--bone-400)]/30 px-4 py-4 bg-[var(--bone-200)]">
            <div className="max-w-3xl mx-auto">
              {/* Quick Prompts (only when not welcome) */}
              {!showWelcome && (
                <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                  {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt.prompt)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bone-300)] rounded-full text-xs text-[var(--text-secondary)] hover:bg-[var(--bone-400)] transition-colors whitespace-nowrap"
                    >
                      <prompt.icon className={`w-3 h-3 ${prompt.color}`} />
                      {prompt.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input Field */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <ElInput
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your health..."
                    fullWidth
                    rightIcon={
                      inputValue ? (
                        <button onClick={() => setInputValue('')}>
                          <X className="w-4 h-4" />
                        </button>
                      ) : undefined
                    }
                  />
                </div>
                <ElButton
                  variant="gradient"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4"
                >
                  <Send className="w-5 h-5" />
                </ElButton>
              </div>
              
              <p className="text-xs text-center text-[var(--text-tertiary)] mt-3">
                AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatUnified;
