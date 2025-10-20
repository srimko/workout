'use client';

import { Set } from '@/lib/types'
import { Badge } from "@/components/ui/badge";

interface TableWorkoutStatsProps {
    sets: Set[];
}

export function TableWorkoutStats({ sets }:TableWorkoutStatsProps) {
    const totalWeight = sets?.reduce((acc, curr) => {
    return acc + (curr.weight * curr.repetition)
    }, 0) 
    const totalReps = sets?.reduce((acc, curr) => {
    return acc + curr.repetition
    }, 0) 

    return (
        <div className="flex justify-end gap-2">
            <Badge>{totalWeight} Kg</Badge>
            <Badge>{totalReps} répétitions</Badge>
        </div>
    )
}