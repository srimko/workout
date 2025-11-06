"use client"

import { memo } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface SetWithExerciseInfo {
  id: string
  workout_id: string
  exercise_id: number
  weight: number
  repetition: number
  created_at: string
  updated_at: string
  exercise_name: string
  exercise_image: string
  category_name: string
}

interface WorkoutCardProps {
  set: SetWithExerciseInfo
  index: number
  onEdit?: (set: SetWithExerciseInfo) => void
}

export const WorkoutCard = memo(function WorkoutCard({
  set,
  index,
  onEdit,
}: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden bg-card hover:bg-accent/50 transition-colors active:bg-accent">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2 mb-2 flex-wrap">
            <span className="flex justify-between gap-4">
              <Badge variant="secondary">#{index + 1}</Badge>
              <h3 className="font-semibold text-base leading-tight truncate">{set.exercise_name.slice(0, 20) + '...'}</h3>
            </span>
            <Badge variant="outline" className="text-xs">
              {set.category_name}
            </Badge>
          </div>
          
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(set)}
            className="h-8 w-8 p-0 ml-2 flex-shrink-0 active:bg-accent"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifier</span>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Poids */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/60 rounded-lg active:bg-muted">
            <p className="text-3xl font-bold text-foreground">{set.weight}</p>
            <p className="text-xs text-muted-foreground font-medium">kg</p>
          </div>

          {/* Répétitions */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/60 rounded-lg active:bg-muted">
            <p className="text-3xl font-bold text-foreground">{set.repetition}</p>
            <p className="text-xs text-muted-foreground font-medium">reps</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

WorkoutCard.displayName = "WorkoutCard"
