# EthosLife V2 - Детальный план разработки
## Стиль: Ретрофутуризм + Неоморфизм (Soft UI)

---

## 🎨 Design System

### Цветовая палитра
```
--bone: #e4dfd5          /* Основной фон */
--bone-dark: #c8c2b6     /* Темный фон */
--sand: #dcd3c6          /* Песочный */
--stone: #5c5243         /* Основной акцент */
--ink: #2d2418           /* Текст */
--clay: #8c7a6b          /* Вторичный текст */
--shadow-light: rgba(255,255,255,0.6)
--shadow-dark: rgba(44,40,34,0.15)
```

### Компоненты неоморфизма
- **Elevated** (выпуклые): `box-shadow: 8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)`
- **Inset** (вдавленные): `box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)`
- **Tactile buttons**: Нажатие с анимацией scale + shadow change
- **Cards**: Border-radius 20-30px, многослойные тени

### Типографика
- **Headers**: Space Grotesk (retro-futuristic)
- **Body**: Inter
- **Monospace**: Courier Prime (terminal style)

---

## 📱 Модули для разработки

### 1. Dashboard 2.0 - Центральный хаб
**Статус**: ⚠️ Требует доработки

#### Виджеты (12+ штук):
1. **Health Score Orb** - Круговой прогресс с анимацией
2. **Daily Rings** (Apple Watch style) - 4 кольца активности
3. **Vitals Ticker** - Бегущая строка показателей
4. **Habit Heatmap** - GitHub-style календарь
5. **AI Insights Card** - Карточки рекомендаций
6. **Water Widget** - Интерактивный стакан
7. **Sleep Phases** - График фаз сна
8. **Mood Tracker** - Эмодзи-график
9. **Steps Counter** - Анимированный счетчик
10. **Calories Wheel** - Колесо калорий
11. **Medication Reminder** - Виджет таблеток
12. **Next Appointment** - Карточка визита

#### Layout:
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Drag-and-drop перестановка
- Resizeable widgets

---

### 2. Health Modules V2

#### Nutrition 2.0
- **AI Food Scanner** - Камера + распознавание
- **Macro Rings** - Кольца БЖУ
- **Meal Timeline** - Лента приемов пищи
- **Water Tracker** - 3D стакан с волнами
- **Recipe Cards** - Flip cards с рецептами
- **Grocery List** - Чеклист с анимацией

#### Movement 2.0
- **Activity Rings** - 3 кольца (move, exercise, stand)
- **Workout Player** - Таймер с фазами
- **GPS Map** - Карта маршрутов
- **Exercise Library** - 3D карточки упражнений
- **Recovery Score** - Индикатор восстановления

#### Sleep 2.0
- **Sleep Clock** - Круговой график фаз
- **Smart Alarm** - Настройка интервалов
- **Sleep Debt** - Визуализация долга
- **Chronotype Test** - Тест хронотипа
- **Environment Monitor** - Шум, свет, температура

#### Psychology 2.0
- **Mood Orb** - Сфера настроения
- **CBT Tools** - Интерактивные упражнения
- **Breathing Guide** - Анимация дыхания
- **Meditation Player** - Визуализации
- **Stress Thermometer** - Термометр стресса

#### Medicine 2.0
- **Pill Organizer** - Органайзер таблеток
- **Refill Tracker** - Отслеживание запасов
- **Symptoms Map** - Карта симптомов тела
- **Lab Results** - Графики анализов
- **Doctor Visits** - Таймлайн визитов

#### Relationships 2.0
- **Connection Map** - Карта связей
- **Quality Time** - Трекер времени
- **Love Language** - Тест языков любви
- **Conflict Resolver** - Инструмент разрешения

#### Habits 2.0
- **Habit Stack** - Связанные привычки
- **Streak Flame** - Анимированное пламя
- **Chain Builder** - Цепочка выполнений
- **Habit Garden** - Сад растущих привычек

---

### 3. AI Coach 2.0
- **Persona Selector** - Выбор AI персоны
- **Voice Mode** - Голосовой чат
- **Photo Analysis** - Анализ фото еды/кожи
- **Predictive Insights** - Прогнозы
- **Action Cards** - Карточки действий
- **Progress Reports** - Отчеты

---

### 4. Gamification 2.0
- **Level Progress** - Полоса опыта
- **Badges Grid** - Сетка достижений
- **Leaderboards** - Таблицы лидеров
- **Challenges Hub** - Центр челленджей
- **Token Wallet** - Кошелек токенов
- **Rewards Shop** - Магазин наград

---

### 5. Social 2.0
- **Activity Feed** - Лента активности
- **Groups** - Группы по интересам
- **Challenges** - Групповые челленджи
- **Mentorship** - Наставничество

---

### 6. Specialists & Centers 2.0
- **Doctor Finder** - Поиск специалистов
- **Booking System** - Запись на прием
- **Video Consult** - Видеоконсультации
- **Center Map** - Карта центров

---

## 🔧 Технические компоненты

### Новые UI компоненты (Neumorphism)
```
NeuButton
NeuCard
NeuInput
NeuToggle
NeuSlider
NeuProgress
NeuOrb
NeuWidget
NeuGauge
NeuTimeline
```

### Анимации (Framer Motion)
- Page transitions
- Widget enter/exit
- Hover micro-interactions
- Loading states
- Success celebrations

### Графики (Recharts + Custom)
- Circular progress
- Radial charts
- Heatmaps
- Gauges
- Sparklines

---

## 📋 Порядок разработки

### Phase 1: Core UI (Неделя 1-2)
- [ ] Design System компоненты
- [ ] NeuButton, NeuCard, NeuInput
- [ ] Animation library

### Phase 2: Dashboard (Неделя 2-3)
- [ ] Grid layout
- [ ] 12 виджетов
- [ ] Drag-and-drop

### Phase 3: Health Modules (Неделя 3-5)
- [ ] Nutrition 2.0
- [ ] Movement 2.0
- [ ] Sleep 2.0
- [ ] Psychology 2.0

### Phase 4: AI & Gamification (Неделя 5-6)
- [ ] AI Chat 2.0
- [ ] Gamification 2.0

### Phase 5: Social & Integration (Неделя 6-7)
- [ ] Social 2.0
- [ ] Specialists 2.0

---

## 🚀 Запуск параллельной работы

Агент 1: Dashboard + Design System
Агент 2: Health Modules (Nutrition, Movement)
Агент 3: Health Modules (Sleep, Psychology)
Агент 4: AI Chat + Gamification
