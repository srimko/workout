"use client"

import { useEffect, useState, useMemo } from "react"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WorkoutWithSets, SetWithExercise } from "@/lib/types"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ExerciseInfo {
  exerciseId: number
  exerciseName: string
}

interface CategoryData {
  categoryId: string
  categoryName: string
  exercises: ExerciseInfo[]
  dataPoints: Array<{
    date: string
    dateFormatted: string
    maxWeight: number
    volume: number
    setsCount: number
  }>
  exerciseData: Map<
    number,
    Array<{
      date: string
      dateFormatted: string
      maxWeight: number
      volume: number
      setsCount: number
    }>
  >
}

interface CategoryStats {
  currentMaxWeight: number
  previousMaxWeight: number | null
  totalVolume: number
  totalSets: number
  progression: number | null
}

export default function EvolutionPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<Record<string, string>>({}) // categoryId -> "all" or exerciseId

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getAllWorkoutsWithSets()
        // Trier par date croissante pour l'affichage chronologique
        const sortedData = data.sort(
          (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
        )
        setWorkouts(sortedData)
      } catch (error) {
        console.error("Error loading workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  // Agréger les données par catégorie et par séance (et par exercice)
  const categoriesData = useMemo(() => {
    const categoriesMap = new Map<
      string,
      {
        categoryName: string
        exercises: Map<number, string> // exerciseId -> exerciseName
        dataPoints: Map<
          string,
          { maxWeight: number; volume: number; setsCount: number; dateObj: Date; workoutId: string }
        >
        exerciseData: Map<
          number,
          Map<string, { maxWeight: number; volume: number; setsCount: number; dateObj: Date; workoutId: string }>
        >
      }
    >()

    workouts.forEach((workout) => {
      const workoutKey = workout.id // Utiliser l'ID de séance comme clé unique

      workout.sets.forEach((set) => {
        const categoryId = set.exercise.category.id
        const categoryName = set.exercise.category.name
        const exerciseId = set.exercise.id
        const exerciseName = set.exercise.title

        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, {
            categoryName,
            exercises: new Map(),
            dataPoints: new Map(),
            exerciseData: new Map(),
          })
        }

        const category = categoriesMap.get(categoryId)!

        // Ajouter l'exercice à la liste des exercices de cette catégorie
        if (!category.exercises.has(exerciseId)) {
          category.exercises.set(exerciseId, exerciseName)
        }

        // Agréger les données au niveau de la catégorie (par séance)
        if (!category.dataPoints.has(workoutKey)) {
          category.dataPoints.set(workoutKey, {
            maxWeight: set.weight,
            volume: set.weight * set.repetition,
            setsCount: 1,
            dateObj: new Date(workout.started_at),
            workoutId: workout.id,
          })
        } else {
          const point = category.dataPoints.get(workoutKey)!
          point.maxWeight = Math.max(point.maxWeight, set.weight)
          point.volume += set.weight * set.repetition
          point.setsCount += 1
        }

        // Agréger les données au niveau de l'exercice (par séance)
        if (!category.exerciseData.has(exerciseId)) {
          category.exerciseData.set(exerciseId, new Map())
        }
        const exerciseMap = category.exerciseData.get(exerciseId)!
        if (!exerciseMap.has(workoutKey)) {
          exerciseMap.set(workoutKey, {
            maxWeight: set.weight,
            volume: set.weight * set.repetition,
            setsCount: 1,
            dateObj: new Date(workout.started_at),
            workoutId: workout.id,
          })
        } else {
          const point = exerciseMap.get(workoutKey)!
          point.maxWeight = Math.max(point.maxWeight, set.weight)
          point.volume += set.weight * set.repetition
          point.setsCount += 1
        }
      })
    })

    // Convertir en tableau et trier les dataPoints
    const result: CategoryData[] = Array.from(categoriesMap.entries()).map(
      ([categoryId, data]) => {
        const sortedDataPoints = Array.from(data.dataPoints.entries())
          .sort(([, a], [, b]) => a.dateObj.getTime() - b.dateObj.getTime())

        // Détecter s'il y a plusieurs séances le même jour pour ajouter l'heure
        const dateCount = new Map<string, number>()
        sortedDataPoints.forEach(([, point]) => {
          const dateKey = point.dateObj.toISOString().split("T")[0]
          dateCount.set(dateKey, (dateCount.get(dateKey) || 0) + 1)
        })

        const formattedDataPoints = sortedDataPoints.map(([workoutId, point]) => {
          const dateKey = point.dateObj.toISOString().split("T")[0]
          const hasMultipleSameDay = (dateCount.get(dateKey) || 0) > 1

          let dateFormatted: string
          if (hasMultipleSameDay) {
            // Ajouter l'heure si plusieurs séances le même jour
            dateFormatted = point.dateObj.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          } else {
            dateFormatted = point.dateObj.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })
          }

          return {
            date: workoutId,
            dateFormatted,
            maxWeight: point.maxWeight,
            volume: point.volume,
            setsCount: point.setsCount,
          }
        })

        // Convertir exerciseData en Map avec arrays triés
        const exerciseData = new Map<
          number,
          Array<{
            date: string
            dateFormatted: string
            maxWeight: number
            volume: number
            setsCount: number
          }>
        >()

        data.exerciseData.forEach((exerciseDateMap, exerciseId) => {
          const sortedExerciseDataPoints = Array.from(exerciseDateMap.entries())
            .sort(([, a], [, b]) => a.dateObj.getTime() - b.dateObj.getTime())

          // Détecter s'il y a plusieurs séances le même jour pour cet exercice
          const exerciseDateCount = new Map<string, number>()
          sortedExerciseDataPoints.forEach(([, point]) => {
            const dateKey = point.dateObj.toISOString().split("T")[0]
            exerciseDateCount.set(dateKey, (exerciseDateCount.get(dateKey) || 0) + 1)
          })

          const formattedExerciseDataPoints = sortedExerciseDataPoints.map(([workoutId, point]) => {
            const dateKey = point.dateObj.toISOString().split("T")[0]
            const hasMultipleSameDay = (exerciseDateCount.get(dateKey) || 0) > 1

            let dateFormatted: string
            if (hasMultipleSameDay) {
              dateFormatted = point.dateObj.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            } else {
              dateFormatted = point.dateObj.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })
            }

            return {
              date: workoutId,
              dateFormatted,
              maxWeight: point.maxWeight,
              volume: point.volume,
              setsCount: point.setsCount,
            }
          })

          exerciseData.set(exerciseId, formattedExerciseDataPoints)
        })

        return {
          categoryId,
          categoryName: data.categoryName,
          exercises: Array.from(data.exercises.entries())
            .map(([exerciseId, exerciseName]) => ({ exerciseId, exerciseName }))
            .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName)),
          dataPoints: formattedDataPoints,
          exerciseData,
        }
      }
    )

    // Trier les catégories par nom
    return result.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
  }, [workouts])

  // Calculer les stats pour une catégorie ou un exercice
  const calculateStats = (
    dataPoints: Array<{
      date: string
      dateFormatted: string
      maxWeight: number
      volume: number
      setsCount: number
    }>
  ): CategoryStats => {
    if (dataPoints.length === 0) {
      return {
        currentMaxWeight: 0,
        previousMaxWeight: null,
        totalVolume: 0,
        totalSets: 0,
        progression: null,
      }
    }

    const currentMaxWeight = dataPoints[dataPoints.length - 1].maxWeight
    const previousMaxWeight = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2].maxWeight : null
    const totalVolume = dataPoints.reduce((sum, point) => sum + point.volume, 0)
    const totalSets = dataPoints.reduce((sum, point) => sum + point.setsCount, 0)

    let progression: number | null = null
    if (previousMaxWeight !== null && previousMaxWeight > 0) {
      progression = ((currentMaxWeight - previousMaxWeight) / previousMaxWeight) * 100
    }

    return {
      currentMaxWeight,
      previousMaxWeight,
      totalVolume,
      totalSets,
      progression,
    }
  }

  // Obtenir les données et stats en fonction de la sélection (catégorie ou exercice)
  const getDisplayData = (category: CategoryData) => {
    const selectedExercise = selectedExercises[category.categoryId] || "all"

    if (selectedExercise === "all") {
      return {
        dataPoints: category.dataPoints,
        stats: calculateStats(category.dataPoints),
        label: "Tous les exercices",
      }
    }

    const exerciseId = Number(selectedExercise)
    const exerciseDataPoints = category.exerciseData.get(exerciseId) || []
    const exerciseName =
      category.exercises.find((e) => e.exerciseId === exerciseId)?.exerciseName || "Exercice"

    return {
      dataPoints: exerciseDataPoints,
      stats: calculateStats(exerciseDataPoints),
      label: exerciseName,
    }
  }

  if (loading) {
    return (
      <section className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Évolution par catégorie</h2>
        <p>Chargement...</p>
      </section>
    )
  }

  if (workouts.length === 0) {
    return (
      <section className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Évolution par catégorie</h2>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUp />
            </EmptyMedia>
            <EmptyTitle>Aucune séance disponible</EmptyTitle>
            <EmptyDescription>
              Commencez à enregistrer vos séances pour voir votre progression.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  if (categoriesData.length === 0) {
    return (
      <section className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Évolution par catégorie</h2>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUp />
            </EmptyMedia>
            <EmptyTitle>Aucune donnée disponible</EmptyTitle>
            <EmptyDescription>
              Vos séances ne contiennent pas encore de données exploitables.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  return (
    <section className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Évolution par catégorie</h2>

      <Tabs defaultValue={categoriesData[0]?.categoryId} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
          {categoriesData.map((category) => (
            <TabsTrigger key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </TabsTrigger>
          ))}
        </TabsList>

        {categoriesData.map((category) => {
          const displayData = getDisplayData(category)
          const { dataPoints, stats, label } = displayData

          return (
            <TabsContent key={category.categoryId} value={category.categoryId} className="space-y-6">
              {/* Sélecteur d'exercice */}
              {category.exercises.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${category.categoryId}`}>Exercice</Label>
                  <Select
                    value={selectedExercises[category.categoryId] || "all"}
                    onValueChange={(value) =>
                      setSelectedExercises((prev) => ({
                        ...prev,
                        [category.categoryId]: value,
                      }))
                    }
                  >
                    <SelectTrigger id={`exercise-${category.categoryId}`}>
                      <SelectValue placeholder="Sélectionner un exercice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les exercices</SelectItem>
                      {category.exercises.map((exercise) => (
                        <SelectItem key={exercise.exerciseId} value={exercise.exerciseId.toString()}>
                          {exercise.exerciseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Cards de statistiques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-primary">
                        {stats.currentMaxWeight}
                        <span className="text-sm font-normal text-muted-foreground ml-1">kg</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Poids max actuel</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      {stats.progression !== null ? (
                        <>
                          <div className="flex items-center justify-center gap-1">
                            <p
                              className={`text-2xl sm:text-3xl font-bold ${
                                stats.progression >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stats.progression >= 0 ? "+" : ""}
                              {stats.progression.toFixed(1)}%
                            </p>
                            {stats.progression >= 0 ? (
                              <ArrowUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDown className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">vs séance précédente</p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl sm:text-3xl font-bold text-muted-foreground">-</p>
                          <p className="text-xs text-muted-foreground mt-1">Pas de comparaison</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-primary">
                        {stats.totalVolume.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Volume total (kg×reps)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalSets}</p>
                      <p className="text-xs text-muted-foreground mt-1">Séries totales</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphique d'évolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    <span>Évolution du poids maximum</span>
                    {label !== "Tous les exercices" && (
                      <Badge variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {dataPoints.length} séances
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataPoints.length < 2 ? (
                    <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Au moins 2 séances sont nécessaires pour afficher l'évolution</p>
                      </div>
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        maxWeight: {
                          label: "Poids max (kg)",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <LineChart data={dataPoints}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="dateFormatted"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={true}
                          domain={["dataMin - 5", "dataMax + 5"]}
                        />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="rounded-lg border bg-background p-3 shadow-md">
                                  <div className="font-semibold mb-2">{data.dateFormatted}</div>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Poids max:</span>
                                      <span className="font-semibold">{data.maxWeight} kg</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Volume:</span>
                                      <span className="font-semibold">{data.volume.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Séries:</span>
                                      <span className="font-semibold">{data.setsCount}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="maxWeight"
                          stroke="var(--color-maxWeight)"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}
