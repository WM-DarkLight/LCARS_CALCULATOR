// Mathematical constants
export const MATH_CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
  phi: 1.618033988749895, // Golden ratio
  sqrt2: Math.SQRT2,
  sqrt1_2: Math.SQRT1_2,
  ln2: Math.LN2,
  ln10: Math.LN10,
  log2e: Math.LOG2E,
  log10e: Math.LOG10E,
  gamma: 0.5772156649015329, // Euler-Mascheroni constant
  avogadro: 6.02214076e23, // Avogadro's number
  lightspeed: 299792458, // Speed of light in m/s
  planck: 6.62607015e-34, // Planck constant
  boltzmann: 1.380649e-23, // Boltzmann constant
}

// Trigonometric functions
export function calculateTrigFunction(func: string, value: number, angleUnit: "deg" | "rad"): number {
  // Convert degrees to radians if needed
  const valueInRadians = angleUnit === "deg" ? (value * Math.PI) / 180 : value

  switch (func) {
    case "sin":
      return Math.sin(valueInRadians)
    case "cos":
      return Math.cos(valueInRadians)
    case "tan":
      return Math.tan(valueInRadians)
    case "asin":
      return angleUnit === "deg" ? (Math.asin(value) * 180) / Math.PI : Math.asin(value)
    case "acos":
      return angleUnit === "deg" ? (Math.acos(value) * 180) / Math.PI : Math.acos(value)
    case "atan":
      return angleUnit === "deg" ? (Math.atan(value) * 180) / Math.PI : Math.atan(value)
    case "sinh":
      return Math.sinh(valueInRadians)
    case "cosh":
      return Math.cosh(valueInRadians)
    case "tanh":
      return Math.tanh(valueInRadians)
    case "asinh":
      return Math.asinh(value)
    case "acosh":
      return Math.acosh(value)
    case "atanh":
      return Math.atanh(value)
    case "sec":
      return 1 / Math.cos(valueInRadians)
    case "csc":
      return 1 / Math.sin(valueInRadians)
    case "cot":
      return 1 / Math.tan(valueInRadians)
    default:
      return value
  }
}

// Logarithmic functions
export function calculateLogFunction(func: string, value: number): number {
  switch (func) {
    case "log":
      return Math.log10(value)
    case "ln":
      return Math.log(value)
    case "log2":
      return Math.log2(value)
    case "exp":
      return Math.pow(10, value)
    case "exp2":
      return Math.pow(2, value)
    case "expe":
      return Math.exp(value)
    case "logb":
      // Custom base logarithm will be implemented in the calculator reducer
      return value
    default:
      return value
  }
}

// Other mathematical functions
export function calculateMathFunction(func: string, value: number): number {
  switch (func) {
    case "sqrt":
      return Math.sqrt(value)
    case "cbrt":
      return Math.cbrt(value)
    case "square":
      return Math.pow(value, 2)
    case "cube":
      return Math.pow(value, 3)
    case "reciprocal":
      return 1 / value
    case "abs":
      return Math.abs(value)
    case "factorial":
      return factorial(value)
    case "random":
      return Math.random()
    case "exp":
      return Math.exp(value)
    case "floor":
      return Math.floor(value)
    case "ceil":
      return Math.ceil(value)
    case "round":
      return Math.round(value)
    case "sign":
      return Math.sign(value)
    case "trunc":
      return Math.trunc(value)
    case "gamma":
      return gamma(value)
    case "erf":
      return erf(value)
    default:
      return value
  }
}

// Factorial function
export function factorial(n: number): number {
  if (n < 0) return Number.NaN
  if (n === 0 || n === 1) return 1
  if (!Number.isInteger(n)) return gamma(n + 1) // Use gamma function for non-integer factorials

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

// Gamma function approximation (Lanczos approximation)
export function gamma(z: number): number {
  // For negative numbers, use the reflection formula
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }

  // Lanczos approximation coefficients
  const p = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]

  z -= 1
  let x = 0.99999999999980993
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1)
  }

  const t = z + p.length - 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

