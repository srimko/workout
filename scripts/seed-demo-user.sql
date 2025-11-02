-- Seed data for demo@mail.com user
-- This script generates 3 months of workout data (36 workouts, ~900 sets)
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  v_profile_id uuid;
  v_workout_id uuid;
  v_workout_date timestamp with time zone;
  v_workout_type text;
  v_workout_index int := 0;
  v_week_num int;
  v_set_count int;
  v_exercise_id int;
  v_weight numeric;
  v_reps int;
  v_push_exercises int[];
  v_pull_exercises int[];
  v_leg_exercises int[];
  week int;
  v_day_of_week int;
  set_idx int;
BEGIN
  -- 1. Get the profile_id for demo@mail.com
  SELECT p.id INTO v_profile_id
  FROM profiles p
  JOIN auth.users u ON u.id = p.auth_id
  WHERE u.email = 'demo@mail.com';

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile for demo@mail.com not found. Please create the user first.';
  END IF;

  RAISE NOTICE 'Found profile: %', v_profile_id;

  -- 2. Get exercises by category (using EXACT category names from your DB)
  -- Push exercises (Pectoraux, Épaules)
  SELECT ARRAY_AGG(id) INTO v_push_exercises
  FROM (
    SELECT e.id
    FROM exercises e
    JOIN categories c ON c.id = e.category_id
    WHERE e.is_active = true
      AND c.name IN ('Pectoraux', 'Épaules')
    ORDER BY e.id
    LIMIT 20
  ) push_sub;

  -- Pull exercises (Dos, Biceps)
  SELECT ARRAY_AGG(id) INTO v_pull_exercises
  FROM (
    SELECT e.id
    FROM exercises e
    JOIN categories c ON c.id = e.category_id
    WHERE e.is_active = true
      AND c.name IN ('Dos', 'Biceps')
    ORDER BY e.id
    LIMIT 20
  ) pull_sub;

  -- Upper body mix (all exercises for variety) - replaces leg day
  SELECT ARRAY_AGG(id) INTO v_leg_exercises
  FROM (
    SELECT e.id
    FROM exercises e
    JOIN categories c ON c.id = e.category_id
    WHERE e.is_active = true
      AND c.name IN ('Pectoraux', 'Dos', 'Épaules', 'Biceps')
    ORDER BY RANDOM()
    LIMIT 20
  ) upper_sub;

  RAISE NOTICE 'Exercises found - Push: %, Pull: %, Upper Mix: %',
    array_length(v_push_exercises, 1),
    array_length(v_pull_exercises, 1),
    array_length(v_leg_exercises, 1);

  -- Verify we have exercises
  IF v_push_exercises IS NULL OR array_length(v_push_exercises, 1) IS NULL THEN
    RAISE EXCEPTION 'No push exercises found in categories: Pectoraux, Épaules';
  END IF;
  IF v_pull_exercises IS NULL OR array_length(v_pull_exercises, 1) IS NULL THEN
    RAISE EXCEPTION 'No pull exercises found in categories: Dos, Biceps';
  END IF;
  IF v_leg_exercises IS NULL OR array_length(v_leg_exercises, 1) IS NULL THEN
    RAISE EXCEPTION 'No exercises found for upper body mix';
  END IF;

  -- 3. Generate 36 workouts (3 per week for 12 weeks)
  FOR week IN 0..11 LOOP
    FOREACH v_day_of_week IN ARRAY ARRAY[1, 3, 5] LOOP  -- Monday, Wednesday, Friday
      -- Calculate workout date
      v_workout_date := (CURRENT_DATE - interval '3 months' + (week * 7) * interval '1 day');
      v_workout_date := v_workout_date + (v_day_of_week - 1) * interval '1 day';
      v_workout_date := v_workout_date + interval '10 hours';  -- Start at 10 AM

      -- Determine workout type (rotation: Push, Pull, Upper Mix)
      v_workout_type := CASE (v_workout_index % 3)
        WHEN 0 THEN 'Push'
        WHEN 1 THEN 'Pull'
        WHEN 2 THEN 'Upper Body Mix'
      END;

      v_week_num := week;
      v_set_count := CASE (v_workout_index % 3)
        WHEN 0 THEN 25  -- Push
        WHEN 1 THEN 22  -- Pull
        WHEN 2 THEN 24  -- Upper Mix
      END;

      -- Create workout
      INSERT INTO workouts (profile_id, title, started_at, ended_at)
      VALUES (
        v_profile_id,
        v_workout_type || ' Workout - Week ' || (week + 1),
        v_workout_date,
        v_workout_date + interval '1.5 hours'
      )
      RETURNING id INTO v_workout_id;

      -- Generate sets for this workout
      FOR set_idx IN 1..v_set_count LOOP
        -- Select exercise based on workout type
        IF v_workout_type = 'Push' THEN
          v_exercise_id := v_push_exercises[((set_idx - 1) % array_length(v_push_exercises, 1)) + 1];
          v_weight := 40 + (v_week_num * 1.25) + ((set_idx % 3) * 2.5);
        ELSIF v_workout_type = 'Pull' THEN
          v_exercise_id := v_pull_exercises[((set_idx - 1) % array_length(v_pull_exercises, 1)) + 1];
          v_weight := 50 + (v_week_num * 1.25) + ((set_idx % 3) * 2.5);
        ELSE -- Upper Body Mix
          v_exercise_id := v_leg_exercises[((set_idx - 1) % array_length(v_leg_exercises, 1)) + 1];
          v_weight := 45 + (v_week_num * 1.25) + ((set_idx % 3) * 2.5);
        END IF;

        -- Determine reps (warmup sets have more reps)
        IF set_idx <= 3 THEN
          v_reps := 12;
        ELSIF set_idx <= 6 THEN
          v_reps := 10;
        ELSE
          v_reps := 8;
        END IF;

        -- Round weight to nearest 0.25kg
        v_weight := ROUND(v_weight * 4) / 4;

        -- Insert set
        INSERT INTO sets (workout_id, exercise_id, weight, repetition)
        VALUES (v_workout_id, v_exercise_id, v_weight, v_reps);
      END LOOP;

      v_workout_index := v_workout_index + 1;

      IF v_workout_index % 6 = 0 THEN
        RAISE NOTICE 'Progress: % workouts created...', v_workout_index;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE '✅ Seeding complete! Created % workouts', v_workout_index;
END $$;
