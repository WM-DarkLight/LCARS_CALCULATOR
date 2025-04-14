"\"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useCalculatorContext } from "@/hooks/use-calculator-context"

// Astronomical constants
const ASTRONOMICAL_CONSTANTS = {
  SPEED_OF_LIGHT: 299792458, // m/s
  GRAVITATIONAL_CONSTANT: 6.6743e-11, // N⋅m²/kg²
  ASTRONOMICAL_UNIT: 149597870700, // m
  LIGHT_YEAR: 9.461e15, // m
  PARSEC: 3.086e16, // m
  SOLAR_MASS: 1.989e30, // kg
  EARTH_MASS: 5.972e24, // kg
  EARTH_RADIUS: 6371000, // m
  SOLAR_RADIUS: 695700000, // m
  HUBBLE_CONSTANT: 70, // km/s/Mpc
}

// Planet data
const PLANETS = {
  mercury: { mass: 3.3011e23, radius: 2439700, distance: 0.387 },
  venus: { mass: 4.8675e24, radius: 6051800, distance: 0.723 },
  earth: { mass: 5.972e24, radius: 6371000, distance: 1.0 },
  mars: { mass: 6.4171e23, radius: 3389500, distance: 1.524 },
  jupiter: { mass: 1.8982e27, radius: 69911000, distance: 5.203 },
  saturn: { mass: 5.6834e26, radius: 58232000, distance: 9.537 },
  uranus: { mass: 8.681e25, radius: 25362000, distance: 19.191 },
  neptune: { mass: 1.02413e26, radius: 24622000, distance: 30.069 },
}

