# 🚀 Vercel Frontend Deployment

## ✅ Деплой Фронтенда на Vercel (Бесплатно)

### Шаг 1: Подключите репозиторий к Vercel

1. Зайдите на https://vercel.com
2. Нажмите **"Add New Project"**
3. Выберите **"Import Git Repository"**
4. Выберите репозиторий `EthosLife`
5. **Важно:** Укажите настройки:

### Шаг 2: Настройки Vercel

```
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Шаг 3: Environment Variables (необязательно)

```
VITE_API_URL=https://ethoslife.onrender.com
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Шаг 4: Deploy!

Нажмите **"Deploy"** - Vercel автоматически соберёт и задеплоит фронтенд.

### Шаг 5: Проверка

После деплоя откройте:
- `https://ethoslife-xxxx.vercel.app`

Фронтенд будет работать быстро через CDN Vercel!

---

## 🔗 Подключение к API на Render

Фронтенд на Vercel будет обращаться к API на Render:

```
API URL: https://ethoslife.onrender.com
```

Все API запросы будут идти на Render, а статика (HTML, CSS, JS) раздаётся через Vercel.

---

## ⚡ Преимущества

✅ **Vercel:**
- Бесплатно
- Быстрый CDN (50-100ms загрузка)
- Автоматический HTTPS
- Preview деплои для каждого PR
- Нет проблем с билдом

✅ **Render:**
- Только API (быстрее работает)
- База данных включена
- Меньше нагрузка = быстрее пробуждение

---

## 🔧 Если нужны изменения

После каждого коммита в `main`:
1. Vercel автоматически пересоберёт фронтенд
2. Render автоматически пересоберёт API

Оба сервиса работают в режиме **auto-deploy**!
