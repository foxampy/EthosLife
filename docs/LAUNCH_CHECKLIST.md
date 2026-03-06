# 🚀 ЧЕКЛИСТ ЗАПУСКА NexusVita

**Важно:** API роуты созданы, но НЕ работают без настройки окружения!

---

## 🔴 КРИТИЧНО (без этого не запустится)

### 1. Supabase (База данных)
**Где:** https://supabase.com

**Что сделать:**
1. Зарегистрироваться
2. Создать новый проект
3. В SQL Editor выполнить миграции:
   - `server/supabase/migrations/001_initial_schema.sql`
   - `server/supabase/migrations/002_health_modules.sql`
4. В Project Settings → Database скопировать Connection String

**Переменные окружения:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

**Где хранить:**
- Локально: файл `.env` в корне проекта (добавлен в .gitignore!)
- Render: Dashboard → Environment Variables
- **НЕ в коде и НЕ в GitHub!**

---

### 2. JWT Secret
**Где генерировать:** Локально на своем компьютере

**Команда:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Переменная:**
```env
JWT_SECRET=your-generated-secret-here-minimum-32-characters
```

---

### 3. Qwen AI (опционально, но желательно)
**Бесплатный вариант:** https://huggingface.co/Qwen

**Регистрация:**
1. Зарегистрироваться на Hugging Face
2. Получить Access Token: Settings → Access Tokens → New Token
3. ИЛИ используйте Alibaba Cloud (платно, но стабильнее)

**Переменная:**
```env
QWEN_API_KEY=your-huggingface-token
```

**Если НЕ подключать:** AI будет работать в fallback-режиме (шаблонные ответы на ключевые слова)

---

### 4. NOWPayments (Криптовалютные платежи)
**Где:** https://nowpayments.io

**Регистрация:**
1. Создать аккаунт
2. В Dashboard → Stores создать магазин
3. Скопировать API Key

**Переменная:**
```env
NOWPAYMENTS_API_KEY=your-api-key
```

**Если НЕ подключать:** Оплата только через UNITY токены (внутренняя валюта) или не работает вовсе

---

## 🟡 ВАЖНО (для полной функциональности)

### 5. Supabase Storage (Загрузка файлов)
**Где:** Supabase Dashboard → Storage

**Что сделать:**
1. Создать bucket "images" (public: true)
2. Создать bucket "videos" (public: true)
3. В Policies добавить разрешения на INSERT/SELECT для authenticated users

**Без этого:** Не работает загрузка фото/видео в посты и stories

---

### 6. Google OAuth (Вход через Google)
**Где:** https://console.cloud.google.com

**Настройка:**
1. Создать проект в Google Cloud Console
2. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
3. Authorized redirect URIs: `http://localhost:3000/auth/callback`
4. Для продакшена добавить: `https://your-domain.com/auth/callback`

**Переменные:**
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Без этого:** Вход только через email/password

---

### 7. Email-рассылки (Resend)
**Где:** https://resend.com

**Настройка:**
1. Регистрация
2. Verify domain
3. Скопировать API Key

**Переменная:**
```env
RESEND_API_KEY=your-api-key
```

**Без этого:** Не работают email-уведомления о бронированиях

---

## 🟢 ЖЕЛАТЕЛЬНО (можно добавить позже)

### 8. Telegram Bot
**Где:** @BotFather в Telegram

**Команды:**
```
/newbot
name: NexusVita Bot
username: nexusvita_bot
```

**Получить токен и добавить:**
```env
TELEGRAM_BOT_TOKEN=your-bot-token
```

---

## 📋 ИТОГОВЫЙ .env файл

Создай файл `.env` в корне проекта:

```env
# Database (ОБЯЗАТЕЛЬНО)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Auth (ОБЯЗАТЕЛЬНО)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars

# AI (ОПЦИОНАЛЬНО)
QWEN_API_KEY=your-huggingface-token

# Payments (ОПЦИОНАЛЬНО)
NOWPAYMENTS_API_KEY=your-nowpayments-key

# OAuth (ОПЦИОНАЛЬНО)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Email (ОПЦИОНАЛЬНО)
RESEND_API_KEY=your-resend-key

# URLs (для продакшена)
CLIENT_URL=https://your-frontend-url.com
API_URL=https://your-api-url.com
```

---

## 🔒 БЕЗОПАСНОСТЬ

### Что НЕЛЬЗЯ делать:
- ❌ Пушить `.env` в GitHub
- ❌ Хардкодить ключи в коде
- ❌ Использовать один JWT secret для dev и prod

### Что НУЖНО делать:
- ✅ Добавить `.env` в `.gitignore`
- ✅ Использовать разные ключи для dev/prod
- ✅ Хранить продакшн ключи в Render/Vercel Environment Variables
- ✅ Ограничить доступ к Supabase по IP

---

## 🚀 ДЕПЛОЙ НА RENDER

### Шаг 1: Подготовка
```bash
# Убедись что .env НЕ будет закоммичен
cat .gitignore | grep env
# Должно быть: .env
```

### Шаг 2: GitHub
```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

### Шаг 3: Render
1. Создать новый Web Service
2. Подключить GitHub репозиторий
3. Build Command: `pnpm build`
4. Start Command: `pnpm start`
5. **В Environment Variables добавить ВСЕ переменные из .env**

### Шаг 4: Supabase
1. В Authentication → URL Configuration добавить:
   - Site URL: `https://your-render-app.onrender.com`
   - Redirect URLs: `https://your-render-app.onrender.com/**`

---

## ✅ ПРОВЕРКА ПОСЛЕ ЗАПУСКА

### Тест 1: Регистрация
```bash
curl -X POST https://your-app.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","username":"testuser"}'
```

### Тест 2: AI Chat
```bash
curl -X POST https://your-app.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Привет"}'
```

### Тест 3: Профиль
```bash
curl https://your-app.com/api/social/users/testuser
```

---

## 🐛 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

### Ошибка "Database connection failed"
→ Проверь SUPABASE_URL и SUPABASE_SERVICE_KEY

### Ошибка "Invalid token"
→ Проверь JWT_SECRET (должен быть одинаковым при создании и проверке)

### AI возвращает fallback ответы
→ Нормально, если нет QWEN_API_KEY. Для умных ответов - добавь ключ

### Не загружаются файлы
→ Создай buckets в Supabase Storage и настрой Policies

---

## 💰 БЮДЖЕТ НА СТАРТ

| Сервис | Бесплатно | Платно |
|--------|-----------|--------|
| Supabase | 500MB, 2GB bandwidth | $25/мес |
| Render | 512MB RAM, спит после 15мин | $7/мес |
| Hugging Face | API бесплатно | - |
| NOWPayments | 0.5% комиссия | - |
| Resend | 100 email/день | $20/мес |

**Минимум для старта:** $0 (только Supabase + Render free tier)

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:
1. Проверь логи в Render Dashboard
2. Проверь Network tab в браузере (F12)
3. Проверь таблицы в Supabase Table Editor
