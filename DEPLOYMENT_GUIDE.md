# EthosLife Deployment Guide
## Split Deployment: Render (API) + Vercel (Frontend)

---

## 🚀 Быстрый старт

### 1. Деплой API на Render

1. Зайди на [render.com](https://render.com)
2. **New → Blueprint**
3. Выбери свой GitHub репозиторий `foxampy/EthosLife`
4. Render автоматически использует `render.yaml`
5. Нажми **Apply**
6. Дождись деплоя (2-3 минуты)
7. Получи URL: `https://ethoslife-api.onrender.com`

### 2. Деплой Frontend на Vercel

1. Зайди на [vercel.com](https://vercel.com)
2. **Add New Project**
3. Импортируй GitHub репозиторий
4. **Framework Preset:** Vite
5. **Root Directory:** `frontend`
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Добавь Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://ethoslife-api.onrender.com/api`
9. Нажми **Deploy**

---

## 📁 Структура проекта

```
EthosLife/
├── server.js              # API сервер (Render)
├── render.yaml            # Конфиг Render
├── frontend/              # React приложение (Vercel)
│   ├── vercel.json       # Конфиг Vercel
│   ├── vite.config.ts
│   └── src/
└── DEPLOYMENT_GUIDE.md   # Этот файл
```

---

## 🔗 URLs после деплоя

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | `https://ethoslife.vercel.app` | React приложение |
| **API** | `https://ethoslife-api.onrender.com` | Node.js API |
| **Health** | `https://ethoslife-api.onrender.com/api/health` | Проверка API |
| **SAFT** | `https://ethoslife-api.onrender.com/saft` | Форма инвестора |

---

## ⚡ Почему так лучше?

### Vercel vs Render для фронтенда:

| Фича | Vercel | Render (Free) |
|------|--------|---------------|
| **Cold Start** | ❌ Нет (мгновенно) | ✅ 30-60 секунд |
| **CDN** | ✅ Глобальный | ❌ Только регион |
| **Edge Network** | ✅ 100+ локаций | ❌ Нет |
| **Preview Deploys** | ✅ Авто на PR | ❌ Нет |
| **Analytics** | ✅ Встроено | ❌ Нет |

### Render для API:
- ✅ Node.js + PostgreSQL
- ✅ WebSockets
- ✅ Cron jobs
- ✅ Background workers

---

## 🔄 Автодеплой

### При пуше в main:
1. **Vercel** - автоматически деплоит фронтенд (30 сек)
2. **Render** - автоматически деплоит API (2-3 мин)

### При PR:
- **Vercel** создает Preview URL
- Можно тестировать изменения до мержа

---

## 🛠 Локальная разработка

```bash
# 1. Запуск API
npm install
npm run dev
# API на http://localhost:3001

# 2. Запуск Frontend (в новом терминале)
cd frontend
npm install
cp .env.example .env.local
# Отредактируй .env.local: VITE_API_URL=http://localhost:3001/api
npm run dev
# Frontend на http://localhost:5173
```

---

## 🔧 Troubleshooting

### CORS ошибки:
Проверь `CORS_ORIGIN` в Render Environment Variables:
```
https://ethoslife.vercel.app,https://ethoslife-git-*.vercel.app
```

### API не отвечает:
1. Проверь `https://ethoslife-api.onrender.com/api/health`
2. Проверь логи в Render Dashboard

### Frontend не подключается к API:
1. Проверь `VITE_API_URL` в Vercel Environment Variables
2. Передеплой фронтенд

---

## 📝 Дополнительно

### Кастомный домен:
- **Vercel:** Settings → Domains → Add
- **Render:** Settings → Custom Domains → Add

### Environment Variables:

**Render (API):**
```
NODE_ENV=production
CORS_ORIGIN=https://ethoslife.vercel.app
DATABASE_URL=...
JWT_SECRET=...
```

**Vercel (Frontend):**
```
VITE_API_URL=https://ethoslife-api.onrender.com/api
```

---

## ✅ Чеклист деплоя

- [ ] API деплой на Render
- [ ] Frontend деплой на Vercel
- [ ] CORS настроен
- [ ] Environment Variables добавлены
- [ ] Health check работает
- [ ] SAFT форма доступна
- [ ] Авторизация работает
- [ ] Все страницы открываются
