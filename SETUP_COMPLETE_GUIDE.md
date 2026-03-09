# 🚀 EthosLife: Полная Инструкция по Настройке и Деплою

**Версия:** 1.0
**Дата:** 9 марта 2026 г.
**Статус:** ✅ Ready for Production

---

# 📋 ЧАСТЬ 1: БЫСТРЫЙ СТАРТ (15 минут)

## 1.1 Деплой на Vercel (Frontend)

### Шаг 1: Создать аккаунт Vercel
```
1. Перейти на https://vercel.com/signup
2. Sign up через GitHub (рекомендуется) или email
3. Подтвердить email
```

### Шаг 2: Импортировать проект
```
1. Vercel Dashboard → Import Project
2. Import Git Repository → Выбрать EthosLife
3. Configure Project:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
```

### Шаг 3: Environment Variables
```
Добавить в Vercel Settings → Environment Variables:

VITE_API_URL = https://ethoslife-api.onrender.com/api
VITE_APP_URL = https://ethoslife.vercel.app
VITE_NODE_ENV = production

✅ Production, Preview, Development
```

### Шаг 4: Deploy
```
1. Click "Deploy"
2. Ждать 2-3 минуты
3. Visit: https://ethoslife.vercel.app
```

---

## 1.2 Деплой на Render (Backend + Database)

### Шаг 1: Создать аккаунт Render
```
1. Перейти на https://render.com/register
2. Sign up через GitHub (рекомендуется)
3. Подтвердить email
```

### Шаг 2: Создать PostgreSQL Database
```
1. New + → PostgreSQL
2. Name: ethoslife-db
3. Region: Oregon (ближайший к вам)
4. Plan: Free (1GB)
5. Database Name: ethoslife
6. User: ethoslife
7. Click "Create Database"
8. Ждать 2-3 минуты
9. Копировать "External Database URL"
   postgresql://ethoslife:password@ep-xxx-xxx.us-east-2.aws.render.com:5432/ethoslife?sslmode=require
```

### Шаг 3: Создать Web Service
```
1. New + → Web Service
2. Connect repository: EthosLife
3. Configure:
   - Name: ethoslife-api
   - Region: Oregon
   - Branch: main
   - Root Directory: (оставить пустым)
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
4. Plan: Starter ($7-19/месяц) ← ВАЖНО! Не Free!
5. Click "Create Web Service"
```

### Шаг 4: Environment Variables (Backend)
```
Добавить все переменные из раздела 2.1:
- DATABASE_URL (из шага 2)
- JWT_SECRET
- JWT_REFRESH_SECRET
- ADMIN_KEY
- CORS_ORIGIN
- TELEGRAM_BOT_TOKEN
- FOUNDER_CHAT_ID
- ADMIN_CHAT_IDS
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- QWEN_API_KEY
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
```

### Шаг 5: Настройки
```
Settings →
✅ Auto-Deploy: Enabled
✅ Health Check Path: /api/health
✅ Health Check Timeout: 60
```

### Шаг 6: Проверка
```
1. Ждать 3-5 минут
2. Копировать URL: https://ethoslife-api.onrender.com
3. Test: https://ethoslife-api.onrender.com/api/health
4. Ожидать: {"status": "ok", ...}
```

---

# 🔐 ЧАСТЬ 2: НАСТРОЙКА ВСЕХ СЕРВИСОВ

## 2.1 Environment Variables (Полный Список)

### Backend (.env.production)

