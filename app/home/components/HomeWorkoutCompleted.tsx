"use client"

import { FooterAction } from "@/app/home/components/FooterAction"
import { Badge } from "@/components/ui/badge"
import type { WorkoutWithSets } from "@/lib/types"

export function HomeWorkoutCompleted({ todayWorkout }: { todayWorkout: WorkoutWithSets }) {
  return (
    <>
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pt-4 pb-3 px-4 border-b border-border/50">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Séance terminée</h1>
          <Badge className="bg-green-100 text-green-800">Complété</Badge>
        </div>
      </div>
      <FooterAction footerType="completed" workoutId={todayWorkout.id} />
    </>
  )
}
