'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/index'
import { motion } from 'framer-motion'
import { deleteUser, reauthenticateWithPopup, TwitterAuthProvider } from 'firebase/auth'

interface UserProfile {
  twitterHandle: string
  projectDescription: string
  streakCount: number
  totalStars: number
  lastShipDate?: Date
}

function ProfileContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchProfile = async () => {
    if (!user || !db) return

    try {
      setLoading(true)
      setError(null)
      
      // Check if user is authenticated
      if (!user.uid) {
        throw new Error('User not authenticated')
      }

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setProfile({
          twitterHandle: data.twitterHandle || '',
          projectDescription: data.projectDescription || '',
          streakCount: data.streakCount || 0,
          totalStars: data.totalStars || 0,
          lastShipDate: data.lastShipDate ? new Date(data.lastShipDate) : undefined
        })
      } else {
        setError('Profile not found. Please try logging in again.')
        await handleLogout()
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      if (error.code === 'unavailable') {
        setError('You are currently offline. Please check your internet connection.')
        setIsOffline(true)
      } else if (error.code === 'permission-denied') {
        setError('You do not have permission to access this profile. Please try logging in again.')
        await handleLogout()
      } else if (error.code === 'not-found') {
        setError('Profile not found. Please try logging in again.')
        await handleLogout()
      } else {
        setError('Failed to load profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleReauthenticate = async () => {
    if (!user) return false

    try {
      // Reauthenticate with Twitter
      const provider = new TwitterAuthProvider()
      await reauthenticateWithPopup(user, provider)
      return true
    } catch (error: any) {
      setError(error.message)
      return false
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || !db || deleteConfirmText !== 'delete my account') return

    try {
      setIsDeleting(true)
      setError(null)

      // First reauthenticate
      const isReauthenticated = await handleReauthenticate()
      if (!isReauthenticated) {
        setIsDeleting(false)
        return
      }

      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid))

      // Delete user account
      await deleteUser(user)

      // Redirect to home
      router.replace('/')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      if (error.code === 'auth/requires-recent-login') {
        setError('Please re-enter your password to confirm this action')
      } else {
        setError(error.message)
      }
      setIsDeleting(false)
    }
  }

  if (loading || !profile) {
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
            onClick={fetchProfile}
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
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-4xl font-black text-transparent lowercase">
              {profile.twitterHandle}
            </h1>
            <p className="mt-3 text-lg text-gray-400 font-light">
              {profile.projectDescription}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div
              className="rounded-lg p-8 bg-gray-50 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-medium text-gray-900 lowercase">current streak</h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-5xl font-black text-gray-900">
                  {profile.streakCount}
                </p>
                <p className="ml-2 text-sm text-gray-400 font-light">days</p>
              </div>
              {profile.lastShipDate && (
                <p className="mt-2 text-sm text-gray-400 font-light">
                  last shipped: {profile.lastShipDate.toLocaleDateString()}
                </p>
              )}
            </motion.div>

            <motion.div
              className="rounded-lg p-8 bg-gray-50 border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-medium text-gray-900 lowercase">total stars</h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-5xl font-black text-gray-900">
                  {profile.totalStars}
                </p>
                <p className="ml-2 text-sm text-gray-400 font-light">⭐</p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/leaderboard')}
              className="inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 lowercase"
            >
              view leaderboard
            </button>
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 lowercase mb-6">account settings</h2>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                log out
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                delete account
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete my account' to confirm"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText('')
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'delete my account' || isDeleting}
                  className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'deleting...' : 'confirm delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-light">loading...</div>
      </div>
    )
  }

  return <ProfileContent />
} 