-- ─────────────────────────────────────────────────────────────────────────────
-- Nibedita Yoga Training Centre — Programme Practice Mappings Seed
-- Run this once in Supabase SQL Editor to populate illustrative practices.
-- Research-backed selections from the school's 91-practice curriculum.
-- ─────────────────────────────────────────────────────────────────────────────

-- Clear existing mappings (idempotent re-run)
DELETE FROM programme_practice_mappings
WHERE programme_id IN (
  'naval-correction', 'growth-development', 'height-enhancement',
  'anti-ageing', 'weight-management', 'healthy-ageing',
  'busy-lifestyle', 'digestive-health'
);

INSERT INTO programme_practice_mappings (programme_id, practice_id) VALUES

-- ── Naval Correction Programme ───────────────────────────────────────────────
-- Focus: abdominal tone, spinal alignment, postural correction
('naval-correction', 'tadasana'),               -- mountain pose: full postural alignment
('naval-correction', 'bhujangasana'),            -- cobra: strengthens lumbar, corrects sway-back
('naval-correction', 'shalabhasana'),            -- locust: deep lower-back and navel strengthening
('naval-correction', 'setu-bandha-sarvangasana'),-- bridge: core + lumbar stabilisation
('naval-correction', 'pawanmuktasana'),          -- wind-relieving: releases navel region
('naval-correction', 'ardha-matsyendrasana'),    -- seated twist: spinal mobility, core engagement

-- ── Growth & Development Programme ──────────────────────────────────────────
-- Focus: endocrine stimulation, bone density, full-body development (teens)
('growth-development', 'surya-namaskar'),        -- sun salutation: comprehensive warm-up
('growth-development', 'tadasana'),              -- mountain: spinal elongation, posture
('growth-development', 'trikonasana'),           -- triangle: lateral full-body stretch
('growth-development', 'sarvangasana'),          -- shoulder stand: thyroid & pituitary stimulation
('growth-development', 'chakrasana'),            -- wheel: spinal extension, energy
('growth-development', 'halasana'),              -- plough: thyroid stimulation, hamstrings

-- ── Height Enhancement Programme ────────────────────────────────────────────
-- Focus: spinal decompression, stretch connective tissue, improve posture
('height-enhancement', 'tadasana'),              -- mountain: upright alignment
('height-enhancement', 'trikonasana'),           -- triangle: lateral stretch
('height-enhancement', 'utkatasana'),            -- chair: leg strength + upright carriage
('height-enhancement', 'chakrasana'),            -- wheel: full spinal extension
('height-enhancement', 'halasana'),              -- plough: spinal elongation
('height-enhancement', 'viparita-karani'),       -- legs-up-wall: inversion, spinal decompression

-- ── Anti-Ageing & Vitality ───────────────────────────────────────────────────
-- Focus: circulation, glandular function, cellular rejuvenation
('anti-ageing', 'sarvangasana'),                 -- shoulder stand: queen of asanas, full endocrine
('anti-ageing', 'sirsasana'),                    -- headstand: king of asanas, brain circulation
('anti-ageing', 'viparita-karani'),              -- gentle inversion, restorative
('anti-ageing', 'setu-bandha-sarvangasana'),     -- bridge: energising, thyroid
('anti-ageing', 'anulom-vilom'),                 -- alternate nostril: balances nadis
('anti-ageing', 'kapal-bhati'),                  -- skull-shining breath: cellular cleanse

-- ── Weight Management Programme ──────────────────────────────────────────────
-- Focus: metabolic activation, calorie burn, digestive fire
('weight-management', 'surya-namaskar'),         -- sun salutation: full-body metabolism boost
('weight-management', 'kapal-bhati'),            -- activates digestive fire (agni)
('weight-management', 'vastrika'),               -- bellows breath: heat-generating
('weight-management', 'utkatasana'),             -- chair pose: thighs + core, high effort
('weight-management', 'navasana'),               -- boat: core strength, abdominal tone
('weight-management', 'trikonasana'),            -- triangle: side body, comprehensive

-- ── Healthy Ageing Programme ─────────────────────────────────────────────────
-- Focus: gentle mobility, balance, joint health, mental calm (seniors)
('healthy-ageing', 'tadasana'),                  -- mountain: grounding, balance
('healthy-ageing', 'setu-bandha-sarvangasana'),  -- bridge: gentle back bend, hip opener
('healthy-ageing', 'sukhasana'),                 -- easy seat: hip mobility, meditation
('healthy-ageing', 'balasana'),                  -- child's pose: restorative, spine release
('healthy-ageing', 'viparita-karani'),           -- legs up wall: circulation, rest
('healthy-ageing', 'savasana'),                  -- corpse: deep relaxation, integration

-- ── Yoga for Busy Lifestyles ─────────────────────────────────────────────────
-- Focus: maximum benefit in minimum time, stress relief, energy
('busy-lifestyle', 'surya-namaskar'),            -- 12-pose sequence: full practice in 10 min
('busy-lifestyle', 'anulom-vilom'),              -- alternate nostril: instant stress reset
('busy-lifestyle', 'kapal-bhati'),               -- energising breath: clears mental fog
('busy-lifestyle', 'uttanasana'),                -- standing forward fold: decompresses spine
('busy-lifestyle', 'bhujangasana'),              -- cobra: quick energy, opens chest
('busy-lifestyle', 'savasana'),                  -- corpse: essential even in short sessions

-- ── Digestive Health Programme ───────────────────────────────────────────────
-- Focus: abdominal massage, gut motility, liver & pancreas stimulation
('digestive-health', 'pawanmuktasana'),          -- wind-relieving: moves trapped gas
('digestive-health', 'malasana'),                -- squat: stimulates bowel, digestive fire
('digestive-health', 'ardha-matsyendrasana'),    -- seated twist: squeezes liver, pancreas
('digestive-health', 'kapal-bhati'),             -- rapid breath: massages abdominal organs
('digestive-health', 'dhanurasana'),             -- bow: rocks on abdomen, massage effect
('digestive-health', 'navasana');                -- boat: strengthens digestive muscles

-- Verify counts
SELECT programme_id, COUNT(*) AS practice_count
FROM programme_practice_mappings
GROUP BY programme_id
ORDER BY programme_id;
