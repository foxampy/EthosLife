# 📋 EthosLife — Интерактивный TODO List

**Последнее обновление:** Март 2026  
**Версия:** 1.0

---

## 🚨 ТЕКУЩИЙ СТАТУС

**Фаза:** 0 (Планирование)  
**Прогресс:** 0/88 задач (0%)  
**Следующая задача:** F1.1 — Исправить дубли в App.js

---

## 📊 ОБЩИЙ ПРОГРЕСС

```
Фаза 1: Фундамент          [░░░░░░░░░░] 0/12 (0%)
Фаза 2: Backend            [░░░░░░░░░░] 0/24 (0%)
Фаза 3: Frontend           [░░░░░░░░░░] 0/27 (0%)
Фаза 4: Knowledge Base     [░░░░░░░░░░] 0/6 (0%)
Фаза 5: Testing & Deploy   [░░░░░░░░░░] 0/8 (0%)
────────────────────────────────────────────
ВСЕГО                      [░░░░░░░░░░] 0/77 (0%)
```

---

## 🔴 ФАЗА 1: ФУНДАМЕНТ (Недели 1-2)

### Неделя 1: Технический долг

- [ ] **F1.1** Исправить дубли в App.js (2ч)
- [ ] **F1.2** Настроить правильный порт API (3001) (1ч)
- [ ] **F1.3** Разделить SAFT и Health API (8ч)
- [ ] **F1.4** Создать `.env` для development (1ч)
- [ ] **F1.5** Настроить ESLint + Prettier (4ч)
- [ ] **F1.6** Добавить Docker Compose (dev) (6ч)

### Неделя 2: База данных и миграции

- [ ] **F1.7** Создать миграцию Knowledge Base (8ч)
- [ ] **F1.8** Создать миграцию Social модуля (6ч)
- [ ] **F1.9** Добавить pgvector расширение (2ч)
- [ ] **F1.10** Создать seed данные (тестовые) (4ч)
- [ ] **F1.11** Настроить резервное копирование DB (4ч)
- [ ] **F1.12** Документация API (Swagger) (6ч)

---

## 🟠 ФАЗА 2: BACKEND (Недели 3-6)

### Неделя 3: Auth и Users

- [ ] **F2.1** Исправить Google OAuth (реальный flow) (8ч)
- [ ] **F2.2** Добавить Email/Password auth (6ч)
- [ ] **F2.3** Реализовать refresh token flow (4ч)
- [ ] **F2.4** Добавить 2FA (TOTP) (8ч)
- [ ] **F2.5** Password reset flow (4ч)
- [ ] **F2.6** User roles & permissions (6ч)

### Неделя 4: Health Module Backend

- [ ] **F2.7** Health Dashboard API (полный) (8ч)
- [ ] **F2.8** Metrics CRUD (все 7 модулей) (12ч)
- [ ] **F2.9** Goals API с напоминаниями (6ч)
- [ ] **F2.10** Symptoms tracking API (4ч)
- [ ] **F2.11** Health Score алгоритм (8ч)
- [ ] **F2.12** Экспорт данных (CSV, PDF) (4ч)

### Неделя 5: AI & Knowledge Base

- [ ] **F2.13** Интеграция Qwen API (реальная) (8ч)
- [ ] **F2.14** RAG поиск с векторами (12ч)
- [ ] **F2.15** Knowledge Base CRUD (8ч)
- [ ] **F2.16** User Context Builder (6ч)
- [ ] **F2.17** AI conversation history (4ч)
- [ ] **F2.18** AI usage tracking & limits (4ч)

### Неделя 6: Social Module Backend

- [ ] **F2.19** Posts CRUD API (8ч)
- [ ] **F2.20** Comments & Likes API (6ч)
- [ ] **F2.21** Follows/Unfollows API (4ч)
- [ ] **F2.22** Feed Algorithm (8ч)
- [ ] **F2.23** Groups API (8ч)
- [ ] **F2.24** Real-time Chat (WebSocket) (12ч)

---

## 🟢 ФАЗА 3: FRONTEND (Недели 7-10)

### Неделя 7: Auth Pages & Layout

- [ ] **F3.1** Login Page (полная) (8ч)
- [ ] **F3.2** Register Page (6ч)
- [ ] **F3.3** Google OAuth Button (4ч)
- [ ] **F3.4** Telegram Auth Widget (4ч)
- [ ] **F3.5** Password Reset Flow (6ч)
- [ ] **F3.6** Layout improvement (8ч)
- [ ] **F3.7** Mobile responsive menu (6ч)

### Неделя 8: Dashboard & Health Pages

- [ ] **F3.8** Dashboard (Health Score widget) (12ч)
- [ ] **F3.9** Metrics Charts (Recharts) (10ч)
- [ ] **F3.10** Nutrition Tracker Page (8ч)
- [ ] **F3.11** Fitness Tracker Page (8ч)
- [ ] **F3.12** Sleep Tracker Page (6ч)
- [ ] **F3.13** Mental Health Page (6ч)
- [ ] **F3.14** Medical Records Page (6ч)

### Неделя 9: Health Pages Complete

- [ ] **F3.15** Body Composition Page (6ч)
- [ ] **F3.16** Environment Tracker (6ч)
- [ ] **F3.17** Goals Management UI (8ч)
- [ ] **F3.18** Symptoms Tracker UI (6ч)
- [ ] **F3.19** Health Profile Editor (8ч)
- [ ] **F3.20** Data Export UI (4ч)

### Неделя 10: AI Chat & Social

