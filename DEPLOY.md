# EthosLife SAFT Platform - Deployment Guide

## Overview

SAFT (Simple Agreement for Future Tokens) платформа для EthosLife Seed Round с динамическим ценообразованием и Telegram интеграцией.

### Features

- 🚀 **Dynamic Pricing**: Цена токена растёт от $0.01 до $0.05 до 10 марта 2025 01:00 UTC
- ⏱️ **Price Freeze**: Заморозка цены на 1 час после подписания SAFT
- 🤖 **Telegram Bot**: Автоматические уведомления основателю с PDF договором
- 📄 **PDF Generation**: Автоматическая генерация SAFT документа
- ✅ **Validation**: Двойная валидация на клиенте и сервере

---

## Quick Deploy to Render

### 1. Подготовка окружения

```bash
# Клонируйте репозиторий
git clone https://github.com/YOUR_USERNAME/ethoslife-saft.git
cd ethoslife-saft

# Установите зависимости
npm install
```

### 2. Настройка Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Создайте нового бота: `/newbot`
3. Введите имя бота (например, "EthosLife SAFT Bot")
4. Введите username бота (например, "ethoslife_saft_bot")
5. **Скопируйте токен** (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

6. Найдите свой Chat ID:
   - Напишите [@userinfobot](https://t.me/userinfobot)
   - Бот отправит ваш ID (например, `123456789`)

### 3. Настройка переменных окружения

Создайте файл `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# Обязательные переменные
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
FOUNDER_CHAT_ID=123456789
ADMIN_KEY=your_secret_key_here_min_32_chars

# Опционально: дополнительные админы
ADMIN_CHAT_IDS=987654321,111222333

# Сервер
PORT=3000
NODE_ENV=production
```

⚠️ **Важно**: Никогда не коммитьте `.env` файл!

### 4. Локальное тестирование

```bash
npm start
```

Откройте http://localhost:3000

### 5. Деплой на Render

#### Вариант A: Через Blueprint (рекомендуется)

1. Запушьте код на GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ethoslife-saft.git
git push -u origin main
```

2. На [Render.com](https://render.com):
   - Нажмите "New +" → "Blueprint"
   - Подключите GitHub репозиторий
   - Render автоматически обнаружит `render.yaml`
   - Нажмите "Apply"

3. Добавьте Environment Variables:
   - Перейдите в настройки сервиса
   - Добавьте:
     - `TELEGRAM_BOT_TOKEN`
     - `FOUNDER_CHAT_ID`
     - `ADMIN_KEY`

#### Вариант B: Вручную

1. Создайте новый Web Service
2. Connect your GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/health` | - | Health check |
| `GET /api/price` | - | Текущая цена токена |
| `POST /api/calculate` | - | Расчёт токенов для суммы |
| `POST /api/submit-saft` | - | Отправка SAFT формы |
| `GET /api/submission/:id` | - | Проверка статуса |
| `GET /api/admin/submissions` | `X-Admin-Key` | Список всех заявок |

---

## Алгоритм ценообразования

```
Старт: 6 марта 2026 ~09:00 UTC — $0.01
Конец: 10 марта 2026 01:00 UTC — $0.05

Формула:
price = $0.01 + ($0.05 - $0.01) × (elapsed_time / total_duration)

Обновление: Каждую минуту на клиенте
```

После отправки формы цена замораживается на 1 час.

---

## Структура проекта

```
├── server.js              # Express сервер
├── pdf-generator.js       # Генерация SAFT PDF
├── package.json           # Зависимости
├── render.yaml            # Render конфиг
├── .env.example           # Шаблон переменных
├── public/
│   └── index.html         # SAFT форма
└── docs/                  # Документация
```

---

## Admin Access

### Просмотр всех заявок:

```bash
curl -H "x-admin-key: YOUR_ADMIN_KEY" \
  https://your-domain.onrender.com/api/admin/submissions
```

### Telegram команды для админов:

Бот автоматически отправляет уведомления с кнопками:
- ✅ Approve — одобрить заявку
- ❌ Reject — отклонить заявку
- 📄 Full Details — полная информация
- 📧 Email Investor — быстрая ссылка на email

---

## Безопасность

### ✅ DO:
- Храните токен бота в `.env`
- Используйте сильный `ADMIN_KEY`
- Включите HTTPS в production
- Ограничьте доступ к админ API

### ❌ DON'T:
- Никогда не коммитьте `.env`
- Не логируйте чувствительные данные
- Не храните токен в коде

---

## Troubleshooting

### Бот не отправляет сообщения

1. Проверьте `TELEGRAM_BOT_TOKEN`
2. Убедитесь что бот запущен (напишите `/start`)
3. Проверьте `FOUNDER_CHAT_ID`
4. Посмотрите логи: `render logs`

### Цена не обновляется

1. Проверьте часовой пояс сервера
2. Убедитесь что `START_DATE` и `END_DATE` правильные
3. Проверьте консоль браузера на ошибки

### Форма не отправляется

1. Проверьте валидацию полей
2. Убедитесь что API доступен
3. Проверьте CORS настройки

---

## Поддержка

По вопросам деплоя обращайтесь к основателю через Telegram бот.

---

© 2026 EthosLife Inc. Все права защищены.
