-- ============================================================
-- Nibedita Yoga Training Centre — Supabase Schema v2
-- Run this ENTIRE script in the Supabase SQL Editor.
-- It is idempotent: safe to re-run.
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. PROFILES — new fields
-- ──────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','other','prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS medical_conditions TEXT;

-- ──────────────────────────────────────────────
-- 2. BATCHES — batch_code, fee_monthly, display_fill_pct, mode
-- ──────────────────────────────────────────────
ALTER TABLE batches
  ADD COLUMN IF NOT EXISTS batch_code       TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS fee_monthly      INTEGER DEFAULT 200,
  ADD COLUMN IF NOT EXISTS display_fill_pct INTEGER DEFAULT 40 CHECK (display_fill_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS mode             TEXT NOT NULL DEFAULT 'offline' CHECK (mode IN ('online','offline')),
  ADD COLUMN IF NOT EXISTS timing           TEXT,
  ADD COLUMN IF NOT EXISTS days             TEXT DEFAULT 'Mon–Sat';

-- Seed the 20 batches (10 time slots × 2 modes)
-- Uses INSERT ... ON CONFLICT DO NOTHING so it's safe to re-run.
INSERT INTO batches (batch_code, name_en, timing, mode, days, fee_monthly, display_fill_pct, capacity, status) VALUES
  ('M615-OL',  'Morning 6:15 Online',       '6:15 AM – 7:15 AM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('M615-OF',  'Morning 6:15 In-Class',      '6:15 AM – 7:15 AM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('M715-OL',  'Morning 7:15 Online',        '7:15 AM – 8:15 AM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('M715-OF',  'Morning 7:15 In-Class',      '7:15 AM – 8:15 AM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('M815-OL',  'Morning 8:15 Online',        '8:15 AM – 9:15 AM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('M815-OF',  'Morning 8:15 In-Class',      '8:15 AM – 9:15 AM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('M1115-OL', 'Morning 11:15 Online',       '11:15 AM – 12:15 PM', 'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('M1115-OF', 'Morning 11:15 In-Class',     '11:15 AM – 12:15 PM', 'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('N1215-OL', 'Noon 12:15 Online',          '12:15 PM – 1:15 PM',  'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('N1215-OF', 'Noon 12:15 In-Class',        '12:15 PM – 1:15 PM',  'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('E415-OL',  'Evening 4:15 Online',        '4:15 PM – 5:15 PM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('E415-OF',  'Evening 4:15 In-Class',      '4:15 PM – 5:15 PM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('E515-OL',  'Evening 5:15 Online',        '5:15 PM – 6:15 PM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('E515-OF',  'Evening 5:15 In-Class',      '5:15 PM – 6:15 PM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('E615-OL',  'Evening 6:15 Online',        '6:15 PM – 7:15 PM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('E615-OF',  'Evening 6:15 In-Class',      '6:15 PM – 7:15 PM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('E715-OL',  'Evening 7:15 Online',        '7:15 PM – 8:15 PM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('E715-OF',  'Evening 7:15 In-Class',      '7:15 PM – 8:15 PM',   'offline', 'Mon–Sat', 200, 40, 30, 'active'),
  ('E815-OL',  'Evening 8:15 Online',        '8:15 PM – 9:15 PM',   'online',  'Mon–Sat', 200, 40, 30, 'active'),
  ('E815-OF',  'Evening 8:15 In-Class',      '8:15 PM – 9:15 PM',   'offline', 'Mon–Sat', 200, 40, 30, 'active')
ON CONFLICT (batch_code) DO NOTHING;

-- ──────────────────────────────────────────────
-- 3. ENROLLMENT PAUSES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollment_pauses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  member_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paused_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  resumed_at     TIMESTAMPTZ,
  reason         TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE enrollment_pauses ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Members see own pauses"
  ON enrollment_pauses FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Members insert own pauses"
  ON enrollment_pauses FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Members update own pauses"
  ON enrollment_pauses FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Admins all pauses"
  ON enrollment_pauses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- 4. SCHOOL SETTINGS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS school_settings (
  id                          INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  max_enrollments_per_member  INTEGER NOT NULL DEFAULT 1,
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure exactly one row
INSERT INTO school_settings (id, max_enrollments_per_member)
  VALUES (1, 1)
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can read settings"
  ON school_settings FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Admins update settings"
  ON school_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- 5. TESTIMONIALS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  rating        SMALLINT CHECK (rating BETWEEN 1 AND 5),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  display_order INTEGER,  -- non-null = shown on landing page, value = position
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS testimonials_member_unique ON testimonials(member_id);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Members see own testimonial"
  ON testimonials FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Approved testimonials visible to all"
  ON testimonials FOR SELECT
  USING (status = 'approved');

CREATE POLICY IF NOT EXISTS "Members insert own testimonial"
  ON testimonials FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Members update own testimonial"
  ON testimonials FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY IF NOT EXISTS "Admins all testimonials"
  ON testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- 6. EVENTS (ensure table exists)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en    TEXT NOT NULL,
  title_hi    TEXT,
  title_bn    TEXT,
  body_en     TEXT,
  body_hi     TEXT,
  body_bn     TEXT,
  media_url   TEXT,
  media_type  TEXT CHECK (media_type IN ('youtube','image','drive')),
  tags        TEXT[],
  event_date  DATE,
  pinned      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Events visible to all"
  ON events FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins manage events"
  ON events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- 7. DB TRIGGER — auto-create profile on signup
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, photo_url, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'member',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Done!
SELECT 'Schema v2 applied successfully ✓' AS result;
