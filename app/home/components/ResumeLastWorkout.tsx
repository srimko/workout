import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getPrevWorkoutWithSets } from "@/lib/actions/workouts"
import type { ExerciseGroup } from "@/lib/types"
import { groupSetsByExercise } from "@/lib/utils/set"

export async function ResumeLastWorkout() {
  const previousWorkout = await getPrevWorkoutWithSets()
  /**
   * Display exercise stats
   */
  function renderExerciseStats(exercises: ExerciseGroup[]) {
    return exercises.map((exercise) => (
      <div key={exercise.title} className="mb-4 p-3 bg-muted rounded-lg w-60 flex-shrink-0">
        <h4 className="font-semibold mb-2">{exercise.title}</h4>
        <div className="space-y-1 text-sm">
          {exercise.sets.map((set, idx) => (
            <p key={set.id} className="text-muted-foreground">
              Série {idx + 1}: {set.weight}kg × {set.repetition} reps
            </p>
          ))}
        </div>
      </div>
    ))
  }
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="previous-workout">
          <AccordionTrigger>
            Séance précédente {previousWorkout?.created_at.split("T")[0] || ""}
          </AccordionTrigger>
          <AccordionContent className="flex gap-3 mb-4 overflow-auto">
            {previousWorkout && renderExerciseStats(groupSetsByExercise(previousWorkout))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <hr className="mb-6" />
    </>
  )
}
