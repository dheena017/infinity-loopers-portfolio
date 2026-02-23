-- RUN THIS IN SUPABASE SQL EDITOR TO FIX LOGIN

-- 1. Add email column to students if missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='email') THEN
        ALTER TABLE students ADD COLUMN email text UNIQUE;
    END IF;
END $$;

-- 2. Add other missing columns for the dashboard
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='photo') THEN
        ALTER TABLE students ADD COLUMN photo text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='tagline') THEN
        ALTER TABLE students ADD COLUMN tagline text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='bio') THEN
        ALTER TABLE students ADD COLUMN bio text;
    END IF;
END $$;

-- 3. Create secretaries table
create table if not exists secretaries (
  id serial primary key,
  name text not null,
  employee_id text unique,
  email text,
  office_location text,
  phone text,
  created_at timestamptz not null default now()
);

-- 4. Enable RLS and Policies
alter table secretaries enable row level security;
drop policy if exists "public read secretaries" on secretaries;
create policy "public read secretaries" on secretaries for select using (true);

-- 5. UPGRADE STUDENT DATA WITH EMAILS
-- This matches the names in your current DB with their Kalvium emails
INSERT INTO students (id, name, email, term) VALUES
  (1, 'hariz', 'mohamed.hariz.s.139@kalvium.community', 'Term 1'),
  (2, 'sham', 'cheekaramelli.shyam.s.139@kalvium.community', 'Term 1'),
  (3, 'amarnath', 'amarnath.p.s.139@kalvium.community', 'Term 1'),
  (4, 'arulananthan', 'arulananthan.m.s.139@kalvium.community', 'Term 1'),
  (5, 'kamala kiruthi', 'kamala.kiruthi.s.139@kalvium.community', 'Term 1'),
  (6, 'lohith', 'lohith.chinthalapalli.s.139@kalvium.community', 'Term 1'),
  (7, 'hari', 'hari.r.s.139@kalvium.community', 'Term 1'),
  (8, 'jayseelan', 'jayaseelan.d.s.139@kalvium.community', 'Term 1'),
  (9, 'durga saranya', 'durga.saranya.s.139@kalvium.community', 'Term 1'),
  (10, 'gokul', 'gokul.raj.s.139@kalvium.community', 'Term 1'),
  (11, 'joy arnold', 'joy.arnold.s.139@kalvium.community', 'Term 1'),
  (12, 'kathiravan', 'kathiravan.e.s.139@kalvium.community', 'Term 1'),
  (13, 'mosses', 'moses.acknal.s.139@kalvium.community', 'Term 2'),
  (14, 'priyadharsan', 'priyadharsan.s.s.139@kalvium.community', 'Term 2'),
  (15, 'abinay', 'abhinay.m.s.139@kalvium.community', 'Term 2'),
  (16, 'suriya', 'suriya.r.s.139@kalvium.community', 'Term 2'),
  (17, 'yakesh', 'yakesh.r.s.139@kalvium.community', 'Term 2'),
  (18, 'nanthakumar', 'nandhakumar.p.s.139@kalvium.community', 'Term 2'),
  (19, 'srinithi', 'srinithi.vijayakumar.s.139@kalvium.community', 'Term 2'),
  (20, 'srimathi', 'srimathi.vijayakumar.s.139@kalvium.community', 'Term 2'),
  (21, 'srinidthi', 'srinidhi.v.s.139@kalvium.community', 'Term 2'),
  (22, 'mohan', 'mohan.e.s.139@kalvium.community', 'Term 3'),
  (23, 'nabi rasool', 'nabi.rasool.s.139@kalvium.community', 'Term 3'),
  (24, 'keerthana', 'krishna.keerthana.s.139@kalvium.community', 'Term 3'),
  (25, 'ragul', 'ragul.as.s.139@kalvium.community', 'Term 1'),
  (26, 'nayeem', 'nayeem.sajjath.s.139@kalvium.community', 'Term 1'),
  (27, 'muthuvel', 'muthuvel.jason.s.139@kalvium.community', 'Term 1'),
  (28, 'sharaf', 'mohamed.sharaf.s.139@kalvium.community', 'Term 1'),
  (29, 'kishore', 'kishore.g.s.139@kalvium.community', 'Term 1'),
  (30, 'jushwanth', 'jushwanth.s.139@kalvium.community', 'Term 1'),
  (31, 'chandana', 'chandana.e.s.139@kalvium.community', 'Term 1'),
  (32, 'yashwant', 'yashwant.k.s.139@kalvium.community', 'Term 1'),
  (33, 'arvind', 'arvind.m.s.139@kalvium.community', 'Term 1'),
  (34, 'yugesh', 'yugesh.s.s.139@kalvium.community', 'Term 1'),
  (35, 'varun', 'varun.raj.s.139@kalvium.community', 'Term 1'),
  (36, 'dheena', 'dheenadayalan.r.s.139@kalvium.community', 'Term 1'),
  (37, 'imran', 'imran.s.s.139@kalvium.community', 'Term 1'),
  (38, 'prasanna', 'prasanna.a.s.138@kalvium.community', 'Term 1')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
