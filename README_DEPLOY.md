# EthosLife SAFT Platform

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Interactive SAFT (Simple Agreement for Future Tokens) platform for EthosLife Seed Round with dynamic pricing and Telegram integration.

## Features

- 🚀 **Dynamic Pricing**: Token price increases hourly from $0.01 to $0.05
- ⏱️ **Price Freeze**: 1-hour price lock after form submission
- 🤖 **Telegram Bot**: Automatic notifications to founder
- 📄 **Interactive SAFT**: Web-based form with real-time calculations
- 🔔 **Real-time Updates**: Live countdown and price updates

## Pricing Schedule

| Date | Price |
|------|-------|
| Now | $0.0100 |
| March 10, 01:00 UTC | $0.0500 |

Price increases linearly between these points.

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/ethoslife-saft.git
cd ethoslife-saft
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Telegram bot token and chat ID
```

### 3. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

### Deploy to Render (Recommended)

1. Fork this repository
2. Connect to [Render](https://render.com)
3. Add environment variables
4. Deploy!

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `FOUNDER_CHAT_ID` | Telegram chat ID for notifications |
| `ADMIN_KEY` | Secret key for admin access |

## Telegram Bot Setup

1. Message [@BotFather](https://t.me/BotFather)
2. Create bot with `/newbot`
3. Copy token to `TELEGRAM_BOT_TOKEN`
4. Message your bot
5. Get chat ID from bot updates

## API

### Get Current Price
```bash
GET /api/price
```

### Submit SAFT
```bash
POST /api/submit-saft
Content-Type: application/json

{
  "sessionId": "...",
  "investmentAmount": 10000,
  "investorData": { ... }
}
```

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Bot**: node-telegram-bot-api
- **Deploy**: Render

## License

Private - EthosLife Team
