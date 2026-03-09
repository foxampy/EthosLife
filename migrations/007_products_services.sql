-- Migration 007: Products, Services, Specialists, Centers

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- supplements, wearables, fitness, books
  type VARCHAR(20), -- physical, digital
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  stock_quantity INTEGER,
  sku VARCHAR(100),
  images TEXT[],
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Specialists table
CREATE TABLE IF NOT EXISTS specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specializations TEXT[], -- nutrition, fitness, mental_health, etc
  credentials TEXT,
  languages TEXT[],
  years_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  availability JSONB, -- schedule
  rating DECIMAL(2,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_specialists_user ON specialists(user_id);
CREATE INDEX IF NOT EXISTS idx_specialists_verified ON specialists(is_verified);
CREATE INDEX IF NOT EXISTS idx_specialists_active ON specialists(is_active);
CREATE INDEX IF NOT EXISTS idx_specialists_specializations ON specialists USING GIN(specializations);

-- Specialist reviews
CREATE TABLE IF NOT EXISTS specialist_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultation_id UUID,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_specialist_reviews_specialist ON specialist_reviews(specialist_id);
CREATE INDEX IF NOT EXISTS idx_specialist_reviews_client ON specialist_reviews(client_id);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID REFERENCES specialists(id),
  client_id UUID REFERENCES users(id),
  type VARCHAR(20), -- video, chat, in_person
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10,2),
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_specialist ON consultations(specialist_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultations_client ON consultations(client_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- Centers table
CREATE TABLE IF NOT EXISTS centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- gym, spa, clinic, wellness_center
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  coordinates POINT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  photos TEXT[],
  services JSONB,
  amenities TEXT[],
  rating DECIMAL(2,1) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_centers_type ON centers(type);
CREATE INDEX IF NOT EXISTS idx_centers_city ON centers(city);
CREATE INDEX IF NOT EXISTS idx_centers_coordinates ON centers USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_centers_active ON centers(is_active);

-- Center bookings table
CREATE TABLE IF NOT EXISTS center_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES centers(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255),
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER,
  price DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_center_bookings_center ON center_bookings(center_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_center_bookings_user ON center_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_center_bookings_status ON center_bookings(status);

-- Wishlists/Favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(50), -- product, specialist, center
  item_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item ON user_favorites(item_type, item_id);
