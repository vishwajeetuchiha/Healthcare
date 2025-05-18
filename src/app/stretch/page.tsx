'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface Stretch {
  id: string
  name: string
  duration: number
  description: string
  image: string
}

const DEFAULT_STRETCHES: Stretch[] = [
  {
    id: '1',
    name: 'Neck Stretch',
    duration: 30,
    description: 'Gently tilt your head from side to side',
    image: '🧘‍♂️',
  },
  {
    id: '2',
    name: 'Shoulder Rolls',
    duration: 30,
    description: 'Roll your shoulders forward and backward',
    image: '💪',
  },
  {
    id: '3',
    name: 'Cat-Cow Stretch',
    duration: 45,
    description: 'Alternate between arching and rounding your back',
    image: '🐱',
  },
  {
    id: '4',
    name: 'Hip Flexor Stretch',
    duration: 40,
    description: 'Lunge forward with one leg while keeping the other straight',
    image: '🦵',
  },
  {
    id: '5',
    name: 'Hamstring Stretch',
    duration: 35,
    description: 'Sit on the floor and reach for your toes',
    image: '🧘‍♀️',
  },
]

export default function StretchSequence() {
  const [stretches, setStretches] = useState<Stretch[]>(DEFAULT_STRETCHES)
  const [currentStretch, setCurrentStretch] = useState<Stretch | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(stretches)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setStretches(items)
  }

  const startSequence = () => {
    setIsPlaying(true)
    setCurrentStretch(stretches[0])
    setTimeLeft(stretches[0].duration)
    setIsActive(true)
  }

  const nextStretch = () => {
    const currentIndex = stretches.findIndex((s) => s.id === currentStretch?.id)
    if (currentIndex < stretches.length - 1) {
      const nextStretch = stretches[currentIndex + 1]
      setCurrentStretch(nextStretch)
      setTimeLeft(nextStretch.duration)
    } else {
      setIsPlaying(false)
      setCurrentStretch(null)
      setIsActive(false)
    }
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && currentStretch) {
      nextStretch()
    }

    return () => clearInterval(timer)
  }, [isActive, timeLeft, currentStretch])

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Stretch Sequence</h1>

      <div className="max-w-2xl mx-auto">
        {currentStretch && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center">
              <span className="text-6xl mb-4 block">{currentStretch.image}</span>
              <h2 className="text-2xl font-bold mb-2 text-black">{currentStretch.name}</h2>
              <p className="text-black mb-4">{currentStretch.description}</p>
              <div className="text-4xl font-bold mb-4 text-black">{timeLeft}s</div>
              <button
                onClick={toggleTimer}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isActive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold text-black">Stretch Sequence</h2>
            {!isPlaying && (
              <button
                onClick={startSequence}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Sequence
              </button>
            )}
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stretches">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {stretches.map((stretch, index) => (
                    <Draggable
                      key={stretch.id}
                      draggableId={stretch.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-gray-50 rounded-lg flex items-center gap-4"
                        >
                          <span className="text-2xl">{stretch.image}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-black">{stretch.name}</h3>
                            <p className="text-sm text-black">
                              {stretch.description}
                            </p>
                          </div>
                          <span className="text-black">
                            {stretch.duration}s
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Instructions</h2>
          <ul className="space-y-2 text-black">
            <li>• Drag and drop stretches to reorder them</li>
            <li>• Click "Start Sequence" to begin the routine</li>
            <li>• Follow the timer for each stretch</li>
            <li>• Take breaks between stretches if needed</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 