"use server"

import { revalidatePath } from "next/cache"
import {
  getCurrentProfile as getCurrentProfileAPI,
  getProfileById as getProfileByIdAPI,
  updateProfile as updateProfileAPI,
} from "@/lib/api/profiles"
import type { Profile } from "@/lib/types"

/**
 * Get profile by ID
 */
export async function getProfileById(profileId: string) {
  return await getProfileByIdAPI(profileId)
}

/**
 * Get current user's profile
 */
export async function getCurrentProfile() {
  return await getCurrentProfileAPI()
}

/**
 * Update profile
 * Partial update - only updates provided fields
 * Automatically revalidates the profile page
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<Omit<Profile, "id" | "auth_id" | "created_at" | "updated_at">>,
) {
  const result = await updateProfileAPI(profileId, updates)

  if (result.success) {
    // Revalidate the profile page
    revalidatePath(`/users/${profileId}`)
  }

  return result
}
