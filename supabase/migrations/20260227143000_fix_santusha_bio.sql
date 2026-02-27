do $$
declare
  target_name text := 'santusha iyer';
  clean_bio text := 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.';
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'description'
  ) then
    update mentors
    set description = clean_bio
    where lower(name) = target_name;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'desc'
  ) then
    update mentors
    set "desc" = clean_bio
    where lower(name) = target_name;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'bio'
  ) then
    update mentors
    set bio = clean_bio
    where lower(name) = target_name;
  end if;
end $$;
