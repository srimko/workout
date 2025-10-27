"use client"

import { useEffect } from "react"
import { getTodayWorkout } from "@/lib/api/workouts"

export default function WorkoutPage() {
  useEffect(() => {
    async function getAllWorkouts() {
      console.log(await getTodayWorkout())
    }

    getAllWorkouts()
  })
  return <h1>WorkoutPage</h1>
}
