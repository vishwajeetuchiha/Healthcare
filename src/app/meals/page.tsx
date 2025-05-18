'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Meal {
  id: string
  name: string
  calories: number
  time: string
  date: string
  category: string
}

type MealSuggestion = {
  name: string
  calories: number
  category: string
  image: string
}

// Example meal suggestions with categories and images
const MEAL_SUGGESTIONS: MealSuggestion[] = [
  // Non-Veg
  { name: 'Grilled Chicken Salad', calories: 350, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Turkey Sandwich', calories: 400, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Grilled Fish & Veggies', calories: 450, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Egg Curry with Rice', calories: 420, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chicken Stir Fry', calories: 380, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Tuna Wrap', calories: 320, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Shrimp Tacos', calories: 370, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  // Veg
  { name: 'Veggie Omelette', calories: 200, category: 'Veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Quinoa Bowl', calories: 500, category: 'Veg', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rice & Beans', calories: 300, category: 'Veg', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Paneer Tikka', calories: 350, category: 'Veg', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Vegetable Stir Fry', calories: 250, category: 'Veg', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chickpea Salad', calories: 280, category: 'Veg', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dal with Brown Rice', calories: 330, category: 'Veg', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  // Fruit
  { name: 'Oatmeal with Fruits', calories: 250, category: 'Fruit', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Fruit Smoothie', calories: 180, category: 'Fruit', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Yogurt Parfait', calories: 220, category: 'Fruit', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Apple & Banana Bowl', calories: 160, category: 'Fruit', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mango Chia Pudding', calories: 210, category: 'Fruit', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Berry Medley', calories: 140, category: 'Fruit', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Citrus Salad', calories: 130, category: 'Fruit', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  // Dry Fruits
  { name: 'Mixed Dry Fruits', calories: 150, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Almond & Date Balls', calories: 120, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cashew & Raisin Mix', calories: 160, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Walnut & Fig Mix', calories: 170, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pistachio Trail Mix', calories: 180, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Apricot & Nut Bites', calories: 140, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Peanut & Cranberry Mix', calories: 155, category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
]
const MEAL_CATEGORIES = ['Veg', 'Non-Veg', 'Fruit', 'Dry Fruits']

export default function MealLog() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [newMeal, setNewMeal] = useState({ name: '', calories: '' })
  const [today, setToday] = useState(new Date().toISOString().split('T')[0])
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const [suggestedMeal, setSuggestedMeal] = useState<MealSuggestion | null>(null)
  const [category, setCategory] = useState('Veg')

  useEffect(() => {
    // Load saved meals from localStorage
    const savedMeals = localStorage.getItem('meals')
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
  }, [])

  useEffect(() => {
    // Save meals to localStorage whenever they change
    localStorage.setItem('meals', JSON.stringify(meals))
  }, [meals])

  // Clear suggestion if calorie goal or category changes
  useEffect(() => {
    setSuggestedMeal(null)
  }, [calorieGoal, category])

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMeal.name || !newMeal.calories) return

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: parseInt(newMeal.calories),
      time: new Date().toLocaleTimeString(),
      date: today,
      category: category,
    }

    setMeals([...meals, meal])
    setNewMeal({ name: '', calories: '' })
  }

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id))
  }

  const todayMeals = meals.filter(meal => meal.date === today)
  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const remainingCalories = Math.max(0, calorieGoal - totalCalories)

  // Suggest a meal that fits the remaining calories and selected category
  const handleSuggestMeal = () => {
    const suitableMeals = MEAL_SUGGESTIONS.filter(m => m.calories <= remainingCalories && m.category === category)
    if (suitableMeals.length > 0) {
      const best = suitableMeals.reduce((a, b) => (a.calories > b.calories ? a : b))
      setSuggestedMeal(best)
    } else {
      // If none fit, suggest the lowest calorie meal in the category
      const categoryMeals = MEAL_SUGGESTIONS.filter(m => m.category === category)
      if (categoryMeals.length > 0) {
        const lowest = categoryMeals.reduce((a, b) => (a.calories < b.calories ? a : b), categoryMeals[0])
        setSuggestedMeal(lowest)
      } else {
        setSuggestedMeal(null)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black">Meal Log</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Add Meal</h2>
          <form onSubmit={addMeal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Meal Name
              </label>
              <input
                type="text"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-black"
                placeholder="e.g., Breakfast, Lunch, Snack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Calories
              </label>
              <input
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-black"
                placeholder="Enter calories"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-bold"
            >
              Add Meal
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-extrabold mb-4 text-black">Today's Meals</h2>
          <div className="space-y-4">
            {todayMeals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-black">{meal.name}</h3>
                  <p className="text-sm text-black">{meal.time}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-black">{meal.calories} cal</span>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-black">Total Calories</span>
              <span className="font-bold text-black">{totalCalories} cal</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-extrabold mb-4 text-black">Weekly Summary</h2>
          <div className="space-y-4">
            {Object.entries(
              meals.reduce((acc, meal) => {
                if (!acc[meal.date]) {
                  acc[meal.date] = 0
                }
                acc[meal.date] += meal.calories
                return acc
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 7)
              .map(([date, calories]) => (
                <div key={date} className="flex justify-between items-center">
                  <span className="text-black">{new Date(date).toLocaleDateString()}</span>
                  <span className="font-medium text-black">{calories} cal</span>
                </div>
              ))}
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-black mb-2">AI Meal Assistant</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <label className="text-black text-sm font-medium">Calorie Goal:</label>
              <input
                type="number"
                min={500}
                max={5000}
                value={calorieGoal}
                onChange={e => setCalorieGoal(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md w-32 text-black"
              />
              <span className="text-black text-sm">Remaining: <span className="font-bold">{remainingCalories}</span> cal</span>
              <label className="text-black text-sm font-medium">Category:</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md text-black"
              >
                {MEAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                onClick={handleSuggestMeal}
              >
                Suggest Meal
              </button>
            </div>
            {suggestedMeal && suggestedMeal !== null && (
              <div className="mt-2 p-2 bg-green-100 rounded text-black flex items-center gap-4">
                <img src={suggestedMeal.image} alt={suggestedMeal.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <span className="font-semibold">Suggested Meal:</span> {suggestedMeal.name} (<span className="font-bold">{suggestedMeal.calories} cal</span>, {suggestedMeal.category})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 