-- Add password columns to mentors and secretaries tables for authentication
-- Run this in Supabase SQL Editor

-- Add password to mentors table
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';

-- Add password to secretaries table  
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';

-- Add role column to secretaries (for login role distinction)
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Secretary';

-- Add bio and photo if missing from secretaries
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update any NULL passwords to default
UPDATE mentors 
SET password = 'kalvium@123' 
WHERE password IS NULL OR password = '';

UPDATE secretaries 
SET password = 'kalvium@123' 
WHERE password IS NULL OR password = '';

-- Verify columns
SELECT 'mentors' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mentors' AND column_name IN ('password', 'email', 'role')
UNION ALL
SELECT 'secretaries' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'secretaries' AND column_name IN ('password', 'email', 'role')
UNION ALL
SELECT 'students' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name IN ('password', 'email', 'name');
