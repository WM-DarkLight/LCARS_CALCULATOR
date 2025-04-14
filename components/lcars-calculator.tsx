"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LcarsPanel } from "./lcars-elements/lcars-panel"
import LcarsDisplay from "./calculator-parts/lcars-display"
import LcarsKeypad from "./calculator-parts/lcars-keypad"
import LcarsHistory from "./calculator-parts/lcars-history"
import LcarsMemory from "./calculator-parts/lcars-memory"
import LcarsModeSelector from "./calculator-parts/lcars-mode-selector"
import LcarsGraphing from "./calculator-parts/lcars-graphing"
import LcarsMatrix from "./calculator-parts/lcars-matrix"
import LcarsStatistics from "./calculator-parts/lcars-statistics"
import LcarsAstronomy from "./calculator-parts/astronomy/lcars-astronomy"
import LcarsTrek from "./calculator-parts/lcars-trek"
import LcarsFinancial from "./calculator-parts/lcars-financial"
import LcarsVoiceControl from "./calculator-parts/lcars-voice-control"
import LcarsStepSolution from "./calculator-parts/lcars-step-solution"
import LcarsCalculationTape from "./calculator-parts/lcars-calculation-tape"
import LcarsFormulaReference from "./calculator-parts/lcars-formula-reference"
import LcarsConstantsReference from "./calculator-parts/lcars-constants-reference"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { useSound } from "@/hooks/use-sound"
import { useEasterEggs } from "@/hooks/use-easter-eggs"
import { useKeyboardInput } from "@/hooks/use-keyboard-input"
import { Tribble } from "./easter-eggs/tribble"
import { RedAlert } from "./easter-eggs/red-alert"
import { SelfDestruct } from "./easter-eggs/self-destruct"
import { WarpEffect } from "./easter-eggs/warp-effect"
import { CaptainsLog } from "./easter-eggs/captains-log"
import { TrekDatabase } from "./easter-eggs/trek-database"
import { KlingonText } from "./easter-eggs/klingon-mode"
import type { CalculatorMode } from "@/lib/calculator-types"
import MemoryIndicator from "./calculator-parts/lcars-memory-indicator"
import { Calculator, History, FileText, Keyboard, HelpCircle, BookOpen, Sigma, DollarSign } from "lucide-react"
import { CalculatorButton } from "./ui/calculator-button"
import { translateToKlingon } from "@/lib/klingon-translator"

interface LcarsCalculatorProps {
  initialized: boolean
}

// Mock translateToKlingon function (replace with actual implementation if available)
// const translateToKlingon = (text: string): string => {
//   // This is a placeholder.  A real implementation would translate the text.
//   return `Klingon: ${text}`;
// };

