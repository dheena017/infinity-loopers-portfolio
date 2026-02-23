-- ============================================================
-- Add password column to students table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Step 1: Add the password column with the default password
ALTER TABLE students
ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';

-- Step 2: Set the default password for all existing students who don't have one
UPDATE students SET password = 'kalvium@123' WHERE password IS NULL OR password = '';

-- Done! Now every student has the default password 'kalvium@123'
-- and can change it through the Student Dashboard.
