# Настройка Supabase для NexusVita

## Шаг 1: Получить API ключи

1. Открой https://app.supabase.com
2. Выбери свой проект
3. Перейди в **Project Settings** (шестеренка слева)
4. В меню слева выбери **Data API**
5. Скопируй:
   - `URL` → это `SUPABASE_URL`
   - `service_role secret` → это `SUPABASE_SERVICE_KEY`

⚠️ **Важно:** `service_role` ключ, не `anon`! Он дает полный доступ.

---

## Шаг 2: Выполнить SQL миграции

1. В Supabase Dashboard перейди в **SQL Editor** (слева)
2. Нажми **New query**
3. Скопируй содержимое файла `server/supabase/migrations/001_initial_schema.sql`
4. Вставь в редактор
5. Нажми **Run**
6. Повтори для `002_health_modules.sql`

---

## Шаг 3: Настроить Storage (для загрузки файлов)

1. Перейди в **Storage** (слева)
2. Нажми **New bucket**
3. Создай два bucket:
   - Название: `images`, Public: ✅ ON
   - Название: `videos`, Public: ✅ ON
4. Для каждого bucket настрой Policies:
   - Нажми на bucket → **Policies**
   - **New policy** → **For full customization**
   - Policy name: `Allow uploads`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `true`
   - **Save policy**
   
   Повтори для `SELECT` (чтение) тоже с `true`

---

## Шаг 4: Настроить Authentication

1. Перейди в **Authentication** (слева)
2. В меню выбери **URL Configuration**
3. Добавь Site URL:
   - Для локальной разработки: `http://localhost:5173`
   - Для продакшена: `https://your-render-app.onrender.com`
4. В **Redirect URLs** добавь:
   - `http://localhost:5173/**`
   - `https://your-render-app.onrender.com/**`

---

## Шаг 5: Создать функции (для счетчиков)

В SQL Editor выполни:

```sql
-- Функция для инкремента AI usage
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_usage (user_id, date, count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET count = ai_usage.count + 1;
END;
$$ LANGUAGE plpgsql;

-- Функция для добавления токенов
CREATE OR REPLACE FUNCTION add_token_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE user_tokens
  SET balance = balance + p_amount,
      total_earned = total_earned + p_amount
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Шаг 6: Добавить переменные в Render

1. Открой https://dashboard.render.com
2. Выбери свой Web Service
3. Перейди во вкладку **Environment**
4. Добавь переменные:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-generated-secret
```

---

## Шаг 7: Генерация JWT Secret

Открой терминал и выполни:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Скопируй результат в `JWT_SECRET`

---

## Проверка

После настройки протестируй:

1. Регистрация: `POST /api/auth/register`
2. Логин: `POST /api/auth/login`
3. AI Chat: `POST /api/ai/chat`

Всё должно работать!
