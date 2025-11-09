"use client"

import { useState } from "react"
import { StrengthStandardsCard } from "@/components/StrengthStandardsCard"
import { StrengthStandardsExplorer } from "@/components/StrengthStandardsExplorer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getAllExercises,
  getLevelLabel,
  getLevelColor,
  getCategoryLabel,
  getAllCategories,
} from "@/lib/utils/strength-standards"
import type { Exercise } from "@/lib/types/strength-standards"
import { Dumbbell, TrendingUp, Target, Award } from "lucide-react"

export default function StandardsPage() {
  const [bodyWeight, setBodyWeight] = useState(75)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [liftedWeight, setLiftedWeight] = useState<number | undefined>(undefined)

  const exercises = getAllExercises()
  const categories = getAllCategories()

  return (
    <div className="container mx-auto space-y-8">
      {/* En-tête de la page */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Standards de Force</h1>
            <p className="text-muted-foreground">
              Découvrez votre niveau et vos objectifs d'entraînement{" "}
              <Badge className="text-sm bg-amber-400">Beta</Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      {/* <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercices</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exercises.length}</div>
            <p className="text-xs text-muted-foreground">Différents exercices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Groupes musculaires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Niveaux de progression</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids de corps</CardTitle>
            <Badge variant="outline" className="text-sm">
              {bodyWeight} kg
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50-140 kg</div>
            <p className="text-xs text-muted-foreground">Plage disponible</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Formulaire de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
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
                step={5}
              />
              <p className="text-xs text-muted-foreground">Entre 50 et 140 kg</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Exercice (optionnel)</Label>
              <Select
                value={selectedExercise?.id || "none"}
                onValueChange={(id) =>
                  setSelectedExercise(
                    id === "none" ? null : exercises.find((ex) => ex.id === id) || null,
                  )
                }
              >
                <SelectTrigger id="exercise">
                  <SelectValue placeholder="Sélectionner un exercice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun exercice sélectionné</SelectItem>
                  {categories.map((category) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{getCategoryLabel(category)}</SelectLabel>
                      {exercises
                        .filter((ex) => ex.category === category)
                        .map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Pour voir les détails d'un exercice</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liftedWeight">Poids soulevé (kg)</Label>
              <Input
                id="liftedWeight"
                type="number"
                value={liftedWeight || ""}
                onChange={(e) => setLiftedWeight(Number(e.target.value) || undefined)}
                placeholder="Ex: 80"
                disabled={!selectedExercise}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setLiftedWeight(undefined)
                setSelectedExercise(null)
              }}
              variant="outline"
              size="sm"
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Carte détaillée pour l'exercice sélectionné */}
      {selectedExercise && (
        <StrengthStandardsCard
          exerciseId={selectedExercise.id}
          bodyWeight={bodyWeight}
          liftedWeight={liftedWeight}
        />
      )}

      {/* Explorateur de tous les standards */}
      {/* <StrengthStandardsExplorer bodyWeight={bodyWeight} /> */}

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
                duration: "0-6 mois",
              },
              {
                level: "novice" as const,
                description: "Quelques mois d'entraînement régulier",
                duration: "6-18 mois",
              },
              {
                level: "intermediaire" as const,
                description: "1-2 ans d'entraînement sérieux",
                duration: "18-36 mois",
              },
              {
                level: "avance" as const,
                description: "3-5 ans d'entraînement intensif",
                duration: "3-5 ans",
              },
              {
                level: "elite" as const,
                description: "Niveau compétitif, athlète confirmé",
                duration: "5+ ans",
              },
            ].map(({ level, description, duration }) => (
              <div key={level} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: getLevelColor(level) }}
                  />
                  <div className="font-semibold">{getLevelLabel(level)}</div>
                </div>
                <div className="text-xs font-medium text-muted-foreground">{duration}</div>
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
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Ces standards sont basés sur les données de{" "}
            <a
              href="https://strengthlevel.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
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
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
