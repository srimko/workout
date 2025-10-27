"use server"

import {
  createSet as createSetAPI,
  createSetByExerciseTitle as createSetByExerciseTitleAPI,
  getSetsByWorkout as getSetsByWorkoutAPI,
  getSetsByExercise as getSetsByExerciseAPI,
  deleteSet as deleteSetAPI,
  updateSet as updateSetAPI,
} from "@/lib/api/sets"

/**
 * Create a new set
 */
export async function createSet(
  exerciseId: number,
  weight: number,
  repetition: number,
  workoutId?: string,
) {
  return await createSetAPI(exerciseId, weight, repetition, workoutId)
}

/**
 * Create a set by exercise title (searches for the exercise first)
 */
export async function createSetByExerciseTitle(
  exerciseTitle: string,
  weight: number,
  repetition: number,
  workoutId?: string,
) {
  return await createSetByExerciseTitleAPI(exerciseTitle, weight, repetition, workoutId)
}

/**
 * Get all sets for a workout
 */
export async function getSetsByWorkout(workoutId: string) {
  return await getSetsByWorkoutAPI(workoutId)
}

/**
 * Get all sets for an exercise
 */
export async function getSetsByExercise(exerciseId: number) {
  return await getSetsByExerciseAPI(exerciseId)
}

/**
 * Delete a set
 */
export async function deleteSet(setId: string) {
  return await deleteSetAPI(setId)
}

/**
 * Update a set
 */
export async function updateSet(
  setId: string,
  updates: { weight?: number; repetition?: number },
) {
  return await updateSetAPI(setId, updates)
}
