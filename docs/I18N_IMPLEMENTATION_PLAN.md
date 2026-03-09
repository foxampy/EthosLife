# 🌐 EthosLife i18n Translation Implementation Plan

**Дата:** 9 марта 2026 г.
**Статус:** ✅ В процессе
**Приоритет:** P0 (Критично)

---

## ✅ ЧТО СДЕЛАНО

### 1. Файлы переводов созданы
```
✅ ru.json (246 ключей)
✅ en.json (246 ключей)
✅ es.json, de.json, fr.json (206 ключей)
✅ he.json, ar.json, ko.json (206 ключей)
✅ ja.json, zh.json, pt.json, tr.json (206 ключей)
```

### 2. i18n настроен
```
✅ i18next установлен
✅ Конфигурация готова
✅ 12 языков поддерживаются
✅ Language Selector работает
```

---

## ⚠️ ЧТО ТРЕБУЕТСЯ

### Страницы которые нужно обновить

#### Landing Pages (V2)
```
❌ LandingV2.tsx - needs i18n
❌ FeaturesV2.tsx - needs i18n
❌ PricingV2.tsx - needs i18n
❌ RoadmapV2.tsx - needs i18n
❌ TeamV2.tsx - needs i18n
❌ FAQV2.tsx - needs i18n
❌ BlogV2.tsx - needs i18n
```

#### Health Modules (V2)
```
❌ Nutrition2.tsx - needs i18n
❌ Movement2.tsx - needs i18n
❌ Sleep2.tsx - needs i18n
❌ Psychology2.tsx - needs i18n
❌ Habits2.tsx - needs i18n
❌ Medicine2.tsx - needs i18n
❌ Relationships2.tsx - needs i18n
```

#### Dashboard & Other (V2)
```
❌ Dashboard2.tsx - needs i18n
❌ AIChat2.tsx - needs i18n
❌ Analytics2.tsx - needs i18n
❌ Gamification2.tsx - needs i18n
❌ Profile2.tsx - needs i18n
❌ Settings2.tsx - needs i18n
```

---

## 🔧 КАК ДОБАВИТЬ ПЕРЕВОДЫ

### Шаг 1: Импортировать useTranslation
```tsx
import { useTranslation } from 'react-i18next';
```

### Шаг 2: Использовать хук
```tsx
const { t, i18n } = useTranslation();
```

### Шаг 3: Заменить хардкод на t()
```tsx
// Было:
<h1>7 Модулей Здоровья</h1>

// Стало:
<h1>{t('landing.modules.title')}</h1>
```

### Шаг 4: Для интерполяции
```tsx
// Было:
<p>Добро пожаловать, {userName}!</p>

// Стало:
<p>{t('common.welcome_back', { name: userName })}</p>
```

---

## 📋 ПЛАН ОБНОВЛЕНИЯ

### Phase 1: Landing Pages (Сейчас)
```
[ ] LandingV2.tsx
[ ] FeaturesV2.tsx
[ ] PricingV2.tsx
[ ] RoadmapV2.tsx
[ ] TeamV2.tsx
[ ] FAQV2.tsx
[ ] BlogV2.tsx
```

### Phase 2: Health Modules
```
[ ] Nutrition2.tsx
[ ] Movement2.tsx
[ ] Sleep2.tsx
[ ] Psychology2.tsx
[ ] Habits2.tsx
[ ] Medicine2.tsx
[ ] Relationships2.tsx
```

### Phase 3: Dashboard & Core
```
[ ] Dashboard2.tsx
[ ] AIChat2.tsx
[ ] Analytics2.tsx
[ ] Gamification2.tsx
[ ] Profile2.tsx
[ ] Settings2.tsx
```

### Phase 4: V1 Pages (опционально)
```
[ ] DashboardV1.jsx
[ ] NutritionV1.jsx
[ ] FitnessV1.jsx
[ ] SleepV1.jsx
[ ] MentalHealthV1.jsx
```

---

## 🎯 ПРИМЕРЫ ОБНОВЛЕНИЯ

### LandingV2.tsx Пример

**До:**
```tsx
const LandingV2 = () => {
  return (
    <div>
      <h1>Будущее технологий здоровья</h1>
      <p>Комплексная экосистема здоровья</p>
      <button>Начать сейчас</button>
    </div>
  );
};
```

**После:**
```tsx
import { useTranslation } from 'react-i18next';

const LandingV2 = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('landing.hero.title')}</h1>
      <p>{t('landing.hero.subtitle')}</p>
      <button>{t('common.startNow')}</button>
    </div>
  );
};
```

---

## 📊 СТАТИСТИКА

| Страницы | Всего | С i18n | Без i18n | % Готово |
|----------|-------|--------|----------|----------|
| Landing V2 | 7 | 0 | 7 | 0% |
| Health V2 | 7 | 0 | 7 | 0% |
| Dashboard V2 | 6 | 0 | 6 | 0% |
| Landing V1 | 5 | 0 | 5 | 0% |
| Health V1 | 4 | 0 | 4 | 0% |
| **ИТОГО** | **29** | **0** | **29** | **0%** |

---

## ⏱️ ВРЕМЯ НА ОБНОВЛЕНИЕ

```
Landing Pages:     2 часа
Health Modules:    3 часа
Dashboard & Core:  2 часа
V1 Pages:          2 часа
Тестирование:      1 час
────────────────────────────
ВСЕГО:            10 часов
```

---

## ✅ CHECKLIST

### Для каждой страницы:
```
[ ] Добавить import { useTranslation }
[ ] Добавить const { t } = useTranslation()
[ ] Заменить весь хардкод на t()
[ ] Проверить что все ключи есть в ru.json и en.json
[ ] Протестировать переключение языков
[ ] Проверить mobile версию
```

### Для каждого файла переводов:
```
[ ] Добавить новые ключи в ru.json
[ ] Добавить новые ключи в en.json
[ ] Проверить что нет опечаток
[ ] Проверить контекст использования
```

---

**© 2026 EthosLife Inc.**
*План по добавлению i18n на все страницы*
