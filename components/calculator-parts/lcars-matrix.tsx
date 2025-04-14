"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useCalculatorContext } from "@/hooks/use-calculator-context"

export default function LcarsMatrix() {
  const { dispatch } = useCalculatorContext()
  const [matrixA, setMatrixA] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
  const [matrixB, setMatrixB] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
  const [result, setResult] = useState<number[][]>([])
  const [activeMatrix, setActiveMatrix] = useState<"A" | "B">("A")
  const [size, setSize] = useState<"2x2" | "3x3">("3x3")

  const handleCellChange = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const numValue = value === "" ? 0 : Number(value)
    if (matrix === "A") {
      const newMatrix = [...matrixA]
      newMatrix[row][col] = numValue
      setMatrixA(newMatrix)
    } else {
      const newMatrix = [...matrixB]
      newMatrix[row][col] = numValue
      setMatrixB(newMatrix)
    }
  }

  const handleSizeChange = (newSize: "2x2" | "3x3") => {
    setSize(newSize)
    if (newSize === "2x2") {
      setMatrixA([
        [matrixA[0][0], matrixA[0][1]],
        [matrixA[1][0], matrixA[1][1]],
      ])
      setMatrixB([
        [matrixB[0][0], matrixB[0][1]],
        [matrixB[1][0], matrixB[1][1]],
      ])
    } else {
      setMatrixA([
        [matrixA[0][0], matrixA[0][1], 0],
        [matrixA[1][0], matrixA[1][1], 0],
        [0, 0, 1],
      ])
      setMatrixB([
        [matrixB[0][0], matrixB[0][1], 0],
        [matrixB[1][0], matrixB[1][1], 0],
        [0, 0, 1],
      ])
    }
    setResult([])
  }

  const calculateDeterminant = (matrix: number[][]) => {
    if (size === "2x2") {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    } else {
      return (
        matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
        matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
        matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
      )
    }
  }

  const calculateInverse = (matrix: number[][]) => {
    const det = calculateDeterminant(matrix)
    if (det === 0) {
      dispatch({
        type: "ADD_TO_HISTORY",
        payload: "Matrix inverse calculation failed: determinant is zero",
      })
      return null
    }

    if (size === "2x2") {
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det],
      ]
    } else {
      // 3x3 inverse calculation (using cofactors)
      const cofactors = [
        [
          matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1],
          -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]),
          matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0],
        ],
        [
          -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]),
          matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0],
          -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]),
        ],
        [
          matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1],
          -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]),
          matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
        ],
      ]

      // Transpose and divide by determinant
      return [
        [cofactors[0][0] / det, cofactors[1][0] / det, cofactors[2][0] / det],
        [cofactors[0][1] / det, cofactors[1][1] / det, cofactors[2][1] / det],
        [cofactors[0][2] / det, cofactors[1][2] / det, cofactors[2][2] / det],
      ]
    }
  }

  const performOperation = (operation: string) => {
    let resultMatrix: number[][] = []
    let operationDescription = ""

    switch (operation) {
      case "add":
        resultMatrix = matrixA.map((row, i) => row.map((cell, j) => cell + matrixB[i][j]))
        operationDescription = "Matrix A + Matrix B"
        break
      case "subtract":
        resultMatrix = matrixA.map((row, i) => row.map((cell, j) => cell - matrixB[i][j]))
        operationDescription = "Matrix A - Matrix B"
        break
      case "multiply":
        const matrixSize = size === "2x2" ? 2 : 3
        resultMatrix = Array(matrixSize)
          .fill(0)
          .map(() => Array(matrixSize).fill(0))

        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            for (let k = 0; k < matrixSize; k++) {
              resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j]
            }
          }
        }
        operationDescription = "Matrix A × Matrix B"
        break
      case "determinantA":
        const detA = calculateDeterminant(matrixA)
        dispatch({
          type: "ADD_TO_HISTORY",
          payload: `det(Matrix A) = ${detA}`,
        })
        dispatch({ type: "SET_DISPLAY", payload: detA.toString() })
        return
      case "determinantB":
        const detB = calculateDeterminant(matrixB)
        dispatch({
          type: "ADD_TO_HISTORY",
          payload: `det(Matrix B) = ${detB}`,
        })
        dispatch({ type: "SET_DISPLAY", payload: detB.toString() })
        return
      case "inverseA":
        resultMatrix = calculateInverse(matrixA) || []
        operationDescription = "Inverse of Matrix A"
        break
      case "inverseB":
        resultMatrix = calculateInverse(matrixB) || []
        operationDescription = "Inverse of Matrix B"
        break
      case "transposeA":
        resultMatrix = matrixA[0].map((_, colIndex) => matrixA.map((row) => row[colIndex]))
        operationDescription = "Transpose of Matrix A"
        break
      case "transposeB":
        resultMatrix = matrixB[0].map((_, colIndex) => matrixB.map((row) => row[colIndex]))
        operationDescription = "Transpose of Matrix B"
        break
      default:
        return
    }

    setResult(resultMatrix)
    dispatch({
      type: "ADD_TO_HISTORY",
      payload: `${operationDescription} calculated`,
    })
  }

  const renderMatrix = (matrix: number[][], matrixName: "A" | "B" | "Result") => {
    const isEditable = matrixName !== "Result"
    const isActive = isEditable && activeMatrix === matrixName
    const matrixSize = size === "2x2" ? 2 : 3

    return (
      <div
        className={`p-2 rounded-lg ${
          isActive ? "border-2 border-orange-500" : "border border-gray-700"
        } ${matrixName === "Result" ? "bg-gray-900" : "bg-gray-800"}`}
        onClick={() => isEditable && setActiveMatrix(matrixName)}
      >
        <div className="text-yellow-400 text-xs mb-1">Matrix {matrixName}</div>
        <div className="grid gap-1">
          {Array(matrixSize)
            .fill(0)
            .map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {Array(matrixSize)
                  .fill(0)
                  .map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      value={matrix[rowIndex]?.[colIndex] || 0}
                      onChange={(e) =>
                        isEditable && handleCellChange(matrixName as "A" | "B", rowIndex, colIndex, e.target.value)
                      }
                      className="w-12 h-8 bg-gray-900 text-orange-500 text-center rounded border border-gray-700"
                      readOnly={!isEditable}
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <CalculatorButton
            onClick={() => handleSizeChange("2x2")}
            variant={size === "2x2" ? "orange" : "dark"}
            className="text-sm"
          >
            2×2
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleSizeChange("3x3")}
            variant={size === "3x3" ? "orange" : "dark"}
            className="text-sm"
          >
            3×3
          </CalculatorButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderMatrix(matrixA, "A")}
        {renderMatrix(matrixB, "B")}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton onClick={() => performOperation("add")} variant="yellow" className="text-sm">
          A + B
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation("subtract")} variant="yellow" className="text-sm">
          A - B
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation("multiply")} variant="yellow" className="text-sm">
          A × B
        </CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation(activeMatrix === "A" ? "determinantA" : "determinantB")}
          variant="blue"
          className="text-sm"
        >
          det({activeMatrix})
        </CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation(activeMatrix === "A" ? "inverseA" : "inverseB")}
          variant="blue"
          className="text-sm"
        >
          {activeMatrix}
          <sup>-1</sup>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation(activeMatrix === "A" ? "transposeA" : "transposeB")}
          variant="blue"
          className="text-sm"
        >
          {activeMatrix}
          <sup>T</sup>
        </CalculatorButton>
      </div>

      {result.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {renderMatrix(result, "Result")}
        </motion.div>
      )}
    </div>
  )
}
