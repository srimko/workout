'use client';

import { useState, useEffect, use } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertModal } from "@/components/modals/AlertModal";
import { SetModal } from "@/components/modals/SetModal";
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
  const [curentProfile, setCurrentProfile] = useState<Profile>();
  const [currentSets, setCurrentSets] = useState<Set[] | undefined>();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

    if(!curentProfile) return
    getUserWorkouts(curentProfile.id);
  }, [curentProfile]);

  // useEffect pour charger les sets quand un workout est sélectionné
  useEffect(() => {
    async function fetchWorkoutSets() {
      if (!selectedWorkoutId) return;

      try {
        console.log("Chargement des sets pour le workout ID :", selectedWorkoutId);

        // Récupérer toutes les séries du workout
        const sets: Set[] = await setsApi.getByWorkoutId(selectedWorkoutId);
        console.log("Détails du workout :", sets);

        // Récupérer les noms des exercices pour chaque série
        const setsWithExerciseNames = await Promise.all(
          sets.map(async (set: Set) => {
            try {
              const exercise: Exercise = await exercisesApi.getById(set.exercise_id);
              console.log("Exercice pour le set ID", set.id, ":", exercise.name);
              return {
                ...set,
                exercise_name: exercise.name
              };
            } catch (error) {
              console.log("Erreur lors de la récupération de l'exercice :", error);
              return set;
            }
          })
        );

        console.log("Sets mis à jour avec les noms d'exercice :", setsWithExerciseNames);
        setCurrentSets(setsWithExerciseNames);
      } catch (error) {
        console.log("Erreur lors de la récupération des détails du workout :", error);
      }
    }

    fetchWorkoutSets();
  }, [selectedWorkoutId]);

  function handleChange(value: string) {
    console.log("Profile sélectionné :", value);
    const profile = JSON.parse(value) as Profile;
    setCurrentProfile(profile);
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if(!formData.get("exercice") || !formData.get("weight") || !formData.get("serie") || !formData.get("repetition")) {
      alertModal.open();
      return
    }

    if (!curentProfile) {
      console.error("Aucun profil sélectionné");
      return;
    }

    try {
      const exerciseId = parseInt(formData.get("exercice") as string);
      const weight = parseFloat(formData.get("weight") as string);
      const serie = parseInt(formData.get("serie") as string);
      const repetition = parseInt(formData.get("repetition") as string);

      // 1. Vérifier s'il existe un workout actif, sinon en créer un
      let workout = currentWorkout;
      if (!workout) {
        const now = new Date().toISOString();
        workout = await workoutsApi.create({
          user_id: curentProfile.id,
          started_at: now,
          ended_at: now,
          title: `Séance du ${new Date().toLocaleDateString()}`,
          notes: ""
        });
        setCurrentWorkout(workout);
        setSelectedWorkoutId(workout.id);
      }

      // 2. Trouver l'exercice correspondant dans l'API
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) {
        console.error("Exercice non trouvé dans l'API:", exerciseId);
        return;
      }

      // 3. Créer le set
      const now = new Date().toISOString();
      await setsApi.create({
        exercice_name: exercise.name,
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
      const updatedSets = await setsApi.getByWorkoutId(workout.id);
      const setsWithExerciseNames = await Promise.all(
        updatedSets.map(async (set: Set) => {
          try {
            const ex: Exercise = await exercisesApi.getById(set.exercise_id);
            return {
              ...set,
              exercise_name: ex.name
            };
          } catch (error) {
            return set;
          }
        })
      );
      setCurrentSets(setsWithExerciseNames);

      // 5. Rafraîchir la liste des workouts
      const updatedWorkouts = await workoutsApi.getByUserId(curentProfile.id);
      setWorkouts(updatedWorkouts);

      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'exercice :", error);
    }
  }

  function handleSeeMoreClick(workoutId: number) {
    console.log("Voir plus pour le workout ID :", workoutId);
    setSelectedWorkoutId(workoutId);
  }

  function handleSetClick() {
    setModal.open();
  }

  return (
    <>
      <form 
        className="flex flex-col justify-center py-2 max-w-2xl m-auto"
        onSubmit={handleSubmit}
      >
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor="profile">Profile</Label>
          <Select name="profile" onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an profile" />
            </SelectTrigger>
            <SelectContent>
              {
                profiles.map((profile, index) => (
                  <SelectGroup key={profile.id}>
                    <SelectItem key={profile.id} value={JSON.stringify(profile)}>{profile.display_name}</SelectItem>
                  </SelectGroup>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </form>
      

      <div className="flex flex-col justify-center py-2 max-w-2xl m-auto">
        <Button onClick={handleSetClick}>Ajouter une série</Button>
      </div>

      {
        workouts.length > 0 && 
        <div className="flex flex-col justify-center py-2 max-w-2xl m-auto">
          <h2 className="text-2xl font-bold mb-4">Workouts { curentProfile?.display_name } :</h2>
          <ul>
            {workouts.map((workout) => (
              <li key={workout.id} className="flex justify-between mb-2">
                <strong>{workout.title}</strong> - Commencé à : {new Date(workout.started_at).toLocaleString()} <Button variant="link" onClick={() => {handleSeeMoreClick(workout.id)}}>Voir plus</Button>
              </li>
            ))}
          </ul>
        </div>

      }

      {
        currentSets && currentSets.length > 0 && (
          <div className="flex flex-col justify-center py-2 max-w-2xl m-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Détails de la séance</h2>
            <Table>
              <TableCaption>Séries effectuées</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">#</TableHead>
                  <TableHead className="text-left">Exercice</TableHead>
                  <TableHead className="text-left">Poids (kg)</TableHead>
                  <TableHead className="text-left">Répétitions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSets.map((set, index) => (
                  <TableRow key={set.id}>
                    <TableCell className="text-left">{index + 1}</TableCell>
                    <TableCell className="text-left">
                      {(set as any).exercise_name || `Exercice #${set.exercise_id}`}
                    </TableCell>
                    <TableCell className="text-left">{set.weight}</TableCell>
                    <TableCell className="text-left">{set.repetition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      }

      <AlertModal
        {...alertModal}
        title="Erreur"
        description="Veuillez remplir tous les champs du formulaire avant de soumettre."
      />
      
      <SetModal
        {...setModal}
        title="Ajouter une série"
        description="Ajotuer une nouvelle série à votre workout en cours."
        profile={curentProfile}
        onConfirm={async (data) => {
          if(!curentProfile) {
            console.error('Aucun profil sélectionné')
            return
          }

          let workout = currentWorkout;
          if (!workout) {
              const now = new Date().toISOString();
              workout = await workoutsApi.create({
                  user_id: curentProfile.id,
                  started_at: now,
                  ended_at: now,
                  title: `Séance du ${new Date().toLocaleDateString()}`,
                  notes: ""
              });
              setCurrentWorkout(workout);
              setSelectedWorkoutId(workout.id);
          }

          const now = new Date().toISOString();
          await setsApi.create({
              workout_id: workout.id,
              exercise_id: data.exerciceId,
              performed_at: now,
              weight: data.weight,
              repetition: data.repetition,
          });

          const updatedSets = await setsApi.getByWorkoutId(workout.id);
          const setsWithExerciseNames = await Promise.all(
              updatedSets.map(async (set: Set) => {
                  try {
                      const ex: Exercise = await
                      exercisesApi.getById(set.exercise_id);
                      return { ...set, exercise_name: ex.name };
                  } catch (error) {
                      return set;
                  }
              })
          );
          setCurrentSets(setsWithExerciseNames);
          
          const updatedWorkouts = await
          workoutsApi.getByUserId(curentProfile.id);
          setWorkouts(updatedWorkouts);
        }}
        exercises={exercises}
      />
    </>
  );
}
