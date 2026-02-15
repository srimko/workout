import { autoCloseOldWorkouts, getTodayWorkoutWithSets } from "@/lib/actions/workouts"
import { HomeEmpty } from "./home/components/HomeEmpty"
import { HomeWorkoutCompleted } from "./home/components/HomeWorkoutCompleted"
import { HomeStats } from "./home/components/HomeStats"
import { ResumeLastWorkout } from "./home/components/ResumeLastWorkout"
import { WorkoutSession } from "./home/components/WorkoutSession"

export default async function Home() {
  await autoCloseOldWorkouts()
  const todayWorkout = await getTodayWorkoutWithSets()

  return (
    <div className="px-4 pt-4">
      <ResumeLastWorkout />
      {!todayWorkout && <HomeEmpty />}

      {todayWorkout && todayWorkout.ended_at !== null && (
        <HomeWorkoutCompleted todayWorkout={todayWorkout} />
      )}

      {todayWorkout && todayWorkout.ended_at === null && (
        <>
          <HomeStats todayWorkout={todayWorkout} />

          <WorkoutSession todayWorkout={todayWorkout} />
        </>
      )}
    </div>
  )
}
