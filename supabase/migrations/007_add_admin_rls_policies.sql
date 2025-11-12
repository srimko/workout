-- ============================================
-- Migration: Add admin RLS policies
-- Description: Permet à l'admin de gérer toutes les données (profiles, workouts, sets)
-- ============================================

-- ============================================
-- RLS POLICIES: Admin can do everything on profiles
-- ============================================

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can insert any profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text)
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can delete any profile"
  ON profiles FOR DELETE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

-- ============================================
-- RLS POLICIES: Admin can do everything on workouts
-- ============================================

CREATE POLICY "Admin can view all workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can insert any workout"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can update any workouts"
  ON workouts FOR UPDATE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text)
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can delete any workout"
  ON workouts FOR DELETE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

-- ============================================
-- RLS POLICIES: Admin can do everything on sets
-- ============================================

CREATE POLICY "Admin can view all sets"
  ON sets FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can insert any set"
  ON sets FOR INSERT
  TO authenticated
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can update all sets"
  ON sets FOR UPDATE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text)
  WITH CHECK ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);

CREATE POLICY "Admin can delete any set"
  ON sets FOR DELETE
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'cedrick.flocon@gmail.com'::text);
