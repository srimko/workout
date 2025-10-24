import type { Workout } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

/**
 * Get the current user's profile ID
 */
async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_id", user.id)
    .single()

  return profile?.id || null
}

/**
 * Get today's workout (or the most recent unfinished workout)
 */
export async function getTodayWorkout(): Promise<Workout | null> {
  const profileId = await getCurrentProfileId()
  if (!profileId) return null

  const supabase = await createClient()

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("profile_id", profileId)
    .gte("started_at", today.toISOString())
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching today workout:", error)
    return null
  }

  return data
}

/**
 * Get the active workout (unfinished workout)
 */
export async function getActiveWorkout(): Promise<Workout | null> {
  const profileId = await getCurrentProfileId()
  if (!profileId) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("profile_id", profileId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching active workout:", error)
    return null
  }

  return data
}

/**
 * Create a new workout for today
 */
export async function createTodayWorkout(title?: string): Promise<Workout | null> {
  const profileId = await getCurrentProfileId()
  if (!profileId) {
    console.error("No profile found for current user")
    return null
  }

  const supabase = await createClient()

  // Generate a default title if not provided
  const workoutTitle = title || `Séance du ${new Date().toLocaleDateString("fr-FR")}`

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      profile_id: profileId,
      title: workoutTitle,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating workout:", error)
    return null
  }

  return data
}

/**
 * Get or create today's workout
 * Returns the active workout or creates one if none exists
 */
export async function getOrCreateTodayWorkout(): Promise<Workout | null> {
  // First, try to get an active (unfinished) workout
  let workout = await getActiveWorkout()

  // If no active workout, try to get today's workout
  if (!workout) {
    workout = await getTodayWorkout()
  }

  // If still no workout, create one
  if (!workout) {
    workout = await createTodayWorkout()
  }

  return workout
}

/**
 * End a workout
 */
export async function endWorkout(workoutId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("workouts")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", workoutId)

  if (error) {
    console.error("Error ending workout:", error)
    return false
  }

  return true
}

/**
 * Get all workouts for the current user
 */
export async function getAllWorkouts(): Promise<Workout[]> {
  const profileId = await getCurrentProfileId()
  if (!profileId) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("profile_id", profileId)
    .order("started_at", { ascending: false })

  if (error) {
    console.error("Error fetching workouts:", error)
    return []
  }

  return data || []
}
