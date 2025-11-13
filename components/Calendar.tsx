import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { WorkoutWithSets, DayInfo } from "@/lib/types"

interface CalendarProps {
  calendar: DayInfo[]
  workouts: WorkoutWithSets[]
  onCardClick: (id: string | undefined) => {}
}

export function Calendar({ calendar, workouts, onCardClick }: CalendarProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null)
  const activeCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeCardRef.current && scrollContainerRef.current) {
        activeCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [calendar])

  function handleWorkoutClick(day: DayInfo) {
    if (!day) {
      return false
    }

    const dayWorkout = workouts.find((w) => w.created_at.split("T")[0] === day.date.split("T")[0])
    onCardClick(dayWorkout?.id)
  }

  return (
    <ul ref={scrollContainerRef} className="flex gap-3 mb-4 overflow-auto">
      {calendar.map((day) => (
        <li key={day.day}>
          <Card
            ref={day.isActive ? activeCardRef : null}
            className={`py-4 px-1 ${day.isActive ? "bg-stone-200 text-black" : ""}`}
            onClick={() => {
              handleWorkoutClick(day)
            }}
          >
            <CardContent className="flex flex-col items-center relative">
              <span>{day.day}</span>
              <span>{day.dayName.slice(0, 3)}</span>
              {workouts.map((workout, index) => {
                if (workout.created_at.split("T")[0] !== day.date.split("T")[0]) {
                  return false
                }
                return (
                  <span
                    key={index}
                    className="bg-green-400 h-1 w-1 rounded-2xl absolute -top-2"
                  ></span>
                )
              })}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
