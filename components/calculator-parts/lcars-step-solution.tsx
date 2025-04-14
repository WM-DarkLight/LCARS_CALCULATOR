"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"
import { ChevronDown, ChevronUp } from "lucide-react"

interface LcarsStepSolutionProps {
  expression: string
  result: string
  klingonMode?: boolean
  onClose: () => void
}

export default function LcarsStepSolution({
  expression,
  result,
  klingonMode = false,
  onClose,
}: LcarsStepSolutionProps) {
  const [expanded, setExpanded] = useState(true)

  // Generate steps for the calculation
  const generateSteps = (expr: string, res: string) => {
    if (!expr || expr === res) return []

    const steps = []

    // Parse the expression to identify operations
    const cleanExpr = expr.replace(/\s+/g, "")

    // Handle parentheses first
    if (cleanExpr.includes("(")) {
      steps.push({
        description: "Evaluate expressions inside parentheses first",
        expression: cleanExpr,
      })

      // Find all parenthetical expressions
      const parenthesesRegex = /$$([^()]+)$$/g
      let match
      let workingExpr = cleanExpr

      while ((match = parenthesesRegex.exec(cleanExpr)) !== null) {
        const innerExpr = match[1]
        try {
          // eslint-disable-next-line no-new-func
          const innerResult = new Function(`return ${innerExpr}`)()
          steps.push({
            description: `Calculate ${match[0]} = ${innerResult}`,
            expression: workingExpr.replace(match[0], innerResult.toString()),
          })
          workingExpr = workingExpr.replace(match[0], innerResult.toString())
        } catch (error) {
          // Skip if we can't evaluate this part
        }
      }
    }

    // Handle multiplication and division
    if (cleanExpr.includes("*") || cleanExpr.includes("/")) {
      steps.push({
        description: "Perform multiplication and division from left to right",
        expression: cleanExpr,
      })

      // This is simplified - a real implementation would need more complex parsing
      const mulDivRegex = /(\d+\.?\d*)([*/])(\d+\.?\d*)/
      let workingExpr = cleanExpr
      const match = mulDivRegex.exec(workingExpr)

      if (match) {
        const [fullMatch, left, operator, right] = match
        const result =
          operator === "*"
            ? Number.parseFloat(left) * Number.parseFloat(right)
            : Number.parseFloat(left) / Number.parseFloat(right)

        steps.push({
          description: `Calculate ${left} ${operator === "*" ? "×" : "÷"} ${right} = ${result}`,
          expression: workingExpr.replace(fullMatch, result.toString()),
        })
        workingExpr = workingExpr.replace(fullMatch, result.toString())
      }
    }

    // Handle addition and subtraction
    if (cleanExpr.includes("+") || cleanExpr.includes("-")) {
      steps.push({
        description: "Perform addition and subtraction from left to right",
        expression: cleanExpr,
      })

      // This is simplified - a real implementation would need more complex parsing
      const addSubRegex = /(\d+\.?\d*)([+-])(\d+\.?\d*)/
      let workingExpr = cleanExpr
      const match = addSubRegex.exec(workingExpr)

      if (match) {
        const [fullMatch, left, operator, right] = match
        const result =
          operator === "+"
            ? Number.parseFloat(left) + Number.parseFloat(right)
            : Number.parseFloat(left) - Number.parseFloat(right)

        steps.push({
          description: `Calculate ${left} ${operator} ${right} = ${result}`,
          expression: workingExpr.replace(fullMatch, result.toString()),
        })
        workingExpr = workingExpr.replace(fullMatch, result.toString())
      }
    }

    // Add final result
    steps.push({
      description: "Final result",
      expression: res,
    })

    return steps
  }

  const steps = generateSteps(expression, result)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-900 border-t border-gray-800"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-yellow-400 text-sm flex items-center gap-2">
            <button onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <KlingonText enabled={klingonMode}>STEP-BY-STEP SOLUTION</KlingonText>
          </div>
          <CalculatorButton onClick={onClose} variant="pink" className="text-xs px-2 py-1">
            <KlingonText enabled={klingonMode}>CLOSE</KlingonText>
          </CalculatorButton>
        </div>

        {expanded && (
          <div className="space-y-3">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-blue-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>EXPRESSION</KlingonText>
              </div>
              <div className="text-orange-500 font-mono">{expression}</div>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-lg">
                <div className="text-blue-400 text-xs mb-1">
                  <KlingonText enabled={klingonMode}>STEP {index + 1}</KlingonText>
                </div>
                <div className="text-gray-300 mb-2">
                  <KlingonText enabled={klingonMode}>{step.description}</KlingonText>
                </div>
                <div className="text-orange-500 font-mono">{step.expression}</div>
              </div>
            ))}

            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-blue-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>RESULT</KlingonText>
              </div>
              <div className="text-orange-500 font-mono text-xl">{result}</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
