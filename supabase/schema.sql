-- ============================================================
-- Nibedita Yoga Training Centre — Supabase Schema
-- Paste this entire file into Supabase → SQL Editor → Run
-- ============================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id                uuid references auth.users on delete cascade primary key,
  full_name         text,
  phone             text,
  email             text,
  address           text,
  photo_url         text,
  emergency_contact text,
  preferred_language text default 'en' check (preferred_language in ('en','hi','bn')),
  role              text default 'member' check (role in ('member','admin')),
  status            text default 'active' check (status in ('active','suspended')),
  joined_date       date,
  created_at        timestamptz default now()
);

-- 2. batches
create table if not exists public.batches (
  id          uuid primary key default gen_random_uuid(),
  name_en     text not null,
  name_hi     text,
  name_bn     text,
  timing      text,       -- e.g. "6:00 AM – 7:00 AM"
  days        text,       -- e.g. "Mon, Wed, Fri"
  capacity    integer default 20,
  enrolled    integer default 0,
  instructor  text,
  level       text check (level in ('Beginner','Intermediate','Advanced')),
  fee_monthly integer default 0,
  status      text default 'active' check (status in ('active','paused','ended','cancelled')),
  created_at  timestamptz default now()
);

-- 3. enrollments
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references public.profiles(id) on delete cascade,
  batch_id    uuid references public.batches(id) on delete cascade,
  start_date  date,
  status      text default 'active' check (status in ('active','paused','cancelled')),
  notes       text,
  created_at  timestamptz default now(),
  unique (member_id, batch_id)
);

-- 4. fee_records
create table if not exists public.fee_records (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid references public.profiles(id) on delete cascade,
  amount         integer not null,           -- in paise/smallest currency unit
  month          text not null,              -- e.g. "2024-06"
  due_date       date,
  paid_date      date,
  method         text check (method in ('upi','cash','gateway',null)),
  reference      text,
  screenshot_url text,
  gateway_order_id text,                     -- Phase 2 Razorpay/Cashfree
  status         text default 'pending' check (status in ('pending','screenshot_uploaded','confirmed','overdue')),
  updated_at     timestamptz default now(),
  created_at     timestamptz default now()
);

-- 5. events
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title_en    text not null,
  title_hi    text,
  title_bn    text,
  body_en     text,
  body_hi     text,
  body_bn     text,
  media_url   text,
  media_type  text check (media_type in ('youtube','image','drive',null)),
  tags        text[],
  event_date  date,
  pinned      boolean default false,
  created_at  timestamptz default now()
);

-- 6. asanas
create table if not exists public.asanas (
  id                uuid primary key default gen_random_uuid(),
  name_en           text not null,
  name_hi           text,
  name_bn           text,
  slug              text unique,
  description_en    text,
  description_hi    text,
  description_bn    text,
  steps_en          text,
  steps_hi          text,
  steps_bn          text,
  benefits          text[],
  health_targets    text[],
  difficulty        text check (difficulty in ('Beginner','Intermediate','Advanced')),
  contraindications text,
  image_url         text,
  created_at        timestamptz default now()
);

-- 7. blog_posts
create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title_en    text,
  title_hi    text,
  title_bn    text,
  content_en  text,
  content_hi  text,
  content_bn  text,
  excerpt_en  text,
  excerpt_hi  text,
  excerpt_bn  text,
  tags        text[],
  published   boolean default false,
  created_at  timestamptz default now()
);

-- 8. enquiries
create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  email          text,
  message        text,
  preferred_time text,
  status         text default 'new' check (status in ('new','contacted','replied')),
  created_at     timestamptz default now()
);

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles    enable row level security;
alter table public.batches     enable row level security;
alter table public.enrollments enable row level security;
alter table public.fee_records enable row level security;
alter table public.events      enable row level security;
alter table public.asanas      enable row level security;
alter table public.blog_posts  enable row level security;
alter table public.enquiries   enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---- profiles ----
-- Users can read/update their own row
create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);
-- Admins can read all
create policy "profiles: admin read"  on public.profiles for select using (public.is_admin());
create policy "profiles: admin write" on public.profiles for all    using (public.is_admin());

-- ---- batches ----
create policy "batches: public read"  on public.batches for select using (true);
create policy "batches: admin write"  on public.batches for all    using (public.is_admin());

-- ---- enrollments ----
create policy "enrollments: member read"   on public.enrollments for select using (auth.uid() = member_id);
-- Members must be able to insert their own enrollment (BatchEnrolCard)
create policy "enrollments: member insert" on public.enrollments for insert with check (auth.uid() = member_id);
create policy "enrollments: admin all"     on public.enrollments for all    using (public.is_admin());

-- ---- fee_records ----
create policy "fees: member read"   on public.fee_records for select using (auth.uid() = member_id);
-- Members can update their own fee row to upload a payment screenshot
create policy "fees: member update" on public.fee_records for update using (auth.uid() = member_id);
create policy "fees: admin all"     on public.fee_records for all    using (public.is_admin());

-- ---- events ----
create policy "events: public read" on public.events for select using (true);
create policy "events: admin write" on public.events for all    using (public.is_admin());

-- ---- asanas ----
create policy "asanas: public read" on public.asanas for select using (true);
create policy "asanas: admin write" on public.asanas for all    using (public.is_admin());

-- ---- blog_posts ----
create policy "blog: public read"   on public.blog_posts for select using (published = true);
create policy "blog: admin all"     on public.blog_posts for all    using (public.is_admin());

-- ---- enquiries ----
-- Anyone can insert; only admins can read
create policy "enquiries: public insert" on public.enquiries for insert with check (true);
create policy "enquiries: admin read"    on public.enquiries for select using (public.is_admin());
create policy "enquiries: admin update"  on public.enquiries for update using (public.is_admin());

-- ============================================================
-- STORAGE BUCKET: profile-photos
-- ============================================================
-- Run this separately in Storage tab or via this SQL:
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', false)
on conflict (id) do nothing;

-- Members can upload their own photo
create policy "storage: self upload"
  on storage.objects for insert
  with check (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: self read"
  on storage.objects for select
  using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: admin all"
  on storage.objects for all
  using (bucket_id = 'profile-photos' and public.is_admin());

-- Payment screenshots bucket
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

create policy "storage: member upload screenshot"
  on storage.objects for insert
  with check (bucket_id = 'payment-screenshots' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: admin view screenshots"
  on storage.objects for select
  using (bucket_id = 'payment-screenshots' and public.is_admin());

-- ============================================================
-- SAMPLE DATA (delete before production)
-- ============================================================
insert into public.batches (name_en, name_hi, name_bn, timing, days, capacity, level, instructor, status)
values
  ('Morning Hatha — Beginner', 'सुबह हठ — शुरुआती', 'সকালের হাঠ — শিক্ষানবিশ', '6:00 AM – 7:00 AM', 'Mon, Wed, Fri', 15, 'Beginner',    'Rekha Nath', 'active'),
  ('Morning Vinyasa — Intermediate', 'सुबह विनयास — मध्यम', 'সকালের বিনয়াস — মধ্যবর্তী', '7:30 AM – 8:30 AM', 'Mon, Wed, Fri', 12, 'Intermediate', 'Rekha Nath', 'active'),
  ('Evening Gentle — All Levels', 'शाम का कोमल — सभी स्तर', 'সন্ধ্যার মৃদু — সব স্তর', '6:00 PM – 7:00 PM', 'Tue, Thu, Sat', 18, 'Beginner', 'Rekha Nath', 'active');
