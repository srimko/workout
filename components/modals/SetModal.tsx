import { useCallback, useState } from "react"
import { RepDisplay } from "@/components/modals/components/RepDisplay"
import { RepSelector } from "@/components/modals/components/RepSelector"
import { SerieDisplay } from "@/components/modals/components/SerieDisplay"
import { SerieSelector } from "@/components/modals/components/SerieSelector"
import { WeightDisplay } from "@/components/modals/components/WeightDisplay"
import { WeightSelector } from "@/components/modals/components/WeightSelector"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Exercise, Profile } from "@/lib/types"
import { SelectExercise } from "./components/SelectExercise"

export interface SetModalProps {
  isOpen: boolean
  close: () => void
  title: string
  description: string
  profile?: Profile
  onConfirm: (data: {
    exerciceId: number
    weight: number
    serie: number
    repetition: number
  }) => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  exercises: Exercise[]
  variant?: "default" | "destructive" | "success"
}

export function SetModal({
  isOpen,
  close,
  title,
  description,
  profile,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  exercises,
}: SetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    exerciceId: exercises.length > 0 ? exercises[0].id.toString() : "",
    weight: "30",
    serie: "",
    repetition: "",
  })

  const handleConfirm = async () => {
    if (!formData.exerciceId) {
      alert("Veuillez sélectionner un exercice")
      return
    }
    if (!formData.weight || !formData.serie || !formData.repetition) {
      alert("Veuillez remplir tous les champs (poids, série, répétitions)")
      return
    }

    setIsLoading(true)

    await onConfirm({
      exerciceId: parseInt(formData.exerciceId),
      weight: parseFloat(formData.weight),
      serie: parseInt(formData.serie),
      repetition: parseInt(formData.repetition),
    })

    setIsLoading(false)

    setFormData({
      exerciceId: "",
      weight: "30",
      serie: "",
      repetition: "",
    })

    close()
  }

  const handleExerciseChange = useCallback((exerciceId: string) => {
    setFormData((prev) => ({ ...prev, exerciceId }))
  }, [])

  const handleWeightChange = useCallback((weight: string) => {
    setFormData((prev) => ({ ...prev, weight }))
  }, [])

  const handleSerieChange = useCallback((serie: string) => {
    setFormData((prev) => ({ ...prev, serie }))
  }, [])

  const handleRepetitionChange = useCallback((repetition: string) => {
    setFormData((prev) => ({ ...prev, repetition }))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title} - {profile && profile.display_name}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col justify-center py-2 max-w-2xl m-auto">
          <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="exercice">Exercice</Label>
            <SelectExercise
              exercises={exercises}
              exerciseId={formData.exerciceId}
              onExerciseChange={handleExerciseChange}
            />

            <div className="flex justify-between w-full gap-6">
              <WeightDisplay weight={formData.weight} />
              <SerieDisplay serie={formData.serie} />
              <RepDisplay rep={formData.repetition} />
            </div>

            {/* Tabs pour sélectionner poids, série, répétitions */}
            <Tabs defaultValue="weight" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weight">Poids</TabsTrigger>
                <TabsTrigger value="serie">Série</TabsTrigger>
                <TabsTrigger value="repetition">Répétitions</TabsTrigger>
              </TabsList>

              <TabsContent value="weight" className="mt-4">
                <div>
                  <h3 className="text-center font-semibold mb-4 text-lg">Sélectionner le poids</h3>
                  <WeightSelector weight={formData.weight} onWeightChange={handleWeightChange} />
                </div>
              </TabsContent>

              <TabsContent value="serie" className="mt-4">
                <div className="p-4">
                  <h3 className="text-center font-semibold mb-4 text-lg">Sélectionner la série</h3>
                  <SerieSelector serie={formData.serie} onSerieChange={handleSerieChange} />
                </div>
              </TabsContent>

              <TabsContent value="repetition" className="mt-4">
                <div className="p-4">
                  <h3 className="text-center font-semibold mb-4 text-lg">Nombre de répétitions</h3>
                  <RepSelector rep={formData.repetition} onRepChange={handleRepetitionChange} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Chargement..." : confirmText}
          </Button>
          <Button onClick={() => (onCancel ? onCancel() : close())} variant="outline">
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
