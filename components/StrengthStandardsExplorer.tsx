import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ExerciseCategory, StrengthLevel } from "@/lib/types/strength-standards"
import {
  getAllCategories,
  getCategoryLabel,
  getExercisesByCategory,
  getLevelColor,
  getLevelLabel,
} from "@/lib/utils/strength-standards"

interface StrengthStandardsExplorerProps {
  bodyWeight: number
}

export function StrengthStandardsExplorer({ bodyWeight }: StrengthStandardsExplorerProps) {
  const categories = getAllCategories()
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>(categories[0])

  const levels: StrengthLevel[] = ["debutant", "novice", "intermediaire", "avance", "elite"]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Standards de force masculins</CardTitle>
        <CardDescription>Standards pour {bodyWeight} kg de poids de corps</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as ExerciseCategory)}
        >
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {getCategoryLabel(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {getExercisesByCategory(category).map((exercise) => {
                const standard =
                  exercise.standardsByWeight.find((s) => s.poids === bodyWeight) ||
                  exercise.standardsByWeight.reduce((prev, curr) =>
                    Math.abs(curr.poids - bodyWeight) < Math.abs(prev.poids - bodyWeight)
                      ? curr
                      : prev,
                  )

                return (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-rows-2 grid-cols-2 gap-2">
                        {levels.map((level) => (
                          <div key={level} className="text-center">
                            <div
                              className="mb-1 h-2 w-full rounded-full"
                              style={{ backgroundColor: getLevelColor(level) }}
                            />
                            <div className="text-xs text-muted-foreground">
                              {getLevelLabel(level)}
                            </div>
                            <div className="text-sm font-semibold">{standard[level]} kg</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
