# EthosLife - UX/UI Analysis & Multi-Agent Development Plan
## Версия 3.0 - Native-First Design Philosophy

---

## 📊 Анализ текущего состояния

### Существующие страницы (89 файлов):

| Категория | Количество | Статус |
|-----------|------------|--------|
| Landing | 12 | V2 готовы |
| Auth | 2 | Требуют обновления |
| Dashboard | 5 | V2 базовый |
| Health Modules | 28 | V1 + V2 mix |
| Social | 12 | V1 legacy |
| Profile/Settings | 4 | V2 базовый |
| Web3 | 3 | V2 готовы |
| Other | 23 | Разбросаны |

### Выявленные UX/UI проблемы:

1. **Перегруженность страниц** - Слишком много элементов на одном экране
2. **Отсутствие кастомизации** - Пользователь не может настроить виджеты
3. **Сложные настройки в основном интерфейсе** - Мешают быстрому доступу
4. **Неединообразие** - V1 и V2 стили смешаны
5. **Отсутствие контекстных подсказок** - Новичкам сложно понять функционал

---

## 🎯 UX/UI Принципы Native-First Design

### 1. Чистота интерфейса
- **Правило 3 кликов** - Любая функция доступна за 3 клика
- **80/20 правило** - 80% использования = 20% функций на виду
- **Прогрессивное раскрытие** - Сложные функции скрыты, но доступны

### 2. Персонализация (Android-стиль)
```
┌─────────────────────────────────────┐
│  Dashboard (Чистый, только выбранное)│
├─────────────────────────────────────┤
│  [+] - Кнопка добавления виджета    │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ Виджет 1│  │ Виджет 2│          │
│  │ (перета-│  │ (удалить│          │
│  │  скиваем)│  │  крестик)│         │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────────────┐               │
│  │   Виджет 3      │               │
│  │   (расширенный) │               │
│  └─────────────────┘               │
└─────────────────────────────────────┘
```

### 3. Структура настроек
- **Основной экран** - Только часто используемые функции
- **Попапы** - Контекстные настройки (не уходим со страницы)
- **Отдельные страницы** - Глобальные настройки профиля

---

## 🧩 Widget Library System

### Архитектура библиотеки виджетов

```typescript
// Типы виджетов
interface WidgetCategory {
  id: string;
  name: string;
  icon: string;
  widgets: WidgetDefinition[];
}

interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultSize: 'small' | 'medium' | 'large' | 'full';
  minSize: 'small' | 'medium';
  maxSize: 'large' | 'full';
  component: React.ComponentType<WidgetProps>;
  settings?: WidgetSetting[];
}

// Пользовательская конфигурация
interface UserWidgetConfig {
  id: string;           // Уникальный ID экземпляра
  widgetId: string;     // ID типа виджета
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large' | 'full';
  settings: Record<string, any>;
  isVisible: boolean;
}
```

### Категории виджетов

#### 1. Health Widgets
- Health Score Ring
- Daily Activity Rings (Apple Watch style)
- Steps Counter
- Water Tracker
- Sleep Quality Chart
- Mood Tracker
- Weight Chart
- Heart Rate Monitor
- Calorie Budget
- Macro Rings

#### 2. Social Widgets
- Activity Feed (мини)
- Friends Online
- Challenge Progress
- Leaderboard Snapshot
- Messages Preview

#### 3. Gamification Widgets
- Level Progress
- Daily Streak
- XP Today
- Recent Badges
- Next Reward

#### 4. Utility Widgets
- Quick Actions (Add meal, Log workout, etc.)
- Upcoming Events
- Medication Reminders
- Weather & Air Quality
- AI Insights

#### 5. Gadgets (Retrofuture)
- Holographic Display
- Status Panel
- Data Ticker
- Radar Scope
- Control Deck

---

## 📱 Структура страниц после редизайна

