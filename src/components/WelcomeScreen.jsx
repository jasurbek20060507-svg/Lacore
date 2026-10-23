import React from 'react'
import { motion } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function WelcomeScreen({ data }) {
  const { setGameState } = useMuseumStore()

  const startJourney = () => {
    setGameState('playing')
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0a1a 30%, #0a0a1a 70%, #1a0a0a 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 3 === 0
                ? 'rgba(244, 63, 94, 0.4)'
                : i % 3 === 1
                  ? 'rgba(251, 191, 36, 0.3)'
                  : 'rgba(255, 255, 255, 0.2)',
            }}
            animate={{
              y: [0, -(Math.random() * 100 + 50)],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Decorative top line */}
        <motion.div
          className="w-16 h-px mx-auto mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #fda4af, transparent)' }}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* Museum title */}
        <motion.p
          className="text-rose-300/60 text-xs tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {data.welcomeTitle || 'Sevgi Muzeyi'}
        </motion.p>

        {/* Couple names */}
        <motion.h1
          className="text-glow mb-6"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            fontWeight: 700,
            color: '#fda4af',
            lineHeight: 1.2,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {data.coupleNames}
        </motion.h1>

        {/* Welcome message */}
        <motion.p
          className="text-white/70 text-base md:text-lg mb-2"
          style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {data.welcomeMessage}
        </motion.p>

        <motion.p
          className="text-white/40 text-sm mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {data.welcomeSubtext}
        </motion.p>

        {/* Start button */}
        <motion.button
          onClick={startJourney}
          className="relative px-10 py-4 rounded-full text-white font-medium text-base overflow-hidden group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.3), 0 0 60px rgba(244, 63, 94, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(244, 63, 94, 0.5)' }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10 tracking-wider">
            ✨ Sayohatni boshlash
          </span>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fbbf24)' }}
          />
        </motion.button>

        {/* Decorative bottom line */}
        <motion.div
          className="w-16 h-px mx-auto mt-10"
          style={{ background: 'linear-gradient(90deg, transparent, #fda4af, transparent)' }}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />

        {/* Bottom hint */}
        <motion.p
          className="text-white/20 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          🎵 Musiqa bilan tajriba yanada yaxshi
        </motion.p>
      </div>
    </motion.div>
  )
}
