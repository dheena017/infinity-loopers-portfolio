-- Ensure password column exists and all students have passwords set
-- Run this in Supabase SQL Editor if needed

-- Add password column if it doesn't exist (already in schema, but just in case)
ALTER TABLE students ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';

-- Update any NULL passwords to default value
UPDATE students 
SET password = 'kalvium@123' 
WHERE password IS NULL OR password = '';

-- Optional: Check students table structure
-- SELECT column_name, data_type, column_default, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'students';

-- Optional: View all students with their passwords (for testing only)
-- SELECT id, name, email, password FROM students;
