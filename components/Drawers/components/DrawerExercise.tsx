"use client"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { useCreateSet } from "@/lib/hooks/useSets"

interface DrawerExerciseProps {
  onSetCreated?: () => void
}

export function DrawerExercise({ onSetCreated }: DrawerExerciseProps = {}) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    exercise: "",
    weight: 0,
    serie: 0,
    repetition: 0,
  })
  const [open, setOpen] = useState(false)
  const { createSet, loading: isLoading, error } = useCreateSet()
  const { toast } = useToast()

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
      title: "Poids kg",
      description: "Ajotuer du poids",
      component: DrawerWeight,
      props: { weight: formData.weight, onWeightChange: handleWeightChange },
      fieldKey: "weight",
      isValid: () => formData.weight > 0,
    },
    {
      title: "Serie",
      description: "Ajotuer la serie",
      component: DrawerSerie,
      props: { serie: formData.serie, onSerieChange: handleSerieChange },
      fieldKey: "serie",
      isValid: () => formData.serie > 0,
    },
    {
      title: "Répétitions",
      description: "Ajotuer le nombre de répétition",
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
      <DrawerTrigger asChild>
        <Button>Ajouter mon exercice</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{steps[step].title}</DrawerTitle>
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
                    // Dernière étape : sauvegarder le set
                    try {
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
                        toast({
                          title: "Set enregistré !",
                          description: `${formData.serie} série(s) de ${formData.repetition} répétitions à ${formData.weight}kg ajoutée(s)`,
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
                    } catch (err) {
                      console.error("Error saving set:", err, error)
                      const errorMessage =
                        error?.message ||
                        (err instanceof Error ? err.message : null) ||
                        "Impossible d'enregistrer le set"

                      toast({
                        title: "Erreur",
                        description: errorMessage,
                        variant: "destructive",
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
                    ? "Enregistrement..."
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
