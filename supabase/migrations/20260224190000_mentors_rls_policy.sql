alter table mentors enable row level security;

drop policy if exists mentors_public_select on mentors;
drop policy if exists mentors_public_insert on mentors;
drop policy if exists mentors_public_update on mentors;
drop policy if exists mentors_public_delete on mentors;

create policy mentors_public_select
  on mentors
  for select
  using (true);

create policy mentors_public_insert
  on mentors
  for insert
  with check (true);

create policy mentors_public_update
  on mentors
  for update
  using (true)
  with check (true);

create policy mentors_public_delete
  on mentors
  for delete
  using (true);
