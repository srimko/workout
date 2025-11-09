# Page 4 : Génération du Programme

## Objectif principal
Créer un programme d'entraînement complet, progressif et prêt à suivre sur 4 semaines (3 + 1 de repos).

## Fonctionnalités principales (MVP)
- Génération d'un programme sur 3 semaines + 1 semaine de repos relatif
- Décomposition semaine par semaine
- Export du programme (PDF ou intégration calendrier type Google Calendar / iCal)

## Fonctionnalités secondaires (Backlog / Améliorations)
- Indicateurs visuels de progression par semaine (volume, charge, intensité)
- Ajustement dynamique des charges selon fatigue ou performance réelle
- Exercices alternatifs ou substitutions pour variation
- Historique de performance et suivi de l'adhérence

---

## Notes techniques et métier

### Dépendances / Prérequis
- **Toutes les données validées Page 3** (figées dans le temps)
- **Nouvelles tables requises** :

  ```sql
  -- Table principale du programme généré
  CREATE TABLE programs (
    id UUID PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    config_id UUID REFERENCES program_configs(id), -- Snapshot des paramètres
    title TEXT,
    goal TEXT, -- force/hypertrophie/endurance
    start_date DATE,
    end_date DATE, -- start_date + 28 jours
    status TEXT, -- draft/active/completed/abandoned
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

  -- Snapshot des paramètres utilisés pour générer
  CREATE TABLE program_configs (
    id UUID PRIMARY KEY,
    profile_snapshot JSONB, -- { age, weight, experience }
    goals JSONB, -- { primary, muscle_groups }
    max_weights JSONB, -- [{ exercise_id, max_weight, ... }]
    created_at TIMESTAMP
  );

  -- Structure semaine par semaine
  CREATE TABLE program_weeks (
    id UUID PRIMARY KEY,
    program_id UUID REFERENCES programs(id),
    week_number INTEGER, -- 1, 2, 3, 4
    type TEXT, -- training/deload
    intensity_percentage FLOAT, -- ex: 70%, 75%, 80%, 50%
    created_at TIMESTAMP
  );

  -- Séances de la semaine
  CREATE TABLE program_sessions (
    id UUID PRIMARY KEY,
    week_id UUID REFERENCES program_weeks(id),
    day_number INTEGER, -- 1-7 (lundi = 1)
    session_type TEXT, -- push/pull/legs/upper/lower selon split
    created_at TIMESTAMP
  );

  -- Exercices de chaque séance
  CREATE TABLE program_exercises (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES program_sessions(id),
    exercise_id INTEGER REFERENCES exercises(id),
    order_index INTEGER, -- Ordre dans la séance
    sets INTEGER,
    reps_min INTEGER,
    reps_max INTEGER,
    weight_percentage FLOAT, -- % du 1RM
    rest_seconds INTEGER, -- Repos entre séries
    notes TEXT, -- Instructions spéciales
    created_at TIMESTAMP
  );
  ```

### Règles métier CRITIQUES - Algorithme de génération

#### 1. **Périodisation (Progressivité sur 3 semaines)**

Le programme DOIT être progressif :

```
Semaine 1 (Base) :
- Intensité : 70% 1RM
- Volume : 3 sets × 8-10 reps
- Repos : 90-120s

Semaine 2 (Progression) :
- Intensité : 75% 1RM
- Volume : 4 sets × 6-8 reps
- Repos : 120-150s

Semaine 3 (Peak) :
- Intensité : 80% 1RM
- Volume : 5 sets × 4-6 reps
- Repos : 180s

Semaine 4 (Deload) :
- Intensité : 50-60% 1RM
- Volume : 2 sets × 10-12 reps
- Repos : 60-90s
- ⚠️ IMPORTANT : Récupération active, pas de repos complet
```

#### 2. **Split d'entraînement selon objectif**

