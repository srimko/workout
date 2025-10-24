import React, { useCallback } from "react"

const MAX_SERIES = 4

interface SerieSelectorProps {
  serie: string
  onSerieChange: (serie: string) => void
}

export const SerieSelector = React.memo(({ serie, onSerieChange }: SerieSelectorProps) => {
  const handleClick = useCallback(
    (serie: number) => {
      onSerieChange(serie.toString())
    },
    [onSerieChange],
  )

  return (
    <ul className="flex justify-center items-center gap-3">
      {[...Array(MAX_SERIES).keys()].map((index) => (
        <li
          key={index}
          onClick={() => handleClick(index + 1)}
          className={`cursor-pointer p-2 transition-colors ${
            serie === (index + 1).toString()
              ? "bg-blue-600 text-white rounded-2xl"
              : "hover:bg-gray-100 rounded-2xl"
          }`}
        >
          Série {index + 1}
        </li>
      ))}
    </ul>
  )
})

SerieSelector.displayName = "SerieSelector"
