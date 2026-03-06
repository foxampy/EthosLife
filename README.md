# EthosLife SAFT Platform 🌍

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Multi-language investment platform for EthosLife Seed Round**

🌐 **Supported Languages:** English, Español, Deutsch, Polski, עברית, العربية, Русский, 한국어, 日本語, 中文

## ✨ Features

- 🚀 **Dynamic Pricing**: Token price increases from $0.01 to $0.05 until March 10, 2025 01:00 UTC
- ⏱️ **Price Freeze**: 1-hour price lock after SAFT submission
- 🤖 **Telegram Bot**: Instant notifications with PDF documents
- 🗄️ **PostgreSQL Database**: Persistent storage for submissions & analytics
- 📄 **PDF Generation**: Automatic SAFT document creation
- 🌍 **10 Languages**: Full internationalization support
- ✅ **Smart Validation**: Client & server-side validation
- 📊 **Analytics**: Visit tracking & conversion metrics

## 🚀 Quick Start

```bash
# 1. Clone & setup
git clone https://github.com/YOUR_USERNAME/ethoslife-saft.git
cd ethoslife-saft
./setup.sh  # or setup.bat on Windows

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Run
npm start
```

Open http://localhost:3000

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Bot | node-telegram-bot-api |
| Frontend | Vanilla JS, CSS3 |
| I18n | Custom JSON-based |
| Deploy | Render |

## 📁 Project Structure

```
├── server.js              # Express API + Telegram bot
├── database.js            # PostgreSQL models
├── pdf-generator.js       # SAFT document generation
├── public/
│   ├── index.html         # Main SAFT form
│   └── i18n.js            # Translations (10 languages)
├── render.yaml            # Render deployment config
└── .env.example           # Environment template
```

## 🌍 Languages

| Code | Language | Flag | Direction |
|------|----------|------|-----------|
| en | English | 🇺🇸 | LTR |
| es | Español | 🇪🇸 | LTR |
| de | Deutsch | 🇩🇪 | LTR |
| pl | Polski | 🇵🇱 | LTR |
| he | עברית | 🇮🇱 | RTL |
| ar | العربية | 🇸🇦 | RTL |
| ru | Русский | 🇷🇺 | LTR |
| ko | 한국어 | 🇰🇷 | LTR |
| ja | 日本語 | 🇯🇵 | LTR |
| zh | 中文 | 🇨🇳 | LTR |

## 📊 Pricing Algorithm

```
Start: Now              → $0.01
End: Mar 10, 01:00 UTC  → $0.05

Formula:
price = $0.01 + ($0.05 - $0.01) × (elapsed / total_duration)

After submission: Frozen for 1 hour
```

## 🔐 Security

- ✅ Telegram token in environment variables only
- ✅ Input validation on client & server
- ✅ SQL injection protection via parameterized queries
- ✅ Admin authentication required for sensitive endpoints

## 📞 Support

- **Telegram**: @ethoslife_bot
- **Email**: hello@ethoslife.com

---

© 2026 EthosLife Inc. All rights reserved.
