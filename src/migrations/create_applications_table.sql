
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null, -- 'young', 'general', 'superb'
  round integer default 1,
  session integer default 1,
  education_date timestamp with time zone,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id bigint references students(id),
  course_id uuid references courses(id),
  category text not null, -- 'young', 'general', 'superb' to verify logic without joining course
  status text default 'REGISTERED',
  payment_status text default 'PENDING'
);

-- RLS Policies (Simplified for now)
alter table courses enable row level security;
alter table applications enable row level security;

create policy "Public courses are viewable by everyone." on courses for select using (true);
create policy "Public applications are viewable by everyone." on applications for select using (true);
create policy "Users can insert applications." on applications for insert with check (true);
create policy "Users can update their own applications." on applications for update using (true);

-- Insert Dummy Courses if not exist
insert into courses (title, category, round, session, education_date, location)
select '청년농업인 1년차 필수교육', 'young', 1, 1, '2025-01-15 09:00:00+09', '전북 농업기술원'
where not exists (select 1 from courses where category = 'young');

insert into courses (title, category, round, session, education_date, location)
select '후계농업경영인 일반과정', 'general', 1, 1, '2025-02-10 09:00:00+09', '서울 교육센터'
where not exists (select 1 from courses where category = 'general');

insert into courses (title, category, round, session, education_date, location)
select '우수후계농 필수교육', 'superb', 1, 1, '2025-10-30 09:00:00+09', '(익산)익산유스호스텔'
where not exists (select 1 from courses where category = 'superb');
