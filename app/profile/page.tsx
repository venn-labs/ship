'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient, User } from '@/lib/api/client'

function ProfileContent() {
  const router = useRouter()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [projectDescription, setProjectDescription] = useState('')
  const [commitmentLevel, setCommitmentLevel] = useState<'casual' | 'serious' | 'hardcore'>('casual')

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`\n=== Fetching Profile ===`)
      const userData = await apiClient.getCurrentUser()
      console.log(`User Data:`, userData)
      console.log(`Twitter Handle:`, userData?.twitterHandle)
      console.log(`===========================\n`)
      
      if (!userData) {
        router.push('/login')
        return
      }
      setProfile(userData)
      setProjectDescription(userData.projectDescription)
      setCommitmentLevel(userData.commitmentLevel)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      localStorage.removeItem('token')
      // Dispatch auth state change event
      window.dispatchEvent(new Event('authStateChanged'))
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      localStorage.removeItem('token')
      // Dispatch auth state change event even if there's an error
      window.dispatchEvent(new Event('authStateChanged'))
      router.replace('/login')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'delete my account') return

    try {
      setIsDeleting(true)
      setError(null)

      await apiClient.deleteUser()
      // Dispatch auth state change event after account deletion
      window.dispatchEvent(new Event('authStateChanged'))
      await handleLogout()
    } catch (error: any) {
      console.error('Error deleting account:', error)
      setError(error.message)
      setIsDeleting(false)
    }
  }

  const handleSave = async () => {
    try {
      const updatedUser = await apiClient.updateUser({
        projectDescription,
        commitmentLevel
      })
      setProfile(updatedUser)
      setIsEditing(false)
      setError('')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
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
            <h1 className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-4xl font-black text-transparent">
              {profile.name}
            </h1>
            <div className="mt-6 space-y-6">
              {isEditing ? (
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Project Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-left">
                      What are you shipping?
                    </label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      rows={4}
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {/* Commitment Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-left">
                      Commitment Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setCommitmentLevel('casual')}
                        className={`p-4 rounded-xl text-base font-bold transition-all ${
                          commitmentLevel === 'casual'
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        casual
                      </button>
                      <button
                        onClick={() => setCommitmentLevel('serious')}
                        className={`p-4 rounded-xl text-base font-bold transition-all ${
                          commitmentLevel === 'serious'
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        serious
                      </button>
                      <button
                        onClick={() => setCommitmentLevel('hardcore')}
                        className={`p-4 rounded-xl text-base font-bold transition-all ${
                          commitmentLevel === 'hardcore'
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        hardcore
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-black text-white px-8 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      save changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setProjectDescription(profile.projectDescription)
                        setCommitmentLevel(profile.commitmentLevel)
                        setError('')
                      }}
                      className="bg-gray-50 text-gray-600 px-8 py-3 rounded-xl text-base font-bold border border-gray-200 hover:bg-gray-100 transition-all"
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-400 font-light">
                    {profile.projectDescription}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-black text-white px-8 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    edit profile
                  </button>
                </>
              )}
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div
              className="rounded-lg p-8 bg-gray-50 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-medium text-gray-900 lowercase">commitment level</h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-5xl font-black text-gray-900">
                  {commitmentLevel}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="rounded-lg p-8 bg-gray-50 border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-medium text-gray-900 lowercase">member since</h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-5xl font-black text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
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
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiClient.getCurrentUser()
        if (!user) {
          router.replace('/login')
        }
      } catch (error) {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-light">loading...</div>
      </div>
    )
  }

  return <ProfileContent />
} 