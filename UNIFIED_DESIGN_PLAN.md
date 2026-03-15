# 🎨 EthosLife - Unified Retrofuturism Design Plan
## Полная унификация V1 + V2 с улучшенным UX/UI

**Версия:** 3.0  
**Дата:** 15 марта 2026  
**Статус:** Master Plan  

---

## 📋 СТРУКТУРА ПРОЕКТА

### Текущее состояние
```
frontend/src/
├── pages/
│   ├── Dashboard/
│   │   ├── DashboardV1.jsx      # Legacy - требует миграции
│   │   ├── Dashboard2.tsx       # V2 - базовый референс
│   │   └── DashboardUnified.tsx # 🆕 Единый дашборд
│   ├── Health/
│   │   ├── V1/                  # Legacy модули
│   │   └── *2.tsx               # V2 модули
│   ├── Social/
│   │   ├── V1/                  # Legacy
│   │   └── SocialFeed2.tsx      # V2
│   └── ...
├── components/
│   ├── Neumorphism/             # Базовые компоненты
│   ├── Widgets/                 # Виджеты дашборда
│   └── Gadgets/                 # 🆕 Гаджеты ретрофутуризма
└── styles/
    └── retrofuturism.css        # 🆕 Единая стилевая система
```

---

## 🎯 КОНЦЕПЦИЯ ДИЗАЙНА: "Tactile Retrofuture"

### Основные принципы:
1. **Tactile (Тактильность)** - элементы "нажимаются", объемные тени
2. **Retrofuture (Ретрофутуризм)** - вдохновление 80s sci-fi + современность
3. **Organic (Органичность)** - скругленные формы, естественные переходы
4. **Depth (Глубина)** - многослойность, parallax, 3D эффекты

### Цветовая палитра 3.0
```css
/* Primary - Bone System */
--bone-lightest: #f5f0eb;    /* Фоновый */
--bone-light: #e8e0d5;       /* Карточки */
--bone: #dcd3c6;             /* Основной фон */
--bone-dark: #c9b8a6;        /* Границы */
--bone-darkest: #b5a290;     /* Тени */

/* Stone - Accent System */
--stone-light: #8c7a6b;
--stone: #5c5243;            /* Основной акцент */
--stone-dark: #3d3528;
--ink: #2d2418;              /* Текст */

/* Retrofuture - Neon Accents */
--neon-cyan: #00d9ff;
--neon-pink: #ff00aa;
--neon-purple: #9d4edd;
--neon-amber: #ffb700;
--neon-green: #00ff88;

/* Functional */
--success: #10b981;
--warning: #f59e0b;
--error: #f43f5e;
--info: #06b6d4;
```

---

## 🧩 КОМПОНЕНТНАЯ СИСТЕМА

### 1. Базовые компоненты (Core)
```typescript
// Все компоненты с префиксом "El" (EthosLife)
ElButton      // Кнопки с 3D эффектом
ElCard        // Карточки с глубиной
ElInput       // Ввод с тактильной обратной связью
ElToggle      // Переключатели
ElSlider      // Слайдеры с заполнением
ElOrb         // Сферические индикаторы
ElGauge       /* Полукруглые gauge */
ElSegment     /* Сегментные дисплеи */
ElDial        /* Поворотные регуляторы */
```

### 2. Гаджеты (Gadgets) - Новое!
```typescript
// Визуальные элементы в стиле sci-fi интерфейсов
GadgetHoloDisplay    /* Голографический дисплей */
GadgetStatusPanel    /* Панель статусов с LED */
GadgetDataTicker     /* Бегущая строка данных */
GadgetRadarScope     /* Радар для аналитики */
GadgetControlDeck    /* Панель управления */
GadgetMeterBank      /* Банк индикаторов */
```

### 3. Виджеты (Widgets)
```typescript
// Функциональные блоки дашборда
WidgetHealthScore    /* Основной score с анимацией */
WidgetActivityRings  /* Кольца активности */
WidgetHabitHeatmap   /* Тепловая карта привычек */
WidgetVitalsMonitor  /* Монитор показателей */
WidgetAIMirror       /* AI интерфейс */
WidgetSocialHub      /* Центр социальных активностей */
```