// Error function approximation
export function erf(x: number): number {
  // Constants
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  // Save the sign of x
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

// Base conversion functions
export function convertBase(value: string, fromBase: number, toBase: number): string {
  const decimalValue = Number.parseInt(value, fromBase)
  return decimalValue.toString(toBase).toUpperCase()
}

// Bitwise operations
export function bitwiseOperation(op: string, a: number, b?: number): number {
  switch (op) {
    case "and":
      return a & (b || 0)
    case "or":
      return a | (b || 0)
    case "xor":
      return a ^ (b || 0)
    case "not":
      return ~a
    case "lsh":
      return a << (b || 1)
    case "rsh":
      return a >> (b || 1)
    case "rol":
      return (a << (b || 1)) | (a >>> (32 - (b || 1)))
    case "ror":
      return (a >>> (b || 1)) | (a << (32 - (b || 1)))
    case "twosComplement":
      return (~a + 1) >>> 0
    case "onesComplement":
      return ~a
    default:
      return a
  }
}

// Unit conversion functions
export const unitConversions = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
    ly: 9.461e15,
    au: 149597870700, // Astronomical Unit
    pc: 3.086e16, // Parsec
    nm: 1e-9, // Nanometer
    angstrom: 1e-10, // Angstrom
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000,
    st: 6.35029,
    grain: 0.0000647989, // Grain
    ct: 0.0002, // Carat
    amu: 1.6605390666e-27, // Atomic mass unit
  },
  temperature: {
    c: (c: number) => c,
    f: (f: number) => (f - 32) * (5 / 9),
    k: (k: number) => k - 273.15,
    toC: (c: number) => c,
    toF: (c: number) => c * (9 / 5) + 32,
    toK: (c: number) => c + 273.15,
    r: (r: number) => (r - 491.67) * (5 / 9), // Rankine
    toR: (c: number) => c * (9 / 5) + 491.67,
  },
  volume: {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    cup: 0.24,
    floz: 0.0295735,
    m3: 1000,
    cm3: 0.001,
    in3: 0.0163871, // Cubic inch
    ft3: 28.3168, // Cubic foot
    tbsp: 0.0147868, // Tablespoon
    tsp: 0.00492892, // Teaspoon
  },
  area: {
    m2: 1,
    km2: 1000000,
    cm2: 0.0001,
    mm2: 0.000001,
    ha: 10000,
    acre: 4046.86,
    ft2: 0.092903,
    in2: 0.00064516,
    mi2: 2589988.11, // Square mile
    yd2: 0.836127, // Square yard
  },
  time: {
    s: 1,
    min: 60,
    h: 3600,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31536000,
    ms: 0.001, // Millisecond
    us: 0.000001, // Microsecond
    ns: 1e-9, // Nanosecond
    century: 3153600000, // Century
  },
  speed: {
    mps: 1,
    kph: 0.277778,
    mph: 0.44704,
    knot: 0.514444,
    ftps: 0.3048,
    c: 299792458, // Speed of light
    mach: 340.29, // Mach (at sea level)
  },
  energy: {
    j: 1,
    kj: 1000,
    cal: 4.184,
    kcal: 4184,
    wh: 3600,
    kwh: 3600000,
    ev: 1.602e-19,
    btu: 1055.06,
    therm: 105506000, // Therm
    ft_lb: 1.35582, // Foot-pound
  },
  pressure: {
    pa: 1,
    kpa: 1000,
    mpa: 1000000,
    bar: 100000,
    atm: 101325,
    mmhg: 133.322, // Millimeters of mercury
    psi: 6894.76, // Pounds per square inch
    torr: 133.322, // Torr
  },
  data: {
    bit: 1,
    byte: 8,
    kb: 8 * 1024,
    mb: 8 * 1024 * 1024,
    gb: 8 * 1024 * 1024 * 1024,
    tb: 8 * 1024 * 1024 * 1024 * 1024,
    kib: 8 * 1000,
    mib: 8 * 1000 * 1000,
    gib: 8 * 1000 * 1000 * 1000,
    tib: 8 * 1000 * 1000 * 1000 * 1000,
  },
  angle: {
    rad: 1,
    deg: Math.PI / 180,
    grad: Math.PI / 200,
    turn: Math.PI * 2,
    toRad: (rad: number) => rad,
    toDeg: (rad: number) => (rad * 180) / Math.PI,
    toGrad: (rad: number) => (rad * 200) / Math.PI,
    toTurn: (rad: number) => rad / (Math.PI * 2),
  },
}

