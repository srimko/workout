'use client';

import { useEffect, useState } from 'react';
import { profilesApi, workoutsApi, exercisesApi } from '@/lib/api';
import { Profile, Workout, Exercise } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function TestApiPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAllData() {
    setLoading(true);
    setError(null);

    try {
      const [profilesData, workoutsData, exercisesData] = await Promise.all([
        profilesApi.getAll(),
        workoutsApi.getAll(),
        exercisesApi.getAll(),
      ]);

      setProfiles(profilesData);
      setWorkouts(workoutsData);
      setExercises(exercisesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  async function createTestWorkout() {
    try {
      const newWorkout = await workoutsApi.create({
        user_id: 'u1',
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        title: 'Séance de test',
        notes: 'Créée depuis l\'interface',
      });

      setWorkouts([...workouts, newWorkout]);
      alert('Séance créée avec succès !');
    } catch (err) {
      alert('Erreur lors de la création de la séance');
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading && profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-500">Erreur: {error}</div>
        <div className="text-sm text-gray-600">
          Assurez-vous que json-server est démarré avec <code>npm run api</code>
        </div>
        <Button onClick={fetchAllData}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Test de l'API</h1>

      <div className="mb-8 flex gap-4">
        <Button onClick={fetchAllData}>Recharger les données</Button>
        <Button onClick={createTestWorkout} variant="outline">
          Créer une séance de test
        </Button>
      </div>

      {/* Profils */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Profils ({profiles.length})
        </h2>
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">{profile.display_name}</h3>
              <div className="text-sm text-gray-600 mt-2">
                <p>Poids: {profile.weight_kg} kg</p>
                <p>Taille: {profile.height_cm} cm</p>
                <p>Niveau: {profile.training_experience}</p>
                <p>Objectifs: {profile.goals.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Exercices ({exercises.length})
        </h2>
        <div className="grid gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">{exercise.name}</h3>
              <div className="text-sm text-gray-600 mt-2">
                <p>Machine: {exercise.machine}</p>
                <p>Type: {exercise.modality}</p>
                <p>Muscles: {exercise.muscle_groups.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Séances */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Séances ({workouts.length})
        </h2>
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">{workout.title}</h3>
              <div className="text-sm text-gray-600 mt-2">
                <p>Date: {new Date(workout.started_at).toLocaleDateString()}</p>
                <p>Utilisateur: {workout.user_id}</p>
                {workout.notes && <p>Notes: {workout.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
