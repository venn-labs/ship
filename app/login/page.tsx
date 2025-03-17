'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'

export default function Login() {
  const router = useRouter()
  const { signInWithTwitter, user, loading: authLoading } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  const handleTwitterLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithTwitter()
      // Auth state change listener in useAuth will handle redirection
    } catch (error: any) {
      console.error('Twitter login error:', error)
      
      // More specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked. Please allow pop-ups for this site.')
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Twitter login. Please contact support.')
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Twitter login is not enabled. Please contact support.')
      } else {
        setError(error.message || 'Failed to sign in with Twitter. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12 px-4 py-12 sm:px-8 sm:py-16"
        >
          <div className="text-center space-y-4">
            <h1 className="text-[3.5rem] font-black tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-transparent">welcome to ship</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              track your side project progress
            </p>
          </div>

          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTwitterLogin}
              disabled={loading || authLoading}
              className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-black text-white rounded-2xl shadow-lg text-lg font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {loading || authLoading ? 'connecting...' : 'continue with twitter'}
            </motion.button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-medium text-red-600 text-center bg-red-50 p-6 rounded-2xl shadow-lg"
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="text-center">
            <p className="text-base text-gray-500 px-4 font-medium">
              by continuing, you agree to our{' '}
              <Link href="https://vennlabs.io/terms" className="text-black hover:underline font-bold">terms of service</Link>
              {' '}and{' '}
              <Link href="https://vennlabs.io/privacy" className="text-black hover:underline font-bold">privacy policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 