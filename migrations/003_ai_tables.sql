-- Migration 003: Create AI and chat tables

-- AI conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  context_summary TEXT,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id, updated_at DESC);

-- AI messages
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model VARCHAR(50),
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

-- Knowledge base for RAG
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50), -- nutrition, fitness, sleep, mental, medical
  title VARCHAR(255),
  content TEXT NOT NULL,
  source VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_chunks(category);

-- User context snapshots (for AI personalization)
CREATE TABLE IF NOT EXISTS user_context_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL, -- aggregated health data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_context_snapshots_user ON user_context_snapshots(user_id, created_at DESC);

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  request_type VARCHAR(50), -- chat, advice, plan
  model VARCHAR(50),
  tokens_input INTEGER,
  tokens_output INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage(user_id, created_at);

-- Insert initial knowledge base data
INSERT INTO knowledge_chunks (category, title, content, source) VALUES
('nutrition', 'Healthy Eating Basics', 
'A balanced diet includes proteins, carbohydrates, fats, vitamins, and minerals. Aim for 5 servings of fruits and vegetables daily.',
'WHO Guidelines'),
('fitness', 'Exercise Recommendations',
'Adults should get at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week.',
'CDC Guidelines'),
('sleep', 'Sleep Hygiene',
'Maintain a consistent sleep schedule, avoid screens before bed, keep bedroom cool and dark. Aim for 7-9 hours nightly.',
'National Sleep Foundation'),
('mental', 'Stress Management',
'Practice mindfulness, deep breathing, regular exercise, and maintain social connections to manage stress effectively.',
'APA Guidelines')
ON CONFLICT DO NOTHING;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER update_ai_conversations_updated_at
    BEFORE UPDATE ON ai_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
