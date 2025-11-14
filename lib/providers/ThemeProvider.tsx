"use client"

import { createContext, type ReactNode, useContext, useEffect, useState } from "react"

export type ThemeName = "default" | "neoBrutalism" | "amberMinimal"
export type ColorMode = "light" | "dark"

interface ThemeOption {
  name: ThemeName
  label: string
  description: string
}

interface ColorModeOption {
  mode: ColorMode
  label: string
  description: string
}

interface ThemeContextType {
  currentTheme: ThemeName
  colorMode: ColorMode
  themes: ThemeOption[]
  colorModes: ColorModeOption[]
  changeTheme: (theme: ThemeName) => void
  changeColorMode: (mode: ColorMode) => void
  isLoading: boolean
}

export const themes: ThemeOption[] = [
  {
    name: "default",
    label: "Par défaut",
    description: "Thème classique avec des couleurs neutres",
  },
  {
    name: "neoBrutalism",
    label: "Neo Brutalism",
    description: "Design brutal avec des bordures noires et sans radius",
  },
  {
    name: "amberMinimal",
    label: "Amber Minimal",
    description: "Thème minimaliste aux tons ambrés et chaleureux",
  },
]

export const colorModes: ColorModeOption[] = [
  {
    mode: "light",
    label: "Clair",
    description: "Mode lumineux pour une utilisation de jour",
  },
  {
    mode: "dark",
    label: "Sombre",
    description: "Mode sombre pour une utilisation de nuit",
  },
]

const THEME_STORAGE_KEY = "app-theme"
const COLOR_MODE_STORAGE_KEY = "app-color-mode"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default")
  const [colorMode, setColorMode] = useState<ColorMode>("light")
  const [isLoading, setIsLoading] = useState(true)

  // Charger le thème et le mode couleur au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
    const savedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode | null

    if (savedTheme && themes.some((t) => t.name === savedTheme)) {
      setCurrentTheme(savedTheme)
      loadTheme(savedTheme)
    } else {
      // Charger le thème par défaut au premier chargement
      loadTheme("default")
    }

    if (savedColorMode && colorModes.some((m) => m.mode === savedColorMode)) {
      setColorMode(savedColorMode)
      applyColorMode(savedColorMode)
    }

    setIsLoading(false)
  }, [])

  const loadTheme = (themeName: ThemeName) => {
    // Retirer l'ancien link de thème s'il existe
    const existingLink = document.querySelector("link[data-theme]")
    if (existingLink) {
      existingLink.remove()
    }

    // Créer un nouveau link pour le thème
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `/theme/${themeName}.css`
    link.setAttribute("data-theme", themeName)

    // Ajouter le link au head
    document.head.appendChild(link)
  }

  const applyColorMode = (mode: ColorMode) => {
    const html = document.documentElement
    if (mode === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }

  const changeTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName)
    localStorage.setItem(THEME_STORAGE_KEY, themeName)
    loadTheme(themeName)
  }

  const changeColorMode = (mode: ColorMode) => {
    setColorMode(mode)
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
    applyColorMode(mode)
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        colorMode,
        themes,
        colorModes,
        changeTheme,
        changeColorMode,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
