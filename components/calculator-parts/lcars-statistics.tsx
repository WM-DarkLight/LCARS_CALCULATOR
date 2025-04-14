"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function LcarsStatistics() {
  const { dispatch } = useCalculatorContext()
  const [dataInput, setDataInput] = useState("")
  const [dataArray, setDataArray] = useState<number[]>([])
  const [results, setResults] = useState<Record<string, number>>({})

  const parseData = () => {
    try {
      // Parse comma or space separated values
      const parsed = dataInput
        .split(/[,\s]+/)
        .map((val) => val.trim())
        .filter((val) => val !== "")
        .map((val) => Number(val))

      if (parsed.some(isNaN)) {
        throw new Error("Invalid data")
      }

      setDataArray(parsed)
      return parsed
    } catch (error) {
      dispatch({
        type: "ADD_TO_HISTORY",
        payload: "Error parsing data: Invalid format",
      })
      return []
    }
  }

  const calculateStatistics = (operation: string) => {
    const data = dataArray.length ? dataArray : parseData()
    if (!data.length) return

    let result = 0
    let operationName = ""

    switch (operation) {
      case "mean":
        result = data.reduce((sum, val) => sum + val, 0) / data.length
        operationName = "Mean"
        break
      case "median":
        const sorted = [...data].sort((a, b) => a - b)
        const mid = Math.floor(sorted.length / 2)
        result = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
        operationName = "Median"
        break
      case "min":
        result = Math.min(...data)
        operationName = "Minimum"
        break
      case "max":
        result = Math.max(...data)
        operationName = "Maximum"
        break
      case "sum":
        result = data.reduce((sum, val) => sum + val, 0)
        operationName = "Sum"
        break
      case "stdDev":
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length
        const squareDiffs = data.map((val) => Math.pow(val - mean, 2))
        result = Math.sqrt(squareDiffs.reduce((sum, val) => sum + val, 0) / data.length)
        operationName = "Standard Deviation"
        break
      case "variance":
        const meanVar = data.reduce((sum, val) => sum + val, 0) / data.length
        const squareDiffsVar = data.map((val) => Math.pow(val - meanVar, 2))
        result = squareDiffsVar.reduce((sum, val) => sum + val, 0) / data.length
        operationName = "Variance"
        break
      case "range":
        result = Math.max(...data) - Math.min(...data)
        operationName = "Range"
        break
    }

    // Update results
    setResults({
      ...results,
      [operation]: result,
    })

    // Update calculator display and history
    dispatch({ type: "SET_DISPLAY", payload: result.toString() })
    dispatch({
      type: "ADD_TO_HISTORY",
      payload: `${operationName} = ${result}`,
    })
  }

  const calculateAll = () => {
    calculateStatistics("mean")
    calculateStatistics("median")
    calculateStatistics("min")
    calculateStatistics("max")
    calculateStatistics("sum")
    calculateStatistics("stdDev")
    calculateStatistics("variance")
    calculateStatistics("range")
  }

  const chartData = dataArray.map((value, index) => ({
    name: `#${index + 1}`,
    value,
  }))

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-yellow-400 text-xs mb-1">Enter Data (comma or space separated)</div>
        <textarea
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          className="w-full h-20 bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
          placeholder="e.g. 5, 10, 15, 20, 25"
        />
        <div className="flex justify-end mt-1">
          <CalculatorButton onClick={() => parseData()} variant="orange" className="text-sm">
            Parse Data
          </CalculatorButton>
        </div>
      </div>

      {dataArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 p-2 rounded-lg border border-gray-800"
        >
          <div className="text-yellow-400 text-xs mb-1">Data Visualization</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: "#9ca3af" }} />
              <YAxis tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                itemStyle={{ color: "#f97316" }}
              />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton onClick={() => calculateStatistics("mean")} variant="blue" className="text-sm">
          Mean
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("median")} variant="blue" className="text-sm">
          Median
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("min")} variant="blue" className="text-sm">
          Min
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("max")} variant="blue" className="text-sm">
          Max
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("sum")} variant="blue" className="text-sm">
          Sum
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("stdDev")} variant="blue" className="text-sm">
          Std Dev
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("variance")} variant="blue" className="text-sm">
          Variance
        </CalculatorButton>
        <CalculatorButton onClick={() => calculateStatistics("range")} variant="blue" className="text-sm">
          Range
        </CalculatorButton>
      </div>

      <CalculatorButton onClick={calculateAll} variant="orange">
        Calculate All
      </CalculatorButton>

      {Object.keys(results).length > 0 && (
        <div className="bg-gray-900 p-2 rounded-lg border border-gray-800">
          <div className="text-yellow-400 text-xs mb-1">Results</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-300 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className="text-orange-500 text-sm">{value.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
