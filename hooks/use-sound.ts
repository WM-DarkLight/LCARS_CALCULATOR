"use client"

import { useEffect, useState } from "react"

export function useSound() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize AudioContext on user interaction
    const handleInteraction = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)

        // Remove event listeners once AudioContext is created
        document.removeEventListener("click", handleInteraction)
        document.removeEventListener("keydown", handleInteraction)
      }
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }
  }, [audioContext])

  const playBeep = (type: "on" | "off" | "success" | "error" | "button" | "ui" | "init" | "mode") => {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Configure sound based on type
    switch (type) {
      case "on":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case "off":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case "success":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case "error":
        oscillator.type = "sawtooth"
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      case "button":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.1)
        break
      case "ui":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.15)
        break
      case "init":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      case "mode":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1)
        oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
        break
    }
  }

  const playSound = (type: "redAlert" | "selfDestruct" | "warpSpeed" | "tribble" | "transporter") => {
    if (!audioContext) return

    // Create oscillators and gain nodes for more complex sounds
    switch (type) {
      case "redAlert":
        // Red alert klaxon sound
        const redAlertOsc = audioContext.createOscillator()
        const redAlertGain = audioContext.createGain()
        redAlertOsc.connect(redAlertGain)
        redAlertGain.connect(audioContext.destination)

        redAlertOsc.type = "sawtooth"
        redAlertGain.gain.setValueAtTime(0.2, audioContext.currentTime)

        // Create the red alert pattern
        for (let i = 0; i < 5; i++) {
          const startTime = audioContext.currentTime + i * 0.6
          redAlertOsc.frequency.setValueAtTime(880, startTime)
          redAlertOsc.frequency.setValueAtTime(784, startTime + 0.3)
          redAlertGain.gain.setValueAtTime(0.2, startTime)
          redAlertGain.gain.setValueAtTime(0.2, startTime + 0.25)
          redAlertGain.gain.setValueAtTime(0, startTime + 0.3)
          redAlertGain.gain.setValueAtTime(0, startTime + 0.6)
        }

        redAlertOsc.start()
        redAlertOsc.stop(audioContext.currentTime + 3)
        break

      case "selfDestruct":
        // Self-destruct countdown beeps
        const selfDestructOsc = audioContext.createOscillator()
        const selfDestructGain = audioContext.createGain()
        selfDestructOsc.connect(selfDestructGain)
        selfDestructGain.connect(audioContext.destination)

        selfDestructOsc.type = "square"
        selfDestructGain.gain.setValueAtTime(0, audioContext.currentTime)

        // Create countdown beeps
        for (let i = 0; i < 5; i++) {
          const startTime = audioContext.currentTime + i * 0.7
          selfDestructOsc.frequency.setValueAtTime(440, startTime)
          selfDestructGain.gain.setValueAtTime(0.15, startTime)
          selfDestructGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
        }

        // Final alarm
        const finalTime = audioContext.currentTime + 3.5
        selfDestructOsc.frequency.setValueAtTime(220, finalTime)
        selfDestructGain.gain.setValueAtTime(0.3, finalTime)
        selfDestructGain.gain.exponentialRampToValueAtTime(0.01, finalTime + 1)

        selfDestructOsc.start()
        selfDestructOsc.stop(audioContext.currentTime + 4.5)
        break

      case "warpSpeed":
        // Warp speed engine sound
        const warpOsc1 = audioContext.createOscillator()
        const warpOsc2 = audioContext.createOscillator()
        const warpGain1 = audioContext.createGain()
        const warpGain2 = audioContext.createGain()

        warpOsc1.connect(warpGain1)
        warpOsc2.connect(warpGain2)
        warpGain1.connect(audioContext.destination)
        warpGain2.connect(audioContext.destination)

        warpOsc1.type = "sine"
        warpOsc2.type = "sawtooth"

        // Warp engine powering up
        warpOsc1.frequency.setValueAtTime(80, audioContext.currentTime)
        warpOsc1.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 1.5)
        warpGain1.gain.setValueAtTime(0.01, audioContext.currentTime)
        warpGain1.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.5)
        warpGain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

        warpOsc2.frequency.setValueAtTime(120, audioContext.currentTime)
        warpOsc2.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 1)
        warpGain2.gain.setValueAtTime(0.01, audioContext.currentTime)
        warpGain2.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.8)
        warpGain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

        warpOsc1.start()
        warpOsc2.start()
        warpOsc1.stop(audioContext.currentTime + 2)
        warpOsc2.stop(audioContext.currentTime + 2)
        break

      case "tribble":
        // Tribble purring sound
        const tribbleOsc = audioContext.createOscillator()
        const tribbleGain = audioContext.createGain()
        const tribbleLFO = audioContext.createOscillator()
        const tribbleLFOGain = audioContext.createGain()

        tribbleLFO.connect(tribbleLFOGain)
        tribbleLFOGain.connect(tribbleGain.gain)
        tribbleOsc.connect(tribbleGain)
        tribbleGain.connect(audioContext.destination)

        tribbleOsc.type = "sine"
        tribbleOsc.frequency.setValueAtTime(440, audioContext.currentTime)

        tribbleLFO.type = "sine"
        tribbleLFO.frequency.setValueAtTime(8, audioContext.currentTime)
        tribbleLFOGain.gain.setValueAtTime(0.1, audioContext.currentTime)

        tribbleGain.gain.setValueAtTime(0.05, audioContext.currentTime)

        tribbleLFO.start()
        tribbleOsc.start()
        tribbleLFO.stop(audioContext.currentTime + 1.5)
        tribbleOsc.stop(audioContext.currentTime + 1.5)
        break

      case "transporter":
        // Transporter beam sound
        const transporterOsc = audioContext.createOscillator()
        const transporterGain = audioContext.createGain()
        const transporterFilter = audioContext.createBiquadFilter()

        transporterOsc.connect(transporterFilter)
        transporterFilter.connect(transporterGain)
        transporterGain.connect(audioContext.destination)

        transporterOsc.type = "sawtooth"
        transporterFilter.type = "bandpass"
        transporterFilter.Q.value = 10

        transporterOsc.frequency.setValueAtTime(5000, audioContext.currentTime)
        transporterOsc.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 1.5)

        transporterFilter.frequency.setValueAtTime(5000, audioContext.currentTime)
        transporterFilter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 1.5)

        transporterGain.gain.setValueAtTime(0.01, audioContext.currentTime)
        transporterGain.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
        transporterGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

        transporterOsc.start()
        transporterOsc.stop(audioContext.currentTime + 1.5)
        break
    }
  }

  return { playBeep, playSound }
}
