import strengthStandardsData from "@/data/strength-standards.json"
import type {
  Exercise,
  ExerciseCategory,
  StandardByWeight,
  StrengthLevel,
  StrengthStandardsData,
} from "@/lib/types/strength-standards"

const data = strengthStandardsData as StrengthStandardsData

/**
 * Récupère tous les exercices
 */
export function getAllExercises(): Exercise[] {
  return data.exercises
}

/**
 * Récupère un exercice par son ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  return data.exercises.find((ex) => ex.id === id)
}

/**
 * Récupère les exercices d'une catégorie spécifique
 */
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return data.exercises.filter((ex) => ex.category === category)
}

/**
 * Récupère le standard pour un poids corporel et un exercice donnés
 */
export function getStandardForWeight(
  exerciseId: string,
  bodyWeight: number,
): StandardByWeight | undefined {
  const exercise = getExerciseById(exerciseId)
  if (!exercise) return undefined

  // Trouver le poids le plus proche
  return exercise.standardsByWeight.reduce((prev, curr) => {
    return Math.abs(curr.poids - bodyWeight) < Math.abs(prev.poids - bodyWeight) ? curr : prev
  })
}

/**
 * Détermine le niveau de force pour un poids soulevé donné
 */
export function determineStrengthLevel(
  exerciseId: string,
  bodyWeight: number,
  liftedWeight: number,
): StrengthLevel | null {
  const standard = getStandardForWeight(exerciseId, bodyWeight)
  if (!standard) return null

  if (liftedWeight >= standard.elite) return "elite"
  if (liftedWeight >= standard.avance) return "avance"
  if (liftedWeight >= standard.intermediaire) return "intermediaire"
  if (liftedWeight >= standard.novice) return "novice"
  return "debutant"
}

/**
 * Calcule le pourcentage de progression vers le prochain niveau
 */
export function getProgressToNextLevel(
  exerciseId: string,
  bodyWeight: number,
  liftedWeight: number,
): { currentLevel: StrengthLevel; progress: number; nextLevel: StrengthLevel | null } | null {
  const standard = getStandardForWeight(exerciseId, bodyWeight)
  if (!standard) return null

  const currentLevel = determineStrengthLevel(exerciseId, bodyWeight, liftedWeight)
  if (!currentLevel) return null

  const levels: StrengthLevel[] = ["debutant", "novice", "intermediaire", "avance", "elite"]
  const currentIndex = levels.indexOf(currentLevel)
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null

  if (!nextLevel) {
    return { currentLevel, progress: 100, nextLevel: null }
  }

  const currentThreshold = standard[currentLevel]
  const nextThreshold = standard[nextLevel]
  const progress = ((liftedWeight - currentThreshold) / (nextThreshold - currentThreshold)) * 100

  return {
    currentLevel,
    progress: Math.min(Math.max(progress, 0), 100),
    nextLevel,
  }
}

/**
 * Récupère le poids cible pour un niveau donné
 */
export function getTargetWeight(
  exerciseId: string,
  bodyWeight: number,
  targetLevel: StrengthLevel,
): number | null {
  const standard = getStandardForWeight(exerciseId, bodyWeight)
  if (!standard) return null

  return standard[targetLevel]
}

/**
 * Récupère les noms de niveaux en français
 */
export function getLevelLabel(level: StrengthLevel): string {
  const labels: Record<StrengthLevel, string> = {
    debutant: "Débutant",
    novice: "Novice",
    intermediaire: "Intermédiaire",
    avance: "Avancé",
    elite: "Élite",
  }
  return labels[level]
}

/**
 * Récupère la couleur associée à un niveau
 */
export function getLevelColor(level: StrengthLevel): string {
  const colors: Record<StrengthLevel, string> = {
    debutant: "#9CA3AF", // gray-400
    novice: "#60A5FA", // blue-400
    intermediaire: "#34D399", // green-400
    avance: "#FBBF24", // yellow-400
    elite: "#F59E0B", // amber-500
  }
  return colors[level]
}

/**
 * Récupère toutes les catégories disponibles
 */
export function getAllCategories(): ExerciseCategory[] {
  return Array.from(new Set(data.exercises.map((ex) => ex.category)))
}

/**
 * Récupère le nom de catégorie en français
 */
export function getCategoryLabel(category: ExerciseCategory): string {
  const labels: Record<ExerciseCategory, string> = {
    pectoraux: "Pectoraux",
    dos: "Dos",
    epaules: "Épaules",
    biceps: "Biceps",
  }
  return labels[category]
}
