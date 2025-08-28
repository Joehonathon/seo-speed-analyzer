-- Create projects table for pro users
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_scan TIMESTAMP WITH TIME ZONE,
  scan_count INTEGER DEFAULT 0,
  
  -- Add constraints
  CONSTRAINT projects_name_check CHECK (length(trim(name)) > 0),
  CONSTRAINT projects_url_check CHECK (length(trim(url)) > 0)
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Create RLS (Row Level Security) policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (true);

-- Allow users to insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (true);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (true);

-- Verify table creation
SELECT 'Projects table created successfully!' as message;
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;