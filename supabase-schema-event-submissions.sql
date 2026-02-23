-- Create event_submissions table for storing user-submitted events
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS event_submissions (
  id BIGSERIAL PRIMARY KEY,
  submitter_email TEXT NOT NULL,
  submitter_name TEXT,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  topics TEXT[] NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT NOT NULL,
  location TEXT,
  event_url TEXT NOT NULL,
  organization TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_submissions_status ON event_submissions(status);
CREATE INDEX IF NOT EXISTS idx_event_submissions_event_date ON event_submissions(event_date);
CREATE INDEX IF NOT EXISTS idx_event_submissions_created_at ON event_submissions(created_at DESC);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for event submission)
CREATE POLICY "Allow public insert" ON event_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin)
CREATE POLICY "Allow authenticated read" ON event_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated updates (for admin)
CREATE POLICY "Allow authenticated update" ON event_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Optional: Add comment for documentation
COMMENT ON TABLE event_submissions IS 'Stores user-submitted events for review and publication in the weekly newsletter';
