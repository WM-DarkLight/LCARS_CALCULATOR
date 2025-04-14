"use client"

import { X, Divide, Minus, Plus, Equal, Delete, ArrowLeft, ArrowRight } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"

interface ProgrammerKeypadProps {
  onNumberClick: (num: string) => void
  onOperatorClick: (op: string) => void
  onEqualsClick: () => void
  onClearClick: () => void
  onBackspaceClick: () => void
  onFunctionClick: (func: string) => void
  base?: "hex" | "dec" | "oct" | "bin"
  onBaseChange?: (base: "hex" | "dec" | "oct" | "bin") => void
}

export function ProgrammerKeypad({
  onNumberClick,
  onOperatorClick,
  onEqualsClick,
  onClearClick,
  onBackspaceClick,
  onFunctionClick,
  base = "dec",
  onBaseChange,
}: ProgrammerKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Number base row */}
      <CalculatorButton
        onClick={() => onBaseChange && onBaseChange("hex")}
        variant={base === "hex" ? "orange" : "blue"}
        className="text-sm"
      >
        HEX
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onBaseChange && onBaseChange("dec")}
        variant={base === "dec" ? "orange" : "blue"}
        className="text-sm"
      >
        DEC
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onBaseChange && onBaseChange("oct")}
        variant={base === "oct" ? "orange" : "blue"}
        className="text-sm"
      >
        OCT
      </CalculatorButton>
      <CalculatorButton
        onClick={() => onBaseChange && onBaseChange("bin")}
        variant={base === "bin" ? "orange" : "blue"}
        className="text-sm"
      >
        BIN
      </CalculatorButton>

      {/* Bit operations */}
      <CalculatorButton onClick={() => onFunctionClick("and")} variant="pink" className="text-sm">
        AND
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("or")} variant="pink" className="text-sm">
        OR
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("xor")} variant="pink" className="text-sm">
        XOR
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("not")} variant="pink" className="text-sm">
        NOT
      </CalculatorButton>

      {/* Shift operations */}
      <CalculatorButton onClick={() => onFunctionClick("lsh")} variant="pink" className="text-sm">
        <ArrowLeft size={14} /> LSH
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("rsh")} variant="pink" className="text-sm">
        RSH <ArrowRight size={14} />
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("rol")} variant="pink" className="text-sm">
        ROL
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("ror")} variant="pink" className="text-sm">
        ROR
      </CalculatorButton>

      {/* Top row */}
      <CalculatorButton onClick={onClearClick} variant="orange">
        C
      </CalculatorButton>
      <CalculatorButton onClick={onBackspaceClick} variant="orange">
        <Delete size={18} />
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("mod")} variant="yellow">
        MOD
      </CalculatorButton>
      <CalculatorButton onClick={() => onOperatorClick("/")} variant="yellow">
        <Divide size={18} />
      </CalculatorButton>

      {/* Hex row */}
      <CalculatorButton onClick={() => onNumberClick("A")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        A
      </CalculatorButton>
      <CalculatorButton onClick={() => onNumberClick("B")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        B
      </CalculatorButton>
      <CalculatorButton onClick={() => onNumberClick("C")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        C
      </CalculatorButton>
      <CalculatorButton onClick={() => onNumberClick("D")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        D
      </CalculatorButton>

      <CalculatorButton onClick={() => onNumberClick("E")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        E
      </CalculatorButton>
      <CalculatorButton onClick={() => onNumberClick("F")} variant="dark" className="text-sm" disabled={base !== "hex"}>
        F
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("twosComplement")} variant="dark" className="text-sm">
        2's
      </CalculatorButton>
      <CalculatorButton onClick={() => onFunctionClick("onesComplement")} variant="dark" className="text-sm">
        1's
      </CalculatorButton>

      {/* Number grid */}
      <div className="col-span-3 grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <CalculatorButton
            key={num}
            onClick={() => onNumberClick(num.toString())}
            variant="dark"
            disabled={(base === "bin" && num > 1) || (base === "oct" && num > 7)}
          >
            {num}
          </CalculatorButton>
        ))}
        <CalculatorButton onClick={() => onNumberClick("0")} variant="dark" className="col-span-3">
          0
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
        <CalculatorButton onClick={() => onOperatorClick("+")} variant="yellow">
          <Plus size={18} />
        </CalculatorButton>
        <CalculatorButton onClick={onEqualsClick} variant="orange">
          <Equal size={18} />
        </CalculatorButton>
      </div>
    </div>
  )
}
