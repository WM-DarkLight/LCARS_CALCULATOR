"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

export default function LcarsFinancial({ klingonMode = false }) {
  const { dispatch } = useCalculatorContext()
  const [calculationType, setCalculationType] = useState<string>("loan")
  const [principal, setPrincipal] = useState<string>("100000")
  const [rate, setRate] = useState<string>("5")
  const [term, setTerm] = useState<string>("30")
  const [payment, setPayment] = useState<string>("0")
  const [futureValue, setFutureValue] = useState<string>("0")
  const [presentValue, setPresentValue] = useState<string>("0")
  const [compoundingPeriods, setCompoundingPeriods] = useState<string>("12")
  const [results, setResults] = useState<Record<string, { value: number | string; unit: string }>>({})

  const performCalculation = (type: string) => {
    let result: number | string = 0
    let unit = ""
    let description = ""

    switch (type) {
      case "loan-payment": {
        // Calculate monthly payment for a loan
        // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
        const p = Number(principal)
        const r = Number(rate) / 100 / 12 // monthly interest rate
        const n = Number(term) * 12 // number of payments (months)

        if (r === 0) {
          // Simple division if interest rate is zero
          result = p / n
        } else {
          result = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        }

        unit = "per month"
        description = "Monthly Loan Payment"
        setPayment(result.toFixed(2))
        break
      }
      case "loan-total": {
        // Calculate total payment over the life of the loan
        const p = Number(principal)
        const r = Number(rate) / 100 / 12
        const n = Number(term) * 12

        let monthlyPayment: number
        if (r === 0) {
          monthlyPayment = p / n
        } else {
          monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        }

        result = monthlyPayment * n
        unit = "total"
        description = "Total Loan Payments"
        break
      }
      case "loan-interest": {
        // Calculate total interest paid
        const p = Number(principal)
        const r = Number(rate) / 100 / 12
        const n = Number(term) * 12

        let monthlyPayment: number
        if (r === 0) {
          monthlyPayment = p / n
          result = 0
        } else {
          monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
          result = monthlyPayment * n - p
        }

        unit = "total"
        description = "Total Interest Paid"
        break
      }
      case "compound-interest": {
        // Calculate compound interest
        // A = P(1 + r/n)^(nt)
        const p = Number(principal)
        const r = Number(rate) / 100
        const t = Number(term)
        const n = Number(compoundingPeriods)

        result = p * Math.pow(1 + r / n, n * t)
        unit = "future value"
        description = "Compound Interest"
        setFutureValue(result.toFixed(2))
        break
      }
      case "present-value": {
        // Calculate present value
        // P = F / (1 + r)^t
        const f = Number(futureValue)
        const r = Number(rate) / 100
        const t = Number(term)

        result = f / Math.pow(1 + r, t)
        unit = "present value"
        description = "Present Value"
        setPresentValue(result.toFixed(2))
        break
      }
      case "roi": {
        // Calculate Return on Investment (ROI)
        // ROI = (Gain - Cost) / Cost * 100
        const initialInvestment = Number(principal)
        const finalValue = Number(futureValue)

        result = ((finalValue - initialInvestment) / initialInvestment) * 100
        unit = "%"
        description = "Return on Investment"
        break
      }
      case "rule-of-72": {
        // Rule of 72: Estimate years to double investment
        // Years to double = 72 / Interest Rate
        const r = Number(rate)

        result = 72 / r
        unit = "years"
        description = "Years to Double Investment"
        break
      }
      case "inflation": {
        // Calculate future value adjusted for inflation
        // Real future value = nominal future value / (1 + inflation rate)^t
        const nominalValue = Number(futureValue)
        const inflationRate = Number(rate) / 100
        const t = Number(term)

        result = nominalValue / Math.pow(1 + inflationRate, t)
        unit = "adjusted value"
        description = "Inflation-Adjusted Value"
        break
      }
    }

    // Update results
    setResults({
      ...results,
      [type]: { value: result, unit },
    })

    // Update calculator display and history
    dispatch({ type: "SET_DISPLAY", payload: result.toFixed(2) })
    dispatch({
      type: "ADD_TO_HISTORY",
      payload: `${description} = ${result.toFixed(2)} ${unit}`,
    })
  }

  const renderCalculationForm = () => {
    switch (calculationType) {
      case "loan":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Loan Amount</KlingonText>
              </div>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Interest Rate (%)</KlingonText>
              </div>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                step="0.01"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Term (Years)</KlingonText>
              </div>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CalculatorButton onClick={() => performCalculation("loan-payment")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Payment</KlingonText>
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("loan-total")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Total</KlingonText>
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("loan-interest")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Interest</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
      case "investment":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Principal</KlingonText>
              </div>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Interest Rate (%)</KlingonText>
              </div>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                step="0.01"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Term (Years)</KlingonText>
              </div>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Compounding Periods (per year)</KlingonText>
              </div>
              <select
                value={compoundingPeriods}
                onChange={(e) => setCompoundingPeriods(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              >
                <option value="1">Annual (1)</option>
                <option value="2">Semi-Annual (2)</option>
                <option value="4">Quarterly (4)</option>
                <option value="12">Monthly (12)</option>
                <option value="365">Daily (365)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("compound-interest")}
                variant="blue"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Future Value</KlingonText>
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("rule-of-72")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Rule of 72</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
      case "present-value":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Future Value</KlingonText>
              </div>
              <input
                type="number"
                value={futureValue}
                onChange={(e) => setFutureValue(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Interest Rate (%)</KlingonText>
              </div>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                step="0.01"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Term (Years)</KlingonText>
              </div>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton onClick={() => performCalculation("present-value")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Present Value</KlingonText>
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("inflation")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Inflation Adjust</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
      case "roi":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Initial Investment</KlingonText>
              </div>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Final Value</KlingonText>
              </div>
              <input
                type="number"
                value={futureValue}
                onChange={(e) => setFutureValue(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <CalculatorButton onClick={() => performCalculation("roi")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Calculate ROI</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <CalculatorButton
          onClick={() => setCalculationType("loan")}
          variant={calculationType === "loan" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>LOAN</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("investment")}
          variant={calculationType === "investment" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>INVEST</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("present-value")}
          variant={calculationType === "present-value" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>PV/FV</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("roi")}
          variant={calculationType === "roi" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>ROI</KlingonText>
        </CalculatorButton>
      </div>

      {renderCalculationForm()}

      {Object.keys(results).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 p-2 rounded-lg border border-gray-800"
        >
          <div className="text-yellow-400 text-xs mb-1">
            <KlingonText enabled={klingonMode}>Results</KlingonText>
          </div>
          <div className="grid gap-1">
            {Object.entries(results).map(([key, { value, unit }]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-300 text-sm">
                  <KlingonText enabled={klingonMode}>
                    {key
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                    :
                  </KlingonText>
                </span>
                <span className="text-orange-500 text-sm">
                  {typeof value === "number" ? value.toFixed(2) : value} {unit}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="text-gray-500 text-xs">
        <KlingonText enabled={klingonMode}>
          Financial calculations are estimates and may vary based on actual terms and conditions.
        </KlingonText>
      </div>
    </div>
  )
}
