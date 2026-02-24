update mentors
set name = 'Hanuram'
where lower(name) in ('anuram', 'hanuram');

with ranked as (
  select id,
         row_number() over (partition by lower(name) order by id asc) as rn
  from mentors
  where lower(name) = lower('Hanuram')
)
delete from mentors m
using ranked r
where m.id = r.id
  and r.rn > 1;
