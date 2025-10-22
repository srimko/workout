import React from "react";
import { useCallback } from 'react'

const MAX_REPS = 15

interface RepSelectorProps {
    rep: string;
    onRepChange: (rep: string) => void;
}

export const RepSelector = React.memo(({ rep, onRepChange }:RepSelectorProps) => {

    const handleClick = useCallback((rep: number) => {
        onRepChange(rep.toString())
    }, [onRepChange])

    return (
        <ul className="grid grid-flow-col grid-rows-3 gap-4">
            {[...Array(MAX_REPS).keys()].map((index) => (
                <li 
                    key={ index }
                    onClick={() => handleClick(index + 1)}
                    className={`cursor-pointer p-2 transition-colors text-center ${
                          rep === (index + 1).toString()
                              ? 'bg-blue-600 text-white rounded-2xl'
                              : 'hover:bg-gray-100 rounded-2xl'
                      }`}
                >Rep { index + 1 }</li>                
            ))}
        </ul>
    )
})

RepSelector.displayName = 'RepSelector'