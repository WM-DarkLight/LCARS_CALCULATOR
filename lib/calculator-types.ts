export type CalculatorMode =
  | "standard"
  | "scientific"
  | "programmer"
  | "converter"
  | "graphing"
  | "matrix"
  | "statistics"
  | "astronomy"
  | "trek"
  | "financial"

export interface CalculatorState {
  display: string
  equation: string
  isNewInput: boolean
  memory: number
  history: string[]
  mode: CalculatorMode
  angleUnit: "deg" | "rad"
  base: "hex" | "dec" | "oct" | "bin"
  conversionType: string
  fromUnit: string
  toUnit: string
  lastMemoryAction?: string
  fullExpression: string
  parenthesesCount: number
  lastCalculation?: {
    expression: string
    result: string
  }
}
