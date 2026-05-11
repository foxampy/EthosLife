import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Bot, User, MessageSquare } from 'lucide-react';

// Demo AI responses
const demoResponses: Record<string, string> = {
  'сон': 'Для улучшения сна:\n\n1. **Режим** — ложитесь в одно время каждый день\n2. **Техника 4-7-8** — вдох 4 сек, задержка 7 сек, выдох 8 сек\n3. **Температура** — 18-20°C оптимальна\n4. **Без экранов** — за час до сна\n5. **Магний** — 400 мг вечером\n\nКакой из этих методов хотите попробовать?',
  'питани': 'Основы правильного питания:\n\n🥗 **Белки** (30%) — мясо, рыба, яйца, бобовые\n🌾 **Углеводы** (40%) — цельнозерновые, овощи\n🥑 **Жиры** (30%) — авокадо, орехи, рыба\n💧 **Вода** — 30 мл на кг веса\n\nГлавное: не пропускайте завтрак и ешьте каждые 3-4 часа.',
  'тренировк': 'Программа для начинающих:\n\n**3 раза в неделю:**\n- Пн: Силовая (верх тела)\n- Ср: Кардио 30 мин\n- Пт: Силовая (низ тела)\n\n**Прогресс:**\n- Неделя 1-2: Привычка\n- Неделя 3-4: Интенсивность +\n- Месяц 2: Разнообразие\n\nНачните с 20-30 минут.',
  'стресс': 'Управление стрессом:\n\n🧘 **Дыхание** — коробочное 4-4-4-4\n🚶 **Прогулки** — 20 мин на свежем воздухе\n📝 **Журнал** — записывайте мысли\n📱 **Детокс** — час без телефона\n💬 **Разговор** — делитесь с близкими\n\nЧто сейчас вызывает наибольший стресс?',
  'привычк': 'Как формировать привычки:\n\n**Метод 21/90:**\n- 21 день — базовая привычка\n- 90 дней — автоматизм\n\n**Правило 2 минут:** если занимает < 2 мин, делайте сразу\n\n**Цепочка:** привяжите новую привычку к уже существующей\n\n*Пример: После кофе → 5 мин растяжка*\n\nКакую привычку хотите сформировать?',
  'цел': 'Постановка целей по SMART:\n\n✅ **S** — Конкретная\n📏 **M** — Измеримая\n🎯 **A** — Достижимая\n🔗 **R** — Значимая\n⏰ **T** — Ограниченная по времени\n\n*Плохо: "Хочу похудеть"\nХорошо: "Минус 5 кг к 1 июня через тренировки 3x/неделю"*\n\nРасскажите о вашей цели!',
  'мотивац': 'Как поддерживать мотивацию:\n\n🔥 **Визуализация** — представляйте результат каждое утро\n📊 **Прогресс** — отмечайте маленькие победы\n👥 **Окружение** — общайтесь с теми, кто достиг цели\n🏆 **Награды** — поощряйте себя\n\nПомните: мотивация приходит ПОСЛЕ действия, не до него.',
  'вода': 'Нормы потребления воды:\n\n💧 **Формула:** 30-35 мл × вес (кг)\n\n**Когда пить:**\n- Стакан после пробуждения\n- За 30 мин до еды\n- Каждые 2 часа\n- После тренировки\n\n**Признаки обезвоживания:** усталость, головная боль, трудности с концентрацией\n\nОптимально ~2 литра в день.',
  'медитац': 'Медитация для начинающих:\n\n⏱️ **Начните с 5 минут** в день\n\n**Техника 1 — Дыхание:**\n1. Сядьте удобно\n2. Закройте глаза\n3. Считайте вдохи до 10, потом снова\n\n**Техника 2 — Боди-скан:**\nПоследовательно расслабляйте части тела сверху вниз\n\n**Лучшее время:** утром сразу после пробуждения.',
  'бег': 'План бега для начинающих (программа Couch to 5K):\n\n**Неделя 1-2:** 1 мин бег / 2 мин ходьба × 8\n**Неделя 3-4:** 2 мин бег / 1 мин ходьба × 6\n**Неделя 5-6:** 5 мин бег / 1 мин ходьба × 4\n**Неделя 7-8:** 10 мин бег × 2\n**Неделя 9-10:** 20+ мин бег\n\nПомните про разминку и заминку!',
  'default': 'Я ваш персональный ИИ-ассистент EthosLife! 🌱\n\nМогу помочь с:\n- 😴 Сном и восстановлением\n- 🥗 Питанием и диетой\n- 💪 Тренировками и бегом\n- 🧘 Стрессом и медитацией\n- 🎯 Целями и планированием\n- ⚡ Привычками\n- 💧 Гидратацией\n\nЗадайте любой вопрос о здоровье и образе жизни!',
};

const suggestedQuestions = [
  { text: 'Как улучшить сон?', emoji: '😴' },
  { text: 'Составь план питания', emoji: '🥗' },
  { text: 'Программа тренировок для начинающих', emoji: '💪' },
  { text: 'Как справиться со стрессом?', emoji: '🧘' },
  { text: 'Как сформировать привычку?', emoji: '⚡' },
  { text: 'Поставь со мной цель', emoji: '🎯' },
];

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, response] of Object.entries(demoResponses)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  return demoResponses['default'];
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-0.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line) return <br key={i} />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className={line.startsWith('- ') ? 'ml-3' : ''}>
            {parts.map((p, j) =>
              j % 2 === 1 ? <strong key={j}>{p}</strong> : p
            )}
          </p>
        );
      })}
    </div>
  );
}

const neuCard = {
  background: '#e8e0d5',
  boxShadow: '8px 8px 16px rgba(44,40,34,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
  borderRadius: '20px',
};

