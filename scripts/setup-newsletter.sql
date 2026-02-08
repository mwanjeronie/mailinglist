-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  event_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  unsubscribe_token VARCHAR(64) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_token ON newsletter_subscribers(unsubscribe_token);

-- Create event_type_suggestions table
CREATE TABLE event_type_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_type VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topic_suggestions table
CREATE TABLE topic_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_topic VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
