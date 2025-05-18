'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const WEEKDAYS = ['SU','MO','TU','WE','TH','FR','SA']
const DAYS_IN_MONTH = 31

interface FitnessGoals {
  goal: string
  experience: string
  frequency: string
  duration: string
  focus: string[]
}

interface Message {
  type: 'user' | 'bot'
  content: string
}

// AI Bot responses based on user input
const BOT_RESPONSES = {
  greeting: "Hi! I'm your fitness AI assistant. I'll help you create a personalized workout plan. What's your main fitness goal?",
  goals: {
    'weight-loss': "Great choice! For weight loss, we'll focus on a combination of cardio and strength training. What's your current fitness level?",
    'muscle-gain': "Excellent! Building muscle requires progressive overload and proper nutrition. What's your experience with strength training?",
    'endurance': "Perfect! We'll work on improving your stamina and cardiovascular health. How often can you train?",
    'flexibility': "Awesome! Flexibility training will help improve your range of motion. What's your current flexibility level?",
    'general': "Good choice! We'll create a balanced program for overall fitness. What's your current activity level?"
  },
  experience: {
    'beginner': "Perfect! We'll start with the basics and gradually increase intensity. How many days per week can you commit to working out?",
    'intermediate': "Great! We can incorporate more challenging exercises. How many days per week are you available?",
    'advanced': "Excellent! We'll create a challenging program to push your limits. How many days per week can you train?"
  },
  frequency: {
    '2-3': "That's a good starting point! We'll make each session count. How long would you like each workout to be?",
    '3-4': "Perfect frequency for steady progress! How long would you like each session to last?",
    '4-5': "That's a great commitment! We'll create a varied program. How long would you like each workout to be?",
    '5+': "Impressive dedication! We'll need to balance intensity and recovery. How long would you like each session to last?"
  },
  duration: {
    '15-20': "Short but effective! We'll focus on high-intensity workouts. Which areas would you like to focus on?",
    '20-30': "Good duration for balanced workouts! Which areas would you like to target?",
    '30-45': "Perfect for comprehensive training! Which areas would you like to emphasize?",
    '45+': "Great for detailed workouts! Which areas would you like to focus on?"
  },
  focus: "Based on your preferences, I'll create a personalized plan. Would you like to see your plan now?",
  default: "I understand. Let's focus on creating a plan that works for you. What would you like to know more about?"
}

// Workout templates for different days
const WORKOUT_TEMPLATES = {
  'Full Body': {
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12, duration: 0 },
      { name: 'Squats', sets: 3, reps: 15, duration: 0 },
      { name: 'Plank', sets: 3, reps: 1, duration: 45 },
      { name: 'Jumping Jacks', sets: 3, reps: 20, duration: 0 }
    ],
    calories: 180,
    steps: 9500
  },
  'Upper Body': {
    exercises: [
      { name: 'Push-ups', sets: 4, reps: 12, duration: 0 },
      { name: 'Diamond Push-ups', sets: 3, reps: 10, duration: 0 },
      { name: 'Plank', sets: 3, reps: 1, duration: 60 },
      { name: 'Arm Circles', sets: 3, reps: 20, duration: 0 }
    ],
    calories: 150,
    steps: 8000
  },
  'Lower Body': {
    exercises: [
      { name: 'Squats', sets: 4, reps: 15, duration: 0 },
      { name: 'Lunges', sets: 3, reps: 12, duration: 0 },
      { name: 'Jumping Jacks', sets: 3, reps: 25, duration: 0 },
      { name: 'Wall Sit', sets: 3, reps: 1, duration: 45 }
    ],
    calories: 200,
    steps: 10000
  },
  'Core': {
    exercises: [
      { name: 'Plank', sets: 3, reps: 1, duration: 60 },
      { name: 'Crunches', sets: 3, reps: 20, duration: 0 },
      { name: 'Mountain Climbers', sets: 3, reps: 30, duration: 0 },
      { name: 'Russian Twists', sets: 3, reps: 20, duration: 0 }
    ],
    calories: 120,
    steps: 7000
  }
}

