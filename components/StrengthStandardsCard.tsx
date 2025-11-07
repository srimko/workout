import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getExerciseById,
  getStandardForWeight,
  determineStrengthLevel,
  getProgressToNextLevel,
  getLevelLabel,
  getLevelColor,
} from "@/lib/utils/strength-standards";
import type { StrengthLevel } from "@/lib/types/strength-standards";

interface StrengthStandardsCardProps {
  exerciseId: string;
  bodyWeight: number;
  liftedWeight?: number;
}

export function StrengthStandardsCard({
  exerciseId,
  bodyWeight,
  liftedWeight,
}: StrengthStandardsCardProps) {
  const exercise = getExerciseById(exerciseId);
  const standard = getStandardForWeight(exerciseId, bodyWeight);

  if (!exercise || !standard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standards de force</CardTitle>
          <CardDescription>Exercice non trouvé</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentLevel = liftedWeight
    ? determineStrengthLevel(exerciseId, bodyWeight, liftedWeight)
    : null;
  const progress = liftedWeight
    ? getProgressToNextLevel(exerciseId, bodyWeight, liftedWeight)
    : null;

  const levels: StrengthLevel[] = ["debutant", "novice", "intermediaire", "avance", "elite"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        <CardDescription>
          Standards pour {bodyWeight} kg de poids de corps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Affichage du niveau actuel */}
        {currentLevel && liftedWeight && (
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm text-muted-foreground">Votre niveau actuel</div>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: getLevelColor(currentLevel) }}
                >
                  {getLevelLabel(currentLevel)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {liftedWeight} kg soulevés
                </div>
              </div>
              {progress && progress.nextLevel && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Vers {getLevelLabel(progress.nextLevel)}
                  </div>
                  <div className="text-lg font-semibold">
                    {Math.round(progress.progress)}%
                  </div>
                </div>
              )}
            </div>
            {progress && progress.nextLevel && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tableau des standards */}
        <div>
          <div className="mb-2 text-sm font-medium">Standards de force</div>
          <div className="space-y-2">
            {levels.map((level) => (
              <div
                key={level}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  currentLevel === level ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getLevelColor(level) }}
                  />
                  <span className="font-medium">{getLevelLabel(level)}</span>
                </div>
                <span className="text-lg font-semibold">{standard[level]} kg</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
