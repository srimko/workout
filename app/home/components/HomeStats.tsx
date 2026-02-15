import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkoutWithSets } from "@/lib/types"

export function HomeStats({ todayWorkout }: { todayWorkout: WorkoutWithSets }) {
  const totalSets = todayWorkout.sets.length
  const totalWeight = todayWorkout.sets.reduce((sum, set) => sum + set.weight, 0)
  const totalVolume = todayWorkout.sets.reduce(
    (sum, set) => sum + set.weight * set.repetition,
    0,
  )

  if (totalSets === 0) return null

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 gap-2">
      <CardHeader>
        <CardTitle className="text-lg">Résumé de la séance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalSets}</p>
            <p className="text-xs text-muted-foreground">séries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">kg chargés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {totalVolume >= 1000
                ? `${(totalVolume / 1000).toFixed(1)}k`
                : totalVolume.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">volume</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
