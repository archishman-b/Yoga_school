-- Fix diet_preference and marital_status CHECK constraints
-- Run this in Supabase SQL Editor

-- 1. Fix diet_preference: add 'other', keep 'eggetarian', use underscores
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_diet_preference_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_diet_preference_check
  CHECK (diet_preference IN ('vegetarian','non_vegetarian','vegan','eggetarian','other'));

-- 2. Fix marital_status: form was sending 'single', DB expects 'unmarried'
--    Also add 'divorced' for completeness
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_marital_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_marital_status_check
  CHECK (marital_status IN ('unmarried','married','widowed','divorced','other'));