export function convertUnit(value: number, fromUnit: string, toUnit: string, conversionType: string): number {
  const conversions = unitConversions[conversionType as keyof typeof unitConversions]

  if (!conversions) return value

  // Special case for temperature
  if (conversionType === "temperature") {
    const tempConversions = conversions as any
    // Convert to Celsius first
    const inCelsius = tempConversions[fromUnit](value)
    // Then convert from Celsius to target unit
    return tempConversions[`to${toUnit.toUpperCase()}`](inCelsius)
  }

  // Special case for angles
  if (conversionType === "angle") {
    const angleConversions = conversions as any
    // Convert to radians first
    const inRadians = value * angleConversions[fromUnit]
    // Then convert from radians to target unit
    return inRadians / angleConversions[toUnit]
  }

  // For other unit types
  const standardConversions = conversions as Record<string, number>
  // Convert to base unit first
  const baseValue = value * standardConversions[fromUnit]
  // Then convert from base unit to target unit
  return baseValue / standardConversions[toUnit]
}

// Complex number operations
export class Complex {
  real: number
  imag: number

  constructor(real: number, imag: number) {
    this.real = real
    this.imag = imag
  }

  static add(a: Complex, b: Complex): Complex {
    return new Complex(a.real + b.real, a.imag + b.imag)
  }

  static subtract(a: Complex, b: Complex): Complex {
    return new Complex(a.real - b.real, a.imag - b.imag)
  }

  static multiply(a: Complex, b: Complex): Complex {
    return new Complex(a.real * b.real - a.imag * b.imag, a.real * b.imag + a.imag * b.real)
  }

  static divide(a: Complex, b: Complex): Complex {
    const denominator = b.real * b.real + b.imag * b.imag
    return new Complex(
      (a.real * b.real + a.imag * b.imag) / denominator,
      (a.imag * b.real - a.real * b.imag) / denominator,
    )
  }

  static abs(a: Complex): number {
    return Math.sqrt(a.real * a.real + a.imag * a.imag)
  }

  static exp(a: Complex): Complex {
    const expReal = Math.exp(a.real)
    return new Complex(expReal * Math.cos(a.imag), expReal * Math.sin(a.imag))
  }

  static pow(a: Complex, n: number): Complex {
    if (n === 0) return new Complex(1, 0)

    const r = Math.pow(Complex.abs(a), n)
    const theta = Math.atan2(a.imag, a.real) * n

    return new Complex(r * Math.cos(theta), r * Math.sin(theta))
  }

  toString(): string {
    if (this.imag === 0) return `${this.real}`
    if (this.real === 0) return `${this.imag}i`
    return `${this.real} ${this.imag >= 0 ? "+" : ""} ${this.imag}i`
  }
}

// Statistical functions
export function calculateMean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length
}

