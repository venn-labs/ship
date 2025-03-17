'use client'

import { motion } from 'framer-motion'

interface LoadingDotsProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingDots({ text, size = 'md' }: LoadingDotsProps) {
  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }[size]

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[size]

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSize} bg-gray-600 rounded-xl shadow-sm`}
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${textSize} font-bold text-gray-600`}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
} 