### 1. Dashboard (Главная)
```
┌──────────────────────────────────────────────────────────┐
│ Header (Sticky, minimal)                                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [+ Add Widget]  [Edit Layout]  [Settings]               │
│                                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │ Health   │ │ Activity │ │   AI     │                 │
│  │  Score   │ │  Rings   │ │ Insights │                 │
│  │   85     │ │ ◐ ◐ ◐    │ │ "Sleep   │                 │
│  │          │ │          │ │  more!"  │                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
│                                                           │
│  ┌──────────────────┐ ┌──────────────────┐               │
│  │   Steps Today    │ │  Water Tracker   │               │
│  │   [========]     │ │  [~~~~] 6/8      │               │
│  │    8,432 / 10K   │ │     glasses      │               │
│  └──────────────────┘ └──────────────────┘               │
│                                                           │
│  ┌──────────────────────────────────────────┐            │
│  │         Quick Actions (Swimlane)         │            │
│  │ [🍎] [💪] [😴] [💊] [📝] [💧]            │            │
│  └──────────────────────────────────────────┘            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Взаимодействие:**
- Долгое нажатие на виджет - режим редактирования
- Свайп вниз - обновление
- [+] - открытие Widget Library
- Quick Actions - мгновенное добавление данных

### 2. Widget Library (Модальное окно)
```
┌──────────────────────────────────────────┐
│  Widget Library              [X]         │
├──────────────────────────────────────────┤
│  [All] [Health] [Social] [Tools] [Gadgets]│
├──────────────────────────────────────────┤
│  🔍 Search widgets...                    │
├──────────────────────────────────────────┤
│                                          │
│  Health                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Health │ │ Steps  │ │ Water  │       │
│  │ Score  │ │ Counter│ │Tracker │       │
│  │ [+Add] │ │ [+Add] │ │[+Add]  │       │
│  └────────┘ └────────┘ └────────┘       │
│                                          │
│  Social                                  │
│  ┌────────┐ ┌────────┐                  │
│  │Activity│ │ Friends│                  │
│  │  Feed  │ │ Online │                  │
│  │ [+Add] │ │ [+Add] │                  │
│  └────────┘ └────────┘                  │
│                                          │
└──────────────────────────────────────────┘
```

### 3. Health Module Pages
```
┌──────────────────────────────────────────┐
│ Nutrition                    [...] [⚙️]  │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Today's Progress                  │  │
│  │  Calories: 1,850 / 2,200          │  │
│  │  [===========>      ] 84%         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Meals                                   │
│  ┌────────────┐ ┌────────────┐          │
│  │ Breakfast  │ │   Lunch    │          │
│  │   450 cal  │ │   620 cal  │          │
│  │   [Edit]   │ │   [Edit]   │          │
│  └────────────┘ └────────────┘          │
│                                          │
│  [+ Add Meal]                            │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Macros                            │  │
│  │  Protein: 142g / 180g             │  │
│  │  Carbs:   210g / 250g             │  │
│  │  Fats:     68g /  85g             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [📊 Detailed Analytics →]               │
│                                          │
└──────────────────────────────────────────┘
```

### 4. Settings Structure

#### Контекстные настройки (Попапы на страницах)
- Настройки виджета (долгое нажатие)
- Быстрые фильтры
- Порядок отображения

#### Глобальные настройки (Отдельная страница)
```
Settings
├── Profile
│   ├── Personal Info
│   ├── Health Goals
│   └── Connected Devices
├── Preferences
│   ├── Notifications
│   ├── Privacy
│   ├── Language
│   └── Theme
├── Advanced
│   ├── Data Export
│   ├── Integrations
│   └── Developer Options
└── Support
    ├── Help Center
    ├── Contact Us
    └── About
