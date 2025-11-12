"use server"

import {
  getAllUsers as getAllUsersAPI,
  getUserWithWorkouts as getUserWithWorkoutsAPI,
  createSet as createSetAPI,
  updateSet as updateSetAPI,
  deleteSet as deleteSetAPI,
  updateWorkout as updateWorkoutAPI,
  deleteWorkout as deleteWorkoutAPI,
  deleteUser as deleteUserAPI,
  getGlobalStats as getGlobalStatsAPI,
} from "@/lib/api/admin"

/**
 * Récupérer tous les utilisateurs avec leurs stats
 */
export async function getAllUsers() {
  return await getAllUsersAPI()
}

/**
 * Récupérer un utilisateur avec tous ses workouts et sets
 */
export async function getUserWithWorkouts(userId: string) {
  return await getUserWithWorkoutsAPI(userId)
}

/**
 * Créer un nouveau set
 */
export async function createSet(
  workoutId: string,
  exerciseId: number,
  weight: number,
  repetition: number,
  createdAt?: string,
) {
  return await createSetAPI(workoutId, exerciseId, weight, repetition, createdAt)
}

/**
 * Modifier un set
 */
export async function updateSet(
  setId: string,
  data: { weight?: number; repetition?: number; workout_id?: string },
) {
  return await updateSetAPI(setId, data)
}

/**
 * Supprimer un set
 */
export async function deleteSet(setId: string) {
  return await deleteSetAPI(setId)
}

/**
 * Modifier un workout
 */
export async function updateWorkout(
  workoutId: string,
  data: { title?: string; started_at?: string; ended_at?: string },
) {
  return await updateWorkoutAPI(workoutId, data)
}

/**
 * Supprimer un workout
 */
export async function deleteWorkout(workoutId: string) {
  return await deleteWorkoutAPI(workoutId)
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUser(userId: string) {
  return await deleteUserAPI(userId)
}

/**
 * Récupérer les statistiques globales
 */
export async function getGlobalStats() {
  return await getGlobalStatsAPI()
}
