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
import { SignInButton, SignUpButton } from '@clerk/nextjs'

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

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Logo */}
        <svg width="100" height="100" viewBox="0 0 120 120" fill="none" className="mb-6">
          <path d="M60 100 Q20 80 20 50 Q20 20 60 20 Q100 20 100 50 Q100 80 60 100 Z" stroke="#2563EB" strokeWidth="6" fill="none"/>
          <path d="M60 40 V70" stroke="#2563EB" strokeWidth="6" strokeLinecap="round"/>
          <path d="M47 55 H73" stroke="#2563EB" strokeWidth="6" strokeLinecap="round"/>
        </svg>
        <h1 className="text-2xl font-extrabold text-blue-900 mb-2">Healthcare</h1>
        <h2 className="text-lg font-extrabold text-gray-900 mt-4 mb-1 text-center">Let's get started!</h2>
        <p className="text-gray-500 mb-8 text-center">Login to Stay healthy and fit</p>
        <div className="flex flex-col gap-4 w-full">
          <SignInButton forceRedirectUrl="/dashboard">
            <button className="w-full py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition">Login</button>
          </SignInButton>
          <SignUpButton forceRedirectUrl="/dashboard">
            <button className="w-full py-3 bg-white text-blue-600 border border-blue-500 rounded-full text-lg font-semibold hover:bg-blue-50 transition">Sign Up</button>
          </SignUpButton>
          <Link href="/dashboard">
            <button className="w-full py-3 bg-gray-100 text-blue-700 border border-blue-300 rounded-full text-lg font-semibold hover:bg-blue-100 transition">Go to Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
