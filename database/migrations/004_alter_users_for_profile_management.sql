-- Migration to add missing columns for user profile management APIs
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Ensure email_verified column exists (already handled in 003_alter_users_for_auth.sql)
-- No action needed for email_verified
