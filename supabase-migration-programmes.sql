-- ============================================================
-- Migration: Programme-practice mappings for the Practice Library
-- Run in Supabase SQL editor.
-- ============================================================

-- ── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS programme_practice_mappings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id TEXT NOT NULL,   -- matches PROGRAMMES[n].id in courses/page.tsx
  practice_id  TEXT NOT NULL,   -- matches practices[n].slug in practices.ts
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (programme_id, practice_id)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE programme_practice_mappings ENABLE ROW LEVEL SECURITY;

-- Public can read (needed by courses page to show suggested practices)
DROP POLICY IF EXISTS "public_read_mappings" ON programme_practice_mappings;
CREATE POLICY "public_read_mappings" ON programme_practice_mappings
  FOR SELECT USING (true);

-- Only admins can insert / update / delete
DROP POLICY IF EXISTS "admin_manage_mappings" ON programme_practice_mappings;
CREATE POLICY "admin_manage_mappings" ON programme_practice_mappings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ── Seed: default mappings ────────────────────────────────────────────────────
-- These match DEFAULT_PROGRAMME_MAPPINGS in src/lib/data/practices.ts.
-- If this table is empty the app falls back to the static defaults anyway.

INSERT INTO programme_practice_mappings (programme_id, practice_id) VALUES
  ('naval-correction',   'pawanmuktasana'),
  ('naval-correction',   'bhujangasana'),
  ('naval-correction',   'dhanurasana'),
  ('naval-correction',   'kapal-bhati'),
  ('naval-correction',   'navasana'),
  ('naval-correction',   'ardha-matsyendrasana'),

  ('growth-development', 'tadasana'),
  ('growth-development', 'sarvangasana'),
  ('growth-development', 'trikonasana'),
  ('growth-development', 'surya-namaskar'),
  ('growth-development', 'chakrasana'),
  ('growth-development', 'halasana'),

  ('height-enhancement', 'tadasana'),
  ('height-enhancement', 'trikonasana'),
  ('height-enhancement', 'halasana'),
  ('height-enhancement', 'chakrasana'),
  ('height-enhancement', 'viparita-karani'),
  ('height-enhancement', 'utkatasana'),

  ('anti-ageing',        'sarvangasana'),
  ('anti-ageing',        'sirsasana'),
  ('anti-ageing',        'setu-bandha-sarvangasana'),
  ('anti-ageing',        'viparita-karani'),
  ('anti-ageing',        'anulom-vilom'),
  ('anti-ageing',        'kapal-bhati'),

  ('weight-management',  'surya-namaskar'),
  ('weight-management',  'kapal-bhati'),
  ('weight-management',  'vastrika'),
  ('weight-management',  'utkatasana'),
  ('weight-management',  'navasana'),
  ('weight-management',  'trikonasana'),

  ('healthy-ageing',     'tadasana'),
  ('healthy-ageing',     'balasana'),
  ('healthy-ageing',     'sukhasana'),
  ('healthy-ageing',     'setu-bandha-sarvangasana'),
  ('healthy-ageing',     'viparita-karani'),
  ('healthy-ageing',     'savasana'),

  ('busy-lifestyle',     'surya-namaskar'),
  ('busy-lifestyle',     'anulom-vilom'),
  ('busy-lifestyle',     'kapal-bhati'),
  ('busy-lifestyle',     'uttanasana'),
  ('busy-lifestyle',     'bhujangasana'),
  ('busy-lifestyle',     'savasana'),

  ('digestive-health',   'pawanmuktasana'),
  ('digestive-health',   'malasana'),
  ('digestive-health',   'ardha-matsyendrasana'),
  ('digestive-health',   'kapal-bhati'),
  ('digestive-health',   'dhanurasana'),
  ('digestive-health',   'navasana')

ON CONFLICT (programme_id, practice_id) DO NOTHING;

-- ── Verify ────────────────────────────────────────────────────────────────────
-- SELECT programme_id, count(*) FROM programme_practice_mappings GROUP BY programme_id;
