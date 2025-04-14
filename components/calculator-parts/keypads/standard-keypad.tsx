"use client"

import { X, Divide, Minus, Plus, Equal, Delete, Percent } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"

interface StandardKeypadProps {
  onNumberClick: (num: string) => void
  onOperatorClick: (op: string) => void
  onEqualsClick: () => void
  onClearClick: () => void
  onBackspaceClick: () => void
  onDecimalClick: () => void
  onPercentClick: () => void
  onMemoryAdd: () => void
  onMemorySubtract: () => void
  onMemoryRecall: () => void
  onMemoryClear: () => void
}

export function StandardKeypad({
  onNumberClick,
  onOperatorClick,
  onEqualsClick,
  onClearClick,
  onBackspaceClick,
  onDecimalClick,
  onPercentClick,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
}: StandardKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Top row */}
      <CalculatorButton onClick={onClearClick} variant="orange" className="rounded-l-full">
        C
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("CE")} variant="orange">
        CE
      </CalculatorButton>
      <CalculatorButton onClick={onBackspaceClick} variant="pink">
        <Delete size={18} />
      </CalculatorButton>
      <CalculatorButton onClick={onPercentClick} variant="yellow">
        <Percent size={18} />
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("/")} variant="yellow" className="rounded-r-full">
        <Divide size={18} />
      </CalculatorButton>

      {/* Memory row */}
      <CalculatorButton onClick={onMemoryClear} variant="blue">
        MC
      </CalculatorButton>
      <CalculatorButton onClick={onMemoryRecall} variant="blue">
        MR
      </CalculatorButton>
      <CalculatorButton onClick={onMemorySubtract} variant="blue">
        M-
      </CalculatorButton>
      <CalculatorButton onClick={onMemoryAdd} variant="blue">
        M+
      </CalculatorButton>

      {/* Number grid */}
      <div className="col-span-3 grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <CalculatorButton
            key={num}
            onClick={() => onNumberClick(num.toString())}
            className="bg-gray-800 text-orange-500 hover:bg-gray-700 active:bg-gray-900"
          >
            {num}
          </CalculatorButton>
        ))}
        <CalculatorButton onClick={() => onNumberClick("0")} variant="dark" className="col-span-2">
          0
        </CalculatorButton>
        <CalculatorButton onClick={onDecimalClick} variant="dark">
          .
        </CalculatorButton>
      </div>

      {/* Operators column */}
      <div className="flex flex-col gap-2">
        <CalculatorButton onClick={() => onOperatorClick("*")} variant="yellow">
          <X size={18} />
        </CalculatorButton>
        <CalculatorButton onClick={() => onOperatorClick("-")} variant="yellow">
          <Minus size={18} />
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onOperatorClick("+")}
          className="bg-yellow-400 text-black hover:bg-yellow-300 active:bg-yellow-500"
        >
          <Plus size={18} />
        </CalculatorButton>
        <CalculatorButton
          onClick={onEqualsClick}
          className="bg-orange-500 text-black hover:bg-orange-400 active:bg-orange-600"
        >
          <Equal size={18} />
        </CalculatorButton>
      </div>
    </div>
  )
}