// ==================== Types ====================

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AISession {
  id: string;
  title: string;
  lastMessage: string;
  messages: ChatMessage[];
}

// ==================== Main Component ====================

export default function AIChatUnified() {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const createSession = (): string => {
    const id = Date.now().toString();
    const newSession: AISession = {
      id,
      title: `Чат ${sessions.length + 1}`,
      lastMessage: '',
      messages: [],
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(id);
    return id;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }

    const userMsg: ChatMessage = { role: 'user', content: text };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              lastMessage: text,
              title: s.messages.length === 0 ? text.slice(0, 28) + (text.length > 28 ? '…' : '') : s.title,
            }
          : s
      )
    );
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

    const response = getAIResponse(text);
    const assistantMsg: ChatMessage = { role: 'assistant', content: response };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, assistantMsg], lastMessage: response.slice(0, 60) }
          : s
      )
    );
    setIsTyping(false);
  };

  return (
    <div className="flex h-[calc(100vh-112px)]" style={{ background: '#e8e0d5' }}>
      {/* Sessions sidebar (desktop) */}
      <div className="hidden md:flex flex-col w-60 p-3 gap-2 border-r border-black/5">
        <button
          onClick={createSession}
          className="flex items-center gap-2 p-3 rounded-xl text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}
        >
          <Plus className="w-4 h-4" /> Новый чат
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className="w-full text-left p-3 rounded-xl transition-all"
              style={{
                background: s.id === activeSessionId ? 'rgba(92,82,67,0.1)' : 'transparent',
                borderLeft: s.id === activeSessionId ? '2px solid #8c7a6b' : '2px solid transparent',
              }}
            >
              <p className="text-sm font-medium text-[#2d2418] truncate">{s.title}</p>
              <p className="text-xs text-[#a09282] truncate mt-0.5">{s.lastMessage || 'Нет сообщений'}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="flex items-center gap-3 p-3 md:hidden border-b border-black/5">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="p-2 rounded-xl"
            style={neuCard}
          >
            <MessageSquare className="w-4 h-4 text-[#8c7a6b]" />
          </button>
          <h2 className="font-bold text-[#2d2418] flex-1 truncate">
            {activeSession?.title || 'ИИ-ассистент'}
          </h2>
          <button onClick={createSession} className="p-2 rounded-xl" style={neuCard}>
            <Plus className="w-4 h-4 text-[#8c7a6b]" />
          </button>
        </div>

        {/* Mobile sessions dropdown */}
        <AnimatePresence>
          {showSessions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden border-b border-black/5"
              style={{ background: '#e8e0d5' }}
            >
              <div className="p-3 space-y-1">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSessionId(s.id); setShowSessions(false); }}
                    className="w-full text-left p-2.5 rounded-lg text-sm"
                    style={{ background: s.id === activeSessionId ? 'rgba(92,82,67,0.1)' : 'transparent', color: '#2d2418' }}
                  >
                    {s.title}
                  </button>
                ))}
                {sessions.length === 0 && (
                  <p className="text-xs text-[#a09282] p-2">Нет чатов</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="pt-4 text-center">
              <div
                className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)', boxShadow: '0 8px 24px rgba(92,82,67,0.3)' }}
              >
                🌱
              </div>
              <h3 className="font-bold text-[#2d2418] mb-1">EthosLife ИИ-ассистент</h3>
              <p className="text-sm text-[#6b5d52] mb-6">Спросите о здоровье, привычках и целях</p>
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                {suggestedQuestions.map((q) => (
                  <motion.button
                    key={q.text}
                    onClick={() => sendMessage(q.text)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-3 rounded-xl text-left text-sm"
                    style={neuCard}
                  >
                    <span>{q.emoji}</span>
                    <span className="text-[#6b5d52] text-xs">{q.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: msg.role === 'assistant'
                    ? 'linear-gradient(135deg, #5c5243, #8c7a6b)'
                    : 'rgba(92,82,67,0.12)',
                }}
              >
                {msg.role === 'assistant'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-[#5c5243]" />
                }
              </div>
              <div
                className="max-w-[78%] p-3.5 rounded-2xl"
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #5c5243, #8c7a6b)'
                    : '#e8e0d5',
                  boxShadow: msg.role === 'user'
                    ? '0 4px 12px rgba(92,82,67,0.25)'
                    : '4px 4px 8px rgba(44,40,34,0.08), -4px -4px 8px rgba(255,255,255,0.6)',
                  color: msg.role === 'user' ? 'white' : '#2d2418',
                }}
              >
                <MessageContent content={msg.content} />
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                style={{ background: '#e8e0d5', boxShadow: '4px 4px 8px rgba(44,40,34,0.08), -4px -4px 8px rgba(255,255,255,0.6)' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#8c7a6b]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black/5">
          <div
            className="flex gap-2 p-2 rounded-2xl"
            style={{ background: '#e8e0d5', boxShadow: 'inset 3px 3px 6px rgba(44,40,34,0.08), inset -3px -3px 6px rgba(255,255,255,0.6)' }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Спросите о здоровье, целях, привычках..."
              className="flex-1 bg-transparent outline-none text-sm text-[#2d2418] placeholder-[#a09282] px-2"
            />
            <motion.button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: input.trim() ? 'linear-gradient(135deg, #5c5243, #8c7a6b)' : 'rgba(44,40,34,0.05)',
                boxShadow: input.trim() ? '0 4px 12px rgba(92,82,67,0.3)' : 'none',
              }}
            >
              <Send className="w-4 h-4" style={{ color: input.trim() ? 'white' : '#a09282' }} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
