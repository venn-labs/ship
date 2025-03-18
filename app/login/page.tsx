'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api/client'
import { fadeIn, fadeInScale, staggerContainer, containerProps } from '@/lib/motion'
import Image from 'next/image'
import { getAuth, signInWithPopup, TwitterAuthProvider } from 'firebase/auth'
import '@/lib/firebase' // Import Firebase config

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTwitterLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Initialize Firebase Auth
      const auth = getAuth()
      const provider = new TwitterAuthProvider()
      
      // Sign in with Twitter
      const result = await signInWithPopup(auth, provider)
      
      // Get the ID token
      const idToken = await result.user.getIdToken()
      if (!idToken) {
        throw new Error('Failed to get ID token from Firebase')
      }
      
      // Login to our backend
      console.log(`Logging in to backend...`)
      const response = await apiClient.login(idToken)
      console.log(`Backend login response:`, response)
      
      // Store the token
      if (!response.token) {
        throw new Error('No token received from backend')
      }
      console.log(`Storing token in localStorage...`)
      localStorage.setItem('token', response.token)
      
      // Dispatch auth state change event
      console.log(`Dispatching auth state change event...`)
      window.dispatchEvent(new Event('authStateChanged'))
      
      // Get current user data to check if they exist
      console.log(`Getting current user data...`)
      const userData = await apiClient.getCurrentUser()
      console.log(`Current user data:`, userData)
      
      // Only create user if they don't exist
      if (!userData) {
        console.log(`User doesn't exist, creating new user...`)
        const twitterHandle = result.user.providerData[0].displayName || 
                            result.user.email?.split('@')[0] || 
                            `user_${result.user.uid.slice(0, 6)}`
        console.log(`Twitter Handle from provider:`, result.user.providerData[0].displayName)
        console.log(`Twitter Handle from email:`, result.user.email?.split('@')[0])
        console.log(`Final Twitter Handle:`, twitterHandle)
        
        await apiClient.createUser({
          commitmentLevel: 'casual',
          projectDescription: '',
          isOnboarded: false,
          twitterHandle,
          name: result.user.displayName || twitterHandle,
          email: result.user.email || '',
          photoURL: result.user.photoURL || ''
        })
        console.log(`User created successfully with Twitter Handle:`, twitterHandle)
      }
      
      // Redirect based on onboarding status
      if (!userData?.projectDescription || !userData?.commitmentLevel) {
        console.log(`User needs onboarding, redirecting to onboarding...`)
        router.replace('/onboarding')
      } else {
        console.log(`User already onboarded, redirecting to profile...`)
        router.replace('/profile')
      }
    } catch (error: any) {
      console.error('Error signing in with Twitter:', error)
      setError('Failed to sign in with Twitter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24"
          {...containerProps}
          variants={staggerContainer}
        >
          {/* Left Content */}
          <motion.div
            variants={fadeIn}
            className="flex-1 max-w-xl w-full space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-[3.5rem] leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-transparent font-black">welcome to ship</span>
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                track your progress and stay accountable
              </p>
            </div>

            {error && (
              <motion.div
                variants={fadeIn}
                className="text-base font-medium text-red-600 text-center bg-red-50 p-6 rounded-2xl shadow-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              variants={fadeInScale}
              className="pt-4"
            >
              <motion.button
                onClick={handleTwitterLogin}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#1DA1F2] text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span>continue with twitter</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Shippy */}
          <motion.div 
            variants={fadeIn}
            className="flex-1 flex items-center justify-center"
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
              className="relative w-full max-w-lg"
            >
              <Image 
                src="/shippy/shippy.png" 
                alt="shippy" 
                width={600} 
                height={600} 
                className="drop-shadow-xl"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
} 