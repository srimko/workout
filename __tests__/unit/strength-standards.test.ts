// ============================================================================
// PREMIER TEST - getLevelLabel
// ============================================================================
// Ce fichier teste les fonctions utilitaires de lib/utils/strength-standards.ts
// On commence par les fonctions les plus simples : les fonctions de mapping

import { describe, expect, it } from "vitest"
import type { ExerciseCategory, StrengthLevel } from "@/lib/types/strength-standards"
import {
  determineStrengthLevel,
  getCategoryLabel,
  getExerciseById,
  getExercisesByCategory,
  getLevelColor,
  getLevelLabel,
  getStandardForWeight,
} from "@/lib/utils/strength-standards"

// describe() permet de regrouper plusieurs tests liés a une meme fonction
// C'est comme creer une "suite" de tests
// it() ou test() definit un test individuel

// Le texte doit decrire CE QUI DEVRAIT SE PASSER (pas "on teste que...")
// Format recommande : "devrait [faire quelque chose] quand [condition]"

// ARRANGE (Preparer) - On definit les donnees d'entree
// ACT (Agir) - On execute la fonction a tester
// ASSERT (Affirmer) - On verifie que le resultat est celui attendu

describe("getLevelLabel", () => {
  it("Should return 'Debutant' for the level 'debutant'", () => {
    const level: StrengthLevel = "debutant"
    const result = getLevelLabel(level)
    expect(result).toBe("Débutant")
  })

  it("Should return 'Novice' for the level 'novice'", () => {
    const level: StrengthLevel = "novice"
    const result = getLevelLabel(level)
    expect(result).toBe("Novice")
  })

  it("Should return 'Intermediaire' for the level 'intermediaire'", () => {
    const level: StrengthLevel = "intermediaire"
    const result = getLevelLabel(level)
    expect(result).toBe("Intermédiaire")
  })

  it("Should return 'Avance' for the level 'avance'", () => {
    const level: StrengthLevel = "avance"
    const result = getLevelLabel(level)
    expect(result).toBe("Avancé")
  })

  it("Should return 'Elite' for the level 'elite'", () => {
    const level: StrengthLevel = "elite"
    const result = getLevelLabel(level)
    expect(result).toBe("Élite")
  })
})

describe("getLevelColor", () => {
  it("Should return gray color (#9CA3AF) for 'debutant'", () => {
    const result = getLevelColor("debutant")
    expect(result).toBe("#9CA3AF")
  })

  it("Should return blue color (#60A5FA) for 'novice'", () => {
    const result = getLevelColor("novice")
    expect(result).toBe("#60A5FA")
  })

  it("Should return green color (#34D399) for 'intermediaire'", () => {
    const result = getLevelColor("intermediaire")
    expect(result).toBe("#34D399")
  })

  it("Should return yellow color (#FBBF24) for 'avance'", () => {
    const result = getLevelColor("avance")
    expect(result).toBe("#FBBF24")
  })

  it("Should return amber color (#F59E0B) for 'elite'", () => {
    const result = getLevelColor("elite")
    expect(result).toBe("#F59E0B")
  })
})

describe("getCategoryLabel", () => {
  it("Should return 'Pectoraux' for the category 'pectoraux'", () => {
    const category: ExerciseCategory = "pectoraux"
    const result = getCategoryLabel(category)
    expect(result).toBe("Pectoraux")
  })

  it("Should return 'Dos' for the category 'dos'", () => {
    const category: ExerciseCategory = "dos"
    const result = getCategoryLabel(category)
    expect(result).toBe("Dos")
  })

  it("Should return 'Epaules' for the category 'epaules'", () => {
    const category: ExerciseCategory = "epaules"
    const result = getCategoryLabel(category)
    expect(result).toBe("Épaules")
  })

  it("Should return 'Biceps' for the category 'biceps'", () => {
    const category: ExerciseCategory = "biceps"
    const result = getCategoryLabel(category)
    expect(result).toBe("Biceps")
  })
})

describe("getExerciseById", () => {
  it("Should return the exercise when ID exists", () => {
    const exerciseId = "developpe-couche"

    const result = getExerciseById(exerciseId)

    expect(result).toBeDefined()
    expect(result?.id).toBe("developpe-couche")
    expect(result?.name).toBe("Développé couché")
  })

  it("Should return null when ID doesn't exist", () => {
    const invalidId = "none"

    const result = getExerciseById(invalidId)

    expect(result).toBeUndefined()
  })
})

describe("getExercisesByCategory", () => {
  it("should return exercises when given category exists", () => {
    const category = "pectoraux"

    const result = getExercisesByCategory(category)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((ex) => ex.category === "pectoraux")).toBe(true)
  })

  it("should return empty array for invalid category", () => {
    const invalidCategory = "invalid-category"

    // @ts-expect-error - Testing invalid input
    const result = getExercisesByCategory(invalidCategory)

    expect(result).toBeInstanceOf(Array)
    expect(result).toEqual([])
  })
})

describe("getStandardForWeight", () => {
  it("should return exact weight when available", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 70

    const result = getStandardForWeight(exerciseId, bodyWeight)

    expect(result).toBeDefined()
    expect(result?.poids).toBe(70)
  })

  it("should return the closest weight", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = getStandardForWeight(exerciseId, bodyWeight)

    expect(result).toBeDefined()
    expect(result?.poids).toBe(75)
  })

  it("should return smallest weight when bodyWeight is very low", () => {
    const result = getStandardForWeight("developpe-couche", 30)

    expect(result?.poids).toBe(50)
  })

  it("should return largest weight when bodyWeight is very high", () => {
    const result = getStandardForWeight("developpe-couche", 150)

    // Devrait retourner le poids le plus grand (probablement 140)
    expect(result?.poids).toBe(140)
  })

  it("should return undefined when exercise doesn't exist", () => {
    const result = getStandardForWeight("invalid-id", 70)
    expect(result).toBeUndefined()
  })

  it("should return a complete StandardByWeight object", () => {
    const result = getStandardForWeight("developpe-couche", 70)

    expect(result).toBeDefined()
    expect(result).toHaveProperty("poids")
    expect(result).toHaveProperty("debutant")
    expect(result).toHaveProperty("novice")
    expect(result).toHaveProperty("intermediaire")
    expect(result).toHaveProperty("avance")
    expect(result).toHaveProperty("elite")

    // Tous les niveaux doivent être des nombres
    expect(typeof result?.debutant).toBe("number")
  })
})

describe("determineStrengthLevel", () => {
  it("Should return strenght level debutant cause lifteWeight not into range", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 40)

    expect(result).toBe("debutant")
  })

  it("Should return strenght level debutant", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 50)

    expect(result).toBe("debutant")
  })
  it("Should return strenght level novie", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 90)

    expect(result).toBe("novice")
  })
  it("Should return strenght level intermidiaire", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 92)

    expect(result).toBe("intermediaire")
  })
  it("Should return strenght level avance", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 119)

    expect(result).toBe("avance")
  })
  it("Should return strenght level avance", () => {
    const exerciseId = "developpe-couche"
    const bodyWeight = 73

    const result = determineStrengthLevel(exerciseId, bodyWeight, 149)

    expect(result).toBe("elite")
  })
})
