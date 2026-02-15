"use client"

import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/Calendar"
import { SetComponent } from "@/components/SetComponent"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllWorkoutsWithSets } from "@/lib/actions/workouts"
import type { CategoryGroup, DayInfo, WorkoutWithSets } from "@/lib/types"
import { groupSetsByExercise } from "@/lib/utils/set"

function getMonthDays(year: number, month: number): DayInfo[] {
  const now = new Date()
  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year
  const currentDay = now.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: DayInfo[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day))
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" })
    days.push({
      day,
      dayName,
      isActive: isCurrentMonth && day === currentDay,
      date: date.toISOString(),
    })
  }
  return days
}

export default function HistoriquePage() {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([])
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutWithSets | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const calendar = useMemo(
    () => getMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth],
  )

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getAllWorkoutsWithSets()
        setWorkouts(data)

        // Auto-select today if there's a workout
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
        const todayWorkout = data.find((w) => w.created_at.split("T")[0] === todayStr)
        if (todayWorkout) {
          setSelectedDay(today.getDate())
          setCurrentWorkout(todayWorkout)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadWorkouts()
  }, [])

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(null)
    setCurrentWorkout(null)
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(null)
    setCurrentWorkout(null)
  }

  const groups = useMemo(() => {
    if (!currentWorkout) return []
    const map = new Map<string, CategoryGroup>()

    currentWorkout.sets.forEach((set) => {
      const categoryName = set.exercise.category.name
      if (!map.has(categoryName)) {
        map.set(categoryName, {
          categoryName,
          sets: [],
          totalWeight: 0,
          totalVolume: 0,
        })
      }
      const group = map.get(categoryName)!
      group.sets.push(set)
      group.totalWeight += set.weight
      group.totalVolume += set.weight * set.repetition
    })

    return Array.from(map.values())
  }, [currentWorkout])

  function handleDayClick(day: DayInfo) {
    if (selectedDay === day.day) {
      setSelectedDay(null)
      setCurrentWorkout(null)
      return
    }

    setSelectedDay(day.day)
    const dayDate = day.date.split("T")[0]
    const workout = workouts.find((w) => w.created_at.split("T")[0] === dayDate)
    setCurrentWorkout(workout ?? null)
  }

  if (loading) {
    return (
      <section className="pt-4 space-y-4">
        <h1 className="text-2xl font-bold px-4">Historique</h1>
        <div className="flex gap-2 overflow-hidden px-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`skeleton-day-${i}`} className="h-16 w-14 rounded-lg shrink-0" />
          ))}
        </div>
        <Skeleton className="h-6 w-40 mx-4" />
        <Skeleton className="h-24 mx-4 rounded-lg" />
        <Skeleton className="h-24 mx-4 rounded-lg" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="pt-4">
        <h1 className="text-2xl font-bold mb-6 px-4">Historique</h1>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="font-medium">Impossible de charger l'historique</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-4">
      <h1 className="text-2xl font-bold mb-4 px-4">Historique</h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3 px-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="font-medium capitalize">{monthLabel}</span>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-2">
        <Calendar
          calendar={calendar}
          workouts={workouts}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Workout details */}
      {selectedDay !== null && currentWorkout ? (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-2 px-4">
            Séance du{" "}
            {new Date(currentWorkout.started_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </h2>
          <Accordion type="multiple" className="w-full">
            {groups.map((group) => (
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
                  <div className="divide-y divide-border/50">
                    {groupSetsByExercise({ ...currentWorkout, sets: group.sets }).map(
                      (exercise) => (
                        <div key={exercise.title} className="py-3 first:pt-0 last:pb-0">
                          <h3 className="font-semibold text-sm text-muted-foreground mb-1 truncate">
                            {exercise.title}
                          </h3>
                          <div className="space-y-0.5">
                            {exercise.sets.map((set, index) => (
                              <SetComponent key={set.id} set={set} index={index} />
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : selectedDay !== null ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Aucune séance ce jour</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Sélectionnez un jour pour voir le détail de la séance
          </p>
        </div>
      )}
    </section>
  )
}