**Pour Hypertrophie** : Push/Pull/Legs (PPL)
- Jour 1 : Push (Pectoraux, Épaules, Triceps)
- Jour 2 : Repos
- Jour 3 : Pull (Dos, Biceps)
- Jour 4 : Repos
- Jour 5 : Legs (Quadriceps, Ischio, Mollets)
- Jour 6-7 : Repos

**Pour Force** : Upper/Lower
- Jour 1 : Upper (Haut du corps, exercices composés)
- Jour 2 : Repos
- Jour 3 : Lower (Bas du corps, squat/deadlift focus)
- Jour 4 : Repos
- Jour 5 : Upper (Variante)
- Jour 6-7 : Repos

**Pour Endurance** : Full Body
- Jour 1 : Full Body A
- Jour 2 : Repos
- Jour 3 : Full Body B
- Jour 4 : Repos
- Jour 5 : Full Body C
- Jour 6-7 : Repos

#### 3. **Sélection des exercices**

⚠️ **Règle d'or** : Prioriser exercices composés > isolation

Pour chaque groupe musculaire sélectionné :
- 1-2 exercices composés (ex: Squat, Bench Press)
- 1-2 exercices d'isolation (ex: Leg Extension, Fly)

**Ordre dans la séance** :
1. Exercices polyarticulaires lourds (squat, bench, deadlift)
2. Exercices polyarticulaires légers (row, OHP)
3. Exercices d'isolation (curls, extensions, élévations)

#### 4. **Calcul des charges**

Pour chaque exercice :
```typescript
const targetWeight = exercise.user_max_weight * week.intensity_percentage
const roundedWeight = Math.round(targetWeight / 2.5) * 2.5 // Arrondir à 2.5kg près
```

⚠️ **Attention** : Certains exercices (isolation) utilisent des charges plus faibles
- Exercices composés : % 1RM standard
- Exercices isolation : % 1RM × 0.6-0.7 (ex: 70% → 42-49%)

### State Management

```typescript
interface GeneratedProgram {
  program_id: string
  title: string
  start_date: string
  end_date: string
  weeks: Array<{
    week_number: number
    type: 'training' | 'deload'
    intensity: number
    sessions: Array<{
      day: number
      day_name: string // "Lundi", "Mercredi", etc.
      type: string // "Push", "Pull", "Legs"
      exercises: Array<{
        exercise_id: number
        exercise_name: string
        sets: number
        reps: string // "8-10" ou "4-6"
        weight: number // kg calculé
        rest: number // secondes
        notes?: string
      }>
    }>
  }>
}
```

### Points d'attention spécifiques

1. **Génération côté serveur OBLIGATOIRE**
   - Logique trop complexe pour client
   - Endpoint : `POST /api/programs/generate`
   - Payload : `config_id` (snapshot des paramètres)
   - Response : `{ program_id, weeks: [...] }`
   - Timeout : Prévoir 5-10s de génération

2. **Gestion des exercices manquants**
   - Si un groupe musculaire n'a aucun exercice en base → Erreur bloquante
   - Fallback : Utiliser exercices génériques de la catégorie

3. **Variations inter-semaines**
   - NE PAS répéter exactement les mêmes exercices chaque semaine
   - Rotation : Bench Press S1 → Incline Bench S2 → Dumbbell Press S3
   - Stocker `exercise_variants` pour chaque exercice principal

4. **Export PDF**
   - Librairie recommandée : `jsPDF` ou `react-pdf`
   - Format : 1 page par semaine, tableau clair
   - Inclure : Date génération, profil user, objectif, charges calculées

5. **Export iCal**
   - Format : `.ics` standard
   - Créer 1 événement par séance
   - Titre : "Séance Push - Semaine 1"
   - Description : Liste des exercices avec charges
   - Rappel : 1h avant la séance

### Flow utilisateur

1. **Clic "Générer le programme"** (depuis Page 3)
   - Afficher loader : "Génération de votre programme personnalisé..."
   - Call API : `POST /api/programs/generate`

