"use client"

import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"
import { translateToKlingon } from "@/lib/klingon-translator"

interface LcarsHistoryProps {
  history: string[]
  klingonMode?: boolean
}

export default function LcarsHistory({ history, klingonMode = false }: LcarsHistoryProps) {
  const { dispatch } = useCalculatorContext()

  const handleClearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" })
  }

  const handleRecallCalculation = (calculation: string) => {
    // Extract the result part after the equals sign
    const result = calculation.split("=")[1]?.trim()
    if (result) {
      dispatch({ type: "SET_DISPLAY", payload: result })
    }
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 p-4 max-h-60 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-yellow-400 text-sm">
          <KlingonText enabled={klingonMode}>CALCULATION LOG</KlingonText>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClearHistory}
          className="text-orange-500 hover:text-orange-400"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      {history.length === 0 ? (
        <div className="text-gray-500 text-sm">
          <KlingonText enabled={klingonMode}>No calculations yet</KlingonText>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleRecallCalculation(item)}
              className="text-orange-500 text-sm font-mono p-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              {klingonMode ? translateToKlingon(item) : item}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