export default function FitnessPlanPage() {
  const [selectedDay, setSelectedDay] = useState(2)
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<{[key: number]: string}>({})
  const [completedWorkouts, setCompletedWorkouts] = useState<{[key: number]: boolean}>({})
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({
    goal: '',
    experience: '',
    frequency: '',
    duration: '',
    focus: []
  })
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: BOT_RESPONSES.greeting }
  ])
  const [currentStep, setCurrentStep] = useState<'goal' | 'experience' | 'frequency' | 'duration' | 'focus' | 'complete'>('goal')
  const router = useRouter();

  const handleUserResponse = (response: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: response }])

    // Get bot response based on current step
    let botResponse = BOT_RESPONSES.default
    switch (currentStep) {
      case 'goal':
        if (BOT_RESPONSES.goals[response as keyof typeof BOT_RESPONSES.goals]) {
          botResponse = BOT_RESPONSES.goals[response as keyof typeof BOT_RESPONSES.goals]
          setFitnessGoals(prev => ({ ...prev, goal: response }))
          setCurrentStep('experience')
        }
        break
      case 'experience':
        if (BOT_RESPONSES.experience[response as keyof typeof BOT_RESPONSES.experience]) {
          botResponse = BOT_RESPONSES.experience[response as keyof typeof BOT_RESPONSES.experience]
          setFitnessGoals(prev => ({ ...prev, experience: response }))
          setCurrentStep('frequency')
        }
        break
      case 'frequency':
        if (BOT_RESPONSES.frequency[response as keyof typeof BOT_RESPONSES.frequency]) {
          botResponse = BOT_RESPONSES.frequency[response as keyof typeof BOT_RESPONSES.frequency]
          setFitnessGoals(prev => ({ ...prev, frequency: response }))
          setCurrentStep('duration')
        }
        break
      case 'duration':
        if (BOT_RESPONSES.duration[response as keyof typeof BOT_RESPONSES.duration]) {
          botResponse = BOT_RESPONSES.duration[response as keyof typeof BOT_RESPONSES.duration]
          setFitnessGoals(prev => ({ ...prev, duration: response }))
          setCurrentStep('focus')
        }
        break
      case 'focus':
        botResponse = BOT_RESPONSES.focus
        setCurrentStep('complete')
        break
    }

    // Add bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }])
    }, 500)
  }

  const getPlanSummary = () => {
    const { goal, experience, frequency, duration, focus } = fitnessGoals
    
    const goalText = {
      'weight-loss': 'weight loss',
      'muscle-gain': 'building muscle',
      'endurance': 'improving endurance',
      'flexibility': 'increasing flexibility',
      'general': 'general fitness'
    }[goal] || 'your fitness goals'

    const experienceText = {
      'beginner': 'beginner-friendly',
      'intermediate': 'intermediate-level',
      'advanced': 'advanced'
    }[experience] || ''

    const focusAreas = focus.length > 0 
      ? focus.join(', ').replace(/,([^,]*)$/, ' and$1')
      : 'all major muscle groups'

    return `Based on your preferences, I've created a ${experienceText} workout plan focused on ${goalText}. 
    You'll be working out ${frequency} times per week, with each session lasting ${duration} minutes. 
    The plan emphasizes ${focusAreas} to help you achieve your goals. 
    Each workout will be tailored to your experience level and will progress in intensity over time.`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-2">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-extrabold mb-6 text-black">AI Fitness Assistant</h2>
        
        {/* Chat Interface */}
        <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Response Buttons */}
        {currentStep === 'goal' && (
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(BOT_RESPONSES.goals).map(goal => (
              <button
                key={goal}
                onClick={() => handleUserResponse(goal)}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
              >
                {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'experience' && (
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(BOT_RESPONSES.experience).map(exp => (
              <button
                key={exp}
                onClick={() => handleUserResponse(exp)}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
              >
                {exp.charAt(0).toUpperCase() + exp.slice(1)}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'frequency' && (
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(BOT_RESPONSES.frequency).map(freq => (
              <button
                key={freq}
                onClick={() => handleUserResponse(freq)}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
              >
                {freq} times/week
              </button>
            ))}
          </div>
        )}

        {currentStep === 'duration' && (
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(BOT_RESPONSES.duration).map(dur => (
              <button
                key={dur}
                onClick={() => handleUserResponse(dur)}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
              >
                {dur} minutes
              </button>
            ))}
          </div>
        )}

        {currentStep === 'focus' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Upper Body', icon: '🦾' },
              { label: 'Lower Body', icon: '🦵' },
              { label: 'Core', icon: '🧘' },
              { label: 'Cardio', icon: '🏃' },
              { label: 'Flexibility', icon: '🤸' },
              { label: 'Balance', icon: '⚖️' }
            ].map(area => (
              <button
                key={area.label}
                onClick={() => {
                  setFitnessGoals(prev => ({
                    ...prev,
                    focus: [...prev.focus, area.label]
                  }))
                  handleUserResponse(area.label)
                }}
                className={`flex items-center gap-2 p-2 text-sm rounded-lg text-black ${
                  fitnessGoals.focus.includes(area.label)
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{area.icon}</span>
                {area.label}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Your Personalized Plan Summary</h3>
              <p className="text-gray-700 leading-relaxed">
                {getPlanSummary()}
              </p>
            </div>
            <button
              className="w-full bg-black text-white py-3 rounded-full font-semibold shadow hover:bg-gray-900 transition"
              onClick={() => {
                localStorage.setItem('fitnessPlan', JSON.stringify(fitnessGoals));
                router.push('/fitness/plan');
              }}
            >
              Save My Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 