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
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto py-8"
      style={{ background: 'linear-gradient(135deg, #14080e 0%, #240a17 35%, #0d0918 70%, #14080e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      <div className="relative z-10 text-center px-6 max-w-lg my-auto">
        {/* Decorative top line */}
        <motion.div
          className="w-16 h-px mx-auto mb-6"
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
          {data.welcomeTitle || 'Sevgi Muzeyi · Virtual 3D Qasr'}
        </motion.p>

        {/* 3D Avatars Showcase */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-5"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          {/* Boy Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-200 shadow-xl shadow-rose-500/20 overflow-hidden border border-amber-300/40">
              <img
                src="/characters/boy-avatar.png"
                alt="Kuyov 3D Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <span className="text-[11px] text-amber-200 mt-1.5 font-medium tracking-wide">🤵 Kuyov</span>
          </div>

          <div className="text-rose-400 text-2xl animate-pulse">❤️</div>

          {/* Girl Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-rose-500 via-amber-300 to-pink-500 shadow-xl shadow-pink-500/20 overflow-hidden border border-rose-300/40">
              <img
                src="/characters/girl-avatar.png"
                alt="Kelin 3D Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <span className="text-[11px] text-pink-200 mt-1.5 font-medium tracking-wide">👰 Kelin</span>
          </div>
        </motion.div>

        {/* Couple names */}
        <motion.h1
          className="text-glow mb-4"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 7vw, 3.2rem)',
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
          className="text-white/80 text-base md:text-lg mb-2"
          style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {data.welcomeMessage}
        </motion.p>

        <motion.p
          className="text-white/40 text-xs sm:text-sm mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {data.welcomeSubtext}
        </motion.p>

        {/* Start button */}
        <motion.button
          onClick={startJourney}
          className="relative px-9 py-3.5 rounded-full text-white font-medium text-base overflow-hidden group cursor-pointer shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.4), 0 0 60px rgba(244, 63, 94, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(244, 63, 94, 0.6)' }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10 tracking-wider font-semibold">
            ✨ Muzeyga kirish
          </span>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fbbf24)' }}
          />
        </motion.button>

        {/* Decorative bottom line */}
        <motion.div
          className="w-16 h-px mx-auto mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, #fda4af, transparent)' }}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 1.5, delay: 1.4 }}
        />

        {/* Bottom hint */}
        <motion.p
          className="text-white/30 text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          🎵 YouTube musiqasi va 3D Vals taklifi bilan
        </motion.p>
      </div>
    </motion.div>
  )
}
