// Multi-client Museum Database System
import initialMuseum from './museum.json'

const DB_KEY = 'love_museum_database_v2'

// Default sample client museums
const DEFAULT_DATABASE = {
  'ali-malika': {
    ...initialMuseum,
    museumId: 'ali-malika',
    coupleNames: 'Ali ❤️ Malika',
    museumMusicUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', // Perfect - Ed Sheeran
    waltzMusicUrl: 'https://www.youtube.com/watch?v=LVkEu1J8boo', // Izzat Shukurov - Devonangman
  },
  'jasur-madina': {
    ...initialMuseum,
    museumId: 'jasur-madina',
    coupleNames: 'Jasur ❤️ Madina',
    welcomeMessage: 'Bizning sevgi qasrimizga xush kelibsiz',
    museumMusicUrl: 'https://www.youtube.com/watch?v=rtOvBOTyX00', // A Thousand Years
    waltzMusicUrl: 'https://www.youtube.com/watch?v=LVkEu1J8boo', // Izzat Shukurov - Devonangman
    finalMessage: 'Seni butun umr sevaman Madinam ❤️',
  },
}

export function getDatabase() {
  if (typeof window === 'undefined') return DEFAULT_DATABASE
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATABASE))
      return DEFAULT_DATABASE
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Database load error:', e)
    return DEFAULT_DATABASE
  }
}

export function saveDatabase(db) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch (e) {
    console.error('Database save error:', e)
  }
}

export function getMuseumById(id) {
  const db = getDatabase()
  if (id && db[id]) {
    return db[id]
  }
  // If not found by id, return first museum or fallback
  const firstKey = Object.keys(db)[0]
  return db[firstKey] || DEFAULT_DATABASE['ali-malika']
}

export function saveMuseum(museumData) {
  const db = getDatabase()
  const id = museumData.museumId || `order-${Date.now()}`
  db[id] = { ...museumData, museumId: id, updatedAt: new Date().toISOString() }
  saveDatabase(db)
  return id
}

export function deleteMuseum(id) {
  const db = getDatabase()
  if (db[id]) {
    delete db[id]
  }
  saveDatabase(db)
}
