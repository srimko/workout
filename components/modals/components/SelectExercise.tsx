import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Exercise } from '@/lib/types';

interface SelectExerciseProps {
    exercises: Exercise[];
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
                <SelectValue placeholder="Select an exercice" />
            </SelectTrigger>
            <SelectContent>
                { exercises.map(exercise => (
                    <SelectItem key={ exercise.id.toString() } value={ exercise.id.toString() }>
                        { exercise.name } - { exercise.machine }
                    </SelectItem>
                )) }
            </SelectContent>
        </Select>
    )
})

SelectExercise.displayName = 'SelectExercise'