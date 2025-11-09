# Page 1 : Profil & Objectifs

## Objectif principal
Collecter les informations de profil et les objectifs de l'utilisateur afin de contextualiser le programme.

## Fonctionnalités principales (MVP)
- Afficher le résumé du profil utilisateur : expérience, sexe, âge, poids
- Sélection de l'objectif principal : force, hypertrophie, endurance
- Sélection des groupes musculaires ciblés (limité à 3–4)
- Résumé visuel du profil et de l'objectif choisi
- Stockage de l'objectif secondaire comme beta (non sélectionnable dans l'UI)

## Fonctionnalités secondaires (Backlog / Améliorations)
- Suggestions dynamiques de combinaison de groupes musculaires
- Analytique avancée du profil pour personnalisation future
- Visualisation plus détaillée des statistiques de profil

---

## Notes techniques et métier

### Dépendances / Prérequis
- **Table existante** : `profiles` (auth_id, experience, gender, age, weight)
- **Nouvelle table requise** : `user_goals` ou `program_configs`
  - Colonnes : `id`, `profile_id`, `primary_goal` (enum: force/hypertrophie/endurance), `secondary_goal` (beta), `target_muscle_groups` (array), `created_at`
- **Table à lire** : `categories` (pour lister les groupes musculaires disponibles)

### Règles métier CRITIQUES
1. **Limite stricte 3-4 groupes** : L'algorithme de génération (Page 4) ne peut pas gérer plus
   - ⚠️ Valider côté client ET serveur
   - Message d'erreur clair si dépassement

2. **Objectif secondaire** : Stocker en base mais NE PAS afficher dans l'UI (feature beta)
   - Prévoir la colonne maintenant pour éviter migration future
   - Utiliser pour A/B testing ou analytics

3. **Profil incomplet** : Que faire si age/poids manquants dans `profiles` ?
   - Option A : Forcer complétion profil avant accès à cette page
   - Option B : Permettre saisie directe dans cette page (duplication de formulaire)

### State Management
- **Context global recommandé** : `ProgramGenerationContext` pour partager données entre pages 1-4
  - État : `{ profile, goals, maxWeights, generatedProgram }`
  - Persister dans `localStorage` pour éviter perte si refresh

- **Navigation** : Multi-step form avec indicateur de progression
  - Utiliser router query params pour permettre refresh (`/programme?step=1`)

### Flow utilisateur
1. **Nouvel utilisateur** : Profil → Objectifs → Max → Recap → Programme
2. **Utilisateur existant avec programme** :
   - Afficher warning : "Vous avez déjà un programme en cours. Générer un nouveau programme l'écrasera."
   - Demander confirmation avant de continuer

### Points d'attention spécifiques
- **Groupes musculaires** : Utiliser les catégories existantes ou créer une nouvelle table `muscle_groups` ?
  - Si catégories existantes : vérifier que les noms sont user-friendly ("Pectoraux" vs "chest")

- **Expérience utilisateur** : Comment gérer les 4 niveaux (débutant, intermédiaire, avancé, expert) ?
  - Impact direct sur les charges et volumes générés en Page 4

- **Validation UX** : Désactiver "Suivant" tant que :
  - Objectif non sélectionné
  - Moins de 3 groupes musculaires sélectionnés
  - Plus de 4 groupes musculaires sélectionnés

### Migration / Impact existant
- **Aucun impact sur workouts actuels** : Cette feature est un nouveau flux séparé
- **Lien potentiel** : Afficher suggestion "Générer un programme" sur page d'accueil si aucun workout aujourd'hui
