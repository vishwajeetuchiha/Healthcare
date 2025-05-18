'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CUP_SIZES = [
  { amount: 250, label: 'Small', icon: '🥤' },
  { amount: 350, label: 'Medium', icon: '🥤' },
  { amount: 500, label: 'Large', icon: '🥤' },
]

const DAILY_GOAL = 2000 // ml

export default function WaterTracker() {
  const [today, setToday] = useState(new Date().toISOString().split('T')[0])
  const [intake, setIntake] = useState<Record<string, number>>({})
  const [currentIntake, setCurrentIntake] = useState(0)

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('waterIntake')
    if (savedData) {
      setIntake(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    // Update current intake when date changes
    setCurrentIntake(intake[today] || 0)
  }, [today, intake])

  const addWater = (amount: number) => {
    const newIntake = {
      ...intake,
      [today]: (intake[today] || 0) + amount
    }
    setIntake(newIntake)
    localStorage.setItem('waterIntake', JSON.stringify(newIntake))
  }

  const progress = (currentIntake / DAILY_GOAL) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-1">Recommended Daily Water Intake</h2>
          <p className="text-black text-sm">Minimum: 1500ml (about 6 cups) &nbsp;|&nbsp; Maximum: 3000ml (about 12 cups)<br/>
          Actual needs vary by age, activity, and climate.</p>
        </div>
      </div>
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Water Intake Tracker</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold mb-2 text-black">Daily Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className="bg-blue-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center mt-2 text-black">
              {currentIntake}ml / {DAILY_GOAL}ml
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {CUP_SIZES.map((cup) => (
              <motion.button
                key={cup.amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-blue-100 rounded-lg flex flex-col items-center"
                onClick={() => addWater(cup.amount)}
              >
                <span className="text-4xl mb-2">{cup.icon}</span>
                <span className="font-medium text-black">{cup.label}</span>
                <span className="text-sm text-black">{cup.amount}ml</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Weekly History</h2>
          <div className="space-y-4">
            {Object.entries(intake)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 7)
              .map(([date, amount]) => (
                <div key={date} className="flex justify-between items-center">
                  <span className="text-black">{new Date(date).toLocaleDateString()}</span>
                  <span className="font-medium text-black">{amount}ml</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 