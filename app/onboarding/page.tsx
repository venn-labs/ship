'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/index'

export default function Onboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState('')
  const [commitment, setCommitment] = useState<'casual' | 'regular' | 'intense'>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !commitment || !user) {
      setError('Please fill out all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        projectDescription: project,
        commitmentLevel: commitment,
        streakCount: 0,
        totalShips: 0,
        stars: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true })
      
      router.push('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const commitmentOptions = [
    {
      value: 'casual',
      label: 'Casual',
      description: 'Ship updates once a week',
      icon: '🌱',
    },
    {
      value: 'regular',
      label: 'Regular',
      description: 'Ship updates 2-3 times a week',
      icon: '🌿',
    },
    {
      value: 'intense',
      label: 'Intense',
      description: 'Ship updates almost daily',
      icon: '🌳',
    },
  ]

  return (
    <main className="min-h-[100dvh] bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12 px-4 py-12 sm:px-8 sm:py-16"
      >
        <div className="text-center space-y-4">
          <h1 className="text-[3.5rem] font-black tracking-tight">
            let's get you started
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            tell us about what you're working on
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-lg font-bold text-gray-700">
              what are you building?
            </label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. a twitter clone, my portfolio, a chrome extension"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-lg font-medium focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <label className="block text-lg font-bold text-gray-700">
              how often do you want to ship updates?
            </label>
            <div className="grid grid-cols-1 gap-4">
              {commitmentOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCommitment(option.value as typeof commitment)}
                  className={`flex items-center p-6 rounded-2xl border-2 shadow-lg ${
                    commitment === option.value
                      ? 'border-black bg-black text-white shadow-xl'
                      : 'border-gray-200 hover:border-black'
                  } transition-all duration-200`}
                >
                  <span className="text-3xl mr-6">{option.icon}</span>
                  <div className="text-left">
                    <div className="text-lg font-bold">{option.label}</div>
                    <div className={`text-base ${commitment === option.value ? 'text-gray-200' : 'text-gray-500'} font-medium`}>
                      {option.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-base text-gray-500 text-center font-medium">
              don't worry, you can always adjust your shipping goal later
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-medium text-red-600 text-center bg-red-50 p-6 rounded-2xl shadow-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !project || !commitment}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'setting up...' : 'start shipping'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  )
} 