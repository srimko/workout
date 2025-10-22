import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SerieDisplayProps {
    serie: string
}

export const SerieDisplay = React.memo(({ serie }:SerieDisplayProps) => {
    return (
        <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="serie">Série</Label>
            <Input type="number" name="serie" min="1" value={serie} disabled />
        </div>
    )
})

SerieDisplay.displayName = 'SerieDisplay'