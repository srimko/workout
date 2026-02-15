import { Minus, Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_REPS = 1
const MAX_REPS = 15

interface DrawerRepsProps {
  repetition: number
  onRepetitionChange: (repetition: number) => void
  compact?: boolean
}

export function DrawerReps({ repetition, onRepetitionChange, compact = false }: DrawerRepsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(repetition.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setInputValue(repetition.toString())
    }
  }, [repetition, isEditing])

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

  const textSize = compact ? "text-4xl" : "text-7xl"
  const buttonSize = compact ? "h-12 w-12" : "h-14 w-14"

  return (
    <div className={compact ? "" : "p-4 pb-0 mb-10"}>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className={`${buttonSize} shrink-0 rounded-full`}
          onClick={() => onClick(-1)}
          disabled={repetition <= MIN_REPS}
          aria-label="Diminuer les répétitions"
        >
          <Minus className="h-5 w-5" />
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
              className={`${textSize} font-bold tracking-tighter bg-transparent border-none outline-none text-center w-full focus:ring-2 focus:ring-primary rounded-md`}
              aria-label="Modifier les répétitions"
              min={MIN_REPS}
              max={MAX_REPS}
              step="1"
            />
          ) : (
            <output
              role="button"
              tabIndex={0}
              className={`${textSize} font-bold tracking-tighter cursor-pointer hover:text-primary active:text-primary/80 transition-colors px-3 py-1 rounded-lg hover:bg-muted/50 active:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`}
              aria-live="polite"
              aria-label="Modifier les répétitions au clavier"
              onClick={handleEditClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleEditClick()
                }
              }}
            >
              {repetition}
            </output>
          )}
          {!compact && (
            <div className="text-muted-foreground text-xs uppercase">
              Répétition{repetition > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={`${buttonSize} shrink-0 rounded-full`}
          onClick={() => onClick(1)}
          disabled={repetition >= MAX_REPS}
          aria-label="Augmenter les répétitions"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
