import React, { useState } from "react"

interface WeightSelectorProps {
  weight: string
  onWeightChange: (weight: string) => void
}

export const WeightSelector = React.memo(({ weight, onWeightChange }: WeightSelectorProps) => {
  console.log("🔄 WeightSelector render")
  const MIN_WEIGHT = 2.5
  const MAX_WEIGHT = 250
  const [weightStep, setWeightStep] = useState(5)
  const weights = [1.25, 2.5, 5, 10, 20]

  const handleClick = (symbol: string) => {
    const currentWeight = parseFloat(weight) || 30
    let newWeight = 0
    if (symbol === "minus") {
      newWeight = Math.max(MIN_WEIGHT, currentWeight - weightStep)
    } else {
      newWeight = Math.min(MAX_WEIGHT, currentWeight + weightStep)
    }

    onWeightChange(newWeight.toString())
  }

  return (
    <div>
      <div className="flex gap-4 justify-center m-2">
        <span
          className="flex justify-center items-center px-8 text-2xl border rounded-full cursor-pointer hover:bg-gray-100"
          onClick={() => handleClick("minus")}
        >
          -
        </span>
        <div className="p-6 border rounded-lg bg-gray-300 text-black font-bold text-2xl">
          {weight}
        </div>
        <span
          className="flex justify-center items-center px-8 text-2xl border rounded-full cursor-pointer hover:bg-gray-100"
          onClick={() => handleClick("plus")}
        >
          +
        </span>
      </div>
      <ul className="grid grid-cols-3 gap-3">
        {weights.map((weight, index) => (
          <li
            key={index}
            className={`text-sm text-white text-center p-2 rounded-2xl cursor-pointer transition-colors ${weightStep === weight ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-600"}`}
            onClick={() => setWeightStep(weight)}
          >
            {weight} Kg
          </li>
        ))}
      </ul>
    </div>
  )
})
