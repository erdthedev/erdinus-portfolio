-- Jalankan di Supabase SQL Editor.
-- Setelah itu buat 1 user admin di Authentication → Users.

create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Erdinus',
  role text not null default 'Mahasiswa Informatika • Staff Accounting',
  headline text not null default 'Saya membangun sistem web yang rapi, fungsional, dan mudah dipakai.',
  bio text default '',
  email text,
  whatsapp text,
  github text,
  linkedin text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default 'Project',
  description text not null,
  tech_stack text,
  demo_url text,
  repo_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  level int not null default 80 check (level >= 1 and level <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  period text,
  description text,
  sort_order int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

insert into public.profile (full_name, role, headline, bio, email, github)
select
  'Erdinus',
  'Mahasiswa Informatika • Staff Accounting',
  'Saya membangun sistem web yang rapi, fungsional, dan mudah dipakai.',
  'Fokus pada administrasi, accounting, dan pengembangan web app yang praktis untuk bisnis. Saya suka membuat sistem yang bukan cuma terlihat bagus, tapi juga bisa dipakai untuk kerja nyata.',
  'erdinus19@gmail.com',
  'https://github.com/erdthedev'
where not exists (select 1 from public.profile);

insert into public.projects (title, category, description, tech_stack, demo_url)
select 'UangKu', 'Finance Web App', 'Aplikasi pencatatan keuangan dengan dashboard, laporan, premium, dan admin panel.', 'Vite, Supabase, Vercel', 'https://uangku-vercel.vercel.app/'
where not exists (select 1 from public.projects where title = 'UangKu');

insert into public.skills (name, description, level)
select 'Accounting & Administration', 'Mencatat, merapikan, dan membaca data kerja operasional.', 88
where not exists (select 1 from public.skills where name = 'Accounting & Administration');

insert into public.skills (name, description, level)
select 'Web Development', 'Membangun web app ringan dengan JavaScript dan Supabase.', 78
where not exists (select 1 from public.skills where name = 'Web Development');

insert into public.experience (title, organization, period, description, sort_order)
select 'Staff Accounting', 'Perusahaan / Kantor', 'Sekarang', 'Mengelola pekerjaan accounting dan administrasi harian.', 1
where not exists (select 1 from public.experience where title = 'Staff Accounting');

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.messages enable row level security;

-- Public boleh membaca konten portofolio.
drop policy if exists "Public read profile" on public.profile;
create policy "Public read profile" on public.profile for select using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills" on public.skills for select using (true);

drop policy if exists "Public read experience" on public.experience;
create policy "Public read experience" on public.experience for select using (true);

-- Pesan kontak: publik hanya boleh insert, admin login boleh baca/hapus.
drop policy if exists "Public insert messages" on public.messages;
create policy "Public insert messages" on public.messages for insert with check (true);

drop policy if exists "Admin read messages" on public.messages;
create policy "Admin read messages" on public.messages for select using (auth.role() = 'authenticated');

drop policy if exists "Admin delete messages" on public.messages;
create policy "Admin delete messages" on public.messages for delete using (auth.role() = 'authenticated');

-- Admin login boleh CRUD konten.
drop policy if exists "Admin write profile" on public.profile;
create policy "Admin write profile" on public.profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin write skills" on public.skills;
create policy "Admin write skills" on public.skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin write experience" on public.experience;
create policy "Admin write experience" on public.experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