export default function LcarsAstronomy() {
  const { dispatch } = useCalculatorContext()
  const [calculationType, setCalculationType] = useState<string>("orbital")
  const [planet1, setPlanet1] = useState<string>("earth")
  const [planet2, setPlanet2] = useState<string>("mars")
  const [mass, setMass] = useState<string>("1")
  const [radius, setRadius] = useState<string>("1")
  const [distance, setDistance] = useState<string>("1")
  const [results, setResults] = useState<Record<string, { value: number; unit: string }>>({})

  const performCalculation = (type: string) => {
    let result = 0
    let unit = ""
    let description = ""

    switch (type) {
      case "escape-velocity": {
        // v_escape = sqrt(2GM/R)
        const m = Number(mass) * ASTRONOMICAL_CONSTANTS.EARTH_MASS
        const r = Number(radius) * ASTRONOMICAL_CONSTANTS.EARTH_RADIUS
        result = Math.sqrt((2 * ASTRONOMICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * m) / r)
        unit = "m/s"
        description = "Escape Velocity"
        break
      }
      case "orbital-velocity": {
        // v_orbit = sqrt(GM/R)
        const m = Number(mass) * ASTRONOMICAL_CONSTANTS.EARTH_MASS
        const r = Number(radius) * ASTRONOMICAL_CONSTANTS.EARTH_RADIUS
        result = Math.sqrt((ASTRONOMICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * m) / r)
        unit = "m/s"
        description = "Orbital Velocity"
        break
      }
      case "orbital-period": {
        // T = 2π * sqrt(R^3 / GM)
        const m = Number(mass) * ASTRONOMICAL_CONSTANTS.EARTH_MASS
        const r = Number(radius) * ASTRONOMICAL_CONSTANTS.EARTH_RADIUS
        result = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (ASTRONOMICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * m))
        unit = "s"
        description = "Orbital Period"
        break
      }
      case "gravitational-force": {
        // F = G * m1 * m2 / r^2
        const m1 = PLANETS[planet1 as keyof typeof PLANETS].mass
        const m2 = PLANETS[planet2 as keyof typeof PLANETS].mass
        const r = Number(distance) * ASTRONOMICAL_CONSTANTS.ASTRONOMICAL_UNIT
        result = (ASTRONOMICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * m1 * m2) / Math.pow(r, 2)
        unit = "N"
        description = "Gravitational Force"
        break
      }
      case "light-travel-time": {
        // t = d / c
        const d = Number(distance) * ASTRONOMICAL_CONSTANTS.ASTRONOMICAL_UNIT
        result = d / ASTRONOMICAL_CONSTANTS.SPEED_OF_LIGHT
        unit = "s"
        description = "Light Travel Time"
        break
      }
      case "schwarzschild-radius": {
        // R_s = 2GM/c^2
        const m = Number(mass) * ASTRONOMICAL_CONSTANTS.SOLAR_MASS
        result =
          (2 * ASTRONOMICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * m) / Math.pow(ASTRONOMICAL_CONSTANTS.SPEED_OF_LIGHT, 2)
        unit = "m"
        description = "Schwarzschild Radius"
        break
      }
      case "planet-distance": {
        const p1 = PLANETS[planet1 as keyof typeof PLANETS]
        const p2 = PLANETS[planet2 as keyof typeof PLANETS]
        result = Math.abs(p1.distance - p2.distance) * ASTRONOMICAL_CONSTANTS.ASTRONOMICAL_UNIT
        unit = "m"
        description = `Distance from ${planet1} to ${planet2}`
        break
      }
    }

    // Format the result for display
    let displayResult = result
    let displayUnit = unit

    // Convert large values to more readable units
    if (unit === "m" && result > 1000000000) {
      displayResult = result / ASTRONOMICAL_CONSTANTS.ASTRONOMICAL_UNIT
      displayUnit = "AU"
    } else if (unit === "m/s" && result > 1000) {
      displayResult = result / 1000
      displayUnit = "km/s"
    } else if (unit === "s" && result > 86400) {
      displayResult = result / 86400
      displayUnit = "days"
    } else if (unit === "N" && result > 1e20) {
      displayResult = result / 1e20
      displayUnit = "×10²⁰ N"
    }

    // Update results
    setResults({
      ...results,
      [type]: { value: displayResult, unit: displayUnit },
    })

    // Update calculator display and history
    dispatch({ type: "SET_DISPLAY", payload: displayResult.toExponential(4) })
    dispatch({
      type: "ADD_TO_HISTORY",
      payload: `${description} = ${displayResult.toExponential(4)} ${displayUnit}`,
    })
  }

  const renderCalculationForm = () => {
    switch (calculationType) {
      case "orbital":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">Mass (Earth masses)</div>
              <input
                type="number"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">Radius (Earth radii)</div>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("escape-velocity")}
                variant="blue"
                className="text-sm"
              >
                Escape Velocity
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("orbital-velocity")}
                variant="blue"
                className="text-sm"
              >
                Orbital Velocity
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("orbital-period")} variant="blue" className="text-sm">
                Orbital Period
              </CalculatorButton>
            </div>
          </div>
        )
      case "gravity":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">First Planet</div>
              <select
                value={planet1}
                onChange={(e) => setPlanet1(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              >
                {Object.keys(PLANETS).map((planet) => (
                  <option key={planet} value={planet}>
                    {planet.charAt(0).toUpperCase() + planet.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">Second Planet</div>
              <select
                value={planet2}
                onChange={(e) => setPlanet2(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              >
                {Object.keys(PLANETS).map((planet) => (
                  <option key={planet} value={planet}>
                    {planet.charAt(0).toUpperCase() + planet.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">Distance (AU)</div>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("gravitational-force")}
                variant="blue"
                className="text-sm"
              >
                Gravitational Force
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("planet-distance")}
                variant="blue"
                className="text-sm"
              >
                Planet Distance
              </CalculatorButton>
            </div>
          </div>
        )
      case "relativity":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">Mass (Solar masses)</div>
              <input
                type="number"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">Distance (AU)</div>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("schwarzschild-radius")}
                variant="blue"
                className="text-sm"
              >
                Schwarzschild Radius
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("light-travel-time")}
                variant="blue"
                className="text-sm"
              >
                Light Travel Time
              </CalculatorButton>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <CalculatorButton
          onClick={() => setCalculationType("orbital")}
          variant={calculationType === "orbital" ? "orange" : "dark"}
          className="text-sm"
        >
          Orbital
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("gravity")}
          variant={calculationType === "gravity" ? "orange" : "dark"}
          className="text-sm"
        >
          Gravity
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("relativity")}
          variant={calculationType === "relativity" ? "orange" : "dark"}
          className="text-sm"
        >
          Relativity
        </CalculatorButton>
      </div>

      {renderCalculationForm()}

      {Object.keys(results).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 p-2 rounded-lg border border-gray-800"
        >
          <div className="text-yellow-400 text-xs mb-1">Results</div>
          <div className="grid gap-1">
            {Object.entries(results).map(([key, { value, unit }]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-300 text-sm">
                  {key
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  :
                </span>
                <span className="text-orange-500 text-sm">
                  {typeof value === "number" && value > 1000 ? value.toExponential(4) : value.toFixed(4)} {unit}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="text-gray-500 text-xs">Based on standard astronomical constants and planetary data.</div>
    </div>
  )
}
