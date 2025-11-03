"use client"

import { useCallback, useEffect, useState } from "react"
import { DrawerExercise } from "@/components/Drawers/components/DrawerExercise"
import { AlertModal } from "@/components/modals/AlertModal"
import { WorkoutCardList } from "@/components/Cards/WorkoutCardList"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useModal } from "@/lib/hooks/useModal"
import type { Exercise, Profile, Set, Workout } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"
import { Dumbbell, Plus } from "lucide-react"
import type { SetWithExerciseName } from "@/components/Cards/WorkoutCard"

type WorkoutStatus = "none" | "created" | "in_progress" | "completed"

export default function Home() {
  const supabase = createClient()
  const alertModal = useModal()

  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>("none")
  const [currentSets, setCurrentSets] = useState<Set[] | undefined>()
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [editingSet, setEditingSet] = useState<SetWithExerciseName | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Charger tous les exercices depuis Supabase
  useEffect(() => {
    async function fetchExercises() {
      try {
        const { data } = await supabase.from("exercises").select("*")
        console.log("Exercices chargés :", data)
        setExercises(data || [])
      } catch (error) {
        console.log("Erreur lors de la récupération des exercices :", error)
      }
    }
    fetchExercises()
  }, [])

  // Charger automatiquement le workout du jour au démarrage
  useEffect(() => {
    async function initializeTodayWorkout() {
      try {
        // Récupérer l'utilisateur connecté
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          console.log("Aucun utilisateur connecté")
          return
        }

        // Récupérer le profil de l'utilisateur
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", user.id)
          .single()

        if (!profile) {
          console.log("Profil non trouvé")
          return
        }

        setCurrentProfile(profile)

        // Préparer la date du jour
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Récupérer tous les workouts de l'utilisateur
        const { data: userWorkouts } = await supabase
          .from("workouts")
          .select("*")
          .eq("profile_id", profile.id)
          .order("started_at", { ascending: false })

        // Auto-clôturer les workouts d'autres jours non terminés
        const workoutsToClose = (userWorkouts || []).filter((w) => {
          if (w.ended_at !== null) return false
          const workoutDate = new Date(w.started_at)
          workoutDate.setHours(0, 0, 0, 0)
          return workoutDate.getTime() !== today.getTime()
        })

        for (const workout of workoutsToClose) {
          const workoutDate = new Date(workout.started_at)
          workoutDate.setHours(23, 59, 59, 999)
          await supabase
            .from("workouts")
            .update({ ended_at: workoutDate.toISOString() })
            .eq("id", workout.id)
          console.log(`Workout ${workout.id} auto-clôturé`)
        }

        // Chercher le workout du jour uniquement
        const todayWorkout = (userWorkouts || []).find((w) => {
          const workoutDate = new Date(w.started_at)
          workoutDate.setHours(0, 0, 0, 0)
          return workoutDate.getTime() === today.getTime()
        })

        if (todayWorkout) {
          setCurrentWorkout(todayWorkout)

          // Charger les sets du workout
          const { data: sets } = await supabase
            .from("sets")
            .select("*")
            .eq("workout_id", todayWorkout.id)

          // Déterminer le statut
          if (todayWorkout.ended_at !== null) {
            setWorkoutStatus("completed")
          } else if (sets && sets.length > 0) {
            setWorkoutStatus("in_progress")
          } else {
            setWorkoutStatus("created")
          }

          await refreshWorkoutSets(todayWorkout.id)
        } else {
          // Aucun workout du jour
          setWorkoutStatus("none")
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation du workout du jour:", error)
      }
    }

    initializeTodayWorkout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fonction pour rafraîchir les sets d'un workout avec les noms d'exercices
  const refreshWorkoutSets = useCallback(
    async (workoutId: string) => {
      try {
        const { data: sets } = await supabase.from("sets").select("*").eq("workout_id", workoutId)

        const setsWithExerciseNames = (sets || []).map((set: Set) => {
          const exercise = exercises.find((ex) => ex.id === set.exercise_id)
          return {
            ...set,
            exercise_name: exercise?.title || `Exercice #${set.exercise_id}`,
          }
        })

        setCurrentSets(setsWithExerciseNames)
        return setsWithExerciseNames
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des sets:", error)
        return []
      }
    },
    [exercises, supabase],
  )

  // Fonction pour démarrer un nouveau workout
  const startWorkout = useCallback(async () => {
    if (!currentProfile) return

    try {
      const { data: newWorkout, error } = await supabase
        .from("workouts")
        .insert({
          profile_id: currentProfile.id,
          title: `Séance du ${new Date().toLocaleDateString("fr-FR")}`,
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      setCurrentWorkout(newWorkout)
      setCurrentSets([])
      setWorkoutStatus("created")
    } catch (error) {
      console.error("Erreur lors de la création du workout:", error)
    }
  }, [currentProfile, supabase])

  // Fonction pour terminer le workout
  const endWorkout = useCallback(async () => {
    if (!currentWorkout) return

    try {
      const { error } = await supabase
        .from("workouts")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", currentWorkout.id)

      if (error) throw error

      setWorkoutStatus("completed")
      setCurrentWorkout({ ...currentWorkout, ended_at: new Date().toISOString() })
    } catch (error) {
      console.error("Erreur lors de la clôture du workout:", error)
    }
  }, [currentWorkout, supabase])

  // Fonction pour rafraîchir les sets après création
  const handleSetCreated = useCallback(async () => {
    if (currentWorkout) {
      await refreshWorkoutSets(currentWorkout.id)
      // Mettre à jour le statut si c'était le premier set
      if (workoutStatus === "created") {
        setWorkoutStatus("in_progress")
      }
    }
  }, [currentWorkout, workoutStatus, refreshWorkoutSets])

  // Fonction pour gérer l'édition d'un set
  const handleEditSet = useCallback((set: SetWithExerciseName) => {
    setEditingSet(set)
    setDrawerOpen(true)
  }, [])

  // Fonction pour rafraîchir les sets après modification
  const handleSetUpdated = useCallback(async () => {
    if (currentWorkout) {
      await refreshWorkoutSets(currentWorkout.id)
    }
    setEditingSet(null)
    setDrawerOpen(false)
  }, [currentWorkout, refreshWorkoutSets])

  // Fonction pour gérer la fermeture du drawer
  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setEditingSet(null)
    }
  }, [])

  // Vue 1 : Aucun workout du jour
  if (workoutStatus === "none") {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Dumbbell />
            </EmptyMedia>
            <EmptyTitle>Commencez votre séance</EmptyTitle>
            <EmptyDescription>
              Créez un nouveau workout pour commencer votre entraînement d'aujourd'hui
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={startWorkout}>Commencer le workout</Button>
          </EmptyContent>
        </Empty>

        <AlertModal
          {...alertModal}
          title="Erreur"
          description="Veuillez remplir tous les champs du formulaire avant de soumettre."
        />
      </>
    )
  }

  // Vue 2 : Workout créé mais aucun exercice
  if (workoutStatus === "created") {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Dumbbell />
            </EmptyMedia>
            <EmptyTitle>Ajoutez votre premier exercice</EmptyTitle>
            <EmptyDescription>
              Commencez votre entraînement en ajoutant un exercice
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col gap-3">
              <DrawerExercise onSetCreated={handleSetCreated} />
              <Button variant="outline" onClick={endWorkout}>
                Terminer le workout
              </Button>
            </div>
          </EmptyContent>
        </Empty>

        <AlertModal
          {...alertModal}
          title="Erreur"
          description="Veuillez remplir tous les champs du formulaire avant de soumettre."
        />
      </>
    )
  }

  // Vue 3 : Workout en cours avec exercices
  if (workoutStatus === "in_progress") {
    return (
      <>
        <div className="relative min-h-screen bg-background">
          {/* Header sticky */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pt-4 pb-3 px-4 border-b border-border/50">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Ma séance</h1>
              <Badge variant="outline">En cours</Badge>
            </div>
          </div>

          {/* Contenu principal - cartes */}
          <div className="px-4">
            <WorkoutCardList
              sets={currentSets}
              onEditSet={handleEditSet}
              workoutTitle={currentWorkout?.title}
            />
          </div>

          {/* FAB - Ajouter exercice */}
          <div className="fixed bottom-20 right-4 z-50">
            <DrawerExercise
              onSetCreated={handleSetCreated}
              editMode={!!editingSet}
              setToEdit={editingSet || undefined}
              onSetUpdated={handleSetUpdated}
              open={drawerOpen}
              onOpenChange={handleDrawerOpenChange}
              trigger={
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Ajouter exercice</span>
                </Button>
              }
              showTrigger={!editingSet}
            />
          </div>

          {/* Bottom bar - Terminer workout */}
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
            <Button
              variant="destructive"
              className="w-full h-12 text-base"
              onClick={endWorkout}
            >
              Terminer le workout
            </Button>
          </div>
        </div>

        <AlertModal
          {...alertModal}
          title="Erreur"
          description="Veuillez remplir tous les champs du formulaire avant de soumettre."
        />
      </>
    )
  }

  // Vue 4 : Workout terminé
  if (workoutStatus === "completed") {
    return (
      <>
        <div className="relative min-h-screen bg-background">
          {/* Header sticky */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pt-4 pb-3 px-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Séance terminée</h1>
              <Badge className="bg-green-100 text-green-800">Complété</Badge>
            </div>
          </div>

          {/* Contenu principal - cartes */}
          <div className="px-4">
            <WorkoutCardList
              sets={currentSets}
              workoutTitle={currentWorkout?.title}
            />
          </div>
        </div>

        <AlertModal
          {...alertModal}
          title="Erreur"
          description="Veuillez remplir tous les champs du formulaire avant de soumettre."
        />
      </>
    )
  }

  return null
}
