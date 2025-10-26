"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useCategories, useExercisesByCategory } from "@/lib/hooks/useExercises"

interface DrawerSelectExerciseProps {
  repetition: number
  onSelectExercise: (exerciseTitle: string) => void
}

export function DrawerSelectExercise({ repetition, onSelectExercise }: DrawerSelectExerciseProps) {
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const { categories, loading: categoriesLoading } = useCategories()
  const { exercises, loading: exercisesLoading } = useExercisesByCategory(currentCategoryId, true)

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
      <div>
        <div className="p-4 border-b">
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
          <div className="grid grid-cols-2 gap-4 p-4">
            {exercises.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">
                Aucun exercice actif dans cette catégorie
              </p>
            ) : (
              exercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise.title)}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex-col p-2">
                    <div className="relative w-full h-32">
                      <Image
                        src={exercise.image}
                        alt={exercise.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <p className="text-sm text-center mt-2 font-medium">{exercise.title}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  // Affichage des catégories
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {categories.map((category) => (
        <div key={category.id} className="">
          <Card
            onClick={() => handleSelectCategory(category.id)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-col">
                <div className="relative w-16 h-16 flex-shrink-0">
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
        </div>
      ))}
    </div>
  )
}
