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

create index if not exists idx_operatives_role on operatives(role);
create index if not exists idx_operatives_status on operatives(status);
create index if not exists idx_missions_status on missions(status);
create index if not exists idx_missions_start_date on missions(start_date);
create index if not exists idx_archives_mission_id on archives(mission_id);
create index if not exists idx_mission_operatives_operative_id on mission_operatives(operative_id);
create index if not exists idx_portfolio_missions_mission_id on portfolio_missions(mission_id);

insert into operatives (id, name, role, skills, status) values
  ('11111111-1111-1111-1111-111111111111', 'Astra Voss', 'Systems Architect', '{Postgres, Supabase, Security}', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Juno Kade', 'UI/UX Engineer', '{React, UX, Motion}', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Orion Vale', 'Platform Engineer', '{Node, Infra, CI}', 'inactive');

insert into missions (id, title, description, start_date, end_date, status) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Starlight Mesh', 'Distributed comms grid for deep-space ops', '2026-01-10', null, 'ongoing'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nebula Forge', 'Pipeline for rapid system evolution', '2025-11-01', '2026-02-01', 'completed'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Void Relay', 'Secure mission relay infrastructure', '2026-03-01', null, 'planned');

insert into mission_operatives (mission_id, operative_id, role_in_mission) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Lead Architect'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Interface Lead'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Platform Support');

insert into archives (id, mission_id, summary, date_recorded) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Completed rollout of Nebula Forge v2 with 30% faster deploy cycles', '2026-02-02 10:00:00+00'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Stabilized multi-region failover process', '2026-02-05 14:30:00+00');

insert into portfolio (id, version, release_date, features) values
  ('99999999-9999-9999-9999-999999999999', 'v3.0.0', '2026-02-15', '{"highlights":["Universe UI","Faster routing","Mission archive"],"status":"stable"}'),
  ('88888888-8888-8888-8888-888888888888', 'v3.1.0', '2026-03-01', '{"highlights":["Nebula theming","Auth refresh"],"status":"beta"}');

insert into portfolio_missions (portfolio_id, mission_id) values
  ('99999999-9999-9999-9999-999999999999', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('88888888-8888-8888-8888-888888888888', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

alter table operatives enable row level security;
alter table missions enable row level security;
alter table mission_operatives enable row level security;
alter table archives enable row level security;
alter table portfolio enable row level security;
alter table portfolio_missions enable row level security;

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

create policy "auth write operatives" on operatives
  for insert with check (auth.role() = 'authenticated');
create policy "auth update operatives" on operatives
  for update using (auth.role() = 'authenticated');
create policy "auth delete operatives" on operatives
  for delete using (auth.role() = 'authenticated');

create policy "auth write missions" on missions
  for insert with check (auth.role() = 'authenticated');
create policy "auth update missions" on missions
  for update using (auth.role() = 'authenticated');
create policy "auth delete missions" on missions
  for delete using (auth.role() = 'authenticated');

create policy "auth write mission operatives" on mission_operatives
  for insert with check (auth.role() = 'authenticated');
create policy "auth update mission operatives" on mission_operatives
  for update using (auth.role() = 'authenticated');
create policy "auth delete mission operatives" on mission_operatives
  for delete using (auth.role() = 'authenticated');

create policy "auth write archives" on archives
  for insert with check (auth.role() = 'authenticated');
create policy "auth update archives" on archives
  for update using (auth.role() = 'authenticated');
create policy "auth delete archives" on archives
  for delete using (auth.role() = 'authenticated');

create policy "auth write portfolio" on portfolio
  for insert with check (auth.role() = 'authenticated');
create policy "auth update portfolio" on portfolio
  for update using (auth.role() = 'authenticated');
create policy "auth delete portfolio" on portfolio
  for delete using (auth.role() = 'authenticated');

create policy "auth write portfolio missions" on portfolio_missions
  for insert with check (auth.role() = 'authenticated');
create policy "auth update portfolio missions" on portfolio_missions
  for update using (auth.role() = 'authenticated');
create policy "auth delete portfolio missions" on portfolio_missions
  for delete using (auth.role() = 'authenticated');
