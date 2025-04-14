"use client"

import { Delete } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { unitConversions } from "@/lib/calculator-utils"

interface ConverterKeypadProps {
  onNumberClick: (num: string) => void
  onClearClick: () => void
  onBackspaceClick: () => void
  onDecimalClick: () => void
  onFunctionClick: (func: string) => void
  conversionType: string
  onConversionTypeChange: (type: string) => void
  fromUnit: string
  toUnit: string
  onFromUnitChange: (unit: string) => void
  onToUnitChange: (unit: string) => void
  onConvert: () => void
}

export function ConverterKeypad({
  onNumberClick,
  onClearClick,
  onBackspaceClick,
  onDecimalClick,
  onFunctionClick,
  conversionType,
  onConversionTypeChange,
  fromUnit,
  toUnit,
  onFromUnitChange,
  onToUnitChange,
  onConvert,
}: ConverterKeypadProps) {
  // Get available units for the current conversion type
  const getUnitsForType = (type: string): string[] => {
    const conversions = unitConversions[type as keyof typeof unitConversions]
    if (!conversions) return []

    if (type === "temperature") {
      return ["c", "f", "k"]
    }

    return Object.keys(conversions)
  }

  const units = getUnitsForType(conversionType)

  // Format unit name for display
  const formatUnitName = (unit: string): string => {
    const specialUnits: Record<string, string> = {
      m: "meter",
      km: "kilometer",
      cm: "centimeter",
      mm: "millimeter",
      mi: "mile",
      yd: "yard",
      ft: "foot",
      in: "inch",
      ly: "light year",
      kg: "kilogram",
      g: "gram",
      mg: "milligram",
      lb: "pound",
      oz: "ounce",
      ton: "metric ton",
      st: "stone",
      c: "Celsius",
      f: "Fahrenheit",
      k: "Kelvin",
      l: "liter",
      ml: "milliliter",
      gal: "gallon",
      qt: "quart",
      pt: "pint",
      cup: "cup",
      floz: "fluid ounce",
      m3: "cubic meter",
      cm3: "cubic centimeter",
      m2: "square meter",
      km2: "square kilometer",
      cm2: "square centimeter",
      mm2: "square millimeter",
      ha: "hectare",
      acre: "acre",
      ft2: "square foot",
      in2: "square inch",
      s: "second",
      min: "minute",
      h: "hour",
      day: "day",
      week: "week",
      month: "month",
      year: "year",
      mps: "meter/second",
      kph: "kilometer/hour",
      mph: "mile/hour",
      knot: "knot",
      ftps: "foot/second",
      j: "joule",
      kj: "kilojoule",
      cal: "calorie",
      kcal: "kilocalorie",
      wh: "watt-hour",
      kwh: "kilowatt-hour",
      ev: "electron-volt",
      btu: "BTU",
    }

    return specialUnits[unit] || unit
  }

  return (
    <div className="grid gap-4">
      {/* Conversion types */}
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton
          onClick={() => onConversionTypeChange("length")}
          variant={conversionType === "length" ? "orange" : "blue"}
          className="text-sm"
        >
          LENGTH
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("weight")}
          variant={conversionType === "weight" ? "orange" : "blue"}
          className="text-sm"
        >
          WEIGHT
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("temperature")}
          variant={conversionType === "temperature" ? "orange" : "blue"}
          className="text-sm"
        >
          TEMP
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("volume")}
          variant={conversionType === "volume" ? "orange" : "blue"}
          className="text-sm"
        >
          VOLUME
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("area")}
          variant={conversionType === "area" ? "orange" : "blue"}
          className="text-sm"
        >
          AREA
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("time")}
          variant={conversionType === "time" ? "orange" : "blue"}
          className="text-sm"
        >
          TIME
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("speed")}
          variant={conversionType === "speed" ? "orange" : "blue"}
          className="text-sm"
        >
          SPEED
        </CalculatorButton>
        <CalculatorButton
          onClick={() => onConversionTypeChange("energy")}
          variant={conversionType === "energy" ? "orange" : "blue"}
          className="text-sm"
        >
          ENERGY
        </CalculatorButton>
      </div>

      {/* Unit selection */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-yellow-400 text-xs mb-1">FROM</div>
          <select
            className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
            value={fromUnit}
            onChange={(e) => onFromUnitChange(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {formatUnitName(unit)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-yellow-400 text-xs mb-1">TO</div>
          <select
            className="w-full bg-gray-800 text-orange-500 p-2 rounded-lg border border-gray-700"
            value={toUnit}
            onChange={(e) => onToUnitChange(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {formatUnitName(unit)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton onClick={onClearClick} variant="orange">
          C
        </CalculatorButton>
        <CalculatorButton onClick={onBackspaceClick} variant="orange">
          <Delete size={18} />
        </CalculatorButton>
        <CalculatorButton onClick={onConvert} variant="yellow" className="col-span-2">
          CONVERT
        </CalculatorButton>

        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <CalculatorButton key={num} onClick={() => onNumberClick(num.toString())} variant="dark">
            {num}
          </CalculatorButton>
        ))}
        <CalculatorButton onClick={() => onNumberClick("0")} variant="dark" className="col-span-2">
          0
        </CalculatorButton>
        <CalculatorButton onClick={onDecimalClick} variant="dark">
          .
        </CalculatorButton>
      </div>
    </div>
  )
}
