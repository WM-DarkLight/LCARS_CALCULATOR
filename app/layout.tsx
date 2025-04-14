import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CalculatorProvider } from "@/hooks/use-calculator-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LCARS Advanced Scientific Computer System",
  description: "Star Trek inspired advanced calculator system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <CalculatorProvider>{children}</CalculatorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'