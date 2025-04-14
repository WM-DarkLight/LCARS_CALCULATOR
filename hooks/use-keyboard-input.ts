"use client"

import { useEffect } from "react"
import { useCalculatorContext } from "./use-calculator-context"

export function useKeyboardInput() {
  const { dispatch } = useCalculatorContext()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for calculator keys
      if (
        /[\d+\-*/.()%=]/.test(e.key) ||
        e.key === "Enter" ||
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Escape"
      ) {
        e.preventDefault()
      }

      // Handle number keys
      if (/\d/.test(e.key)) {
        dispatch({ type: "NUMBER_CLICK", payload: e.key })
      }
      // Handle operators
      else if (["+", "-", "*", "/"].includes(e.key)) {
        dispatch({ type: "OPERATOR_CLICK", payload: e.key })
      }
      // Handle decimal point
      else if (e.key === ".") {
        dispatch({ type: "DECIMAL_CLICK" })
      }
      // Handle equals and Enter
      else if (e.key === "=" || e.key === "Enter") {
        dispatch({ type: "EQUALS_CLICK" })
      }
      // Handle Backspace
      else if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE_CLICK" })
      }
      // Handle Escape (Clear)
      else if (e.key === "Escape") {
        dispatch({ type: "CLEAR_CLICK" })
      }
      // Handle parentheses
      else if (e.key === "(") {
        dispatch({ type: "OPERATOR_CLICK", payload: "(" })
      } else if (e.key === ")") {
        dispatch({ type: "OPERATOR_CLICK", payload: ")" })
      }
      // Handle percent
      else if (e.key === "%") {
        dispatch({ type: "PERCENT_CLICK" })
      }
      // Handle Delete (CE)
      else if (e.key === "Delete") {
        dispatch({ type: "OPERATOR_CLICK", payload: "CE" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [dispatch])
}
