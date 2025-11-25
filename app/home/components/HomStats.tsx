"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkoutWithSets } from "@/lib/types"

export function HomaStats({ todayWorkout }: { todayWorkout: WorkoutWithSets | null }) {
  const [totalSets, _setTotalSets] = useState(todayWorkout ? todayWorkout.sets.length : 0)
  const [totalWeight, _setTotalWeight] = useState(
    todayWorkout ? todayWorkout.sets.reduce((sum, set) => sum + set.weight, 0) : 0,
  )
  const avgWeight = totalSets > 0 ? (totalWeight / totalSets).toFixed(1) : "0"

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 gap-2">
      <CardHeader>
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
  )
}
