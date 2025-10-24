import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_SERIES = 1
const MAX_SERIES = 4

interface DrawerSerieProps {
  serie: number
  onSerieChange: (serie: number) => void
}

export function DrawerSerie({ serie, onSerieChange }: DrawerSerieProps) {
  console.log("serie", serie)
  function onClick(adjustment: number) {
    onSerieChange(serie + adjustment)
  }

  return (
    <div className="p-4 pb-0 mb-10">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(-1)}
          disabled={serie <= MIN_SERIES}
        >
          <Minus />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-7xl font-bold tracking-tighter">{serie}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            Serie{serie > 1 ? "s" : ""}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(1)}
          disabled={serie >= MAX_SERIES}
        >
          <Plus />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </div>
  )
}
