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

interface SleepEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number // in hours
}

export default function SleepTracker() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem('sleepEntries')
    if (savedEntries) {
      setSleepEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    // Save entries to localStorage whenever they change
    localStorage.setItem('sleepEntries', JSON.stringify(sleepEntries))
  }, [sleepEntries])

  const addSleepEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry.startTime || !newEntry.endTime) return

    const start = new Date(`2000-01-01T${newEntry.startTime}`)
    const end = new Date(`2000-01-01T${newEntry.endTime}`)
    
    // Handle overnight sleep
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration: parseFloat(duration.toFixed(1)),
    }

    setSleepEntries([...sleepEntries, entry])
    setNewEntry({ startTime: '', endTime: '' })
  }

  const deleteEntry = (id: string) => {
    setSleepEntries(sleepEntries.filter(entry => entry.id !== id))
  }

  const chartData = sleepEntries
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      hours: entry.duration,
    }))

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-green-100 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-1">Recommended Sleep Duration</h2>
          <p className="text-black text-sm">Most adults need 7-9 hours of sleep per night for optimal health and functioning.<br/>
          Children and teens generally require more. Quality of sleep is as important as quantity.</p>
        </div>
      </div>
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Sleep Tracker</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Log Sleep</h2>
          <form onSubmit={addSleepEntry} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Bedtime
                </label>
                <input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Wake-up Time
                </label>
                <input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-bold"
            >
              Add Sleep Entry
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Sleep History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 12]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Recent Entries</h2>
          <div className="space-y-4">
            {sleepEntries
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 7)
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
                    <p className="text-sm text-black">
                      {entry.startTime} - {entry.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-black">{entry.duration} hours</span>
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