export function calculateMedian(data: number[]): number {
  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

export function calculateStandardDeviation(data: number[]): number {
  const mean = calculateMean(data)
  const squareDiffs = data.map((val) => Math.pow(val - mean, 2))
  return Math.sqrt(squareDiffs.reduce((sum, val) => sum + val, 0) / data.length)
}

export function calculateVariance(data: number[]): number {
  const mean = calculateMean(data)
  const squareDiffs = data.map((val) => Math.pow(val - mean, 2))
  return squareDiffs.reduce((sum, val) => sum + val, 0) / data.length
}

// Physics constants
export const PHYSICS_CONSTANTS = {
  SPEED_OF_LIGHT: 299792458, // m/s
  PLANCK_CONSTANT: 6.62607015e-34, // J⋅s
  GRAVITATIONAL_CONSTANT: 6.6743e-11, // N⋅m²/kg²
  ELEMENTARY_CHARGE: 1.602176634e-19, // C
  BOLTZMANN_CONSTANT: 1.380649e-23, // J/K
  AVOGADRO_NUMBER: 6.02214076e23, // mol^-1
  GAS_CONSTANT: 8.31446261815324, // J/(mol⋅K)
  ELECTRON_MASS: 9.1093837015e-31, // kg
  PROTON_MASS: 1.67262192369e-27, // kg
  NEUTRON_MASS: 1.67492749804e-27, // kg
}

// Expression parser and evaluator for continuous operations
export function parseAndEvaluateExpression(expression: string): number {
  // Replace any implicit multiplication with explicit multiplication
  expression = expression.replace(/(\d+|\))(?=\()/g, "$1*")

  // Clean up the expression - remove spaces
  expression = expression.replace(/\s+/g, "")

  try {
    // Use Function constructor for evaluation with proper scope and strict mode
    return Function(`"use strict"; return (${expression})`)()
  } catch (error) {
    console.error("Expression evaluation error:", error)
    throw new Error(`Invalid expression: ${error.message}`)
  }
}

// Function to format numbers for display
export function formatNumber(num: number): string {
  if (isNaN(num)) return "Error"
  if (!isFinite(num)) return num > 0 ? "Infinity" : "-Infinity"

  // For very large or very small numbers, use scientific notation
  if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6)
  }

  // For regular numbers, limit decimal places but avoid trailing zeros
  const fixed = num.toFixed(10)
  return Number.parseFloat(fixed).toString()
}

// Function to check if an expression is mathematically valid
export function isValidExpression(expression: string): boolean {
  try {
    // Basic syntax check
    if (expression.match(/[+\-*/]{2,}/)) return false // No consecutive operators
    if (expression.match(/$$$$/)) return false // No empty parentheses

    // Check for balanced parentheses
    let parenCount = 0
    for (const char of expression) {
      if (char === "(") parenCount++
      if (char === ")") parenCount--
      if (parenCount < 0) return false // More closing than opening
    }
    if (parenCount !== 0) return false // Unbalanced parentheses

    // Try evaluating
    parseAndEvaluateExpression(expression)
    return true
  } catch (error) {
    return false
  }
}

// Financial calculation functions
export function calculateLoanPayment(principal: number, rate: number, term: number): number {
  // Calculate monthly payment for a loan
  // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
  const monthlyRate = rate / 100 / 12 // monthly interest rate
  const numberOfPayments = term * 12 // number of payments (months)

  if (monthlyRate === 0) {
    // Simple division if interest rate is zero
    return principal / numberOfPayments
  } else {
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  term: number,
  compoundingPeriods: number,
): number {
  // Calculate compound interest
  // A = P(1 + r/n)^(nt)
  // where A = final amount, P = principal, r = annual interest rate, n = compounding periods per year, t = time in years
  return principal * Math.pow(1 + rate / 100 / compoundingPeriods, compoundingPeriods * term)
}

export function calculatePresentValue(futureValue: number, rate: number, term: number): number {
  // Calculate present value
  // P = F / (1 + r)^t
  // where P = present value, F = future value, r = interest rate, t = time in years
  return futureValue / Math.pow(1 + rate / 100, term)
}

export function calculateROI(initialInvestment: number, finalValue: number): number {
  // Calculate Return on Investment (ROI)
  // ROI = (Gain - Cost) / Cost * 100
  return ((finalValue - initialInvestment) / initialInvestment) * 100
}

export function calculateRuleOf72(rate: number): number {
  // Rule of 72: Estimate years to double investment
  // Years to double = 72 / Interest Rate
  return 72 / rate
}

export function calculateInflationAdjustedValue(nominalValue: number, inflationRate: number, term: number): number {
  // Calculate future value adjusted for inflation
  // Real future value = nominal future value / (1 + inflation rate)^t
  return nominalValue / Math.pow(1 + inflationRate / 100, term)
}
