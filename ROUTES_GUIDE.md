# EthosLife - Маршруты Приложения (Routes)

## 📍 Все доступные маршруты

### Главная и Dashboard
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/` | Главная Landing | LandingV1 |
| `/dashboard` | Dashboard | Dashboard2 |
| `/dashboard-v2` | Dashboard v2 | Dashboard2 |

---

### 🏃 Landing Страницы (7)
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/landing` | Landing V1 | LandingV1 |
| `/features` | Возможности | FeaturesV1 |
| `/pricing` | Цены | PricingV1 |
| `/tokenomics` | Токеномика | TokenomicsV1 |
| `/roadmap` | Roadmap | RoadmapV1 |
| `/team` | Команда | TeamV1 |
| `/faq` | FAQ | FAQV1 |

---

### 💚 Health Modules V2 (7)
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/health/nutrition` | Питание | Nutrition2 |
| `/health/movement` | Движение | Movement2 |
| `/health/sleep` | Сон | Sleep2 |
| `/health/psychology` | Психология | Psychology2 |
| `/health/habits` | Привычки | Habits2 |
| `/health/medicine` | Лекарства | Medicine2 |
| `/health/relationships` | Отношения | Relationships2 |

---

### 👥 Social V1 (8)
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/social` | Лента | SocialFeedV1 |
| `/social/feed` | Лента | SocialFeedV1 |
| `/social/post/:id` | Детали поста | PostDetailV1 |
| `/social/friends` | Друзья | FriendsV1 |
| `/social/messages` | Сообщения | MessagesV1 |
| `/social/messages/:userId` | Чат с пользователем | MessagesV1 |
| `/social/groups` | Группы | GroupsV1 |
| `/social/groups/:id` | Детали группы | GroupDetailV1 |
| `/social/challenges` | Челленджи | ChallengesV1 |
| `/social/leaders` | Лидерборды | LeadersV1 |

---

### 👨‍⚕️ Specialists
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/specialists` | Список специалистов | Specialists2 |
| `/specialists/:id` | Профиль специалиста | Specialists2 |

---

### 🏥 Centers
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/centers` | Список центров | Centers2 |
| `/centers/:id` | Детали центра | Centers2 |

---

### 👤 Profile
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/profile` | Профиль | Profile2 |
| `/profile/edit` | Редактирование | Profile2 |
| `/profile/settings` | Настройки | Profile2 |

---

### 💳 Payments
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/payments` | Платежи | CheckoutV1 |
| `/payments/checkout` | Оформление | CheckoutV1 |
| `/payments/success` | Успешный платеж | PaymentSuccessV1 |
| `/payments/failed` | Ошибка платежа | PaymentFailedV1 |

---

### 🤖 AI & Analytics
| Маршрут | Описание | Компонент |
|---------|----------|-----------|
| `/ai-chat` | AI Чат | AIChat2 |
| `/analytics` | Аналитика | Analytics2 |
| `/gamification` | Геймификация | Gamification2 |
| `/settings` | Настройки | Settings2 |
| `/investor-demo` | Демо для инвесторов | InvestorDemo |

---

## 🔗 Навигация

### Основное меню:
```
Главная → / 
Dashboard → /dashboard
Health → /health/nutrition
Social → /social
Specialists → /specialists
Centers → /centers
Profile → /profile
```

### Quick Links:
```
Landing:     /features | /pricing | /team | /faq
Social:      /social/challenges | /social/leaders
Health:      /health/sleep | /health/movement
Payments:    /payments/checkout
```

---

## 📱 Mobile Navigation

**Рекомендуемая структура для мобильного меню:**

```
[Главная] [Health] [Social] [Профиль] [Ещё]

Health → Выпадающее меню:
  - Питание
  - Тренировки
  - Сон
  - Психология
  - Привычки
  - Лекарства
  - Отношения

Social → Выпадающее меню:
  - Лента
  - Друзья
  - Сообщения
  - Группы
  - Челленджи
  - Лидерборды
```

---

*Обновлено: 9 марта 2026 г.*
