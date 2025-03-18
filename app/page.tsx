'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeIn, fadeInScale, staggerContainer, containerProps } from '@/lib/motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiClient.getCurrentUser()
        setIsAuthenticated(user !== null)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-light">loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div 
          className="text-center space-y-16"
          {...containerProps}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-gray-50 rounded-2xl shadow-sm">
              <p className="text-base font-bold text-gray-600">✨ for the side project hustlers</p>
            </div>

            <div className="space-y-4">
              <h1 className="text-[3.5rem] leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-transparent font-black">ship</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl mx-auto font-medium">
                ship your side projects on X
              </p>
            </div>

            <motion.div
              variants={fadeInScale}
              className="pt-8"
            >
              <motion.button
                onClick={() => router.push(isAuthenticated ? '/profile' : '/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-3.5 rounded-2xl text-lg font-bold shadow-lg transition-all hover:shadow-xl"
              >
                {isAuthenticated ? 'go to profile →' : 'start shipping →'}
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="space-y-6"
          >
            <div className="max-w-xl mx-auto flex items-center justify-center">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
              >
                <Image src="/shippy/shippy.png" alt="shippy" width={400} height={400} className="drop-shadow-xl" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
