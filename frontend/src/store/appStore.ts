import { create } from 'zustand';

// ============ TYPES ============

export interface DayActivity {
  id: string;
  time: string;
  title: string;
  emoji: string;
  completed: boolean;
  category: 'water' | 'workout' | 'meal' | 'meditation' | 'work' | 'rest' | 'social' | 'custom';
  duration?: number;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  category: 'health' | 'work' | 'mindset' | 'social' | 'creative';
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  targetDays: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'health' | 'career' | 'finance' | 'relationships' | 'learning' | 'lifestyle';
  progress: number;
  deadline: string;
  milestones: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

export interface AISession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  type: 'friend' | 'specialist';
  specialty?: string;
  rating?: number;
  lastActivity?: string;
  isSubscribed?: boolean;
}

export interface WaterEntry {
  id: string;
  amount: number;
  time: string;
}

export interface AppState {
  userName: string;
  userAvatar: string;
  selectedDate: string;

  todayActivities: DayActivity[];
  waterGoal: number;
  waterEntries: WaterEntry[];
  steps: number;
  stepsGoal: number;
  sleepHours: number;
  sleepGoal: number;
  caloriesEaten: number;
  caloriesGoal: number;
  heartRate: number;
  mood: number;

  habits: Habit[];
  goals: Goal[];
  aiSessions: AISession[];
  activeSessionId: string | null;
  contacts: Contact[];

  toggleActivity: (id: string) => void;
  addActivity: (activity: Omit<DayActivity, 'id'>) => void;
  setSelectedDate: (date: string) => void;
  toggleHabit: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  addWater: (amount: number) => void;
  createAISession: () => string;
  addAIMessage: (sessionId: string, role: 'user' | 'assistant', content: string) => void;
  setActiveSession: (id: string | null) => void;
}

// ============ DEMO DATA ============

const today = new Date().toISOString().split('T')[0];

const demoActivities: DayActivity[] = [
  { id: '1', time: '07:00', title: 'Стакан воды', emoji: '💧', completed: true, category: 'water', duration: 2 },
  { id: '2', time: '07:30', title: 'Утренняя разминка', emoji: '🤸', completed: true, category: 'workout', duration: 15 },
  { id: '3', time: '08:00', title: 'Завтрак', emoji: '🥗', completed: true, category: 'meal', duration: 20 },
  { id: '4', time: '09:00', title: 'Рабочий блок', emoji: '💼', completed: true, category: 'work', duration: 90 },
  { id: '5', time: '11:00', title: 'Стакан воды', emoji: '💧', completed: false, category: 'water', duration: 2 },
  { id: '6', time: '13:00', title: 'Обед', emoji: '🍽️', completed: false, category: 'meal', duration: 30 },
  { id: '7', time: '14:00', title: 'Прогулка 20 мин', emoji: '🚶', completed: false, category: 'workout', duration: 20 },
  { id: '8', time: '18:00', title: 'Тренировка', emoji: '🏋️', completed: false, category: 'workout', duration: 60 },
  { id: '9', time: '20:00', title: 'Ужин', emoji: '🥘', completed: false, category: 'meal', duration: 25 },
  { id: '10', time: '21:00', title: 'Медитация', emoji: '🧘', completed: false, category: 'meditation', duration: 15 },
  { id: '11', time: '22:00', title: 'Чтение', emoji: '📚', completed: false, category: 'rest', duration: 30 },
  { id: '12', time: '23:00', title: 'Сон', emoji: '😴', completed: false, category: 'rest' },
];

const demoHabits: Habit[] = [
  { id: 'h1', title: 'Пить 2л воды', emoji: '💧', category: 'health', streak: 12, completedToday: true, completedDates: [], targetDays: 7, color: '#60a5fa' },
  { id: 'h2', title: 'Тренировка', emoji: '💪', category: 'health', streak: 8, completedToday: false, completedDates: [], targetDays: 5, color: '#34d399' },
  { id: 'h3', title: 'Медитация 10 мин', emoji: '🧘', category: 'mindset', streak: 21, completedToday: true, completedDates: [], targetDays: 7, color: '#a78bfa' },
  { id: 'h4', title: 'Чтение 30 мин', emoji: '📖', category: 'mindset', streak: 5, completedToday: false, completedDates: [], targetDays: 7, color: '#fb923c' },
  { id: 'h5', title: 'Сон до 23:00', emoji: '😴', category: 'health', streak: 3, completedToday: false, completedDates: [], targetDays: 7, color: '#818cf8' },
  { id: 'h6', title: 'Звонок близким', emoji: '📞', category: 'social', streak: 7, completedToday: true, completedDates: [], targetDays: 3, color: '#f472b6' },
];

