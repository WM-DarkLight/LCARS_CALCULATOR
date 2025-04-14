"use client"

import { useState, useEffect } from "react"
import LcarsCalculator from "@/components/lcars-calculator"
import LcarsHeader from "@/components/lcars-elements/lcars-header"
import LcarsFooter from "@/components/lcars-elements/lcars-footer"
import { LcarsThemeProvider } from "@/components/lcars-theme-provider"

export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [bootSequence, setBootSequence] = useState(true)

  // LCARS boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false)
      setInitialized(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LcarsThemeProvider>
      {bootSequence ? (
        <BootSequence />
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
          <div className="w-full max-w-4xl">
            <LcarsHeader
              title="LCARS ADVANCED SCIENTIFIC COMPUTER SYSTEM"
              subtitle="FEDERATION STANDARD • VERSION 47-A"
            />
            <div className="my-4">
              <LcarsCalculator initialized={initialized} />
            </div>
            <LcarsFooter />
          </div>
        </main>
      )}
    </LcarsThemeProvider>
  )
}

function BootSequence() {
  const [bootText, setBootText] = useState("")
  const fullText = `LCARS INITIALIZATION SEQUENCE
LOADING CORE SYSTEMS...
INITIALIZING QUANTUM PROCESSORS...
CALIBRATING ISOLINEAR CIRCUITS...
ESTABLISHING SUBSPACE PROTOCOLS...
LOADING SCIENTIFIC SUBROUTINES...
SYSTEM READY`

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setBootText(fullText.substring(0, index))
      index++
      if (index > fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="w-full max-w-2xl p-8 border-2 border-orange-500 rounded-lg">
        <div className="flex items-center mb-6">
          <div className="h-6 w-12 bg-orange-500 rounded-l-full"></div>
          <div className="h-6 flex-grow bg-yellow-400"></div>
          <div className="h-6 w-16 bg-pink-500 rounded-r-full"></div>
        </div>
        <pre className="font-mono text-orange-500 whitespace-pre-wrap">{bootText}</pre>
        <div className="flex items-center mt-6">
          <div className="h-6 w-16 bg-blue-400 rounded-l-full"></div>
          <div className="h-6 flex-grow bg-orange-500"></div>
          <div className="h-6 w-12 bg-yellow-400 rounded-r-full"></div>
        </div>
      </div>
    </div>
  )
}
