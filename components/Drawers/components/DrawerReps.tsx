import { Minus, Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_REPS = 1
const MAX_REPS = 15

interface DrawerRepsProsp {
  repetition: number
  onRepetitionChange: (repetition: number) => void
}

export function DrawerReps({ repetition, onRepetitionChange }: DrawerRepsProsp) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(repetition.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchroniser inputValue avec repetition quand repetition change de l'extérieur
  useEffect(() => {
    if (!isEditing) {
      setInputValue(repetition.toString())
    }
  }, [repetition, isEditing])

  // Auto-focus sur l'input quand on passe en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const onClick = useCallback(
    (adjustment: number) => {
      const newReps = Math.max(MIN_REPS, Math.min(MAX_REPS, repetition + adjustment))
      onRepetitionChange(newReps)
    },
    [repetition, onRepetitionChange],
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
      const clampedValue = Math.max(MIN_REPS, Math.min(MAX_REPS, numValue))
      onRepetitionChange(clampedValue)
    }
    setIsEditing(false)
  }, [inputValue, onRepetitionChange])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur()
    }
  }, [])

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
              aria-label="Modifier les répétitions"
              min={MIN_REPS}
              max={MAX_REPS}
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
              {repetition}
            </output>
          )}
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
