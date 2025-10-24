-- ============================================
-- Migration: Create profiles, workouts, and sets tables
-- Description: Creates the core schema for workout tracking with RLS policies
-- ============================================

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  birthday DATE,
  height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg < 500),
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  training_experience TEXT CHECK (training_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
  goals TEXT[] DEFAULT '{}',
  injuries TEXT[] DEFAULT '{}',
  dominant_hand TEXT CHECK (dominant_hand IN ('left', 'right', 'ambidextrous')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide par auth_id
CREATE INDEX idx_profiles_auth_id ON profiles(auth_id);

-- ============================================
-- TABLE: workouts
-- ============================================
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les requ�tes
CREATE INDEX idx_workouts_profile_id ON workouts(profile_id);
CREATE INDEX idx_workouts_started_at ON workouts(started_at DESC);

-- ============================================
-- TABLE: sets
-- ============================================
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0),
  repetition INTEGER NOT NULL CHECK (repetition > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les requ�tes
CREATE INDEX idx_sets_workout_id ON sets(workout_id);
CREATE INDEX idx_sets_exercise_id ON sets(exercise_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Auto-update updated_at on all tables
-- ============================================
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sets_updated_at
  BEFORE UPDATE ON sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (auth_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Create profile on auth user creation
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();

-- ============================================
-- ROW LEVEL SECURITY: profiles
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = auth_id);

-- ============================================
-- ROW LEVEL SECURITY: workouts
-- ============================================
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workouts"
  ON workouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = workouts.profile_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own workouts"
  ON workouts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = workouts.profile_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workouts"
  ON workouts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = workouts.profile_id
      AND profiles.auth_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = workouts.profile_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workouts"
  ON workouts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = workouts.profile_id
      AND profiles.auth_id = auth.uid()
    )
  );

-- ============================================
-- ROW LEVEL SECURITY: sets
-- ============================================
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sets from their own workouts"
  ON sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sets for their own workouts"
  ON sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sets from their own workouts"
  ON sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets from their own workouts"
  ON sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );
