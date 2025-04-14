"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useLcarsTheme } from "@/components/lcars-theme-provider"

interface LcarsPanelProps {
  children: ReactNode
  className?: string
}

export function LcarsPanel({ children, className = "" }: LcarsPanelProps) {
  const { colors } = useLcarsTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-black rounded-lg overflow-hidden border-2 ${colors.text} ${className}`}
    >
      {children}
    </motion.div>
  )
}
