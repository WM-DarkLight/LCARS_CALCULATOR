"use client"

import { useState, useEffect } from "react"
import { CalculatorIcon, X, Divide, Minus, Plus, Equal, Delete, Percent, Square, RotateCcw } from "lucide-react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [equation, setEquation] = useState("")
  const [isNewInput, setIsNewInput] = useState(true)
  const [memory, setMemory] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([])
  const [stardate, setStardate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [scientificMode, setScientificMode] = useState(false)

  // Generate a Star Trek style stardate
  useEffect(() => {
    const updateStardate = () => {
      const now = new Date()
      const year = now.getFullYear() - 2323 // Assuming TNG era
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
      const decimal = Math.floor((now.getHours() * 100) / 24)
      setStardate(`${year}${dayOfYear}.${decimal}`)
    }

    updateStardate()
    const interval = setInterval(updateStardate, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNumberClick = (num: string) => {
    if (isNewInput || display === "0") {
      setDisplay(num)
      setIsNewInput(false)
    } else {
      setDisplay(display + num)
    }
  }

  const handleDecimalClick = () => {
    if (isNewInput) {
      setDisplay("0.")
      setIsNewInput(false)
    } else if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const handleOperatorClick = (operator: string) => {
    setEquation(display + " " + operator + " ")
    setIsNewInput(true)
  }

  const handleEqualsClick = () => {
    try {
      // Create a safe evaluation of the expression
      const fullEquation = equation + display
      // eslint-disable-next-line no-eval
      const result = eval(fullEquation)
      setDisplay(String(result))
      setHistory([...history, `${fullEquation} = ${result}`])
      setEquation("")
      setIsNewInput(true)
    } catch (error) {
      setDisplay("Error")
      setIsNewInput(true)
    }
  }

  const handleClearClick = () => {
    setDisplay("0")
    setEquation("")
    setIsNewInput(true)
  }

  const handleBackspaceClick = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
      setIsNewInput(true)
    }
  }

  const handlePercentClick = () => {
    try {
      const value = Number.parseFloat(display) / 100
      setDisplay(String(value))
    } catch (error) {
      setDisplay("Error")
    }
    setIsNewInput(true)
  }

  const handleSquareRootClick = () => {
    try {
      const value = Math.sqrt(Number.parseFloat(display))
      setDisplay(String(value))
      setHistory([...history, `√(${display}) = ${value}`])
    } catch (error) {
      setDisplay("Error")
    }
    setIsNewInput(true)
  }

  const handleSquareClick = () => {
    try {
      const value = Math.pow(Number.parseFloat(display), 2)
      setDisplay(String(value))
      setHistory([...history, `${display}² = ${value}`])
    } catch (error) {
      setDisplay("Error")
    }
    setIsNewInput(true)
  }

  const handleMemoryAdd = () => {
    setMemory(memory + Number.parseFloat(display))
  }

  const handleMemorySubtract = () => {
    setMemory(memory - Number.parseFloat(display))
  }

  const handleMemoryRecall = () => {
    setDisplay(String(memory))
    setIsNewInput(true)
  }

  const handleMemoryClear = () => {
    setMemory(0)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const toggleScientificMode = () => {
    setScientificMode(!scientificMode)
  }

  return (
    <div className="w-full max-w-md transition-all duration-300">
      <div className="bg-black rounded-lg overflow-hidden border-2 border-yellow-500">
        {/* LCARS Header */}
        <div className="flex items-center bg-black p-2">
          <div className="h-8 w-16 bg-orange-500 rounded-l-full"></div>
          <div className="h-8 flex-grow bg-yellow-400 mx-1"></div>
          <div className="h-8 w-24 bg-pink-500 rounded-r-full"></div>
        </div>

        {/* Stardate Display */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-900">
          <div className="text-yellow-400 text-sm">STARDATE</div>
          <div className="text-orange-500 font-mono">{stardate}</div>
        </div>

        {/* Display */}
        <div className="p-4 bg-black">
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 w-16 bg-orange-500 rounded-full"></div>
            <div className="h-4 w-24 bg-yellow-400 rounded-full"></div>
            <div className="h-4 w-12 bg-pink-500 rounded-full"></div>
          </div>
          <div className="bg-black text-right p-4 rounded-lg mb-2 border border-gray-800">
            <div className="text-yellow-400 text-sm h-6">{equation}</div>
            <div className="text-orange-500 text-3xl font-mono overflow-x-auto">{display}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-yellow-400 rounded-full"></div>
            <div className="h-4 w-16 bg-orange-500 rounded-full"></div>
            <div className="h-4 w-20 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-between px-4 py-2 bg-gray-900">
          <button
            onClick={toggleScientificMode}
            className="text-yellow-400 bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors"
          >
            {scientificMode ? "STANDARD MODE" : "SCIENTIFIC MODE"}
          </button>
          <button
            onClick={toggleHistory}
            className="text-orange-500 bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors"
          >
            {showHistory ? "HIDE LOG" : "SHOW LOG"}
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-gray-900 p-4 max-h-40 overflow-y-auto">
            <div className="text-yellow-400 mb-2 text-sm">CALCULATION LOG</div>
            {history.length === 0 ? (
              <div className="text-gray-500 text-sm">No calculations yet</div>
            ) : (
              history.map((item, index) => (
                <div key={index} className="text-orange-500 text-sm mb-1 font-mono">
                  {item}
                </div>
              ))
            )}
          </div>
        )}

        {/* Memory Display */}
        <div className="flex justify-between px-4 py-2 bg-gray-900 border-t border-gray-800">
          <div className="text-yellow-400 text-sm">MEMORY</div>
          <div className="text-orange-500 font-mono">{memory}</div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-900">
          {/* Top row */}
          <button
            onClick={handleClearClick}
            className="col-span-1 bg-orange-500 text-black p-3 rounded-l-full flex items-center justify-center font-bold hover:bg-orange-400 active:bg-orange-600 transition-colors"
          >
            C
          </button>
          <button
            onClick={handleBackspaceClick}
            className="bg-pink-500 text-black p-3 rounded-lg flex items-center justify-center hover:bg-pink-400 active:bg-pink-600 transition-colors"
          >
            <Delete size={18} />
          </button>
          <button
            onClick={handlePercentClick}
            className="bg-yellow-400 text-black p-3 rounded-lg flex items-center justify-center hover:bg-yellow-300 active:bg-yellow-500 transition-colors"
          >
            <Percent size={18} />
          </button>
          <button
            onClick={() => handleOperatorClick("/")}
            className="bg-yellow-400 text-black p-3 rounded-r-full flex items-center justify-center hover:bg-yellow-300 active:bg-yellow-500 transition-colors"
          >
            <Divide size={18} />
          </button>

          {/* Memory row */}
          <button
            onClick={handleMemoryClear}
            className="bg-blue-400 text-black p-3 rounded-lg flex items-center justify-center text-sm hover:bg-blue-300 active:bg-blue-500 transition-colors"
          >
            MC
          </button>
          <button
            onClick={handleMemoryRecall}
            className="bg-blue-400 text-black p-3 rounded-lg flex items-center justify-center text-sm hover:bg-blue-300 active:bg-blue-500 transition-colors"
          >
            MR
          </button>
          <button
            onClick={handleMemorySubtract}
            className="bg-blue-400 text-black p-3 rounded-lg flex items-center justify-center text-sm hover:bg-blue-300 active:bg-blue-500 transition-colors"
          >
            M-
          </button>
          <button
            onClick={handleMemoryAdd}
            className="bg-blue-400 text-black p-3 rounded-lg flex items-center justify-center text-sm hover:bg-blue-300 active:bg-blue-500 transition-colors"
          >
            M+
          </button>

          {/* Scientific functions (conditional) */}
          {scientificMode && (
            <>
              <button
                onClick={handleSquareRootClick}
                className="bg-pink-500 text-black p-3 rounded-lg flex items-center justify-center hover:bg-pink-400 active:bg-pink-600 transition-colors"
              >
                √
              </button>
              <button
                onClick={handleSquareClick}
                className="bg-pink-500 text-black p-3 rounded-lg flex items-center justify-center hover:bg-pink-400 active:bg-pink-600 transition-colors"
              >
                <Square size={18} />
              </button>
              <button
                onClick={() => handleOperatorClick("**")}
                className="bg-pink-500 text-black p-3 rounded-lg flex items-center justify-center hover:bg-pink-400 active:bg-pink-600 transition-colors"
              >
                x^y
              </button>
              <button
                onClick={() => {
                  try {
                    setDisplay(String(1 / Number.parseFloat(display)))
                    setHistory([...history, `1/${display} = ${1 / Number.parseFloat(display)}`])
                  } catch (error) {
                    setDisplay("Error")
                  }
                  setIsNewInput(true)
                }}
                className="bg-pink-500 text-black p-3 rounded-lg flex items-center justify-center hover:bg-pink-400 active:bg-pink-600 transition-colors"
              >
                1/x
              </button>
            </>
          )}

          {/* Number grid */}
          <div className={`${scientificMode ? "col-span-3" : "col-span-3"} grid grid-cols-3 gap-2`}>
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="bg-gray-800 text-orange-500 p-3 rounded-lg flex items-center justify-center text-xl hover:bg-gray-700 active:bg-gray-900 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberClick("0")}
              className="bg-gray-800 text-orange-500 p-3 rounded-lg flex items-center justify-center text-xl col-span-2 hover:bg-gray-700 active:bg-gray-900 transition-colors"
            >
              0
            </button>
            <button
              onClick={handleDecimalClick}
              className="bg-gray-800 text-orange-500 p-3 rounded-lg flex items-center justify-center text-xl hover:bg-gray-700 active:bg-gray-900 transition-colors"
            >
              .
            </button>
          </div>

          {/* Operators column */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleOperatorClick("*")}
              className="bg-yellow-400 text-black p-3 rounded-lg flex items-center justify-center hover:bg-yellow-300 active:bg-yellow-500 transition-colors"
            >
              <X size={18} />
            </button>
            <button
              onClick={() => handleOperatorClick("-")}
              className="bg-yellow-400 text-black p-3 rounded-lg flex items-center justify-center hover:bg-yellow-300 active:bg-yellow-500 transition-colors"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => handleOperatorClick("+")}
              className="bg-yellow-400 text-black p-3 rounded-lg flex items-center justify-center hover:bg-yellow-300 active:bg-yellow-500 transition-colors"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={handleEqualsClick}
              className="bg-orange-500 text-black p-3 rounded-lg flex-grow flex items-center justify-center hover:bg-orange-400 active:bg-orange-600 transition-colors"
            >
              <Equal size={18} />
            </button>
          </div>
        </div>

        {/* Bottom LCARS elements */}
        <div className="flex justify-between p-3 bg-black">
          <div className="h-6 w-32 bg-orange-500 rounded-l-full"></div>
          <div className="h-6 flex-grow bg-yellow-400 mx-1"></div>
          <div className="h-6 w-16 bg-pink-500 rounded-r-full"></div>
        </div>

        {/* LCARS footer element */}
        <div className="flex items-center justify-between bg-black p-3">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
              <CalculatorIcon size={16} className="text-black" />
            </div>
            <div className="h-4 w-32 bg-yellow-400 rounded-r-full ml-1"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-24 bg-pink-500 rounded-l-full mr-1"></div>
            <div className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center">
              <RotateCcw size={16} className="text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
