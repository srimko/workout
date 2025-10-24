export interface Profile {
  id: string;
  display_name: string;
  birthday: string;
  height_cm: number;
  weight_kg: number;
  sex: "male" | "female";
  training_experience: "beginner" | "intermediate" | "advanced";
  goals: string[];
  injuries: string[];
  dominant_hand: "left" | "right";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: number;
  title: string;
  category_id: string;
  image: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExerciseWithCategory extends Exercise {
  category: Category;
}

export interface Workout {
  id: string;
  profile_id: string;
  started_at: string;
  ended_at: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Set {
  id: string;
  workout_id: string;
  exercise_id: number;
  weight: number;
  repetition: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecord {
  id: number;
  user_id: string;
  exercise_id: number;
  metric: "weight" | "reps";
  value: number;
  set_id: number;
  achieved_at: string;
}
