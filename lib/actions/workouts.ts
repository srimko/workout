"use server"

import {
  autoCloseOldWorkouts as autoCloseOldWorkoutsAPI,
  createTodayWorkout as createTodayWorkoutAPI,
  endWorkout as endWorkoutAPI,
  getActiveWorkout as getActiveWorkoutAPI,
  getAllWorkouts as getAllWorkoutsAPI,
  getAllWorkoutsWithSets as getAllWorkoutsWithSetsAPI,
  getLastWorkout as getLastWorkoutAPI,
  getOrCreateTodayWorkout as getOrCreateTodayWorkoutAPI,
  getPrevWorkoutWithSets as getPrevWorkoutWithSetsAPI,
  getTodayWorkout as getTodayWorkoutAPI,
  resumeWorkout as resumeWorkoutAPI,
} from "@/lib/api/workouts"

/**
 * Get today's workout (or the most recent unfinished workout)
 */
export async function getTodayWorkout() {
  return await getTodayWorkoutAPI()
}

/**
 * Get last
 */
export async function getPrevWorkoutWithSets() {
  return await getPrevWorkoutWithSetsAPI()
}

/**
 * Get last
 */
export async function getLastWorkout() {
  return await getLastWorkoutAPI()
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
 * Resume a completed workout
 */
export async function resumeWorkout(workoutId: string) {
  return await resumeWorkoutAPI(workoutId)
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

/**
 * Auto-close old unfinished workouts (not from today)
 */
export async function autoCloseOldWorkouts() {
  return await autoCloseOldWorkoutsAPI()
}
