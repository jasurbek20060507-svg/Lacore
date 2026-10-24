import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GirlCharacter({ position = [0, 0, 0], rotation = [0, 0, 0], isWalking = false, isDancing = false }) {
  const groupRef = useRef()
  const dressRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (isDancing) {
      // Waltz dance posture for the girl
      if (rightArmRef.current) {
        // Right hand resting on boy's left hand
        rightArmRef.current.rotation.x = -Math.PI / 4
        rightArmRef.current.rotation.z = -Math.PI / 3 - Math.sin(time * 3) * 0.05
      }
      if (leftArmRef.current) {
        // Left hand on boy's shoulder
        leftArmRef.current.rotation.x = -Math.PI / 3
        leftArmRef.current.rotation.y = Math.PI / 6
      }
      if (dressRef.current) {
        // Dress swirling gently during waltz
        dressRef.current.rotation.y = Math.sin(time * 3) * 0.15
        dressRef.current.rotation.z = Math.cos(time * 3) * 0.08
      }
      if (headRef.current) {
        headRef.current.rotation.y = -Math.PI / 10 + Math.sin(time * 2) * 0.05
      }
      return
    }

    if (isWalking) {
      const armAngle = Math.sin(time * 7) * 0.3
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle

      if (dressRef.current) {
        dressRef.current.rotation.z = Math.sin(time * 7) * 0.06
        dressRef.current.rotation.x = Math.abs(Math.sin(time * 7)) * 0.05
      }
      if (headRef.current) headRef.current.position.y = 1.4 + Math.abs(Math.sin(time * 7)) * 0.02
    } else {
      // Idle graceful breathing
      const breath = Math.sin(time * 2) * 0.025
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.05
        leftArmRef.current.rotation.z = 0.06 + breath * 0.4
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.05
        rightArmRef.current.rotation.z = -0.06 - breath * 0.4
      }
      if (dressRef.current) {
        dressRef.current.rotation.z = Math.sin(time * 1.5) * 0.02
      }
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 0.7) * 0.06
    }
  })

  // Materials
  const dressMaterial = new THREE.MeshStandardMaterial({
    color: '#f43f5e',
    roughness: 0.35,
    metalness: 0.15,
    emissive: '#be123c',
    emissiveIntensity: 0.05,
  })
  const ribbonMaterial = new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.3, metalness: 0.5 })
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#f5d0c5', roughness: 0.6 })
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#3f2e21', roughness: 0.75 })
  const flowerMaterial = new THREE.MeshStandardMaterial({ color: '#fff1f2', emissive: '#f43f5e', emissiveIntensity: 0.2 })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head & Hair */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Face */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.095, 20, 20]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Hair top & back */}
        <mesh position={[0, 0.03, -0.02]} castShadow>
          <sphereGeometry args={[0.105, 18, 18]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Flowing hair back */}
        <mesh position={[0, -0.15, -0.07]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.35, 12]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Hair flower pin */}
        <mesh position={[0.09, 0.06, 0.02]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <primitive object={flowerMaterial} attach="material" />
        </mesh>
        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.035, 0.042, 0.08, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Torso & Evening Gown Top */}
      <group position={[0, 1.05, 0]}>
        {/* Bodice / Corset */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.11, 0.28, 16]} />
          <primitive object={dressMaterial} attach="material" />
        </mesh>
        {/* Sweetheart neckline detail */}
        <mesh position={[0, 0.24, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
          <primitive object={dressMaterial} attach="material" />
        </mesh>
        {/* Gold waist ribbon */}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.118, 0.12, 0.04, 16]} />
          <primitive object={ribbonMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.16, 1.25, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Arm */}
        <mesh position={[-0.015, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.026, 0.35, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.015, -0.4, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.16, 1.25, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Arm */}
        <mesh position={[0.015, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.026, 0.35, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.015, -0.4, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Flowing Long Evening Gown (Skirt) */}
      <group ref={dressRef} position={[0, 0.95, 0]}>
        <mesh position={[0, -0.48, 0]} castShadow>
          <coneGeometry args={[0.38, 0.98, 24, 1, true]} />
          <primitive object={dressMaterial} attach="material" />
        </mesh>
        {/* Inner shadow / fullness */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.13, 0.36, 0.96, 16]} />
          <primitive object={dressMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
