"use client"

import { motion } from "framer-motion"
import type { CalculatorMode } from "@/lib/calculator-types"
import { useLcarsTheme } from "@/components/lcars-theme-provider"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"
import { useCalculatorContext } from "@/hooks/use-calculator-context"

interface LcarsDisplayProps {
  display: string
  equation: string
  mode: CalculatorMode
  memory: number
  angleUnit?: "deg" | "rad"
  base?: "hex" | "dec" | "oct" | "bin"
  klingonMode?: boolean
}

export default function LcarsDisplay({
  display,
  equation,
  mode,
  memory,
  angleUnit = "deg",
  base = "dec",
  klingonMode = false,
}: LcarsDisplayProps) {
  const { colors } = useLcarsTheme()
  const { state } = useCalculatorContext()

  return (
    <div className="p-4 bg-black">
      <div className="flex justify-between items-center mb-2">
        <div className={`h-4 w-16 ${colors.primary} rounded-full`}></div>
        <div className={`h-4 w-24 ${colors.secondary} rounded-full`}></div>
        <div className={`h-4 w-12 ${colors.accent} rounded-full`}></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-right p-4 rounded-lg mb-2 border border-gray-800"
      >
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div className={`text-xs ${colors.text}`}>
              <KlingonText enabled={klingonMode}>{mode.toUpperCase()}</KlingonText>
            </div>
            {(mode === "scientific" || mode === "programmer") && (
              <div className="text-blue-400 text-xs">
                {mode === "scientific" ? angleUnit.toUpperCase() : base.toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-yellow-400 text-sm h-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {state.fullExpression}
          </div>
        </div>
        <div className="text-orange-500 text-3xl font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
          {display}
        </div>

        {state.parenthesesCount > 0 && (
          <div className="mt-1 text-xs text-pink-400 text-left">
            <KlingonText enabled={klingonMode}>Open parentheses: {state.parenthesesCount}</KlingonText>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between items-center">
        <div className={`h-4 w-24 ${colors.secondary} rounded-full`}></div>
        <div className={`h-4 w-16 ${colors.primary} rounded-full`}></div>
        <div className={`h-4 w-20 ${colors.highlight} rounded-full`}></div>
      </div>
    </div>
  )
}
