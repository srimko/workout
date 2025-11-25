import type { ExerciseGroup, WorkoutWithSets } from "@/lib/types"

/**
 * Regroupe les sets d'un workout par exercice
 */
export function groupSetsByExercise(workout: WorkoutWithSets | undefined): ExerciseGroup[] {
  if (!workout?.sets) return []

  const grouped = workout.sets.reduce(
    (acc, set) => {
      const title = set.exercise.title

      if (!acc[title]) {
        acc[title] = {
          id: set.id,
          title,
          sets: [],
        }
      }

      acc[title].sets.push(set)

      return acc
    },
    {} as Record<string, ExerciseGroup>,
  )

  return Object.values(grouped)
}
