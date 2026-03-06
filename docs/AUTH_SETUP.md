# Auth Setup Guide - Как настроить авторизацию

## ⚠️ ВАЖНО! Для работы авторизации нужно настроить переменные окружения в Render!

### 1. Google OAuth (Вход через Google)

#### Шаг 1: Создай проект в Google Cloud
1. Перейди на https://console.cloud.google.com/
2. Создай новый проект (или используй существующий)
3. Включи Google+ API и Google People API

#### Шаг 2: Создай OAuth credentials
1. Перейди в "Credentials" → "Create Credentials" → "OAuth client ID"
2. Выбери тип: "Web application"
3. Добавь Authorized redirect URIs:
   ```
   https://etholife.onrender.com/auth/callback
   ```
4. Сохрани Client ID и Client Secret

#### Шаг 3: Добавь в Render Dashboard
Перейди в Render → Environment Variables и добавь:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

### 2. Telegram Auth (Вход через Telegram)

#### Шаг 1: Создай бота
1. Напиши @BotFather в Telegram
2. Отправь `/newbot`
3. Укажи имя: `EthosLife`
4. Укажи username: `etholife_bot`
5. Сохрани полученный токен

#### Шаг 2: Настрой меню бота
Напиши @BotFather:
```
/setcommands
```

И отправь команды:
```
start - Start app
menu - Open menu
help - Help
```

#### Шаг 3: Добавь токен в Render
```
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
```

#### Шаг 4: Настрой Web App (опционально)
В @BotFather отправь:
```
/mybots → @etholife_bot → Bot Settings → Menu Button
```

Укажи URL:
```
https://etholife.onrender.com/telegram-auth
```

---

### 3. Проверь DATABASE_URL

Убедись что в Render установлена:
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

### 4. Проверь JWT_SECRET

Должен быть установлен:
```
JWT_SECRET=your-secret-key-min-32-characters-long
```

---

## 🔍 Как проверить что работает

### Проверка Google Auth:
1. Открой сайт
2. Нажми "Sign In"
3. Нажми "Continue with Google"
4. Если видишь ошибку "Google OAuth not configured" — значит переменные не установлены

### Проверка Telegram Auth:
1. Открой https://t.me/etholife_bot
2. Нажми "Start"
3. Бот должен ответить приветствием
4. Если не отвечает — проверь TELEGRAM_BOT_TOKEN

---

## ❌ Частые ошибки

### "Google OAuth not configured"
**Решение:** Добавь VITE_GOOGLE_CLIENT_ID в Render Environment Variables

### "User not found" при Telegram входе
**Решение:** 
1. Проверь что TELEGRAM_BOT_TOKEN правильный
2. Перезапусти деплой
3. Убедись что бот запущен (напиши /start в бота)

### "Database connection error"
**Решение:** Проверь DATABASE_URL в Render

---

## 📞 Нужна помощь?

Если что-то не работает:
1. Проверь логи в Render Dashboard → Logs
2. Убедись что все переменные окружения установлены
3. Перезапусти деплой (Clear build cache & deploy)
