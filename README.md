# EthosLife - Human Operating System 🌍

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Full-stack health ecosystem platform with AI coaching**

🌐 **Live Demo**: https://ethoslife-web.onrender.com

## ✨ Features

### 🔐 Authentication
- Google OAuth 2.0
- Telegram Login Widget
- JWT with refresh tokens

### 🏥 Health Module (7 Directions)
- **Nutrition** - Meal tracking, calories
- **Fitness** - Workout logging, activity
- **Sleep** - Sleep duration & quality
- **Mental Health** - Mood tracking
- **Medical** - Records, medications
- **Body** - Weight, BMI, measurements
- **Environment** - Air quality, ergonomics

### 🤖 AI Coach (Qwen API)
- Personal health assistant
- Context-aware responses
- RAG knowledge base
- Conversation history

### 📊 Dashboard
- Health Score (0-100)
- Interactive charts (Recharts)
- Goals tracking
- Recent activity

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Zustand, React Query |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| AI | Qwen API (Alibaba) |
| Auth | JWT, Google OAuth, Telegram |

## 📁 Project Structure

```
├── backend/
│   ├── server.js              # Express API
│   ├── controllers/           # Route handlers
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   ├── database.js            # PostgreSQL client
│   └── migrations/            # SQL migrations
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── components/        # Reusable components
│   │   ├── store/             # Zustand stores
│   │   └── services/          # API client
│   └── package.json
├── render.yaml                # Render deployment config
└── README.md
```

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/foxampy/EthosLife.git
cd EthosLife
npm install
cd frontend && npm install
cd ..
```

### 2. Environment Variables
Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://localhost:5432/ethoslife

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-bot-token
FOUNDER_CHAT_ID=your-chat-id

# Qwen AI (optional)
QWEN_API_KEY=your-qwen-key
```

### 3. Database Setup
```bash
# Run migrations
psql $DATABASE_URL -f migrations/001_create_users.sql
psql $DATABASE_URL -f migrations/002_health_tables.sql
psql $DATABASE_URL -f migrations/003_ai_tables.sql
```

### 4. Run Development
```bash
# Backend
npm run dev

# Frontend (new terminal)
cd frontend
npm start
```

## 📊 API Endpoints

### Auth
```
POST /api/auth/google
POST /api/auth/telegram
POST /api/auth/refresh
GET  /api/auth/me
```

### Health
```
GET  /api/health/dashboard
GET  /api/health/metrics
POST /api/health/metrics
GET  /api/health/goals
POST /api/health/goals
```

### AI
```
GET  /api/ai/conversations
POST /api/ai/conversations
GET  /api/ai/conversations/:id/messages
POST /api/ai/conversations/:id/messages
```

## 🌍 Languages

| Code | Language | Flag |
|------|----------|------|
| en | English | 🇺🇸 |
| es | Español | 🇪🇸 |
| de | Deutsch | 🇩🇪 |
| pl | Polski | 🇵🇱 |
| he | עברית | 🇮🇱 |
| ar | العربية | 🇸🇦 |
| ru | Русский | 🇷🇺 |
| ko | 한국어 | 🇰🇷 |
| ja | 日本語 | 🇯🇵 |
| zh | 中文 | 🇨🇳 |

## 🚀 Deployment

1. Push to GitHub
2. Connect to Render (Blueprint)
3. Add environment variables in Render Dashboard
4. Deploy!

## 📝 License

Private - EthosLife Inc.

---

© 2026 EthosLife Inc. All rights reserved.
