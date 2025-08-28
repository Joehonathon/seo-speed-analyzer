-- First, drop the table if it exists to start fresh
DROP TABLE IF EXISTS users CASCADE;

-- Create users table for SEO Speed Analyzer
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tier VARCHAR(10) DEFAULT 'free',
  subscription_status VARCHAR(20) DEFAULT 'inactive',
  stripe_customer_id VARCHAR(255),
  google_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Add constraints
  CONSTRAINT users_tier_check CHECK (tier IN ('free', 'pro')),
  CONSTRAINT users_subscription_status_check CHECK (subscription_status IN ('active', 'inactive', 'cancelled'))
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access for auth" ON users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON users;
DROP POLICY IF EXISTS "Allow users to update own record" ON users;

-- Allow public read access for authentication
CREATE POLICY "Allow public read access for auth" ON users
  FOR SELECT USING (true);

-- Allow public insert for registration  
CREATE POLICY "Allow public insert for registration" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own records (simplified for now)
CREATE POLICY "Allow users to update own record" ON users
  FOR UPDATE USING (true);

-- Insert test users
INSERT INTO users (username, email, password_hash, tier, subscription_status, stripe_customer_id, created_at) VALUES
  ('testpro', 'testpro@example.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK2', 'pro', 'active', 'cus_testpro123', NOW()),
  ('Joehonathon', 'joehonathon@gmail.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK3', 'pro', 'active', NULL, NOW()),
  ('testuser', 'test@example.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK4', 'free', 'inactive', NULL, NOW());

-- Verify the table was created correctly
SELECT 'Table created successfully! Here are the test users:' as message;
SELECT id, username, email, tier, subscription_status, created_at FROM users;