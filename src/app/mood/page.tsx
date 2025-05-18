'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
  { emoji: '😌', label: 'Calm', color: 'bg-blue-400' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-400' },
  { emoji: '😔', label: 'Sad', color: 'bg-blue-600' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-500' },
  { emoji: '😰', label: 'Anxious', color: 'bg-purple-400' },
]

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({})

  const handleMoodSelect = (mood: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    setSelectedMood(mood)
    setMoodHistory(prev => ({
      ...prev,
      [today]: mood
    }))
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-black">Mood Tracker</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-100 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-black">How are you feeling today?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {moods.map((mood) => (
              <motion.button
                key={mood.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center ${
                  selectedMood === mood.emoji ? mood.color : 'bg-green-50'
                }`}
                onClick={() => handleMoodSelect(mood.emoji)}
              >
                <span className="text-3xl sm:text-4xl mb-1 sm:mb-2">{mood.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-black">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-green-100 rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-black">Mood History</h2>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3">
            {Object.entries(moodHistory).map(([date, mood]) => (
              <div
                key={date}
                className="aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl text-black font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] bg-green-50"
              >
                {mood}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 