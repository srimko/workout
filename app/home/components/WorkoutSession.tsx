"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { FooterAction } from "@/app/home/components/FooterAction"
import { TodayWorkoutDetails } from "@/app/home/components/TodayWorkoutDetails"
import { DrawerExercise } from "@/components/Drawers/components/DrawerExercise"
import { ConfirmModal } from "@/components/modals/ConfirmModal"
import { useModal } from "@/lib/hooks/useModal"
import { useDeleteSet } from "@/lib/hooks/useSets"
import type { SetWithExercise, WorkoutWithSets } from "@/lib/types"

export function WorkoutSession({ todayWorkout }: { todayWorkout: WorkoutWithSets }) {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState<SetWithExercise | null>(null)

  const confirmDeleteModal = useModal()
  const { deleteSet } = useDeleteSet()

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const handleEditSet = useCallback((set: SetWithExercise) => {
    // TODO: Implémenter l'édition avec DrawerExercise
    console.log("Édition du set:", set)
    toast.info("Fonctionnalité d'édition à venir")
  }, [])

  const handleDeleteSet = useCallback(
    (set: SetWithExercise) => {
      setSetToDelete(set)
      confirmDeleteModal.open()
    },
    [confirmDeleteModal],
  )

  const confirmDeleteSet = useCallback(async () => {
    if (!setToDelete) return

    const success = await deleteSet(setToDelete.id)
    if (success) {
      toast.success("Série supprimée !", {
        description: `${setToDelete.exercise.title} - ${setToDelete.weight}kg × ${setToDelete.repetition} reps`,
        duration: 2000,
      })
      // Rafraîchir les données du serveur sans recharger la page
      router.refresh()
    } else {
      toast.error("Erreur lors de la suppression")
    }
    setSetToDelete(null)
  }, [setToDelete, deleteSet, router])
  return (
    <>
      <TodayWorkoutDetails
        todayWorkout={todayWorkout}
        onEditSet={handleEditSet}
        onDeleteSet={handleDeleteSet}
      />
      {drawerOpen && <DrawerExercise drawerOpen={drawerOpen} onDrawerClose={closeDrawer} />}
      <FooterAction
        footerType="in_progress"
        onDrawerOpen={openDrawer}
        workoutId={todayWorkout.id}
      />
      <ConfirmModal
        {...confirmDeleteModal}
        title="Supprimer cette série ?"
        description={
          setToDelete
            ? `${setToDelete.exercise.title}\n${setToDelete.weight}kg × 
  ${setToDelete.repetition} reps`
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
