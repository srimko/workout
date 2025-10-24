-- ============================================
-- BACKUP: Export sets and exercises data before migration 004
-- Description: Save all existing sets with their exercise information
-- ============================================

-- This script will export your existing data to help you restore it after migration
-- Execute this BEFORE running migration 004

-- ============================================
-- STEP 1: Create a temporary backup table for sets
-- ============================================
CREATE TABLE IF NOT EXISTS backup_sets_before_004 (
  set_id UUID,
  workout_id UUID,
  old_exercise_id INTEGER,
  old_exercise_name TEXT,
  old_exercise_machine TEXT,
  weight DECIMAL(6,2),
  repetition INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- ============================================
-- STEP 2: Insert all existing sets with exercise information
-- ============================================
INSERT INTO backup_sets_before_004 (
  set_id,
  workout_id,
  old_exercise_id,
  old_exercise_name,
  old_exercise_machine,
  weight,
  repetition,
  created_at,
  updated_at
)
SELECT
  s.id as set_id,
  s.workout_id,
  s.exercise_id as old_exercise_id,
  e.name as old_exercise_name,
  e.machine as old_exercise_machine,
  s.weight,
  s.repetition,
  s.created_at,
  s.updated_at
FROM sets s
JOIN exercises e ON e.id = s.exercise_id
ORDER BY s.created_at;

-- ============================================
-- STEP 3: Display backup summary
-- ============================================
SELECT
  COUNT(*) as total_sets_backed_up,
  COUNT(DISTINCT workout_id) as total_workouts,
  COUNT(DISTINCT old_exercise_id) as total_different_exercises
FROM backup_sets_before_004;

-- ============================================
-- STEP 4: Display detailed backup by exercise
-- ============================================
SELECT
  old_exercise_name,
  old_exercise_machine,
  COUNT(*) as number_of_sets,
  MIN(weight) as min_weight,
  MAX(weight) as max_weight,
  AVG(weight)::DECIMAL(6,2) as avg_weight
FROM backup_sets_before_004
GROUP BY old_exercise_name, old_exercise_machine
ORDER BY number_of_sets DESC;

-- ============================================
-- STEP 5: Export to CSV format (copy this result)
-- ============================================
-- Copy the output of this query to save your data externally
SELECT
  set_id,
  workout_id,
  old_exercise_name,
  old_exercise_machine,
  weight,
  repetition,
  created_at,
  updated_at
FROM backup_sets_before_004
ORDER BY created_at;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Copy the CSV output from STEP 5 to a safe location
-- 2. Keep note of the exercise name/machine combinations
-- 3. After migration 004, you'll need to manually map old exercises to new ones
-- 4. Use the RESTORE script to re-import your sets
-- ============================================
