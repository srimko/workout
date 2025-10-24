-- ============================================
-- Migration: Seed exercises table
-- Description: Insert initial exercises data
-- ============================================

-- Insert exercises
INSERT INTO exercises (id, name, machine) VALUES
  (1, 'Développé couché', 'Banc plat'),
  (2, 'Développé couché', 'Banc incliné'),
  (3, 'Fly pectoraux', 'Fly chest'),
  (4, 'Tirage horizontal à la poulie', 'Poulie basse'),
  (5, 'Tirage vertical à la poulie', 'Poulie haute'),
  (6, 'Développé épaules à la machine', 'overhead press'),
  (7, 'Oiseau', 'Poids libre'),
  (9, 'Curl biceps assis', 'Poids libre'),
  (10, 'Curl haltère incliné assis', 'Poids libre'),
  (11, 'Curl haltère prise marteau dos au mur', 'Poids libre')
ON CONFLICT (id) DO NOTHING;
