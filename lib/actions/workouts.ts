"use server"

import {
  getTodayWorkout as getTodayWorkoutAPI,
  getActiveWorkout as getActiveWorkoutAPI,
  createTodayWorkout as createTodayWorkoutAPI,
  getOrCreateTodayWorkout as getOrCreateTodayWorkoutAPI,
  endWorkout as endWorkoutAPI,
  getAllWorkouts as getAllWorkoutsAPI,
  getAllWorkoutsWithSets as getAllWorkoutsWithSetsAPI,
} from "@/lib/api/workouts"

/**
 * Get today's workout (or the most recent unfinished workout)
 */
export async function getTodayWorkout() {
  return await getTodayWorkoutAPI()
}

/**
 * Get the active workout (unfinished workout)
 */
export async function getActiveWorkout() {
  return await getActiveWorkoutAPI()
}

/**
 * Create a new workout for today
 */
export async function createTodayWorkout(title?: string) {
  return await createTodayWorkoutAPI(title)
}

/**
 * Get or create today's workout
 * Returns the active workout or creates one if none exists
 */
export async function getOrCreateTodayWorkout() {
  return await getOrCreateTodayWorkoutAPI()
}

/**
 * End a workout
 */
export async function endWorkout(workoutId: string) {
  return await endWorkoutAPI(workoutId)
}

/**
 * Get all workouts for the current user
 */
export async function getAllWorkouts() {
  return await getAllWorkoutsAPI()
}

/**
 * Get all workouts for the current user with their sets (including exercise info)
 */
export async function getAllWorkoutsWithSets() {
  return await getAllWorkoutsWithSetsAPI()
}
