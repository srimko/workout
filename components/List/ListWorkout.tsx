'use client';

import { memo } from "react"
import { Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useWhyDidYouUpdate } from '@/lib/hooks/useWhyDidYouUpdate';

interface ListWorkoutProps {
    workouts: Workout[];
    onSelectWorkout: (workoutId: number) => void;
}

export const ListWorkout = memo(function ListWorout({ workouts, onSelectWorkout }:ListWorkoutProps ) {
    useWhyDidYouUpdate('ListWorkout', { workouts, onSelectWorkout });
    return (
        <>
            {(workouts && workouts.length > 0) && (
                <div className="flex flex-col justify-center py-2 max-w-2xl m-auto">
                    <h2 className="text-2xl font-bold mb-4">Workouts  :</h2>
                    <ul>
                        {workouts.map((workout) => (
                        <li key={workout.id} className="flex justify-between mb-2">
                            <strong>{workout.title}</strong> - Commencé à : {new Date(workout.started_at).toLocaleString()} 
                            <Button variant="link" onClick={() => {onSelectWorkout(workout.id)}}>Voir plus</Button>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
})

ListWorkout.displayName = 'ListWorkout'