- [ ] **F3.21** AI Chat Interface (12ч)
- [ ] **F3.22** Chat History Sidebar (6ч)
- [ ] **F3.23** Markdown Support (4ч)
- [ ] **F3.24** Social Feed Page (10ч)
- [ ] **F3.25** Post Creation Modal (6ч)
- [ ] **F3.26** Comments & Likes UI (6ч)
- [ ] **F3.27** Real-time Chat UI (10ч)

---

## 📚 ФАЗА 4: KNOWLEDGE BASE (Неделя 11)

- [ ] **F4.1** Создать 42 документа (Приоритет 1) (40ч)
- [ ] **F4.2** Чанкование контента (20ч)
- [ ] **F4.3** Генерация embedding (1536 dim) (8ч)
- [ ] **F4.4** Верификация контента (16ч)
- [ ] **F4.5** Мультиязычные переводы (EN/RU) (20ч)
- [ ] **F4.6** Cross-references между документами (8ч)

---

## 🚀 ФАЗА 5: TESTING & DEPLOY (Неделя 12)

- [ ] **F5.1** Unit Tests (Backend) (16ч)
- [ ] **F5.2** Integration Tests (12ч)
- [ ] **F5.3** E2E Tests (Playwright) (16ч)
- [ ] **F5.4** Load Testing (k6) (8ч)
- [ ] **F5.5** Security Audit (8ч)
- [ ] **F5.6** CI/CD Pipeline (GitHub Actions) (8ч)
- [ ] **F5.7** Deploy to Production (4ч)
- [ ] **F5.8** Monitoring (Sentry, Analytics) (6ч)

---

## 📱 POST-V1: ДОПОЛНИТЕЛЬНЫЕ ЗАДАЧИ

### Мобильное приложение

- [ ] **M1** React Native setup (8ч)
- [ ] **M2** Auth screens (12ч)
- [ ] **M3** Health tracking (native) (24ч)
- [ ] **M4** Push notifications (8ч)
- [ ] **M5** Offline mode (16ч)
- [ ] **M6** App Store deploy (8ч)
- [ ] **M7** Google Play deploy (8ч)

### Admin Panel

- [ ] **A1** Users management (12ч)
- [ ] **A2** Content moderation (12ч)
- [ ] **A3** Analytics dashboard (16ч)
- [ ] **A4** Knowledge Base editor (16ч)
- [ ] **A5** System health monitoring (8ч)

### Расширенные функции

- [ ] **E1** Wearables integration (40ч)
- [ ] **E2** DNA test integration (24ч)
- [ ] **E3** Microbiome analysis integration (24ч)
- [ ] **E4** Video consultations (32ч)
- [ ] **E5** Payment system (24ч)
- [ ] **E6** Token rewards system (40ч)
- [ ] **E7** DAO governance (48ч)

---

## 🎯 БЛИЖАЙШИЕ ЗАДАЧИ (SPRINT 1)

### Спринт 1: Недели 1-2

**Цель:** Подготовить фундамент для разработки

1. **F1.1** Исправить App.js — 2ч
2. **F1.2** Настроить порт API — 1ч
3. **F1.4** Создать .env — 1ч
4. **F1.6** Docker Compose — 6ч
5. **F1.9** pgvector — 2ч

**Всего:** 12 часов  
**Дедлайн:** 16 марта 2026

---

## 📊 СТАТИСТИКА

### По приоритетам

| Приоритет | Всего | Выполнено | Осталось |
|-----------|-------|-----------|----------|
| 🔴 Критичный | 31 | 0 | 31 |
| 🟡 Средний | 35 | 0 | 35 |
| 🟢 Низкий | 11 | 0 | 11 |

### По фазам

| Фаза | Задач | Часов | Прогресс |
|------|-------|-------|----------|
| Фаза 1 | 12 | 54ч | 0% |
| Фаза 2 | 24 | 168ч | 0% |
| Фаза 3 | 27 | 198ч | 0% |
| Фаза 4 | 6 | 112ч | 0% |
| Фаза 5 | 8 | 76ч | 0% |

### По исполнителям

| Роль | Задач | Часов |
|------|-------|-------|
| Backend | 30 | 222ч |
| Frontend | 34 | 205ч |
| Fullstack | 13 | 151ч |

---

## 📝 ЗАМЕТКИ

### Технические заметки

1. **App.js** — удалить дубли маршрутов (Fitness, Sleep, Mental, Medical)
2. **Proxy** — изменить с 3000 на 3001 в frontend/package.json
3. **SAFT** — вынести в отдельный сервис или поддомен

### Решения

- [Дата] Решено использовать PostgreSQL с pgvector для RAG
- [Дата] React Query для data fetching
- [Дата] Zustand для state management

### Вопросы

- ❓ Нужен ли отдельный сервис для SAFT?
- ❓ Использовать ли TimescaleDB для health metrics?
- ❓ Делать ли мобильное приложение сразу или после web?

---

## 🏆 ДОСТИЖЕНИЯ

- [ ] **Первый запуск** — Запустить приложение локально
- [ ] **Первый пользователь** — Зарегистрировать тестового пользователя
- [ ] **Первый Health Score** — Рассчитать Health Score
- [ ] **Первый AI ответ** — Получить ответ от AI-коуча
- [ ] **Первый пост** — Опубликовать пост в социальной ленте
- [ ] **100 пользователей** — Достичь 100 зарегистрированных пользователей
- [ ] **Production** — Развернуть в production

---

**Последнее обновление:** 6 марта 2026  
**Следующий спринт:** 10-16 марта 2026

---

*© 2026 EthosLife Inc.*
