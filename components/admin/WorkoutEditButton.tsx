"use client"

import { Pen } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { SetWithExercise } from "@/lib/types"
import { WorkoutSetsModal } from "./WorkoutSetsModal"

interface WorkoutEditButtonProps {
  workoutId: string
  workoutTitle: string
  sets: SetWithExercise[]
  allWorkouts: any[]
  onSetsUpdated?: (updatedSets: SetWithExercise[]) => void
}

export function WorkoutEditButton({
  workoutId,
  workoutTitle,
  sets,
  allWorkouts,
  onSetsUpdated,
}: WorkoutEditButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setModalOpen(true)} size="sm" variant="ghost">
        <Pen className="h-4 w-4" />
      </Button>

      <WorkoutSetsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        workoutId={workoutId}
        workoutTitle={workoutTitle}
        sets={sets}
        allWorkouts={allWorkouts}
        onSetsUpdated={onSetsUpdated}
      />
    </>
  )
}
