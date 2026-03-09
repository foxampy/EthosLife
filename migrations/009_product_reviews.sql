-- Migration 009: Product Reviews and User Cashback

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  is_public BOOLEAN DEFAULT true,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_public ON product_reviews(is_public);

-- Add sold_count to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;

-- Add cashback_balance to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS cashback_balance DECIMAL(10,2) DEFAULT 0;

-- Add coordinates column to centers if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'centers' AND column_name = 'coordinates') THEN
    ALTER TABLE centers ADD COLUMN coordinates POINT;
  END IF;
END $$;

-- Add reviews_count to centers
ALTER TABLE centers ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Add rating to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0;

-- Create function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET 
    rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_public = true)
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_reviews;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();
