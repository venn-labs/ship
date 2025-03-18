'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient, OnboardingData } from '@/lib/api/client'
import { fadeIn, fadeInScale, staggerContainer, containerProps } from '@/lib/motion'

function OnboardingContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    projectDescription: '',
    commitmentLevel: 'casual'
  })

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setLoading(true)
        const status = await apiClient.getOnboardingStatus()
        if (status.isOnboarded) {
          router.replace('/dashboard')
        }
      } catch (error: any) {
        console.error('Error checking onboarding status:', error)
        setError('Failed to check onboarding status. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.projectDescription) return

    try {
      setIsSubmitting(true)
      setError(null)
      await apiClient.onboardUser(formData)
      router.replace('/dashboard')
    } catch (error: any) {
      console.error('Error completing onboarding:', error)
      setError('Failed to complete onboarding. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-light text-xl">loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-2xl">⚠️</div>
          <div className="text-gray-600 text-lg">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="text-base text-blue-500 hover:text-blue-600"
          >
            try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div 
          className="space-y-12"
          {...containerProps}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            className="space-y-6"
          >
            <h1 className="text-4xl font-black text-gray-900 lowercase">
              welcome to ship
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              let's get you started
            </p>
          </motion.div>

          {error && (
            <motion.div
              variants={fadeIn}
              className="text-lg font-medium text-red-600 text-center bg-red-50 p-6 rounded-2xl shadow-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-8"
            variants={fadeInScale}
          >
            <div>
              <label htmlFor="projectDescription" className="block text-base font-medium text-gray-700 mb-2">
                what are you building?
              </label>
              <div className="mt-1">
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  rows={4}
                  className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base p-4"
                  placeholder="describe your project..."
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="commitmentLevel" className="block text-base font-medium text-gray-700 mb-4">
                how committed are you?
              </label>
              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, commitmentLevel: 'casual' })}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.commitmentLevel === 'casual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🌱</div>
                    <div className="text-left">
                      <div className="font-bold text-lg">casual</div>
                      <div className="text-gray-600 text-sm">when i have time</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, commitmentLevel: 'serious' })}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.commitmentLevel === 'serious'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">⚡️</div>
                    <div className="text-left">
                      <div className="font-bold text-lg">serious</div>
                      <div className="text-gray-600 text-sm">regular updates</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, commitmentLevel: 'hardcore' })}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.commitmentLevel === 'hardcore'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🔥</div>
                    <div className="text-left">
                      <div className="font-bold text-lg">hardcore</div>
                      <div className="text-gray-600 text-sm">daily updates</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.projectDescription}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    <span>completing...</span>
                  </>
                ) : (
                  <>
                    <span>complete onboarding</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </main>
  )
}

export default function Onboarding() {
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
        <div className="animate-pulse text-gray-400 font-light text-xl">loading...</div>
      </div>
    )
  }

  return <OnboardingContent />
} 