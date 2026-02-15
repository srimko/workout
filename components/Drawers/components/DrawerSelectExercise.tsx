"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCategories, useExercises } from "@/lib/hooks/useExercises"
import type { Exercise } from "@/lib/types"

interface DrawerSelectExerciseProps {
  onSelectExercise: (exerciseTitle: string, exerciseImage: string, exerciseId: number) => void
  recentExerciseIds?: number[]
}

export function DrawerSelectExercise({
  onSelectExercise,
  recentExerciseIds = [],
}: DrawerSelectExerciseProps) {
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { categories, loading: categoriesLoading } = useCategories()
  const { exercises: allExercises, loading: exercisesLoading } = useExercises(true)

  const exercises = currentCategoryId
    ? allExercises.filter((e) => e.category_id === currentCategoryId)
    : []

  const filteredExercises = searchQuery
    ? exercises.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : exercises

  const recentExercises = filteredExercises.filter((e) => recentExerciseIds.includes(e.id))
  const otherExercises = filteredExercises.filter((e) => !recentExerciseIds.includes(e.id))
  const hasRecents = !searchQuery && recentExercises.length > 0

  function handleSelectCategory(categoryId: string) {
    setCurrentCategoryId(categoryId)
    setSearchQuery("")
  }

  function handleBackToCategories() {
    setCurrentCategoryId(null)
    setSearchQuery("")
  }

  // Skeleton de chargement catégories
  if (categoriesLoading) {
    return (
      <div className="grid gap-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
            <div className="w-12 h-12 rounded-md bg-muted" />
            <div className="h-5 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  // Affichage des exercices d'une catégorie
  if (currentCategoryId) {
    const currentCategory = categories.find((cat) => cat.id === currentCategoryId)

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 flex gap-4 justify-between items-center p-4 border-b bg-background">
          <button
            type="button"
            onClick={handleBackToCategories}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </button>
          {currentCategory && <h3 className="font-semibold">{currentCategory.name}</h3>}
        </div>

        {exercisesLoading ? (
          <div className="flex-1 overflow-auto">
            <div className="p-4 pb-2">
              <div className="h-10 rounded-md bg-muted animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 pt-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-2 animate-pulse">
                  <div className="h-16 w-16 rounded-md bg-muted" />
                  <div className="h-4 w-14 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            {/* Barre de recherche — sticky */}
            <div className="sticky top-0 z-10 bg-background p-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un exercice..."
                  aria-label="Rechercher un exercice"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {filteredExercises.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Aucun exercice trouvé pour "${searchQuery}"`
                    : "Aucun exercice actif dans cette catégorie"}
                </p>
              </div>
            ) : (
              <>
                {/* Section récents */}
                {hasRecents && (
                  <>
                    <p className="px-4 pt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Récents
                    </p>
                    <div className="grid grid-cols-3 gap-4 p-4 pt-2">
                      {recentExercises.map((exercise) => (
                        <ExerciseButton
                          key={exercise.id}
                          exercise={exercise}
                          onSelect={onSelectExercise}
                        />
                      ))}
                    </div>
                    <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tous
                    </p>
                  </>
                )}
                <div className="grid grid-cols-3 gap-4 p-4 pt-2">
                  {(hasRecents ? otherExercises : filteredExercises).map((exercise) => (
                    <ExerciseButton
                      key={exercise.id}
                      exercise={exercise}
                      onSelect={onSelectExercise}
                    />
                  ))}
                </div>
              </>
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
          role="button"
          tabIndex={0}
          onClick={() => handleSelectCategory(category.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleSelectCategory(category.id)
            }
          }}
          className="cursor-pointer hover:shadow-md active:scale-[0.98] active:bg-muted/50 transition-all p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover rounded-md"
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

function ExerciseButton({
  exercise,
  onSelect,
}: {
  exercise: Exercise
  onSelect: (title: string, image: string, id: number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exercise.title, exercise.image, exercise.id)}
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
      <p className="w-full text-center text-sm font-medium text-foreground line-clamp-2">
        {exercise.title}
      </p>
    </button>
  )
}
