"use client"

import { memo, useMemo, useState } from "react"
import type { SetWithExerciseInfo } from "@/lib/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { SetComponent } from "../SetComponent"

interface WorkoutCardListProps {
  sets?: SetWithExerciseInfo[]
  onEditSet?: (set: SetWithExerciseInfo) => void
  onDeleteSet?: (set: SetWithExerciseInfo) => void
  workoutTitle?: string
}

interface CategoryGroup {
  categoryName: string
  sets: SetWithExerciseInfo[]
  totalWeight: number
  totalVolume: number
}

interface ExerciseGroup {
  exerciseName: string
  sets: SetWithExerciseInfo[]
}

export const WorkoutCardList = memo(function WorkoutCardList({
  sets,
  onEditSet,
  onDeleteSet,
}: WorkoutCardListProps) {
  const [onEdit, setOnEdit] = useState<string | null>(null)

  const groupedByCategory = useMemo(() => {
    if (!sets) return []
    const groups = new Map<string, CategoryGroup>()

    sets.forEach((set) => {
      const categoryName = set.category_name
      if (!groups.has(categoryName)) {
        groups.set(categoryName, {
          categoryName,
          sets: [],
          totalWeight: 0,
          totalVolume: 0,
        })
      }

      const group = groups.get(categoryName)!
      group.sets.push(set)
      group.totalWeight += set.weight
      group.totalVolume += set.weight * set.repetition
    })

    return Array.from(groups.values())
  }, [sets])

  const defaultOpenCategories = useMemo(() => {
    if (!sets || sets.length === 0) return []
    const lastSet = sets[sets.length - 1]
    return [lastSet.category_name]
  }, [sets])

  if (!sets || sets.length === 0) {
    return null
  }

  const handleClick = (id: string) => {
    if (id === onEdit) {
      setOnEdit(null)
      return
    }
    setOnEdit(id)
  }

  const groupSetsByExercise = (sets: SetWithExerciseInfo[]): ExerciseGroup[] => {
    const exerciseMap = new Map<string, SetWithExerciseInfo[]>()

    sets.forEach((set) => {
      const exerciseName = set.exercise_name
      if (!exerciseMap.has(exerciseName)) {
        exerciseMap.set(exerciseName, [])
      }
      exerciseMap.get(exerciseName)?.push(set)
    })

    return Array.from(exerciseMap.entries()).map(([exerciseName, sets]) => ({
      exerciseName,
      sets,
    }))
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={defaultOpenCategories} className="w-full">
        {groupedByCategory.map((group) => (
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
                {groupSetsByExercise(group.sets).map((exerciseGroup) => (
                  <div key={exerciseGroup.exerciseName} className="py-3 first:pt-0 last:pb-0">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1 truncate">
                      {exerciseGroup.exerciseName}
                    </h3>
                    <div className="space-y-0.5">
                      {exerciseGroup.sets.map((set, index) => (
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
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
})

WorkoutCardList.displayName = "WorkoutCardList"
