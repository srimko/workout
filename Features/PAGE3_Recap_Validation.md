# Page 3 : Récapitulatif & Validation

## Objectif principal
Permettre à l'utilisateur de vérifier et confirmer toutes les informations avant la génération du programme.

## Fonctionnalités principales (MVP)
- Affichage de toutes les données saisies : profil, objectif(s), charges maximales
- Validation finale avant génération du programme

## Fonctionnalités secondaires (Backlog / Améliorations)
- Fiche synthétique dynamique avec visualisation claire
- Boutons pour éditer les pages précédentes sans perte de données
- Détection d'incohérences ou de données manquantes

---

## Notes techniques et métier

### Dépendances / Prérequis
- **Toutes les données des Pages 1 et 2** :
  - Profil (age, poids, expérience)
  - Objectif (force/hypertrophie/endurance)
  - Groupes musculaires (3-4)
  - 1RM pour tous les exercices sélectionnés
- **Aucune nouvelle table** : cette page ne fait qu'afficher et valider

### Règles métier CRITIQUES - Détection d'incohérences

1. **Incohérence Objectif vs 1RM**
   - Objectif "Force" mais 1RM < standards débutant → Warning
   - Objectif "Hypertrophie" mais 1RM très élevés (avancé) → Suggestion de revoir objectif
   - Message : "Avec vos charges, un programme axé Force pourrait être plus adapté"

2. **Incohérence Expérience vs 1RM**
   - Profil "Débutant" mais 1RM squat > 100kg → Demander confirmation
   - Profil "Avancé" mais 1RM squat < 60kg → Warning potentiel
   - ⚠️ Ne PAS bloquer, juste alerter (peut être retour de blessure, reprise, etc.)

3. **Données manquantes bloquantes**
   - Au moins 1 exercice composé sans 1RM → **BLOQUER** génération
   - Liste minimale : Squat OU Leg Press, Bench OU Dips, Row OU Pull-up, OHP OU Arnold Press
   - Message : "Veuillez renseigner au moins un exercice par groupe : Jambes, Poussée, Tirage, Épaules"

4. **Groupes musculaires déséquilibrés**
   - 4 groupes "poussée" et 0 "tirage" → Warning
   - Message : "Votre sélection peut créer des déséquilibres musculaires. Nous recommandons d'inclure des exercices de tirage."

### State Management

```typescript
interface RecapData {
  profile: {
    age: number
    weight: number
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }
  goals: {
    primary: 'force' | 'hypertrophie' | 'endurance'
    muscle_groups: string[]
  }
  maxWeights: Array<{
    exercise_name: string
    max_weight: number
    calculation_method: string
  }>
  validationErrors: string[]
  validationWarnings: string[]
}
```

### Points d'attention spécifiques

1. **Affichage clair et hiérarchisé**
   ```
   ┌─ PROFIL ──────────────────┐
   │ Âge: 28 ans               │
   │ Poids: 75kg               │
   │ Expérience: Intermédiaire │
   └───────────────────────────┘

   ┌─ OBJECTIF ────────────────┐
   │ Principal: Hypertrophie   │
   │ Groupes: Pectoraux,       │
   │   Jambes, Dos, Épaules    │
   └───────────────────────────┘

   ┌─ CHARGES MAXIMALES ───────┐
   │ Squat: 100kg              │
   │ Bench Press: 80kg         │
   │ Deadlift: 120kg           │
   │ ...                       │
   └───────────────────────────┘
   ```

2. **Boutons d'édition**
   - "Modifier profil" → Retour Page 1
   - "Modifier objectifs" → Retour Page 1
   - "Modifier charges" → Retour Page 2
   - ⚠️ **CRUCIAL** : Préserver toutes les données déjà saisies
   - Utiliser query params : `/programme?step=1&returning=true`

3. **Validation côté serveur**
   - NE PAS se fier uniquement à la validation client
   - Endpoint : `POST /api/programs/validate`
   - Retourner `{ valid: boolean, errors: [], warnings: [] }`

4. **Standards de référence (pour détection incohérences)**
   - Utiliser des tables de standards (ex: ExRx, Symmetric Strength)
   - Exemple Squat homme 75kg :
     - Débutant : < 60kg
     - Intermédiaire : 60-90kg
     - Avancé : 90-120kg
     - Expert : > 120kg
   - Stocker ces standards en base ou config JSON

### Flow utilisateur

1. **Arrivée sur page** :
   - Agréger données des Pages 1 + 2
   - Exécuter validations automatiques
   - Afficher erreurs/warnings

2. **Si erreurs bloquantes** :
   - Désactiver bouton "Générer le programme"
   - Afficher message clair : "Veuillez compléter les informations manquantes"
   - Lister les erreurs avec liens directs vers pages à corriger

3. **Si warnings seulement** :
   - Activer bouton "Générer le programme"
   - Afficher warnings avec icône info
   - Permettre génération malgré warnings (responsabilité user)

4. **Confirmation finale** :
   - Modal : "Êtes-vous sûr de générer le programme ? Cette action créera un programme de 4 semaines."
   - Si programme existant : "Cela remplacera votre programme actuel."

### Validation UX

- **Bouton "Générer"** :
  - Activé : vert, texte "Générer mon programme"
  - Désactivé (erreurs) : gris, texte "Complétez les informations requises"
  - Loading : spinner, texte "Génération en cours..."

- **Erreurs vs Warnings** :
  - Erreurs : rouge, icône ❌, bloquantes
  - Warnings : orange, icône ⚠️, non-bloquantes

### Impact sur Page 4

Cette page est le **point de non-retour** :
- Après clic "Générer", les données sont figées dans une entrée `program_configs`
- Page 4 utilise ces données figées pour générer le programme
- Modifications ultérieures nécessitent regénération complète

### Migration / Impact existant

- **Aucun impact base de données** : lecture seule
- **Impact UX** : Dernière chance de modifier avant engagement
- **Recommandation** : Ajouter analytics pour tracker :
  - Combien d'users modifient après arrivée sur Recap
  - Quelles pages sont le plus souvent modifiées (pain points)

### Checklist de validation (pour l'implémentation)

- [ ] Profil complet (age, poids, expérience)
- [ ] Objectif sélectionné
- [ ] 3-4 groupes musculaires
- [ ] Au moins 1 exercice composé par catégorie principale
- [ ] Toutes les 1RM > 0
- [ ] Cohérence expérience vs 1RM (warning seulement)
- [ ] Cohérence objectif vs 1RM (warning seulement)
- [ ] Balance poussée/tirage (warning seulement)
