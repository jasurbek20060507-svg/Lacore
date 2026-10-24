import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseumStore } from '../store'

function MusicButton() {
  const { musicEnabled, toggleMusic } = useMuseumStore()

  return (
    <motion.button
      onClick={toggleMusic}
      className={`glass rounded-full w-11 h-11 flex items-center justify-center text-lg transition-all cursor-pointer ${
        musicEnabled ? 'bg-amber-500/30 border-amber-400/50 shadow-lg shadow-amber-500/30' : 'hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={musicEnabled ? "Musiqani to'xtatish" : "Musiqani yoqish (YouTube)"}
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
            <div className="absolute inset-0 bg-black/70" onClick={toggleHelp} />
            <motion.div
              className="glass relative rounded-3xl p-6 max-w-sm w-full text-white border border-amber-500/30 bg-[#140e0a]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3
                className="text-xl font-bold mb-4 text-amber-300"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Muzey Boshqaruvi
              </h3>

              {!isMobile ? (
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">W A S D</span>
                    <span>Personajni boshqarish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">Sichqoncha</span>
                    <span>Kamerani burish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">Bosish</span>
                    <span>Rasm yoki videoni ko'rish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="glass-light rounded px-2 py-1 text-xs font-mono">V</span>
                    <span>1-shaxs / 3-shaxs kamerani almashtirish</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <span>🕹️</span>
                    <span>Joystick — chap tomondan personajni yurgizish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>👆</span>
                    <span>O'ng tomon — kamerani 360° burish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>👁️</span>
                    <span>Rasm/Video oldiga borib bosish</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>💃🕺</span>
                    <span>Juftingizga yaqinlashib valsga taklif qilish</span>
                  </div>
                </div>
              )}

              <button
                onClick={toggleHelp}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold text-white text-sm transition-colors cursor-pointer"
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

export default function GameUI({
  data,
  partnerConnected = false,
  myRole = 'boy',
  nearTable = false,
}) {
  const { isMobile, toggleAdmin, cameraMode, toggleCameraMode, isSitting, setIsSitting } = useMuseumStore()
  const [secretTapCount, setSecretTapCount] = useState(0)

  // Secret shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        toggleAdmin()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleAdmin])

  // Secret 5-tap gesture on couple title
  const handleSecretTap = () => {
    const newCount = secretTapCount + 1
    setSecretTapCount(newCount)
    if (newCount >= 5) {
      setSecretTapCount(0)
      toggleAdmin()
    }
    setTimeout(() => setSecretTapCount(0), 3000)
  }

  const roleLabel = myRole === 'boy' ? '🤵 Kuyov' : '👰 Kelin'

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 p-3 flex items-center justify-between pointer-events-none">
        {/* Museum name & Secret Admin tap */}
        <motion.div
          className="flex items-center gap-2 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Tapping this 5 times opens hidden admin */}
          <div
            onClick={handleSecretTap}
            className="glass rounded-2xl px-4 py-2 cursor-pointer border border-amber-500/20 active:scale-95 transition-transform"
            title="Maxsus sevgi qasri"
          >
            <p
              className="text-amber-200 text-sm font-semibold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {data.coupleNames}
            </p>
          </div>

          {/* Role Badge */}
          <div className="glass rounded-xl px-3 py-1.5 text-xs text-amber-300 font-medium border border-amber-500/20">
            {roleLabel}
          </div>

          {/* Partner online indicator */}
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-[11px] border border-white/10">
            <span className={`w-2 h-2 rounded-full ${partnerConnected ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-white/70">
              {partnerConnected ? 'Juftingiz onlayn ❤️' : 'Juft kutilmoqda'}
            </span>
          </div>
        </motion.div>

        {/* Control buttons (NO visible admin button for guests) */}
        <motion.div
          className="flex gap-2 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Camera View Switcher */}
          <motion.button
            onClick={toggleCameraMode}
            className="glass rounded-full w-11 h-11 flex items-center justify-center text-lg hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={cameraMode === 'first' ? "3-shaxs kameraga o'tish" : "1-shaxs kameraga o'tish"}
          >
            {cameraMode === 'first' ? '👁️' : '🎥'}
          </motion.button>
          <MusicButton />
          <HelpButton />
        </motion.div>
      </div>

      {/* Crosshair (desktop only) */}
      {!isMobile && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      )}

      {/* Mobile Interactive Action Icons (Right Side) */}
      {isMobile && (
        <div className="fixed right-4 bottom-28 z-30 flex flex-col gap-3 pointer-events-auto">
          {/* Table sit button */}
          {nearTable && (
            <motion.button
              onClick={() => setIsSitting(!isSitting)}
              whileTap={{ scale: 0.9 }}
              className="w-13 h-13 rounded-full bg-amber-600/90 text-white shadow-xl flex items-center justify-center text-xl border border-amber-400"
            >
              {isSitting ? '🚶' : '🪑'}
            </motion.button>
          )}

          {/* Camera switch button on mobile */}
          <motion.button
            onClick={toggleCameraMode}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass text-white shadow-xl flex items-center justify-center text-lg border border-white/20"
          >
            {cameraMode === 'first' ? '👁️' : '🎥'}
          </motion.button>
        </div>
      )}

      {/* Bottom hint */}
      <motion.div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <p className="text-white/30 text-[11px] text-center">
          {isMobile
            ? "Joystick bilan yuring · Ramka va stollarga yaqinlashing"
            : "Ekranga bosing · WASD bilan personajni boshqaring · Ramkalarni bosing"
          }
        </p>
      </motion.div>
    </>
  )
}
