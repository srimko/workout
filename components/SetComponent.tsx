import { Pen, Pencil, Trash } from "lucide-react"
import type { SetWithExerciseInfo } from "@/components/Cards/WorkoutCard"
import { Button } from "@/components/ui/button"
import type { SetWithExercise } from "@/lib/types"

// Type pour les séries en création (DrawerAddSerie)
interface Serie {
  title: string
  weight: number
  rep: number
}

// Props pour le composant générique
interface SetComponentProps<
  T extends SetWithExerciseInfo | Serie | SetWithExercise = SetWithExerciseInfo,
> {
  onSetClick?: (id: string) => void
  set: T
  index: number
  onEditSet?: (set: T) => void
  onDeleteSet?: (set: T) => void
  onEdit?: string | null
}

export function SetComponent<T extends SetWithExerciseInfo | Serie | SetWithExercise>({
  onSetClick,
  set,
  index,
  onEditSet,
  onDeleteSet,
  onEdit,
}: SetComponentProps<T>) {
  // Déterminer le type de set
  const isSetWithExercise = "exercise" in set // SetWithExercise
  const isSetWithExerciseInfo = "id" in set && "repetition" in set && !isSetWithExercise
  const isSerie = "rep" in set

  const id =
    isSetWithExercise || isSetWithExerciseInfo
      ? (set as SetWithExercise | SetWithExerciseInfo).id
      : (set as Serie).title
  const reps = isSerie
    ? (set as Serie).rep
    : (set as SetWithExercise | SetWithExerciseInfo).repetition
  const label = isSerie ? (set as Serie).title : `Série ${index + 1}`

  return (
    <>
      <div
        className="flex items-center justify-between text-sm bg-background rounded px-3 py-2 mb-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onSetClick?.(id)}
      >
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="flex items-center gap-4 font-semibold">
          {set.weight}kg × {reps} reps
          {onSetClick && <Pen className="size-3" />}
        </span>
      </div>
      {onEdit === id && (onEditSet || onDeleteSet) && (
        <div className="my-4 flex justify-between gap-2 ml-auto">
          {onEditSet && (
            <Button variant="outline" className="flex-1 flex gap-2" onClick={() => onEditSet(set)}>
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          )}

          {onDeleteSet && (
            <Button
              variant="destructive"
              className="flex-1 flex gap-2"
              onClick={() => onDeleteSet(set)}
            >
              <Trash className="h-4 w-4" /> Supprimer
            </Button>
          )}
        </div>
      )}
    </>
  )
}
