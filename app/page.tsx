'use client';

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/AlertModal";
import { SetModal } from "@/components/modals/SetModal";
import { SelectProfile } from "@/components/SelectProfile";
import { ListWorkout } from "@/components/List/ListWorkout";
import { TableWorkout } from "@/components/Table/TableWorkout";
import { profilesApi } from "@/lib/api/profiles";
import { workoutsApi } from "@/lib/api/workouts";
import { setsApi } from "@/lib/api/sets";
import { exercisesApi } from "@/lib/api/exercises";
import { Profile, Workout, Set, Exercise } from "@/lib/types";

import { useModal } from "@/lib/hooks/useModal";

export default function Home() {
  const alertModal = useModal();
  const setModal = useModal();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile>();
  const [currentSets, setCurrentSets] = useState<Set[] | undefined>();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [someState, setSomeState] = useState(0);

  useEffect(() => {
    async function fetchProfilesApi() {
      try {
        const data = await profilesApi.getAll()
        setProfiles(data);
      } catch (error) {
        console.log("Erreur lors de la récupération des profils :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfilesApi();
  }, [])

  // Charger tous les exercices depuis l'API
  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await exercisesApi.getAll();
        console.log("Exercices chargés :", data);
        setExercises(data);
      } catch (error) {
        console.log("Erreur lors de la récupération des exercices :", error);
      }
    }
    fetchExercises();
  }, []);

  useEffect(() => {
    async function getUserWorkouts(profileId: string) {
      try {
        const workouts = await workoutsApi.getByUserId(profileId);
        console.log("Workouts pour le profil", profileId, ":", workouts);
        setWorkouts(workouts);
      } catch (error) {
        console.log("Erreur lors de la récupération des workouts :", error);
      }
    }

    if(!currentProfile) return
    getUserWorkouts(currentProfile.id);
  }, [currentProfile]);

  // useEffect pour charger les sets quand un workout est sélectionné
  useEffect(() => {
    async function fetchWorkoutSets() {
      if (!selectedWorkoutId) return;

      try {
        console.log("Chargement des sets pour le workout ID :", selectedWorkoutId);
        await refreshWorkoutSets(selectedWorkoutId);
      } catch (error) {
        console.log("Erreur lors de la récupération des détails du workout :", error);
      }
    }

    fetchWorkoutSets();
  }, [selectedWorkoutId]);

    // Fonction pour rafraîchir les sets d'un workout avec les noms d'exercices
  const refreshWorkoutSets = useCallback(async (workoutId: number) => {
    try {
      const sets = await setsApi.getByWorkoutId(workoutId);

      const setsWithExerciseNames = sets.map((set: Set) => {
        const exercise = exercises.find(ex => ex.id === set.exercise_id);
        return {
          ...set,
          exercise_name: exercise?.name || `Exercice #${set.exercise_id}`
        };
      });

      setCurrentSets(setsWithExerciseNames);
      return setsWithExerciseNames;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des sets:", error);
      return [];
    }
  }, [exercises])

  // Fonction pour obtenir ou créer le workout du jour
  const getOrCreateTodayWorkout = useCallback(async (userId: string): Promise<Workout> => {
    try {
      // Récupérer tous les workouts de l'utilisateur
      const userWorkouts = await workoutsApi.getByUserId(userId);

      // Date du jour à 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Chercher un workout créé aujourd'hui
      const todayWorkout = userWorkouts.find((workout) => {
        const workoutDate = new Date(workout.started_at);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === today.getTime();
      });

      // Si un workout existe déjà aujourd'hui, le retourner
      if (todayWorkout) {
        console.log("Workout du jour trouvé:", todayWorkout);
        return todayWorkout;
      }

      // Sinon, créer un nouveau workout
      const now = new Date().toISOString();
      const newWorkout = await workoutsApi.create({
        user_id: userId,
        started_at: now,
        ended_at: now,
        title: `Séance du ${new Date().toLocaleDateString()}`,
        notes: ""
      });

      console.log("Nouveau workout créé:", newWorkout);
      setCurrentWorkout(newWorkout);
      setSelectedWorkoutId(newWorkout.id);

      // Rafraîchir la liste des workouts
      const updatedWorkouts = await workoutsApi.getByUserId(userId);
      setWorkouts(updatedWorkouts);

      return newWorkout;
    } catch (error) {
      console.error("Erreur lors de la récupération/création du workout:", error);
      throw error;
    }
  }, [])

  const handleChange = useCallback((value: string) => {
    console.log("Profile sélectionné :", value);
    const profile = JSON.parse(value) as Profile;
    setCurrentProfile(profile);
  }, [])

  const handleSeeMoreClick = useCallback((workoutId: number) => {
    console.log("Voir plus pour le workout ID :", workoutId);
    setSelectedWorkoutId(workoutId);
  }, [])

  const handleSetClick = useCallback(() => {
    setModal.open();
  }, [])


  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if(!formData.get("exercice") || !formData.get("weight") || !formData.get("serie") || !formData.get("repetition")) {
      alertModal.open();
      return
    }

    if (!currentProfile) {
      console.error("Aucun profil sélectionné");
      return;
    }

    try {
      const exerciseId = parseInt(formData.get("exercice") as string);
      const weight = parseFloat(formData.get("weight") as string);
      const serie = parseInt(formData.get("serie") as string);
      const repetition = parseInt(formData.get("repetition") as string);

      // 1. Obtenir ou créer le workout du jour
      const workout = await getOrCreateTodayWorkout(currentProfile.id);

      // 2. Trouver l'exercice correspondant dans l'API
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) {
        console.error("Exercice non trouvé dans l'API:", exerciseId);
        return;
      }

      // 3. Créer le set
      const now = new Date().toISOString();
      await setsApi.create({
        workout_id: workout.id,
        exercise_id: exercise.id,
        performed_at: now,
        weight: weight,
        reps: repetition,
        rpe: 0,
        side: null,
        tempo: "",
        notes: `Série ${serie}`
      });

      // 4. Rafraîchir les sets du workout actif
      await refreshWorkoutSets(workout.id);

      // 5. Rafraîchir la liste des workouts
      const updatedWorkouts = await workoutsApi.getByUserId(currentProfile.id);
      setWorkouts(updatedWorkouts);

      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'exercice :", error);
    }
  }, [currentProfile, exercises, getOrCreateTodayWorkout, refreshWorkoutSets])

  return (
    <>
      <SelectProfile profiles={profiles} onSubmit={handleSubmit} onValueChange={handleChange} />

      <div className="flex flex-col justify-center py-2 max-w-2xl m-auto">
        <Button onClick={handleSetClick} disabled={!currentProfile}>
          Ajouter une série
        </Button>
      </div>

      <ListWorkout workouts={workouts} onSelectWorkout={handleSeeMoreClick}/>

      <TableWorkout sets={currentSets} />

      <AlertModal
        {...alertModal}
        title="Erreur"
        description="Veuillez remplir tous les champs du formulaire avant de soumettre."
      />
      
      <SetModal
        {...setModal}
        title="Ajouter une série"
        description="Ajotuer une nouvelle série à votre workout en cours."
        profile={currentProfile}
        onConfirm={async (data) => {
          if(!currentProfile) {
            console.error('Aucun profil sélectionné')
            return
          }

          // Obtenir ou créer le workout du jour
          const workout = await getOrCreateTodayWorkout(currentProfile.id);

          const now = new Date().toISOString();
          await setsApi.create({
              workout_id: workout.id,
              exercise_id: data.exerciceId,
              performed_at: now,
              weight: data.weight,
              repetition: data.repetition,
          });

          await refreshWorkoutSets(workout.id);
          
          const updatedWorkouts = await
          workoutsApi.getByUserId(currentProfile.id);
          setWorkouts(updatedWorkouts);
        }}
        exercises={exercises}
      />
    </>
  );
}
