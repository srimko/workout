"use client"

import { Dumbbell } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { createTodayWorkout } from "@/lib/actions/workouts"

export function HomeEmpty() {
  const [isLoading, setIsLoading] = useState(false)

  const startWorkout = async () => {
    setIsLoading(true)
    const data = await createTodayWorkout()
    if (!data) {
      toast.error("Impossible de créer la séance")
      setIsLoading(false)
    }
  }
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Dumbbell />
        </EmptyMedia>
        <EmptyTitle>Commencez votre séance</EmptyTitle>
        <EmptyDescription>
          Créez un nouveau workout pour commencer votre entraînement d'aujourd'hui
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={startWorkout} disabled={isLoading}>
          {isLoading ? "Création..." : "Commencer le workout"}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
