# 🚨 Render Deploy Troubleshooting

**Дата:** 6 марта 2026  
**Проблема:** Не видно деплой в Render Dashboard

---

## 🔍 ВОЗМОЖНЫЕ ПРИЧИНЫ

### 1. Auto Deploy отключён в Render

**Решение:**
1. Зайти на https://dashboard.render.com/
2. Выбрать сервис `ethoslife-web`
3. Проверить **Settings → Auto Deploy** (должен быть **On**)
4. Если **Off** → включить

---

### 2. Render не подключён к репозиторию

**Решение:**
1. Зайти на https://dashboard.render.com/
2. Нажать **New +** → **Blueprint**
3. Connect репозиторий: `foxampy/EthosLife`
4. Выбрать `render.yaml` конфигурацию
5. Deploy

---

### 3. Деплой уже идёт (просто медленно)

**Проверка:**
1. https://dashboard.render.com/
2. Выбрать сервис
3. Проверить **Logs** → **Deploy**
4. Статус: **Building** / **Deploying** / **Live**

**Время деплоя:** 2-5 минут (иногда до 10 мин)

---

### 4. Ошибка в render.yaml

**Проверка:**
```yaml
# frontend сервис
- type: web
  name: ethoslife-web
  runtime: static
  buildCommand: cd frontend && npm install && npm run build
  staticPublishPath: ./frontend/build
  autoDeploy: true  # ← Проверить!
```

**Потенциальные проблемы:**
- ❌ Неправильный `buildCommand`
- ❌ Неправильный `staticPublishPath`
- ❌ Отсутствует `autoDeploy: true`

---

### 5. GitHub Webhook не настроен

**Решение:**
1. GitHub → Репозиторий → **Settings** → **Webhooks**
2. Должен быть webhook от Render
3. Если нет → переподключить в Render Dashboard

---

## ✅ РУЧНОЙ ДЕПЛОЙ (если авто не работает)

### Опция 1: Manual Deploy через Render Dashboard

1. https://dashboard.render.com/
2. Выбрать сервис `ethoslife-web`
3. Нажать **Manual Deploy** → **Deploy latest commit**
4. Ждать 2-5 минут

### Опция 2: Переподключить репозиторий

1. Render Dashboard → сервис
2. **Settings** → **Disconnect**
3. **New +** → **Blueprint**
4. Connect `foxampy/EthosLife`
5. Выбрать `render.yaml`
6. **Apply**

### Опция 3: CLI Deploy (альтернатива)

```bash
# Установить Render CLI
npm install -g @render-cloud/cli

# Логин
render login

# Деплой
render deploy ethoslife-web
```

---

## 📊 ПРОВЕРКА СТАТУСА

### 1. Проверить GitHub Actions

https://github.com/foxampy/EthosLife/actions

Должны быть:
- ✅ Коммит `32d6fae`
- ✅ Статус **Success** или **In Progress**

### 2. Проверить Render Logs

https://dashboard.render.com/

1. Выбрать сервис
2. **Logs** → **Deploy**
3. Искать:
   ```
   Building...
   Installing dependencies...
   Build succeeded!
   Deploying...
   Live!
   ```

### 3. Проверить URL

**Web:** https://ethoslife-web.onrender.com  
**API:** https://ethoslife-api.onrender.com/api/health

Если работает → деплой успешен!

---

## 🔧 FIX: Обновить render.yaml

Если проблемы продолжаются, заменить `render.yaml`:

```yaml
services:
  - type: web
    name: ethoslife-api
    runtime: node
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    rootDir: .
    healthCheckPath: /api/health
    autoDeploy: true  # ← Критично!
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: ethoslife-db
          property: connectionString

  - type: web
    name: ethoslife-web
    runtime: static
    plan: starter
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/build
    autoDeploy: true  # ← Критично!
    envVars:
      - key: REACT_APP_API_URL
        value: https://ethoslife-api.onrender.com/api

databases:
  - name: ethoslife-db
    plan: free
    databaseName: ethoslife
    user: ethoslife
```

---

## 📞 СЛЕДУЮЩИЕ ШАГИ

1. **Проверить Render Dashboard**  
   https://dashboard.render.com/

2. **Проверить статус деплоя**  
   Logs → Deploy → Status

3. **Если нет деплоя:**  
   - Manual Deploy из Render Dashboard
   - Или переподключить репозиторий

4. **После деплоя:**  
   - Проверить https://ethoslife-web.onrender.com/
   - Протестировать все 40+ страниц
   - Проверить бургер-меню

---

## 🎯 БЫСТРАЯ ПРОВЕРКА

```bash
# 1. Проверить последний коммит
git log -1 --oneline

# 2. Проверить отправку на GitHub
git push origin main --dry-run

# 3. Проверить статус
git status
```

**Ожидаемый результат:**
```
32d6fae feat: Add 28 new V1 pages with guest access for investor demo
```

---

**© 2026 EthosLife Inc.**  
*Deploy troubleshooting guide*
