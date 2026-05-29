-- supabase/migrations/20260529_planner.sql

-- ───────────────── reminders ─────────────────
CREATE TABLE IF NOT EXISTS public.reminders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  title          text NOT NULL,
  description    text,
  category       text NOT NULL DEFAULT 'custom',
  emoji          text,
  scheduled_at   timestamptz,
  repeat_rule    jsonb NOT NULL DEFAULT '{"type":"none","interval":1,"days_of_week":[],"days_of_month":[],"times_per_day":1,"times":[],"every_n_hours":null,"working_days_only":false,"end_date":null,"max_occurrences":null}'::jsonb,
  ai_message     text,
  is_active      boolean NOT NULL DEFAULT true,
  color          text,
  linked_goal_id uuid,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders_user" ON public.reminders
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── tasks ─────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  title          text NOT NULL,
  description    text,
  category       text,
  priority       int NOT NULL DEFAULT 2,
  status         text NOT NULL DEFAULT 'active',
  due_date       date,
  reminder_id    uuid REFERENCES public.reminders(id) ON DELETE SET NULL,
  linked_goal_id uuid,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_user" ON public.tasks
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── push_subscriptions ─────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text NOT NULL,
  endpoint   text NOT NULL UNIQUE,
  p256dh     text NOT NULL,
  auth       text NOT NULL,
  ua_hint    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push_subs_user" ON public.push_subscriptions
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── notifications ─────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       text NOT NULL,
  reminder_id   uuid REFERENCES public.reminders(id) ON DELETE SET NULL,
  title         text,
  body          text,
  ai_message    text,
  action_url    text,
  snoozed_until timestamptz,
  done_at       timestamptz,
  read_at       timestamptz,
  sent_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_user" ON public.notifications
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
