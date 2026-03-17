# 🚀 EthosLife - Полное Руководство по Деплою

## Варианты Деплоя

### 1. **Render** (Рекомендуется - Backend + Frontend)
### 2. **Vercel** (Frontend) + **Render/Railway** (Backend)
### 3. **Heroku** (Backend) + **Vercel/Netlify** (Frontend)
### 4. **DigitalOcean App Platform** (Full-stack)

---

## 📦 Подготовка к Деплою

### Шаг 1: Проверка Файлов

Убедитесь, что все необходимые файлы существуют:

```
✅ render.yaml - конфигурация для Render
✅ .env.example - шаблон переменных окружения
✅ build.sh - скрипт сборки
✅ package.json - зависимости
✅ frontend/package.json - frontend зависимости
✅ frontend/vercel.json - конфигурация для Vercel
```

### Шаг 2: Создание .env Файла

```bash
# Скопируйте .env.example
cp .env.example .env

# Отредактируйте .env с вашими реальными значениями
```

**Обязательные переменные для production:**

```env
# Server
PORT=3000
NODE_ENV=production

# Database (Render предоставит автоматически)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=<сгенерируйте надёжный ключ>
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife-api.onrender.com

# Telegram Bot (опционально)
TELEGRAM_BOT_TOKEN=<ваш токен>
FOUNDER_CHAT_ID=<ваш chat_id>

# Admin
ADMIN_KEY=<надёжный ключ>

# AI API (опционально)
QWEN_API_KEY=<ваш ключ>
```

---

## 🎯 Деплой на Render (Рекомендуется)

### Шаг 1: Подготовка Репозитория

```bash
# Инициализация Git (если ещё не сделано)
git init
git add .
git commit -m "Initial commit - EthosLife Platform v2.0.1"

# Создание репозитория на GitHub
# Затем:
git remote add origin https://github.com/yourusername/ethoslife.git
git push -u origin main
```

### Шаг 2: Создание Базы Данных

