"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Mic, Maximize2, History } from "lucide-react"
import type { CalculatorMode } from "@/lib/calculator-types"
import { useLcarsTheme } from "@/components/lcars-theme-provider"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

interface LcarsModeProps {
  currentMode: CalculatorMode
  onModeChange: (mode: CalculatorMode) => void
  showHistory: boolean
  onToggleHistory: () => void
  onToggleVoice: () => void
  onToggleFullscreen: () => void
  klingonMode?: boolean
}

export default function LcarsModeSelector({
  currentMode,
  onModeChange,
  showHistory,
  onToggleHistory,
  onToggleVoice,
  onToggleFullscreen,
  klingonMode = false,
}: LcarsModeProps) {
  const { colors } = useLcarsTheme()
  const { dispatch } = useCalculatorContext()

  const handleAngleUnitToggle = () => {
    dispatch({ type: "TOGGLE_ANGLE_UNIT" })
  }

  const modes: { id: CalculatorMode; label: string }[] = [
    { id: "standard", label: "STD" },
    { id: "scientific", label: "SCI" },
    { id: "programmer", label: "PROG" },
    { id: "converter", label: "CONV" },
    { id: "graphing", label: "GRAPH" },
    { id: "matrix", label: "MATRIX" },
    { id: "statistics", label: "STATS" },
    { id: "astronomy", label: "ASTRO" },
    { id: "trek", label: "TREK" },
    { id: "financial", label: "FIN" },
  ]

  return (
    <div className="px-4 py-2 bg-gray-900">
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-wrap gap-2 mb-2">
          {modes.map((mode) => (
            <ModeButton key={mode.id} isActive={currentMode === mode.id} onClick={() => onModeChange(mode.id)}>
              <KlingonText enabled={klingonMode}>{mode.label}</KlingonText>
            </ModeButton>
          ))}
        </div>

        <div className="flex space-x-2">
          {currentMode === "scientific" && (
            <ModeButton onClick={handleAngleUnitToggle} variant="blue">
              <KlingonText enabled={klingonMode}>DEG/RAD</KlingonText>
            </ModeButton>
          )}
          <ModeButton onClick={onToggleVoice} variant="pink">
            <Mic size={14} />
          </ModeButton>
          <ModeButton onClick={onToggleHistory} variant="yellow">
            <History size={14} />
          </ModeButton>
          <ModeButton onClick={onToggleFullscreen} variant="orange">
            <Maximize2 size={14} />
          </ModeButton>
        </div>
      </div>
    </div>
  )
}

interface ModeButtonProps {
  children: React.ReactNode
  isActive?: boolean
  onClick: () => void
  variant?: "default" | "orange" | "yellow" | "pink" | "blue"
}

function ModeButton({ children, isActive = false, onClick, variant = "default" }: ModeButtonProps) {
  const { colors } = useLcarsTheme()

  const getButtonStyle = () => {
    if (isActive) return `${colors.primary} text-black`

    switch (variant) {
      case "orange":
        return `bg-orange-500 text-black hover:bg-orange-400`
      case "yellow":
        return `bg-yellow-400 text-black hover:bg-yellow-300`
      case "pink":
        return `bg-pink-500 text-black hover:bg-pink-400`
      case "blue":
        return `bg-blue-400 text-black hover:bg-blue-300`
      default:
        return `text-yellow-400 bg-gray-800 hover:bg-gray-700`
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`text-sm px-3 py-1 rounded-full transition-colors ${getButtonStyle()}`}
    >
      {children}
    </motion.button>
  )
}
