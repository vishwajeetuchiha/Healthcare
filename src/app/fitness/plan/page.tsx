"use client"
import { useEffect, useState } from 'react';

interface FitnessGoals {
  goal: string;
  experience: string;
  frequency: string;
  duration: string;
  focus: string[];
}

// Workout templates copied from main fitness page
const WORKOUT_TEMPLATES: any = {
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
  },
  'Cardio': {
    exercises: [
      { name: 'Jump Rope', sets: 3, reps: 100, duration: 0 },
      { name: 'High Knees', sets: 3, reps: 40, duration: 0 },
      { name: 'Burpees', sets: 3, reps: 15, duration: 0 },
      { name: 'Mountain Climbers', sets: 3, reps: 30, duration: 0 }
    ],
    calories: 220,
    steps: 12000
  }
};

const FOCUS_ICONS: Record<string, string> = {
  'Full Body': '💪',
  'Upper Body': '🦾',
  'Lower Body': '��',
  'Core': '🧘',
  'Cardio': '🏃',
};

export default function FitnessPlanView() {
  const [plan, setPlan] = useState<FitnessGoals | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fitnessPlan');
    if (stored) setPlan(JSON.parse(stored));
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">No Plan Found</h2>
          <p className="text-gray-600">Please create your plan first.</p>
        </div>
      </div>
    );
  }

  // Gather all selected focus workouts
  const selectedWorkouts = plan.focus
    .map(area => WORKOUT_TEMPLATES[area])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2 tracking-tight drop-shadow">Your Fitness Plan</h1>
          <p className="text-lg text-gray-600">Personalized just for you. Stay consistent and enjoy your journey!</p>
        </header>
        <section className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">Plan Overview <span>📋</span></h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <li className="bg-blue-50 rounded-xl p-4"><b>Goal:</b> <span className="text-blue-900">{plan.goal}</span></li>
            <li className="bg-purple-50 rounded-xl p-4"><b>Experience:</b> <span className="text-purple-900">{plan.experience}</span></li>
            <li className="bg-blue-50 rounded-xl p-4"><b>Frequency:</b> <span className="text-blue-900">{plan.frequency} times/week</span></li>
            <li className="bg-purple-50 rounded-xl p-4"><b>Duration:</b> <span className="text-purple-900">{plan.duration} minutes</span></li>
            <li className="bg-blue-50 rounded-xl p-4 col-span-1 sm:col-span-2"><b>Focus:</b> <span className="text-blue-900">{plan.focus && plan.focus.join(', ')}</span></li>
          </ul>
        </section>
        {selectedWorkouts.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">Workout Details <span>🏋️‍♂️</span></h3>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedWorkouts.map((workout: any, idx: number) => {
                const focusName = Object.keys(WORKOUT_TEMPLATES)[Object.values(WORKOUT_TEMPLATES).indexOf(workout)];
                return (
                  <div key={idx} className="bg-white border border-purple-100 rounded-2xl shadow p-5 hover:shadow-xl transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{FOCUS_ICONS[focusName] || '🏋️‍♂️'}</span>
                      <h4 className="font-semibold text-purple-800 text-lg">{focusName} Plan</h4>
                    </div>
                    <ul className="list-disc ml-6 text-gray-700 mb-2">
                      {workout.exercises.map((ex: any, i: number) => (
                        <li key={i} className="mb-1">
                          <span className="font-medium text-gray-900">{ex.name}:</span> <span className="text-gray-700">{ex.sets} sets × {ex.reps > 0 ? `${ex.reps} reps` : `${ex.duration} sec`}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                      <span className="bg-blue-100 rounded px-2 py-1">🔥 Calories: <b>{workout.calories}</b></span>
                      <span className="bg-purple-100 rounded px-2 py-1">👣 Steps: <b>{workout.steps}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        <footer className="text-center mt-8">
          <p className="text-gray-500">Stay consistent and check back to update your plan as you progress! 💡</p>
        </footer>
      </div>
    </div>
  );
} 