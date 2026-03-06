-- Migration 002: Create health-related tables

-- Health profiles
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  birth_date DATE,
  gender VARCHAR(10),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  blood_type VARCHAR(5),
  activity_level VARCHAR(20), -- sedentary, light, moderate, active
  sleep_hours_avg DECIMAL(3,1),
  smoking_status VARCHAR(20),
  alcohol_frequency VARCHAR(20),
  conditions JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  surgeries JSONB DEFAULT '[]',
  family_history JSONB DEFAULT '[]',
  goals JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_profiles_user ON health_profiles(user_id);

-- Health metrics (time series)
CREATE TABLE IF NOT EXISTS health_metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- weight, sleep, bp, hr, steps, etc.
  metric_type VARCHAR(50) NOT NULL, -- systolic, diastolic, weight, etc.
  value DECIMAL(10,3) NOT NULL,
  unit VARCHAR(20),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(20) DEFAULT 'manual', -- manual, device, import
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_metrics_user_category ON health_metrics(user_id, category, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_user_type ON health_metrics(user_id, metric_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_recorded ON health_metrics(recorded_at);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- weight, sleep, fitness, nutrition
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_type VARCHAR(20), -- numeric, boolean, habit
  target_value DECIMAL(10,3),
  current_value DECIMAL(10,3) DEFAULT 0,
  unit VARCHAR(20),
  start_date DATE,
  deadline DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
  reminder_frequency VARCHAR(20), -- daily, weekly
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);

-- Symptoms tracking
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symptom VARCHAR(100) NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  body_part VARCHAR(50),
  description TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  related_factors JSONB DEFAULT '[]', -- food, activity, stress, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_symptoms_user ON symptoms(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_symptoms_created ON symptoms(created_at DESC);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_health_profiles_updated_at ON health_profiles;
CREATE TRIGGER update_health_profiles_updated_at
    BEFORE UPDATE ON health_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
