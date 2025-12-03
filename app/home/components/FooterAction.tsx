"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { endWorkout, resumeWorkout } from "@/lib/actions/workouts"

type FooterActionProps =
  | {
      footerType: "in_progress"
      onDrawerOpen?: (isDrawerClose: boolean) => void
      workoutId: string
    }
  | {
      footerType: "completed"
      workoutId: string
      onDrawerOpen?: never
    }

export function FooterAction({ footerType, onDrawerOpen, workoutId }: FooterActionProps) {
  // Fonction pour terminer le workout
  const handleWorkoutClose = async () => {
    const _isWorkoutClosed = await endWorkout(workoutId)
  }
  return (
    <div className="flex gap-4 fixed bottom-1/12 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
      {footerType === "in_progress" && (
        <>
          <Button
            variant="destructive"
            className="basis-1/5 h-12 text-base"
            onClick={handleWorkoutClose}
          >
            <X />
          </Button>
          <Button className="flex-1 h-12 text-base" onClick={() => onDrawerOpen?.(true)}>
            Ajouter un exercice
          </Button>
        </>
      )}
      {footerType === "completed" && (
        <Button
          variant="default"
          className="w-full h-12 text-base"
          onClick={() => resumeWorkout(workoutId)}
        >
          Reprendre le workout
        </Button>
      )}
    </div>
  )
}
