"use client"

import { X, Divide, Minus, Plus, Equal, Delete, Percent } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useState } from "react"

interface ScientificKeypadProps {
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
  onFunctionClick: (func: string) => void
  onConstantClick: (constant: string) => void
  angleUnit?: "deg" | "rad"
}

export function ScientificKeypad({
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
  onFunctionClick,
  onConstantClick,
  angleUnit = "deg",
}: ScientificKeypadProps) {
  const [inverseMode, setInverseMode] = useState(false)

  const toggleInverseMode = () => {
    setInverseMode(!inverseMode)
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Constants row */}
      <CalculatorButton onClick={() => onConstantClick("pi")} variant="blue" className="text-sm">
        π
      </CalculatorButton>
      <CalculatorButton onClick={() => onConstantClick("e")} variant="blue" className="text-sm">
        e
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("abs")} variant="blue" className="text-sm">
        |x|
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("factorial")} variant="blue" className="text-sm">
        n!
      </CalculatorButton>
      <CalculatorButton onClick={toggleInverseMode} variant={inverseMode ? "orange" : "blue"} className="text-sm">
        INV
      </CalculatorButton>

      {/* Function row 1 */}
      <CalculatorButton
        onClick={() => onFunctionClick(inverseMode ? "asin" : "sin")}
        variant="pink"
        className="text-sm"
      >
        {inverseMode ? "sin⁻¹" : "sin"}
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onFunctionClick(inverseMode ? "acos" : "cos")}
        variant="pink"
        className="text-sm"
      >
        {inverseMode ? "cos⁻¹" : "cos"}
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onFunctionClick(inverseMode ? "atan" : "tan")}
        variant="pink"
        className="text-sm"
      >
        {inverseMode ? "tan⁻¹" : "tan"}
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick(inverseMode ? "exp" : "log")} variant="pink" className="text-sm">
        {inverseMode ? "10^x" : "log"}
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick(inverseMode ? "exp" : "ln")} variant="pink" className="text-sm">
        {inverseMode ? "e^x" : "ln"}
      </CalculatorButton>

      {/* Function row 2 */}
      <CalculatorButton
        onClick={() => onFunctionClick(inverseMode ? "square" : "sqrt")}
        variant="pink"
        className="text-sm"
      >
        {inverseMode ? "x²" : "√"}
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onFunctionClick(inverseMode ? "cube" : "cbrt")}
        variant="pink"
        className="text-sm"
      >
        {inverseMode ? "x³" : "∛"}
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("**")} variant="pink" className="text-sm">
        x^y
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("random")} variant="pink" className="text-sm">
        rand
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("reciprocal")} variant="pink" className="text-sm">
        1/x
      </CalculatorButton>

      {/* Top row */}
      <CalculatorButton onClick={onClearClick} variant="orange">
        C
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("CE")} variant="orange">
        CE
      </CalculatorButton>
      <CalculatorButton onClick={onBackspaceClick} variant="orange">
        <Delete size={18} />
      </CalculatorButton>
      <CalculatorButton onClick={onPercentClick} variant="yellow">
        <Percent size={18} />
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("/")} variant="yellow">
        <Divide size={18} />
      </CalculatorButton>

      {/* Memory row */}
      <CalculatorButton onClick={onMemoryClear} variant="blue" className="text-sm">
        MC
      </CalculatorButton>
      <CalculatorButton onClick={onMemoryRecall} variant="blue" className="text-sm">
        MR
      </CalculatorButton>
      <CalculatorButton onClick={onMemorySubtract} variant="blue" className="text-sm">
        M-
      </CalculatorButton>
      <CalculatorButton onClick={onMemoryAdd} variant="blue" className="text-sm">
        M+
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("*")} variant="yellow">
        <X size={18} />
      </CalculatorButton>

      {/* Number grid */}
      <div className="col-span-4 grid grid-cols-4 gap-2">
        <CalculatorButton onClick={() => onOperatorClick("(")} variant="dark">
          (
        </CalculatorButton>
        <CalculatorButton onClick={() => onOperatorClick(")")} variant="dark">
          )
        </CalculatorButton>
        <CalculatorButton onClick={() => onFunctionClick("mod")} variant="dark">
          mod
        </CalculatorButton>
        <CalculatorButton onClick={() => onOperatorClick("-")} variant="yellow">
          <Minus size={18} />
        </CalculatorButton>

        {[7, 8, 9].map((num) => (
          <CalculatorButton key={num} onClick={() => onNumberClick(num.toString())} variant="dark">
            {num}
          </CalculatorButton>
        ))}
        <CalculatorButton onClick={() => onOperatorClick("+")} variant="yellow">
          <Plus size={18} />
        </CalculatorButton>

        {[4, 5, 6].map((num) => (
          <CalculatorButton key={num} onClick={() => onNumberClick(num.toString())} variant="dark">
            {num}
          </CalculatorButton>
        ))}
        <CalculatorButton onClick={onEqualsClick} variant="orange" className="row-span-2">
          <Equal size={18} />
        </CalculatorButton>

        {[1, 2, 3].map((num) => (
          <CalculatorButton key={num} onClick={() => onNumberClick(num.toString())} variant="dark">
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

      {/* Angle unit indicator */}
      <div className="text-center text-xs text-orange-500 flex items-center justify-center">
        {angleUnit.toUpperCase()}
      </div>
    </div>
  )
}
