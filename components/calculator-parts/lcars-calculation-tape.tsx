"use client"

import { motion } from "framer-motion"
import { Trash2, Download, Copy } from "lucide-react"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"
import { useState } from "react"
import { CalculatorButton } from "@/components/ui/calculator-button"

interface LcarsCalculationTapeProps {
  klingonMode?: boolean
  onClose: () => void
}

export default function LcarsCalculationTape({ klingonMode = false, onClose }: LcarsCalculationTapeProps) {
  const { state, dispatch } = useCalculatorContext()
  const [copied, setCopied] = useState(false)

  const handleClearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" })
  }

  const handleCopyToClipboard = () => {
    const historyText = state.history.join("\n")
    navigator.clipboard.writeText(historyText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownload = () => {
    const historyText = state.history.join("\n")
    const blob = new Blob([historyText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lcars_calculator_history.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-900 border-t border-gray-800"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-yellow-400 text-sm">
            <KlingonText enabled={klingonMode}>CALCULATION TAPE</KlingonText>
          </div>
          <div className="flex gap-2">
            <CalculatorButton
              onClick={handleCopyToClipboard}
              variant="blue"
              className="text-xs px-2 py-1"
              title="Copy to clipboard"
            >
              {copied ? "Copied!" : <Copy size={14} />}
            </CalculatorButton>
            <CalculatorButton
              onClick={handleDownload}
              variant="blue"
              className="text-xs px-2 py-1"
              title="Download history"
            >
              <Download size={14} />
            </CalculatorButton>
            <CalculatorButton
              onClick={handleClearHistory}
              variant="pink"
              className="text-xs px-2 py-1"
              title="Clear history"
            >
              <Trash2 size={14} />
            </CalculatorButton>
            <CalculatorButton onClick={onClose} variant="orange" className="text-xs px-2 py-1">
              <KlingonText enabled={klingonMode}>CLOSE</KlingonText>
            </CalculatorButton>
          </div>
        </div>

        <div className="bg-black p-4 rounded-lg border border-gray-800 font-mono text-sm max-h-80 overflow-y-auto">
          {state.history.length === 0 ? (
            <div className="text-gray-500 text-center">
              <KlingonText enabled={klingonMode}>No calculations yet</KlingonText>
            </div>
          ) : (
            <div className="space-y-2">
              {state.history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleRecallCalculation(item)}
                  className="text-orange-500 p-2 rounded hover:bg-gray-900 cursor-pointer flex justify-between"
                >
                  <span>{index + 1}.</span>
                  <span className="flex-grow px-4">{item}</span>
                  <span className="text-blue-400">{new Date().toLocaleTimeString()}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-gray-500 text-xs">
          <KlingonText enabled={klingonMode}>
            Click on any calculation to recall the result. All calculations are stored in memory.
          </KlingonText>
        </div>
      </div>
    </motion.div>
  )
}
