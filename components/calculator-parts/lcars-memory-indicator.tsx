"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MemoryIndicatorProps {
  action: string | undefined
}

export default function MemoryIndicator({ action }: MemoryIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (action) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [action])

  return (
    <AnimatePresence>
      {visible && action && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-2 right-2 bg-blue-500 text-black px-3 py-1 rounded-full text-sm font-bold"
        >
          {action}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
