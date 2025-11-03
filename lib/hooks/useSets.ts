"use client"

import { useState } from "react"
import type { Set } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

/**
 * Hook to create a set (client-side)
 */
export function useCreateSet() {
  const [isCreating, setIsCreating] = useState(false)
  const [lastError, setLastError] = useState<Error | null>(null)

  const createSet = async (
    exerciseTitle: string,
    weight: number,
    repetition: number,
  ): Promise<Set | null> => {
    setIsCreating(true)
    setLastError(null)

    try {
      console.log("[useCreateSet] Creating set for:", {
        exerciseTitle,
        weight,
        repetition,
      })

      const supabase = createClient()

      // Step 1: Get or create today's workout
      console.log("[useCreateSet] Step 1: Getting or creating workout...")
      const workout = await getOrCreateTodayWorkout(supabase)
      console.log("[useCreateSet] Workout:", workout)

      if (!workout) {
        throw new Error("Failed to get or create workout")
      }

      // Step 2: Find the exercise by title
      console.log("[useCreateSet] Step 2: Finding exercise by title:", exerciseTitle)
      const { data: exercises, error: exercisesError } = await supabase
        .from("exercises")
        .select("id")
        .eq("title", exerciseTitle)
        .eq("is_active", true)
        .maybeSingle()

      console.log("[useCreateSet] Exercise search result:", {
        exercises,
        exercisesError,
      })

      if (exercisesError) throw exercisesError
      if (!exercises) {
        throw new Error(
          `Exercise not found: "${exerciseTitle}". Vérifiez que l'exercice existe et est actif.`,
        )
      }

      // Step 3: Create the set
      console.log("[useCreateSet] Step 3: Creating set in database...")
      const { data: set, error: insertError } = await supabase
        .from("sets")
        .insert({
          workout_id: workout.id,
          exercise_id: exercises.id,
          weight,
          repetition,
        })
        .select()
        .single()

      console.log("[useCreateSet] Set creation result:", { set, insertError })

      if (insertError) throw insertError

      console.log("[useCreateSet] Success! Set created:", set)
      setIsCreating(false)
      return set
    } catch (err) {
      console.error("[useCreateSet] Error creating set:", err)
      const errObj = err instanceof Error ? err : new Error("Unknown error")
      setLastError(errObj)
      setIsCreating(false)
      return null
    }
  }

  return { createSet, loading: isCreating, error: lastError }
}

/**
 * Hook to update a set (client-side)
 */
export function useUpdateSet() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastError, setLastError] = useState<Error | null>(null)

  const updateSet = async (
    setId: string,
    weight: number,
    repetition: number,
  ): Promise<Set | null> => {
    setIsUpdating(true)
    setLastError(null)

    try {
      console.log("[useUpdateSet] Updating set:", {
        setId,
        weight,
        repetition,
      })

      const supabase = createClient()

      const { data: set, error: updateError } = await supabase
        .from("sets")
        .update({
          weight,
          repetition,
        })
        .eq("id", setId)
        .select()
        .single()

      console.log("[useUpdateSet] Update result:", { set, updateError })

      if (updateError) throw updateError

      console.log("[useUpdateSet] Success! Set updated:", set)
      setIsUpdating(false)
      return set
    } catch (err) {
      console.error("[useUpdateSet] Error updating set:", err)
      const errObj = err instanceof Error ? err : new Error("Unknown error")
      setLastError(errObj)
      setIsUpdating(false)
      return null
    }
  }

  return { updateSet, loading: isUpdating, error: lastError }
}

/**
 * Helper function to get or create today's workout (client-side)
 */
async function getOrCreateTodayWorkout(supabase: ReturnType<typeof createClient>) {
  console.log("[getOrCreateTodayWorkout] Starting...")

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  console.log("[getOrCreateTodayWorkout] User:", { user: user?.id, userError })

  if (!user) throw new Error("User not authenticated")

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_id", user.id)
    .single()

  console.log("[getOrCreateTodayWorkout] Profile:", { profile, profileError })

  if (!profile) throw new Error("Profile not found")

  // Check for today's workout only (ignore old workouts)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayWorkout, error: todayError } = await supabase
    .from("workouts")
    .select("*")
    .eq("profile_id", profile.id)
    .gte("started_at", today.toISOString())
    .is("ended_at", null) // Only get unfinished workouts
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  console.log("[getOrCreateTodayWorkout] Today workout check:", {
    todayWorkout,
    todayError,
  })

  if (todayWorkout) {
    console.log("[getOrCreateTodayWorkout] Using today workout:", todayWorkout.id)
    return todayWorkout
  }

  // Create new workout
  const workoutTitle = `Séance du ${new Date().toLocaleDateString("fr-FR")}`

  console.log("[getOrCreateTodayWorkout] Creating new workout:", workoutTitle)

  const { data: newWorkout, error } = await supabase
    .from("workouts")
    .insert({
      profile_id: profile.id,
      title: workoutTitle,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  console.log("[getOrCreateTodayWorkout] New workout created:", {
    newWorkout,
    error,
  })

  if (error) throw error

  return newWorkout
}
