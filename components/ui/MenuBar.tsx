'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth'
import { Logo } from '@/components/ui/vennLogo'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function MenuBar() {
  const { user, signOut: handleSignOut } = useAuth()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItemVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  }

  const ProfileImage = () => {
    if (!user?.photoURL || imageError) {
      return <div className="w-8 h-8 rounded-xl bg-gray-100 border-2 border-gray-200" />;
    }

    return (
      <Image
        src={user.photoURL}
        alt="Profile"
        width={32}
        height={32}
        className="rounded-xl object-cover border-2 border-gray-200"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white text-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-100 shadow-sm relative"
    >
      {/* Logo Section */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Link href="/" className="flex items-center">
          <Logo className="w-8 sm:w-10" />
        </Link>
      </motion.div>

      {/* Mobile Menu Button */}
      <motion.button
        className="sm:hidden p-2 rounded-xl hover:bg-gray-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </motion.button>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-x-6">
        <motion.div variants={menuItemVariants} whileHover="hover" whileTap="tap">
          <Link
            href="/leaderboard"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-base font-bold transition-colors"
          >
            leaderboard
          </Link>
        </motion.div>
        {user ? (
          <motion.button
            variants={menuItemVariants}
            whileHover="hover"
            whileTap="tap"
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-base font-bold transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            dashboard
          </motion.button>
        ) : (
          <motion.div variants={menuItemVariants} whileHover="hover" whileTap="tap">
            <Link
              href="https://discord.com/invite/P4s48QJ5xK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-base font-bold transition-colors"
            >
              community
            </Link>
          </motion.div>
        )}
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden sm:flex items-center gap-x-4 ml-auto">
        {user ? (
          <div className="relative">
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-x-3 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-base font-bold bg-gray-50 hover:bg-gray-100 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{(user.displayName || '').replace(/^@/, '') || 'user'}</span>
              <ProfileImage />
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl z-10 border border-gray-100 overflow-hidden"
                >
                  <motion.button
                    className="block w-full text-left px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      router.push('/profile')
                      setMenuOpen(false)
                    }}
                  >
                    profile
                  </motion.button>
                  <motion.button
                    className="block w-full text-left px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      handleSignOut()
                      setMenuOpen(false)
                    }}
                  >
                    sign out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/login')}
            className="bg-black text-white px-6 py-2.5 rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
          >
            get shipping
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg sm:hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <motion.div
                variants={menuItemVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Link
                  href="/leaderboard"
                  className="block text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl text-base font-bold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  leaderboard
                </Link>
              </motion.div>

              {user ? (
                <>
                  <motion.div
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <button
                      className="w-full text-left text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl text-base font-bold transition-colors"
                      onClick={() => {
                        router.push('/dashboard')
                        setMobileMenuOpen(false)
                      }}
                    >
                      dashboard
                    </button>
                  </motion.div>

                  <motion.div
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <button
                      className="w-full text-left text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl text-base font-bold transition-colors"
                      onClick={() => {
                        router.push('/profile')
                        setMobileMenuOpen(false)
                      }}
                    >
                      profile
                    </button>
                  </motion.div>

                  <motion.div
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <button
                      className="w-full text-left text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl text-base font-bold transition-colors"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      sign out
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <Link
                      href="https://discord.com/invite/P4s48QJ5xK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl text-base font-bold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      community
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <button
                      className="w-full bg-black text-white px-4 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
                      onClick={() => {
                        router.push('/login')
                        setMobileMenuOpen(false)
                      }}
                    >
                      get shipping
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 