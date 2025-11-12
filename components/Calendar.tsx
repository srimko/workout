import { useEffect, useState, useMemo, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Calendar({ calendar, workouts, onCardClick }) {
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
    }, 1000) // Petit délai de 100ms

    return () => clearTimeout(timer)
  }, [])

  return (
    <ul ref={scrollContainerRef} className="flex gap-3 mb-4 overflow-auto">
      {calendar.map((day) => (
        <li key={day.day}>
          <Card
            ref={day.isActive ? activeCardRef : null}
            className={`py-4 px-1 ${day.isActive ? "bg-stone-200 text-black" : ""}`}
            onClick={() => {
              const dayWorkout = workouts.find(
                (w) => w.created_at.split("T")[0] === day.date.split("T")[0],
              )
              onCardClick(dayWorkout?.id)
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
