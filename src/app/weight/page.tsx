'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface WeightEntry {
  id: string
  date: string
  weight: number
  note: string
}

export default function WeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [newEntry, setNewEntry] = useState({ weight: '', note: '' })
  const [goal, setGoal] = useState<number | null>(null)

  useEffect(() => {
    // Load saved data from localStorage
    const savedEntries = localStorage.getItem('weightEntries')
    const savedGoal = localStorage.getItem('weightGoal')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
    if (savedGoal) {
      setGoal(parseFloat(savedGoal))
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('weightEntries', JSON.stringify(entries))
    if (goal !== null) {
      localStorage.setItem('weightGoal', goal.toString())
    }
  }, [entries, goal])

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry.weight) return

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newEntry.weight),
      note: newEntry.note,
    }

    setEntries([...entries, entry])
    setNewEntry({ weight: '', note: '' })
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const chartData = entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      weight: entry.weight,
    }))

  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weight : null
  const weightChange = entries.length >= 2
    ? latestWeight! - entries[0].weight
    : 0

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Weight Tracker</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Add Weight Entry</h2>
          <form onSubmit={addEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={newEntry.weight}
                onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter your weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={newEntry.note}
                onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                placeholder="Add a note about your weight"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Entry
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-extrabold text-black mb-1">Current Weight</h3>
              <p className="text-2xl text-black font-bold">
                {latestWeight ? `${latestWeight} kg` : 'No entries'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-extrabold text-black mb-1">Total Change</h3>
              <p className="text-2xl text-black font-bold">
                {weightChange !== 0
                  ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`
                  : 'No change'}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Weight Goal (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={goal || ''}
              onChange={(e) => setGoal(e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              placeholder="Set your weight goal"
            />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {goal && (
                  <Line
                    type="monotone"
                    dataKey={() => goal}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Weight History</h2>
          <div className="space-y-4">
            {entries
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-black">
                      {new Date(entry.date).toLocaleDateString()}
                    </h3>
                    {entry.note && (
                      <p className="text-sm text-black">{entry.note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{entry.weight} kg</span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 