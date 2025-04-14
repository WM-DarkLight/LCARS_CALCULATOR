"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { CalculatorState, CalculatorMode } from "@/lib/calculator-types"
import {
  MATH_CONSTANTS,
  calculateTrigFunction,
  calculateLogFunction,
  calculateMathFunction,
  bitwiseOperation,
  convertUnit,
  convertBase,
} from "@/lib/calculator-utils"

type CalculatorAction =
  | { type: "NUMBER_CLICK"; payload: string }
  | { type: "OPERATOR_CLICK"; payload: string }
  | { type: "EQUALS_CLICK" }
  | { type: "CLEAR_CLICK" }
  | { type: "BACKSPACE_CLICK" }
  | { type: "DECIMAL_CLICK" }
  | { type: "PERCENT_CLICK" }
  | { type: "MEMORY_ADD" }
  | { type: "MEMORY_SUBTRACT" }
  | { type: "MEMORY_RECALL" }
  | { type: "MEMORY_CLEAR" }
  | { type: "FUNCTION_CLICK"; payload: string }
  | { type: "CONSTANT_CLICK"; payload: string }
  | { type: "SET_MODE"; payload: CalculatorMode }
  | { type: "TOGGLE_ANGLE_UNIT" }
  | { type: "SET_BASE"; payload: "hex" | "dec" | "oct" | "bin" }
  | { type: "SET_CONVERSION_TYPE"; payload: string }
  | { type: "SET_FROM_UNIT"; payload: string }
  | { type: "SET_TO_UNIT"; payload: string }
  | { type: "CONVERT" }
  | { type: "SET_DISPLAY"; payload: string }
  | { type: "ADD_TO_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" }

interface CalculatorContextType {
  state: CalculatorState
  dispatch: React.Dispatch<CalculatorAction>
}

const initialState: CalculatorState = {
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
  lastMemoryAction: "",
  fullExpression: "",
  parenthesesCount: 0,
}

