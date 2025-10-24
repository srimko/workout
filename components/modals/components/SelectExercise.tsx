import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Exercise, ExerciseWithCategory } from '@/lib/types';

interface SelectExerciseProps {
    exercises: Exercise[] | ExerciseWithCategory[];
    exerciseId: string;
    onExerciseChange: (exerciseId: string) => void;
}

export const SelectExercise = React.memo(({ exercises, exerciseId, onExerciseChange }:SelectExerciseProps) => {
    return (
        <Select
            name="exercice"
            value={exerciseId}
            onValueChange={ onExerciseChange }
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un exercice" />
            </SelectTrigger>
            <SelectContent>
                { exercises.map(exercise => {
                    // Check if exercise has category property (ExerciseWithCategory)
                    const hasCategory = 'category' in exercise;
                    const label = hasCategory
                        ? `${exercise.title} (${exercise.category.name})`
                        : exercise.title;

                    return (
                        <SelectItem key={ exercise.id.toString() } value={ exercise.id.toString() }>
                            { label }
                        </SelectItem>
                    );
                }) }
            </SelectContent>
        </Select>
    )
})

SelectExercise.displayName = 'SelectExercise'