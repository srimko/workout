"use client"

import { memo } from "react"
import { Pencil } from "lucide-react"
import { TableWorkoutStats } from "@/components/Table/TableWorkoutStats"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import type { Set } from "@/lib/types"

export interface SetWithExerciseName extends Set {
  exercise_name: string
}

export interface TableWorkoutProps {
  sets?: Set[]
  workoutTitle?: string
  onEditSet?: (set: SetWithExerciseName) => void
}

export const TableWorkout = memo(function TableWorkout({
  sets,
  workoutTitle,
  onEditSet,
}: TableWorkoutProps) {
  return (
    sets &&
    sets.length > 0 && (
      <div className="flex flex-col justify-center py-2 max-w-2xl m-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Détails de la séance{workoutTitle && ` - ${workoutTitle}`}
        </h2>
        <Table>
          <TableCaption>Séries effectuées</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">#</TableHead>
              <TableHead className="text-left">Exercice</TableHead>
              <TableHead className="text-left">Poids (kg)</TableHead>
              <TableHead className="text-left">Répétitions</TableHead>
              {onEditSet && <TableHead className="text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sets.map((set, index) => {
              const exerciseName = (set as any).exercise_name || `Exercice #${set.exercise_id}`
              return (
                <TableRow key={set.id}>
                  <TableCell className="text-left">{index + 1}</TableCell>
                  <TableCell className="text-left">{exerciseName}</TableCell>
                  <TableCell className="text-left">{set.weight}</TableCell>
                  <TableCell className="text-left">{set.repetition}</TableCell>
                  {onEditSet && (
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onEditSet({
                            ...set,
                            exercise_name: exerciseName,
                          })
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <TableWorkoutStats sets={sets} />
      </div>
    )
  )
})

TableWorkout.displayName = "TableWorkout"
