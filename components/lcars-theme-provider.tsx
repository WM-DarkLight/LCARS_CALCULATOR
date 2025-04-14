"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type LcarsTheme = "standard" | "alternate" | "tactical" | "medical"

interface LcarsThemeContextType {
  theme: LcarsTheme
  setTheme: (theme: LcarsTheme) => void
  colors: {
    primary: string
    secondary: string
    accent: string
    highlight: string
    background: string
    text: string
  }
}

const themeColors = {
  standard: {
    primary: "bg-orange-500",
    secondary: "bg-yellow-400",
    accent: "bg-pink-500",
    highlight: "bg-blue-400",
    background: "bg-black",
    text: "text-orange-500",
  },
  alternate: {
    primary: "bg-blue-500",
    secondary: "bg-cyan-400",
    accent: "bg-purple-500",
    highlight: "bg-green-400",
    background: "bg-gray-900",
    text: "text-blue-500",
  },
  tactical: {
    primary: "bg-red-500",
    secondary: "bg-amber-400",
    accent: "bg-rose-500",
    highlight: "bg-yellow-400",
    background: "bg-gray-950",
    text: "text-red-500",
  },
  medical: {
    primary: "bg-teal-500",
    secondary: "bg-green-400",
    accent: "bg-cyan-500",
    highlight: "bg-emerald-400",
    background: "bg-gray-900",
    text: "text-teal-500",
  },
}

const LcarsThemeContext = createContext<LcarsThemeContextType>({
  theme: "standard",
  setTheme: () => {},
  colors: themeColors.standard,
})

export function LcarsThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<LcarsTheme>("standard")

  return (
    <LcarsThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors: themeColors[theme],
      }}
    >
      {children}
    </LcarsThemeContext.Provider>
  )
}

export function useLcarsTheme() {
  return useContext(LcarsThemeContext)
}
