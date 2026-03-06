# Настройка Telegram бота на Vercel

## Шаг 1: Получить токен бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot` или используйте существующего бота
3. Скопируйте токен бота (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Добавить токен в Vercel

1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: вставьте токен бота из BotFather
   - **Environment**: выберите Production, Preview, Development (или все)
4. Нажмите **Save**

## Шаг 3: Настроить Webhook

После деплоя на Vercel:

1. Получите URL вашего проекта (например: `https://your-project.vercel.app`)
2. Откройте [@BotFather](https://t.me/BotFather)
3. Отправьте команду:
   ```
   /setwebhook
   ```
4. Затем отправьте URL webhook:
   ```
   https://your-project.vercel.app/api/telegram/webhook
   ```
5. BotFather должен ответить, что webhook установлен

## Шаг 4: Проверить работу

1. Найдите вашего бота в Telegram
2. Отправьте команду `/start`
3. Бот должен ответить приветствием

## Проверка webhook

Чтобы проверить, что webhook работает:

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/getwebhookinfo`
3. Должен быть показан ваш URL webhook

## Персональные приветствия

Бот автоматически распознает пользователей по Telegram ID:
- `403161451` - Мария (персональное приветствие)
- `8530599793` - Запасной аккаунт (персональное приветствие)
- Остальные - стандартное приветствие

## Устранение проблем

### Бот не отвечает

1. Проверьте, что `TELEGRAM_BOT_TOKEN` добавлен в Environment Variables
2. Проверьте, что webhook установлен правильно
3. Проверьте логи в Vercel Dashboard → Deployments → Functions

### Ошибка аутентификации в Web App

1. Убедитесь, что база данных настроена (`DATABASE_URL` в Environment Variables)
2. Проверьте, что приложение открывается через Telegram бота (не напрямую в браузере)
3. Проверьте консоль браузера (F12) на ошибки

### Webhook не работает

1. Убедитесь, что URL правильный: `https://your-project.vercel.app/api/telegram/webhook`
2. Проверьте, что проект задеплоен на Vercel
3. Попробуйте переустановить webhook через BotFather
