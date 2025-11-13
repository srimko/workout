"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import type { WorkoutWithSets, SetWithExercise } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/Calendar"
interface DayInfo {
  day: number
  dayName: string // Nom du jour (lundi, mardi, etc.)
  isActive: boolean // true si c'est aujourd'hui
  date: String
}

interface ExerciseGroup {
  exerciseId: number
  exerciseName: string
  categoryName: string
  sets: SetWithExercise[]
}

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutWithSets | null>()
  const [loading, setLoading] = useState(true)
  const [calendar, setCalendar] = useState<DayInfo[]>([])

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

  useEffect(() => {
    setCalendar(getCurrentMonthDays())
  }, [])

  useEffect(() => {
    const now = new Date().toISOString()
    const dayWorkout = workouts.find((w) => w.created_at.split("T")[0] === now.split("T")[0])
  }, [workouts, loading])

  const groupedExercises = useMemo(() => {
    const groupMap = new Map<number, ExerciseGroup>()

    if (!currentWorkout) {
      return false
    }
    currentWorkout.sets.forEach((set) => {
      const exerciseId = set.exercise.id
      if (!groupMap.has(exerciseId)) {
        groupMap.set(exerciseId, {
          exerciseId,
          exerciseName: set.exercise.title,
          categoryName: set.exercise.category.name,
          sets: [],
        })
      }
      groupMap.get(exerciseId)!.sets.push(set)
    })

    // Retourner dans l'ordre d'apparition (ordre chronologique de création)
    return Array.from(groupMap.values())
  }, [currentWorkout])

  function getCurrentMonthDays(): DayInfo[] {
    const now = new Date()
    const currentDay = now.getDate()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Obtenir le nombre de jours dans le mois actuel
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const days: DayInfo[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(currentYear, currentMonth, day))

      // Obtenir le nom du jour en français
      const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" })

      days.push({
        day,
        dayName,
        isActive: day === currentDay,
        date: date.toISOString(),
      })
    }
    return days
  }

  function handleClick(id: string | undefined) {
    if (!id) {
      setCurrentWorkout(null)
      return false
    }
    const workout = workouts.find((w) => w.id === id)
    console.log(workout?.created_at.split("T")[0].split("-")[2])

    const currentDay = workout?.created_at.split("T")[0].split("-")[2]
    const newCalendar = calendar.map((c) => {
      if (currentDay && c.day === parseInt(currentDay)) {
        c.isActive = true
        return c
      }
      c.isActive = false
      return c
    })

    setCalendar(newCalendar)
    setCurrentWorkout(workout)
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

      <Calendar calendar={calendar} workouts={workouts} onCardClick={handleClick} />

      <div className="space-y-6">
        {groupedExercises ? (
          <div className="space-y-4 pb-[70]">
            <h2 className="text-2xl font-bold mb-6">Workouts</h2>
            {groupedExercises.map((group) => (
              <div key={group.exerciseId} className="border rounded-lg p-3 bg-muted/30">
                {/* En-tête de l'exercice */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-sm">{group.exerciseName}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {group.categoryName}
                  </Badge>
                </div>

                {/* Liste des séries */}
                <div className="space-y-1.5">
                  {group.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className="flex items-center justify-between text-sm bg-background rounded px-3 py-2"
                    >
                      <span className="text-muted-foreground font-medium">Série {index + 1}</span>
                      <span className="font-semibold">
                        {set.weight}kg × {set.repetition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section>
            <h2 className="text-2xl font-bold mb-6">Workouts</h2>
            <p className="text-muted-foreground">Aucun workout trouvé</p>
          </section>
        )}
      </div>
    </section>
  )
}
