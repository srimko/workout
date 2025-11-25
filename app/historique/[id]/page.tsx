"use client"

import { useEffect, useState } from "react"

export default function WorkoutPage() {
  const [_workouts, _setWorkouts] = useState({})

  useEffect(() => {
    async function getAllWorkouts() {
      const _workouts = await getAllWorkouts()

      //   setWorkouts(workouts)
    }

    getAllWorkouts()
  }, [])

  return <>{<p>Workouts Page</p>}</>
}
