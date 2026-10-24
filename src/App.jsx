import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMuseumStore } from './store'
import initialMuseumData from './data/museum.json'
import LoadingScreen from './components/LoadingScreen'
import WelcomeScreen from './components/WelcomeScreen'
import MuseumScene from './components/MuseumScene'
import GameUI from './components/GameUI'
import PhotoOverlay from './components/PhotoOverlay'
import FinaleScreen from './components/FinaleScreen'
import MobileControls from './components/MobileControls'
import WaltzModal from './components/WaltzModal'
import AdminPanel from './components/AdminPanel'
import { useMultiplayer } from './multiplayer/useMultiplayer'

export default function App() {
  const { gameState, setGameState, isMobile, activePhoto, setLoadingProgress, adminOpen, toggleAdmin } = useMuseumStore()

  // Dynamic Museum data (from localStorage if edited by admin, or initial JSON)
  const [currentMuseumData, setCurrentMuseumData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom_museum_data')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {}
      }
    }
    return initialMuseumData
  })

  // Multiplayer Hook
  const {
    roomId,
    myRole,
    partnerRole,
    partnerConnected,
    partnerData,
    sendMyTransform,
    waltzStatus,
    inviteWaltz,
    acceptWaltz,
    stopWaltz,
  } = useMultiplayer()

  // Make sendMyTransform accessible to PlayerController
  useEffect(() => {
    window.__sendMyTransform = sendMyTransform
    return () => {
      window.__sendMyTransform = null
    }
  }, [sendMyTransform])

  // Distance proximity for waltz prompt
  const [canInviteWaltz, setCanInviteWaltz] = useState(false)

  // Loading simulation
  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => setGameState('welcome'), 400)
      }
      setLoadingProgress(Math.min(progress, 100))
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full relative no-select">
      {/* 3D Canvas */}
      {(gameState === 'playing' || gameState === 'finale') && (
        <Canvas
          shadows
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ fov: 65, near: 0.1, far: 100, position: [0, 1.6, 3] }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <MuseumScene
              data={currentMuseumData}
              myRole={myRole}
              partnerData={partnerData}
              partnerConnected={partnerConnected}
              isDancing={waltzStatus === 'dancing'}
              onProximityChange={setCanInviteWaltz}
            />
          </Suspense>
        </Canvas>
      )}

      {/* UI Layers */}
      {gameState === 'loading' && <LoadingScreen />}
      {gameState === 'welcome' && <WelcomeScreen data={currentMuseumData} />}
      {gameState === 'playing' && (
        <>
          <GameUI
            data={currentMuseumData}
            partnerConnected={partnerConnected}
            myRole={myRole}
          />
          {isMobile && <MobileControls />}

          {/* Interactive Waltz Invitation & Dance UI */}
          <WaltzModal
            canInvite={canInviteWaltz}
            waltzStatus={waltzStatus}
            partnerRole={partnerRole}
            onInvite={inviteWaltz}
            onAccept={acceptWaltz}
            onStop={stopWaltz}
          />
        </>
      )}
      {gameState === 'finale' && <FinaleScreen data={currentMuseumData} />}

      {/* Photo overlay */}
      {activePhoto && <PhotoOverlay />}

      {/* Admin Panel (Password Protected: 7777) */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={toggleAdmin}
        currentData={currentMuseumData}
        onSaveData={(updated) => setCurrentMuseumData(updated)}
      />
    </div>
  )
}
