import { Minus, Plus } from "lucide-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const MIN_WEIGHT = 0
const MAX_WEIGHT = 250

const actionButtonStyle = "h-8 w-8 shrink-0 rounded-full"
const weightStep = [1, 1.25, 2.5, 5, 10, 20] as const

interface DrawerWeightProps {
  weight: number
  onWeightChange: (weight: number) => void
}

export const DrawerWeight = memo(function DrawerWeight({
  weight,
  onWeightChange,
}: DrawerWeightProps) {
  const [step, setStep] = useState(1.25)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(weight.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchroniser inputValue avec weight quand weight change de l'extérieur
  useEffect(() => {
    if (!isEditing) {
      setInputValue(weight.toString())
    }
  }, [weight, isEditing])

  // Auto-focus sur l'input quand on passe en mode édition
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
    <div className="p-4 pb-0 mb-10">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className={actionButtonStyle}
          onClick={() => handleWeightChange(-step)}
          disabled={weight <= MIN_WEIGHT}
          aria-label="Decrease weight"
        >
          <Minus />
          <span className="sr-only">Decrease</span>
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
              className="text-7xl font-bold tracking-tighter bg-transparent border-none outline-none text-center w-full focus:ring-2 focus:ring-primary rounded-md"
              aria-label="Modifier le poids"
              min={MIN_WEIGHT}
              max={MAX_WEIGHT}
              step="0.25"
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
            >
              {weight}
            </output>
          )}
          <div className="text-muted-foreground text-[0.70rem] uppercase">Poids (Kg)</div>
          {weight >= MAX_WEIGHT && (
            <span className="text-red-600 mt-4 inline-block">Max maximal atteint</span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={actionButtonStyle}
          onClick={() => handleWeightChange(step)}
          disabled={weight >= MAX_WEIGHT}
          aria-label="Increase weight"
        >
          <Plus />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
      <div className="flex justify-between mt-10">
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
  )
})

DrawerWeight.displayName = "DrawerWeight"
