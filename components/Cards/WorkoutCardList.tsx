"use client"

import { useState, memo, useMemo } from "react"
import { WorkoutCard, type SetWithExerciseInfo } from "@/components/Cards/WorkoutCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "../ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash } from "lucide-react"

interface WorkoutCardListProps {
  sets?: SetWithExerciseInfo[]
  onEditSet?: (set: SetWithExerciseInfo) => void
  onDeleteSet?: (set: SetWithExerciseInfo) => void
  workoutTitle?: string
}

interface CategoryGroup {
  categoryName: string
  sets: SetWithExerciseInfo[]
  totalWeight: number
  totalVolume: number
}

export const WorkoutCardList = memo(function WorkoutCardList({
  sets,
  onEditSet,
  onDeleteSet,
  workoutTitle,
}: WorkoutCardListProps) {
  if (!sets || sets.length === 0) {
    return null
  }

  const [onEdit, setOnEdit] = useState<string | null>(null)

  // Calculer les stats globales
  const totalSets = sets.length
  const totalWeight = sets.reduce((sum, set) => sum + set.weight, 0)
  const totalReps = sets.reduce((sum, set) => sum + set.repetition, 0)
  const avgWeight = (totalWeight / totalSets).toFixed(1)

  // Regrouper les sets par catégorie musculaire
  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, CategoryGroup>()

    sets.forEach((set) => {
      const categoryName = set.category_name
      if (!groups.has(categoryName)) {
        groups.set(categoryName, {
          categoryName,
          sets: [],
          totalWeight: 0,
          totalVolume: 0,
        })
      }

      const group = groups.get(categoryName)!
      group.sets.push(set)
      group.totalWeight += set.weight
      group.totalVolume += set.weight * set.repetition
    })

    console.log(Array.from(groups.values()))

    // Retourner les groupes dans l'ordre d'apparition
    return Array.from(groups.values())
  }, [sets])

  // Ouvrir uniquement la catégorie du dernier set ajouté
  const defaultOpenCategories = useMemo(() => {
    if (sets.length === 0) return []
    // Le dernier set est le dernier élément du tableau (ordre chronologique)
    const lastSet = sets[sets.length - 1]
    return [lastSet.category_name]
  }, [sets])

  const handleClick = (id: string) => {
    console.log(onEdit)
    if (id === onEdit) {
      setOnEdit(null)
      return
    }
    setOnEdit(id)
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Résumé de la séance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalSets}</p>
              <p className="text-xs text-muted-foreground">séries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">kg total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{avgWeight}</p>
              <p className="text-xs text-muted-foreground">kg moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Title */}
      {workoutTitle && <h2 className="text-lg font-semibold">{workoutTitle}</h2>}

      <div>
        <Accordion type="multiple" defaultValue={defaultOpenCategories} className="w-full">
          {groupedByCategory.map((group) => (
            <AccordionItem key={group.categoryName} value={group.categoryName}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between gap-3 w-full">
                  <span className="font-semibold text-base">{group.categoryName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {group.sets.length} série{group.sets.length > 1 ? "s" : ""}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="flex justify-between">
                    <h3 className="font-semibold text-base leading-tight truncate">
                      Tirage horizontal
                    </h3>
                    <Badge>Dos</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {group.sets.map((set, index) => (
                        <>
                          <div
                            key={set.id}
                            className="flex items-center justify-between text-sm bg-background rounded px-3 py-2"
                            onClick={() => handleClick(set.id)}
                          >
                            <span className="text-muted-foreground font-medium">
                              Série {index + 1}
                            </span>
                            <span className="font-semibold">
                              {set.weight}kg × {set.repetition} reps
                            </span>
                          </div>
                          {onEdit === set.id && (
                            <div className="my-4 flex justify-between">
                              <Button
                                className="p-0 flex-shrink-0 active:bg-accent"
                                onClick={() => onEditSet?.(set)}
                              >
                                <Pencil className="h-4 w-4" /> Modifier
                                <span className="sr-only">Modifier</span>
                              </Button>

                              <Button
                                variant="destructive"
                                className="p-0 flex-shrink-0 active:bg-accent"
                                onClick={() => onDeleteSet?.(set)}
                              >
                                <Trash className="h-4 w-4" /> Supprimer
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
})

WorkoutCardList.displayName = "WorkoutCardList"
