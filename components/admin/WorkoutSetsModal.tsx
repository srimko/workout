"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Save, ChevronLeft, ChevronRight, Link } from "lucide-react"
import { useState } from "react"
import { updateSet, deleteSet } from "@/lib/actions/admin"
import { toast } from "sonner"
import type { SetWithExercise, WorkoutWithSets } from "@/lib/types"

const SETS_PER_PAGE = 3

interface WorkoutSetsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workoutId: string
  workoutTitle: string
  sets: SetWithExercise[]
  allWorkouts: WorkoutWithSets[]
  onSetsUpdated?: (updatedSets: SetWithExercise[]) => void
}

interface EditingSet {
  id: string
  weight: number
  repetition: number
  workout_id: string
}

export function WorkoutSetsModal({
  open,
  onOpenChange,
  workoutId,
  workoutTitle,
  sets: initialSets,
  allWorkouts,
  onSetsUpdated,
}: WorkoutSetsModalProps) {
  const [sets, setSets] = useState(initialSets)
  const [editingMode, setEditingMode] = useState<"single" | "multi">("single")
  const [modifiedSets, setModifiedSets] = useState<Map<string, EditingSet>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Calculer le nombre de pages et les sets à afficher
  const totalPages = Math.ceil(sets.length / SETS_PER_PAGE)
  const startIndex = (currentPage - 1) * SETS_PER_PAGE
  const endIndex = startIndex + SETS_PER_PAGE
  const paginatedSets = sets.slice(startIndex, endIndex)

  // Réinitialiser à la page 1 si les sets changent
  const handleSetsChange = (newSets: typeof sets) => {
    setSets(newSets)
    setCurrentPage(1)
  }

  // Activer le mode édition multi
  const handleEnableMultiEdit = () => {
    setEditingMode("multi")
  }

  // Annuler toutes les modifications
  const handleCancelAll = () => {
    setModifiedSets(new Map())
    setEditingMode("single")
  }

  // Modifier un set (ajoute ou update dans modifiedSets)
  const handleSetChange = (
    setId: string,
    field: "weight" | "repetition" | "workout_id",
    value: number | string,
  ) => {
    const originalSet = sets.find((s) => s.id === setId)
    if (!originalSet) return

    const currentModified = modifiedSets.get(setId) || {
      id: setId,
      weight: originalSet.weight,
      repetition: originalSet.repetition,
      workout_id: originalSet.workout_id,
    }

    const updated = { ...currentModified, [field]: value }
    const newModified = new Map(modifiedSets)
    newModified.set(setId, updated)
    setModifiedSets(newModified)
  }

  // Vérifier si un set est modifié
  const isSetModified = (setId: string) => {
    return modifiedSets.has(setId)
  }

  // Obtenir les valeurs actuelles (modifiées ou originales)
  const getCurrentSetValues = (set: SetWithExercise) => {
    return modifiedSets.get(set.id) || set
  }

  // Enregistrer tous les sets modifiés
  const handleSaveAll = async () => {
    if (modifiedSets.size === 0) {
      toast.info("Aucune modification à enregistrer")
      return
    }

    setIsLoading(true)
    try {
      const results = await Promise.all(
        Array.from(modifiedSets.values()).map((modified) =>
          updateSet(modified.id, {
            weight: modified.weight,
            repetition: modified.repetition,
            workout_id: modified.workout_id,
          }),
        ),
      )

      const allSuccessful = results.every((r) => r !== null)

      if (allSuccessful) {
        // Retirer les sets déplacés et mettre à jour les autres
        let updatedSets = sets
        const movedSets: string[] = []

        modifiedSets.forEach((modified) => {
          if (modified.workout_id !== workoutId) {
            movedSets.push(modified.id)
          }
        })

        // Retirer les sets déplacés
        updatedSets = updatedSets.filter((s) => !movedSets.includes(s.id))

        // Mettre à jour les sets non déplacés
        updatedSets = updatedSets.map((s) => {
          const modified = modifiedSets.get(s.id)
          if (modified && !movedSets.includes(s.id)) {
            return { ...s, ...modified }
          }
          return s
        })

        handleSetsChange(updatedSets)
        setModifiedSets(new Map())
        setEditingMode("single")

        toast.success(
          `${results.length} set(s) modifié(s)${movedSets.length > 0 ? ` (${movedSets.length} déplacé(s))` : ""}`,
        )
        onSetsUpdated?.(updatedSets)
      } else {
        toast.error("Erreur lors de la modification de certains sets")
      }
    } catch (error) {
      console.error("Error updating sets:", error)
      toast.error("Erreur lors de la modification")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (setId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce set ?")) return

    setIsLoading(true)
    try {
      const result = await deleteSet(setId)

      if (result) {
        // Supprimer le set du state local
        const updatedSets = sets.filter((s) => s.id !== setId)
        handleSetsChange(updatedSets)

        toast.success("Set supprimé avec succès")
        onSetsUpdated?.(updatedSets)
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting set:", error)
      toast.error("Erreur lors de la suppression")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle></DialogTitle>
            {workoutTitle} - Sets <span className="text-xs text-gray-800">{workoutId}</span>
            {editingMode === "single" ? (
              <Button onClick={handleEnableMultiEdit} variant="outline" size="sm">
                Édition groupée
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAll}
                  disabled={isLoading || modifiedSets.size === 0}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Enregistrer tout ({modifiedSets.size})
                </Button>
                <Button onClick={handleCancelAll} variant="outline" size="sm">
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {sets && sets.length > 0 ? (
            <>
              {/* Liste des sets paginés */}
              <div className="space-y-4">
                {paginatedSets.map((set) => {
                  const currentValues = getCurrentSetValues(set)
                  const isModified = isSetModified(set.id)

                  return (
                    <div
                      key={set.id}
                      className={`border rounded-lg p-4 space-y-3 ${isModified ? "" : ""}`}
                    >
                      {/* Exercice info avec badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 flex items-center gap-2">
                          <div>
                            <p className="font-semibold">{set.exercise.title}</p>
                            <p className="text-sm text-gray-500">{set.exercise.category.name}</p>
                          </div>
                          {isModified && (
                            <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                              Modifié
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {new Date(set.created_at).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(set.created_at).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Contenu du set */}
                      {editingMode === "multi" ? (
                        // Mode édition groupée
                        <div className="space-y-3">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500">Poids (kg)</label>
                              <Input
                                type="number"
                                value={currentValues.weight}
                                onChange={(e) =>
                                  handleSetChange(set.id, "weight", parseFloat(e.target.value) || 0)
                                }
                                className="mt-1"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-500">Répétitions</label>
                              <Input
                                type="number"
                                value={currentValues.repetition}
                                onChange={(e) =>
                                  handleSetChange(
                                    set.id,
                                    "repetition",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="mt-1"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Déplacer vers workout</label>
                            <Select
                              value={currentValues.workout_id}
                              onValueChange={(value) =>
                                handleSetChange(set.id, "workout_id", value)
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner un workout" />
                              </SelectTrigger>
                              <SelectContent>
                                {allWorkouts.map((workout) => (
                                  <SelectItem key={workout.id} value={workout.id}>
                                    {workout.title} {workout.id === workoutId && "(actuel)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              onClick={() => handleDelete(set.id)}
                              variant="destructive"
                              size="sm"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Mode affichage simple
                        <>
                          <div className="flex gap-4 items-center justify-between">
                            <div className="flex gap-6">
                              <div>
                                <p className="text-xs text-gray-500">Poids</p>
                                <p className="text-lg font-semibold">{set.weight} kg</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Répétitions</p>
                                <p className="text-lg font-semibold">{set.repetition} reps</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleDelete(set.id)}
                                variant="destructive"
                                size="sm"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Link className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-400">
                              {workoutTitle} • <span className="font-mono">{set.id}</span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} / {totalPages} • {sets.length} sets
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1 || isLoading}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages || isLoading}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucun set dans ce workout</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
