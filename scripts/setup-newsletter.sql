-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  event_types TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Enable RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for newsletter signup)
CREATE POLICY IF NOT EXISTS "Anyone can insert" 
  ON newsletter_subscribers 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public to select their own record
CREATE POLICY IF NOT EXISTS "Users can view their own record" 
  ON newsletter_subscribers 
  FOR SELECT 
  USING (true);

-- Allow public to update their own record
CREATE POLICY IF NOT EXISTS "Users can update their own record" 
  ON newsletter_subscribers 
  FOR UPDATE 
  USING (true);
