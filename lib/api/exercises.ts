import type { Category, Exercise, ExerciseWithCategory } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}

/**
 * Get all exercises
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercises(activeOnly: boolean = false): Promise<Exercise[]> {
  const supabase = await createClient()

  let query = supabase.from("exercises").select("*").order("title")

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching exercises:", error)
    throw new Error(`Failed to fetch exercises: ${error.message}`)
  }

  return data || []
}

/**
 * Get all exercises with their category information
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercisesWithCategory(
  activeOnly: boolean = false,
): Promise<ExerciseWithCategory[]> {
  const supabase = await createClient()

  let query = supabase
    .from("exercises")
    .select(`
      *,
      category:categories(*)
    `)
    .order("title")

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching exercises with category:", error)
    throw new Error(`Failed to fetch exercises with category: ${error.message}`)
  }

  return data || []
}

/**
 * Get exercises by category ID
 * @param categoryId - The category ID to filter by
 * @param activeOnly - If true, only return active exercises
 */
export async function getExercisesByCategory(
  categoryId: string,
  activeOnly: boolean = false,
): Promise<Exercise[]> {
  const supabase = await createClient()

  let query = supabase.from("exercises").select("*").eq("category_id", categoryId).order("title")

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching exercises by category:", error)
    throw new Error(`Failed to fetch exercises by category: ${error.message}`)
  }

  return data || []
}

/**
 * Get a single exercise by ID
 */
export async function getExerciseById(exerciseId: number): Promise<Exercise | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).single()

  if (error) {
    console.error("Error fetching exercise:", error)
    return null
  }

  return data
}

/**
 * Get a single exercise by ID with its category information
 */
export async function getExerciseByIdWithCategory(
  exerciseId: number,
): Promise<ExerciseWithCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("exercises")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", exerciseId)
    .single()

  if (error) {
    console.error("Error fetching exercise with category:", error)
    return null
  }

  return data
}
