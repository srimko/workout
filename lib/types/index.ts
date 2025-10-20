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

export interface Exercise {
  id: number;
  name: string;
  machine: string;
}

export interface Workout {
  id: number;
  user_id: string;
  started_at: string;
  ended_at: string;
  title: string;
  notes: string;
}

export interface Set {
  id: number;
  workout_id: number;
  exercise_id: number;
  performed_at: string;
  weight: number;
  repetition: number;
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
