import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseumStore } from '../store'

function MusicButton() {
  const { musicEnabled, toggleMusic } = useMuseumStore()
  const audioRef = useRef(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    // Use a silent source since no actual music file provided
    audioRef.current.src = '/audio/romantic.mp3'

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (musicEnabled) {
      audioRef.current.play().catch(() => {
        // Audio play failed - user hasn't interacted yet or no file
      })
    } else {
      audioRef.current.pause()
    }
  }, [musicEnabled])

  return (
    <motion.button
      onClick={toggleMusic}
      className="glass rounded-full w-11 h-11 flex items-center justify-center text-lg hover:bg-white/10 transition-colors cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={musicEnabled ? "Musiqani o'chirish" : "Musiqani yoqish"}
    >
      {musicEnabled ? '🎵' : '🔇'}
    </motion.button>
  )
}

function HelpButton() {
  const { showHelp, toggleHelp } = useMuseumStore()
  const isMobile = useMuseumStore((s) => s.isMobile)

  return (
    <>
      <motion.button
        onClick={toggleHelp}
        className="glass rounded-full w-11 h-11 flex items-center justify-center text-lg hover:bg-white/10 transition-colors cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Yordam"
      >
        ❓
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={toggleHelp} />
            <motion.div
              className="glass relative rounded-2xl p-6 max-w-sm w-full text-white"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3
                className="text-xl font-bold mb-4 text-rose-300"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Boshqaruv
              </h3>

              {!isMobile ? (
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">W A S D</span>
                    <span>Harakatlanish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">↑ ← ↓ →</span>
                    <span>Harakatlanish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">Sichqoncha</span>
                    <span>Kamerani boshqarish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">Bosish</span>
                    <span>Rasmlarni ko'rish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">ESC</span>
                    <span>Yopish</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <span>🕹️</span>
                    <span>Joystick — harakatlanish (chap pastda)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>👆</span>
                    <span>O'ng tomonda suring — kamerani aylantirish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>👇</span>
                    <span>Rasmga bosing — ma'lumotni ko'rish</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-white/30 mt-4">
                Muzey bo'ylab yuring va xotiralarni kashf eting
              </p>

              <button
                onClick={toggleHelp}
                className="mt-4 w-full py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm transition-colors cursor-pointer"
              >
                Tushunarli ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function GameUI({ data, partnerConnected = false, myRole = 'boy' }) {
  const isMobile = useMuseumStore((s) => s.isMobile)
  const toggleAdmin = useMuseumStore((s) => s.toggleAdmin)

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 p-3 flex items-center justify-between pointer-events-none">
        {/* Museum name & Role badge */}
        <motion.div
          className="flex items-center gap-2 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass rounded-xl px-4 py-2">
            <p
              className="text-rose-300 text-sm font-semibold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {data.coupleNames}
            </p>
          </div>
          {/* Partner online indicator */}
          <div className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${partnerConnected ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-white/70">
              {partnerConnected ? 'Juftingiz onlayn ❤️' : 'Juft kutilmoqda'}
            </span>
          </div>
        </motion.div>

        {/* Control buttons */}
        <motion.div
          className="flex gap-2 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Admin panel button */}
          <motion.button
            onClick={toggleAdmin}
            className="glass rounded-full w-11 h-11 flex items-center justify-center text-lg hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Admin Panel (Sozlamalar)"
          >
            ⚙️
          </motion.button>
          <MusicButton />
          <HelpButton />
        </motion.div>
      </div>

      {/* Crosshair (desktop only) */}
      {!isMobile && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-1 h-1 rounded-full bg-white/30" />
        </div>
      )}

      {/* Bottom hint */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <p className="text-white/20 text-xs text-center">
          {isMobile
            ? "Joystick bilan yuring · Rasmlarni bosing"
            : "Ekranga bosing · WASD bilan yuring · Rasmlarni bosing"
          }
        </p>
      </motion.div>
    </>
  )
}