```

---

## 👥 Мультиагентный план разработки

### Субагент 1: Dashboard & Widget System
**Ответственность:**
- Создать Widget Library компонент
- Реализовать drag-and-drop сетку
- Создать Dashboard с кастомизацией
- Интегрировать все виджеты

**Выходные файлы:**
```
frontend/src/
├── components/WidgetSystem/
│   ├── WidgetLibrary.tsx
│   ├── WidgetGrid.tsx
│   ├── DraggableWidget.tsx
│   ├── WidgetSettingsPopup.tsx
│   └── widgets/
│       ├── HealthScoreWidget.tsx
│       ├── ActivityRingsWidget.tsx
│       ├── StepsWidget.tsx
│       ├── WaterWidget.tsx
│       ├── SleepWidget.tsx
│       ├── MoodWidget.tsx
│       ├── QuickActionsWidget.tsx
│       └── index.ts
├── hooks/useWidgetConfig.ts
└── store/widgetStore.ts
```

### Субагент 2: Health Modules (Nutrition + Movement)
**Ответственность:**
- NutritionUnified с простым UX
- MovementUnified с трекером
- Модальные окна для деталей
- Quick add функционал

### Субагент 3: Health Modules (Sleep + Psychology)
**Ответственность:**
- SleepUnified с трекером сна
- PsychologyUnified с mood tracker
- Медитационный таймер
- Интеграция с устройствами

### Субагент 4: Social & Community
**Ответственность:**
- SocialFeedUnified
- MessagesUnified (чат)
- GroupsUnified
- ChallengesUnified
- Real-time updates

### Субагент 5: AI Chat & Analytics
**Ответственность:**
- AIChatUnified с улучшенным UX
- AnalyticsUnified с графиками
- Voice mode
- Image analysis

### Субагент 6: Profile, Settings & Auth
**Ответственность:**
- ProfileUnified
- SettingsUnified с иерархией
- Login/Register с валидацией
- Onboarding flow

---

## 📋 Чеклист для каждого модуля

### Каждая страница должна иметь:

- [ ] Чистый хедер с заголовком и 1-2 кнопками действий
- [ ] Контент в виде карточек/виджетов
- [ ] FAB (Floating Action Button) для главного действия
- [ ] Pull-to-refresh
- [ ] Empty state (если нет данных)
- [ ] Loading skeletons
- [ ] Error state с retry
- [ ] Контекстное меню (долгое нажатие)

### Каждый виджет должен иметь:

- [ ] Заголовок с иконкой
- [ ] Основной контент
- [ ] Кнопка настроек (⚙️)
- [ ] Кнопка удаления (✕) в режиме редактирования
- [ ] Resize handles
- [ ] Loading state
- [ ] Error state

---

## 🎨 Дизайн-спецификации

### Размеры виджетов
```css
/* Small - 1 колонка */
.widget-sm { width: 100%; min-height: 120px; }

/* Medium - 2 колонки */
.widget-md { width: 100%; min-height: 180px; }

/* Large - 2 колонки, больше высота */
.widget-lg { width: 100%; min-height: 280px; }

/* Full - на всю ширину */
.widget-full { width: 100%; min-height: 200px; }
```

### Grid System
```
Mobile:  1 колонка
Tablet:  2 колонки  
Desktop: 3 колонки
Large:   4 колонки
```

### Цветовая схема по категориям
- Health: Emerald (зелёный)
- Movement: Amber (оранжевый)
- Sleep: Indigo (фиолетовый)
- Psychology: Pink (розовый)
- Social: Blue (синий)
- Gamification: Gold (золотой)

---

## 🚀 Порядок разработки

### Фаза 1: Foundation (Субагент 1)
1. Widget Library система
2. Dashboard с сеткой
3. Базовые виджеты

### Фаза 2: Core Features (Субагенты 2-3)
1. Health модули
2. Quick add функционал
3. Модальные окна

### Фаза 3: Social (Субагент 4)
1. Social feed
2. Real-time чат
3. Challenges

### Фаза 4: AI & Analytics (Субагент 5)
1. AI Chat
2. Analytics
3. Insights

### Фаза 5: User Management (Субагент 6)
1. Profile
2. Settings
3. Auth

### Фаза 6: Polish
1. Анимации
2. Тестирование
3. Оптимизация

---

## 📊 Метрики успеха

### UX метрики
- Time to first action < 3 сек
- Task completion rate > 90%
- Widget customization rate > 60%
- Return rate > 70%

### Технические метрики
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90
- Bundle size < 500KB (initial)

---

**Начинаем мультиагентную разработку!**
