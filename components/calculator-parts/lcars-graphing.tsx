"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { CalculatorButton } from "@/components/ui/calculator-button"

export default function LcarsGraphing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state, dispatch } = useCalculatorContext()
  const [equation, setEquation] = useState("x^2")
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-10)
  const [yMax, setYMax] = useState(10)

  // Parse and evaluate the equation
  const evaluateEquation = (x: number): number => {
    try {
      // Replace common math functions with Math.function
      const parsedEquation = equation
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/\^/g, "**")
        .replace(/pi/g, "Math.PI")
        .replace(/e/g, "Math.E")

      // eslint-disable-next-line no-new-func
      const func = new Function("x", `return ${parsedEquation}`)
      return func(x)
    } catch (error) {
      return Number.NaN
    }
  }

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5

    // Draw x and y axes
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1
    ctx.beginPath()

    // X-axis
    const yAxisPos = canvas.height * (yMax / (yMax - yMin))
    ctx.moveTo(0, yAxisPos)
    ctx.lineTo(canvas.width, yAxisPos)

    // Y-axis
    const xAxisPos = canvas.width * (-xMin / (xMax - xMin))
    ctx.moveTo(xAxisPos, 0)
    ctx.lineTo(xAxisPos, canvas.height)

    ctx.stroke()

    // Draw function
    ctx.strokeStyle = "#ff9500" // Orange
    ctx.lineWidth = 2
    ctx.beginPath()

    let isFirstPoint = true
    for (let px = 0; px < canvas.width; px++) {
      // Convert pixel to x coordinate
      const x = xMin + (px / canvas.width) * (xMax - xMin)

      // Evaluate function at x
      const y = evaluateEquation(x)

      // Convert y coordinate to pixel
      const py = canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height

      if (isFirstPoint) {
        ctx.moveTo(px, py)
        isFirstPoint = false
      } else {
        ctx.lineTo(px, py)
      }
    }

    ctx.stroke()

    // Update display with current equation
    dispatch({ type: "SET_DISPLAY", payload: equation })
  }, [equation, xMin, xMax, yMin, yMax, dispatch])

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEquation(e.target.value)
  }

  const handleZoomIn = () => {
    setXMin(xMin / 1.5)
    setXMax(xMax / 1.5)
    setYMin(yMin / 1.5)
    setYMax(yMax / 1.5)
  }

  const handleZoomOut = () => {
    setXMin(xMin * 1.5)
    setXMax(xMax * 1.5)
    setYMin(yMin * 1.5)
    setYMax(yMax * 1.5)
  }

  const handleReset = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-10)
    setYMax(10)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <div className="text-yellow-400 text-sm">f(x) =</div>
        <input
          type="text"
          value={equation}
          onChange={handleEquationChange}
          className="flex-grow bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
        <canvas ref={canvasRef} className="w-full h-64 bg-black rounded"></canvas>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <CalculatorButton onClick={handleZoomIn} variant="blue">
          Zoom In
        </CalculatorButton>
        <CalculatorButton onClick={handleZoomOut} variant="blue">
          Zoom Out
        </CalculatorButton>
        <CalculatorButton onClick={handleReset} variant="orange">
          Reset
        </CalculatorButton>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="text-yellow-400">X:</div>
          <div className="text-orange-500">
            [{xMin}, {xMax}]
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-yellow-400">Y:</div>
          <div className="text-orange-500">
            [{yMin}, {yMax}]
          </div>
        </div>
      </div>

      <div className="text-gray-500 text-xs">Examples: x^2, sin(x), cos(x), tan(x), sqrt(x), log(x), ln(x), abs(x)</div>
    </div>
  )
}
