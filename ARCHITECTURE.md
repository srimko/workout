# Architecture API - Guide d'utilisation

## Structure du projet

```
lib/
├── api/                    # Couche API
│   ├── client.ts           # Client HTTP centralisé
│   ├── profiles.ts         # API pour les profils
│   ├── exercises.ts        # API pour les exercices
│   ├── workouts.ts         # API pour les séances
│   ├── sets.ts             # API pour les séries
│   ├── records.ts          # API pour les records personnels
│   └── index.ts            # Export centralisé
│
├── types/                  # Types TypeScript
│   └── index.ts            # Interfaces partagées
│
└── hooks/                  # Custom hooks (à créer au besoin)
    └── ...
```

## Démarrage

### 1. Démarrer l'API json-server

```bash
npm run api
```

L'API sera disponible sur `http://localhost:3001`

### 2. Démarrer Next.js

Dans un autre terminal :
```bash
npm run dev
```

### 3. Démarrer les deux en même temps

```bash
npm run dev:all
```

## Exemples d'utilisation

### Exemple 1 : Récupérer tous les profils

```typescript
'use client';

import { useEffect, useState } from 'react';
import { profilesApi } from '@/lib/api/profiles';
import { Profile } from '@/lib/types';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const data = await profilesApi.getAll();
        setProfiles(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {profiles.map((profile) => (
        <div key={profile.id}>{profile.display_name}</div>
      ))}
    </div>
  );
}
```

### Exemple 2 : Créer une nouvelle séance

```typescript
import { workoutsApi } from '@/lib/api/workouts';

async function createWorkout() {
  try {
    const newWorkout = await workoutsApi.create({
      user_id: 'u1',
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      title: 'Pectoraux / Triceps',
      notes: 'Bonne séance',
    });

    console.log('Séance créée:', newWorkout);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
  }
}
```

### Exemple 3 : Récupérer les séances d'un utilisateur

```typescript
import { workoutsApi } from '@/lib/api/workouts';

async function getUserWorkouts(userId: string) {
  try {
    const workouts = await workoutsApi.getByUserId(userId);
    console.log('Séances de l\'utilisateur:', workouts);
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 4 : Ajouter une série à une séance

```typescript
import { setsApi } from '@/lib/api/sets';

async function addSet(workoutId: number) {
  try {
    const newSet = await setsApi.create({
      workout_id: workoutId,
      exercise_id: 1,
      performed_at: new Date().toISOString(),
      weight: 80,
      reps: 10,
      rpe: 8,
      side: null,
      tempo: '2-1-1',
      notes: '',
    });

    console.log('Série ajoutée:', newSet);
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 5 : Mettre à jour un profil

```typescript
import { profilesApi } from '@/lib/api/profiles';

async function updateProfile(userId: string) {
  try {
    const updated = await profilesApi.update(userId, {
      weight_kg: 77.5,
    });

    console.log('Profil mis à jour:', updated);
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 6 : Supprimer une séance

```typescript
import { workoutsApi } from '@/lib/api/workouts';

async function deleteWorkout(workoutId: number) {
  try {
    await workoutsApi.delete(workoutId);
    console.log('Séance supprimée');
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

## API disponibles

### profilesApi
- `getAll()` - Récupérer tous les profils
- `getById(id)` - Récupérer un profil par ID
- `create(data)` - Créer un nouveau profil
- `update(id, data)` - Mettre à jour un profil
- `delete(id)` - Supprimer un profil

### exercisesApi
- `getAll()` - Récupérer tous les exercices
- `getById(id)` - Récupérer un exercice par ID
- `getByMuscleGroup(muscleGroup)` - Filtrer par groupe musculaire
- `create(data)` - Créer un nouvel exercice
- `update(id, data)` - Mettre à jour un exercice
- `delete(id)` - Supprimer un exercice

### workoutsApi
- `getAll()` - Récupérer toutes les séances
- `getById(id)` - Récupérer une séance par ID
- `getByUserId(userId)` - Filtrer par utilisateur
- `create(data)` - Créer une nouvelle séance
- `update(id, data)` - Mettre à jour une séance
- `delete(id)` - Supprimer une séance

### setsApi
- `getAll()` - Récupérer toutes les séries
- `getById(id)` - Récupérer une série par ID
- `getByWorkoutId(workoutId)` - Récupérer les séries d'une séance
- `create(data)` - Créer une nouvelle série
- `update(id, data)` - Mettre à jour une série
- `delete(id)` - Supprimer une série

### recordsApi
- `getAll()` - Récupérer tous les records
- `getById(id)` - Récupérer un record par ID
- `getByUserId(userId)` - Filtrer par utilisateur
- `create(data)` - Créer un nouveau record
- `delete(id)` - Supprimer un record

## Gestion des erreurs

```typescript
import { ApiError } from '@/lib/api/client';

try {
  const data = await workoutsApi.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Erreur API (${error.status}):`, error.message);
  } else {
    console.error('Erreur réseau:', error);
  }
}
```

## Configuration

L'URL de l'API est configurée dans `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Pour changer l'URL en production, modifiez cette variable.