---

## 📱 СТРАНИЦЫ ДЛЯ УНИФИКАЦИИ

### Приоритет 1: Core Pages
| Страница | Текущий статус | Действие |
|----------|---------------|----------|
| Dashboard | V1 + V2 | 🔄 Объединить в UnifiedDashboard |
| Profile | V1 + V2 | 🔄 Объединить в UnifiedProfile |
| Settings | V1 + V2 | 🔄 Объединить в UnifiedSettings |
| Landing | V1 | 🔄 Пересоздать в V2 стиле |

### Приоритет 2: Health Modules (7 штук)
| Модуль | V1 | V2 | Действие |
|--------|----|----|----------|
| Nutrition | ✅ | ✅ | 🔄 Объединить |
| Movement/Fitness | ✅ | ✅ | 🔄 Объединить |
| Sleep | ✅ | ✅ | 🔄 Объединить |
| Psychology/Mental | ✅ | ✅ | 🔄 Объединить |
| Medicine | ❌ | ✅ | 📝 Создать V1 → V2 |
| Relationships | ❌ | ✅ | 📝 Создать V1 → V2 |
| Habits | ❌ | ✅ | 📝 Создать V1 → V2 |

### Приоритет 3: Social Modules
| Страница | Статус | Действие |
|----------|--------|----------|
| SocialFeed | V1 | 🔄 Обновить стиль |
| Groups | V1 | 🔄 Обновить стиль |
| Challenges | V1 | 🔄 Обновить стиль |
| Messages | V1 | 🔄 Обновить стиль |
| Friends | V1 | 🔄 Обновить стиль |

---

## 🎨 ДИЗАЙН-СПЕЦИФИКАЦИИ

### 1. Тени (Shadow System)
```css
/* Elevated - "Выпуклые" элементы */
--shadow-elevated-sm: 4px 4px 8px rgba(44,40,34,0.08), 
                      -4px -4px 8px rgba(255,255,255,0.7);
--shadow-elevated: 8px 8px 16px rgba(44,40,34,0.12), 
                    -8px -8px 16px rgba(255,255,255,0.6);
--shadow-elevated-lg: 12px 12px 24px rgba(44,40,34,0.15), 
                       -12px -12px 24px rgba(255,255,255,0.5);

/* Inset - "Вдавленные" элементы */
--shadow-inset-sm: inset 2px 2px 4px rgba(44,40,34,0.08), 
                   inset -2px -2px 4px rgba(255,255,255,0.7);
--shadow-inset: inset 4px 4px 8px rgba(44,40,34,0.1), 
                inset -4px -4px 8px rgba(255,255,255,0.6);

/* Neon Glow - Для акцентов */
--glow-cyan: 0 0 20px rgba(0,217,255,0.4), 0 0 40px rgba(0,217,255,0.2);
--glow-pink: 0 0 20px rgba(255,0,170,0.4), 0 0 40px rgba(255,0,170,0.2);
```

### 2. Анимации
```css
/* Микро-взаимодействия */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* Page transitions */
--page-enter: fadeIn 0.5s ease-out, slideUp 0.5s ease-out;
--page-exit: fadeOut 0.3s ease-in;
```

