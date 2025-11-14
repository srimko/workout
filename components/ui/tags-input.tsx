"use client"

import { X } from "lucide-react"
import { type KeyboardEvent, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Ajouter un tag...",
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
    // Remove last tag on Backspace if input is empty
    else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Input for new tags */}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="text-base" // Prevent iOS zoom
      />

      {/* Display existing tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-sm pl-3 pr-1 py-1.5 gap-1.5">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="rounded-full p-1 hover:bg-background/50 transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center -mr-1"
                aria-label={`Supprimer ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
