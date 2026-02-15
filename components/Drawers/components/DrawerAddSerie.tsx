"use client"

import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { memo, useCallback } from "react"
import { DrawerReps } from "@/components/Drawers/components/DrawerReps"
import { DrawerWeight } from "@/components/Drawers/components/DrawerWeight"
import { Button } from "@/components/ui/button"

const MIN_SERIES = 1
const MAX_SERIES = 4

interface DrawerAddSerieProps {
  exerciseName: string
  exerciseImage?: string
  weight: number
  onWeightChange: (weight: number) => void
  reps: number
  onRepsChange: (reps: number) => void
  serieCount: number
  onSerieCountChange: (count: number) => void
}

export const DrawerAddSerie = memo(function DrawerAddSerie({
  exerciseName,
  exerciseImage,
  weight,
  onWeightChange,
  reps,
  onRepsChange,
  serieCount,
  onSerieCountChange,
}: DrawerAddSerieProps) {
  const handleSerieChange = useCallback(
    (adjustment: number) => {
      const newSerie = Math.max(MIN_SERIES, Math.min(MAX_SERIES, serieCount + adjustment))
      onSerieCountChange(newSerie)
    },
    [serieCount, onSerieCountChange],
  )

  return (
    <div className="flex flex-col px-4">
      {/* Exercice sélectionné */}
      {exerciseImage && (
        <div className="flex items-center gap-3 py-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src={`/exercises/${exerciseImage}`}
              alt={exerciseName}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <p className="text-sm font-medium truncate">{exerciseName}</p>
        </div>
      )}

      <div className="h-px bg-border" />

      {/* Section Poids */}
      <div className="py-6">
        <DrawerWeight weight={weight} onWeightChange={onWeightChange} />
      </div>

      <div className="h-px bg-border" />

      {/* Section Répétitions + Séries */}
      <div className="grid grid-cols-2 gap-6 py-6">
        {/* Répétitions */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Répétitions
          </span>
          <DrawerReps repetition={reps} onRepetitionChange={onRepsChange} compact />
        </div>

        {/* Séries avec séparation verticale */}
        <div className="relative flex flex-col items-center gap-3">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Séries
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => handleSerieChange(-1)}
              disabled={serieCount <= MIN_SERIES}
              aria-label="Diminuer les séries"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <span className="text-4xl font-bold text-center tabular-nums">{serieCount}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => handleSerieChange(1)}
              disabled={serieCount >= MAX_SERIES}
              aria-label="Augmenter les séries"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

DrawerAddSerie.displayName = "DrawerAddSerie"
