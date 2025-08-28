-- Create users table for SEO Speed Analyzer
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tier VARCHAR(10) DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  stripe_customer_id VARCHAR(255),
  google_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access for authentication
CREATE POLICY "Allow public read access for auth" ON users
  FOR SELECT USING (true);

-- Allow public insert for registration  
CREATE POLICY "Allow public insert for registration" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own records
CREATE POLICY "Allow users to update own record" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create function for creating the table (for RPC calls)
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Table creation is handled above, this just returns true
  RETURN true;
END;
$$;

-- Insert test users
INSERT INTO users (username, email, password_hash, tier, subscription_status, stripe_customer_id) VALUES
  ('testpro', 'testpro@example.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK2', 'pro', 'active', 'cus_testpro123'),
  ('Joehonathon', 'joehonathon@gmail.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK3', 'pro', 'active', NULL),
  ('testuser', 'test@example.com', '$2b$10$KxG.cIZ8xKEA5p8l9hxZLOjKJz4rGhKQUyj3Z2Uqp7QnD5vFoMaK4', 'free', 'inactive', NULL)
ON CONFLICT (email) DO NOTHING;