const CalculatorContext = createContext<CalculatorContextType>({
  state: initialState,
  dispatch: () => null,
})

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case "NUMBER_CLICK":
      return {
        ...state,
        display: state.isNewInput || state.display === "0" ? action.payload : state.display + action.payload,
        isNewInput: false,
        fullExpression: state.isNewInput
          ? state.fullExpression === "" || state.fullExpression === "0"
            ? action.payload
            : state.fullExpression + action.payload
          : state.fullExpression + action.payload,
      }
    case "OPERATOR_CLICK":
      if (action.payload === "CE") {
        return {
          ...state,
          display: "0",
          isNewInput: true,
        }
      }

      if (action.payload === "(") {
        return {
          ...state,
          fullExpression: state.fullExpression + "(",
          parenthesesCount: state.parenthesesCount + 1,
          isNewInput: true,
        }
      }

      if (action.payload === ")") {
        if (state.parenthesesCount > 0) {
          return {
            ...state,
            fullExpression: state.fullExpression + ")",
            parenthesesCount: state.parenthesesCount - 1,
            isNewInput: true,
          }
        }
        return state // Ignore if no matching open parenthesis
      }

      return {
        ...state,
        fullExpression: state.fullExpression + " " + action.payload + " ",
        isNewInput: true,
      }
    case "EQUALS_CLICK":
      try {
        // Complete any open parentheses
        let expressionToEvaluate = state.fullExpression
        for (let i = 0; i < state.parenthesesCount; i++) {
          expressionToEvaluate += ")"
        }

        // Clean up the expression for evaluation
        expressionToEvaluate = expressionToEvaluate.replace(/\s+/g, "")

        // Check for division by zero
        if (expressionToEvaluate.includes("/0")) {
          return {
            ...state,
            display: "Error: Division by zero",
            equation: "",
            fullExpression: "",
            isNewInput: true,
            parenthesesCount: 0,
            history: [...state.history, `${expressionToEvaluate} = Error: Division by zero`],
          }
        }

        // Evaluate the expression safely
        const result = Function(`"use strict"; return (${expressionToEvaluate})`)()

        // Check if result is valid
        if (isNaN(result) || !isFinite(result)) {
          return {
            ...state,
            display: "Error: Invalid calculation",
            equation: "",
            fullExpression: "",
            isNewInput: true,
            parenthesesCount: 0,
            history: [...state.history, `${expressionToEvaluate} = Error: Invalid calculation`],
          }
        }

        // Format the result for display
        const formattedResult = Number.isInteger(result)
          ? String(result)
          : String(Number.parseFloat(result.toFixed(10)))

        return {
          ...state,
          display: formattedResult,
          equation: "",
          fullExpression: formattedResult, // Start new expression with the result
          isNewInput: true,
          parenthesesCount: 0,
          history: [...state.history, `${expressionToEvaluate} = ${formattedResult}`],
        }
      } catch (error) {
        return {
          ...state,
          display: "Error",
          equation: "",
          fullExpression: "",
          isNewInput: true,
          parenthesesCount: 0,
          history: [...state.history, `Error in calculation: ${error.message}`],
        }
      }
    case "CLEAR_CLICK":
      return {
        ...state,
        display: "0",
        equation: "",
        fullExpression: "",
        isNewInput: true,
        parenthesesCount: 0,
      }
    case "BACKSPACE_CLICK":
      if (state.isNewInput) {
        return state
      }

      const newDisplay = state.display.length > 1 ? state.display.slice(0, -1) : "0"
      const newFullExpression = state.fullExpression.length > 0 ? state.fullExpression.slice(0, -1) : ""

      return {
        ...state,
        display: newDisplay,
        fullExpression: newFullExpression,
        isNewInput: newDisplay === "0",
      }
    case "DECIMAL_CLICK":
      if (state.isNewInput) {
        return {
          ...state,
          display: "0.",
          fullExpression: state.fullExpression + "0.",
          isNewInput: false,
        }
      } else if (!state.display.includes(".")) {
        return {
          ...state,
          display: state.display + ".",
          fullExpression: state.fullExpression + ".",
          isNewInput: false,
        }
      }
      return state
    case "PERCENT_CLICK":
      try {
        const value = Number.parseFloat(state.display) / 100
        return {
          ...state,
          display: String(value),
          fullExpression: state.fullExpression.slice(0, -state.display.length) + value,
          isNewInput: true,
        }
      } catch (error) {
        return {
          ...state,
          display: "Error",
          isNewInput: true,
        }
      }
    case "MEMORY_ADD":
      return {
        ...state,
        memory: state.memory + Number.parseFloat(state.display),
        lastMemoryAction: `M+ (${state.display})`,
        history: [...state.history, `Memory + ${state.display} = ${state.memory + Number.parseFloat(state.display)}`],
      }
    case "MEMORY_SUBTRACT":
      return {
        ...state,
        memory: state.memory - Number.parseFloat(state.display),
        lastMemoryAction: `M- (${state.display})`,
        history: [...state.history, `Memory - ${state.display} = ${state.memory - Number.parseFloat(state.display)}`],
      }
    case "MEMORY_RECALL":
      return {
        ...state,
        display: String(state.memory),
        fullExpression: state.fullExpression + state.memory,
        lastMemoryAction: "MR",
        isNewInput: true,
      }
    case "MEMORY_CLEAR":
      return {
        ...state,
        memory: 0,
        lastMemoryAction: "MC",
        history: [...state.history, "Memory cleared"],
      }
    case "FUNCTION_CLICK":
      try {
        const value = Number.parseFloat(state.display)
        let result: number | string = value
        let historyEntry = ""
        let functionExpression = ""

        // Handle different function types
        if (["sin", "cos", "tan", "asin", "acos", "atan"].includes(action.payload)) {
          result = calculateTrigFunction(action.payload, value, state.angleUnit)
          historyEntry = `${action.payload}(${value}) = ${result}`
          functionExpression = `${action.payload}(${value})`
        } else if (["log", "ln", "log2", "exp"].includes(action.payload)) {
          result = calculateLogFunction(action.payload, value)
          historyEntry = `${action.payload}(${value}) = ${result}`
          functionExpression = `${action.payload}(${value})`
        } else if (
          ["sqrt", "cbrt", "square", "cube", "reciprocal", "abs", "factorial", "random"].includes(action.payload)
        ) {
          result = calculateMathFunction(action.payload, value)
          historyEntry = `${action.payload}(${value}) = ${result}`
          functionExpression = `${action.payload}(${value})`
        } else if (["hex", "dec", "oct", "bin"].includes(action.payload)) {
          // Base conversion
          if (state.base !== action.payload) {
            const fromBase = state.base === "hex" ? 16 : state.base === "oct" ? 8 : state.base === "bin" ? 2 : 10
            const toBase =
              action.payload === "hex" ? 16 : action.payload === "oct" ? 8 : action.payload === "bin" ? 2 : 10
            result = convertBase(state.display, fromBase, toBase)
            historyEntry = `Convert ${state.display} from ${state.base} to ${action.payload} = ${result}`
            return {
              ...state,
              display: String(result),
              base: action.payload as "hex" | "dec" | "oct" | "bin",
              history: [...state.history, historyEntry],
            }
          }
          return {
            ...state,
            base: action.payload as "hex" | "dec" | "oct" | "bin",
          }
        } else if (
          ["and", "or", "xor", "not", "lsh", "rsh", "rol", "ror", "twosComplement", "onesComplement"].includes(
            action.payload,
          )
        ) {
          // Bitwise operations
          result = bitwiseOperation(action.payload, value)
          historyEntry = `${action.payload}(${value}) = ${result}`
          functionExpression = `${action.payload}(${value})`
        } else if (
          ["length", "weight", "temperature", "volume", "area", "time", "speed", "energy"].includes(action.payload)
        ) {
          // Unit conversion type selection
          return {
            ...state,
            conversionType: action.payload,
          }
        } else if (action.payload === "convert") {
          // Perform unit conversion
          result = convertUnit(value, state.fromUnit, state.toUnit, state.conversionType)
          historyEntry = `Convert ${value} ${state.fromUnit} to ${state.toUnit} = ${result} ${state.toUnit}`
          functionExpression = `convert(${value})`
        } else if (action.payload === "mod") {
          // Modulo is handled as an operator
          return {
            ...state,
            equation: state.display + " % ",
            fullExpression: state.fullExpression + "%",
            isNewInput: true,
          }
        }

        return {
          ...state,
          display: String(result),
          fullExpression: state.fullExpression.slice(0, -state.display.length) + result,
          isNewInput: true,
          history: historyEntry ? [...state.history, historyEntry] : state.history,
        }
      } catch (error) {
        return {
          ...state,
          display: "Error",
          isNewInput: true,
        }
      }
    case "CONSTANT_CLICK":
      const value = MATH_CONSTANTS[action.payload as keyof typeof MATH_CONSTANTS]
      if (value) {
        return {
          ...state,
          display: String(value),
          fullExpression: state.fullExpression + value,
          isNewInput: true,
        }
      }
      return state
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      }
    case "TOGGLE_ANGLE_UNIT":
      return {
        ...state,
        angleUnit: state.angleUnit === "deg" ? "rad" : "deg",
      }
    case "SET_BASE":
      return {
        ...state,
        base: action.payload,
      }
    case "SET_CONVERSION_TYPE":
      return {
        ...state,
        conversionType: action.payload,
      }
    case "SET_FROM_UNIT":
      return {
        ...state,
        fromUnit: action.payload,
      }
    case "SET_TO_UNIT":
      return {
        ...state,
        toUnit: action.payload,
      }
    case "CONVERT":
      try {
        const value = Number.parseFloat(state.display)
        const result = convertUnit(value, state.fromUnit, state.toUnit, state.conversionType)
        const historyEntry = `Convert ${value} ${state.fromUnit} to ${state.toUnit} = ${result} ${state.toUnit}`
        return {
          ...state,
          display: String(result),
          isNewInput: true,
          history: [...state.history, historyEntry],
        }
      } catch (error) {
        return {
          ...state,
          display: "Error",
          isNewInput: true,
        }
      }
    case "SET_DISPLAY":
      return {
        ...state,
        display: action.payload,
        isNewInput: true,
      }
    case "ADD_TO_HISTORY":
      return {
        ...state,
        history: [...state.history, action.payload],
      }
    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
      }
    default:
      return state
  }
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  return <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>
}

export function useCalculatorContext() {
  return useContext(CalculatorContext)
}