```bash
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# DATABASE (из Render PostgreSQL)
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/ethoslife?sslmode=require

# ============================================
# JWT CONFIGURATION
# ============================================
# Сгенерировать: openssl rand -hex 32
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars-change-in-production
JWT_EXPIRES_IN=7d

# ============================================
# ADMIN CONFIGURATION
# ============================================
# Придумать случайную строку
ADMIN_KEY=your-admin-key-for-api-access-change-to-something-random

# ============================================
# CORS & FRONTEND
# ============================================
# URL вашего frontend на Vercel
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife-*.vercel.app
FRONTEND_URL=https://ethoslife.vercel.app

# ============================================
# TELEGRAM BOT (SAFT Notifications)
# ============================================
# Получить в @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
FOUNDER_CHAT_ID=your_chat_id_here
ADMIN_CHAT_IDS=admin1_chat_id,admin2_chat_id

# ============================================
# GOOGLE OAUTH 2.0
# ============================================
# Создать в Google Cloud Console
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx

# ============================================
# STRIPE (Payments & Subscriptions)
# ============================================
# Создать в Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs (создать в Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxxxxxxxxxxxxx

# ============================================
# EMAIL CONFIGURATION (Resend/SendGrid)
# ============================================
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your_resend_api_key

# ============================================
# AI/ML API KEYS
# ============================================
# Получить на https://cloud.google.com/vertex-ai
QWEN_API_KEY=your-qwen-api-key-here

# ============================================
# WEB3/CRYPTO (Optional)
# ============================================
# Получить на https://www.alchemy.com/
ALCHEMY_API_KEY=your-alchemy-api-key
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key

# ============================================
# FILE STORAGE (AWS S3)
# ============================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=ethoslife-files
AWS_REGION=us-east-1
```

### Frontend (frontend/.env.production)

```bash
# ============================================
# API & APP URLs
# ============================================
VITE_API_URL=https://ethoslife-api.onrender.com/api
VITE_APP_URL=https://ethoslife.vercel.app
VITE_NODE_ENV=production

# ============================================
# WEB3 (Optional)
# ============================================
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
```

---

## 2.2 Настройка Google OAuth 2.0

### Шаг 1: Создать проект в Google Cloud
```
1. Перейти на https://console.cloud.google.com/
2. Create Project → Name: EthosLife
3. Click "Create"
```

### Шаг 2: Enable Google+ API
```
1. APIs & Services → Library
2. Search "Google+ API"
3. Click "Enable"
```

### Шаг 3: Создать OAuth Credentials
```
1. APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: Web application
4. Name: EthosLife Web Client
5. Authorized JavaScript origins:
   - https://ethoslife.vercel.app
   - https://ethoslife-api.onrender.com
6. Authorized redirect URIs:
   - https://ethoslife.vercel.app/auth/google/callback
   - https://ethoslife-api.onrender.com/auth/google/callback
7. Click "Create"
```

### Шаг 4: Скопировать Credentials
```
Client ID: 123456789012-abc...xyz.apps.googleusercontent.com
Client Secret: GOCSPX-abcdefghijklmnopqrstuvwx

Вставить в .env.production:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Шаг 5: OAuth Consent Screen
```
1. APIs & Services → OAuth consent screen
2. User Type: External
3. App name: EthosLife
4. User support email: your-email@gmail.com
5. Developer contact: your-email@gmail.com
6. Save and Continue
7. Scopes: Add userinfo, email, profile
8. Save and Continue
9. Test users: Add your email
10. Save and Continue
```

---

## 2.3 Настройка Telegram OAuth

### Шаг 1: Создать бота в @BotFather
```
1. Открыть Telegram → @BotFather
2. Отправить /newbot
3. Name: EthosLife Bot
4. Username: ethoslife_bot (должен заканчиваться на _bot)
5. Скопировать токен: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Шаг 2: Получить Chat ID
```
1. Открыть Telegram → @userinfobot
2. Отправить любое сообщение
3. Скопировать Chat ID: 123456789
```

### Шаг 3: Настроить Webhook (для Vercel)
```
1. Открыть @BotFather
2. Отправить /setwebhook
3. Отправить URL:
   https://ethoslife-api.onrender.com/api/telegram/webhook
4. BotFather подтвердит: "Webhook was set"
```

### Шаг 4: Добавить переменные
```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
FOUNDER_CHAT_ID=123456789
ADMIN_CHAT_IDS=123456789,987654321
```

---

## 2.4 Настройка Stripe (Платежи и Подписки)

### Шаг 1: Создать аккаунт Stripe
```
1. Перейти на https://stripe.com/
2. Sign up → Business email
3. Complete business details
```

### Шаг 2: Получить API Keys
```
1. Dashboard → Developers → API keys
2. Copy Secret Key: sk_live_...
3. Copy Publishable Key: pk_live_...
```

