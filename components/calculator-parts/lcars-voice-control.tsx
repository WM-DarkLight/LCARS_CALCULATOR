"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, X } from "lucide-react"
import { useCalculatorContext } from "@/hooks/use-calculator-context"
import { useSound } from "@/hooks/use-sound"
import { KlingonText } from "@/components/easter-eggs/klingon-mode"

interface LcarsVoiceControlProps {
  onClose: () => void
  klingonMode?: boolean
}

export default function LcarsVoiceControl({ onClose, klingonMode = false }: LcarsVoiceControlProps) {
  const { dispatch } = useCalculatorContext()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("Voice interface ready.")
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(5))
  const { playBeep } = useSound()

  // Simulate voice recognition
  useEffect(() => {
    if (!isListening) return

    // Animate waveform when listening
    const interval = setInterval(() => {
      setWaveform(
        Array(20)
          .fill(0)
          .map(() => Math.floor(Math.random() * 20) + 5),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      setFeedback("Voice recognition stopped.")
      playBeep("off")
      setWaveform(Array(20).fill(5))
    } else {
      setIsListening(true)
      setFeedback("Listening...")
      playBeep("on")

      // Simulate voice recognition after a delay
      setTimeout(() => {
        setIsListening(false)
        setFeedback("Processing command...")
        setWaveform(Array(20).fill(5))

        // Simulate processing delay
        setTimeout(() => {
          processVoiceCommand()
        }, 1500)
      }, 3000)
    }
  }

  const processVoiceCommand = () => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate with a random command
    const commands = [
      "calculate 2 plus 3",
      "calculate square root of 16",
      "calculate sine of 30 degrees",
      "switch to scientific mode",
      "calculate 5 times 9",
      "engage warp drive", // Easter egg command
      "red alert", // Easter egg command
      "beam me up", // Easter egg command
    ]

    const randomCommand = commands[Math.floor(Math.random() * commands.length)]
    setTranscript(randomCommand)

    // Process the command
    if (randomCommand.includes("plus")) {
      const result = "5"
      setFeedback(`Calculated: 2 + 3 = ${result}`)
      dispatch({ type: "SET_DISPLAY", payload: result })
      dispatch({ type: "ADD_TO_HISTORY", payload: `2 + 3 = ${result}` })
    } else if (randomCommand.includes("square root")) {
      const result = "4"
      setFeedback(`Calculated: √16 = ${result}`)
      dispatch({ type: "SET_DISPLAY", payload: result })
      dispatch({ type: "ADD_TO_HISTORY", payload: `√16 = ${result}` })
    } else if (randomCommand.includes("sine")) {
      const result = "0.5"
      setFeedback(`Calculated: sin(30°) = ${result}`)
      dispatch({ type: "SET_DISPLAY", payload: result })
      dispatch({ type: "ADD_TO_HISTORY", payload: `sin(30°) = ${result}` })
    } else if (randomCommand.includes("scientific")) {
      setFeedback("Switching to scientific mode")
      // This would trigger a mode change in a real implementation
    } else if (randomCommand.includes("times")) {
      const result = "45"
      setFeedback(`Calculated: 5 × 9 = ${result}`)
      dispatch({ type: "SET_DISPLAY", payload: result })
      dispatch({ type: "ADD_TO_HISTORY", payload: `5 × 9 = ${result}` })
    } else if (randomCommand.includes("warp drive")) {
      setFeedback("Engaging warp drive. Maximum warp!")
      // This would trigger the warp drive easter egg in a real implementation
    } else if (randomCommand.includes("red alert")) {
      setFeedback("Red alert! All hands to battle stations!")
      // This would trigger the red alert easter egg in a real implementation
    } else if (randomCommand.includes("beam me up")) {
      setFeedback("Energizing transport sequence...")
      // This would trigger a transporter effect in a real implementation
    }

    playBeep("success")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-yellow-400">
          <KlingonText enabled={klingonMode}>VOICE INTERFACE</KlingonText>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-orange-500 hover:text-orange-400"
        >
          <X size={18} />
        </motion.button>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-4">
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer ${
              isListening ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            {isListening ? <MicOff size={24} className="text-black" /> : <Mic size={24} className="text-orange-500" />}
          </motion.div>
        </div>

        {isListening && (
          <div className="flex items-center justify-center h-8 mb-4">
            {waveform.map((height, i) => (
              <motion.div
                key={i}
                className="w-1 mx-px bg-orange-500"
                animate={{ height }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        )}

        <div className="text-center text-orange-500 mb-2">
          <KlingonText enabled={klingonMode}>{feedback}</KlingonText>
        </div>

        {transcript && (
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <div className="text-yellow-400 text-xs mb-1">
              <KlingonText enabled={klingonMode}>Recognized Command:</KlingonText>
            </div>
            <div className="text-orange-500">
              <KlingonText enabled={klingonMode}>{transcript}</KlingonText>
            </div>
          </div>
        )}
      </div>

      <div className="text-gray-400 text-sm mb-4">
        <KlingonText enabled={klingonMode}>Try saying commands like:</KlingonText>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="bg-gray-800 p-2 rounded">
          <KlingonText enabled={klingonMode}>"Calculate 2 plus 3"</KlingonText>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <KlingonText enabled={klingonMode}>"Calculate square root of 16"</KlingonText>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <KlingonText enabled={klingonMode}>"Switch to scientific mode"</KlingonText>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <KlingonText enabled={klingonMode}>"Calculate sine of 30 degrees"</KlingonText>
        </div>
        <div className="bg-gray-800 p-2 rounded text-gray-600">
          <KlingonText enabled={klingonMode}>"Engage warp drive"</KlingonText>
        </div>
      </div>
    </motion.div>
  )
}
