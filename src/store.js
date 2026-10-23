import { create } from 'zustand'

export const useMuseumStore = create((set) => ({
  // Game state
  gameState: 'loading', // 'loading' | 'welcome' | 'playing' | 'finale'
  setGameState: (state) => set({ gameState: state }),

  // Music
  musicEnabled: false,
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),

  // Photo overlay
  activePhoto: null,
  setActivePhoto: (photo) => set({ activePhoto: photo }),

  // Help
  showHelp: false,
  toggleHelp: () => set((s) => ({ showHelp: !s.showHelp })),

  // Loading
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  // Mobile detection
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  ),

  // Player position for room transitions
  currentRoom: 'welcome', // 'welcome' | 'gallery' | 'story' | 'finale'
  setCurrentRoom: (room) => set({ currentRoom: room }),
}))
