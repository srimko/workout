"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { WorkoutEditButton } from "./WorkoutEditButton"
import type { WorkoutWithSets } from "@/lib/types"

interface WorkoutTableRowProps {
  workout: WorkoutWithSets
  allWorkouts: any[]
  onSetsUpdated?: (workoutId: string, updatedSets: any[]) => void
}

export function WorkoutTableRow({ workout, allWorkouts, onSetsUpdated }: WorkoutTableRowProps) {
  const handleSetsUpdated = (updatedSets: any[]) => {
    onSetsUpdated?.(workout.id, updatedSets)
  }
  return (
    <TableRow>
      <TableCell className="font-medium">{workout.title}</TableCell>
      <TableCell>{workout.sets.length}</TableCell>
      <TableCell>{new Date(workout.started_at).toLocaleDateString("fr-FR")}</TableCell>
      <TableCell className="text-right">
        <WorkoutEditButton
          workoutId={workout.id}
          workoutTitle={workout.title}
          sets={workout.sets}
          allWorkouts={allWorkouts}
          onSetsUpdated={handleSetsUpdated}
        />
      </TableCell>
    </TableRow>
  )
}
