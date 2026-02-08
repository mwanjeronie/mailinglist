-- Add new columns to newsletter_subscribers if they don't exist
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS unsubscribe_token VARCHAR(64) UNIQUE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index for unsubscribe token
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscribers(unsubscribe_token);

-- Create event_type_suggestions table
CREATE TABLE IF NOT EXISTS event_type_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_type VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topic_suggestions table
CREATE TABLE IF NOT EXISTS topic_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_topic VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
