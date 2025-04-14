"use client"

import { useState, useEffect, useCallback } from "react"
import { useSound } from "./use-sound"

// Konami code sequence
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

// Self-destruct code
const SELF_DESTRUCT_CODE = ["1", "1", "A", "2", "B"]

// Warp speed sequence
const WARP_SEQUENCE = ["9", ".", "9", "7", "5"]

// Database access code
const DATABASE_CODE = ["4", "7", "4", "7", "1"]

export function useEasterEggs() {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [buttonSequence, setButtonSequence] = useState<string[]>([])
  const [redAlertActive, setRedAlertActive] = useState(false)
  const [selfDestructActive, setSelfDestructActive] = useState(false)
  const [warpDriveActive, setWarpDriveActive] = useState(false)
  const [tribbleActive, setTribbleActive] = useState(false)
  const [klingonMode, setKlingonMode] = useState(false)
  const [captainsLogOpen, setCaptainsLogOpen] = useState(false)
  const [databaseOpen, setDatabaseOpen] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState("")
  const { playBeep, playSound } = useSound()

  // Check for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key]
      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift()
      }
      setKeySequence(newSequence)

      // Check if Konami code was entered
      if (newSequence.length === KONAMI_CODE.length && newSequence.every((key, index) => key === KONAMI_CODE[index])) {
        playSound("redAlert")
        setRedAlertActive(true)
        setEasterEggMessage("Red Alert! All hands to battle stations!")
        setTimeout(() => {
          setRedAlertActive(false)
          setEasterEggMessage("")
        }, 10000)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [keySequence, playSound])

  // Track button presses for secret sequences
  const trackButtonPress = useCallback(
    (button: string) => {
      const newSequence = [...buttonSequence, button]
      if (newSequence.length > 5) {
        newSequence.shift()
      }
      setButtonSequence(newSequence)

      // Check for self-destruct sequence
      if (
        newSequence.length === SELF_DESTRUCT_CODE.length &&
        newSequence.every((btn, index) => btn === SELF_DESTRUCT_CODE[index])
      ) {
        playSound("selfDestruct")
        setSelfDestructActive(true)
        setEasterEggMessage("Self-destruct sequence initiated. Please evacuate.")
        setTimeout(() => {
          setSelfDestructActive(false)
          setEasterEggMessage("")
        }, 10000)
      }

      // Check for warp drive sequence
      if (
        newSequence.length === WARP_SEQUENCE.length &&
        newSequence.every((btn, index) => btn === WARP_SEQUENCE[index])
      ) {
        playSound("warpSpeed")
        setWarpDriveActive(true)
        setEasterEggMessage("Warp drive engaged. Maximum warp!")
        setTimeout(() => {
          setWarpDriveActive(false)
          setEasterEggMessage("")
        }, 5000)
      }

      // Check for database access sequence
      if (
        newSequence.length === DATABASE_CODE.length &&
        newSequence.every((btn, index) => btn === DATABASE_CODE[index])
      ) {
        playSound("transporter")
        setDatabaseOpen(true)
        setEasterEggMessage("Accessing Starfleet Database...")
        setTimeout(() => {
          setEasterEggMessage("")
        }, 3000)
      }

      // Random chance to spawn a tribble
      if (Math.random() < 0.01) {
        playSound("tribble")
        setTribbleActive(true)
        setEasterEggMessage("Warning: Tribble detected in the system!")
        setTimeout(() => {
          setTribbleActive(false)
          setEasterEggMessage("")
        }, 5000)
      }
    },
    [buttonSequence, playSound],
  )

  // Toggle Klingon mode
  const toggleKlingonMode = useCallback(() => {
    setKlingonMode(!klingonMode)
    playBeep(klingonMode ? "off" : "on")
    setEasterEggMessage(klingonMode ? "Federation Standard activated" : "tlhIngan Hol activated")
    setTimeout(() => {
      setEasterEggMessage("")
    }, 3000)
  }, [klingonMode, playBeep])

  // Toggle Captain's Log
  const toggleCaptainsLog = useCallback(() => {
    setCaptainsLogOpen(!captainsLogOpen)
    playBeep("ui")
  }, [captainsLogOpen, playBeep])

  // Toggle Database
  const toggleDatabase = useCallback(() => {
    setDatabaseOpen(!databaseOpen)
    playBeep("ui")
  }, [databaseOpen, playBeep])

  return {
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
  }
}
