"use client"

import { useEffect, useState } from "react"
import { getAllWorkouts } from "@/lib/actions/workouts"

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState({})

  useEffect(() => {
    async function getAllWorkouts() {
      const workouts = await getAllWorkouts()

      //   setWorkouts(workouts)
    }

    getAllWorkouts()
  }, [])

  return <>{<p>Workouts Page</p>}</>
}
