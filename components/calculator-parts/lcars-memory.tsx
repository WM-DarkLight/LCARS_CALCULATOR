"use client"

import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

interface LcarsMemoryProps {
  memory: number
  klingonMode?: boolean
}

export default function LcarsMemory({ memory, klingonMode = false }: LcarsMemoryProps) {
  const { state } = useCalculatorContext()

  return (
    <div className="flex flex-col px-4 py-2 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-between items-center">
        <div className="text-yellow-400 text-sm">
          <KlingonText enabled={klingonMode}>MEMORY</KlingonText>
        </div>
        <div className="text-orange-500 font-mono">{state.memory}</div>
      </div>

      {state.lastMemoryAction && (
        <div className="flex justify-between items-center mt-1 text-xs">
          <div className="text-gray-400">
            <KlingonText enabled={klingonMode}>LAST ACTION</KlingonText>
          </div>
          <div className="text-blue-400 font-mono">{state.lastMemoryAction}</div>
        </div>
      )}
    </div>
  )
}
