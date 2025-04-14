"use client"

// Klingon translation map (simplified)
const klingonTranslations: Record<string, string> = {
  Calculator: "De'wI'",
  Standard: "pIm",
  Scientific: "QeD",
  Programmer: "chenmoHwI'",
  Converter: "tamghay",
  Graphing: "per",
  Matrix: "tlhegh",
  Statistics: "mI'",
  Astronomy: "logh",
  Memory: "qaw",
  System: "SeH",
  Status: "Dotlh",
  Online: "chu'",
  Ready: "tay'",
  Error: "Qagh",
  Calculate: "SuD",
  Convert: "tamgha'",
  Clear: "teS",
  Result: "tIv",
  Mean: "pIm",
  Median: "botlh",
  Sum: "boq",
  Minimum: "taD",
  Maximum: "tIq",
  Range: "ghor",
  Data: "De'",
  Parse: "buS",
  Voice: "ghItlh",
  Interface: "Hurgh",
  Listening: "QoS",
  Processing: "chu'wI'",
  Command: "ra'",
  Recognized: "tu'",
  Try: "tInej",
  Saying: "jatlh",
  Commands: "ra'mey",
  Like: "rur",
}

// Function to translate text to Klingon
export function translateToKlingon(text: string): string {
  let translatedText = text

  // Replace known words with Klingon equivalents
  Object.entries(klingonTranslations).forEach(([english, klingon]) => {
    const regex = new RegExp(`\\b${english}\\b`, "gi")
    translatedText = translatedText.replace(regex, klingon)
  })

  return translatedText
}

// Component to wrap text and translate it
interface KlingonTextProps {
  children: string
  enabled: boolean
}

export function KlingonText({ children, enabled }: KlingonTextProps) {
  if (!enabled) return <>{children}</>

  return <>{translateToKlingon(children)}</>
}
