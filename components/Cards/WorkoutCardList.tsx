"use client"

import { memo } from "react"
import { WorkoutCard, type SetWithExerciseInfo } from "@/components/Cards/WorkoutCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkoutCardListProps {
  sets?: SetWithExerciseInfo[]
  onEditSet?: (set: SetWithExerciseInfo) => void
  workoutTitle?: string
}

export const WorkoutCardList = memo(function WorkoutCardList({
  sets,
  onEditSet,
  workoutTitle,
}: WorkoutCardListProps) {
  if (!sets || sets.length === 0) {
    return null
  }

  // Calculer les stats
  const totalSets = sets.length
  const totalWeight = sets.reduce((sum, set) => sum + set.weight, 0)
  const totalReps = sets.reduce((sum, set) => sum + set.repetition, 0)
  const avgWeight = (totalWeight / totalSets).toFixed(1)

  return (
    <div className="space-y-4 pb-20">
      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Résumé de la séance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalSets}</p>
              <p className="text-xs text-muted-foreground">séries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">kg total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{avgWeight}</p>
              <p className="text-xs text-muted-foreground">kg moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Title */}
      {workoutTitle && (
        <h2 className="text-lg font-semibold px-4">{workoutTitle}</h2>
      )}

      {/* Workout Cards */}
      <div className="space-y-3 px-4">
        {sets.map((set, index) => (
          <WorkoutCard
            key={set.id}
            set={set}
            index={index}
            onEdit={onEditSet}
          />
        ))}
      </div>
    </div>
  )
})

WorkoutCardList.displayName = "WorkoutCardList"
