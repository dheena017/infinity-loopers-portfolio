do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'description'
  ) then
    -- Santusha Iyer
    update mentors
    set role = 'Senior Mentor',
        description = 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.',
        photo = '/assets/mentor1.jpg'
    where lower(name) = lower('Santusha Iyer');

    if not exists (select 1 from mentors where lower(name) = lower('Santusha Iyer')) then
      insert into mentors (name, role, description, photo)
      values ('Santusha Iyer', 'Senior Mentor', 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.', '/assets/mentor1.jpg');
    end if;

    -- Hanuram
    update mentors
    set role = 'Technical Mentor',
        description = 'Focused on hands-on development skills, logical thinking, and applied engineering practices.',
        photo = '/assets/mentor2.jpg'
    where lower(name) = lower('Hanuram');

    if not exists (select 1 from mentors where lower(name) = lower('Hanuram')) then
      insert into mentors (name, role, description, photo)
      values ('Hanuram', 'Technical Mentor', 'Focused on hands-on development skills, logical thinking, and applied engineering practices.', '/assets/mentor2.jpg');
    end if;

    -- Karunakaran
    update mentors
    set role = 'Language & Thinking Mentor',
        description = 'Helps learners build communication confidence, structured thinking, and professional language skills.',
        photo = '/assets/mentor3.jpg'
    where lower(name) = lower('Karunakaran');

    if not exists (select 1 from mentors where lower(name) = lower('Karunakaran')) then
      insert into mentors (name, role, description, photo)
      values ('Karunakaran', 'Language & Thinking Mentor', 'Helps learners build communication confidence, structured thinking, and professional language skills.', '/assets/mentor3.jpg');
    end if;

    -- Arvind
    update mentors
    set role = 'Maths & Problem Solving Mentor',
        description = 'Specializes in mathematical foundations and problem-solving techniques for engineering clarity.',
        photo = '/assets/mentor4.jpg'
    where lower(name) = lower('Arvind');

    if not exists (select 1 from mentors where lower(name) = lower('Arvind')) then
      insert into mentors (name, role, description, photo)
      values ('Arvind', 'Maths & Problem Solving Mentor', 'Specializes in mathematical foundations and problem-solving techniques for engineering clarity.', '/assets/mentor4.jpg');
    end if;

  elsif exists (
    select 1
    from information_schema.columns
    where table_name = 'mentors' and column_name = 'desc'
  ) then
    -- Santusha Iyer
    update mentors
    set role = 'Senior Mentor',
        "desc" = 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.',
        photo = '/assets/mentor1.jpg'
    where lower(name) = lower('Santusha Iyer');

    if not exists (select 1 from mentors where lower(name) = lower('Santusha Iyer')) then
      insert into mentors (name, role, "desc", photo)
      values ('Santusha Iyer', 'Senior Mentor', 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.', '/assets/mentor1.jpg');
    end if;

    -- Hanuram
    update mentors
    set role = 'Technical Mentor',
        "desc" = 'Focused on hands-on development skills, logical thinking, and applied engineering practices.',
        photo = '/assets/mentor2.jpg'
    where lower(name) = lower('Hanuram');

    if not exists (select 1 from mentors where lower(name) = lower('Hanuram')) then
      insert into mentors (name, role, "desc", photo)
      values ('Hanuram', 'Technical Mentor', 'Focused on hands-on development skills, logical thinking, and applied engineering practices.', '/assets/mentor2.jpg');
    end if;

    -- Karunakaran
    update mentors
    set role = 'Language & Thinking Mentor',
        "desc" = 'Helps learners build communication confidence, structured thinking, and professional language skills.',
        photo = '/assets/mentor3.jpg'
    where lower(name) = lower('Karunakaran');

    if not exists (select 1 from mentors where lower(name) = lower('Karunakaran')) then
      insert into mentors (name, role, "desc", photo)
      values ('Karunakaran', 'Language & Thinking Mentor', 'Helps learners build communication confidence, structured thinking, and professional language skills.', '/assets/mentor3.jpg');
    end if;

    -- Arvind
    update mentors
    set role = 'Maths & Problem Solving Mentor',
        "desc" = 'Specializes in mathematical foundations and problem-solving techniques for engineering clarity.',
        photo = '/assets/mentor4.jpg'
    where lower(name) = lower('Arvind');

    if not exists (select 1 from mentors where lower(name) = lower('Arvind')) then
      insert into mentors (name, role, "desc", photo)
      values ('Arvind', 'Maths & Problem Solving Mentor', 'Specializes in mathematical foundations and problem-solving techniques for engineering clarity.', '/assets/mentor4.jpg');
    end if;

  else
    raise notice 'Mentors table has neither description nor desc column. Skipping mentor data upsert.';
  end if;
end $$;
