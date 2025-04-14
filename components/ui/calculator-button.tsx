"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "orange" | "yellow" | "pink" | "blue" | "dark"
}

export function CalculatorButton({ children, variant = "dark", className, disabled, ...props }: CalculatorButtonProps) {
  const variantClasses = {
    orange: "bg-orange-500 text-black hover:bg-orange-400 active:bg-orange-600",
    yellow: "bg-yellow-400 text-black hover:bg-yellow-300 active:bg-yellow-500",
    pink: "bg-pink-500 text-black hover:bg-pink-400 active:bg-pink-600",
    blue: "bg-blue-400 text-black hover:bg-blue-300 active:bg-blue-500",
    dark: "bg-gray-800 text-orange-500 hover:bg-gray-700 active:bg-gray-900",
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        "p-3 rounded-lg flex items-center justify-center transition-colors",
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