### Шаг 3: Создать Products & Prices
```
1. Dashboard → Products → Add product

Product 1: EthosLife Premium
- Name: Premium
- Description: Premium subscription
- Pricing: $9.99/month
- Create → Copy Price ID: price_xxxxx

Product 2: EthosLife Premium (Yearly)
- Name: Premium Yearly
- Pricing: $99.99/year
- Create → Copy Price ID: price_xxxxx

Product 3: EthosLife Pro
- Name: Pro
- Pricing: $19.99/month
- Create → Copy Price ID: price_xxxxx

Product 4: EthosLife Pro (Yearly)
- Name: Pro Yearly
- Pricing: $199.99/year
- Create → Copy Price ID: price_xxxxx
```

### Шаг 4: Настроить Webhook
```
1. Dashboard → Developers → Webhooks
2. Add endpoint
3. Endpoint URL:
   https://ethoslife-api.onrender.com/webhooks/stripe
4. Events to send:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
5. Add → Copy Signing Secret: whsec_...
```

### Шаг 5: Добавить переменные
```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxxxx
```

---

## 2.5 Настройка Email (Resend)

### Шаг 1: Создать аккаунт Resend
```
1. Перейти на https://resend.com/
2. Sign up → GitHub
3. Verify email
```

### Шаг 2: Создать API Key
```
1. Dashboard → API Keys
2. Create API Key
3. Name: EthosLife Production
4. Copy API Key: re_xxxxx
```

### Шаг 3: Добавить Domain (Optional)
```
1. Dashboard → Domains
2. Add Domain: ethoslife.com
3. Add DNS records to your domain provider
4. Verify
```

### Шаг 4: Добавить переменные
```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxxx
```

---

## 2.6 Настройка Qwen AI API

### Шаг 1: Создать аккаунт Alibaba Cloud
```
1. Перейти на https://www.alibabacloud.com/
2. Sign up → Email
3. Complete verification
```

### Шаг 2: Activate DashScope
```
1. Console → Product & Services
2. Search "DashScope"
3. Activate service
```

### Шаг 3: Создать API Key
```
1. Console → DashScope → API Keys
2. Create API Key
3. Copy Key: sk-xxxxxxxxxxxxx
```

### Шаг 4: Добавить переменную
```
QWEN_API_KEY=sk-xxxxxxxxxxxxx
```

---

## 2.7 Настройка AWS S3 (File Storage)

### Шаг 1: Создать AWS аккаунт
```
1. Перейти на https://aws.amazon.com/
2. Create Account
3. Complete verification
```

### Шаг 2: Создать S3 Bucket
```
1. S3 Console → Create bucket
2. Bucket name: ethoslife-files
3. Region: us-east-1
4. Block Public Access: Block all
5. Create
```

### Шаг 3: Создать IAM User
```
1. IAM Console → Users → Create user
2. User name: ethoslife-s3
3. Attach policy: AmazonS3FullAccess
4. Create → Copy Access Key ID и Secret Access Key
```

### Шаг 4: Добавить переменные
```
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
AWS_S3_BUCKET=ethoslife-files
AWS_REGION=us-east-1
```

---

# ✅ ЧАСТЬ 3: ФИНАЛЬНАЯ ПРОВЕРКА

## 3.1 Checklist Перед Запуском

### Backend
```
[✅] Render Web Service создан
[✅] PostgreSQL Database создан
[✅] Все environment variables добавлены
[✅] Health check: /api/health → {"status": "ok"}
[✅] Database tables created (migrations)
[✅] Telegram bot работает
[✅] Google OAuth настроен
[✅] Stripe webhook настроен
```

### Frontend
```
[✅] Vercel project создан
[✅] Environment variables добавлены
[✅] Build successful
[✅] Site loads: https://ethoslife.vercel.app
[✅] API calls work (no CORS errors)
[✅] Mobile responsive
[✅] Version toggle работает
[✅] Language selector работает
```

### Интеграции
```
[✅] Google OAuth → Login работает
[✅] Telegram OAuth → Login работает
[✅] Stripe → Checkout работает
[✅] Email → Отправка работает
[✅] AI → Chat работает
[✅] Web3 → Wallet connect работает
```

---

## 3.2 Тестирование

### Тест 1: Регистрация
```
1. Открыть https://ethoslife.vercel.app/register
2. Заполнить форму
3. Отправить
4. Проверить БД (Render Dashboard → Database)
5. User должен быть в таблице users ✅
```

