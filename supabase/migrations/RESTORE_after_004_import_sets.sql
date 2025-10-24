-- ============================================
-- RESTORE: Import sets data after migration 004
-- Description: Restore your backed up sets with new exercise IDs
-- ============================================

-- This script will help you restore your sets after migration 004
-- Execute this AFTER running migration 004 successfully

-- ============================================
-- STEP 1: Verify backup table exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'backup_sets_before_004') THEN
    RAISE EXCEPTION 'Backup table not found! Please run the BACKUP script first.';
  END IF;
END $$;

-- ============================================
-- STEP 2: Create exercise mapping table
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_mapping_old_to_new (
  old_exercise_name TEXT,
  old_exercise_machine TEXT,
  new_exercise_id INTEGER REFERENCES exercises(id),
  PRIMARY KEY (old_exercise_name, old_exercise_machine)
);

-- ============================================
-- STEP 3: Show old exercises that need mapping
-- ============================================
SELECT DISTINCT
  old_exercise_name,
  old_exercise_machine,
  COUNT(*) as sets_count
FROM backup_sets_before_004
GROUP BY old_exercise_name, old_exercise_machine
ORDER BY sets_count DESC;

-- ============================================
-- STEP 4: Suggest potential matches (helper query)
-- ============================================
-- This query tries to find similar exercises in the new database
-- Review these suggestions and use them to fill the mapping table

SELECT
  b.old_exercise_name as "Ancien nom",
  b.old_exercise_machine as "Ancienne machine",
  e.title as "Nouveau titre suggéré",
  e.id as "Nouvel ID",
  c.name as "Catégorie"
FROM (
  SELECT DISTINCT old_exercise_name, old_exercise_machine
  FROM backup_sets_before_004
) b
CROSS JOIN exercises e
JOIN categories c ON c.id = e.category_id
WHERE
  -- Try to match by similar names (fuzzy matching)
  (
    LOWER(b.old_exercise_name) LIKE '%' || LOWER(SUBSTRING(e.title, 1, 10)) || '%'
    OR LOWER(e.title) LIKE '%' || LOWER(SUBSTRING(b.old_exercise_name, 1, 10)) || '%'
  )
  AND e.is_active = true
ORDER BY b.old_exercise_name, e.title;

-- ============================================
-- STEP 5: MANUAL STEP - Fill the mapping table
-- ============================================
-- Based on the suggestions above and your knowledge, insert mappings
-- Example format:

-- INSERT INTO exercise_mapping_old_to_new (old_exercise_name, old_exercise_machine, new_exercise_id) VALUES
--   ('Développé couché', 'Banc plat', (SELECT id FROM exercises WHERE title = 'Développé couché' LIMIT 1)),
--   ('Curl biceps assis', 'Poids libre', (SELECT id FROM exercises WHERE title = 'Curl pupitre barre EZ' LIMIT 1)),
--   ('Tirage horizontal à la poulie', 'Poulie basse', (SELECT id FROM exercises WHERE title = 'Tirage horizontal à la poulie' LIMIT 1));

-- TODO: Add your mappings here for each old exercise
-- Use the query from STEP 4 to help you find the right new_exercise_id

-- ============================================
-- STEP 6: Verify your mappings before restore
-- ============================================
SELECT
  m.old_exercise_name,
  m.old_exercise_machine,
  e.title as new_exercise_title,
  e.id as new_exercise_id,
  c.name as category,
  (
    SELECT COUNT(*)
    FROM backup_sets_before_004 b
    WHERE b.old_exercise_name = m.old_exercise_name
    AND b.old_exercise_machine = m.old_exercise_machine
  ) as sets_to_restore
FROM exercise_mapping_old_to_new m
JOIN exercises e ON e.id = m.new_exercise_id
JOIN categories c ON c.id = e.category_id
ORDER BY sets_to_restore DESC;

-- ============================================
-- STEP 7: Check for unmapped exercises (IMPORTANT!)
-- ============================================
-- This query shows exercises that don't have a mapping yet
SELECT DISTINCT
  b.old_exercise_name,
  b.old_exercise_machine,
  COUNT(*) as sets_without_mapping
FROM backup_sets_before_004 b
LEFT JOIN exercise_mapping_old_to_new m
  ON m.old_exercise_name = b.old_exercise_name
  AND m.old_exercise_machine = b.old_exercise_machine
WHERE m.new_exercise_id IS NULL
GROUP BY b.old_exercise_name, b.old_exercise_machine
ORDER BY sets_without_mapping DESC;

-- ============================================
-- STEP 8: Restore sets (only after all mappings are done!)
-- ============================================
-- UNCOMMENT THE LINES BELOW ONLY AFTER YOU'VE COMPLETED THE MAPPING

-- INSERT INTO sets (
--   id,
--   workout_id,
--   exercise_id,
--   weight,
--   repetition,
--   created_at,
--   updated_at
-- )
-- SELECT
--   b.set_id,
--   b.workout_id,
--   m.new_exercise_id,
--   b.weight,
--   b.repetition,
--   b.created_at,
--   b.updated_at
-- FROM backup_sets_before_004 b
-- JOIN exercise_mapping_old_to_new m
--   ON m.old_exercise_name = b.old_exercise_name
--   AND m.old_exercise_machine = b.old_exercise_machine;

-- ============================================
-- STEP 9: Verify restore was successful
-- ============================================
-- UNCOMMENT AFTER RESTORE

-- SELECT
--   COUNT(*) as total_sets_restored,
--   COUNT(DISTINCT workout_id) as total_workouts_restored,
--   COUNT(DISTINCT exercise_id) as total_exercises_used
-- FROM sets;

-- SELECT
--   e.title as exercise_name,
--   c.name as category,
--   COUNT(*) as number_of_sets,
--   MIN(s.weight) as min_weight,
--   MAX(s.weight) as max_weight,
--   AVG(s.weight)::DECIMAL(6,2) as avg_weight
-- FROM sets s
-- JOIN exercises e ON e.id = s.exercise_id
-- JOIN categories c ON c.id = e.category_id
-- GROUP BY e.title, c.name
-- ORDER BY number_of_sets DESC;

-- ============================================
-- STEP 10: Cleanup (optional, after verification)
-- ============================================
-- Once you've verified everything is correct, you can drop the backup tables

-- DROP TABLE IF EXISTS backup_sets_before_004;
-- DROP TABLE IF EXISTS exercise_mapping_old_to_new;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Do NOT uncomment STEP 8 until you've completed all mappings in STEP 5
-- 2. Run STEP 7 to verify all exercises are mapped before restoring
-- 3. Keep the backup tables until you're 100% sure everything works
-- 4. If you need to re-run the restore, truncate the sets table first:
--    TRUNCATE TABLE sets CASCADE;
-- ============================================
