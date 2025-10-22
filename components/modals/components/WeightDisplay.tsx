import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightDisplayProps {
    weight: string
}

export const WeightDisplay = React.memo(({ weight }:WeightDisplayProps) => {
    return (
        <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input type="number" name="weight" value={weight} disabled />
        </div>
    )
})

WeightDisplay.displayName = 'WeightDisplay'