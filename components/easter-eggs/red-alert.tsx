"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function RedAlert() {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // Create flashing effect
    const interval = setInterval(() => {
      setFlash((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: flash ? 0.3 : 0 }}
      transition={{ duration: 0.2 }}
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
  )
}
