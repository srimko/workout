import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_REPS = 1
const MAX_REPS = 15

interface DrawerRepsProsp {
  repetition: number
  onRepetitionChange: (repetition: number) => void
}

export function DrawerReps({ repetition, onRepetitionChange }: DrawerRepsProsp) {
  function onClick(adjustment: number) {
    onRepetitionChange(repetition + adjustment)
  }

  return (
    <div className="p-4 pb-0 mb-10">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(-1)}
          disabled={repetition <= MIN_REPS}
        >
          <Minus />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-7xl font-bold tracking-tighter">{repetition}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            Répétition{repetition > 1 ? "s" : ""}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(1)}
          disabled={repetition >= MAX_REPS}
        >
          <Plus />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </div>
  )
}
