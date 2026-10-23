import React from 'react'
import { motion } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function FinaleScreen({ data }) {
  const { setGameState } = useMuseumStore()

  const restart = () => {
    setGameState('welcome')
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      {/* Restart button at bottom */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.button
          onClick={restart}
          className="glass rounded-full px-8 py-3 text-rose-300 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Qayta boshlash
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
