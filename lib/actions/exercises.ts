"use server"

import {
  getCategories as getCategoriesAPI,
  getCategoryById as getCategoryByIdAPI,
  getExerciseById as getExerciseByIdAPI,
  getExerciseByIdWithCategory as getExerciseByIdWithCategoryAPI,
  getExercises as getExercisesAPI,
  getExercisesByCategory as getExercisesByCategoryAPI,
  getExercisesWithCategory as getExercisesWithCategoryAPI,
  getExercisesWithSetsByWorkout as getExercisesWithSetsByWorkoutAPI,
} from "@/lib/api/exercises"

/**
 * Get all categories
 */
export async function getCategories() {
  return await getCategoriesAPI()
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(categoryId: string) {
  return await getCategoryByIdAPI(categoryId)
}

/**
 * Get all exercises
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercises(activeOnly: boolean = false) {
  return await getExercisesAPI(activeOnly)
}

/**
 * Get all exercises with their category information
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercisesWithCategory(activeOnly: boolean = false) {
  return await getExercisesWithCategoryAPI(activeOnly)
}

/**
 * Get exercises by category ID
 * @param categoryId - The category ID to filter by
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercisesByCategory(categoryId: string, activeOnly: boolean = false) {
  return await getExercisesByCategoryAPI(categoryId, activeOnly)
}

/**
 * Get a single exercise by ID
 */
export async function getExerciseById(exerciseId: number) {
  return await getExerciseByIdAPI(exerciseId)
}

/**
 * Get a single exercise by ID with its category information
 */
export async function getExerciseByIdWithCategory(exerciseId: number) {
  return await getExerciseByIdWithCategoryAPI(exerciseId)
}

/**
 * Get all exercises from a workout with their sets
 * @param workoutId - The workout ID
 */
export async function getExercisesWithSetsByWorkout(workoutId: string) {
  return await getExercisesWithSetsByWorkoutAPI(workoutId)
}
