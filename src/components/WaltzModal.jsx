import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function WaltzModal({
  canInvite = false,
  nearTable = false,
  waltzStatus = 'idle', // 'idle' | 'invited' | 'received' | 'dancing'
  partnerRole = 'girl',
  onInvite = () => {},
  onAccept = () => {},
  onStop = () => {},
}) {
  const { isSitting, setIsSitting } = useMuseumStore()
  const partnerTitle = partnerRole === 'girl' ? 'Kelin' : 'Kuyov'

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center gap-2">
      <AnimatePresence>
        {/* Table Sitting Prompt */}
        {nearTable && waltzStatus !== 'dancing' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-2xl p-3 shadow-2xl border border-amber-500/30 text-center max-w-xs backdrop-blur-md"
          >
            <p className="text-amber-200 text-xs font-serif mb-2">
              {isSitting ? "Romantik stolda o'tiribsiz 🍷" : "Romantik shamchiroqli stol 🕯️"}
            </p>
            <button
              onClick={() => setIsSitting(!isSitting)}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-lg cursor-pointer flex items-center gap-2 mx-auto"
            >
              <span>{isSitting ? '🚶' : '🪑'}</span>
              <span>{isSitting ? "O'rindan turish" : "Stolga o'tirish"}</span>
            </button>
          </motion.div>
        )}

        {/* Prompt to invite to waltz */}
        {canInvite && waltzStatus === 'idle' && !isSitting && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-2xl p-4 shadow-2xl border border-rose-500/30 text-center max-w-sm backdrop-blur-md"
          >
            <p className="text-rose-200 text-sm font-medium mb-3">
              Bir-biringizga juda yaqinsiz... 🌹
            </p>
            <motion.button
              onClick={onInvite}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-medium text-sm shadow-lg shadow-rose-500/40 cursor-pointer flex items-center gap-2 mx-auto"
            >
              <span>💃🕺</span>
              <span>Valsga taklif qilish</span>
            </motion.button>
          </motion.div>
        )}

        {/* Sent invitation waiting */}
        {waltzStatus === 'invited' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass rounded-2xl p-4 text-center max-w-sm"
          >
            <p className="text-rose-300 text-sm animate-pulse">
              Taklif yuborildi, javob kutilmoqda... 💌
            </p>
          </motion.div>
        )}

        {/* Received invitation from partner */}
        {waltzStatus === 'received' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-2xl p-5 shadow-2xl border-2 border-rose-400/50 text-center max-w-sm bg-gradient-to-b from-rose-950/80 to-black/80"
          >
            <span className="text-3xl mb-2 block">💌</span>
            <p className="text-rose-200 text-base font-semibold mb-1">
              Sizni valsga taklif qilishdi! 🌹
            </p>
            <p className="text-white/70 text-xs mb-4">
              "Devonangman" qo'shig'i ostida birga raqs tushishni istaysizmi?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={onAccept}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg transition-colors cursor-pointer"
              >
                Roziman ❤️
              </button>
              <button
                onClick={onStop}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-colors cursor-pointer"
              >
                Keyinroq
              </button>
            </div>
          </motion.div>
        )}

        {/* Currently Dancing Mode */}
        {waltzStatus === 'dancing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass rounded-2xl px-6 py-3 shadow-2xl border border-rose-500/40 flex items-center gap-4 bg-black/60 backdrop-blur-md"
          >
            <div>
              <p className="text-rose-300 text-xs font-semibold">
                ✨ Romantik Vals raqsi
              </p>
              <p className="text-white/50 text-[10px]">
                🎵 Izzat Shukurov — Devonangman
              </p>
            </div>
            <button
              onClick={onStop}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xs transition-colors cursor-pointer"
            >
              Raqsni to'xtatish
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
