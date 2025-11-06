"use client"

import { memo, useMemo } from "react"
import { WorkoutCard, type SetWithExerciseInfo } from "@/components/Cards/WorkoutCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface WorkoutCardListProps {
  sets?: SetWithExerciseInfo[]
  onEditSet?: (set: SetWithExerciseInfo) => void
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
  workoutTitle,
}: WorkoutCardListProps) {
  if (!sets || sets.length === 0) {
    return null
  }

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
      {workoutTitle && <h2 className="text-lg font-semibold px-4">{workoutTitle}</h2>}

      {/* Accordéons par groupe musculaire */}
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
                <div className="space-y-3 pt-2">
                  {group.sets.map((set) => {
                    // Trouver l'index global du set
                    const globalIndex = sets.findIndex((s) => s.id === set.id)
                    return (
                      <WorkoutCard key={set.id} set={set} index={globalIndex} onEdit={onEditSet} />
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
})

WorkoutCardList.displayName = "WorkoutCardList"
