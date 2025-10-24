import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react"

const MIN_WEIGHT = 0
const MAX_WEIGHT = 250
const STEP = 1.25

interface DrawerWeightProsp {
    weight: number;
    onWeightChange: (weight: number) => void;
}

export function DrawerWeight({ weight, onWeightChange }:DrawerWeightProsp) {
    function onClick(adjustment: number) {
        onWeightChange(weight + adjustment)
    }

    return (
        <div className="p-4 pb-0 mb-10">
            <div className="flex items-center justify-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(-STEP)}
                    disabled={weight <= MIN_WEIGHT}
                >
                <Minus />
                <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                    { weight }
                </div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                    Poids (Kg)
                </div>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(STEP)}
                    disabled={weight >= MAX_WEIGHT}
                >
                <Plus />
                <span className="sr-only">Increase</span>
                </Button>
            </div>
        </div>
    )
}