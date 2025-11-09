"use client"

import { useMemo } from "react"
import type { WorkoutWithSets, SetWithExercise } from "@/lib/types"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ExerciseGroup {
  exerciseId: number
  exerciseName: string
  categoryName: string
  sets: SetWithExercise[]
}

interface DrawerWorkoutDetailsProps {
  workout: WorkoutWithSets
  trigger: React.ReactNode
}

export function DrawerWorkoutDetails({ workout, trigger }: DrawerWorkoutDetailsProps) {
  // Grouper les sets par exercice
  const groupedExercises = useMemo(() => {
    const groupMap = new Map<number, ExerciseGroup>()

    workout.sets.forEach((set) => {
      const exerciseId = set.exercise.id
      if (!groupMap.has(exerciseId)) {
        groupMap.set(exerciseId, {
          exerciseId,
          exerciseName: set.exercise.title,
          categoryName: set.exercise.category.name,
          sets: [],
        })
      }
      groupMap.get(exerciseId)!.sets.push(set)
    })

    // Retourner dans l'ordre d'apparition (ordre chronologique de création)
    return Array.from(groupMap.values())
  }, [workout.sets])

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{workout.title}</DrawerTitle>
          <DrawerDescription>
            {new Date(workout.started_at).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DrawerDescription>
        </DrawerHeader>

        {/* Zone scrollable */}
        <div className="overflow-y-auto max-h-[60vh] overscroll-contain px-4 pb-4">
          {groupedExercises.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun exercice dans cette séance
            </p>
          ) : (
            <div className="space-y-4">
              {groupedExercises.map((group) => (
                <div key={group.exerciseId} className="border rounded-lg p-3 bg-muted/30">
                  {/* En-tête de l'exercice */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="font-semibold text-base">{group.exerciseName}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {group.categoryName}
                    </Badge>
                  </div>

                  {/* Liste des séries */}
                  <div className="space-y-1.5">
                    {group.sets.map((set, index) => (
                      <div
                        key={set.id}
                        className="flex items-center justify-between text-sm bg-background rounded px-3 py-2"
                      >
                        <span className="text-muted-foreground font-medium">Série {index + 1}</span>
                        <span className="font-semibold">
                          {set.weight}kg × {set.repetition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
