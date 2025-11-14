"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UserWithWorkouts } from "@/lib/api/admin"
import { WorkoutTableRow } from "./WorkoutTableRow"

interface UserWorkoutsTableProps {
  user: UserWithWorkouts
}

export function UserWorkoutsTable({ user: initialUser }: UserWorkoutsTableProps) {
  const [user, setUser] = useState(initialUser)

  const handleSetsUpdated = (workoutId: string, updatedSets: any[]) => {
    // Mettre à jour les sets du workout spécifique
    setUser((prevUser) => ({
      ...prevUser,
      workouts: prevUser.workouts.map((w) =>
        w.id === workoutId ? { ...w, sets: updatedSets } : w,
      ),
    }))
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{user.display_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Workout</TableHead>
              <TableHead>Exercices</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.workouts.map((workout) => (
              <WorkoutTableRow
                key={workout.id}
                workout={workout}
                allWorkouts={user.workouts}
                onSetsUpdated={handleSetsUpdated}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
