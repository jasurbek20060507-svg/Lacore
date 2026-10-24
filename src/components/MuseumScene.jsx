import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import WelcomeHall from './rooms/WelcomeHall'
import MemoryGallery from './rooms/MemoryGallery'
import LoveStoryRoom from './rooms/LoveStoryRoom'
import FinaleRoom from './rooms/FinaleRoom'
import PlayerController from './PlayerController'
import Particles from './Particles'
import CoupleSyncManager from './characters/CoupleSyncManager'

export default function MuseumScene({
  data,
  myRole = 'boy',
  partnerData = null,
  partnerConnected = false,
  isDancing = false,
  onProximityChange = () => {},
}) {
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={1.2} color="#fff1f2" />
      <hemisphereLight args={['#fff5ea', '#4a1525', 0.8]} />
      <directionalLight
        position={[5, 12, 5]}
        intensity={1.5}
        color="#fff5f5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#1a0a15', 25, 75]} />

      {/* 3D Couple Characters & Multiplayer Avatar */}
      <CoupleSyncManager
        myRole={myRole}
        partnerData={partnerData}
        partnerConnected={partnerConnected}
        isDancing={isDancing}
        onProximityChange={onProximityChange}
      />

      {/* Museum rooms laid out along Z axis */}
      {/* Welcome Hall: z = 5 to z = -2 */}
      <WelcomeHall data={data} position={[0, 0, 2]} />

      {/* Memory Gallery: z = -2 to z = -22 */}
      <MemoryGallery data={data} position={[0, 0, -12]} />

      {/* Love Story Room: z = -22 to z = -32 */}
      <LoveStoryRoom data={data} position={[0, 0, -27]} />

      {/* Finale Room: z = -32 to z = -42 */}
      <FinaleRoom data={data} position={[0, 0, -37]} />

      {/* Floating particles throughout */}
      <Particles count={100} area={[12, 6, 50]} offset={[0, 3, -18]} />

      {/* Player controller */}
      <PlayerController />
    </>
  )
}
