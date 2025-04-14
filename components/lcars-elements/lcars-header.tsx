"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLcarsTheme } from "@/components/lcars-theme-provider"

interface LcarsHeaderProps {
  title?: string
  subtitle?: string
}

export default function LcarsHeader({ title = "LCARS", subtitle }: LcarsHeaderProps) {
  const [stardate, setStardate] = useState("")
  const [time, setTime] = useState("")
  const { colors } = useLcarsTheme()

  // Generate a Star Trek style stardate and Earth time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      // Stardate calculation (TNG era style)
      const year = now.getFullYear() - 2323
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
      const decimal = Math.floor((now.getHours() * 100) / 24)
      setStardate(`${year}${dayOfYear}.${decimal}`)

      // Earth time
      setTime(now.toLocaleTimeString())
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ duration: 0.5 }}
          className={`h-12 ${colors.primary} rounded-l-full`}
        ></motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ duration: 0.7 }}
          className={`h-12 flex-grow ${colors.secondary} mx-1 flex items-center justify-center`}
        >
          <h1 className="text-black text-xl font-bold tracking-wider">{title}</h1>
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "7rem" }}
          transition={{ duration: 0.5 }}
          className={`h-12 ${colors.accent} rounded-r-full`}
        ></motion.div>
      </div>

      {subtitle && <div className="text-gray-500 text-xs mt-1 text-center">{subtitle}</div>}

      <div className="flex justify-between items-center px-4 py-2 mt-2 bg-gray-900 rounded-lg">
        <div>
          <div className="text-yellow-400 text-xs">STARDATE</div>
          <div className="text-orange-500 font-mono">{stardate}</div>
        </div>
        <div>
          <div className="text-yellow-400 text-xs">EARTH TIME</div>
          <div className="text-orange-500 font-mono">{time}</div>
        </div>
        <div>
          <div className="text-yellow-400 text-xs">LOCATION</div>
          <div className="text-orange-500 font-mono">SECTOR 001</div>
        </div>
      </div>
    </div>
  )
}
