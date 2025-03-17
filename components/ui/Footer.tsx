"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  const linkVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      color: "#FF2DAB",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-white font-satoshi py-8 border-t border-gray-100 safe-area-bottom"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          className="flex flex-col space-y-6"
          variants={containerVariants}
        >
          {/* Main menu row */}
          <motion.div 
            className="flex justify-between items-center flex-wrap gap-y-4"
            variants={itemVariants}
          >
            {/* Left side - Navigation links */}
            <motion.nav 
              className="flex flex-wrap gap-x-8 gap-y-3"
              variants={itemVariants}
            >
              <motion.div
                className="text-base font-bold text-gray-500 hover:text-brand-pink transition-all touch-target"
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link href="/leaderboard" className="px-3 py-2 rounded-xl hover:bg-gray-50">leaderboard</Link>
              </motion.div>
              <motion.div
                className="text-base font-bold text-gray-500 hover:text-brand-pink transition-all touch-target"
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link href="https://vennlabs.io/privacy" className="px-3 py-2 rounded-xl hover:bg-gray-50">privacy</Link>
              </motion.div>
              <motion.div
                className="text-base font-bold text-gray-500 hover:text-brand-pink transition-all touch-target"
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link href="https://vennlabs.io/terms" className="px-3 py-2 rounded-xl hover:bg-gray-50">terms</Link>
              </motion.div>
            </motion.nav>

            {/* Right side - Social links */}
            <motion.div 
              className="flex gap-6"
              variants={itemVariants}
            >
              <motion.a
                href="https://discord.com/invite/P4s48QJ5xK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-blue transition-all p-2.5 rounded-xl hover:bg-gray-50 touch-target"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Join our Discord community"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://github.com/venn-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-blue transition-all p-2.5 rounded-xl hover:bg-gray-50 touch-target"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit our GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.a>

              <motion.a
                href="https://linkedin.com/company/venn-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-blue transition-all p-2.5 rounded-xl hover:bg-gray-50 touch-target"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit our LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Copyright notice */}
          <motion.div 
            className="text-center pb-2"
            variants={itemVariants}
          >
            <motion.p 
              className="text-sm font-medium text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              &copy; {new Date().getFullYear()}. made with 💛 for builders.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 