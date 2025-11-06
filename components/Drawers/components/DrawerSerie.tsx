import { Minus, Plus } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

const MIN_SERIES = 1
const MAX_SERIES = 4

interface DrawerSerieProps {
  serie: number
  onSerieChange: (serie: number) => void
}

export function DrawerSerie({ serie, onSerieChange }: DrawerSerieProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(serie.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchroniser inputValue avec serie quand serie change de l'extérieur
  useEffect(() => {
    if (!isEditing) {
      const clampedSerie = Math.max(MIN_SERIES, Math.min(MAX_SERIES, serie))
      setInputValue(clampedSerie.toString())
    }
  }, [serie, isEditing])

  // Auto-focus sur l'input quand on passe en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const onClick = useCallback(
    (adjustment: number) => {
      const newSerie = Math.max(MIN_SERIES, Math.min(MAX_SERIES, serie + adjustment))
      onSerieChange(newSerie)
    },
    [serie, onSerieChange],
  )

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputBlur = useCallback(() => {
    const numValue = Number.parseInt(inputValue, 10)
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(MIN_SERIES, Math.min(MAX_SERIES, numValue))
      onSerieChange(clampedValue)
    }
    setIsEditing(false)
  }, [inputValue, onSerieChange])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        inputRef.current?.blur()
      }
    },
    [],
  )

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
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="text-7xl font-bold tracking-tighter bg-transparent border-none outline-none text-center w-full focus:ring-2 focus:ring-primary rounded-md"
              aria-label="Modifier les séries"
              min={MIN_SERIES}
              max={MAX_SERIES}
              step="1"
            />
          ) : (
            <output
              className="text-7xl font-bold tracking-tighter cursor-pointer hover:text-primary transition-colors"
              aria-live="polite"
              onClick={handleEditClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleEditClick()
                }
              }}
              role="button"
              tabIndex={0}
            >
              {serie}
            </output>
          )}
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
