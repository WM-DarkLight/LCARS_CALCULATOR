"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function Tribble() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState(30)
  const [multiplying, setMultiplying] = useState(false)
  const [tribbles, setTribbles] = useState<{ id: number; x: number; y: number; size: number }[]>([])

  useEffect(() => {
    // Random position on the screen
    const x = Math.random() * (window.innerWidth - 100)
    const y = Math.random() * (window.innerHeight - 100)
    setPosition({ x, y })

    // 20% chance of tribble multiplication
    if (Math.random() < 0.2) {
      setMultiplying(true)

      // Create 2-5 baby tribbles
      const numBabies = Math.floor(Math.random() * 4) + 2
      const newTribbles = []

      for (let i = 0; i < numBabies; i++) {
        newTribbles.push({
          id: Date.now() + i,
          x: x + (Math.random() * 100 - 50),
          y: y + (Math.random() * 100 - 50),
          size: Math.random() * 10 + 15,
        })
      }

      setTribbles(newTribbles)
    }

    // Tribbles grow over time
    const growInterval = setInterval(() => {
      setSize((prevSize) => Math.min(prevSize + 1, 50))
    }, 500)

    return () => clearInterval(growInterval)
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: position.x,
          y: position.y,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          width: size,
          height: size,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4a373 0%, #a98467 100%)",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {multiplying &&
        tribbles.map((tribble) => (
          <motion.div
            key={tribble.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: tribble.x,
              y: tribble.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
            style={{
              position: "fixed",
              width: tribble.size,
              height: tribble.size,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4a373 0%, #a98467 100%)",
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        ))}
    </>
  )
}