2. **Génération réussie**
   - Redirection vers `/programme/[program_id]`
   - Affichage programme semaine par semaine
   - Boutons : "Télécharger PDF", "Ajouter au calendrier", "Commencer maintenant"

3. **Génération échouée**
   - Toast erreur : "Impossible de générer le programme"
   - Proposer retry
   - Logger l'erreur côté serveur pour debug

4. **Programme existant**
   - Si user a déjà un programme `status = 'active'` :
     - Mettre ancien programme à `status = 'abandoned'`
     - Créer nouveau programme
   - Garder historique complet (analytics)

### Validation UX

- **Pendant génération** :
  - Loader avec message encourageant
  - Pas de bouton retour (transaction en cours)

- **Après génération** :
  - Confettis / animation de succès
  - CTA clair : "Commencer mon programme"
  - Accès permanent : Lien dans sidebar "Mon Programme"

### Algorithme de génération (pseudo-code)

```typescript
async function generateProgram(config: ProgramConfig): Promise<Program> {
  // 1. Créer l'entrée programme
  const program = await createProgram(config)

  // 2. Générer 4 semaines
  for (let weekNum = 1; weekNum <= 4; weekNum++) {
    const week = await createWeek(program, weekNum, {
      intensity: weekNum < 4 ? [70, 75, 80][weekNum-1] : 50,
      type: weekNum < 4 ? 'training' : 'deload'
    })

    // 3. Créer les séances selon le split
    const sessions = getSplit(config.goal) // PPL, Upper/Lower, ou Full Body
    for (const sessionTemplate of sessions) {
      const session = await createSession(week, sessionTemplate)

      // 4. Sélectionner et ajouter les exercices
      const exercises = selectExercises(
        config.muscle_groups,
        sessionTemplate.type,
        config.max_weights
      )

      for (const exercise of exercises) {
        await createProgramExercise(session, exercise, {
          sets: getSetsForWeek(weekNum, config.goal),
          reps: getRepsRange(weekNum, config.goal),
          weight: calculateWeight(exercise.max_weight, week.intensity),
          rest: getRestPeriod(exercise.type, config.goal)
        })
      }
    }
  }

  return program
}
```

### Migration / Impact existant

**IMPACT MAJEUR sur l'app** :
- Nouveau concept : Programme vs Workout
  - **Programme** = Plan sur 4 semaines (généré)
  - **Workout** = Séance réelle exécutée (tracking actuel)

- **Lien Programme ↔ Workout** :
  - Quand user fait une séance, lier au `program_session_id`
  - Permet tracking : "Vous avez complété 3/12 séances du programme"
  - Table `workouts` : Ajouter colonne `program_session_id UUID NULL`

- **Page d'accueil** :
  - Si programme actif : Afficher "Prochaine séance : Push - Semaine 2"
  - Bouton : "Démarrer la séance programmée" (pré-remplit les exercices)

### Métriques à tracker (Analytics)

- Temps de génération (performance)
- Taux de complétion (combien finissent le programme)
- Taux d'adhérence (séances faites / séances prévues)
- Exercices les plus/moins réalisés
- Abandons précoces (à quelle semaine)

### Points de décision métier à valider

1. **Que faire si user skip une séance programmée ?**
   - Option A : Continuer le programme (séance perdue)
   - Option B : Décaler tout le programme d'un jour
   - Option C : Proposer rattrapage

2. **Modifications du programme en cours ?**
   - Permettre ou bloquer ?
   - Si oui : Re-générer semaines restantes ou ajustements manuels ?

3. **Programmes simultanés ?**
   - Bloquer (1 seul programme actif)
   - OU Permettre (ex: programme Force + programme Cardio)

4. **Tarification ?**
   - Feature gratuite (acquisition)
   - OU Payante (premium)
   - OU Freemium (1 programme gratuit, puis payant)
