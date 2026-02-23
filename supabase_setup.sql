-- Supabase schema for Cosmic Frontier | Squad_139

create extension if not exists "pgcrypto";

do $$ begin
  create type operative_status as enum ('active', 'inactive', 'retired');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type mission_status as enum ('planned', 'ongoing', 'completed');
exception when duplicate_object then null;
end $$;

create table if not exists operatives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  skills text[] not null default '{}',
  status operative_status not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_date date,
  end_date date,
  status mission_status not null default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists mission_operatives (
  mission_id uuid not null references missions(id) on delete cascade,
  operative_id uuid not null references operatives(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  role_in_mission text,
  primary key (mission_id, operative_id)
);

create table if not exists archives (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions(id) on delete cascade,
  summary text not null,
  date_recorded timestamptz not null default now()
);

create table if not exists portfolio (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  release_date date not null,
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_missions (
  portfolio_id uuid not null references portfolio(id) on delete cascade,
  mission_id uuid not null references missions(id) on delete cascade,
  linked_at timestamptz not null default now(),
  primary key (portfolio_id, mission_id)
);

create table if not exists students (
  id serial primary key,
  name text not null,
  email text unique,
  linkedin text,
  github text,
  term text not null,
  photo text,
  tagline text,
  bio text,
  course_name text default 'Full Stack Engineering',
  teacher_name text default 'Professor Astra',
  semester text default 'Spring 2026',
  course_goals text,
  projects jsonb default '[]'::jsonb,
  overall_reflection jsonb default '{"takeaways": [], "growth": "", "future": ""}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists secretaries (
  id serial primary key,
  name text not null,
  employee_id text unique,
  email text,
  office_location text,
  phone text,
  created_at timestamptz not null default now()
);

create index if not exists idx_operatives_role on operatives(role);
create index if not exists idx_operatives_status on operatives(status);
create index if not exists idx_missions_status on missions(status);
create index if not exists idx_missions_start_date on missions(start_date);
create index if not exists idx_archives_mission_id on archives(mission_id);
create index if not exists idx_mission_operatives_operative_id on mission_operatives(operative_id);
create index if not exists idx_portfolio_missions_mission_id on portfolio_missions(mission_id);
create index if not exists idx_students_term on students(term);
create index if not exists idx_secretaries_employee_id on secretaries(employee_id);

insert into operatives (id, name, role, skills, status) values
  ('11111111-1111-1111-1111-111111111111', 'Astra Voss', 'Systems Architect', '{Postgres, Supabase, Security}', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Juno Kade', 'UI/UX Engineer', '{React, UX, Motion}', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Orion Vale', 'Platform Engineer', '{Node, Infra, CI}', 'inactive')
on conflict (id) do nothing;

insert into missions (id, title, description, start_date, end_date, status) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Starlight Mesh', 'Distributed comms grid for deep-space ops', '2026-01-10', null, 'ongoing'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nebula Forge', 'Pipeline for rapid system evolution', '2025-11-01', '2026-02-01', 'completed'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Void Relay', 'Secure mission relay infrastructure', '2026-03-01', null, 'planned')
on conflict (id) do nothing;

insert into mission_operatives (mission_id, operative_id, role_in_mission) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Lead Architect'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Interface Lead'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Platform Support')
on conflict (mission_id, operative_id) do nothing;

insert into archives (id, mission_id, summary, date_recorded) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Completed rollout of Nebula Forge v2 with 30% faster deploy cycles', '2026-02-02 10:00:00+00'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Stabilized multi-region failover process', '2026-02-05 14:30:00+00')
on conflict (id) do nothing;

insert into portfolio (id, version, release_date, features) values
  ('99999999-9999-9999-9999-999999999999', 'v3.0.0', '2026-02-15', '{"highlights":["Universe UI","Faster routing","Mission archive"],"status":"stable"}'),
  ('88888888-8888-8888-8888-888888888888', 'v3.1.0', '2026-03-01', '{"highlights":["Nebula theming","Auth refresh"],"status":"beta"}')
on conflict (id) do nothing;

insert into portfolio_missions (portfolio_id, mission_id) values
  ('99999999-9999-9999-9999-999999999999', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('88888888-8888-8888-8888-888888888888', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
on conflict (portfolio_id, mission_id) do nothing;

insert into students (id, name, email, linkedin, github, term) values
  (1, 'hariz', 'mohamed.hariz.s.139@kalvium.community', 'https://linkedin.com/in/hariz', 'https://github.com/hariz', 'Term 1'),
  (2, 'sham', 'cheekaramelli.shyam.s.139@kalvium.community', '', '', 'Term 1'),
  (3, 'amarnath', 'amarnath.p.s.139@kalvium.community', 'https://www.linkedin.com/in/amarnath-p-s-942782322/', 'https://github.com/amarnath-cdr', 'Term 1'),
  (4, 'arulananthan', 'arulananthan.m.s.139@kalvium.community', '', '', 'Term 1'),
  (5, 'kamala kiruthi', 'kamala.kiruthi.s.139@kalvium.community', 'https://www.linkedin.com/in/kamala-kiruthi/', 'https://github.com/kamalakiruthi8', 'Term 1'),
  (6, 'lohith', 'lohith.chinthalapalli.s.139@kalvium.community', 'https://www.linkedin.com/in/chinthalapalli-lohith-126447384/', 'https://github.com/lohithchinthalalpalli', 'Term 1'),
  (7, 'hari', 'hari.r.s.139@kalvium.community', 'https://www.linkedin.com/in/hari-r-bb3181370/', 'https://github.com/harirs139-ui', 'Term 1'),
  (8, 'jayseelan', 'jayaseelan.d.s.139@kalvium.community', 'https://www.linkedin.com/in/jayaseelan-d-1951952a6', 'https://www.linkedin.com/in/jayaseelan-d-1951952a6', 'Term 1'),
  (9, 'durga saranya', 'durga.saranya.s.139@kalvium.community', 'https://www.linkedin.com/feed/', 'https://github.com/durgasaranyas139-lgtm', 'Term 1'),
  (10, 'gokul', 'gokul.raj.s.139@kalvium.community', 'http://www.linkedin.com/in/gokul-raj95', 'https://www.linkedin.com/in/gokul-raj95', 'Term 1'),
  (11, 'joy arnold', 'joy.arnold.s.139@kalvium.community', 'https://www.linkedin.com/in/joyarnold21?utm_source=share_via&utm_content=profile&utm_medium=member_android', '', 'Term 1'),
  (12, 'kathiravan', 'kathiravan.e.s.139@kalvium.community', 'https://www.linkedin.com/in/kathiravan-e-56688a39b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 'https://github.com/ekathiravanelumalai71-a11y', 'Term 1'),
  (13, 'mosses', 'moses.acknal.s.139@kalvium.community', 'https://www.linkedin.com/in/moses-acknal-7957973a4/', 'https://github.com/mosesacknals139', 'Term 2'),
  (14, 'priyadharsan', 'priyadharsan.s.s.139@kalvium.community', 'http://www.linkedin.com/in/priyadharsan-s2007', 'https://github.com/Priyadharsan2911', 'Term 2'),
  (15, 'abinay', 'abhinay.m.s.139@kalvium.community', 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit', '', 'Term 2'),
  (16, 'suriya', 'suriya.r.s.139@kalvium.community', '', '', 'Term 2'),
  (17, 'yakesh', 'yakesh.r.s.139@kalvium.community', 'https://www.linkedin.com/in/yakesh-r-92648a383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 'https://github.com/yakpranu-design', 'Term 2'),
  (18, 'nanthakumar', 'nandhakumar.p.s.139@kalvium.community', 'http://www.linkedin.com/in/nandhakumar-pm-8276b7381', 'https://github.com/nandhakumar1980', 'Term 2'),
  (19, 'srinithi', 'srinithi.vijayakumar.s.139@kalvium.community', 'https://www.linkedin.com/in/srinithi-vijayakumar-981785344/', 'https://github.com/srinithivijayakumars139-wq', 'Term 2'),
  (20, 'srimathi', 'srimathi.vijayakumar.s.139@kalvium.community', 'https://www.linkedin.com/in/srimathi-vijayakumar-10518a383/', 'https://github.com/srimajaya123-blip', 'Term 2'),
  (21, 'srinidthi', 'srinidhi.v.s.139@kalvium.community', 'https://www.linkedin.com/in/srinidhi-v-123193384/', 'https://github.com/srinidhivs139-ai', 'Term 2'),
  (22, 'mohan', 'mohan.e.s.139@kalvium.community', 'http://www.linkedin.com/in/mohan-e-b7945b2b2', 'https://github.com/mohanes139-cell', 'Term 3'),
  (23, 'nabi rasool', 'nabi.rasool.s.139@kalvium.community', 'http://www.linkedin.com/in/nabi-rasool-129494393', '', 'Term 3'),
  (24, 'keerthana', 'krishna.keerthana.s.139@kalvium.community', 'https://www.linkedin.com/feed/', 'https://github.com/krishnakeerthanamitte-tech', 'Term 3'),
  (25, 'ragul', 'ragul.as.s.139@kalvium.community', '', '', 'Term 1'),
  (26, 'nayeem', 'nayeem.sajjath.s.139@kalvium.community', '', '', 'Term 1'),
  (27, 'muthuvel', 'muthuvel.jason.s.139@kalvium.community', '', '', 'Term 1'),
  (28, 'sharaf', 'mohamed.sharaf.s.139@kalvium.community', '', '', 'Term 1'),
  (29, 'kishore', 'kishore.g.s.139@kalvium.community', '', '', 'Term 1'),
  (30, 'jushwanth', 'jushwanth.s.139@kalvium.community', '', '', 'Term 1'),
  (31, 'chandana', 'chandana.e.s.139@kalvium.community', '', '', 'Term 1'),
  (32, 'yashwant', 'yashwant.k.s.139@kalvium.community', '', '', 'Term 1'),
  (33, 'arvind', 'arvind.m.s.139@kalvium.community', '', '', 'Term 1'),
  (34, 'yugesh', 'yugesh.s.s.139@kalvium.community', '', '', 'Term 1'),
  (35, 'varun', 'varun.raj.s.139@kalvium.community', '', '', 'Term 1'),
  (36, 'dheena', 'dheenadayalan.r.s.139@kalvium.community', '', '', 'Term 1'),
  (37, 'imran', 'imran.s.s.139@kalvium.community', '', '', 'Term 1'),
  (38, 'prasanna', 'prasanna.a.s.138@kalvium.community', '', '', 'Term 1')
on conflict (id) do update set email = excluded.email;

alter table operatives enable row level security;
alter table missions enable row level security;
alter table mission_operatives enable row level security;
alter table archives enable row level security;
alter table portfolio enable row level security;
alter table portfolio_missions enable row level security;
alter table students enable row level security;
alter table secretaries enable row level security;

-- Drop existing policies to avoid "already exists" errors
drop policy if exists "public read operatives" on operatives;
drop policy if exists "public read missions" on missions;
drop policy if exists "public read mission operatives" on mission_operatives;
drop policy if exists "public read archives" on archives;
drop policy if exists "public read portfolio" on portfolio;
drop policy if exists "public read portfolio missions" on portfolio_missions;
drop policy if exists "public read students" on students;
drop policy if exists "public read secretaries" on secretaries;

drop policy if exists "auth write operatives" on operatives;
drop policy if exists "auth update operatives" on operatives;
drop policy if exists "auth delete operatives" on operatives;

drop policy if exists "auth write missions" on missions;
drop policy if exists "auth update missions" on missions;
drop policy if exists "auth delete missions" on missions;

drop policy if exists "auth write mission operatives" on mission_operatives;
drop policy if exists "auth update mission operatives" on mission_operatives;
drop policy if exists "auth delete mission operatives" on mission_operatives;

drop policy if exists "auth write archives" on archives;
drop policy if exists "auth update archives" on archives;
drop policy if exists "auth delete archives" on archives;

drop policy if exists "auth write portfolio" on portfolio;
drop policy if exists "auth update portfolio" on portfolio;
drop policy if exists "auth delete portfolio" on portfolio;

drop policy if exists "auth write portfolio missions" on portfolio_missions;
drop policy if exists "auth update portfolio missions" on portfolio_missions;
drop policy if exists "auth delete portfolio missions" on portfolio_missions;

drop policy if exists "auth write students" on students;
drop policy if exists "auth update students" on students;
drop policy if exists "auth delete students" on students;
drop policy if exists "auth write secretaries" on secretaries;
drop policy if exists "auth update secretaries" on secretaries;
drop policy if exists "auth delete secretaries" on secretaries;

create policy "public read operatives" on operatives
  for select using (true);
create policy "public read missions" on missions
  for select using (true);
create policy "public read mission operatives" on mission_operatives
  for select using (true);
create policy "public read archives" on archives
  for select using (true);
create policy "public read portfolio" on portfolio
  for select using (true);
create policy "public read portfolio missions" on portfolio_missions
  for select using (true);
create policy "public read students" on students
  for select using (true);
create policy "public read secretaries" on secretaries
  for select using (true);

create policy "auth write operatives" on operatives
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update operatives" on operatives
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete operatives" on operatives
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write missions" on missions
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update missions" on missions
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete missions" on missions
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write mission operatives" on mission_operatives
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update mission operatives" on mission_operatives
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete mission operatives" on mission_operatives
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write archives" on archives
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update archives" on archives
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete archives" on archives
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write portfolio" on portfolio
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update portfolio" on portfolio
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete portfolio" on portfolio
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write portfolio missions" on portfolio_missions
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update portfolio missions" on portfolio_missions
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete portfolio missions" on portfolio_missions
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write students" on students
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update students" on students
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete students" on students
  for delete using (((select auth.role()) = 'authenticated'));

create policy "auth write secretaries" on secretaries
  for insert with check (((select auth.role()) = 'authenticated'));
create policy "auth update secretaries" on secretaries
  for update using (((select auth.role()) = 'authenticated'));
create policy "auth delete secretaries" on secretaries
  for delete using (((select auth.role()) = 'authenticated'));
