"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppleHelloEffectEnglish } from "./english"
import { AppleHelloEffectHindi } from "./hindi"
import { AppleHelloEffectSpanish } from "./spanish"
import { AppleHelloEffectVietnamese } from "./vietnamese"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [index, setIndex] = useState(0)

  const handleAnimationEnd = () => {
    if (index < 3) {
      setIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const demos = [
    <AppleHelloEffectEnglish
      key="english"
      className="text-white w-[85vw] max-w-[400px] sm:max-w-[500px]"
      durationScale={0.85}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectHindi
      key="hindi"
      className="text-white w-[85vw] max-w-[400px] sm:max-w-[500px]"
      durationScale={0.85}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectSpanish
      key="spanish"
      className="text-white w-[85vw] max-w-[400px] sm:max-w-[500px]"
      durationScale={0.85}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectVietnamese
      key="vietnamese"
      className="text-white w-[85vw] max-w-[500px] sm:max-w-[650px]"
      durationScale={0.85}
      onAnimationComplete={handleAnimationEnd}
    />,
  ]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden"
    >
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex h-48 w-full items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {demos[index]}
        </AnimatePresence>
      </div>

      {/* Subtitle helper */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-12 text-[10px] font-semibold tracking-widest uppercase text-white"
      >
        Initializing Workspace
      </motion.p>
    </motion.div>
  )
}
