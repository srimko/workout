"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useCategories, useExercises } from "@/lib/hooks/useExercises"

interface DrawerSelectExerciseProps {
  repetition: number
  onSelectExercise: (exerciseTitle: string) => void
}

export function DrawerSelectExercise({ repetition, onSelectExercise }: DrawerSelectExerciseProps) {
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const { categories, loading: categoriesLoading } = useCategories()
  const { exercises: allExercises, loading: exercisesLoading } = useExercises(true)

  const exercises = currentCategoryId
    ? allExercises.filter((e) => e.category_id === currentCategoryId)
    : []

  function handleSelectCategory(categoryId: string) {
    setCurrentCategoryId(categoryId)
  }

  function handleBackToCategories() {
    setCurrentCategoryId(null)
  }

  // Affichage pendant le chargement
  if (categoriesLoading) {
    return (
      <div className="p-4 text-center">
        <p>Chargement des catégories...</p>
      </div>
    )
  }

  // Affichage des exercices d'une catégorie
  if (currentCategoryId) {
    const currentCategory = categories.find((cat) => cat.id === currentCategoryId)

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 flex gap-4 justify-between p-4 border-b bg-background">
          <button
            type="button"
            onClick={handleBackToCategories}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Retour aux catégories
          </button>
          {currentCategory && <h3 className="font-semibold mt-2">{currentCategory.name}</h3>}
        </div>

        {exercisesLoading ? (
          <div className="p-4 text-center">
            <p>Chargement des exercices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-4 flex-1 overflow-auto">
            {exercises.length === 0 ? (
              <p className="col-span-3 text-center text-gray-500">
                Aucun exercice actif dans cette catégorie
              </p>
            ) : (
              exercises.map((exercise) => (
                <button
                  type="button"
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise.title)}
                  className="flex flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-muted active:bg-muted/80"
                >
                  <div className="relative h-16 w-16">
                    <Image
                      src={`/exercises/${exercise.image}`}
                      alt={exercise.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p className="w-full text-center text-xs text-muted-foreground truncate">
                    {exercise.title}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  // Affichage des catégories
  return (
    <div className="grid gap-4 p-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          onClick={() => handleSelectCategory(category.id)}
          className="cursor-pointer hover:shadow-md transition-shadow p-4"
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="font-bold text-lg">{category.name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
