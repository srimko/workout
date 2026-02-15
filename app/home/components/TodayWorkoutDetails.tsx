"use client"

import { Dumbbell } from "lucide-react"
import { useMemo, useState } from "react"
import { SetComponent } from "@/components/SetComponent"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { CategoryGroup, SetWithExercise, WorkoutWithSets } from "@/lib/types"
import { groupSetsByExercise } from "@/lib/utils/set"

interface TodayWorkoutDetailsProps {
  todayWorkout: WorkoutWithSets
  onEditSet?: (set: SetWithExercise) => void
  onDeleteSet?: (set: SetWithExercise) => void
}

export function TodayWorkoutDetails({
  todayWorkout,
  onEditSet,
  onDeleteSet,
}: TodayWorkoutDetailsProps) {
  const [onEdit, setOnEdit] = useState<string | null>(null)

  const handleClick = (id: string) => {
    if (id === onEdit) {
      setOnEdit(null)
      return
    }
    setOnEdit(id)
  }

  const groups = useMemo(() => {
    const map = new Map<string, CategoryGroup>()

    todayWorkout.sets.forEach((set) => {
      const categoryName = set.exercise.category.name
      if (!map.has(categoryName)) {
        map.set(categoryName, {
          categoryName,
          sets: [],
          totalWeight: 0,
          totalVolume: 0,
        })
      }

      const group = map.get(categoryName)
      if (!group) return

      group.sets.push(set)
      group.totalWeight += set.weight
      group.totalVolume += set.weight * set.repetition
    })

    return Array.from(map.values())
  }, [todayWorkout.sets])

  if (todayWorkout.sets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
        <div>
          <p className="font-medium">Aucune série enregistrée</p>
          <p className="text-sm text-muted-foreground">
            Ajoutez votre premier exercice pour commencer
          </p>
        </div>
      </div>
    )
  }

  const dateStr = new Date(todayWorkout.started_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  })

  return (
    <>
      <h2 className="text-lg font-semibold mt-6">Séance du {dateStr}</h2>
      <Accordion type="multiple" className="w-full">
        {groups.map((group) => (
          <AccordionItem key={group.categoryName} value={group.categoryName}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between gap-3 w-full">
                <span className="font-semibold text-base">{group.categoryName}</span>
                <Badge variant="secondary" className="text-xs">
                  {group.sets.length} série{group.sets.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y divide-border/50">
                {groupSetsByExercise({ ...todayWorkout, sets: group.sets }).map((exercise) => {
                  return (
                    <div key={exercise.title} className="py-3 first:pt-0 last:pb-0">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1 truncate">
                        {exercise.title}
                      </h3>
                      <div className="space-y-0.5">
                        {exercise.sets.map((set, index) => (
                          <SetComponent
                            key={set.id}
                            set={set}
                            index={index}
                            onSetClick={handleClick}
                            onEditSet={onEditSet}
                            onDeleteSet={onDeleteSet}
                            onEdit={onEdit}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
