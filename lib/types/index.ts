export interface Profile {
  id: string
  auth_id: string
  display_name: string
  birthday: string | null
  height_cm: number | null
  weight_kg: number | null
  sex: "male" | "female" | "other" | null
  training_experience: "beginner" | "intermediate" | "advanced" | "expert" | null
  goals: string[] | null
  injuries: string[] | null
  dominant_hand: "left" | "right" | "ambidextrous" | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  image: string
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: number
  title: string
  category_id: string
  image: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ExerciseWithCategory extends Exercise {
  category: Category
}

export interface ExerciseWithSets extends Exercise {
  sets: Set[]
}

export interface SetWithExercise extends Omit<Set, "exercise_id"> {
  exercise: {
    id: number
    title: string
    image: string
    category: Category
  }
}

export interface WorkoutWithSets extends Workout {
  sets: SetWithExercise[]
}

export interface Workout {
  id: string
  profile_id: string
  started_at: string
  ended_at: string | null
  title: string
  created_at: string
  updated_at: string
}

export interface Set {
  id: string
  workout_id: string
  exercise_id: number
  weight: number
  repetition: number
  created_at: string
  updated_at: string
}

export interface PersonalRecord {
  id: number
  user_id: string
  exercise_id: number
  metric: "weight" | "reps"
  value: number
  set_id: number
  achieved_at: string
}
export interface DayInfo {
  day: number
  dayName: string
  isActive: boolean
  date: string
}
