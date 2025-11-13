-- Add description column to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS description TEXT;
