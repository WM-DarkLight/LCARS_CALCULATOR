// Debug utilities for calculator

export function debugCalculation(expression: string): void {
  console.log("Evaluating expression:", expression)

  try {
    // Clean up the expression
    const cleanExpression = expression.replace(/\s+/g, "")
    console.log("Cleaned expression:", cleanExpression)

    // Evaluate
    const result = Function(`"use strict"; return (${cleanExpression})`)()
    console.log("Result:", result)

    return result
  } catch (error) {
    console.error("Evaluation error:", error)
    return Number.NaN
  }
}

export function validateExpression(expression: string): boolean {
  try {
    // Basic validation
    if (!expression || expression.trim() === "") return false

    // Check for balanced parentheses
    let parenCount = 0
    for (const char of expression) {
      if (char === "(") parenCount++
      if (char === ")") parenCount--
      if (parenCount < 0) return false
    }
    if (parenCount !== 0) return false

    // Check for invalid operators
    if (/[+\-*/]{2,}/.test(expression)) return false

    // Try evaluating
    Function(`"use strict"; return (${expression})`)()
    return true
  } catch (error) {
    console.error("Validation error:", error)
    return false
  }
}