1. Зайдите на [Render Dashboard](https://dashboard.render.com/)
2. Нажмите **New** → **PostgreSQL**
3. Настройки:
   - **Name:** `ethoslife-db`
   - **Database:** `ethoslife`
   - **User:** `ethoslife`
   - **Plan:** Free (или Starter)
4. Нажмите **Create Database**
5. Сохраните **External Connection String**

### Шаг 3: Деплой Сервиса

1. В Render Dashboard нажмите **New** → **Web Service**
2. Подключите ваш GitHub репозиторий
3. Настройки:
   - **Name:** `ethoslife-api`
   - **Region:** Выберите ближайший
   - **Branch:** `main`
   - **Root Directory:** (оставьте пустым)
   - **Runtime:** `Node`
   - **Build Command:** `chmod +x build.sh && ./build.sh`
   - **Start Command:** `npm start`
   - **Plan:** Starter ($7/мес) или Free

4. **Environment Variables:**
   - Добавьте все переменные из `.env`
   - `DATABASE_URL` возьмите из созданной БД
   - `CORS_ORIGIN` укажите ваш будущий URL

5. Нажмите **Create Web Service**

### Шаг 4: Проверка

После деплоя:
```bash
# Проверка API
curl https://ethoslife-api.onrender.com/api/health

# Ожидаемый ответ:
# {"status":"ok","timestamp":"...","currentPrice":0.05}
```

---

## ⚡ Деплой Frontend на Vercel

### Шаг 1: Подготовка

```bash
cd frontend

# Убедитесь, что vercel.json существует
# Установите Vercel CLI
npm install -g vercel
```

### Шаг 2: Деплой

```bash
# Логин в Vercel
vercel login

# Деплой
vercel --prod
```

Или через GitHub:

1. Зайдите на [Vercel](https://vercel.com/)
2. **New Project** → Import GitHub Repository
3. Выберите ваш репозиторий
4. **Root Directory:** `frontend`
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Нажмите **Deploy**

### Шаг 3: Настройка CORS

После деплоя обновите `CORS_ORIGIN` на backend:

```env
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife-api.onrender.com
```

---

## 🔧 Альтернатива: Railway

### Деплой на Railway

1. Зайдите на [Railway](https://railway.app/)
2. **New Project** → **Deploy from GitHub**
3. Выберите репозиторий
4. Добавьте переменные окружения
5. Railway автоматически определит Node.js проект

**Преимущества Railway:**
- Проще настройка чем Render
- $5 кредитов бесплатно
- Автоматический деплой при push

---

## 🗄️ Миграции Базы Данных

После первого деплоя:

```bash
# Инициализация БД
npx knex migrate:latest

# Или через скрипт
npm run db:init
```

---

## ✅ Чеклист Перед Деплоем

- [ ] Все зависимости установлены
- [ ] `.env` файл создан с правильными значениями
- [ ] Git репозиторий создан и запушен
- [ ] Build проходит локально без ошибок
- [ ] Все API endpoints работают
- [ ] CORS настроен правильно
- [ ] Database URL настроен
- [ ] Секретные ключи сгенерированы
- [ ] Telegram bot настроен (опционально)
- [ ] AI API ключи настроены (опционально)

---

## 🔍 Мониторинг и Логи

### Render Logs

```
Dashboard → Ваш сервис → Logs
```

### Vercel Logs

```bash
vercel logs <deployment-url>
```

### Проверка Здоровья

```bash
# API Health Check
curl https://your-api.onrender.com/api/health

# Frontend
# Откройте в браузере https://your-app.vercel.app
```

---

## 🐛 Решение Проблем

### Ошибка: "Build failed"

```bash
# Проверьте локально
npm run build

# Проверьте Node.js версию
node --version  # Должно быть >= 18.0.0
```

### Ошибка: "CORS"

```env
# Убедитесь, что CORS_ORIGIN включает ваш frontend URL
CORS_ORIGIN=https://your-app.vercel.app
```

### Ошибка: "Database connection failed"

```env
# Проверьте DATABASE_URL
# Убедитесь, что PGSSLMODE=no-verify для Render
```

### Ошибка: "Module not found"

```bash
# Установите все зависимости
npm install

# Для frontend
cd frontend && npm install
```

---

## 📊 Post-Deploy

### 1. Проверка Функциональности

- [ ] Главная страница загружается
- [ ] Навигация работает
- [ ] AI чат открывается
- [ ] Переключение режимов работает
- [ ] Health модули доступны
- [ ] Аутентификация работает

### 2. Настройка Домена (Опционально)

**Render:**
```
Settings → Custom Domain → Add Domain
```

**Vercel:**
```
Settings → Domains → Add Domain
```

### 3. SSL Сертификат

Автоматически предоставляется Render и Vercel.

---

## 🎯 Быстрый Деплой (One-Click)

### Render One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Нажмите кнопку выше
2. Подключите GitHub
3. Заполните переменные окружения
4. Deploy!

---

## 📈 Производительность

### Оптимизация Frontend

```bash
cd frontend

# Анализ размера.bundle
npm run build -- --analyze

# Оптимизация изображений
# Используйте WebP формат
# Сжимайте изображения перед загрузкой
```

### Кэширование

- Vercel автоматически кэширует статику
- Render кэширует через CDN
- Настройте заголовки Cache-Control

---

## 🔐 Безопасность

### Обязательные Действия

1. **Смените все секретные ключи**
2. **Включите HTTPS** (автоматически на Render/Vercel)
3. **Настройте CORS** правильно
4. **Используйте переменные окружения**
5. **Не коммитьте .env в Git**

### Рекомендуемые

1. Включите 2FA на GitHub
2. Используйте защищённые пароли
3. Регулярно обновляйте зависимости
4. Мониторьте логи на подозрительную активность

---

## 📞 Поддержка

При проблемах:

1. Проверьте логи в dashboard
2. Поищите ошибку в документации
3. Создайте issue на GitHub
4. Обратитесь в поддержку платформы

---

*Последнее обновление: Март 2026*
*Версия платформы: 2.0.1*