### 3. Типографика
```css
/* Заголовки */
--font-display: 'Space Grotesk', sans-serif;    /* Для больших заголовков */
--font-heading: 'Rajdhani', sans-serif;         /* Для подзаголовков */

/* Основной текст */
--font-body: 'Inter', sans-serif;

/* Моноширинный - для данных/чисел */
--font-mono: 'JetBrains Mono', monospace;

/* Sci-fi */
--font-future: 'Orbitron', sans-serif;
```

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### 1. Структура файлов
```
frontend/src/
├── components/
│   ├── ElCore/                    # Базовые элементы
│   │   ├── ElButton.tsx
│   │   ├── ElCard.tsx
│   │   ├── ElInput.tsx
│   │   └── ...
│   ├── ElGadgets/                 # Гаджеты ретрофутуризма
│   │   ├── GadgetHoloDisplay.tsx
│   │   ├── GadgetStatusPanel.tsx
│   │   └── ...
│   ├── ElWidgets/                 # Виджеты
│   │   ├── WidgetHealthScore.tsx
│   │   ├── WidgetActivityRings.tsx
│   │   └── ...
│   └── ElLayout/                  # Layout компоненты
│       ├── ElHeader.tsx
│       ├── ElSidebar.tsx
│       └── ElBottomNav.tsx
├── pages/
│   ├── Unified/                   # Унифицированные страницы
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   └── Health/
│       ├── NutritionUnified.tsx
│       ├── MovementUnified.tsx
│       └── ...
├── hooks/
│   ├── useTactile.ts              # Тактильная обратная связь
│   ├── useNeumorph.ts             # Неоморфные стили
│   └── useGadgetState.ts          # Состояние гаджетов
├── styles/
│   ├── design-system.css          # CSS переменные
│   ├── animations.css             # Анимации
│   └── retrofuturism.css          # Специфичные стили
└── utils/
    ├── animations.ts
    └── styles.ts
```

### 2. Новые зависимости
```json
{
  "dependencies": {
    "@use-gesture/react": "^10.3.0",      // Жесты для гаджетов
    "react-spring": "^9.7.3",              // Физические анимации
    "react-use-measure": "^2.1.1",         // Измерения для layout
    "framer-motion": "^11.0.0"             // Уже есть
  }
}
```

---

## 📊 ПЛАН РАБОТ (12 недель)

### Неделя 1: Design System Foundation
- [ ] Создать единый CSS с переменными
- [ ] Обновить Neu* компоненты до El*
- [ ] Создать базовые ElCore компоненты

### Неделя 2: Gadgets Framework
- [ ] Создать систему гаджетов
- [ ] Реализовать GadgetHoloDisplay
- [ ] Реализовать GadgetStatusPanel

### Неделя 3: Layout Unification
- [ ] Единый ElHeader
- [ ] ElSidebar с гаджетами
- [ ] ElBottomNav для мобильных

### Неделя 4: Dashboard Unified
- [ ] Объединить DashboardV1 + Dashboard2
- [ ] Добавить гаджеты на дашборд
- [ ] Drag-and-drop виджетов

### Недели 5-6: Health Modules
- [ ] NutritionUnified
- [ ] MovementUnified
- [ ] SleepUnified
- [ ] PsychologyUnified
- [ ] MedicineUnified
- [ ] RelationshipsUnified
- [ ] HabitsUnified

### Неделя 7: Social Modules
- [ ] SocialFeedUnified
- [ ] GroupsUnified
- [ ] ChallengesUnified
- [ ] MessagesUnified

### Неделя 8: Other Modules
- [ ] ProfileUnified
- [ ] SettingsUnified
- [ ] GamificationUnified
- [ ] AnalyticsUnified

### Неделя 9: AI & Specialists
- [ ] AIChatUnified с гаджетами
- [ ] SpecialistsUnified
- [ ] CentersUnified

### Неделя 10: Landing & Static
- [ ] LandingUnified
- [ ] FeaturesUnified
- [ ] PricingUnified
- [ ] Team, FAQ, etc.

### Неделя 11: Testing & Polish
- [ ] Кросс-браузерное тестирование
- [ ] Мобильная адаптация
- [ ] Performance оптимизация
- [ ] Accessibility

### Неделя 12: Deployment
- [ ] Final QA
- [ ] Documentation
- [ ] Deploy

---

## ✅ ЧЕКЛИСТ ГОТОВНОСТИ

### Перед началом
- [ ] Все исходные файлы сохранены
- [ ] Git ветка создана
- [ ] Зависимости установлены

### Критерии завершения каждой фазы
- [ ] Код review пройден
- [ ] Тесты проходят
- [ ] Дизайн соответствует спекам
- [ ] Mobile responsive
- [ ] Accessibility проверена

---

**Подготовлено:** 15.03.2026  
**Ответственный:** AI Architect  
**Статус:** ✅ Готово к реализации
