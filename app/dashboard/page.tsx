'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { apiClient, User } from '@/lib/api/client'

interface UserStats {
  streakCount: number
  totalShips: number
  stars: number
  commitmentLevel: 'casual' | 'serious' | 'hardcore'
  projectDescription: string
  lastShipDate?: Date
}

export default function Dashboard() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const userData = await apiClient.getCurrentUser()
        if (!userData) {
          setLoading(false)
          return
        }
        
        setStats({
          streakCount: userData.streakCount ?? 0,
          totalShips: userData.totalShips ?? 0,
          stars: userData.stars ?? 0,
          commitmentLevel: userData.commitmentLevel ?? 'casual',
          projectDescription: userData.projectDescription ?? '',
          lastShipDate: userData.lastShipDate ? new Date(userData.lastShipDate) : undefined
        })
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡️'
    if (streak >= 7) return '🌟'
    return '✨'
  }

  const getCommitmentIcon = (commitment: string) => {
    switch (commitment) {
      case 'casual': return '🌱'
      case 'regular': return '🌿'
      case 'intense': return '🌳'
      default: return '🌱'
    }
  }

  const getShippyMessage = () => {
    const hourOfDay = new Date().getHours()
    
    if (hourOfDay < 12) {
      return "good morning! ready to ship something awesome today? ⛵️"
    } else if (hourOfDay < 17) {
      return "ahoy! how's the shipping going? 🚢"
    } else {
      return "there's still time to ship something cool!"
    }
  }

  if (loading || !stats) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-bold text-lg">loading your stats...</div>
      </div>
    )
  }

  return (
    <main className="min-h-[100dvh] bg-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Shippy's Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 p-6 rounded-2xl bg-purple-50 border border-purple-100 shadow-lg"
        >
          <div className="relative w-16 h-16">
            <Image
              src="/shippy/shippy.png"
              alt="Shippy"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-gray-800 font-bold text-lg">{getShippyMessage()}</p>
        </motion.div>

        {/* Streak Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-100 rounded-2xl p-8 text-center space-y-4 relative shadow-lg"
        >
          <div className="text-7xl mb-3">{getStreakEmoji(stats.streakCount)}</div>
          <div className="text-3xl font-black text-gray-800">{stats.streakCount} day streak!</div>
          <p className="text-gray-600 font-medium text-lg">keep shipping to maintain your streak</p>
          {stats.streakCount >= 7 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-purple-500 text-white p-3 rounded-xl shadow-lg"
            >
              <div className="relative w-6 h-6">
                <Image
                  src="/shippy.png"
                  alt="Shippy"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Project Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{stats.projectDescription}</h2>
              <p className="text-gray-500 text-lg font-medium">
                {getCommitmentIcon(stats.commitmentLevel)} {stats.commitmentLevel} shipper
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://x.com/compose/post', '_blank')}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-lg font-bold shadow-lg transition-all hover:shadow-xl"
            >
              ship update
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg"
          >
             <div className="text-4xl mb-3">🚢 </div>
            <div className="text-3xl font-black text-gray-800">{stats.totalShips}</div>
            <p className="text-lg font-medium text-gray-500 mt-2">total ships</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg"
          >
            <div className="text-4xl mb-3">⭐️</div>
            <div className="text-3xl font-black text-gray-800">{stats.stars}</div>
            <p className="text-lg font-medium text-gray-500 mt-2">stars earned</p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
