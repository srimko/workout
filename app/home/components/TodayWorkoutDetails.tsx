"use client"

import { useState } from "react"
import { SetComponent } from "@/components/SetComponent"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  const groupedByCategory = () => {
    const groups = new Map<string, CategoryGroup>()

    todayWorkout?.sets.forEach((set) => {
      const categoryName = set.exercise.category.name
      if (!groups.has(categoryName)) {
        groups.set(categoryName, {
          categoryName,
          sets: [],
          totalWeight: 0,
          totalVolume: 0,
        })
      }

      const group = groups?.get(categoryName)
      if (!group) return

      group.sets.push(set)
      group.totalWeight += set.weight
      group.totalVolume += set.weight * set.repetition
    })

    // Retourner les groupes dans l'ordre d'apparition
    return Array.from(groups.values())
  }

  function getTotalSetsCount() {
    console.log("todayWorkout.sets", todayWorkout.sets)
  }

  getTotalSetsCount()

  return (
    <>
      <h2 className="text-lg font-semibold mt-6">{todayWorkout.title}</h2>
      <Accordion type="multiple" className="w-full">
        {groupedByCategory().map((group) => (
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
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    {groupSetsByExercise({ ...todayWorkout, sets: group.sets }).map((exercise) => {
                      return (
                        <div key={exercise.title} className="space-y-2">
                          <h3 className="font-semibold text-base leading-tight truncate">
                            {exercise.title}
                          </h3>
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
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
