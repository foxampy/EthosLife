# 📋 ПОЛНЫЙ СПИСОК ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
## EthosLife Platform v3.0

---

## 🔐 КРИТИЧЕСКИЕ ПЕРЕМЕННЫЕ (ОБЯЗАТЕЛЬНО)

### Backend (.env в корне проекта)

```env
# ============================================
# SERVER
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# DATABASE (PostgreSQL) - Render
# ============================================
DATABASE_URL=postgresql://ethoslife:PASSWORD@ep-xxx-xxx.us-east-2.aws.neon.tech/ethoslife?sslmode=require
PGSSLMODE=require

# ============================================
# JWT (КРИТИЧНО!)
# ============================================
JWT_SECRET=минимум-32-символа-секретный-ключ-измени-в-продакшене
JWT_REFRESH_SECRET=другой-секретный-ключ-минимум-32-символа
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# ADMIN
# ============================================
ADMIN_KEY=супер-секретный-админ-ключ-измени-обязательно

# ============================================
# CORS
# ============================================
CORS_ORIGIN=https://ethoslife.vercel.app,https://ethoslife.onrender.com,http://localhost:3000,http://localhost:5173
FRONTEND_URL=https://ethoslife.vercel.app
```

---

## 🔗 OAUTH & АУТЕНТИФИКАЦИЯ

### Google OAuth
1. Иди на https://console.cloud.google.com/
2. Создай новый проект "EthosLife"
3. APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://ethoslife.onrender.com/api/auth/google/callback`

```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

### Apple Sign-In
1. Иди на https://developer.apple.com/
2. Certificates, IDs & Profiles
3. Identifiers → App IDs
4. Services → Sign in with Apple

```env
APPLE_CLIENT_ID=com.ethoslife.web
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
```

### Telegram Login
1. Открой @BotFather в Telegram
2. /newbot - создай бота
3. Получи токен

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
FOUNDER_CHAT_ID=123456789
ADMIN_CHAT_IDS=123456789,987654321
```

---

## 💳 STRIPE (ПЛАТЕЖИ)

1. Иди на https://dashboard.stripe.com/
2. API Keys → скопируй ключи
3. Products → создай продукты
4. Pricing → создай цены

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Price IDs (создай в Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
```

---

## 🤖 AI / ML API

### Qwen API (Alibaba Cloud)
1. Иди на https://dashscope.console.aliyun.com/
2. API Key Management → Create API Key

```env
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### OpenAI (опционально)
1. https://platform.openai.com/api-keys

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Anthropic (опционально)
1. https://console.anthropic.com/settings/keys

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📧 EMAIL (SendGrid)

1. https://app.sendgrid.com/
2. Settings → API Keys
3. Create API Key

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=xxxxxxxxxxxxxxxxxxxxx
```

---

## 🌐 FRONTEND (Vercel)

### frontend/.env

```env
# API URL (Render backend)
VITE_API_URL=https://ethoslife-api.onrender.com/api

# Google OAuth (тот же что и в backend)
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com

# Web3
VITE_ALCHEMY_API_KEY=xxxxxxxxxxxxxxxxxxxx
VITE_CONTRACT_ADDRESS=0xYourContractAddress

# Feature Flags
VITE_ENABLE_AI=true
VITE_ENABLE_SOCIAL=true
VITE_ENABLE_MARKETPLACE=true
```

---

## 🔗 WEB3 / CRYPTO

### Alchemy
1. https://www.alchemy.com/
2. Create App → Ethereum
3. View Key → скопируй HTTP

```env
ALCHEMY_API_KEY=xxxxxxxxxxxxxxxxxxxx
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/xxxxxxxxxxxx
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/xxxxxxxxxxxx
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/xxxxxxxxxxxx
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/xxxxxxxxxxxx
```

### Private Key (для деплоя контрактов)
```env
PRIVATE_KEY=0xYourPrivateKeyHere
```

### Etherscan (для верификации контрактов)
```env
ETHERSCAN_API_KEY=YourApiKeyHere
POLYGONSCAN_API_KEY=YourApiKeyHere
REPORT_GAS=true
```

---

## ☁️ AWS S3 (File Storage)

1. https://aws.amazon.com/s3/
2. Create bucket
3. IAM → Create user → S3 permissions

```env
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=ethoslife-storage
AWS_REGION=us-east-1
```

---

## 🗄️ REDIS (Cache)

### Redis Cloud
1. https://redis.com/try-free/
2. Create database
3. Copy connection URL

```env
REDIS_URL=redis://default:password@hostname:port
```

---

## 📊 ГДЕ НАСТРАИВАТЬ

### Vercel (Frontend)
1. https://vercel.com/dashboard
2. Project → Settings → Environment Variables
3. Добавь все переменные из `frontend/.env`
4. Production / Preview / Development

### Render (Backend)
1. https://render.com/dashboard
2. Web Service → Environment
3. Добавь все переменные из `.env` (кроме frontend)
4. Database → PostgreSQL → Connection string

### GitHub (для Vercel)
1. https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: repo, workflow

---

## 🔒 БЕЗОПАСНОСТЬ

### Обязательно:
- ✅ Все секреты минимум 32 символа
- ✅ JWT_SECRET ≠ JWT_REFRESH_SECRET
- ✅ Не коммить .env в Git!
- ✅ Используй разные ключи для dev/prod
- ✅ Регулярно ротируй ключи (каждые 90 дней)

### Генерация секретов:
```bash
# JWT Secret (32+ символа)
openssl rand -hex 32

# Admin Key
openssl rand -hex 16

# UUID
uuidgen
```

---

## 📝 ЧЕК-ЛИСТ ПЕРЕД ДЕПЛОЕМ

- [ ] DATABASE_URL настроен и работает
- [ ] JWT_SECRET и JWT_REFRESH_SECRET установлены (32+ символа)
- [ ] PGSSLMODE=require для production
- [ ] CORS_ORIGIN включает Vercel и Render домены
- [ ] GOOGLE_CLIENT_ID и SECRET настроены
- [ ] STRIPE_* переменные установлены
- [ ] QWEN_API_KEY для AI Coach
- [ ] TELEGRAM_BOT_TOKEN для уведомлений
- [ ] ADMIN_KEY изменён с дефолтного
- [ ] VITE_API_URL указывает на Render API
- [ ] Все .env файлы добавлены в .gitignore

---

## 🆘 ТРАБЛШУТИНГ

### "JWT_SECRET must be at least 32 characters"
→ Сгенерируй новый: `openssl rand -hex 32`

### "Database connection failed"
→ Проверь DATABASE_URL и PGSSLMODE

### "CORS error"
→ Добавь свой домен в CORS_ORIGIN

### "Google OAuth failed"
→ Проверь redirect URI в Google Console

### "Vite not found"
→ Убедись что `cd frontend && npm install` работает

---

**© 2026 EthosLife Platform**  
*Полная документация в `/docs/`*
