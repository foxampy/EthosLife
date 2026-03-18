# EthosLife - Unified Health Ecosystem 🌍

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/foxampy/EthosLife)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/foxampy/EthosLife&project-name=ethoslife-frontend&repository-name=ethoslife-frontend&root-directory=frontend)

**Comprehensive Health Operating System for Individuals & Humanity**

🌐 **Live Demo**: https://ethoslife.vercel.app  
📚 **Documentation**: See [docs/](./docs/)

---

## ✨ What is EthosLife?

EthosLife is a **unified health ecosystem** that combines:

- 🤖 **AI Health Coach** (Qwen API) - 24/7 personalized guidance
- 📊 **7 Health Modules** - nutrition, movement, sleep, psychology, medicine, relationships, habits
- 💬 **Social Network** - share progress, find support, build community
- 🏥 **Specialists & Centers** - marketplace for health professionals
- 🪴 **DAO Governance** - community-driven development
- 💰 **Tokenomics** ($UNITY) - rewards for healthy lifestyle
- 🔄 **Cashback & Rewards** - earn while staying healthy
- 🌐 **25 Languages** - global accessibility

**This is not just an app.** It's a complete health operating system where:
- Every aspect of health is connected
- Data from one module influences recommendations in others
- The community supports your journey
- Specialists help when you need expertise
- Tokens motivate and reward your progress

---

## 🚀 Quick Deploy

### Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/foxampy/EthosLife&project-name=ethoslife-frontend&repository-name=ethoslife-frontend&root-directory=frontend)

**Important:** Set Root Directory to `frontend` in Vercel Dashboard

### Render (Backend)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/foxampy/EthosLife)

---

## 📁 Project Structure

```
EthosLife/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/     # All pages (Landing, Dashboard, Health, etc.)
│   │   ├── components/# UI components, widgets, layouts
│   │   ├── store/     # Zustand stores (auth, health, cart, products, ui)
│   │   ├── routes/    # Unified routing
│   │   └── i18n/      # 25 languages
│   └── vercel.json    # Vercel configuration
├── server.js          # Express backend
├── routes/            # API routes
├── controllers/       # Business logic
├── services/          # Services (Telegram, Stripe, etc.)
├── migrations/        # Database migrations
├── docs/              # Documentation
│   ├── PITCH_DECK_RU.md
│   ├── ENVIRONMENT_VARIABLES_GUIDE.md
│   └── ...
├── vercel.json        # Vercel config (ROOT)
└── render.yaml        # Render configuration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **State** | Zustand (5 stores: auth, health, cart, products, ui) |
| **Routing** | React Router v6 |
| **i18n** | i18next (25 languages) |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **AI** | Qwen API (Alibaba) |
| **Auth** | JWT, Google OAuth, Telegram Login |
| **Payments** | Stripe |
| **Web3** | Ethers.js, Alchemy |
| **Deploy** | Vercel (frontend), Render (backend) |

---

## 📊 Features

### Health Modules (7 Directions)
1. **Nutrition** - Calorie tracking, macros, water, recipes
2. **Movement** - Workouts, activity, GPS tracking
3. **Sleep** - Sleep phases, quality, smart alarm
4. **Psychology** - Mood tracking, stress management, meditation
5. **Medicine** - Medical records, medications, telemedicine
6. **Relationships** - Social connections, family health
7. **Habits** - Habit tracker, streaks, visualization

### AI & Social
- **AI Chat Unified** - 6 AI personas (Dr. Wellness, FitCoach, NutriBot, etc.)
- **Social Feed** - Share progress, likes, comments
- **Challenges** - Individual and group challenges
- **Leaderboards** - Compete with community

### Marketplace
- **Specialists** - Nutritionists, trainers, psychologists
- **Centers** - Gyms, clinics, SPA salons
- **Products** - Health products with reviews
- **Cart & Checkout** - Full e-commerce

### Tokenomics
- **Move-to-Earn** - Tokens for steps and workouts
- **Learn-to-Earn** - Tokens for health education
- **Social-to-Earn** - Tokens for content and referrals
- **Stake-to-Earn** - Passive income (12-25% APY)

---

## 🚀 Quick Start

### Frontend (Vercel)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Render)
```bash
npm install
npm run dev
```

### Environment Variables
See [docs/ENVIRONMENT_VARIABLES_GUIDE.md](./docs/ENVIRONMENT_VARIABLES_GUIDE.md)

**Required (minimum):**
```env
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=32+ characters
JWT_REFRESH_SECRET=32+ characters
PGSSLMODE=require
QWEN_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Frontend
VITE_API_URL=https://your-api.onrender.com/api
```

---

## 📚 Documentation

- **[Pitch Deck (RU)](./docs/PITCH_DECK_RU.md)** - Complete ecosystem presentation
- **[Environment Variables](./docs/ENVIRONMENT_VARIABLES_GUIDE.md)** - All 44+ variables
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Full architecture
- **[Mobile Optimization](./docs/MOBILE_OPTIMIZATION.md)** - Mobile-first design
- **[Deployment Guide](./docs/DEPLOY_SCRIPT.md)** - Step-by-step deploy

---

## 🎯 Mission

**EthosLife's mission** is to make healthy lifestyle accessible, understandable, and rewarding for every person on the planet.

**Our vision** is a world where every person lives long, healthy, and happy.

---

## 📞 Links

- **GitHub:** https://github.com/foxampy/EthosLife
- **Vercel:** https://vercel.com
- **Render:** https://render.com

---

© 2026 EthosLife. All rights reserved.
