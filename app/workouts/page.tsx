"use client"

import { useEffect, useState } from "react"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WorkoutWithSets } from "@/lib/types"
import Image from "next/image"

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
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-6">Workouts</h2>
        <p className="text-muted-foreground">Aucun workout trouvé</p>
      </section>
    )
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Workouts</h2>

      <div className="space-y-6">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{workout.title}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {new Date(workout.started_at).toLocaleDateString("fr-FR")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workout.sets.length === 0 ? (
                <p className="text-muted-foreground">Aucun set pour ce workout</p>
              ) : (
                <div className="space-y-4">
                  {workout.sets.map((set) => (
                    <div
                      key={set.id}
                      className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      {/* Image de l'exercice */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted relative">
                        <Image
                          src={set.exercise.image}
                          alt={set.exercise.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Infos de l'exercice */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{set.exercise.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {set.exercise.category.name}
                        </p>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Poids</p>
                            <p className="font-medium">{set.weight} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Répétitions</p>
                            <p className="font-medium">{set.repetition} reps</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Heure</p>
                            <p className="font-medium text-sm">
                              {new Date(set.created_at).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
