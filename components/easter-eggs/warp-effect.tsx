"use client"

import { useEffect, useRef } from "react"

export function WarpEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create stars
    const stars: { x: number; y: number; z: number; size: number }[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 1,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center of the screen
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw and update stars
      stars.forEach((star) => {
        // Move stars closer (z decreases)
        star.z -= 10

        // Reset star if it goes off screen
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width - centerX
          star.y = Math.random() * canvas.height - centerY
        }

        // Calculate screen position
        const screenX = (star.x / star.z) * 500 + centerX
        const screenY = (star.y / star.z) * 500 + centerY

        // Calculate star size based on distance
        const size = (1 - star.z / 1000) * 5 + star.size

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / 1000})`
        ctx.beginPath()
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
        ctx.fill()

        // Draw streaks for closer stars
        if (star.z < 500) {
          const tailLength = (1 - star.z / 1000) * 20
          const angle = Math.atan2(screenY - centerY, screenX - centerX)

          ctx.strokeStyle = `rgba(100, 200, 255, ${(1 - star.z / 1000) * 0.5})`
          ctx.lineWidth = size / 2
          ctx.beginPath()
          ctx.moveTo(screenX, screenY)
          ctx.lineTo(screenX - Math.cos(angle) * tailLength, screenY - Math.sin(angle) * tailLength)
          ctx.stroke()
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9997,
        pointerEvents: "none",
      }}
    />
  )
}
