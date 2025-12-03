"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { DrawerAddSerie } from "@/components/Drawers/components/DrawerAddSerie"
import { DrawerSelectExercise } from "@/components/Drawers/components/DrawerSelectExercise"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useCreateSet, useUpdateSet } from "@/lib/hooks/useSets"
import type { Serie } from "@/lib/types"

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
  const [formData, setFormData] = useState({
    exercise: "",
    weight: 0,
    serie: 0,
    repetition: 0,
    allSeries: [] as Serie[],
  })
  const { createSet, loading: isCreating, error: createError } = useCreateSet()
  const { updateSet, loading: isUpdating, error: updateError } = useUpdateSet()
  const [step, setStep] = useState(0)
  const _isLoading = isCreating
  const error = createError

  const steps = [
    {
      title: "Exercice",
      description: "Sélection un exercice",
      component: DrawerSelectExercise,
      props: {
        repetition: formData.repetition,
        onSelectExercise: handleExerciseChange,
      },
      fieldKey: "exercise",
      isValid: () => formData.exercise !== "",
    },
    {
      title: "Séries",
      description: "Configurer vos séries",
      component: DrawerAddSerie,
      props: {
        exerciseName: formData.exercise,
        weight: formData.weight,
        onWeightChange: handleWeightChange,
        allSeries: formData.allSeries,
        onSeriesChange: handleSeriesChange,
      },
      fieldKey: "allSeries",
      isValid: () => formData.allSeries.length > 0,
    },
  ]
  const CurrentComponent = steps[step].component as any
  const currentProps = steps[step].props as any

  function handleCancel() {
    if (onOpenChange) {
      onOpenChange(false)
    }
    if (onDrawerClose) {
      onDrawerClose(false)
    }
  }

  function handleExerciseChange(exercise: string) {
    setFormData({ ...formData, exercise })

    setStep(step + 1)
  }
  function handleWeightChange(weight: number) {
    setFormData({ ...formData, weight })
  }
  // function handleRepetionChange(repetition: number) {
  //   setFormData({ ...formData, repetition })
  // }
  function handleSeriesChange(allSeries: Serie[]) {
    setFormData({ ...formData, allSeries })
  }

  async function handleSaveSet() {
    console.log("Saving set:", formData)
    const promises = formData.allSeries.map((serie) =>
      createSet(formData.exercise, serie.weight, serie.rep),
    )
    const results = await Promise.all(promises)
    // Check if all sets were created successfully
    const allSuccess = results.every((result) => result !== null)

    if (allSuccess) {
      toast.success("Sets enregistrés !", {
        description: `${formData.allSeries.length} série(s) ajoutée(s)`,
        duration: 1000,
      })
      router.refresh()
      handleCancel()
      // Appeler le callback pour rafraîchir les données
      if (onSetCreated) {
        await onSetCreated()
      }
    } else {
      // Check for error details
      const errorMsg = error?.message || "Certains sets n'ont pas pu être créés"
      console.error("Set creation failed:", errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DrawerContent className="h-[95vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{steps[step].title}</DrawerTitle>
            <DrawerDescription>{steps[step].description}</DrawerDescription>
          </DrawerHeader>
          {CurrentComponent && <CurrentComponent {...currentProps} />}
          <DrawerFooter className="absolute bottom-0 w-full">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setStep(step - 1)} disabled={step === 0}>
                Précédent
              </Button>
              <Button
                onClick={() => {
                  setStep(step + 1)
                }}
                disabled={step === steps.length - 1}
              >
                Suivant
              </Button>
            </div>
            <Button onClick={handleSaveSet} disabled={!steps[step].isValid()}>
              Envoyer
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
