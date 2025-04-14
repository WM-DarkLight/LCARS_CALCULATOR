"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface CaptainsLogProps {
  onClose: () => void
  history: string[]
}

export function CaptainsLog({ onClose, history }: CaptainsLogProps) {
  const [stardate, setStardate] = useState("")

  useEffect(() => {
    // Generate a Star Trek style stardate
    const now = new Date()
    const year = now.getFullYear() - 2323 // Assuming TNG era
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
    const decimal = Math.floor((now.getHours() * 100) / 24)
    setStardate(`${year}${dayOfYear}.${decimal}`)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
    >
      <div className="bg-gray-900 border-2 border-orange-500 rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-orange-500 text-xl">Captain's Log</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-16 bg-orange-500 rounded-full"></div>
          <div className="text-yellow-400">STARDATE {stardate}</div>
          <div className="h-4 w-16 bg-blue-400 rounded-full"></div>
        </div>

        <div className="bg-black p-4 rounded border border-gray-800 h-80 overflow-y-auto font-mono">
          {history.length === 0 ? (
            <p className="text-gray-500">No calculations recorded in ship's log.</p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="mb-3">
                <div className="text-blue-400 text-sm">Calculation Entry {index + 1}</div>
                <div className="text-orange-500">{entry}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-gray-400 text-sm">All calculations are recorded for Starfleet review. End log.</div>
      </div>
    </motion.div>
  )
}
