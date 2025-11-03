import "server-only"

import type { Profile } from "@/lib/types"
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
 * Get profile by ID
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

/**
 * Get current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const profileId = await getCurrentProfileId()
  if (!profileId) return null

  return getProfileById(profileId)
}

/**
 * Update profile
 * Partial update - only updates provided fields
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<Omit<Profile, "id" | "auth_id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; error?: string; profile?: Profile }> {
  try {
    console.log("[updateProfile] Starting update for profile:", profileId)
    console.log("[updateProfile] Updates:", updates)

    const supabase = await createClient()

    // Verify the user has permission to update this profile
    const currentProfileId = await getCurrentProfileId()
    console.log("[updateProfile] Current user profile ID:", currentProfileId)

    if (!currentProfileId || currentProfileId !== profileId) {
      console.log("[updateProfile] Permission denied")
      return {
        success: false,
        error: "Non autorisé à modifier ce profil",
      }
    }

    // Update the profile (updated_at is handled by database trigger)
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select()
      .single()

    if (error) {
      console.error("[updateProfile] Supabase error:", error)
      return {
        success: false,
        error: error.message || "Erreur lors de la mise à jour du profil",
      }
    }

    console.log("[updateProfile] Success! Updated profile:", data)
    return {
      success: true,
      profile: data,
    }
  } catch (err) {
    console.error("[updateProfile] Unexpected error:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inattendue",
    }
  }
}
