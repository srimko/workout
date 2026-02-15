import { Pen, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SetWithExercise, SetWithExerciseInfo } from "@/lib/types"

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
  const label = isSerie ? (set as Serie).title : `${index + 1}`

  return (
    <>
      <div
        className="flex items-center gap-3 text-sm rounded px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
        role="button"
        tabIndex={0}
        onClick={() => onSetClick?.(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSetClick?.(id)
          }
        }}
      >
        <span className="text-muted-foreground/60 text-xs w-5 shrink-0">{label}</span>
        <span className="font-semibold">
          {set.weight}kg × {reps}
        </span>
        {onSetClick && (
          <Pen className="size-3.5 text-muted-foreground/40 ml-auto shrink-0" />
        )}
      </div>
      {onEdit === id && (onEditSet || onDeleteSet) && (
        <div className="my-1.5 flex justify-between gap-2 ml-auto">
          {onEditSet && (
            <Button variant="default" className="flex-1 flex gap-2 h-12" onClick={() => onEditSet(set)}>
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          )}

          {onDeleteSet && (
            <Button
              variant="outline"
              className="flex-1 flex gap-2 h-12 text-destructive"
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
