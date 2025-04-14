"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X, Copy } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"
import { useCalculatorContext } from "@/hooks/use-calculator-context"

interface LcarsConstantsReferenceProps {
  klingonMode?: boolean
  onClose: () => void
}

// Constants categories and their values
const CONSTANTS = {
  mathematical: [
    {
      name: "Pi (π)",
      value: Math.PI,
      symbol: "π",
      description: "Ratio of a circle's circumference to its diameter",
    },
    {
      name: "Euler's Number (e)",
      value: Math.E,
      symbol: "e",
      description: "Base of the natural logarithm",
    },
    {
      name: "Golden Ratio (φ)",
      value: 1.618033988749895,
      symbol: "φ",
      description: "Ratio where (a+b)/a = a/b",
    },
    {
      name: "Square Root of 2",
      value: Math.SQRT2,
      symbol: "√2",
      description: "Diagonal of a unit square",
    },
    {
      name: "Natural Log of 2",
      value: Math.LN2,
      symbol: "ln(2)",
      description: "Natural logarithm of 2",
    },
    {
      name: "Natural Log of 10",
      value: Math.LN10,
      symbol: "ln(10)",
      description: "Natural logarithm of 10",
    },
  ],
  physical: [
    {
      name: "Speed of Light in Vacuum",
      value: 299792458,
      symbol: "c",
      description: "Speed of light in vacuum (m/s)",
      unit: "m/s",
    },
    {
      name: "Gravitational Constant",
      value: 6.6743e-11,
      symbol: "G",
      description: "Universal gravitational constant",
      unit: "N·m²/kg²",
    },
    {
      name: "Planck Constant",
      value: 6.62607015e-34,
      symbol: "h",
      description: "Quantum of electromagnetic action",
      unit: "J·s",
    },
    {
      name: "Elementary Charge",
      value: 1.602176634e-19,
      symbol: "e",
      description: "Electric charge carried by a single proton",
      unit: "C",
    },
    {
      name: "Boltzmann Constant",
      value: 1.380649e-23,
      symbol: "k",
      description: "Relates energy to temperature",
      unit: "J/K",
    },
    {
      name: "Avogadro's Number",
      value: 6.02214076e23,
      symbol: "N_A",
      description: "Number of particles in one mole",
      unit: "mol⁻¹",
    },
  ],
  astronomical: [
    {
      name: "Astronomical Unit",
      value: 1.495978707e11,
      symbol: "AU",
      description: "Average distance from Earth to Sun",
      unit: "m",
    },
    {
      name: "Light Year",
      value: 9.46073047e15,
      symbol: "ly",
      description: "Distance light travels in one year",
      unit: "m",
    },
    {
      name: "Parsec",
      value: 3.08567758e16,
      symbol: "pc",
      description: "Distance at which 1 AU subtends an angle of 1 arcsecond",
      unit: "m",
    },
    {
      name: "Solar Mass",
      value: 1.989e30,
      symbol: "M☉",
      description: "Mass of the Sun",
      unit: "kg",
    },
    {
      name: "Earth Mass",
      value: 5.972e24,
      symbol: "M⊕",
      description: "Mass of the Earth",
      unit: "kg",
    },
  ],
  chemistry: [
    {
      name: "Gas Constant",
      value: 8.31446261815324,
      symbol: "R",
      description: "Ideal gas constant",
      unit: "J/(mol·K)",
    },
    {
      name: "Faraday Constant",
      value: 96485.33212,
      symbol: "F",
      description: "Charge of one mole of electrons",
      unit: "C/mol",
    },
    {
      name: "Atomic Mass Unit",
      value: 1.6605390666e-27,
      symbol: "u",
      description: "Standard unit for atomic and molecular masses",
      unit: "kg",
    },
    {
      name: "Standard Atmosphere",
      value: 101325,
      symbol: "atm",
      description: "Standard atmospheric pressure",
      unit: "Pa",
    },
  ],
}

export default function LcarsConstantsReference({ klingonMode = false, onClose }: LcarsConstantsReferenceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("mathematical")
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedConstant, setCopiedConstant] = useState<string | null>(null)
  const { dispatch } = useCalculatorContext()

  // Filter constants based on search term
  const filteredConstants = searchTerm
    ? Object.values(CONSTANTS)
        .flat()
        .filter(
          (constant) =>
            constant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            constant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            constant.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : CONSTANTS[activeCategory as keyof typeof CONSTANTS]

  const handleUseConstant = (value: number) => {
    dispatch({ type: "SET_DISPLAY", payload: value.toString() })
  }

  const handleCopyConstant = (constant: { name: string; value: number }) => {
    navigator.clipboard.writeText(constant.value.toString())
    setCopiedConstant(constant.name)
    setTimeout(() => setCopiedConstant(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-900 border-t border-gray-800"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-yellow-400 text-sm">
            <KlingonText enabled={klingonMode}>CONSTANTS REFERENCE</KlingonText>
          </div>
          <CalculatorButton onClick={onClose} variant="pink" className="text-xs px-2 py-1">
            <KlingonText enabled={klingonMode}>CLOSE</KlingonText>
          </CalculatorButton>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex items-center bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={klingonMode ? "nej..." : "Search constants..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-orange-500 p-2 flex-1 focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="p-2 text-gray-400 hover:text-orange-500">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category tabs - only show if not searching */}
        {!searchTerm && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(CONSTANTS).map((category) => (
              <CalculatorButton
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "orange" : "dark"}
                className="text-xs"
              >
                <KlingonText enabled={klingonMode}>{category.toUpperCase()}</KlingonText>
              </CalculatorButton>
            ))}
          </div>
        )}

        {/* Constants */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredConstants.length > 0 ? (
            filteredConstants.map((constant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-blue-400 text-sm">
                    <KlingonText enabled={klingonMode}>{constant.name}</KlingonText>
                  </div>
                  <div className="text-yellow-400 font-mono">{constant.symbol}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg mb-2 flex justify-between items-center">
                  <div className="text-orange-500 font-mono">
                    {typeof constant.value === "number" && constant.value > 9999
                      ? constant.value.toExponential(6)
                      : constant.value}
                    {constant.unit ? ` ${constant.unit}` : ""}
                  </div>
                  <div className="flex gap-2">
                    <CalculatorButton
                      onClick={() => handleCopyConstant(constant)}
                      variant="blue"
                      className="text-xs px-2 py-1"
                      title="Copy value"
                    >
                      {copiedConstant === constant.name ? "Copied!" : <Copy size={14} />}
                    </CalculatorButton>
                    <CalculatorButton
                      onClick={() => handleUseConstant(constant.value)}
                      variant="orange"
                      className="text-xs px-2 py-1"
                    >
                      <KlingonText enabled={klingonMode}>USE</KlingonText>
                    </CalculatorButton>
                  </div>
                </div>
                <div className="text-gray-300 text-xs">
                  <KlingonText enabled={klingonMode}>{constant.description}</KlingonText>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 text-center p-4">
              <KlingonText enabled={klingonMode}>No constants found matching your search.</KlingonText>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
