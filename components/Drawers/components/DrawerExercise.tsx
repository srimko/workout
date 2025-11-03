"use client"

import { useState, useEffect } from "react"
import { DrawerReps } from "@/components/Drawers/components/DrawerReps"
import { DrawerSelectExercise } from "@/components/Drawers/components/DrawerSelectExercise"
import { DrawerSerie } from "@/components/Drawers/components/DrawerSerie"
import { DrawerWeight } from "@/components/Drawers/components/DrawerWeight"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner"
import { useCreateSet, useUpdateSet } from "@/lib/hooks/useSets"
import type { Set } from "@/lib/types"

interface SetToEdit {
  id: string
  workout_id: string
  exercise_id: number
  weight: number
  repetition: number
  created_at: string
  updated_at: string
  exercise_name: string
  exercise_image?: string
  category_name?: string
}

interface DrawerExerciseProps {
  onSetCreated?: () => void
  // Props pour le mode édition
  editMode?: boolean
  setToEdit?: SetToEdit
  onSetUpdated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // Props pour customiser le trigger
  trigger?: React.ReactNode
  showTrigger?: boolean
}

export function DrawerExercise({
  onSetCreated,
  editMode = false,
  setToEdit,
  onSetUpdated,
  open: controlledOpen,
  onOpenChange,
  trigger,
  showTrigger = true,
}: DrawerExerciseProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    exercise: "",
    weight: 0,
    serie: 0,
    repetition: 0,
  })

  const { createSet, loading: isCreating, error: createError } = useCreateSet()
  const { updateSet, loading: isUpdating, error: updateError } = useUpdateSet()

  // Gérer l'état open de manière contrôlée ou non-contrôlée
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const isLoading = editMode ? isUpdating : isCreating
  const error = editMode ? updateError : createError

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editMode && setToEdit && open) {
      setFormData({
        exercise: setToEdit.exercise_name,
        weight: setToEdit.weight,
        serie: 1, // Toujours 1 en mode édition
        repetition: setToEdit.repetition,
      })
      // En mode édition, on commence au slide du poids (skip exercice)
      setStep(0)
    } else if (!editMode && !open) {
      // Reset en mode création quand le drawer se ferme
      setStep(0)
    }
  }, [editMode, setToEdit, open])

  // En mode édition, on skip les slides "Exercice" et "Serie"
  const steps = editMode
    ? [
        {
          title: "Poids kg",
          description: "Modifier le poids",
          component: DrawerWeight,
          props: { weight: formData.weight, onWeightChange: handleWeightChange },
          fieldKey: "weight",
          isValid: () => formData.weight > 0,
        },
        {
          title: "Répétitions",
          description: "Modifier le nombre de répétitions",
          component: DrawerReps,
          props: {
            repetition: formData.repetition,
            onRepetitionChange: handleRepetionChange,
          },
          fieldKey: "repetition",
          isValid: () => formData.repetition > 0,
        },
      ]
    : [
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
          title: "Poids kg",
          description: "Ajouter du poids",
          component: DrawerWeight,
          props: { weight: formData.weight, onWeightChange: handleWeightChange },
          fieldKey: "weight",
          isValid: () => formData.weight > 0,
        },
        {
          title: "Serie",
          description: "Ajouter la serie",
          component: DrawerSerie,
          props: { serie: formData.serie, onSerieChange: handleSerieChange },
          fieldKey: "serie",
          isValid: () => formData.serie > 0,
        },
        {
          title: "Répétitions",
          description: "Ajouter le nombre de répétitions",
          component: DrawerReps,
          props: {
            repetition: formData.repetition,
            onRepetitionChange: handleRepetionChange,
          },
          fieldKey: "repetition",
          isValid: () => formData.repetition > 0,
        },
      ]

  const CurrentComponent = steps[step].component as any
  const currentProps = steps[step].props as any

  function handleExerciseChange(exercise: string) {
    console.log("handleExerciseChange", exercise)
    setFormData({ ...formData, exercise })

    setStep(step + 1)
  }
  function handleWeightChange(weight: number) {
    console.log("handleWeightChange", weight)
    setFormData({ ...formData, weight })
  }
  function handleSerieChange(serie: number) {
    console.log("handleSerieChange", serie)
    setFormData({ ...formData, serie })
  }
  function handleRepetionChange(repetition: number) {
    console.log("handleRepChange")
    setFormData({ ...formData, repetition })
  }

  function formatExerciseDisplay(formData: {
    exercise: string
    weight: number
    serie: number
    repetition: number
  }) {
    const { exercise, weight, serie, repetition } = formData

    let display = ""

    // Afficher l'exercice s'il existe
    if (exercise) {
      display += exercise.slice(0, 15) + "..."
    }

    // Ajouter le poids s'il existe
    if (weight) {
      display += display ? ` / ${weight}kg` : `${weight}kg`
    }

    // Ajouter les séries s'il existe
    if (serie) {
      const seriePlural = serie > 1 ? "series" : "serie"
      display += display ? ` : ${seriePlural} ${serie}` : `${seriePlural} ${serie}`
    }

    // Ajouter les répétitions s'il existe
    if (repetition) {
      const repetitionPlural = repetition > 1 ? "répétitions" : "répétition"
      display += display
        ? ` en ${repetition} ${repetitionPlural}`
        : `${repetition} ${repetitionPlural}`
    }

    return display
  }

  function handleResetForm() {
    setFormData({
      exercise: "",
      weight: 0,
      serie: 0,
      repetition: 0,
    })
    setStep(0)
    setOpen(false)
  }

  // Fonction pour vérifier si on peut aller au step suivant
  function canProceedToNextStep() {
    return steps[step].isValid()
  }

  // Fonction pour vérifier si on peut revenir en arrière (toujours vrai)
  function canGoToPreviousStep() {
    return step > 0
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {!editMode && showTrigger && (
        <DrawerTrigger asChild>
          {trigger || <Button>Ajouter mon exercice</Button>}
        </DrawerTrigger>
      )}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {editMode ? `Modifier - ${setToEdit?.exercise_name}` : steps[step].title}
            </DrawerTitle>
            <DrawerDescription>{formatExerciseDisplay(formData)}</DrawerDescription>
          </DrawerHeader>
          {CurrentComponent && <CurrentComponent {...currentProps} />}
          <DrawerFooter className="mb-12">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setStep(step - 1)} disabled={!canGoToPreviousStep()}>
                Précédent
              </Button>
              <Button
                onClick={async () => {
                  if (step === steps.length - 1) {
                    // Dernière étape : sauvegarder ou mettre à jour le set
                    try {
                      if (editMode && setToEdit) {
                        // Mode édition : mettre à jour le set existant
                        console.log("Updating set:", { setId: setToEdit.id, formData })

                        const result = await updateSet(
                          setToEdit.id,
                          formData.weight,
                          formData.repetition,
                        )

                        if (result) {
                          toast.success("Série modifiée !", {
                            description: `${formData.repetition} répétitions à ${formData.weight}kg`,
                            duration: 1000,
                          })
                          handleResetForm()
                          // Appeler le callback pour rafraîchir les données
                          onSetUpdated?.()
                        } else {
                          const errorMsg = error?.message || "Impossible de modifier la série"
                          console.error("Set update failed:", errorMsg, error)
                          throw new Error(errorMsg)
                        }
                      } else {
                        // Mode création : créer de nouveaux sets
                        console.log("Saving set:", formData)

                        // Create sets for each serie
                        const promises = []
                        for (let i = 0; i < formData.serie; i++) {
                          promises.push(
                            createSet(formData.exercise, formData.weight, formData.repetition),
                          )
                        }

                        const results = await Promise.all(promises)
                        console.log("Results:", results)

                        // Check if all sets were created successfully
                        const allSuccess = results.every((result) => result !== null)

                        if (allSuccess) {
                          toast.success("Set enregistré !", {
                            description: `${formData.serie} série(s) de ${formData.repetition} répétitions à ${formData.weight}kg ajoutée(s)`,
                            duration: 1000,
                          })
                          handleResetForm()
                          // Appeler le callback pour rafraîchir les données
                          onSetCreated?.()
                        } else {
                          // Check for error details
                          const errorMsg = error?.message || "Certains sets n'ont pas pu être créés"
                          console.error("Set creation failed:", errorMsg, error)
                          throw new Error(errorMsg)
                        }
                      }
                    } catch (err) {
                      console.error("Error saving/updating set:", err, error)
                      const errorMessage =
                        error?.message ||
                        (err instanceof Error ? err.message : null) ||
                        "Impossible d'enregistrer le set"

                      toast.error("Erreur", {
                        description: errorMessage,
                        duration: 1000,
                      })
                    }
                  } else {
                    // Autres étapes : Suivant
                    setStep(step + 1)
                  }
                }}
                disabled={isLoading || !canProceedToNextStep()}
              >
                {step === steps.length - 1
                  ? isLoading
                    ? editMode
                      ? "Modification..."
                      : "Enregistrement..."
                    : editMode
                      ? "Modifier"
                      : "Envoyer"
                  : "Suivant"}
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleResetForm}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
