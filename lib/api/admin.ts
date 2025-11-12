import "server-only"

import type { Profile, Workout, WorkoutWithSets, Set } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

/**
 * Vérifie si l'utilisateur actuel est admin
 */
async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  return user.email === process.env.ADMIN_EMAIL
}

/**
 * Throw une erreur si l'utilisateur n'est pas admin
 */
async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }
}

/**
 * Type pour un utilisateur avec ses statistiques
 */
export interface UserWithStats extends Profile {
  email: string | null
  nb_workouts: number
  nb_sets: number
  last_connection: string | null
}

/**
 * Type pour un utilisateur avec tous ses workouts et sets
 */
export interface UserWithWorkouts extends Profile {
  email: string | null
  workouts: WorkoutWithSets[]
}

/**
 * Type pour les statistiques globales
 */
export interface GlobalStats {
  total_users: number
  workouts_today: number
  sets_today: number
  active_users: number
}

/**
 * Récupérer tous les utilisateurs avec leurs stats
 */
export async function getAllUsers(): Promise<UserWithStats[]> {
  await requireAdmin()

  const supabase = await createClient()

  // Récupérer tous les profils
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError)
    return []
  }

  if (!profiles || profiles.length === 0) return []

  // Pour chaque profil, récupérer les stats
  const usersWithStats = await Promise.all(
    profiles.map(async (profile) => {
      // Récupérer l'email depuis auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.auth_id)

      // Compter les workouts
      const { count: workoutsCount } = await supabase
        .from("workouts")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profile.id)

      // Récupérer les IDs des workouts pour compter les sets
      const { data: userWorkouts } = await supabase
        .from("workouts")
        .select("id")
        .eq("profile_id", profile.id)

      const workoutIds = userWorkouts?.map((w) => w.id) || []

      // Compter les sets
      let setsCount = 0
      if (workoutIds.length > 0) {
        const { count } = await supabase
          .from("sets")
          .select("*", { count: "exact", head: true })
          .in("workout_id", workoutIds)
        setsCount = count || 0
      }

      // Récupérer la dernière connexion (last_sign_in_at de auth.users)
      const lastConnection = authUser?.user?.last_sign_in_at || null

      return {
        ...profile,
        email: authUser?.user?.email || null,
        nb_workouts: workoutsCount || 0,
        nb_sets: setsCount || 0,
        last_connection: lastConnection,
      }
    }),
  )

  return usersWithStats
}

/**
 * Récupérer un utilisateur avec tous ses workouts et sets
 */
export async function getUserWithWorkouts(userId: string): Promise<UserWithWorkouts | null> {
  await requireAdmin()

  const supabase = await createClient()

  // Récupérer le profil
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError)
    return null
  }

  // Récupérer l'email depuis auth.users
  const { data: authUser } = await supabase.auth.admin.getUserById(profile.auth_id)

  // Récupérer tous les workouts avec leurs sets
  const { data: workouts, error: workoutsError } = await supabase
    .from("workouts")
    .select(`
      *,
      sets:sets(
        id,
        weight,
        repetition,
        created_at,
        updated_at,
        exercise:exercises(
          id,
          title,
          image,
          category:categories(*)
        )
      )
    `)
    .eq("profile_id", userId)
    .order("started_at", { ascending: false })

  if (workoutsError) {
    console.error("Error fetching workouts:", workoutsError)
    return {
      ...profile,
      email: authUser?.user?.email || null,
      workouts: [],
    }
  }

  return {
    ...profile,
    email: authUser?.user?.email || null,
    workouts: workouts || [],
  }
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
): Promise<any | null> {
  await requireAdmin()

  const supabase = await createClient()

  const setData = {
    workout_id: workoutId,
    exercise_id: exerciseId,
    weight,
    repetition,
    ...(createdAt && { created_at: createdAt }),
  }

  const { data: set, error } = await supabase
    .from("sets")
    .insert(setData)
    .select(
      `
      id,
      weight,
      repetition,
      workout_id,
      created_at,
      updated_at,
      exercise:exercises(
        id,
        title,
        image,
        category:categories(*)
      )
    `,
    )
    .single()

  if (error) {
    console.error("Error creating set:", error)
    return null
  }

  return set
}

/**
 * Modifier un set
 */
export async function updateSet(
  setId: string,
  data: { weight?: number; repetition?: number; workout_id?: string },
): Promise<Set | null> {
  await requireAdmin()

  const supabase = await createClient()

  const { data: set, error } = await supabase
    .from("sets")
    .update(data)
    .eq("id", setId)
    .select()
    .single()

  if (error) {
    console.error("Error updating set:", error)
    return null
  }

  return set
}

/**
 * Supprimer un set
 */
export async function deleteSet(setId: string): Promise<boolean> {
  await requireAdmin()

  const supabase = await createClient()

  const { error } = await supabase.from("sets").delete().eq("id", setId)

  if (error) {
    console.error("Error deleting set:", error)
    return false
  }

  return true
}

/**
 * Modifier un workout
 */
export async function updateWorkout(
  workoutId: string,
  data: { title?: string; started_at?: string; ended_at?: string },
): Promise<Workout | null> {
  await requireAdmin()

  const supabase = await createClient()

  const { data: workout, error } = await supabase
    .from("workouts")
    .update(data)
    .eq("id", workoutId)
    .select()
    .single()

  if (error) {
    console.error("Error updating workout:", error)
    return null
  }

  return workout
}

/**
 * Supprimer un workout (supprimera aussi tous les sets associés via cascade)
 */
export async function deleteWorkout(workoutId: string): Promise<boolean> {
  await requireAdmin()

  const supabase = await createClient()

  const { error } = await supabase.from("workouts").delete().eq("id", workoutId)

  if (error) {
    console.error("Error deleting workout:", error)
    return false
  }

  return true
}

/**
 * Supprimer un utilisateur (supprimera aussi ses workouts et sets via cascade)
 */
export async function deleteUser(userId: string): Promise<boolean> {
  await requireAdmin()

  const supabase = await createClient()

  // D'abord récupérer le auth_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("auth_id")
    .eq("id", userId)
    .single()

  if (!profile) {
    console.error("Profile not found")
    return false
  }

  // Supprimer le profil (les workouts et sets seront supprimés via cascade)
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

  if (profileError) {
    console.error("Error deleting profile:", profileError)
    return false
  }

  // Supprimer l'utilisateur de auth.users
  const { error: authError } = await supabase.auth.admin.deleteUser(profile.auth_id)

  if (authError) {
    console.error("Error deleting auth user:", authError)
    // Le profil est déjà supprimé, on retourne quand même true
    return true
  }

  return true
}

/**
 * Récupérer les statistiques globales
 */
export async function getGlobalStats(): Promise<GlobalStats> {
  await requireAdmin()

  const supabase = await createClient()

  // Total utilisateurs
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  // Workouts aujourd'hui
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: workoutsToday } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .gte("started_at", today.toISOString())

  // Sets aujourd'hui
  const { count: setsToday } = await supabase
    .from("sets")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString())

  // Utilisateurs actifs (7 derniers jours)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: activeWorkouts } = await supabase
    .from("workouts")
    .select("profile_id")
    .gte("started_at", sevenDaysAgo.toISOString())

  // Compter les profils uniques
  const uniqueProfiles = new Set(activeWorkouts?.map((w) => w.profile_id) || [])

  return {
    total_users: totalUsers || 0,
    workouts_today: workoutsToday || 0,
    sets_today: setsToday || 0,
    active_users: uniqueProfiles.size,
  }
}