export default function LcarsCalculator({ initialized }: LcarsCalculatorProps) {
  const [activeMode, setActiveMode] = useState<CalculatorMode>("standard")
  const [showHistory, setShowHistory] = useState(false)
  const [showVoiceControl, setShowVoiceControl] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showStepSolution, setShowStepSolution] = useState(false)
  const [showCalculationTape, setShowCalculationTape] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showFormulaReference, setShowFormulaReference] = useState(false)
  const [showConstantsReference, setShowConstantsReference] = useState(false)
  const { playBeep } = useSound()
  const { state, dispatch } = useCalculatorContext()
  const {
    redAlertActive,
    selfDestructActive,
    warpDriveActive,
    tribbleActive,
    klingonMode,
    captainsLogOpen,
    databaseOpen,
    easterEggMessage,
    trackButtonPress,
    toggleKlingonMode,
    toggleCaptainsLog,
    toggleDatabase,
  } = useEasterEggs()

  // Initialize keyboard input
  useKeyboardInput()

  // Animation when calculator is initialized
  useEffect(() => {
    if (initialized) {
      playBeep("init")
    }
  }, [initialized, playBeep])

  const handleModeChange = (mode: CalculatorMode) => {
    playBeep("mode")
    setActiveMode(mode)
    trackButtonPress(mode)
  }

  const toggleHistory = () => {
    playBeep("ui")
    setShowHistory(!showHistory)
    setShowCalculationTape(false)
    setShowStepSolution(false)
    setShowFormulaReference(false)
    setShowConstantsReference(false)
  }

  const toggleVoiceControl = () => {
    playBeep("ui")
    setShowVoiceControl(!showVoiceControl)
  }

  const toggleFullscreen = () => {
    playBeep("ui")
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
    setShowFullscreen(!showFullscreen)
  }

  const toggleStepSolution = () => {
    playBeep("ui")
    setShowStepSolution(!showStepSolution)
    setShowHistory(false)
    setShowCalculationTape(false)
    setShowFormulaReference(false)
    setShowConstantsReference(false)
  }

  const toggleCalculationTape = () => {
    playBeep("ui")
    setShowCalculationTape(!showCalculationTape)
    setShowHistory(false)
    setShowStepSolution(false)
    setShowFormulaReference(false)
    setShowConstantsReference(false)
  }

  const toggleKeyboardHelp = () => {
    playBeep("ui")
    setShowKeyboardHelp(!showKeyboardHelp)
  }

  const toggleFormulaReference = () => {
    playBeep("ui")
    setShowFormulaReference(!showFormulaReference)
    setShowHistory(false)
    setShowStepSolution(false)
    setShowCalculationTape(false)
    setShowConstantsReference(false)
  }

  const toggleConstantsReference = () => {
    playBeep("ui")
    setShowConstantsReference(!showConstantsReference)
    setShowHistory(false)
    setShowStepSolution(false)
    setShowCalculationTape(false)
    setShowFormulaReference(false)
  }

  // Secret key combination for Klingon mode (press K + L + I + N + G + O + N in sequence)
  useEffect(() => {
    const klingonSequence = ["k", "l", "i", "n", "g", "o", "n"]
    let currentIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === klingonSequence[currentIndex]) {
        currentIndex++
        if (currentIndex === klingonSequence.length) {
          toggleKlingonMode()
          currentIndex = 0
        }
      } else {
        currentIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleKlingonMode])

  // Secret key combination for Captain's Log (press L + O + G in sequence)
  useEffect(() => {
    const logSequence = ["l", "o", "g"]
    let currentIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === logSequence[currentIndex]) {
        currentIndex++
        if (currentIndex === logSequence.length) {
          toggleCaptainsLog()
          currentIndex = 0
        }
      } else {
        currentIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleCaptainsLog])

  // Secret key combination for Database (press D + B in sequence)
  useEffect(() => {
    const dbSequence = ["d", "b"]
    let currentIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === dbSequence[currentIndex]) {
        currentIndex++
        if (currentIndex === dbSequence.length) {
          toggleDatabase()
          currentIndex = 0
        }
      } else {
        currentIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleDatabase])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full transition-all duration-300"
    >
      {/* Easter Egg Effects */}
      <AnimatePresence>
        {redAlertActive && <RedAlert />}
        {selfDestructActive && <SelfDestruct />}
        {warpDriveActive && <WarpEffect />}
        {tribbleActive && <Tribble />}
        {captainsLogOpen && <CaptainsLog onClose={toggleCaptainsLog} history={state.history} />}
        {databaseOpen && <TrekDatabase onClose={toggleDatabase} klingonMode={klingonMode} />}
      </AnimatePresence>

      {/* Easter Egg Message */}
      <AnimatePresence>
        {easterEggMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 border-2 border-orange-500 rounded-lg p-3 z-50"
          >
            <KlingonText enabled={klingonMode}>{easterEggMessage}</KlingonText>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Help Modal */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setShowKeyboardHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 border-2 border-orange-500 rounded-lg p-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-orange-500 text-xl">
                  <KlingonText enabled={klingonMode}>Keyboard Shortcuts</KlingonText>
                </h2>
                <CalculatorButton
                  onClick={() => setShowKeyboardHelp(false)}
                  variant="pink"
                  className="text-xs px-2 py-1"
                >
                  <KlingonText enabled={klingonMode}>CLOSE</KlingonText>
                </CalculatorButton>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-yellow-400">0-9</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Number input</KlingonText>
                </div>
                <div className="text-yellow-400">+, -, *, /</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Basic operations</KlingonText>
                </div>
                <div className="text-yellow-400">.</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Decimal point</KlingonText>
                </div>
                <div className="text-yellow-400">Enter, =</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Calculate result</KlingonText>
                </div>
                <div className="text-yellow-400">Backspace</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Delete last character</KlingonText>
                </div>
                <div className="text-yellow-400">Delete</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Clear entry (CE)</KlingonText>
                </div>
                <div className="text-yellow-400">Escape</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Clear all (C)</KlingonText>
                </div>
                <div className="text-yellow-400">(, )</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Parentheses</KlingonText>
                </div>
                <div className="text-yellow-400">%</div>
                <div className="text-gray-300">
                  <KlingonText enabled={klingonMode}>Percent</KlingonText>
                </div>
              </div>
              <div className="mt-4 text-gray-500 text-xs">
                <KlingonText enabled={klingonMode}>
                  Secret keyboard combinations: Try typing "klingon", "log", or "db"
                </KlingonText>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main calculator panel */}
        <div className="lg:col-span-2">
          <LcarsPanel>
            <div className="flex justify-between items-center p-2 bg-gray-900">
              <div className="flex space-x-2">
                <CalculatorButton
                  onClick={toggleCalculationTape}
                  variant={showCalculationTape ? "orange" : "dark"}
                  className="text-xs px-2 py-1"
                  title="Calculation Tape"
                >
                  <FileText size={14} />
                </CalculatorButton>
                <CalculatorButton
                  onClick={toggleStepSolution}
                  variant={showStepSolution ? "orange" : "dark"}
                  className="text-xs px-2 py-1"
                  title="Step-by-Step Solution"
                >
                  <Calculator size={14} />
                </CalculatorButton>
                <CalculatorButton
                  onClick={toggleHistory}
                  variant={showHistory ? "orange" : "dark"}
                  className="text-xs px-2 py-1"
                  title="History"
                >
                  <History size={14} />
                </CalculatorButton>
              </div>
              <div className="flex space-x-2">
                <CalculatorButton
                  onClick={toggleFormulaReference}
                  variant={showFormulaReference ? "orange" : "dark"}
                  className="text-xs px-2 py-1"
                  title="Formula Reference"
                >
                  <BookOpen size={14} />
                </CalculatorButton>
                <CalculatorButton
                  onClick={toggleConstantsReference}
                  variant={showConstantsReference ? "orange" : "dark"}
                  className="text-xs px-2 py-1"
                  title="Constants Reference"
                >
                  <Sigma size={14} />
                </CalculatorButton>
                <CalculatorButton
                  onClick={toggleKeyboardHelp}
                  variant="dark"
                  className="text-xs px-2 py-1"
                  title="Keyboard Shortcuts"
                >
                  <Keyboard size={14} />
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => window.open("https://github.com/vercel/v0", "_blank")}
                  variant="dark"
                  className="text-xs px-2 py-1"
                  title="Help"
                >
                  <HelpCircle size={14} />
                </CalculatorButton>
              </div>
            </div>

            <LcarsDisplay
              display={state.display}
              equation={state.equation}
              mode={activeMode}
              memory={state.memory}
              angleUnit={state.angleUnit}
              base={state.base}
              klingonMode={klingonMode}
            />
            <MemoryIndicator action={state.lastMemoryAction} />

            <LcarsModeSelector
              currentMode={activeMode}
              onModeChange={handleModeChange}
              showHistory={showHistory}
              onToggleHistory={toggleHistory}
              onToggleVoice={toggleVoiceControl}
              onToggleFullscreen={toggleFullscreen}
              klingonMode={klingonMode}
            />

            <AnimatePresence>
              {showHistory && <LcarsHistory history={state.history} klingonMode={klingonMode} />}
              {showStepSolution && (
                <LcarsStepSolution
                  expression={state.fullExpression}
                  result={state.display}
                  klingonMode={klingonMode}
                  onClose={() => setShowStepSolution(false)}
                />
              )}
              {showCalculationTape && (
                <LcarsCalculationTape klingonMode={klingonMode} onClose={() => setShowCalculationTape(false)} />
              )}
              {showFormulaReference && (
                <LcarsFormulaReference klingonMode={klingonMode} onClose={() => setShowFormulaReference(false)} />
              )}
              {showConstantsReference && (
                <LcarsConstantsReference klingonMode={klingonMode} onClose={() => setShowConstantsReference(false)} />
              )}
            </AnimatePresence>

            <LcarsMemory memory={state.memory} klingonMode={klingonMode} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {activeMode === "standard" && <LcarsKeypad mode="standard" trackButtonPress={trackButtonPress} />}
                {activeMode === "scientific" && <LcarsKeypad mode="scientific" trackButtonPress={trackButtonPress} />}
                {activeMode === "programmer" && <LcarsKeypad mode="programmer" trackButtonPress={trackButtonPress} />}
                {activeMode === "converter" && <LcarsKeypad mode="converter" trackButtonPress={trackButtonPress} />}
                {activeMode === "graphing" && <LcarsGraphing />}
                {activeMode === "matrix" && <LcarsMatrix />}
                {activeMode === "statistics" && <LcarsStatistics />}
                {activeMode === "astronomy" && <LcarsAstronomy />}
                {activeMode === "trek" && <LcarsTrek />}
                {activeMode === "financial" && <LcarsFinancial klingonMode={klingonMode} />}
              </motion.div>
            </AnimatePresence>
          </LcarsPanel>
        </div>

        {/* Side panel with additional information */}
        <div className="lg:col-span-1">
          <LcarsPanel>
            {showVoiceControl ? (
              <LcarsVoiceControl onClose={toggleVoiceControl} klingonMode={klingonMode} />
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-16 bg-orange-500 rounded-full"></div>
                  <div className="h-4 w-24 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="text-yellow-400 mb-2">
                  <KlingonText enabled={klingonMode}>SYSTEM STATUS</KlingonText>
                </div>
                <div className="grid gap-2">
                  <StatusItem label="Quantum Core" value="ONLINE" status="green" klingonMode={klingonMode} />
                  <StatusItem
                    label="Memory Banks"
                    value={`${state.memory !== 0 ? "IN USE" : "READY"}`}
                    status="green"
                    klingonMode={klingonMode}
                  />
                  <StatusItem
                    label="Calculation Mode"
                    value={activeMode.toUpperCase()}
                    status="blue"
                    klingonMode={klingonMode}
                  />
                  <StatusItem label="Precision Level" value="HIGH" status="green" klingonMode={klingonMode} />
                  <StatusItem
                    label="Voice Interface"
                    value={showVoiceControl ? "ACTIVE" : "STANDBY"}
                    status="yellow"
                    klingonMode={klingonMode}
                  />
                  <StatusItem
                    label="Translation Matrix"
                    value={klingonMode ? "KLINGON" : "FEDERATION STANDARD"}
                    status={klingonMode ? "pink" : "green"}
                    klingonMode={klingonMode}
                  />
                </div>

                {/* Quick access buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <CalculatorButton
                    onClick={() => handleModeChange("financial")}
                    variant={activeMode === "financial" ? "orange" : "dark"}
                    className="text-xs flex items-center justify-center gap-1"
                  >
                    <DollarSign size={14} />
                    <KlingonText enabled={klingonMode}>Financial</KlingonText>
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={toggleFormulaReference}
                    variant={showFormulaReference ? "orange" : "dark"}
                    className="text-xs flex items-center justify-center gap-1"
                  >
                    <BookOpen size={14} />
                    <KlingonText enabled={klingonMode}>Formulas</KlingonText>
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={toggleConstantsReference}
                    variant={showConstantsReference ? "orange" : "dark"}
                    className="text-xs flex items-center justify-center gap-1"
                  >
                    <Sigma size={14} />
                    <KlingonText enabled={klingonMode}>Constants</KlingonText>
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={toggleCaptainsLog}
                    variant="dark"
                    className="text-xs flex items-center justify-center gap-1"
                  >
                    <FileText size={14} />
                    <KlingonText enabled={klingonMode}>Log</KlingonText>
                  </CalculatorButton>
                </div>

                <div className="text-yellow-400 mt-6 mb-2">
                  <KlingonText enabled={klingonMode}>RECENT CALCULATIONS</KlingonText>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {state.history.slice(-5).map((item, index) => (
                    <div key={index} className="text-orange-500 text-sm mb-1 font-mono">
                      {klingonMode ? translateToKlingon(item) : item}
                    </div>
                  ))}
                  {state.history.length === 0 && (
                    <div className="text-gray-500 text-sm">
                      <KlingonText enabled={klingonMode}>No calculations yet</KlingonText>
                    </div>
                  )}
                </div>

                <WarpCoreAnimation />

                {/* Calculator tips */}
                <div className="mt-6 bg-gray-900 p-3 rounded-lg">
                  <div className="text-yellow-400 text-sm mb-2">
                    <KlingonText enabled={klingonMode}>CALCULATOR TIPS</KlingonText>
                  </div>
                  <div className="text-gray-300 text-xs space-y-2">
                    <p>
                      <KlingonText enabled={klingonMode}>
                        • Use parentheses for complex expressions: (2+3)×4
                      </KlingonText>
                    </p>
                    <p>
                      <KlingonText enabled={klingonMode}>
                        • Press the INV button to access inverse functions
                      </KlingonText>
                    </p>
                    <p>
                      <KlingonText enabled={klingonMode}>• Click on any history item to recall the result</KlingonText>
                    </p>
                    <p>
                      <KlingonText enabled={klingonMode}>• Use keyboard shortcuts for faster calculations</KlingonText>
                    </p>
                    <p>
                      <KlingonText enabled={klingonMode}>
                        • Try the new financial calculator for loan and investment calculations
                      </KlingonText>
                    </p>
                  </div>
                </div>

                {/* Easter egg hint */}
                <div className="mt-4 text-gray-700 text-xs text-center">
                  LCARS v47.A.3 - Try the Konami code, type "klingon", "log", or enter "47471"
                </div>
              </div>
            )}
          </LcarsPanel>
        </div>
      </div>
    </motion.div>
  )
}

