"use client"

import { Dumbbell, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { WorkoutCardList } from "@/components/Cards/WorkoutCardList"
import { DrawerExercise } from "@/components/Drawers/components/DrawerExercise"
import { ConfirmModal } from "@/components/modals/ConfirmModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { getSetsByWorkoutWithExercises } from "@/lib/actions/sets"
import {
  autoCloseOldWorkouts,
  getPrevWorkoutWithSets,
  getTodayWorkout,
} from "@/lib/actions/workouts"
import { useModal } from "@/lib/hooks/useModal"
import { useDeleteSet, useFetchSetsWithExercises } from "@/lib/hooks/useSets"
import type { Profile, SetWithExerciseInfo, Workout, WorkoutWithSets } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

type WorkoutStatus = "none" | "created" | "in_progress" | "completed"

export default function HomePage() {
  const supabase = createClient()
  const confirmDeleteModal = useModal()
  const { fetchSets } = useFetchSetsWithExercises()
  const { deleteSet } = useDeleteSet()

  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>("none")
  const [currentSets, setCurrentSets] = useState<SetWithExerciseInfo[] | undefined>()
  const [, setLastWorkout] = useState<WorkoutWithSets | undefined>()
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [editingSet, setEditingSet] = useState<SetWithExerciseInfo | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState<SetWithExerciseInfo | null>(null)

  // Charger automatiquement le workout du jour au démarrage
  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only once on mount
  useEffect(() => {
    async function initializeTodayWorkout() {
      try {
        // Auto-clôture des vieux workouts (UNE fois par jour avec localStorage guard)
        const lastAutoClose = localStorage.getItem("lastAutoCloseDate")
        const today = new Date().toISOString().split("T")[0]

        if (lastAutoClose !== today) {
          const closedCount = await autoCloseOldWorkouts()
          if (closedCount > 0) {
            toast.success(`${closedCount} séance(s) terminée(s) automatiquement`)
          }
          localStorage.setItem("lastAutoCloseDate", today)
        }

        // Récupérer l'utilisateur connecté
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          toast.error("Aucun utilisateur connecté")
          return
        }

        // Récupérer le profil de l'utilisateur
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", user.id)
          .single()

        if (!profile) {
          toast.error("Profil non trouvé")
          return
        }

        setCurrentProfile(profile)

        // Récupérer le workout du jour (requête optimisée)
        const workout = await getTodayWorkout()
        const lastWorkout = await getPrevWorkoutWithSets()
        if (lastWorkout) setLastWorkout(lastWorkout)

        if (!workout) {
          // Aucun workout du jour
          setWorkoutStatus("none")
          return
        }

        setCurrentWorkout(workout)

        // Charger les sets avec exercices (fonction existante optimisée)
        const sets = await getSetsByWorkoutWithExercises(workout.id)

        // Déterminer le statut
        if (workout.ended_at !== null) {
          setWorkoutStatus("completed")
        } else if (sets && sets.length > 0) {
          setWorkoutStatus("in_progress")
        } else {
          setWorkoutStatus("created")
        }

        await refreshWorkoutSets(workout.id)
      } catch (error) {
        toast.error("Erreur lors du chargement de la séance")
      }
    }

    initializeTodayWorkout()
  }, [])

  // Fonction pour rafraîchir les sets d'un workout avec les infos d'exercice
  const refreshWorkoutSets = useCallback(
    async (workoutId: string) => {
      try {
        const setsWithExerciseInfo = await fetchSets(workoutId)

        if (setsWithExerciseInfo) {
          setCurrentSets(setsWithExerciseInfo)
          return setsWithExerciseInfo
        }
        return []
      } catch (error) {
        toast.error("Erreur lors du rafraîchissement des séries")
        return []
      }
    },
    [fetchSets],
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
      toast.error("Erreur lors de la création de la séance")
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
      toast.error("Erreur lors de la clôture de la séance")
    }
  }, [currentWorkout, supabase])

  // Fonction pour reprendre un workout terminé
  const resumeWorkoutFn = useCallback(async () => {
    if (!currentWorkout) return

    try {
      const { error } = await supabase
        .from("workouts")
        .update({ ended_at: null })
        .eq("id", currentWorkout.id)

      if (error) throw error

      setWorkoutStatus("in_progress")
      setCurrentWorkout({ ...currentWorkout, ended_at: null })

      // Show success toast
      toast.success("Séance reprise !", {
        description: "Vous pouvez continuer votre séance",
        duration: 1000,
      })
    } catch (error) {
      toast.error("Erreur lors de la reprise de la séance")
      toast.error("Erreur", {
        description: "Impossible de reprendre la séance",
        duration: 1000,
      })
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
  const handleEditSet = useCallback((set: SetWithExerciseInfo) => {
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

  // Fonction pour ouvrir le modal de confirmation de suppression
  const handleDeleteSet = useCallback(
    (set: SetWithExerciseInfo) => {
      setSetToDelete(set)
      confirmDeleteModal.open()
    },
    [confirmDeleteModal],
  )

  // Fonction pour confirmer la suppression d'un set
  const confirmDeleteSet = useCallback(async () => {
    if (!setToDelete) return

    try {
      const success = await deleteSet(setToDelete.id)

      if (success) {
        toast.success("Série supprimée !", {
          description: `${setToDelete.exercise_name} - ${setToDelete.weight}kg × ${setToDelete.repetition}`,
          duration: 2000,
        })

        // Rafraîchir les sets
        if (currentWorkout) {
          await refreshWorkoutSets(currentWorkout.id)
        }
      } else {
        toast.error("Erreur", {
          description: "Impossible de supprimer la série",
          duration: 2000,
        })
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
        duration: 2000,
      })
    } finally {
      setSetToDelete(null)
    }
  }, [setToDelete, deleteSet, currentWorkout, refreshWorkoutSets])

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
            <Button onClick={startWorkout}>Commencer la séance</Button>
          </EmptyContent>
        </Empty>


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
            <Button onClick={() => setDrawerOpen(true)}>Ajouter un exercice</Button>
          </EmptyContent>
        </Empty>

        <div className="fixed bottom-20 right-4 z-50">
          <DrawerExercise
            onSetCreated={handleSetCreated}
            editMode={!!editingSet}
            setToEdit={editingSet || undefined}
            onSetUpdated={handleSetUpdated}
            open={drawerOpen}
            onOpenChange={handleDrawerOpenChange}
          />
        </div>

        <div className="flex gap-4 fixed bottom-1/12 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
          <Button variant="destructive" className="basis-1/5 h-12 text-base" onClick={endWorkout}>
            <X />
          </Button>
          <Button className="flex-1 h-12 text-base" onClick={() => setDrawerOpen(true)}>
            Ajouter un exercice
          </Button>
        </div>


        <ConfirmModal
          {...confirmDeleteModal}
          title="Supprimer cette série ?"
          description={
            setToDelete
              ? `${setToDelete.exercise_name}\n${setToDelete.weight}kg × ${setToDelete.repetition} reps`
              : ""
          }
          onConfirm={confirmDeleteSet}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
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

          {/* Contenu principal */}
          <div className="">
            <WorkoutCardList
              sets={currentSets}
              onEditSet={handleEditSet}
              onDeleteSet={handleDeleteSet}
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
            />
          </div>

          {/* Bottom bar - Terminer workout */}
        </div>
        <div className="flex gap-4 fixed bottom-1/12 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
          <Button variant="destructive" className="basis-1/5 h-12 text-base" onClick={endWorkout}>
            <X />
          </Button>
          <Button className="flex-1 h-12 text-base" onClick={() => setDrawerOpen(true)}>
            Ajouter un exercice
          </Button>
        </div>


        <ConfirmModal
          {...confirmDeleteModal}
          title="Supprimer cette série ?"
          description={
            setToDelete
              ? `${setToDelete.exercise_name}\n${setToDelete.weight}kg × ${setToDelete.repetition} reps`
              : ""
          }
          onConfirm={confirmDeleteSet}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
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
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold">Séance terminée</h1>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Complété</Badge>
            </div>
          </div>

          {/* Contenu principal - cartes */}
          <div className="">
            <WorkoutCardList
              sets={currentSets}
              onDeleteSet={handleDeleteSet}
              workoutTitle={currentWorkout?.title}
            />
          </div>

          {/* Bottom bar - Reprendre workout */}
        </div>
        <div className="fixed bottom-1/12 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
          <Button variant="default" className="w-full h-12 text-base" onClick={resumeWorkoutFn}>
            Reprendre la séance
          </Button>
        </div>


        <ConfirmModal
          {...confirmDeleteModal}
          title="Supprimer cette série ?"
          description={
            setToDelete
              ? `${setToDelete.exercise_name}\n${setToDelete.weight}kg × ${setToDelete.repetition} reps`
              : ""
          }
          onConfirm={confirmDeleteSet}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
        />
      </>
    )
  }

  return null
}
