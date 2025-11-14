export type StrengthLevel = "debutant" | "novice" | "intermediaire" | "avance" | "elite"

export type ExerciseCategory = "pectoraux" | "dos" | "epaules" | "biceps"

export interface StrengthLevels {
  debutant: number
  novice: number
  intermediaire: number
  avance: number
  elite: number
}

export interface StandardByWeight extends StrengthLevels {
  poids: number
}

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  strengthLevels: StrengthLevels
  standardsByWeight: StandardByWeight[]
}

export interface StrengthStandardsData {
  metadata: {
    source: string
    gender: "homme" | "femme"
    unit: string
    lastUpdated: string
  }
  exercises: Exercise[]
}