function StatusItem({
  label,
  value,
  status,
  klingonMode,
}: {
  label: string
  value: string
  status: "green" | "yellow" | "blue" | "pink"
  klingonMode: boolean
}) {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    pink: "bg-pink-500",
  }

  return (
    <div className="flex items-center justify-between bg-gray-900 p-2 rounded">
      <div className="text-sm text-gray-300">
        <KlingonText enabled={klingonMode}>{label}</KlingonText>
      </div>
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${statusColors[status]}`}></div>
        <div className="text-sm text-orange-500">
          <KlingonText enabled={klingonMode}>{value}</KlingonText>
        </div>
      </div>
    </div>
  )
}

function WarpCoreAnimation() {
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="text-yellow-400 mb-2 text-sm">WARP CORE STATUS</div>
      <div className="h-40 w-8 bg-gray-900 rounded-full relative flex flex-col items-center justify-between p-1">
        <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
        <WarpPulse />
        <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
      </div>
      <div className="text-blue-400 mt-2 text-xs">MATTER/ANTIMATTER FLOW: NOMINAL</div>
    </div>
  )
}

function WarpPulse() {
  return (
    <div className="relative h-20 w-full flex items-center justify-center">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute h-4 w-4 bg-blue-400 rounded-full opacity-80"
          animate={{
            opacity: [0.8, 0.2, 0.8],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}
