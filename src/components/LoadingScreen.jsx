import React from 'react'
import { motion } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function LoadingScreen() {
  const { loadingProgress } = useMuseumStore()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0a1a 50%, #1a0a0a 100%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative hearts background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center relative z-10"
      >
        {/* Heart icon */}
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💕
        </motion.div>

        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ fontFamily: 'Playfair Display, serif', color: '#fda4af' }}
        >
          Love Museum
        </h1>

        <p className="text-rose-300/60 text-sm mb-10 tracking-widest uppercase">
          Sevgi Muzeyi yuklanmoqda...
        </p>

        {/* Progress bar */}
        <div className="w-64 md:w-80 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #f43f5e, #fbbf24)',
                width: `${loadingProgress}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-rose-300/40 text-xs mt-3">
            {Math.round(loadingProgress)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
