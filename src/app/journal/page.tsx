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
import { format } from 'date-fns'

interface JournalEntry {
  id: string
  date: string
  mood: number
  content: string
  tags: string[]
}

const MOOD_LEVELS = [
  { value: 1, label: 'Very Low', emoji: '😢' },
  { value: 2, label: 'Low', emoji: '😔' },
  { value: 3, label: 'Neutral', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😊' },
]

const COMMON_TAGS = [
  'Anxiety',
  'Stress',
  'Gratitude',
  'Exercise',
  'Work',
  'Family',
  'Friends',
  'Health',
  'Sleep',
  'Hobbies',
]

// Mood tracker data (from mood page)
const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
  { emoji: '😌', label: 'Calm', color: 'bg-blue-400' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-400' },
  { emoji: '😔', label: 'Sad', color: 'bg-blue-600' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-500' },
  { emoji: '😰', label: 'Anxious', color: 'bg-purple-400' },
]

export default function MentalHealthJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    mood: 3,
    content: '',
    tags: [] as string[],
  })
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  // Mood tracker state (separate from journal entry mood)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    // Save entries to localStorage whenever they change
    localStorage.setItem('journalEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry.content) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood,
      content: newEntry.content,
      tags: newEntry.tags,
    }

    setEntries([...entries, entry])
    setNewEntry({ mood: 3, content: '', tags: [] })
  }

  const toggleTag = (tag: string) => {
    setNewEntry((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const filteredEntries = selectedTag
    ? entries.filter((entry) => entry.tags.includes(selectedTag))
    : entries

  const chartData = entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.mood,
    }))

  const handleMoodSelect = (mood: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    setSelectedMood(mood)
    setMoodHistory(prev => ({
      ...prev,
      [today]: mood
    }))
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Journal</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">New Entry</h2>
          <form onSubmit={addEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                How are you feeling?
              </label>
              <div className="flex justify-between">
                {MOOD_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setNewEntry({ ...newEntry, mood: level.value })}
                    className={`p-2 rounded-lg ${
                      newEntry.mood === level.value
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <p className="text-xs mt-1 text-black">{level.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Journal Entry
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 text-black"
                placeholder="Write your thoughts here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newEntry.tags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Entry
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Mood History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold text-black overflow-hidden">Journal Entries</h2>
            <div className="flex gap-2">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {filteredEntries
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-2xl mr-2">
                        {MOOD_LEVELS.find((m) => m.value === entry.mood)?.emoji}
                      </span>
                      <span className="text-black">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-black mb-2 break-words whitespace-pre-line">{entry.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 