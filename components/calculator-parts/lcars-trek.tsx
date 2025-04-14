"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

// Star Trek universe constants
const TREK_CONSTANTS = {
  WARP_FACTOR_COEFFICIENT: 1.44, // TNG era warp scale coefficient
  LIGHT_YEAR: 9.461e15, // meters
  SECTOR_SIZE: 20, // light years
  IMPULSE_FULL: 0.25, // 1/4 light speed
  PHASER_BASE_POWER: 1.02, // megawatts
  PHOTON_TORPEDO_YIELD: 64.0, // isotons
  QUANTUM_TORPEDO_YIELD: 199.0, // isotons
  SHIELD_FREQUENCY_BASE: 257.4, // MHz
  DILITHIUM_EFFICIENCY_MAX: 97.3, // percent
  TRANSPORTER_RANGE_MAX: 40000, // kilometers
  REPLICATOR_ENERGY_UNIT: 4.5, // megajoules
}

export default function LcarsTrek() {
  const { dispatch } = useCalculatorContext()
  const [calculationType, setCalculationType] = useState<string>("warp")
  const [warpFactor, setWarpFactor] = useState<string>("5")
  const [distance, setDistance] = useState<string>("10")
  const [distanceUnit, setDistanceUnit] = useState<string>("ly")
  const [stardateInput, setStardateInput] = useState<string>("47634.4")
  const [phaserSetting, setPhaserSetting] = useState<string>("6")
  const [shieldFrequency, setShieldFrequency] = useState<string>("257.4")
  const [dilithiumPurity, setDilithiumPurity] = useState<string>("95")
  const [results, setResults] = useState<Record<string, { value: number | string; unit: string }>>({})
  const [klingonMode, setKlingonMode] = useState<boolean>(false)

  const performCalculation = (type: string) => {
    let result: number | string = 0
    let unit = ""
    let description = ""

    switch (type) {
      case "warp-speed": {
        // v = w^(10/3) * c for warp > 9, v = w^3 * c for warp <= 9 (TNG scale)
        const warp = Number(warpFactor)
        let speedC = 0

        if (warp <= 9) {
          speedC = Math.pow(warp, 3)
        } else {
          speedC = Math.pow(warp, 10 / 3)
        }

        result = speedC
        unit = "c"
        description = `Warp ${warp} Speed`
        break
      }
      case "warp-travel-time": {
        // Time = Distance / Speed
        const warp = Number(warpFactor)
        const dist = Number(distance)
        let distInLY = dist

        // Convert to light years if needed
        if (distanceUnit === "pc") {
          distInLY = dist * 3.26 // parsecs to light years
        } else if (distanceUnit === "sectors") {
          distInLY = dist * TREK_CONSTANTS.SECTOR_SIZE
        }

        // Calculate speed in c
        let speedC = 0
        if (warp <= 9) {
          speedC = Math.pow(warp, 3)
        } else {
          speedC = Math.pow(warp, 10 / 3)
        }

        // Calculate time in days
        const timeInDays = (distInLY / speedC) * 365.25
        result = timeInDays
        unit = "days"
        description = `Travel Time at Warp ${warp}`
        break
      }
      case "stardate-convert": {
        // Convert stardate to approximate Earth date (TNG era)
        const stardate = Number(stardateInput)

        // Extract components (TNG era stardates)
        const season = Math.floor(stardate / 1000)
        const episode = Math.floor((stardate % 1000) / 100)

        // Rough Earth year calculation (2364 = start of TNG)
        const year = 2364 + (season - 41)

        result = `${year}, Season ${season - 40}, Episode ${episode}`
        unit = ""
        description = "Stardate Conversion"
        break
      }
      case "phaser-power": {
        // Calculate phaser power based on setting
        const setting = Number(phaserSetting)

        // Phaser power increases exponentially with setting
        const power = TREK_CONSTANTS.PHASER_BASE_POWER * Math.pow(setting, 2.5)
        result = power
        unit = "MW"
        description = `Phaser Power (Setting ${setting})`
        break
      }
      case "shield-harmonics": {
        // Calculate shield effectiveness based on frequency
        const frequency = Number(shieldFrequency)
        const baseFreq = TREK_CONSTANTS.SHIELD_FREQUENCY_BASE

        // Shield effectiveness drops as frequency deviates from optimal
        const deviation = Math.abs(frequency - baseFreq)
        const effectiveness = 100 * Math.exp(-0.01 * deviation)

        result = effectiveness
        unit = "%"
        description = "Shield Effectiveness"
        break
      }
      case "dilithium-efficiency": {
        // Calculate warp core efficiency based on dilithium purity
        const purity = Number(dilithiumPurity)

        // Efficiency calculation
        const efficiency = purity * (TREK_CONSTANTS.DILITHIUM_EFFICIENCY_MAX / 100)

        result = efficiency
        unit = "%"
        description = "Warp Core Efficiency"
        break
      }
      case "torpedo-yield": {
        // Calculate comparative torpedo yields
        const photonYield = TREK_CONSTANTS.PHOTON_TORPEDO_YIELD
        const quantumYield = TREK_CONSTANTS.QUANTUM_TORPEDO_YIELD

        setResults({
          ...results,
          photon: { value: photonYield, unit: "isotons" },
          quantum: { value: quantumYield, unit: "isotons" },
          ratio: { value: quantumYield / photonYield, unit: "x" },
        })

        return
      }
      case "transporter-energy": {
        // Calculate transporter energy requirements
        const dist = Number(distance)

        // Energy increases with square of distance
        const energy = 37.5 * Math.pow(dist / 10000, 2)

        result = energy
        unit = "MJ"
        description = "Transporter Energy"
        break
      }
    }

    // Update results
    setResults({
      ...results,
      [type]: { value: result, unit },
    })

    // Update calculator display and history
    dispatch({
      type: "SET_DISPLAY",
      payload: typeof result === "number" ? result.toFixed(2) : result.toString(),
    })
    dispatch({
      type: "ADD_TO_HISTORY",
      payload: `${description} = ${typeof result === "number" ? result.toFixed(2) : result} ${unit}`,
    })
  }

  const renderCalculationForm = () => {
    switch (calculationType) {
      case "warp":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Warp Factor</KlingonText>
              </div>
              <input
                type="number"
                value={warpFactor}
                onChange={(e) => setWarpFactor(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                step="0.1"
                min="1"
                max="9.99"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Distance</KlingonText>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="flex-1 bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  className="bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                >
                  <option value="ly">Light Years</option>
                  <option value="pc">Parsecs</option>
                  <option value="sectors">Sectors</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton onClick={() => performCalculation("warp-speed")} variant="blue" className="text-sm">
                <KlingonText enabled={klingonMode}>Calculate Speed</KlingonText>
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("warp-travel-time")}
                variant="blue"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Calculate Time</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
      case "stardate":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Stardate</KlingonText>
              </div>
              <input
                type="text"
                value={stardateInput}
                onChange={(e) => setStardateInput(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                placeholder="e.g. 47634.4"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("stardate-convert")}
                variant="blue"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Convert Stardate</KlingonText>
              </CalculatorButton>
            </div>
            <div className="text-gray-500 text-xs">
              <KlingonText enabled={klingonMode}>TNG Era: 41000-47999, DS9: 48000-52999, VOY: 48000-54999</KlingonText>
            </div>
          </div>
        )
      case "tactical":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Phaser Setting</KlingonText>
              </div>
              <input
                type="number"
                value={phaserSetting}
                onChange={(e) => setPhaserSetting(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                min="1"
                max="16"
                step="1"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Shield Frequency (MHz)</KlingonText>
              </div>
              <input
                type="number"
                value={shieldFrequency}
                onChange={(e) => setShieldFrequency(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                step="0.1"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CalculatorButton onClick={() => performCalculation("phaser-power")} variant="pink" className="text-sm">
                <KlingonText enabled={klingonMode}>Phaser Power</KlingonText>
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("shield-harmonics")}
                variant="pink"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Shield Harmonics</KlingonText>
              </CalculatorButton>
              <CalculatorButton onClick={() => performCalculation("torpedo-yield")} variant="pink" className="text-sm">
                <KlingonText enabled={klingonMode}>Torpedo Yield</KlingonText>
              </CalculatorButton>
            </div>
          </div>
        )
      case "engineering":
        return (
          <div className="grid gap-3">
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Dilithium Purity (%)</KlingonText>
              </div>
              <input
                type="number"
                value={dilithiumPurity}
                onChange={(e) => setDilithiumPurity(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <div className="text-yellow-400 text-xs mb-1">
                <KlingonText enabled={klingonMode}>Transporter Distance (km)</KlingonText>
              </div>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
                min="0"
                max={TREK_CONSTANTS.TRANSPORTER_RANGE_MAX}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CalculatorButton
                onClick={() => performCalculation("dilithium-efficiency")}
                variant="orange"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Warp Efficiency</KlingonText>
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performCalculation("transporter-energy")}
                variant="orange"
                className="text-sm"
              >
                <KlingonText enabled={klingonMode}>Transporter Energy</KlingonText>
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
          onClick={() => setCalculationType("warp")}
          variant={calculationType === "warp" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>WARP</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("stardate")}
          variant={calculationType === "stardate" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>STARDATE</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("tactical")}
          variant={calculationType === "tactical" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>TACTICAL</KlingonText>
        </CalculatorButton>
        <CalculatorButton
          onClick={() => setCalculationType("engineering")}
          variant={calculationType === "engineering" ? "orange" : "dark"}
          className="text-sm"
        >
          <KlingonText enabled={klingonMode}>ENGINEERING</KlingonText>
        </CalculatorButton>
      </div>

      {renderCalculationForm()}

      {Object.keys(results).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 p-2 rounded-lg border border-gray-800"
        >
          <div className="text-yellow-400 text-xs mb-1">
            <KlingonText enabled={klingonMode}>Results</KlingonText>
          </div>
          <div className="grid gap-1">
            {Object.entries(results).map(([key, { value, unit }]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-300 text-sm">
                  <KlingonText enabled={klingonMode}>
                    {key
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                    :
                  </KlingonText>
                </span>
                <span className="text-orange-500 text-sm">
                  {typeof value === "number" ? value.toFixed(2) : value} {unit}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="text-gray-500 text-xs">
        <KlingonText enabled={klingonMode}>Based on TNG-era technical specifications.</KlingonText>
      </div>
    </div>
  )
}
