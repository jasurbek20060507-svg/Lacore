import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function PhotoOverlay() {
  const { activePhoto, setActivePhoto, setIsVideoPlaying } = useMuseumStore()
  const videoRef = useRef(null)

  useEffect(() => {
    if (activePhoto && activePhoto.video) {
      setIsVideoPlaying(true)
    } else {
      setIsVideoPlaying(false)
    }

    return () => {
      setIsVideoPlaying(false)
    }
  }, [activePhoto, setIsVideoPlaying])

  if (!activePhoto) return null

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsVideoPlaying(false)
    setActivePhoto(null)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Baroque Ornate Framed Card */}
      <motion.div
        className="relative max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-gradient-to-b from-[#1c140d] via-[#120d09] to-[#0a0604] text-white"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white/90 text-sm transition-colors cursor-pointer shadow-lg"
        >
          ✕
        </button>

        {/* Media Frame Area (Bounded strictly inside baroque border) */}
        <div className="relative w-full aspect-[16/10] bg-black/60 flex items-center justify-center overflow-hidden border-b border-amber-500/20">
          {activePhoto.video ? (
            <video
              ref={videoRef}
              src={activePhoto.video}
              controls
              autoPlay
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="w-full h-full object-contain max-h-[60vh] bg-black"
            />
          ) : activePhoto.image ? (
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="w-full h-full object-contain bg-black"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="text-center p-8">
              <span className="text-6xl mb-3 block opacity-70">🖼️</span>
              <p className="text-amber-200/80 text-sm font-serif">Xotira #{activePhoto.id}</p>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md border border-amber-500/30 rounded-lg px-3 py-1">
            <p className="text-xs text-amber-200 font-mono">{activePhoto.date}</p>
          </div>
        </div>

        {/* Info & Romantic Description */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400">✦</span>
            <h3
              className="text-xl md:text-2xl font-bold text-amber-200"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {activePhoto.title}
            </h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mt-2">
            {activePhoto.description}
          </p>

          <div
            className="h-px mt-6 mx-auto w-24"
            style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
