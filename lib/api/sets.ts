import "server-only"

import type { Set } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { getExercises } from "./exercises"
import { getOrCreateTodayWorkout } from "./workouts"

/**
 * Create a new set
 */
export async function createSet(
  exerciseId: number,
  weight: number,
  repetition: number,
  workoutId?: string,
): Promise<Set | null> {
  const supabase = await createClient()

  // If no workoutId provided, get or create today's workout
  let finalWorkoutId = workoutId
  if (!finalWorkoutId) {
    const workout = await getOrCreateTodayWorkout()
    if (!workout) {
      console.error("Failed to get or create workout")
      return null
    }
    finalWorkoutId = workout.id
  }

  const { data, error } = await supabase
    .from("sets")
    .insert({
      workout_id: finalWorkoutId,
      exercise_id: exerciseId,
      weight,
      repetition,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating set:", error)
    return null
  }

  return data
}

/**
 * Create a set by exercise title (searches for the exercise first)
 */
export async function createSetByExerciseTitle(
  exerciseTitle: string,
  weight: number,
  repetition: number,
  workoutId?: string,
): Promise<Set | null> {
  // Find the exercise by title
  const exercises = await getExercises(true) // Only active exercises
  const exercise = exercises.find((ex) => ex.title === exerciseTitle)

  if (!exercise) {
    console.error(`Exercise not found: ${exerciseTitle}`)
    return null
  }

  return createSet(exercise.id, weight, repetition, workoutId)
}

/**
 * Get all sets for a workout
 */
export async function getSetsByWorkout(workoutId: string): Promise<Set[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sets")
    .select("*")
    .eq("workout_id", workoutId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching sets:", error)
    return []
  }

  return data || []
}

/**
 * Get all sets for a workout with exercise information (title, category)
 * This is more efficient than fetching sets and exercises separately
 */
export async function getSetsByWorkoutWithExercises(
  workoutId: string,
): Promise<
  Array<
    Set & {
      exercise: {
        id: number
        title: string
        image: string
        category_id: string
        category: {
          id: string
          name: string
          image: string
        }
      }
    }
  >
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sets")
    .select(
      `
      *,
      exercise:exercises(
        id,
        title,
        image,
        category_id,
        category:categories(
          id,
          name,
          image
        )
      )
    `,
    )
    .eq("workout_id", workoutId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching sets with exercises:", error)
    return []
  }

  return data || []
}

/**
 * Get all sets for an exercise
 */
export async function getSetsByExercise(exerciseId: number): Promise<Set[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sets")
    .select("*")
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sets:", error)
    return []
  }

  return data || []
}

/**
 * Delete a set
 */
export async function deleteSet(setId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("sets").delete().eq("id", setId)

  if (error) {
    console.error("Error deleting set:", error)
    return false
  }

  return true
}

/**
 * Update a set
 */
export async function updateSet(
  setId: string,
  updates: { weight?: number; repetition?: number },
): Promise<Set | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sets")
    .update(updates)
    .eq("id", setId)
    .select()
    .single()

  if (error) {
    console.error("Error updating set:", error)
    return null
  }

  return data
}
