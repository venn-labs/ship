'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient, LeaderboardUser } from '@/lib/api/client'

function LeaderboardContent() {
  const router = useRouter()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getLeaderboard()
      setUsers(data)
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error)
      setError('Failed to load leaderboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-light">loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">⚠️</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={fetchLeaderboard}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-4xl font-black text-transparent lowercase">
              leaderboard
            </h1>
            <p className="mt-3 text-lg text-gray-400 font-light">
              top shippers!
            </p>
          </div>

          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                className="rounded-lg p-6 bg-gray-50 border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-black text-gray-400">
                      #{index + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 lowercase">
                        @{user.twitterHandle}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user.projectDescription}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 lowercase">ships</div>
                    <div className="text-2xl font-black text-gray-900">
                      {user.totalShips}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 lowercase"
            >
              back to dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default function Leaderboard() {
  return <LeaderboardContent />
} 