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

  if (!previousWorkout) return null

  const exercises = groupSetsByExercise(previousWorkout)

  function renderExerciseStats(exercises: ExerciseGroup[]) {
    return exercises.map((exercise) => (
      <div key={exercise.title} className="p-3 bg-muted rounded-lg w-48 flex-shrink-0">
        <h4 className="font-semibold mb-2 line-clamp-2 leading-tight">{exercise.title}</h4>
        <div className="space-y-1 text-sm">
          {exercise.sets.map((set) => (
            <p key={set.id} className="text-muted-foreground">
              {set.weight}kg × {set.repetition}
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
            <div className="flex flex-col items-start">
              <span>
                Séance précédente{" "}
                {new Date(previousWorkout.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {exercises.length} exercice{exercises.length > 1 ? "s" : ""}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
                {renderExerciseStats(exercises)}
              </div>
              <div className="pointer-events-none absolute top-0 right-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="h-px bg-border mb-6" />
    </>
  )
}
