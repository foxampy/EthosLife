# 🔧 EthosLife - Настройка Переменных Окружения

## ✅ Обязательно Настроить!

### 1. Telegram Bot (для уведомлений)

1. **Создайте бота:**
   - Откройте @BotFather в Telegram
   - Отправьте `/newbot`
   - Введите имя и username бота
   - Скопируйте токен

2. **Получите Chat ID:**
   - Отправьте сообщение своему новому боту
   - Откройте `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Найдите `"chat":{"id":123456789}`
   - Это ваш FOUNDER_CHAT_ID

3. **Добавьте в Render:**
   ```
   TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   FOUNDER_CHAT_ID = 123456789
   ADMIN_CHAT_IDS = 123456789,987654321
   ```

### 2. Google OAuth (для входа)

1. **Создайте проект:**
   - https://console.cloud.google.com
   - Create Project → "EthosLife"

2. **Настройте OAuth:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://ethoslife.onrender.com/api/auth/google`
     - `http://localhost:3000/api/auth/google`

3. **Скопируйте Client ID:**
   ```
   GOOGLE_CLIENT_ID = 123456789-abc123def456.apps.googleusercontent.com
   ```

### 3. Admin Key (для доступа к админке)

```
ADMIN_KEY = your-super-secret-admin-key-change-this
```

### 4. Qwen AI (для AI чата)

1. Получите API ключ: https://chat.qwen.ai
2. Добавьте:
   ```
   QWEN_API_KEY = sk-...
   ```

### 5. JWT Secrets (можно сгенерировать)

```
JWT_SECRET = your-super-secret-jwt-key-min-32-chars!
JWT_REFRESH_SECRET = another-super-secret-refresh-key-32-chars
```

---

## 📊 База Данных

Render автоматически создаёт PostgreSQL базу. Проверьте:

1. Зайдите в dashboard Render
2. Выберите `ethoslife-db`
3. Скопируйте `External Database URL`
4. Убедитесь что `DATABASE_URL` установлен в сервисе

---

## ✅ Проверка После Настройки

1. **Перезапустите сервис** в Render dashboard
2. **Проверьте логи** - должны быть:
   ```
   ✅ Database connected and initialized
   🤖 Telegram bot initialized
   🚀 EthosLife SAFT Platform running on port 10000
   ```

3. **Проверьте сайт** - https://ethoslife.onrender.com
   - Должна загрузиться главная страница
   - CSS и JS файлы должны загружаться (нет 404)

---

## 🚨 Troubleshooting

### Ошибка: "Cannot find module"
```bash
# Решение: Пересоберите
npm install
cd frontend && npm install && npm run build
```

### Ошибка: "404 Not Found" для /assets/*
```bash
# Проверьте что файлы существуют:
ls -la frontend/dist/assets/

# Если пусто - пересоберите фронтенд
```

### Ошибка: "Database connection failed"
```bash
# Проверьте DATABASE_URL в Render dashboard
# Убедитесь что база существует
```

### Ошибка: "Telegram bot failed"
```bash
# Проверьте TELEGRAM_BOT_TOKEN
# Убедитесь что бот активен в @BotFather
```

---

## 📝 Environment Variables Template

```env
# Production
NODE_ENV=production

# CORS
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife.onrender.com,http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
PGSSLMODE=no-verify

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
FOUNDER_CHAT_ID=123456789
ADMIN_CHAT_IDS=123456789

# Admin
ADMIN_KEY=your-admin-key-here

# JWT
JWT_SECRET=your-jwt-secret-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# OAuth
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com

# AI
QWEN_API_KEY=sk-...
```

---

**После настройки всех переменных - перезапустите сервис в Render!**
