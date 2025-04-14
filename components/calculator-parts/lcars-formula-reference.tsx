"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

interface LcarsFormulaReferenceProps {
  klingonMode?: boolean
  onClose: () => void
}

// Formula categories and their formulas
const FORMULAS = {
  algebra: [
    {
      name: "Quadratic Formula",
      formula: "x = (-b ± √(b² - 4ac)) / 2a",
      description: "Solves ax² + bx + c = 0 for x",
    },
    {
      name: "Binomial Theorem",
      formula: "(a + b)ⁿ = Σ(k=0 to n) (n choose k) aⁿ⁻ᵏbᵏ",
      description: "Expands (a + b) raised to power n",
    },
    {
      name: "Arithmetic Sequence",
      formula: "aₙ = a₁ + (n - 1)d",
      description: "nth term of arithmetic sequence with first term a₁ and common difference d",
    },
    {
      name: "Geometric Sequence",
      formula: "aₙ = a₁rⁿ⁻¹",
      description: "nth term of geometric sequence with first term a₁ and common ratio r",
    },
  ],
  calculus: [
    {
      name: "Power Rule",
      formula: "d/dx(xⁿ) = n·xⁿ⁻¹",
      description: "Derivative of x raised to power n",
    },
    {
      name: "Product Rule",
      formula: "d/dx(f(x)·g(x)) = f'(x)·g(x) + f(x)·g'(x)",
      description: "Derivative of the product of two functions",
    },
    {
      name: "Chain Rule",
      formula: "d/dx(f(g(x))) = f'(g(x))·g'(x)",
      description: "Derivative of a composite function",
    },
    {
      name: "Integration by Parts",
      formula: "∫u·dv = u·v - ∫v·du",
      description: "Method for integrating products of functions",
    },
  ],
  geometry: [
    {
      name: "Circle Area",
      formula: "A = πr²",
      description: "Area of a circle with radius r",
    },
    {
      name: "Sphere Volume",
      formula: "V = (4/3)πr³",
      description: "Volume of a sphere with radius r",
    },
    {
      name: "Pythagorean Theorem",
      formula: "a² + b² = c²",
      description: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other sides",
    },
    {
      name: "Law of Cosines",
      formula: "c² = a² + b² - 2ab·cos(C)",
      description: "Relates the sides of a triangle to the cosine of one angle",
    },
  ],
  trigonometry: [
    {
      name: "Sine Law",
      formula: "a/sin(A) = b/sin(B) = c/sin(C)",
      description: "Relates sides to sines of opposite angles in a triangle",
    },
    {
      name: "Cosine Law",
      formula: "c² = a² + b² - 2ab·cos(C)",
      description: "Relates the sides of a triangle to the cosine of one angle",
    },
    {
      name: "Double Angle Formula (Sin)",
      formula: "sin(2θ) = 2·sin(θ)·cos(θ)",
      description: "Sine of twice an angle",
    },
    {
      name: "Pythagorean Identity",
      formula: "sin²(θ) + cos²(θ) = 1",
      description: "Fundamental relation between sine and cosine",
    },
  ],
  statistics: [
    {
      name: "Mean",
      formula: "μ = (Σx) / n",
      description: "Average of a set of values",
    },
    {
      name: "Standard Deviation",
      formula: "σ = √[(Σ(x - μ)²) / n]",
      description: "Measure of dispersion from the mean",
    },
    {
      name: "Normal Distribution",
      formula: "f(x) = (1 / (σ√(2π))) · e^(-(x-μ)² / (2σ²))",
      description: "Probability density function of the normal distribution",
    },
    {
      name: "Correlation Coefficient",
      formula: "r = Σ((x - μₓ)(y - μᵧ)) / (nσₓσᵧ)",
      description: "Measures linear correlation between two variables",
    },
  ],
  physics: [
    {
      name: "Newton's Second Law",
      formula: "F = ma",
      description: "Force equals mass times acceleration",
    },
    {
      name: "Kinetic Energy",
      formula: "KE = (1/2)mv²",
      description: "Energy of motion",
    },
    {
      name: "Gravitational Potential Energy",
      formula: "PE = mgh",
      description: "Energy due to position in a gravitational field",
    },
    {
      name: "Einstein's Mass-Energy Equivalence",
      formula: "E = mc²",
      description: "Relation between energy and mass",
    },
  ],
}

export default function LcarsFormulaReference({ klingonMode = false, onClose }: LcarsFormulaReferenceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("algebra")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter formulas based on search term
  const filteredFormulas = searchTerm
    ? Object.values(FORMULAS)
        .flat()
        .filter(
          (formula) =>
            formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formula.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : FORMULAS[activeCategory as keyof typeof FORMULAS]

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
            <KlingonText enabled={klingonMode}>FORMULA REFERENCE</KlingonText>
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
            placeholder={klingonMode ? "nej..." : "Search formulas..."}
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
            {Object.keys(FORMULAS).map((category) => (
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

        {/* Formulas */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredFormulas.length > 0 ? (
            filteredFormulas.map((formula, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 p-3 rounded-lg"
              >
                <div className="text-blue-400 text-sm mb-1">
                  <KlingonText enabled={klingonMode}>{formula.name}</KlingonText>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg mb-2">
                  <div className="text-orange-500 font-mono text-lg text-center">{formula.formula}</div>
                </div>
                <div className="text-gray-300 text-sm">
                  <KlingonText enabled={klingonMode}>{formula.description}</KlingonText>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 text-center p-4">
              <KlingonText enabled={klingonMode}>No formulas found matching your search.</KlingonText>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
