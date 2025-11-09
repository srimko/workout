# Page 2 : Maximums & Séance Pré-Cycle

## Objectif principal
Permettre à l'utilisateur d'entrer ou de calculer ses charges maximales pour générer un programme adapté.

## Fonctionnalités principales (MVP)
- Entrée des charges maximales connues pour chaque exercice
- Option pour calculer les 1RM via une séance guidée
- Séance guidée pas à pas : exercice par exercice
- Utilisation d'une méthode unique pour le calcul 1RM (à définir : Epley ou Brzycki)
- Interface claire : nom de l'exercice, champ de saisie, bouton pour calcul à partir des répétitions

## Fonctionnalités secondaires (Backlog / Améliorations)
- Mode estimation pour utilisateurs ne faisant pas la séance complète
- Suggestions de récupération/rest entre exercices
- Visualisation du progrès pendant la séance de calcul des max

---

## Notes techniques et métier

### Dépendances / Prérequis
- **Données Page 1** : `target_muscle_groups` sélectionnés → déterminent les exercices à tester
- **Table existante** : `exercises` (filtrer par catégories sélectionnées)
- **Nouvelle table requise** : `user_max_weights`
  - Colonnes : `id`, `profile_id`, `exercise_id`, `max_weight` (1RM), `calculation_method` (manual/epley/brzycki), `tested_weight`, `tested_reps`, `tested_at`, `created_at`
  - Index sur `(profile_id, exercise_id)` pour retrouver facilement les max actuels

### Règles métier CRITIQUES

1. **Formules 1RM - CHOIX À DOCUMENTER** :
   - **Epley** : `1RM = poids × (1 + reps/30)` → Plus optimiste, recommandé pour reps < 10
   - **Brzycki** : `1RM = poids / (1.0278 - 0.0278 × reps)` → Plus conservateur, meilleur pour 2-10 reps
   - ⚠️ **Décision métier** : Choisir UNE formule et la documenter clairement à l'utilisateur
   - Suggestion : Epley (plus répandue, utilisée par StrongLifts, 5/3/1)

2. **Limite de répétitions** : Ne PAS accepter > 15 reps pour calcul 1RM
   - Au-delà, les formules deviennent imprécises (endurance ≠ force max)
   - Message : "Pour calculer votre 1RM, utilisez une charge permettant 3-12 répétitions"

3. **Exercices obligatoires vs optionnels** :
   - **Obligatoires** : Exercices composés principaux (squat, développé couché, soulevé de terre, développé militaire)
   - **Optionnels** : Exercices d'isolation selon groupes sélectionnés
   - ⚠️ Bloquer passage à Page 3 si exercices obligatoires n'ont pas de 1RM

### Deux chemins possibles (Flow complexe)

**Chemin A : Entrée manuelle**
- L'utilisateur connaît déjà ses 1RM
- Simple : liste d'exercices + champ input poids
- Stocker avec `calculation_method = 'manual'`

**Chemin B : Séance guidée**
- Mode "workout" spécial pour calculer les max
- Étapes :
  1. Afficher exercice courant (ex: "Squat")
  2. Demander poids utilisé + reps effectuées
  3. Calculer 1RM automatiquement
  4. Afficher résultat et demander confirmation
  5. Passer à l'exercice suivant
- Stocker avec `calculation_method = 'epley'` et garder `tested_weight` + `tested_reps` pour traçabilité

### State Management

```typescript
interface MaxWeightsState {
  exercises: Array<{
    exercise_id: number
    exercise_name: string
    category: string
    max_weight: number | null
    calculation_method: 'manual' | 'epley' | 'brzycki' | null
    tested_weight?: number
    tested_reps?: number
  }>
  currentExerciseIndex: number // Pour séance guidée
  mode: 'manual' | 'guided'
}
```

### Points d'attention spécifiques

1. **Quels exercices tester ?**
   - Filtrer `exercises` WHERE `category_id IN (groupes_sélectionnés_page1)`
   - Limiter à 8-12 exercices max (séance guidée trop longue sinon)
   - Prioriser : exercices composés > isolation

2. **Gestion des exercices non testés**
   - Option A : Estimer à partir d'exercices similaires (complexe)
   - Option B : Utiliser valeur par défaut conservative basée sur expérience user
     - Débutant : 40kg squat, 30kg bench, etc.
     - Intermédiaire : 80kg, 60kg, etc.
   - Option C : **Recommandé** : Bloquer génération si exercices critiques manquants

3. **Modification ultérieure**
   - Permettre retour sur cette page depuis Page 3 (Recap)
   - NE PAS écraser les valeurs déjà saisies
   - Afficher clairement les valeurs existantes

4. **Historique des max**
   - Garder toutes les entrées (pas de UPDATE, toujours INSERT)
   - Utiliser `ORDER BY created_at DESC LIMIT 1` pour récupérer le max actuel
   - Permet suivi progression et rollback

### Validation UX

- **Entrée manuelle** : Accepter uniquement nombres > 0
- **Séance guidée** :
  - Poids > 0
  - Reps entre 1 et 15
  - Confirmation obligatoire du résultat calculé (afficher formule utilisée)

### Impact sur Page 4 (Génération)

Les 1RM stockés ici sont LA BASE pour calculer toutes les charges d'entraînement :
- Semaine 1 : 70% 1RM
- Semaine 2 : 75% 1RM
- Semaine 3 : 80% 1RM
- ⚠️ Si 1RM trop optimiste → Utilisateur en échec → Programme inutilisable
- **Suggestion métier** : Appliquer facteur sécurité 0.95 sur 1RM calculés (Brzycki déjà conservateur)

### Migration / Impact existant

- **Réutiliser table `sets` ?** NON
  - `sets` = séances réelles, `user_max_weights` = tests de référence
  - Séparer pour éviter pollution des données de tracking

- **Lien avec historique** : Possibilité future d'afficher graphique évolution des max au fil des cycles
