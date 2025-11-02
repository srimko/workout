"use client"

import { memo } from "react"
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

import type { Set } from "@/lib/types"

export interface TableWorkoutProps {
  sets?: Set[]
  workoutTitle?: string
}

export const TableWorkout = memo(function TableWorkout({ sets, workoutTitle }: TableWorkoutProps) {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {sets.map((set, index) => (
              <TableRow key={set.id}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="text-left">
                  {(set as any).exercise_name || `Exercice #${set.exercise_id}`}
                </TableCell>
                <TableCell className="text-left">{set.weight}</TableCell>
                <TableCell className="text-left">{set.repetition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TableWorkoutStats sets={sets} />
      </div>
    )
  )
})

TableWorkout.displayName = "TableWorkout"
