'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/index'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface LeaderboardUser {
  id: string
  twitterHandle: string
  streakCount: number
  totalStars: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!db) return

      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, orderBy('streakCount', 'desc'), limit(5))
        const querySnapshot = await getDocs(q)
        
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as LeaderboardUser))

        setUsers(leaderboardData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-600 font-bold text-lg">loading top builders...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <h1 className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text font-black text-transparent text-[3.5rem] lowercase">
              top builders
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              ranked by their shipping streaks
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
          >
            <motion.ul
              role="list"
              className="divide-y divide-gray-100"
            >
              {users.map((leaderboardUser, index) => (
                <motion.li
                  key={leaderboardUser.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index + 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="hover:bg-gray-50 transition-all"
                >
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-lg font-black ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-50 text-gray-500'
                        } shadow-md`}>
                          {index + 1}
                        </div>
                        <div className="ml-6">
                          <div className="text-lg font-bold text-gray-900">
                            {leaderboardUser.twitterHandle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                          <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                            {leaderboardUser.streakCount}
                          </span>
                          <span className="ml-2 text-base font-medium text-gray-500">day streak</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-gray-900">
                            {leaderboardUser.totalStars}
                          </span>
                          <span className="ml-2 text-lg font-medium text-gray-500">⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-lg font-bold shadow-lg transition-all hover:shadow-xl"
            >
              join the leaderboard →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
} 