"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { DrawerAddSerie } from "@/components/Drawers/components/DrawerAddSerie"
import { DrawerSelectExercise } from "@/components/Drawers/components/DrawerSelectExercise"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useCreateSet, useLastSet } from "@/lib/hooks/useSets"

const DRAFT_KEY = "draft-set-form"

interface FormData {
  exercise: string
  exerciseImage: string
  exerciseId: number | null
  weight: number
  reps: number
  serieCount: number
}

const initialFormData: FormData = {
  exercise: "",
  exerciseImage: "",
  exerciseId: null,
  weight: 0,
  reps: 1,
  serieCount: 1,
}

interface DrawerExerciseProps {
  drawerOpen?: boolean
  onDrawerClose?: (isOpen: boolean) => void
  onSetCreated?: () => void | Promise<void>
  onSetUpdated?: () => void | Promise<void>
  editMode?: boolean
  setToEdit?: any
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DrawerExercise({
  drawerOpen,
  onDrawerClose,
  onSetCreated,
  onSetUpdated,
  editMode = false,
  setToEdit,
  open,
  onOpenChange,
}: DrawerExerciseProps) {
  const isOpen = open ?? drawerOpen ?? false
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const { createSet, error: createError } = useCreateSet()
  const { fetchLastSet } = useLastSet()
  const [step, setStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Restaurer le brouillon à l'ouverture
  useEffect(() => {
    if (isOpen) {
      try {
        const draft = sessionStorage.getItem(DRAFT_KEY)
        if (draft) {
          const parsed = JSON.parse(draft) as FormData
          setFormData(parsed)
          if (parsed.exercise) {
            setStep(1)
          }
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [isOpen])

  // Sauvegarder le brouillon à chaque changement
  useEffect(() => {
    if (isOpen && (formData.exercise || formData.weight > 0)) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    }
  }, [formData, isOpen])

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(DRAFT_KEY)
  }, [])

  const steps = [
    {
      title: "Exercice",
      description: "Sélectionnez un exercice",
      component: DrawerSelectExercise,
      props: {
        onSelectExercise: handleExerciseChange,
      },
      isValid: () => formData.exercise !== "",
    },
    {
      title: "Séries",
      description: "Réglez le poids et les répétitions",
      component: DrawerAddSerie,
      props: {
        exerciseName: formData.exercise,
        exerciseImage: formData.exerciseImage,
        weight: formData.weight,
        onWeightChange: handleWeightChange,
        reps: formData.reps,
        onRepsChange: handleRepsChange,
        serieCount: formData.serieCount,
        onSerieCountChange: handleSerieCountChange,
      },
      isValid: () => formData.weight > 0,
    },
  ]
  const CurrentComponent = steps[step].component as any
  const currentProps = steps[step].props as any

  function handleOpenChange(open: boolean) {
    if (!open) {
      // Reset state on close
      setFormData(initialFormData)
      setStep(0)
      clearDraft()
    }
    if (onOpenChange) {
      onOpenChange(open)
    }
    if (onDrawerClose) {
      onDrawerClose(open)
    }
  }

  async function handleExerciseChange(exercise: string, image: string, exerciseId: number) {
    // Avancer au step 1 immédiatement (pattern optimiste)
    setFormData((prev) => ({ ...prev, exercise, exerciseImage: image, exerciseId }))
    setStep(1)

    // Pré-remplir avec la dernière série en arrière-plan
    const lastSet = await fetchLastSet(exerciseId)
    if (lastSet) {
      setFormData((prev) => ({ ...prev, weight: lastSet.weight, reps: lastSet.repetition }))
    }
  }

  function handleWeightChange(weight: number) {
    setFormData((prev) => ({ ...prev, weight }))
  }
  function handleRepsChange(reps: number) {
    setFormData((prev) => ({ ...prev, reps }))
  }
  function handleSerieCountChange(serieCount: number) {
    setFormData((prev) => ({ ...prev, serieCount }))
  }

  function handleChangeExercise() {
    setStep(0)
  }

  async function handleSaveSet() {
    setIsSaving(true)
    try {
      const promises = Array.from({ length: formData.serieCount }, () =>
        createSet(formData.exercise, formData.weight, formData.reps),
      )
      const results = await Promise.all(promises)
      const allSuccess = results.every((result) => result !== null)

      if (allSuccess) {
        toast.success("Sets enregistrés !", {
          description: `${formData.serieCount} série(s) ajoutée(s)`,
          duration: 3000,
        })
        clearDraft()
        router.refresh()
        handleOpenChange(false)
        if (onSetCreated) {
          await onSetCreated()
        }
      } else {
        const errorMsg = createError?.message || "Certains sets n'ont pas pu être créés"
        console.error("Set creation failed:", errorMsg, createError)
        toast.error(errorMsg)
      }
    } catch (err) {
      console.error("Error saving sets:", err)
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsSaving(false)
    }
  }

  const ctaLabel =
    formData.serieCount === 1
      ? "Enregistrer 1 série"
      : `Enregistrer ${formData.serieCount} séries`

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DrawerContent className="h-[95vh]">
        <div className="mx-auto w-full max-w-sm flex flex-col h-full overflow-hidden">
          <DrawerHeader>
            <div className="flex items-center justify-center gap-2 mb-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-8 bg-primary" : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>
            <DrawerTitle>{steps[step].title}</DrawerTitle>
            <DrawerDescription>{steps[step].description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto">
            {CurrentComponent && <CurrentComponent {...currentProps} />}
          </div>
          {step > 0 && (
            <DrawerFooter>
              <Button onClick={handleSaveSet} disabled={!steps[step].isValid() || isSaving}>
                {isSaving ? "Enregistrement..." : ctaLabel}
              </Button>
              <Button variant="link" className="text-muted-foreground" onClick={handleChangeExercise}>
                Changer d'exercice
              </Button>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
