# EthosLife - Human Operating System 🌍

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/foxampy/EthosLife)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/foxampy/EthosLife&project-name=ethoslife-frontend&repository-name=ethoslife-frontend&root-directory=frontend)

**AI-Powered Health Ecosystem Platform**

🌐 **Live Demo**: [Coming Soon](#)  
📚 **Full Documentation**: See [DEPLOY_SCRIPT.md](./DEPLOY_SCRIPT.md)

---

## ✨ Quick Overview

EthosLife is a comprehensive health platform that combines:
- 🤖 AI Health Coach (Qwen API)
- 📊 Health Tracking (7 modules)
- 💬 Unified Chat (AI + General)
- 🌐 25 Languages Support
- 🔐 Google & Telegram Auth

---

## 🚀 Quick Deploy

### Option 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/foxampy/EthosLife)

### Option 2: Manual Setup

```bash
# Clone
git clone https://github.com/foxampy/EthosLife.git
cd EthosLife

# Install backend
npm install

# Install frontend
cd frontend && npm install && cd ..

# Create .env (see .env.example)
cp .env.example .env

# Run
npm run dev
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **AI** | Qwen API (Alibaba) |
| **Auth** | JWT, Google OAuth, Telegram |
| **Deploy** | Render, Vercel |

---

## 📁 Project Structure

```
EthosLife/
├── server.js              # Backend API
├── database.js            # PostgreSQL connection
├── routes/                # API routes
├── controllers/           # Business logic
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/         # Pages (V2 main)
│   │   ├── components/    # UI components
│   │   ├── App.tsx        # Main component
│   │   └── main.tsx       # Entry point
│   └── package.json
├── render.yaml            # Render config
└── .env.example           # Environment template
```

---

## 🔐 Environment Variables

**Required (Backend):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-app.vercel.app
```

**Optional:**
```env
TELEGRAM_BOT_TOKEN=...
QWEN_API_KEY=...
GOOGLE_CLIENT_ID=...
STRIPE_SECRET_KEY=...
```

See [DEPLOY_SCRIPT.md](./DEPLOY_SCRIPT.md) for complete list.

---

## 📊 Features

### Health Modules
- 🥗 **Nutrition** - Meal tracking, calories
- 💪 **Movement** - Workouts, activity
- 😴 **Sleep** - Sleep quality & duration
- 🧠 **Psychology** - Mental health, mood
- 🏥 **Medicine** - Medical records
- 🤝 **Relationships** - Social health
- 🎯 **Habits** - Habit tracking

### AI Chat
- 🤖 6 AI Personas (Dr. Wellness, FitCoach, NutriBot, etc.)
- 💬 General Chat mode
- ⚙️ Configurable settings
- 📊 Health context integration

### Auth & Security
- 🔐 JWT with refresh tokens
- 🌐 Google OAuth 2.0
- 📱 Telegram Login
- ✅ Role-based access

---

## 🌍 Languages

Supports 25 languages: English, Spanish, German, Polish, Hebrew, Arabic, Russian, Korean, Japanese, Chinese, and more.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | This file - Quick start |
| [DEPLOY_SCRIPT.md](./DEPLOY_SCRIPT.md) | **Complete deployment guide** |
| [.env.example](./.env.example) | Environment variables template |

---

## 🐛 Troubleshooting

**Build fails?**
```bash
node --version  # Must be >= 18.0.0
npm run build   # Test locally
```

**CORS errors?**
- Add your frontend URL to `CORS_ORIGIN` in backend

**Database connection failed?**
- Check `DATABASE_URL` is correct
- Add `PGSSLMODE=no-verify` for Render

See [DEPLOY_SCRIPT.md](./DEPLOY_SCRIPT.md) for more solutions.

---

## 📝 License

Private - EthosLife Inc.

---

## 🔗 Links

- **GitHub**: https://github.com/foxampy/EthosLife
- **Render**: https://render.com
- **Vercel**: https://vercel.com

---

© 2026 EthosLife Inc. All rights reserved.
