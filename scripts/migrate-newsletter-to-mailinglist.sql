-- Migration script to rename newsletter_subscribers to mailinglist_subscribers
-- Run this if you already have a newsletter_subscribers table with data

-- Rename the table
ALTER TABLE IF EXISTS newsletter_subscribers RENAME TO mailinglist_subscribers;

-- Rename the indexes
ALTER INDEX IF EXISTS idx_newsletter_email RENAME TO idx_mailinglist_email;
ALTER INDEX IF EXISTS idx_newsletter_token RENAME TO idx_mailinglist_token;

-- Verify the migration
SELECT 'Migration complete. Table renamed to mailinglist_subscribers' AS status;
