import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RepDisplayProps {
    rep: string
}

export const RepDisplay = React.memo(({ rep }:RepDisplayProps) => {
    return (
        <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="rep">Répétition</Label>
            <Input type="number" name="rep" value={rep} disabled />
        </div>
    )
})

RepDisplay.displayName = 'RepDisplay'