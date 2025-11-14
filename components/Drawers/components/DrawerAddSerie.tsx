"use client"

import { Minus, Plus } from "lucide-react"
import { memo, useCallback, useState } from "react"
import { DrawerWeight } from "@/components/Drawers/components/DrawerWeight"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const MIN_SERIES = 1
const MAX_SERIES = 4
const MIN_REPS = 1
const MAX_REPS = 15

interface DrawerAddSerieProps {
  exerciseName: string
  weight: number
  onWeightChange: (weight: number) => void
  allSeries: Serie[]
  onSeriesChange: (series: Serie[]) => void
}

interface Serie {
  title: string
  weight: number
  rep: number
}

export const DrawerAddSerie = memo(function DrawerAddSerie({
  exerciseName,
  weight,
  onWeightChange,
  allSeries,
  onSeriesChange,
}: DrawerAddSerieProps) {
  const [rep, setRepChange] = useState<number>(1)
  const [serie, setSerieChange] = useState<number>(1)

  const handleSerieChange = useCallback(
    (adjustment: number) => {
      const newSerie = Math.max(MIN_SERIES, Math.min(MAX_SERIES, serie + adjustment))
      setSerieChange(newSerie)
    },
    [serie],
  )
  const handleRepChange = useCallback(
    (adjustment: number) => {
      const newRep = Math.max(MIN_REPS, Math.min(MAX_REPS, rep + adjustment))
      setRepChange(newRep)
    },
    [rep],
  )

  function handleAddSerieClick() {
    const newSeries = [...Array(serie)].map((_, index) => {
      return {
        title: `Série ${allSeries.length + index + 1}`,
        weight,
        rep,
      }
    })
    onSeriesChange([...allSeries, ...newSeries])
  }

  const canAddMore = allSeries.length + serie <= MAX_SERIES && weight > 0 && rep > 0
  const buttonLabel = serie === 1 ? "Ajouter une série" : `Ajouter ${serie} séries`

  return (
    <div>
      <DrawerWeight weight={weight} onWeightChange={onWeightChange} />
      <div className="px-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">{exerciseName}</h3>
              <span className="text-xs text-muted-foreground">
                {allSeries.length}/{MAX_SERIES} séries
              </span>
            </div>
            {allSeries.map((serie, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-background rounded px-3 py-2 mb-2"
              >
                <span className="text-muted-foreground font-medium">{serie.title}</span>
                <span className="flex items-center gap-4 font-semibold">
                  {serie.weight}kg × {serie.rep} reps
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center">
        <div className="flex basis-1/2 items-center justify-center gap-4">
          <div className="flex flex-col items-center mb-6">
            <h3 className="mb-3">Répéitions</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleRepChange(-1)}
                disabled={rep <= MIN_REPS}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <span>{rep}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleRepChange(1)}
                disabled={rep >= MAX_REPS}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex basis-1/2 items-center justify-center gap-4">
          <div className="flex flex-col items-center mb-6">
            <h3 className="mb-3">Séries</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleSerieChange(-1)}
                disabled={serie <= MIN_SERIES}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <span>{serie}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleSerieChange(1)}
                disabled={serie >= MAX_SERIES}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddSerieClick}
          disabled={!canAddMore}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
})

DrawerAddSerie.displayName = "DrawerAddSerie"
