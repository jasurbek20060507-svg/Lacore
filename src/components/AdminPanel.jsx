import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDatabase, saveMuseum, deleteMuseum } from '../data/database'

export default function AdminPanel({ isOpen, onClose, currentData, onSaveData }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'general' | 'media' | 'music' | 'story' | 'links'
  const [database, setDatabase] = useState({})
  const [selectedMuseumId, setSelectedMuseumId] = useState(currentData?.museumId || 'ali-malika')
  const [formData, setFormData] = useState({ ...currentData })
  const [copyStatus, setCopyStatus] = useState('')

  // Load database on mount
  useEffect(() => {
    if (isOpen) {
      const db = getDatabase()
      setDatabase(db)
      if (currentData) {
        setFormData({ ...currentData })
        setSelectedMuseumId(currentData.museumId || 'ali-malika')
      }
    }
  }, [isOpen, currentData])

  const handleLogin = (e) => {
    e.preventDefault()
    // Exact password required by user
    if (password === 'Jasurbek2006') {
      setIsAuthenticated(true)
    } else {
      alert("Noto'g'ri parol!")
    }
  }

  // Switch to another client order in database
  const handleSelectOrder = (id) => {
    if (database[id]) {
      setSelectedMuseumId(id)
      setFormData({ ...database[id] })
    }
  }

  // Create new order
  const handleCreateNewOrder = () => {
    const newId = prompt("Yangi buyurtma uchun nom/slug kiriting (masalan: sardor-nilufar):")
    if (newId) {
      const cleanId = newId.trim().toLowerCase().replace(/\s+/g, '-')
      const newMuseum = {
        ...formData,
        museumId: cleanId,
        coupleNames: 'Yangi Juftlik',
        welcomeMessage: 'Bizning sevgi hikoyamizga xush kelibsiz',
        photos: formData.photos.map(p => ({ ...p, image: '', video: '' })),
      }
      saveMuseum(newMuseum)
      const updatedDb = getDatabase()
      setDatabase(updatedDb)
      setSelectedMuseumId(cleanId)
      setFormData(newMuseum)
      onSaveData(newMuseum)
      alert(`"${cleanId}" yangi buyurtma yaratildi! Endi ma'lumotlarini to'ldirishingiz mumkin.`)
    }
  }

  // Delete an order
  const handleDeleteOrder = (id) => {
    if (confirm(`Rostdan ham "${id}" buyurtmasini o'chirmoqchimisiz?`)) {
      deleteMuseum(id)
      const updatedDb = getDatabase()
      setDatabase(updatedDb)
      const firstId = Object.keys(updatedDb)[0]
      if (firstId) {
        handleSelectOrder(firstId)
      }
    }
  }

  const handleMediaChange = (index, field, value) => {
    const updatedPhotos = [...(formData.photos || [])]
    updatedPhotos[index] = { ...updatedPhotos[index], [field]: value }
    setFormData({ ...formData, photos: updatedPhotos })
  }

  const handleFileUpload = (index, e, type = 'image') => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'video') {
          handleMediaChange(index, 'video', reader.result)
          handleMediaChange(index, 'image', '')
        } else {
          handleMediaChange(index, 'image', reader.result)
          handleMediaChange(index, 'video', '')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    saveMuseum(formData)
    onSaveData(formData)
    const updatedDb = getDatabase()
    setDatabase(updatedDb)
    alert("Buyurtma muvaffaqiyatli saqlandi! 🎉")
  }

  const getShareLink = (role) => {
    if (typeof window === 'undefined') return ''
    const base = window.location.origin + window.location.pathname
    const id = formData.museumId || 'ali-malika'
    return `${base}?id=${id}&room=${id}&role=${role}`
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(`${label} nusxalandi! ✓`)
      setTimeout(() => setCopyStatus(''), 3000)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-amber-500/40 text-white shadow-2xl bg-[#0f0b08]"
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: 'Playfair Display, serif' }}>
              Muzey Boshqaruv & Buyurtmalar Tizimi (Admin)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Password Authentication Screen */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-10 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-4">
              🔐
            </div>
            <h3 className="text-xl font-semibold mb-1 text-amber-200">Xavfsiz Admin Kirish</h3>
            <p className="text-white/50 text-xs mb-6">Muzeylarni boshqarish uchun maxfiy parolni kiriting</p>
            <input
              type="password"
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-center text-sm tracking-widest focus:outline-none focus:border-amber-400 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-amber-600/30"
            >
              Kirish
            </button>
          </form>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/30 overflow-x-auto text-xs font-medium">
              {[
                { id: 'orders', label: '📂 Buyurtmalar Bazasi' },
                { id: 'general', label: 'Juftlik Ma\'lumotlari' },
                { id: 'media', label: 'Rasmlar & Videolar (10 ta)' },
                { id: 'music', label: 'Musiqalar (Muzey + Vals)' },
                { id: 'story', label: 'Hikoya & Sevgi Xati' },
                { id: 'links', label: '🔗 Mijozga Havola Berish' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: ORDERS DATABASE */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white/70">
                      Barcha saqlangan mijozlar buyurtmalari:
                    </p>
                    <button
                      onClick={handleCreateNewOrder}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer shadow-lg"
                    >
                      + Yangi Buyurtma Qo'shish
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Object.keys(database).map((id) => {
                      const item = database[id]
                      const isSelected = selectedMuseumId === id
                      return (
                        <div
                          key={id}
                          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-400 shadow-lg'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm text-amber-200">
                              {item.coupleNames || id}
                            </p>
                            <p className="text-[11px] text-white/50 font-mono mt-0.5">
                              ID: {id} • {item.welcomeMessage?.slice(0, 45)}...
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSelectOrder(id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                                isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {isSelected ? 'Tanlangan ✓' : 'Tahrirlash'}
                            </button>
                            {Object.keys(database).length > 1 && (
                              <button
                                onClick={() => handleDeleteOrder(id)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs cursor-pointer"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: GENERAL INFO */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 mb-1">Buyurtma ID (Slug):</label>
                      <input
                        type="text"
                        value={formData.museumId || ''}
                        onChange={(e) => setFormData({ ...formData, museumId: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Juftlik Ismlari:</label>
                      <input
                        type="text"
                        value={formData.coupleNames || ''}
                        onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                        placeholder="masalan: Jasur ❤️ Madina"
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Xush kelibsiz sarlavhasi:</label>
                    <input
                      type="text"
                      value={formData.welcomeTitle || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Kirish xabari:</label>
                    <textarea
                      rows={2}
                      value={formData.welcomeMessage || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA (PHOTOS & VIDEOS) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <p className="text-white/60 text-[11px]">
                    10 ta barokko uslubidagi oltin ramkaga rasm YOKI video yuklang. Ular ramkadan aslo chiqib ketmaydi:
                  </p>
                  {(formData.photos || []).map((photo, idx) => (
                    <div key={photo.id || idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-300">Ramka #{photo.id || idx + 1}</span>
                        <div>
                          {photo.video ? (
                            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded">
                              ▶ Video yuklangan ✓
                            </span>
                          ) : photo.image ? (
                            <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded">
                              🖼️ Rasm yuklangan ✓
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/40">Media yuklanmagan</span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={photo.title || ''}
                          onChange={(e) => handleMediaChange(idx, 'title', e.target.value)}
                          placeholder="Sarlavha"
                          className="px-2 py-1.5 rounded bg-white/10 border border-white/10"
                        />
                        <input
                          type="text"
                          value={photo.date || ''}
                          onChange={(e) => handleMediaChange(idx, 'date', e.target.value)}
                          placeholder="Sana (masalan: 2025-05-18)"
                          className="px-2 py-1.5 rounded bg-white/10 border border-white/10"
                        />
                      </div>
                      <input
                        type="text"
                        value={photo.description || ''}
                        onChange={(e) => handleMediaChange(idx, 'description', e.target.value)}
                        placeholder="Romantik xotira tavsifi..."
                        className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/10"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                        <div>
                          <label className="text-[10px] text-white/60 block mb-1">📷 Rasm yuklash:</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(idx, e, 'image')}
                            className="text-[10px] text-white/70"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/60 block mb-1">🎥 Video yuklash (MP4/WebM):</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(idx, e, 'video')}
                            className="text-[10px] text-white/70"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SEPARATE MUSICS */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  {/* Museum background music */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <p className="font-semibold text-amber-300">🏛️ Muzeyni ko'rib yurish musiqasi (YouTube):</p>
                    <p className="text-white/60 text-xs">
                      Mijozlar galereya bo'ylab yurgan paytda mayin fonda jaranglaydi:
                    </p>
                    <input
                      type="text"
                      value={formData.museumMusicUrl || 'https://www.youtube.com/watch?v=2Vv-BfVoq4g'}
                      onChange={(e) => setFormData({ ...formData, museumMusicUrl: e.target.value })}
                      placeholder="YouTube havola"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 font-mono text-xs"
                    />
                  </div>

                  {/* Waltz dance music */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <p className="font-semibold text-rose-300">💃🕺 Romantik Vals Musiqasi (YouTube):</p>
                    <p className="text-white/60 text-xs">
                      Personajlar bir-biri bilan vals tushishni boshlaganda avtomatik jaranglaydi:
                    </p>
                    <input
                      type="text"
                      value={formData.waltzMusicUrl || 'https://www.youtube.com/watch?v=LVkEu1J8boo'}
                      onChange={(e) => setFormData({ ...formData, waltzMusicUrl: e.target.value })}
                      placeholder="YouTube havola (Standart: Izzat Shukurov - Devonangman)"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20 font-mono text-xs"
                    />
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, waltzMusicUrl: 'https://www.youtube.com/watch?v=LVkEu1J8boo' })}
                        className="px-3 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs border border-rose-500/30 cursor-pointer"
                      >
                        🎵 Izzat Shukurov — Devonangman
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: STORY & LETTER */}
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
                      rows={5}
                      value={formData.loveLetter || ''}
                      onChange={(e) => setFormData({ ...formData, loveLetter: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: CLIENT SHARE LINKS */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <p className="text-white/70">
                    Buyurtmachi juftlik 2 ta alohida telefondan kirishi uchun ushbu havolalarni jo'nating:
                  </p>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <p className="font-semibold text-blue-300">🤵 Kuyov / Yigit uchun havola:</p>
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
                    <p className="font-semibold text-pink-300">👰 Kelin / Qiz uchun havola:</p>
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

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between">
              <span className="text-[11px] text-white/40">Tanlangan: {formData.museumId}</span>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Yopish
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-semibold text-white shadow-lg cursor-pointer"
                >
                  O'zgarishlarni Saqlash ✓
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
