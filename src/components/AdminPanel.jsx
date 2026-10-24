import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseumStore } from '../store'

export default function AdminPanel({ isOpen, onClose, onSaveData, currentData }) {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('general') // 'general' | 'photos' | 'music' | 'story' | 'links'
  const [formData, setFormData] = useState({ ...currentData })
  const [copyStatus, setCopyStatus] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Default admin PIN is 7777 or admin
    if (pin === '7777' || pin === 'admin') {
      setIsAuthenticated(true)
    } else {
      alert("Noto'g'ri PIN kod! (Standart PIN: 7777)")
    }
  }

  const handlePhotoChange = (index, field, value) => {
    const updatedPhotos = [...(formData.photos || [])]
    updatedPhotos[index] = { ...updatedPhotos[index], [field]: value }
    setFormData({ ...formData, photos: updatedPhotos })
  }

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handlePhotoChange(index, 'image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSaveData(formData)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_museum_data', JSON.stringify(formData))
    }
    alert("Barcha o'zgarishlar muvaffaqiyatli saqlandi! 🎉")
  }

  const getShareLink = (role) => {
    if (typeof window === 'undefined') return ''
    const base = window.location.origin + window.location.pathname
    const roomId = formData.museumId || 'love-room'
    return `${base}?room=${roomId}&role=${role}`
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(`${label} nusxalandi! ✓`)
      setTimeout(() => setCopyStatus(''), 3000)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-rose-500/30 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-rose-300" style={{ fontFamily: 'Playfair Display, serif' }}>
              Muzey Boshqaruv Paneli (Admin)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <span className="text-5xl mb-4">🔐</span>
            <h3 className="text-lg font-semibold mb-2">Admin Kirish</h3>
            <p className="text-white/50 text-xs mb-6">Muzey sozlamalarini faqat admin o'zgartira oladi</p>
            <input
              type="password"
              placeholder="PIN kodni kiriting (Standart: 7777)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center text-sm tracking-widest focus:outline-none focus:border-rose-400 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 font-medium text-sm transition-colors cursor-pointer"
            >
              Kirish
            </button>
          </form>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto text-xs font-medium">
              {[
                { id: 'general', label: 'Asosiy & Juftlik' },
                { id: 'photos', label: 'Rasmlar (10 ta)' },
                { id: 'music', label: 'Musiqa' },
                { id: 'story', label: 'Hikoya & Xat' },
                { id: 'links', label: 'Mijoz Havolalari 🔗' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'text-rose-400 border-b-2 border-rose-400 bg-white/5'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-1">Muzey ID (Xona nomi):</label>
                    <input
                      type="text"
                      value={formData.museumId || ''}
                      onChange={(e) => setFormData({ ...formData, museumId: e.target.value })}
                      placeholder="masalan: jasur-madina"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Juftlik ismlari:</label>
                    <input
                      type="text"
                      value={formData.coupleNames || ''}
                      onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                      placeholder="masalan: Sardor ❤️ Nilufar"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Xush kelibsiz sarlavhasi:</label>
                    <input
                      type="text"
                      value={formData.welcomeTitle || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Xush kelibsiz xabari:</label>
                    <textarea
                      rows={2}
                      value={formData.welcomeMessage || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTOS */}
              {activeTab === 'photos' && (
                <div className="space-y-4">
                  <p className="text-white/50 text-[11px]">
                    10 ta ramkaning har biriga fotosurat va tavsif kiriting:
                  </p>
                  {(formData.photos || []).map((photo, idx) => (
                    <div key={photo.id || idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-300">Ramka #{photo.id || idx + 1}</span>
                        {photo.image && (
                          <span className="text-[10px] text-green-400">Rasm yuklangan ✓</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={photo.title || ''}
                          onChange={(e) => handlePhotoChange(idx, 'title', e.target.value)}
                          placeholder="Rasm nomi"
                          className="px-2 py-1.5 rounded bg-white/10 border border-white/10"
                        />
                        <input
                          type="text"
                          value={photo.date || ''}
                          onChange={(e) => handlePhotoChange(idx, 'date', e.target.value)}
                          placeholder="Sana (masalan: 2025-03-08)"
                          className="px-2 py-1.5 rounded bg-white/10 border border-white/10"
                        />
                      </div>
                      <input
                        type="text"
                        value={photo.description || ''}
                        onChange={(e) => handlePhotoChange(idx, 'description', e.target.value)}
                        placeholder="Qisqacha xotira tavsifi..."
                        className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/10"
                      />
                      <div>
                        <label className="text-[10px] text-white/50 block mb-1">Rasm fayli (Kompyuterdan tanlash):</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(idx, e)}
                          className="text-[10px] text-white/70"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: MUSIC */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <p className="font-semibold text-rose-300 mb-1">🎵 Standart Sevgi Qo'shig'i:</p>
                    <p className="text-white/70 text-sm">Izzat Shukurov — "Devonangman"</p>
                    <p className="text-white/40 text-[10px] mt-1">
                      Vals raqsi vaqtida avtomatik jaranglaydi.
                    </p>
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Musiqa manbasi (Audio fayl yo'li yoki URL):</label>
                    <input
                      type="text"
                      value={formData.music || '/audio/romantic.mp3'}
                      onChange={(e) => setFormData({ ...formData, music: e.target.value })}
                      placeholder="/audio/devonangman.mp3 yoki onlayn havola"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: STORY & LETTER */}
              {activeTab === 'story' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-1">Yakuniy sevgi xabari (Devordagi katta yozuv):</label>
                    <input
                      type="text"
                      value={formData.finalMessage || ''}
                      onChange={(e) => setFormData({ ...formData, finalMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">To'liq Romantik Sevgi Xati:</label>
                    <textarea
                      rows={4}
                      value={formData.loveLetter || ''}
                      onChange={(e) => setFormData({ ...formData, loveLetter: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: SHARE LINKS */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <p className="text-white/70">
                    Mijozlar birgalikda 2 ta telefondan kirishlari uchun ushbu havolalarni yuboring:
                  </p>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <p className="font-semibold text-blue-300">🤵 Yigit uchun havola:</p>
                    <input
                      readOnly
                      value={getShareLink('boy')}
                      className="w-full px-3 py-1.5 rounded bg-black/40 text-[11px] font-mono text-white/80"
                    />
                    <button
                      onClick={() => copyToClipboard(getShareLink('boy'), 'Yigit havolasi')}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
                    >
                      Nusxalash 📋
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-2">
                    <p className="font-semibold text-pink-300">👰 Qiz uchun havola:</p>
                    <input
                      readOnly
                      value={getShareLink('girl')}
                      className="w-full px-3 py-1.5 rounded bg-black/40 text-[11px] font-mono text-white/80"
                    />
                    <button
                      onClick={() => copyToClipboard(getShareLink('girl'), 'Qiz havolasi')}
                      className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium cursor-pointer"
                    >
                      Nusxalash 📋
                    </button>
                  </div>

                  {copyStatus && (
                    <p className="text-center text-green-400 font-semibold animate-bounce">
                      {copyStatus}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-[11px] text-white/40">PIN: 7777</span>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Yopish
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 font-semibold text-white shadow-lg cursor-pointer"
                >
                  Saqlash ✓
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
