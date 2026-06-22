-- ============================================================
-- Migration: Member ID system + extended profile fields
-- Nibedita Yoga Training Centre
-- Run in Supabase SQL Editor (idempotent — safe to re-run).
-- ============================================================

-- ── 1. member_id column ──────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_id TEXT;

-- Unique index (not just constraint so we can use IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_member_id_key ON profiles (member_id)
  WHERE member_id IS NOT NULL;

-- ── 2. Extended demographic / health fields ──────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guardian_name            TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height_cm               NUMERIC(5,1);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_kg               NUMERIC(5,1);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation              TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marital_status          TEXT;  -- single | married | widowed | divorced | other
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS diet_preference         TEXT;  -- vegetarian | non-vegetarian | vegan | other
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mother_tongue           TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education               TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cardiovascular_conditions TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS previous_yoga           BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS doctor_referral         BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ailments                TEXT;   -- therapeutic ailments (text area)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_interest         TEXT;   -- which programme(s) they are interested in
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS naval_assessment_result TEXT;  -- normal | displaced (set by admin after in-person check)

-- ── 3. Helper function: generate a unique NYT-XXXX member ID ─────────────────
--    Retries until a vacant slot is found. Raises after 100 attempts.
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
  attempts  INT := 0;
BEGIN
  LOOP
    -- Random 4-digit number in 1000–9999
    candidate := 'NYT-' || LPAD((1000 + floor(random() * 9000)::INT)::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE member_id = candidate);
    attempts := attempts + 1;
    IF attempts >= 100 THEN
      RAISE EXCEPTION 'generate_member_id: could not find a unique slot after 100 tries';
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

-- ── 4. RLS: members may read their own member_id but not change it ────────────
--    (Existing RLS policies on profiles already gate updates; this is a reminder
--    comment. If you restrict UPDATE via RLS, ensure admins can still write.)

-- ── 5. Index for fast member_id lookups during login ─────────────────────────
--    (Covered by the unique index above — no extra index needed.)

-- Done ✓
