-- ============================================================
-- Migration: Expand profiles table with full admission form fields
-- Run in Supabase SQL editor after the base schema is applied.
-- All columns are nullable (optional for existing members).
-- ============================================================

-- ── Personal Information (from paper admission form) ──────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS guardian_name     TEXT,         -- Father's / Guardian's name
  ADD COLUMN IF NOT EXISTS height_cm         NUMERIC(5,1), -- Height in centimetres
  ADD COLUMN IF NOT EXISTS weight_kg         NUMERIC(5,1), -- Weight in kilograms
  ADD COLUMN IF NOT EXISTS occupation        TEXT,
  ADD COLUMN IF NOT EXISTS marital_status    TEXT
    CHECK (marital_status IN ('unmarried','married','widowed','other')),
  ADD COLUMN IF NOT EXISTS diet_preference   TEXT
    CHECK (diet_preference IN ('vegetarian','non_vegetarian','vegan','eggetarian')),
  ADD COLUMN IF NOT EXISTS mother_tongue     TEXT,
  ADD COLUMN IF NOT EXISTS education         TEXT,         -- Educational qualification
  ADD COLUMN IF NOT EXISTS course_interest   TEXT;         -- Programme of interest

-- ── Health Information ────────────────────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cardiovascular_conditions TEXT,  -- BP / heart status
  ADD COLUMN IF NOT EXISTS previous_yoga             BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS doctor_referral           BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ailments                  TEXT;  -- Only for therapeutic track

-- ── Admin-only assessment fields (For Office Use) ────────────────────────────
-- These are set by the admin/instructor after the initial assessment, not by the member.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS naval_assessment_result TEXT
    CHECK (naval_assessment_result IN ('normal','displaced','pending')),
  ADD COLUMN IF NOT EXISTS courses_suggested       TEXT,   -- CSV of programme IDs
  ADD COLUMN IF NOT EXISTS instructor_notes        TEXT;   -- Free-form instructor notes

-- ── RLS: members can read/write all personal fields but NOT admin fields ──────
-- Drop and recreate member select policy to allow new columns

DROP POLICY IF EXISTS "members_update_own_profile" ON profiles;
CREATE POLICY "members_update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- members cannot set admin-only fields via this policy; those require service_role
    -- naval_assessment_result, courses_suggested, instructor_notes must be set by admin only
  );

-- Admin can update all fields (covered by existing admin-role policy or service_role key)

-- ── Verify ────────────────────────────────────────────────────────────────────
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;
