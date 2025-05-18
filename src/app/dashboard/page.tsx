'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

interface DashboardData {
  waterIntake: Record<string, number>
  sleepEntries: Array<{
    date: string
    duration: number
  }>
  weightEntries: Array<{
    date: string
    weight: number
  }>
  moodHistory: Record<string, string>
  journalEntries: Array<{
    date: string
    mood: number
  }>
}

const features = [
  { title: 'Mood Tracker', href: '/mood', emoji: '😊' },
  { title: 'Water Intake', href: '/water', emoji: '💧' },
  { title: 'Breathing Exercise', href: '/breathing', emoji: '🌬️' },
  { title: 'Meal Log', href: '/meals', emoji: '🍽️' },
  { title: 'Sleep Tracker', href: '/sleep', emoji: '😴' },
  { title: 'Fitness Routine', href: '/fitness', emoji: '🏋️' },
  { title: 'Stretch Sequence', href: '/stretch', emoji: '🤸' },
  { title: 'Mental Health Journal', href: '/journal', emoji: '📝' },
  { title: 'Weight Tracking', href: '/weight', emoji: '⚖️' },
  { title: 'Health Dashboard', href: '/dashboard', emoji: '📊' },
]

export default function HealthDashboard() {
  const [data, setData] = useState<DashboardData>({
    waterIntake: {},
    sleepEntries: [],
    weightEntries: [],
    moodHistory: {},
    journalEntries: [],
  })

  useEffect(() => {
    // Load all saved data from localStorage
    const waterIntake = JSON.parse(localStorage.getItem('waterIntake') || '{}')
    const sleepEntries = JSON.parse(localStorage.getItem('sleepEntries') || '[]')
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]')
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '{}')
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]')

    setData({
      waterIntake,
      sleepEntries,
      weightEntries,
      moodHistory,
      journalEntries,
    })
  }, [])

  const getLatestMood = () => {
    const today = new Date().toISOString().split('T')[0]
    return data.moodHistory[today] || '😐'
  }

  const getAverageSleep = () => {
    if (data.sleepEntries.length === 0) return 0
    const total = data.sleepEntries.reduce((sum, entry) => sum + entry.duration, 0)
    return (total / data.sleepEntries.length).toFixed(1)
  }

  const getLatestWeight = () => {
    if (data.weightEntries.length === 0) return null
    return data.weightEntries[data.weightEntries.length - 1].weight
  }

  const getWaterProgress = () => {
    const today = new Date().toISOString().split('T')[0]
    const intake = data.waterIntake[today] || 0
    return Math.min((intake / 2000) * 100, 100) // Assuming 2000ml daily goal
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F7F3E8] border-r border-[#E8E2D6]/60 flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-extrabold text-[#7C6F57] mb-8 text-center">Features</h2>
        <nav className="flex flex-col gap-2">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-semibold text-lg
                ${feature.href === '/dashboard' ? 'bg-gradient-to-r from-[#FFE5B4] to-[#FFFDF6] text-[#7C6F57]' : 'text-[#7C6F57] hover:bg-[#F3E9D2]'}`}
            >
              <span className="text-2xl">{feature.emoji}</span>
              <span>{feature.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 px-0 py-0">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-extrabold text-[#7C6F57] text-center mb-12">Health Dashboard</h1>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-[#E3F0FF] rounded-2xl shadow p-6 border border-[#B6D8FF]">
                <h2 className="text-lg font-bold text-[#4A90E2] mb-2">Current Mood</h2>
                <p className="text-5xl text-center">{getLatestMood()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 border border-[#F3E9D2]">
                <h2 className="text-lg font-bold text-[#B09B72] mb-2">Average Sleep</h2>
                <p className="text-4xl text-center text-[#7C6F57]">{getAverageSleep()}h</p>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 border border-[#F3E9D2]">
                <h2 className="text-lg font-bold text-[#B09B72] mb-2">Current Weight</h2>
                <p className="text-4xl text-center text-[#7C6F57]">
                  {getLatestWeight() ? `${getLatestWeight()} kg` : 'No data'}
                </p>
              </div>

              <div className="bg-[#E3F0FF] rounded-2xl shadow p-6 border border-[#B6D8FF]">
                <h2 className="text-lg font-bold text-[#4A90E2] mb-2">Water Intake</h2>
                <div className="w-full bg-[#F7F3E8] border border-[#B6D8FF] rounded-full h-4">
                  <motion.div
                    className="bg-gradient-to-r from-[#B6D8FF] to-[#E3F0FF] h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getWaterProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-center mt-2 text-[#4A90E2]">
                  {Math.round(getWaterProgress())}% of daily goal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow p-6 border border-[#F3E9D2]">
                <h2 className="text-lg font-bold text-[#B09B72] mb-4">Sleep History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.sleepEntries
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(-7)
                        .map(entry => ({
                          date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
                          hours: entry.duration,
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3E9D2" />
                      <XAxis dataKey="date" stroke="#B09B72" />
                      <YAxis domain={[0, 12]} stroke="#B09B72" />
                      <Tooltip contentStyle={{ background: '#FFFDF6', border: 'none', color: '#7C6F57' }} labelStyle={{ color: '#7C6F57' }} />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#FFD6A5"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#FFD6A5' }}
                        activeDot={{ r: 7, fill: '#FFD6A5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 border border-[#F3E9D2]">
                <h2 className="text-lg font-bold text-[#B09B72] mb-4">Weight Progress</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.weightEntries
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map(entry => ({
                          date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
                          weight: entry.weight,
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3E9D2" />
                      <XAxis dataKey="date" stroke="#B09B72" />
                      <YAxis stroke="#B09B72" />
                      <Tooltip contentStyle={{ background: '#FFFDF6', border: 'none', color: '#7C6F57' }} labelStyle={{ color: '#7C6F57' }} />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#F7B267"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#F7B267' }}
                        activeDot={{ r: 7, fill: '#F7B267' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 