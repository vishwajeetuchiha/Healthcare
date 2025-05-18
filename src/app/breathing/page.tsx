'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BREATHING_PATTERN = {
  inhale: 4,
  hold: 7,
  exhale: 8,
  rest: 0,
}

export default function BreathingExercise() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [timeLeft, setTimeLeft] = useState(BREATHING_PATTERN.inhale)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Move to next phase
      switch (phase) {
        case 'inhale':
          setPhase('hold')
          setTimeLeft(BREATHING_PATTERN.hold)
          break
        case 'hold':
          setPhase('exhale')
          setTimeLeft(BREATHING_PATTERN.exhale)
          break
        case 'exhale':
          setPhase('rest')
          setTimeLeft(BREATHING_PATTERN.rest)
          break
        case 'rest':
          setPhase('inhale')
          setTimeLeft(BREATHING_PATTERN.inhale)
          break
      }
    }

    return () => clearInterval(timer)
  }, [isActive, timeLeft, phase])

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 300
      case 'hold':
        return 300
      case 'exhale':
        return 100
      case 'rest':
        return 100
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      case 'rest':
        return 'Rest'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Breathing Exercise</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col items-center">
            <motion.div
              className="bg-blue-500 rounded-full flex items-center justify-center text-white"
              animate={{
                width: getCircleSize(),
                height: getCircleSize(),
              }}
              transition={{ duration: BREATHING_PATTERN[phase] }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-2xl font-semibold text-black"
                >
                  {getPhaseText()}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="mt-8 text-center">
              <p className="text-4xl font-bold mb-4 text-black">{timeLeft}</p>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Instructions</h2>
          <ul className="space-y-2 text-black">
            <li>• Inhale for 4 seconds</li>
            <li>• Hold for 7 seconds</li>
            <li>• Exhale for 8 seconds</li>
            <li>• Repeat the cycle</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-extrabold mb-2 text-black">About Your Breathing Capability & Lung Health</h2>
          <p className="text-black text-sm mb-2">
            Your ability to comfortably complete breathing exercises can reflect your lung capacity and overall respiratory health. If you find it difficult to inhale, hold, or exhale for the recommended times, it may be a sign to gradually build your lung strength or consult a healthcare professional.
          </p>
          <p className="text-black text-sm">
            Tracking your progress over time can help you notice improvements or spot potential issues early. Always listen to your body and seek medical advice if you experience persistent shortness of breath or discomfort.
          </p>
        </div>
      </div>
    </div>
  )
} 