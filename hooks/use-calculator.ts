"use client"

import { useState } from "react"
import {
  MATH_CONSTANTS,
  calculateTrigFunction,
  calculateLogFunction,
  calculateMathFunction,
  bitwiseOperation,
  convertUnit,
} from "@/lib/calculator-utils"
import type { CalculatorState } from "@/lib/calculator-types"

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    equation: "",
    isNewInput: true,
    memory: 0,
    history: [],
    mode: "standard",
    angleUnit: "deg",
    base: "dec",
    conversionType: "length",
    fromUnit: "m",
    toUnit: "km",
  })

  const updateState = (newState: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...newState }))
  }

  const handleNumberClick = (num: string) => {
    if (state.isNewInput || state.display === "0") {
      updateState({ display: num, isNewInput: false })
    } else {
      updateState({ display: state.display + num })
    }
  }

  const handleDecimalClick = () => {
    if (state.isNewInput) {
      updateState({ display: "0.", isNewInput: false })
    } else if (!state.display.includes(".")) {
      updateState({ display: state.display + "." })
    }
  }

  const handleOperatorClick = (operator: string) => {
    updateState({
      equation: state.display + " " + operator + " ",
      isNewInput: true,
    })
  }

  const handleEqualsClick = () => {
    try {
      const fullEquation = state.equation + state.display
      // eslint-disable-next-line no-eval
      const result = eval(fullEquation)
      updateState({
        display: String(result),
        equation: "",
        isNewInput: true,
        history: [...state.history, `${fullEquation} = ${result}`],
      })
    } catch (error) {
      updateState({
        display: "Error",
        isNewInput: true,
      })
    }
  }

  const handleClearClick = () => {
    updateState({
      display: "0",
      equation: "",
      isNewInput: true,
    })
  }

  const handleBackspaceClick = () => {
    if (state.display.length > 1) {
      updateState({ display: state.display.slice(0, -1) })
    } else {
      updateState({ display: "0", isNewInput: true })
    }
  }

  const handlePercentClick = () => {
    try {
      const value = Number.parseFloat(state.display) / 100
      updateState({
        display: String(value),
        isNewInput: true,
      })
    } catch (error) {
      updateState({
        display: "Error",
        isNewInput: true,
      })
    }
  }

  const handleMemoryAdd = () => {
    updateState({ memory: state.memory + Number.parseFloat(state.display) })
  }

  const handleMemorySubtract = () => {
    updateState({ memory: state.memory - Number.parseFloat(state.display) })
  }

  const handleMemoryRecall = () => {
    updateState({
      display: String(state.memory),
      isNewInput: true,
    })
  }

  const handleMemoryClear = () => {
    updateState({ memory: 0 })
  }

  const handleFunctionClick = (func: string) => {
    try {
      const value = Number.parseFloat(state.display)
      let result: number

      // Handle different function types
      if (["sin", "cos", "tan", "asin", "acos", "atan"].includes(func)) {
        result = calculateTrigFunction(func, value, state.angleUnit)
      } else if (["log", "ln", "log2"].includes(func)) {
        result = calculateLogFunction(func, value)
      } else if (["sqrt", "cbrt", "square", "reciprocal", "abs", "factorial", "random"].includes(func)) {
        result = calculateMathFunction(func, value)
      } else if (["hex", "dec", "oct", "bin"].includes(func)) {
        // Base conversion
        updateState({ base: func as any })
        return
      } else if (
        ["and", "or", "xor", "not", "lsh", "rsh", "rol", "ror", "twosComplement", "onesComplement"].includes(func)
      ) {
        // Bitwise operations
        result = bitwiseOperation(func, value)
      } else if (["length", "weight", "temperature", "volume", "area", "time", "speed", "energy"].includes(func)) {
        // Unit conversion type selection
        updateState({ conversionType: func })
        return
      } else if (func === "convert") {
        // Perform unit conversion
        result = convertUnit(value, state.fromUnit, state.toUnit, state.conversionType)
      } else if (func === "mod") {
        // Modulo is handled as an operator
        handleOperatorClick("%")
        return
      } else {
        result = value
      }

      updateState({
        display: String(result),
        isNewInput: true,
        history: [...state.history, `${func}(${value}) = ${result}`],
      })
    } catch (error) {
      updateState({
        display: "Error",
        isNewInput: true,
      })
    }
  }

  const handleConstantClick = (constant: string) => {
    const value = MATH_CONSTANTS[constant as keyof typeof MATH_CONSTANTS]
    if (value) {
      updateState({
        display: String(value),
        isNewInput: true,
      })
    }
  }

  const resetDisplay = () => {
    updateState({
      display: "0",
      equation: "",
      isNewInput: true,
    })
  }

  return {
    ...state,
    handleNumberClick,
    handleDecimalClick,
    handleOperatorClick,
    handleEqualsClick,
    handleClearClick,
    handleBackspaceClick,
    handlePercentClick,
    handleMemoryAdd,
    handleMemorySubtract,
    handleMemoryRecall,
    handleMemoryClear,
    handleFunctionClick,
    handleConstantClick,
    resetDisplay,
  }
}
