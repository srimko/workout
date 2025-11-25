import { autoCloseOldWorkouts, getTodayWorkoutWithSets } from "@/lib/actions/workouts"
import { HomeEmpty } from "./home/components/HomeEmpty"
import { HomeWorkoutCompleted } from "./home/components/HomeWorkoutCompleted"
import { HomaStats } from "./home/components/HomStats"
import { ResumeLastWorkout } from "./home/components/ResumeLastWorkout"
import { WorkoutSession } from "./home/components/WorkoutSession"

export default async function Home() {
  await autoCloseOldWorkouts()
  const todayWorkout = await getTodayWorkoutWithSets()

  return (
    <>
      <ResumeLastWorkout />
      {!todayWorkout && <HomeEmpty />}

      {todayWorkout && todayWorkout.ended_at !== null && (
        <HomeWorkoutCompleted todayWorkout={todayWorkout} />
      )}

      {todayWorkout && todayWorkout.ended_at === null && (
        <>
          <HomaStats todayWorkout={todayWorkout} />

          <WorkoutSession todayWorkout={todayWorkout} />
        </>
      )}
    </>
  )
}
