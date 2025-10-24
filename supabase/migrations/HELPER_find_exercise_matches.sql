-- ============================================
-- HELPER: Find exercise matches
-- Description: Quick reference to help you map old exercises to new ones
-- ============================================

-- This is a helper script to run AFTER the BACKUP but BEFORE filling the mapping table
-- It helps you find the right new exercise IDs for your mappings

-- ============================================
-- Quick lookup: All new exercises organized by category
-- ============================================
SELECT
  c.name as "Catégorie",
  e.id as "ID",
  e.title as "Titre",
  e.is_active as "Actif"
FROM exercises e
JOIN categories c ON c.id = e.category_id
ORDER BY c.name, e.title;

-- ============================================
-- Your old exercises that need mapping
-- ============================================
SELECT DISTINCT
  old_exercise_name as "Ancien exercice",
  old_exercise_machine as "Machine",
  COUNT(*) as "Nb de sets"
FROM backup_sets_before_004
GROUP BY old_exercise_name, old_exercise_machine
ORDER BY COUNT(*) DESC;

-- ============================================
-- Smart matching: Find similar exercises by keywords
-- ============================================
-- Replace 'KEYWORD' with words from your old exercise names
-- Example: 'développé', 'curl', 'tirage', etc.

-- For "Développé couché"
SELECT id, title, category_id, is_active
FROM exercises
WHERE title ILIKE '%développé%couché%'
ORDER BY is_active DESC, title;

-- For "Curl biceps"
SELECT id, title, category_id, is_active
FROM exercises
WHERE title ILIKE '%curl%'
  AND title ILIKE '%biceps%'
ORDER BY is_active DESC, title;

-- For "Tirage"
SELECT id, title, category_id, is_active
FROM exercises
WHERE title ILIKE '%tirage%'
ORDER BY is_active DESC, title;

-- For "Rowing"
SELECT id, title, category_id, is_active
FROM exercises
WHERE title ILIKE '%rowing%'
ORDER BY is_active DESC, title;

-- ============================================
-- Generic keyword search template
-- ============================================
-- Use this template to search for any exercise

SELECT
  id as "ID",
  title as "Titre",
  category_id as "Catégorie",
  is_active as "Actif"
FROM exercises
WHERE
  -- Replace KEYWORD with your search term
  title ILIKE '%KEYWORD%'
ORDER BY is_active DESC, title;

-- ============================================
-- Common exercise mappings (examples)
-- ============================================
-- Based on the seed data, here are some common mappings you might use:

/*
Common Pectoraux exercises:
- "Développé couché" → (SELECT id FROM exercises WHERE title = 'Développé couché' LIMIT 1)
- "Développé incliné" → (SELECT id FROM exercises WHERE title = 'Développé incliné à la barre' LIMIT 1)
- "Pec deck" ou "Butterfly" → (SELECT id FROM exercises WHERE title = 'Pec-deck ou butterfly' LIMIT 1)

Common Dos exercises:
- "Tirage horizontal" → (SELECT id FROM exercises WHERE title = 'Tirage horizontal à la poulie' LIMIT 1)
- "Tirage vertical" → (SELECT id FROM exercises WHERE title = 'Tirage vertical poitrine' LIMIT 1)
- "Rowing" → (SELECT id FROM exercises WHERE title = 'Rowing barre' LIMIT 1)
- "Shrugs" → (SELECT id FROM exercises WHERE title = 'Shrugs avec haltères/poids' LIMIT 1)

Common Épaules exercises:
- "Développé épaules haltères" → (SELECT id FROM exercises WHERE title = 'Développé épaules avec haltères' LIMIT 1)
- "Oiseau" → (SELECT id FROM exercises WHERE title = 'Oiseau assis sur un banc ou debout' LIMIT 1)

Common Biceps exercises:
- "Curl pupitre" → (SELECT id FROM exercises WHERE title = 'Curl pupitre barre EZ' LIMIT 1)
- "Curl prise marteau" → (SELECT id FROM exercises WHERE title = 'Curl haltères prise neutre' LIMIT 1)
- "Curl incliné" → (SELECT id FROM exercises WHERE title = 'Curl biceps alterné en supination sur banc incliné' LIMIT 1)
*/

-- ============================================
-- Check if an exercise exists by exact title
-- ============================================
-- Use this to verify your mapping before adding it

SELECT
  id,
  title,
  category_id,
  is_active,
  CASE
    WHEN is_active THEN '✓ Actif - Bon choix'
    ELSE '⚠ Inactif - Choisir un actif si possible'
  END as "Statut"
FROM exercises
WHERE title = 'Titre exact de l''exercice'; -- Replace with exact title

-- ============================================
-- Find all variations of an exercise
-- ============================================
-- Example: Find all "développé" variations

SELECT
  c.name as "Catégorie",
  e.id as "ID",
  e.title as "Titre",
  e.is_active as "Actif"
FROM exercises e
JOIN categories c ON c.id = e.category_id
WHERE e.title ILIKE '%développé%'
ORDER BY e.is_active DESC, c.name, e.title;

-- ============================================
-- Count exercises by category and status
-- ============================================
SELECT
  c.name as "Catégorie",
  COUNT(*) as "Total",
  COUNT(*) FILTER (WHERE e.is_active) as "Actifs",
  COUNT(*) FILTER (WHERE NOT e.is_active) as "Inactifs"
FROM exercises e
JOIN categories c ON c.id = e.category_id
GROUP BY c.name
ORDER BY c.name;

-- ============================================
-- TEMPLATE: Generate your mapping INSERT
-- ============================================
-- Follow this format for each of your old exercises:

/*
INSERT INTO exercise_mapping_old_to_new (old_exercise_name, old_exercise_machine, new_exercise_id)
VALUES
  -- Copy this line for each old exercise
  ('Your old exercise name', 'Your old machine name',
   (SELECT id FROM exercises WHERE title = 'New exercise title' LIMIT 1)),

  -- Example for multiple mappings:
  ('Développé couché', 'Banc plat',
   (SELECT id FROM exercises WHERE title = 'Développé couché' LIMIT 1)),

  ('Curl biceps assis', 'Poids libre',
   (SELECT id FROM exercises WHERE title = 'Curl pupitre barre EZ' LIMIT 1)),

  ('Tirage horizontal à la poulie', 'Poulie basse',
   (SELECT id FROM exercises WHERE title = 'Tirage horizontal à la poulie' LIMIT 1));
*/

-- ============================================
-- Final tip: Test your mapping query before running it
-- ============================================
-- This query shows what your mapping will look like without actually inserting

SELECT
  'Your old exercise name' as old_exercise_name,
  'Your old machine name' as old_exercise_machine,
  e.id as new_exercise_id,
  e.title as new_exercise_title,
  c.name as category
FROM exercises e
JOIN categories c ON c.id = e.category_id
WHERE e.title = 'New exercise title'
LIMIT 1;
