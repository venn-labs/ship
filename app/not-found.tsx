"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block bg-gray-800/5 rounded-2xl px-6 py-3 text-gray-600 text-base font-bold shadow-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ page not found
          </motion.div>

          <motion.h1 
            className="text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              404
            </span>
            <span className="text-gray-800 ml-4">got a bit lost</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            the page you're looking for doesn't exist
          </motion.p>

          <motion.button
            className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            go back home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
