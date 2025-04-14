"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function SelfDestruct() {
  const [countdown, setCountdown] = useState(10)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Flashing effect gets faster as countdown progresses
    const flashInterval = setInterval(
      () => {
        setFlash((prev) => !prev)
      },
      countdown > 5 ? 500 : 250,
    )

    return () => {
      clearInterval(timer)
      clearInterval(flashInterval)
    }
  }, [countdown])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 0.2 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "red",
          zIndex: 9998,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "red",
          padding: "20px",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: "24px",
          fontWeight: "bold",
          zIndex: 9999,
          pointerEvents: "none",
          border: "2px solid red",
        }}
      >
        SELF-DESTRUCT IN: {countdown}
      </motion.div>
    </>
  )
}
