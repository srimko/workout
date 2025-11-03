"use client"

import { useEffect, useState } from "react"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WorkoutWithSets, SetWithExercise } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface CategoryVolume {
  categoryName: string
  volume: number
  percentage: number
  setsCount: number
}

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getAllWorkoutsWithSets()
        setWorkouts(data)
      } catch (error) {
        console.error("Error loading workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  // Calculer le volume par catégorie pour un workout
  function calculateVolumeByCategory(sets: SetWithExercise[]): CategoryVolume[] {
    const volumeByCategory: Record<
      string,
      { volume: number; categoryName: string; setsCount: number }
    > = {}

    // Calculer le volume total par catégorie
    sets.forEach((set) => {
      const categoryId = set.exercise.category.id
      const categoryName = set.exercise.category.name
      const volume = set.weight * set.repetition

      if (!volumeByCategory[categoryId]) {
        volumeByCategory[categoryId] = {
          volume: 0,
          categoryName,
          setsCount: 0,
        }
      }

      volumeByCategory[categoryId].volume += volume
      volumeByCategory[categoryId].setsCount += 1
    })

    // Calculer le volume total
    const totalVolume = Object.values(volumeByCategory).reduce((sum, cat) => sum + cat.volume, 0)

    // Convertir en tableau avec pourcentages
    return Object.entries(volumeByCategory)
      .map(([categoryId, data]) => ({
        categoryName: data.categoryName,
        volume: data.volume,
        percentage: totalVolume > 0 ? (data.volume / totalVolume) * 100 : 0,
        setsCount: data.setsCount,
      }))
      .sort((a, b) => b.volume - a.volume) // Trier par volume décroissant
  }

  if (loading) {
    return (
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-6">Workouts</h2>
        <p>Chargement...</p>
      </section>
    )
  }

  if (workouts.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Workouts</h2>
        <p className="text-muted-foreground">Aucun workout trouvé</p>
      </section>
    )
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Workouts</h2>

      <div className="space-y-6">
        {workouts.map((workout) => {
          const volumeStats = calculateVolumeByCategory(workout.sets)
          const totalVolume = volumeStats.reduce((sum, cat) => sum + cat.volume, 0)

          return (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{workout.title}</span>
                  <div className="flex">
                    <span className="text-sm font-normal text-muted-foreground">
                      {new Date(workout.started_at).toLocaleDateString("fr-FR")}
                    </span>
                    <Badge className="ml-4 text-xs bg-amber-400">Beta</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workout.sets.length === 0 ? (
                  <p className="text-muted-foreground">Aucun set pour ce workout</p>
                ) : (
                  <div className="space-y-4">
                    {/* Résumé général */}
                    <div className="grid grid-cols-3 gap-4 p-4rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{workout.sets.length}</p>
                        <p className="text-xs text-muted-foreground">séries</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{totalVolume.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">kg × reps</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {(totalVolume / workout.sets.length).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">volume moyen</p>
                      </div>
                    </div>

                    {/* Volume par catégorie */}
                    <div>
                      <h3 className="font-semibold mb-3">Volume par catégorie</h3>
                      <div className="space-y-3">
                        {volumeStats.map((category, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{category.categoryName}</span>
                              <div className="text-right">
                                <span className="text-sm font-semibold">
                                  {category.volume.toFixed(0)} kg×reps
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({category.setsCount} séries)
                                </span>
                              </div>
                            </div>
                            {/* Barre de progression */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${category.percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                              {category.percentage.toFixed(1)}% du volume total
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
