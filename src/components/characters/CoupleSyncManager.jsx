import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import BoyCharacter from './BoyCharacter'
import GirlCharacter from './GirlCharacter'

export default function CoupleSyncManager({
  myRole = 'boy',
  partnerData = null,
  partnerConnected = false,
  isDancing = false,
  onProximityChange = () => {},
}) {
  const { camera } = useThree()
  const waltzGroupRef = useRef()
  const partnerRef = useRef()
  const lastProximityRef = useRef(false)

  // Floating heart particles for the waltz
  const heartParticles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 2.5 + 0.5,
      z: (Math.random() - 0.5) * 3,
      speed: Math.random() * 0.4 + 0.2,
      scale: Math.random() * 0.05 + 0.02,
    }))
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Distance calculation between player (camera) and partner / statue
    let targetPos = new THREE.Vector3(0, 0, -2) // Default couple position in welcome hall/statue
    if (partnerConnected && partnerData?.position) {
      targetPos.set(partnerData.position[0], partnerData.position[1], partnerData.position[2])
    }

    const dist = camera.position.distanceTo(targetPos)
    const isClose = dist < 2.2

    if (isClose !== lastProximityRef.current) {
      lastProximityRef.current = isClose
      onProximityChange(isClose)
    }

    // Waltz dance circular rotation
    if (isDancing && waltzGroupRef.current) {
      waltzGroupRef.current.rotation.y = time * 1.2
      waltzGroupRef.current.position.y = Math.sin(time * 3.6) * 0.04
    }
  })

  // If in Waltz Mode: render the couple dancing together locked in arms
  if (isDancing) {
    return (
      <group position={[0, 0, -1]} ref={waltzGroupRef}>
        {/* Spotlight on dancing couple */}
        <spotLight
          position={[0, 4.5, 0]}
          target-position={[0, 0, 0]}
          angle={0.6}
          penumbra={0.8}
          intensity={4}
          color="#ffe4e6"
          distance={8}
        />

        {/* Boy positioned for waltz */}
        <group position={[-0.26, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <BoyCharacter isWalking={false} isDancing={true} />
        </group>

        {/* Girl facing boy */}
        <group position={[0.26, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <GirlCharacter isWalking={false} isDancing={true} />
        </group>

        {/* Floating dance hearts */}
        {heartParticles.map((p, i) => (
          <mesh
            key={i}
            position={[p.x, p.y, p.z]}
            scale={p.scale}
          >
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#f43f5e' : '#fbbf24'} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    )
  }

  // Normal mode:
  // If partner is connected from another device: render partner's live avatar
  if (partnerConnected && partnerData) {
    const isPartnerWalking = partnerData.action === 'walking'
    return (
      <group position={partnerData.position} rotation={[0, partnerData.rotation, 0]}>
        {myRole === 'boy' ? (
          <GirlCharacter isWalking={isPartnerWalking} isDancing={false} />
        ) : (
          <BoyCharacter isWalking={isPartnerWalking} isDancing={false} />
        )}
      </group>
    )
  }

  // If playing alone (solo mode): Render the romantic couple standing together in the Welcome Hall / Garden
  return (
    <group position={[0, 0, -1]}>
      {/* Boy character */}
      <group position={[-0.4, 0, 0]} rotation={[0, 0.25, 0]}>
        <BoyCharacter isWalking={false} isDancing={false} />
      </group>

      {/* Girl character standing close holding hand */}
      <group position={[0.35, 0, 0]} rotation={[0, -0.25, 0]}>
        <GirlCharacter isWalking={false} isDancing={false} />
      </group>
    </group>
  )
}
