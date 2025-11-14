/**
 * Exemple d'utilisation des standards de force
 *
 * Cette page démontre comment intégrer les standards de force
 * dans votre application de musculation.
 */

import { useState } from "react"
import { StrengthStandardsCard } from "@/components/StrengthStandardsCard"
import { StrengthStandardsExplorer } from "@/components/StrengthStandardsExplorer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Exercise } from "@/lib/types/strength-standards"
import { getAllExercises, getLevelColor, getLevelLabel } from "@/lib/utils/strength-standards"

export default function StrengthStandardsExample() {
  const [bodyWeight, setBodyWeight] = useState(75)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [liftedWeight, setLiftedWeight] = useState<number | undefined>(undefined)

  const exercises = getAllExercises()

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Standards de Force</h1>
        <p className="text-muted-foreground">
          Découvrez votre niveau de force et vos objectifs d'entraînement
        </p>
      </div>

      {/* Configuration utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Votre profil</CardTitle>
          <CardDescription>
            Configurez vos informations pour voir vos standards personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="bodyWeight">Poids de corps (kg)</Label>
              <Input
                id="bodyWeight"
                type="number"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(Number(e.target.value))}
                min={50}
                max={140}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Exercice</Label>
              <Select
                value={selectedExercise?.id}
                onValueChange={(id) =>
                  setSelectedExercise(exercises.find((ex) => ex.id === id) || null)
                }
              >
                <SelectTrigger id="exercise">
                  <SelectValue placeholder="Sélectionner un exercice" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liftedWeight">Poids soulevé (kg)</Label>
              <Input
                id="liftedWeight"
                type="number"
                value={liftedWeight || ""}
                onChange={(e) => setLiftedWeight(Number(e.target.value) || undefined)}
                placeholder="Ex: 80"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              setLiftedWeight(undefined)
              setSelectedExercise(null)
            }}
            variant="outline"
          >
            Réinitialiser
          </Button>
        </CardContent>
      </Card>

      {/* Carte des standards pour l'exercice sélectionné */}
      {selectedExercise && (
        <StrengthStandardsCard
          exerciseId={selectedExercise.id}
          bodyWeight={bodyWeight}
          liftedWeight={liftedWeight}
        />
      )}

      {/* Explorateur de tous les standards */}
      <StrengthStandardsExplorer bodyWeight={bodyWeight} />

      {/* Légende des niveaux */}
      <Card>
        <CardHeader>
          <CardTitle>Comprendre les niveaux</CardTitle>
          <CardDescription>Voici ce que signifie chaque niveau de force</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                level: "debutant" as const,
                description: "Novice complet, débute l'entraînement",
              },
              {
                level: "novice" as const,
                description: "Quelques mois d'entraînement régulier",
              },
              {
                level: "intermediaire" as const,
                description: "1-2 ans d'entraînement sérieux",
              },
              {
                level: "avance" as const,
                description: "3-5 ans d'entraînement intensif",
              },
              {
                level: "elite" as const,
                description: "Niveau compétitif, athlète confirmé",
              },
            ].map(({ level, description }) => (
              <div key={level} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: getLevelColor(level) }}
                  />
                  <div className="font-semibold">{getLevelLabel(level)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les données */}
      <Card>
        <CardHeader>
          <CardTitle>À propos des données</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            Ces standards sont basés sur les données de{" "}
            <a
              href="https://strengthlevel.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              strengthlevel.fr
            </a>
            , calculés à partir de millions de performances d'utilisateurs réels.
          </p>
          <p>
            Les standards sont des estimations moyennes et peuvent varier selon votre morphologie,
            votre âge et votre historique d'entraînement. Utilisez-les comme guide, pas comme règle
            absolue.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
