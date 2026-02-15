import { Minus, Plus } from "lucide-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_WEIGHT = 0
const MAX_WEIGHT = 250

const actionButtonStyle = "h-14 w-14 shrink-0 rounded-full"
const weightStep = [1, 2.5, 5, 10] as const

interface DrawerWeightProps {
  weight: number
  onWeightChange: (weight: number) => void
}

export const DrawerWeight = memo(function DrawerWeight({
  weight,
  onWeightChange,
}: DrawerWeightProps) {
  const [step, setStep] = useState(2.5)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(weight.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setInputValue(weight.toString())
    }
  }, [weight, isEditing])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleWeightChange = useCallback(
    (adjustment: number) => {
      const newWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight + adjustment))
      onWeightChange(newWeight)
    },
    [weight, onWeightChange],
  )

  const handleStepChange = useCallback((selectedWeight: number) => {
    setStep(selectedWeight)
  }, [])

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputBlur = useCallback(() => {
    const numValue = Number.parseFloat(inputValue)
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, numValue))
      onWeightChange(clampedValue)
    }
    setIsEditing(false)
  }, [inputValue, onWeightChange])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur()
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className={actionButtonStyle}
          onClick={() => handleWeightChange(-step)}
          disabled={weight <= MIN_WEIGHT}
          aria-label="Diminuer le poids"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="text-5xl font-bold tracking-tighter bg-transparent border-none outline-none text-center w-full focus:ring-2 focus:ring-primary rounded-md"
              aria-label="Modifier le poids"
              min={MIN_WEIGHT}
              max={MAX_WEIGHT}
              step="0.25"
            />
          ) : (
            <output
              role="button"
              tabIndex={0}
              className="text-5xl font-bold tracking-tighter cursor-pointer hover:text-primary active:text-primary/80 transition-colors px-3 py-1 rounded-lg hover:bg-muted/50 active:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-live="polite"
              aria-label="Modifier le poids au clavier"
              onClick={handleEditClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleEditClick()
                }
              }}
            >
              {weight}
            </output>
          )}
          <div className="text-muted-foreground text-xs uppercase">Poids (kg)</div>
          {weight >= MAX_WEIGHT && (
            <span className="text-destructive mt-4 inline-block">Maximum atteint</span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={actionButtonStyle}
          onClick={() => handleWeightChange(step)}
          disabled={weight >= MAX_WEIGHT}
          aria-label="Augmenter le poids"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-1 mt-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Incrément</span>
        <div className="flex gap-2" role="radiogroup" aria-label="Incrément de poids">
          {weightStep.map((stepValue) => (
            <Button
              key={stepValue}
              variant={step === stepValue ? "default" : "ghost"}
              onClick={() => handleStepChange(stepValue)}
              role="radio"
              aria-checked={step === stepValue}
              aria-label={`Ajuster par ${stepValue} kg`}
            >
              {stepValue}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
})

DrawerWeight.displayName = "DrawerWeight"