const demoGoals: Goal[] = [
  {
    id: 'g1', title: 'Пробежать 5 км', emoji: '🏃', category: 'health',
    description: 'Подготовиться к забегу и пробежать 5 км без остановки',
    progress: 65, deadline: '2026-06-30',
    milestones: [
      { id: 'm1', title: 'Бегать 1 км', completed: true },
      { id: 'm2', title: 'Бегать 2 км', completed: true },
      { id: 'm3', title: 'Бегать 3.5 км', completed: true },
      { id: 'm4', title: 'Бегать 5 км', completed: false },
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'g2', title: 'Читать 24 книги в год', emoji: '📚', category: 'learning',
    description: 'Прочитать 2 книги в месяц по разным темам',
    progress: 42, deadline: '2026-12-31',
    milestones: [
      { id: 'm1', title: '6 книг', completed: true },
      { id: 'm2', title: '12 книг', completed: false },
      { id: 'm3', title: '18 книг', completed: false },
      { id: 'm4', title: '24 книги', completed: false },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'g3', title: 'Выучить испанский B1', emoji: '🇪🇸', category: 'learning',
    description: 'Достичь уровня B1 по испанскому языку',
    progress: 28, deadline: '2026-12-01',
    milestones: [
      { id: 'm1', title: 'A1 уровень', completed: true },
      { id: 'm2', title: 'A2 уровень', completed: false },
      { id: 'm3', title: 'B1 уровень', completed: false },
    ],
    createdAt: '2026-01-15',
  },
  {
    id: 'g4', title: 'Увеличить доход на 30%', emoji: '💰', category: 'finance',
    description: 'Увеличить ежемесячный доход через новые проекты',
    progress: 18, deadline: '2026-12-31',
    milestones: [
      { id: 'm1', title: 'Найти 2 новых клиента', completed: true },
      { id: 'm2', title: '+10% к доходу', completed: false },
      { id: 'm3', title: '+20% к доходу', completed: false },
      { id: 'm4', title: '+30% к доходу', completed: false },
    ],
    createdAt: '2026-01-01',
  },
];

const demoContacts: Contact[] = [
  { id: 'c1', name: 'Алекс М.', avatar: '👨‍💻', type: 'friend', lastActivity: '2 часа назад' },
  { id: 'c2', name: 'Мария К.', avatar: '👩‍🎨', type: 'friend', lastActivity: 'вчера' },
  { id: 'c3', name: 'Дима Р.', avatar: '🧑‍🏋️', type: 'friend', lastActivity: '3 дня назад' },
  { id: 'c4', name: 'Dr. Иванов', avatar: '👨‍⚕️', type: 'specialist', specialty: 'Нутрициолог', rating: 4.9, isSubscribed: false },
  { id: 'c5', name: 'Анна Фитнес', avatar: '👩‍🏋️', type: 'specialist', specialty: 'Персональный тренер', rating: 4.8, isSubscribed: true },
  { id: 'c6', name: 'Dr. Петров', avatar: '🧑‍⚕️', type: 'specialist', specialty: 'Психолог', rating: 4.7, isSubscribed: false },
];

const demoAISession: AISession = {
  id: 'session1',
  title: 'Как улучшить сон?',
  lastMessage: 'Попробуйте технику 4-7-8 дыхания перед сном...',
  timestamp: new Date(Date.now() - 3600000).toISOString(),
  messages: [
    {
      role: 'user',
      content: 'Как улучшить качество сна?',
      timestamp: new Date(Date.now() - 3700000).toISOString(),
    },
    {
      role: 'assistant',
      content: 'Для улучшения сна важно:\n\n1. **Режим** — ложитесь и вставайте в одно время каждый день\n2. **Температура** — 18-20°C оптимальна для сна\n3. **Техника 4-7-8** — вдох 4 сек, задержка 7 сек, выдох 8 сек\n4. **Без экранов** — за 1 час до сна откажитесь от телефона\n5. **Магний** — помогает расслабиться (400 мг вечером)\n\nЧто из этого вы уже пробовали?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

// ============ STORE ============

export const useAppStore = create<AppState>()((set, get) => ({
  userName: 'Александр',
  userAvatar: '🧘',
  selectedDate: today,

  todayActivities: demoActivities,
  waterGoal: 2000,
  waterEntries: [
    { id: 'w1', amount: 250, time: '07:00' },
    { id: 'w2', amount: 250, time: '09:30' },
    { id: 'w3', amount: 350, time: '12:00' },
  ],
  steps: 6842,
  stepsGoal: 10000,
  sleepHours: 7.5,
  sleepGoal: 8,
  caloriesEaten: 1420,
  caloriesGoal: 2200,
  heartRate: 68,
  mood: 4,

  habits: demoHabits,
  goals: demoGoals,
  aiSessions: [demoAISession],
  activeSessionId: 'session1',
  contacts: demoContacts,

  toggleActivity: (id) =>
    set((state) => ({
      todayActivities: state.todayActivities.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      ),
    })),

  addActivity: (activity) =>
    set((state) => ({
      todayActivities: [...state.todayActivities, { ...activity, id: Date.now().toString() }].sort(
        (a, b) => a.time.localeCompare(b.time)
      ),
    })),

  setSelectedDate: (date) => set({ selectedDate: date }),

  toggleHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak - 1 : h.streak + 1 }
          : h
      ),
    })),

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, { ...habit, id: Date.now().toString(), streak: 0, completedDates: [] }],
    })),

  updateGoalProgress: (id, progress) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, progress } : g)),
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, { ...goal, id: Date.now().toString(), createdAt: new Date().toISOString() }],
    })),

  addWater: (amount) =>
    set((state) => ({
      waterEntries: [
        ...state.waterEntries,
        {
          id: Date.now().toString(),
          amount,
          time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    })),

  createAISession: () => {
    const id = Date.now().toString();
    const session: AISession = {
      id,
      title: 'Новая беседа',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messages: [],
    };
    set((state) => ({ aiSessions: [session, ...state.aiSessions], activeSessionId: id }));
    return id;
  },

  addAIMessage: (sessionId, role, content) =>
    set((state) => ({
      aiSessions: state.aiSessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, { role, content, timestamp: new Date().toISOString() }],
              lastMessage: content.slice(0, 80),
              timestamp: new Date().toISOString(),
              title: s.messages.length === 0 && role === 'user' ? content.slice(0, 40) : s.title,
            }
          : s
      ),
    })),

  setActiveSession: (id) => set({ activeSessionId: id }),
}));
