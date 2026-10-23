import React from 'react'
import { motion } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function PhotoOverlay() {
  const { activePhoto, setActivePhoto } = useMuseumStore()

  if (!activePhoto) return null

  const placeholderColors = ['#e8b4b8', '#b4c7e8', '#b8e8b4', '#e8d4b4', '#d4b4e8', '#b4e8e0', '#e8b4d8', '#c7e8b4', '#e8c7b4', '#b4d4e8']
  const bgColor = placeholderColors[(activePhoto.id - 1) % placeholderColors.length]

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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setActivePhoto(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Card */}
      <motion.div
        className="relative max-w-lg w-full glass rounded-2xl overflow-hidden"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Close button */}
        <button
          onClick={() => setActivePhoto(null)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/80 text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Image area */}
        <div
          className="w-full aspect-[16/10] flex items-center justify-center relative"
          style={{ backgroundColor: bgColor }}
        >
          {activePhoto.image ? (
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="text-center">
              <p className="text-6xl mb-2 opacity-60">📷</p>
              <p className="text-white/50 text-sm">Rasm #{activePhoto.id}</p>
            </div>
          )}

          {/* Date badge */}
          <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-1">
            <p className="text-xs text-white/80 font-mono">{activePhoto.date}</p>
          </div>
        </div>

        {/* Info section */}
        <div className="p-5">
          <h3
            className="text-xl font-bold text-rose-300 mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {activePhoto.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {activePhoto.description}
          </p>

          {/* Decorative line */}
          <div
            className="h-px mt-4 mx-auto w-16"
            style={{ background: 'linear-gradient(90deg, transparent, #fda4af, transparent)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
