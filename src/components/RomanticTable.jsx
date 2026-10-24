import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function RomanticTable({
  position = [0, 0, -6],
  rotation = [0, 0, 0],
  onProximityChange = () => {},
}) {
  const { camera } = useThree()
  const flame1Ref = useRef()
  const flame2Ref = useRef()
  const isCloseRef = useRef(false)

  const tablePos = new THREE.Vector3(...position)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Distance check to table
    const dist = camera.position.distanceTo(tablePos)
    const isClose = dist < 2.4
    if (isClose !== isCloseRef.current) {
      isCloseRef.current = isClose
      onProximityChange(isClose)
    }

    // Candle flame flicker
    if (flame1Ref.current) {
      flame1Ref.current.intensity = 0.8 + Math.sin(time * 15) * 0.15 + Math.cos(time * 23) * 0.1
    }
    if (flame2Ref.current) {
      flame2Ref.current.intensity = 0.8 + Math.sin(time * 18 + 1) * 0.15 + Math.cos(time * 27) * 0.1
    }
  })

  // Materials
  const woodMaterial = new THREE.MeshStandardMaterial({ color: '#3d2314', roughness: 0.3, metalness: 0.1 })
  const goldMaterial = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.25, metalness: 0.8 })
  const velvetMaterial = new THREE.MeshStandardMaterial({ color: '#7f1d1d', roughness: 0.8 })
  const glassMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.4 })
  const candleMaterial = new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.6 })

  return (
    <group position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
      {/* Table Gold Edge Rim */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.7, 0.02, 12, 32]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      {/* Table Central Pedestal */}
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 0.72, 16]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
      {/* Table Base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.08, 24]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* Chair 1 (Boy side - Left) */}
      <group position={[-0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
          <primitive object={velvetMaterial} attach="material" />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.8, -0.19]} castShadow>
          <boxGeometry args={[0.4, 0.65, 0.05]} />
          <primitive object={velvetMaterial} attach="material" />
        </mesh>
        {/* Gold Frame border */}
        <mesh position={[0, 0.8, -0.21]}>
          <boxGeometry args={[0.42, 0.68, 0.02]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        {/* Legs */}
        {[[-0.18, 0.22, -0.18], [0.18, 0.22, -0.18], [-0.18, 0.22, 0.18], [0.18, 0.22, 0.18]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.02, 0.015, 0.44, 8]} />
            <primitive object={goldMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Chair 2 (Girl side - Right) */}
      <group position={[0.9, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
          <primitive object={velvetMaterial} attach="material" />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.8, -0.19]} castShadow>
          <boxGeometry args={[0.4, 0.65, 0.05]} />
          <primitive object={velvetMaterial} attach="material" />
        </mesh>
        {/* Gold Frame border */}
        <mesh position={[0, 0.8, -0.21]}>
          <boxGeometry args={[0.42, 0.68, 0.02]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        {/* Legs */}
        {[[-0.18, 0.22, -0.18], [0.18, 0.22, -0.18], [-0.18, 0.22, 0.18], [0.18, 0.22, 0.18]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.02, 0.015, 0.44, 8]} />
            <primitive object={goldMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Candles & Wine Glasses on Table */}
      {/* Candle 1 */}
      <mesh position={[-0.15, 0.87, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 10]} />
        <primitive object={candleMaterial} attach="material" />
      </mesh>
      <pointLight ref={flame1Ref} position={[-0.15, 1.0, 0.1]} color="#ffedd5" distance={3} decay={2} />

      {/* Candle 2 */}
      <mesh position={[0.15, 0.87, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 10]} />
        <primitive object={candleMaterial} attach="material" />
      </mesh>
      <pointLight ref={flame2Ref} position={[0.15, 1.0, -0.1]} color="#ffedd5" distance={3} decay={2} />

      {/* Champagne Bottle */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.28, 12]} />
        <meshStandardMaterial color="#064e3b" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Wine Glasses */}
      <mesh position={[-0.3, 0.84, 0]}>
        <cylinderGeometry args={[0.035, 0.01, 0.14, 10]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      <mesh position={[0.3, 0.84, 0]}>
        <cylinderGeometry args={[0.035, 0.01, 0.14, 10]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
    </group>
  )
}
