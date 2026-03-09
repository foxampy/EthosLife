-- Migration 005: Extended Health Data Tables

-- Daily metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Activity
  steps INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  distance_meters DECIMAL(8,2) DEFAULT 0,
  
  -- Sleep
  sleep_duration_minutes INTEGER,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_deep_minutes INTEGER,
  sleep_rem_minutes INTEGER,
  
  -- Heart
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  min_heart_rate INTEGER,
  
  -- Weight
  weight_kg DECIMAL(5,2),
  body_fat_percent DECIMAL(5,2),
  
  -- Water
  water_ml INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user ON mood_entries(user_id, created_at DESC);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50), -- health, fitness, sleep, mental
  frequency VARCHAR(20), -- daily, weekly, custom
  target_count INTEGER DEFAULT 1,
  reminder_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);

-- Habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user ON habit_completions(user_id, completed_at DESC);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50), -- cardio, strength, yoga, etc
  duration_minutes INTEGER,
  calories_burned INTEGER,
  intensity VARCHAR(20), -- low, medium, high
  exercises JSONB,
  notes TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  meal_type VARCHAR(20), -- breakfast, lunch, dinner, snack
  calories INTEGER,
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fat_g DECIMAL(6,2),
  fiber_g DECIMAL(6,2),
  photo_url TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meals_type ON meals(meal_type);

-- Trigger for updated_at on daily_metrics
DROP TRIGGER IF EXISTS update_daily_metrics_updated_at ON daily_metrics;
CREATE TRIGGER update_daily_metrics_updated_at
    BEFORE UPDATE ON daily_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
