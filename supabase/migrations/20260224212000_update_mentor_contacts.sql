alter table mentors add column if not exists email text;
alter table mentors add column if not exists linkedin text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'Email'
  ) then
    execute 'update mentors set email = coalesce(email, "Email")';
  end if;
end $$;

update mentors
set email = 'karunakaran.h@kalvium.com',
    linkedin = 'https://www.linkedin.com/in/h-karunakaran-3b1285376/'
where lower(name) = lower('Karunakaran');

update mentors
set email = 'santushta.iyer@kalvium.com',
    linkedin = 'https://www.linkedin.com/in/santushta-iyer-a-99862a25b/'
where lower(name) = lower('Santusha Iyer');

update mentors
set email = 'hanuram.t@kalvium.com',
    linkedin = 'https://www.linkedin.com/in/hanuram-t/'
where lower(name) = lower('Hanuram');

update mentors
set email = 'aravind.r@kalvium.com',
    linkedin = 'https://www.linkedin.com/in/aravind-r-812634245/'
where lower(name) = lower('Arvind');