### Тест 2: Google OAuth
```
1. Открыть https://ethoslife.vercel.app/login
2. Click "Continue with Google"
3. Выбрать аккаунт
4. Redirect на dashboard ✅
5. User создан в БД ✅
```

### Тест 3: Telegram OAuth
```
1. Открыть https://ethoslife.vercel.app/login
2. Click "Continue with Telegram"
3. Authorize
4. Redirect на dashboard ✅
5. User создан в БД ✅
```

### Тест 4: Платежи
```
1. Открыть https://ethoslife.vercel.app/pricing
2. Click "Попробовать 14 дней"
3. Stripe Checkout открывается ✅
4. Test card: 4242 4242 4242 4242
5. Payment successful ✅
6. Subscription создана в БД ✅
```

### Тест 5: AI Chat
```
1. Открыть https://ethoslife.vercel.app/ai-chat
2. Отправить сообщение
3. AI отвечает ✅
4. Сообщение сохранено в БД ✅
```

---

## 3.3 Monitoring

### Vercel Analytics
```
1. Vercel Dashboard → Project → Analytics
2. View:
   - Page views
   - Bandwidth
   - Response times
   - Errors
```

### Render Logs
```
1. Render Dashboard → Web Service → Logs
2. View:
   - Application logs
   - Errors
   - Request counts
   - Response times
```

### Sentry (Error Tracking)
```
1. Создать аккаунт на https://sentry.io/
2. Create Project → Node.js
3. Copy DSN
4. Добавить в backend:
   const Sentry = require('@sentry/node');
   Sentry.init({ dsn: 'your-dsn' });
```

---

# 🎯 ЧАСТЬ 4: ПОДДЕРЖКА И ОБНОВЛЕНИЯ

## 4.1 Обновление Кода

### Push New Code
```bash
git add .
git commit -m "Feature: description"
git push origin main
```

### Auto-Deploy
```
✅ Vercel: Auto-deploy при push в main
✅ Render: Auto-deploy при push в main
```

### Manual Deploy
```bash
# Vercel CLI
cd frontend
vercel --prod

# Render
# Dashboard → Manual Deploy
```

---

## 4.2 Backup Database

### Automatic Backups (Render)
```
✅ Free plan: 90 days retention
✅ Daily automatic backups
```

### Manual Backup
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
psql $DATABASE_URL < backup_20260309.sql
```

---

## 4.3 Scaling

### Когда Upgrade Vercel?
```
Upgrade to Pro ($20/month) когда:
- >100GB bandwidth/month
- Нужен custom domain analytics
- Нужна priority support
```

### Когда Upgrade Render?
```
Upgrade to Standard ($25+/month) когда:
- Нужно больше RAM (>512MB)
- Нужно auto-scaling
- Нужен SLA guarantee
```

### Database Scaling
```
Upgrade PostgreSQL когда:
- >1GB storage
- Нужно больше connections
- Нужен point-in-time recovery
```

---

# 📞 ПОДДЕРЖКА

## Документация
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Stripe: https://stripe.com/docs
- Google OAuth: https://developers.google.com/identity

## Статус Сервисов
- Vercel Status: https://www.vercel-status.com/
- Render Status: https://status.render.com/
- Stripe Status: https://status.stripe.com/

## Контакты Проекта
- Email: support@ethoslife.com
- Telegram: @foxampy
- Website: https://ethoslife.vercel.app

---

# ✅ ФИНАЛЬНЫЙ CHECKLIST

## Перед Запуском
```
[✅] GitHub repository готов
[✅] Vercel аккаунт создан
[✅] Render аккаунт создан
[✅] Все environment variables добавлены
[✅] Database создан и мигрирован
[✅] Frontend задеплоен
[✅] Backend задеплоен
[✅] Интеграции настроены
[✅] Тесты пройдены
```

## После Запуска
```
[✅] Monitoring настроен
[✅] Error tracking настроен
[✅] Backups настроены
[✅] Documentation обновлена
[✅] Команда уведомлена
```

---

**🎉 ГОТОВО! Проект запущен!**

**Следующие шаги:**
1. Настроить домен (опционально)
2. Настроить SSL (автоматически)
3. Настроить CDN (Vercel автоматически)
4. Начать привлекать пользователей

**Время настройки:** 30-45 минут
**Стоимость:** $7-19/месяц (Render Starter)

**© 2026 EthosLife Inc.**
