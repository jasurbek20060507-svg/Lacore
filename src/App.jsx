import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMuseumStore } from './store'
import museumData from './data/museum.json'
import LoadingScreen from './components/LoadingScreen'
import WelcomeScreen from './components/WelcomeScreen'
import MuseumScene from './components/MuseumScene'
import GameUI from './components/GameUI'
import PhotoOverlay from './components/PhotoOverlay'
import FinaleScreen from './components/FinaleScreen'
import MobileControls from './components/MobileControls'

export default function App() {
  const { gameState, setGameState, isMobile, activePhoto, setLoadingProgress } = useMuseumStore()

  useEffect(() => {
    // Simulate loading
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => setGameState('welcome'), 500)
      }
      setLoadingProgress(Math.min(progress, 100))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full relative no-select">
      {/* 3D Canvas - always mounted for preloading */}
      {(gameState === 'playing' || gameState === 'finale') && (
        <Canvas
          shadows
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ fov: 65, near: 0.1, far: 100, position: [0, 1.6, 8] }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <MuseumScene data={museumData} />
          </Suspense>
        </Canvas>
      )}

      {/* UI Layers */}
      {gameState === 'loading' && <LoadingScreen />}
      {gameState === 'welcome' && <WelcomeScreen data={museumData} />}
      {gameState === 'playing' && (
        <>
          <GameUI data={museumData} />
          {isMobile && <MobileControls />}
        </>
      )}
      {gameState === 'finale' && <FinaleScreen data={museumData} />}

      {/* Photo overlay */}
      {activePhoto && <PhotoOverlay />}
    </div>
  )
}
