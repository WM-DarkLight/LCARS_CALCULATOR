"use client"

import type React from "react"

import { CalculatorIcon, Settings, AlertTriangle, Wifi } from "lucide-react"
import { motion } from "framer-motion"
import { useLcarsTheme } from "@/components/lcars-theme-provider"

export default function LcarsFooter() {
  const { colors, theme, setTheme } = useLcarsTheme()

  const handleThemeChange = () => {
    const themes = ["standard", "alternate", "tactical", "medical"] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between p-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "8rem" }}
          transition={{ duration: 0.5 }}
          className={`h-6 ${colors.primary} rounded-l-full`}
        ></motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ duration: 0.7 }}
          className={`h-6 flex-grow ${colors.secondary} mx-1`}
        ></motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ duration: 0.5 }}
          className={`h-6 ${colors.accent} rounded-r-full`}
        ></motion.div>
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`h-8 w-8 ${colors.primary} rounded-full flex items-center justify-center cursor-pointer`}
          >
            <CalculatorIcon size={16} className="text-black" />
          </motion.div>
          <div className={`h-4 w-32 ${colors.secondary} rounded-r-full ml-1`}></div>
        </div>

        <div className="flex space-x-2">
          <StatusIndicator icon={<Wifi size={14} />} status="online" />
          <StatusIndicator icon={<AlertTriangle size={14} />} status="offline" />
        </div>

        <div className="flex items-center">
          <div className={`h-4 w-24 ${colors.accent} rounded-l-full mr-1`}></div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeChange}
            className={`h-8 w-8 ${colors.highlight} rounded-full flex items-center justify-center cursor-pointer`}
          >
            <Settings size={16} className="text-black" />
          </motion.div>
        </div>
      </div>

      <div className="text-gray-600 mt-2 text-xs text-center">
        LCARS • ADVANCED SCIENTIFIC COMPUTER SYSTEM • STARFLEET ISSUE
      </div>
    </div>
  )
}

function StatusIndicator({ icon, status }: { icon: React.ReactNode; status: "online" | "offline" }) {
  return (
    <div
      className={`flex items-center justify-center h-6 w-6 rounded-full ${
        status === "online" ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      {icon}
    </div>
  )
}
