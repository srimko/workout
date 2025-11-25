"use client"

import { Dumbbell } from "lucide-react"
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
  const startWorkout = async () => {
    const data = await createTodayWorkout()
    if (!data) {
      return
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
        <Button onClick={startWorkout}>Commencer le workout</Button>
      </EmptyContent>
    </Empty>
  )
}
