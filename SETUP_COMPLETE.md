# 🔧 ПОЛНАЯ ИНСТРУКЦИЯ ПО НАСТРОЙКЕ ETHOSLIFE

## ✅ Шаг 1: Vercel (Фронтенд)

### 1.1 Подключите репозиторий
1. Зайдите на https://vercel.com/new
2. Нажмите **"Import Git Repository"**
3. Выберите репозиторий `EthosLife`

### 1.2 Настройте проект
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 1.3 Environment Variables
Нажмите **"Environment Variables"** → **"Add"**

```env
# Обязательно
VITE_API_URL=https://ethoslife.onrender.com

# Опционально (Google OAuth)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 1.4 Deploy
Нажмите **"Deploy"**

**После деплоя:**
- Запишите ваш URL: `https://ethoslife-xxxx.vercel.app`
- Проверьте что главная страница грузится

---

## ✅ Шаг 2: Render (API + База Данных)

### 2.1 Создайте базу данных
1. Зайдите на https://dashboard.render.com
2. Нажмите **"New +"** → **"Database"**
3. Заполните:
   ```
   Name: ethoslife-db
   Database: ethoslife
   User: ethoslife
   Plan: Free
   Region: (выберите ближайший)
   ```
4. Нажмите **"Create Database"**
5. **Скопируйте External Database URL** (выглядит как):
   ```
   postgresql://ethoslife:xxxxx@ep-xxx-xxx.us-east-2.aws.neon.tech/ethoslife?sslmode=require
   ```

### 2.2 Создайте Web Service
1. Нажмите **"New +"** → **"Web Service"**
2. Выберите репозиторий `EthosLife`
3. Заполните:
   ```
   Name: ethoslife-api
   Region: (тот же что у БД)
   Branch: main
   Root Directory: (оставьте пустым)
   Runtime: Node
   Build Command: chmod +x build.sh && ./build.sh
   Start Command: npm start
   Instance Type: Free
   ```

### 2.3 Environment Variables
Нажмите **"Advanced"** → **"Add Environment Variable"**

```env
# Обязательно
NODE_ENV=production
DATABASE_URL=(ваш URL из шага 2.1)
PGSSLMODE=no-verify
CORS_ORIGIN=https://ethoslife-*.vercel.app,http://localhost:3000

# Секреты (скопируйте из раздела ниже)
JWT_SECRET=803283eccb360085add806d2a8b5e3b6c9fa39659f7be0230b4ac41942f977ce
JWT_REFRESH_SECRET=7bbf0d29e0f399ba1c2621a190158c758e9087a1c794abea3bca5e6164b35a65
ADMIN_KEY=549b6887f62a401e0870d2880ab24a53

# Опционально (Telegram)
TELEGRAM_BOT_TOKEN=
FOUNDER_CHAT_ID=
ADMIN_CHAT_IDS=

# Опционально (Google OAuth)
GOOGLE_CLIENT_ID=
```

### 2.4 Deploy
Нажмите **"Create Web Service"**

---

## 🔐 Сгенерированные Секреты

### Скопируйте в Render:

```env
# JWT Secrets
JWT_SECRET=803283eccb360085add806d2a8b5e3b6c9fa39659f7be0230b4ac41942f977ce
JWT_REFRESH_SECRET=7bbf0d29e0f399ba1c2621a190158c758e9087a1c794abea3bca5e6164b35a65

# Admin Key
ADMIN_KEY=549b6887f62a401e0870d2880ab24a53
```

---

## 📊 Как получить дополнительные переменные

### Telegram Bot Token:
1. Откройте @BotFather в Telegram
2. Отправьте `/newbot`
3. Введите имя бота (например: `EthosLife Bot`)
4. Введите username (например: `ethoslife_bot`)
5. Скопируйте токен → `TELEGRAM_BOT_TOKEN`

### Telegram Chat ID:
1. Отправьте сообщение своему боту
2. Откройте: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Найдите `"chat":{"id":123456789}`
4. Это ваш `FOUNDER_CHAT_ID`

### Google OAuth Client ID:
1. https://console.cloud.google.com
2. Create Project → "EthosLife"
3. APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   ```
   https://ethoslife.onrender.com/api/auth/google
   https://ethoslife-*.vercel.app/api/auth/google
   ```
7. Скопируйте Client ID → `GOOGLE_CLIENT_ID`

---

## ✅ Шаг 3: Проверка

### Vercel:
1. Откройте `https://ethoslife-xxxx.vercel.app`
2. Должна загрузиться главная страница
3. Нет ошибок в консоли (F12)
4. Все ссылки работают

### Render:
1. Откройте `https://ethoslife.onrender.com/api/health`
2. Должно вернуть:
   ```json
   {"status":"ok","timestamp":"...","currentPrice":0.05}
   ```
3. В логах нет ошибок CORS

### Связка:
1. На Vercel откройте меню (бургер)
2. Нажмите "Open V1 Version"
3. Должен открыться Render

---

## 🚨 Troubleshooting

### Ошибка: "Database connection failed"
```
Решение:
1. Проверьте DATABASE_URL в Render
2. Убедитесь что база существует
3. Проверьте PGSSLMODE=no-verify
```

### Ошибка: "CORS error"
```
Решение:
1. Проверьте CORS_ORIGIN включает ваш Vercel URL
2. Формат: https://ethoslife-*.vercel.app
```

### Ошибка: "React #426"
```
Решение:
1. Очистите кэш Vercel
2. Сделайте Redeploy
3. Очистите кэш браузера (Ctrl+Shift+R)
```

### Ошибка: "404 Not Found"
```
Решение:
1. Проверьте что frontend/dist существует
2. Проверьте build.sh выполнился
3. Проверьте верный Root Directory в Vercel
```

---

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи в Vercel → Deployments → [Latest] → Logs
2. Проверьте логи в Render → Logs
3. Проверьте Environment Variables в обоих сервисах

---

**После настройки - всё должно работать автоматически!** 🚀
