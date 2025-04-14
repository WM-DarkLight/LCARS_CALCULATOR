"use client"
import { motion } from "framer-motion"
import type { CalculatorMode } from "@/lib/calculator-types"
import { StandardKeypad } from "./keypads/standard-keypad"
import { ScientificKeypad } from "./keypads/scientific-keypad"
import { ProgrammerKeypad } from "./keypads/programmer-keypad"
import { ConverterKeypad } from "./keypads/converter-keypad"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { useSound } from "@/hooks/use-sound"

interface LcarsKeypadProps {
  mode: CalculatorMode
  trackButtonPress?: (button: string) => void
}

export default function LcarsKeypad({ mode, trackButtonPress }: LcarsKeypadProps) {
  const { dispatch, state } = useCalculatorContext()
  const { playBeep } = useSound()

  const handleButtonPress = (action: string, payload?: any) => {
    playBeep("button")

    // Debug log
    console.log(`Button press: ${action}`, payload)

    dispatch({ type: action, payload })

    // Track button press for easter eggs if function is provided
    if (trackButtonPress) {
      if (action === "NUMBER_CLICK") {
        trackButtonPress(payload)
      } else if (action === "FUNCTION_CLICK") {
        trackButtonPress(payload)
      }
    }
  }

  const renderKeypad = () => {
    switch (mode) {
      case "scientific":
        return (
          <ScientificKeypad
            onNumberClick={(num) => handleButtonPress("NUMBER_CLICK", num)}
            onOperatorClick={(op) => handleButtonPress("OPERATOR_CLICK", op)}
            onEqualsClick={() => handleButtonPress("EQUALS_CLICK")}
            onClearClick={() => handleButtonPress("CLEAR_CLICK")}
            onBackspaceClick={() => handleButtonPress("BACKSPACE_CLICK")}
            onDecimalClick={() => handleButtonPress("DECIMAL_CLICK")}
            onPercentClick={() => handleButtonPress("PERCENT_CLICK")}
            onMemoryAdd={() => handleButtonPress("MEMORY_ADD")}
            onMemorySubtract={() => handleButtonPress("MEMORY_SUBTRACT")}
            onMemoryRecall={() => handleButtonPress("MEMORY_RECALL")}
            onMemoryClear={() => handleButtonPress("MEMORY_CLEAR")}
            onFunctionClick={(func) => handleButtonPress("FUNCTION_CLICK", func)}
            onConstantClick={(constant) => handleButtonPress("CONSTANT_CLICK", constant)}
            angleUnit={state.angleUnit}
          />
        )
      case "programmer":
        return (
          <ProgrammerKeypad
            onNumberClick={(num) => handleButtonPress("NUMBER_CLICK", num)}
            onOperatorClick={(op) => handleButtonPress("OPERATOR_CLICK", op)}
            onEqualsClick={() => handleButtonPress("EQUALS_CLICK")}
            onClearClick={() => handleButtonPress("CLEAR_CLICK")}
            onBackspaceClick={() => handleButtonPress("BACKSPACE_CLICK")}
            onFunctionClick={(func) => handleButtonPress("FUNCTION_CLICK", func)}
            base={state.base}
            onBaseChange={(base) => handleButtonPress("SET_BASE", base)}
          />
        )
      case "converter":
        return (
          <ConverterKeypad
            onNumberClick={(num) => handleButtonPress("NUMBER_CLICK", num)}
            onClearClick={() => handleButtonPress("CLEAR_CLICK")}
            onBackspaceClick={() => handleButtonPress("BACKSPACE_CLICK")}
            onDecimalClick={() => handleButtonPress("DECIMAL_CLICK")}
            onFunctionClick={(func) => handleButtonPress("FUNCTION_CLICK", func)}
            conversionType={state.conversionType}
            onConversionTypeChange={(type) => handleButtonPress("SET_CONVERSION_TYPE", type)}
            fromUnit={state.fromUnit}
            toUnit={state.toUnit}
            onFromUnitChange={(unit) => handleButtonPress("SET_FROM_UNIT", unit)}
            onToUnitChange={(unit) => handleButtonPress("SET_TO_UNIT", unit)}
            onConvert={() => handleButtonPress("CONVERT")}
          />
        )
      default:
        return (
          <StandardKeypad
            onNumberClick={(num) => handleButtonPress("NUMBER_CLICK", num)}
            onOperatorClick={(op) => handleButtonPress("OPERATOR_CLICK", op)}
            onEqualsClick={() => handleButtonPress("EQUALS_CLICK")}
            onClearClick={() => handleButtonPress("CLEAR_CLICK")}
            onBackspaceClick={() => handleButtonPress("BACKSPACE_CLICK")}
            onDecimalClick={() => handleButtonPress("DECIMAL_CLICK")}
            onPercentClick={() => handleButtonPress("PERCENT_CLICK")}
            onMemoryAdd={() => handleButtonPress("MEMORY_ADD")}
            onMemorySubtract={() => handleButtonPress("MEMORY_SUBTRACT")}
            onMemoryRecall={() => handleButtonPress("MEMORY_RECALL")}
            onMemoryClear={() => handleButtonPress("MEMORY_CLEAR")}
          />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-gray-900"
    >
      {renderKeypad()}
    </motion.div>
  )
}
