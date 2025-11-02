"use client"

import { useEffect, useState } from "react"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WorkoutWithSets } from "@/lib/types"
import Image from "next/image"

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [loading, setLoading] = useState(true)
  const [exercisesCount, setExercisesCount] = useState({})
  const [totalWeight, setTotalWeight] = useState(0)
  const [totalRep, setTotalRep] = useState(0)

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getAllWorkoutsWithSets()
        console.log("data", data)
        setWorkouts(data)
        getAllExercices(data[0].sets)
        getTotalWeight(data[0].sets)
        getTotalRep(data[0].sets)
      } catch (error) {
        console.error("Error loading workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  function getAllExercices(sets) {
    sets.map((set) => {
      exercisesCount[set.exercise.category.id] = (exercisesCount[set.exercise.category.id] || 0) + 1
      setExercisesCount(exercisesCount)
    })
  }

  function getTotalWeight(sets) {
    const total = sets.reduce((sum, set) => sum + set.weight, 0)
    setTotalWeight(total)
  }

  function getTotalRep(sets) {
    const total = sets.reduce((sum, set) => sum + set.repetition, 0)
    setTotalRep(total)
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
    <section>
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
                <div>
                  <div className="space-y-4">{workout.sets.length} Séries</div>
                  {Object.entries(exercisesCount).map((exerciseCategory, index) => (
                    <p key={index}>
                      {exerciseCategory[1]} séries de {exerciseCategory[0]}
                    </p>
                  ))}
                  <p>Total {totalWeight} kg</p>
                  <p>Total {totalRep} répétions</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
