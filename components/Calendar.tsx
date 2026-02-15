import { useEffect, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { DayInfo, WorkoutWithSets } from "@/lib/types"

interface CalendarProps {
  calendar: DayInfo[]
  workouts: WorkoutWithSets[]
  selectedDay: number | null
  onDayClick: (day: DayInfo) => void
}

export function Calendar({ calendar, workouts, selectedDay, onDayClick }: CalendarProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null)
  const targetCardRef = useRef<HTMLDivElement>(null)

  // Pre-compute workout dates for O(1) lookup
  const workoutDates = useMemo(() => {
    const dates = new Set<string>()
    workouts.forEach((w) => dates.add(w.created_at.split("T")[0]))
    return dates
  }, [workouts])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetCardRef.current && scrollContainerRef.current) {
        targetCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [calendar, selectedDay])

  return (
    <ul
      ref={scrollContainerRef}
      className="flex gap-2 mb-4 overflow-x-auto overflow-y-hidden scrollbar-hide"
    >
      {calendar.map((day) => {
        const dayDate = day.date.split("T")[0]
        const hasWorkout = workoutDates.has(dayDate)
        const isSelected = selectedDay === day.day
        const isToday = day.isActive
        const isScrollTarget = isSelected || (!selectedDay && isToday)

        return (
          <li key={day.day}>
            <Card
              ref={isScrollTarget ? targetCardRef : null}
              className={`py-3 px-2 min-w-14 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isToday
                    ? "ring-1 ring-primary"
                    : "hover:bg-muted/50"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onDayClick(day)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onDayClick(day)
                }
              }}
            >
              <CardContent className="flex flex-col items-center relative p-0">
                <span className="text-sm font-medium">{day.day}</span>
                <span className="text-xs">{day.dayName.slice(0, 3)}</span>
                {hasWorkout && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full absolute -top-1.5 ${
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    }`}
                  />
                )}
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
