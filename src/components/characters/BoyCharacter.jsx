import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BoyCharacter({ position = [0, 0, 0], rotation = [0, 0, 0], isWalking = false, isDancing = false }) {
  const groupRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (isDancing) {
      // Waltz dance posture & animation
      if (leftArmRef.current) {
        // Left arm extended holding girl's right hand
        leftArmRef.current.rotation.x = -Math.PI / 4
        leftArmRef.current.rotation.z = Math.PI / 3 + Math.sin(time * 3) * 0.05
      }
      if (rightArmRef.current) {
        // Right arm around girl's waist
        rightArmRef.current.rotation.x = -Math.PI / 3
        rightArmRef.current.rotation.y = -Math.PI / 6
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.PI / 10 + Math.sin(time * 2) * 0.05
      }
      return
    }

    if (isWalking) {
      // Walking swing
      const legAngle = Math.sin(time * 7) * 0.45
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle

      const armAngle = Math.sin(time * 7) * 0.35
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle

      if (headRef.current) headRef.current.position.y = 1.48 + Math.abs(Math.sin(time * 7)) * 0.02
    } else {
      // Idle breathing
      const breath = Math.sin(time * 2) * 0.03
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.05
        leftArmRef.current.rotation.z = 0.08 + breath * 0.5
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.05
        rightArmRef.current.rotation.z = -0.08 - breath * 0.5
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 0.8) * 0.05
    }
  })

  // Materials
  const suitMaterial = new THREE.MeshStandardMaterial({ color: '#1a1d29', roughness: 0.6, metalness: 0.2 })
  const lapelMaterial = new THREE.MeshStandardMaterial({ color: '#0d0f17', roughness: 0.3, metalness: 0.4 })
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.7 })
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#e8beac', roughness: 0.6 })
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#1c1917', roughness: 0.8 })
  const bowTieMaterial = new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.4 })
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.6 })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head & Hair */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Face/Head */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.11, 20, 20]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.04, -0.01]} castShadow>
          <sphereGeometry args={[0.115, 18, 18]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Hair quiff/style */}
        <mesh position={[0, 0.1, 0.04]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.12, 0.05, 0.1]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Neck */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.08, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Torso & Suit */}
      <group position={[0, 1.05, 0]}>
        {/* Chest / Suit jacket */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.34, 0.38, 0.2]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* White shirt triangle */}
        <mesh position={[0, 0.24, 0.102]}>
          <planeGeometry args={[0.1, 0.14]} />
          <primitive object={shirtMaterial} attach="material" />
        </mesh>
        {/* Bow tie */}
        <mesh position={[0, 0.29, 0.11]}>
          <boxGeometry args={[0.08, 0.035, 0.02]} />
          <primitive object={bowTieMaterial} attach="material" />
        </mesh>
        {/* Satin lapels */}
        <mesh position={[-0.08, 0.2, 0.105]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.045, 0.22, 0.01]} />
          <primitive object={lapelMaterial} attach="material" />
        </mesh>
        <mesh position={[0.08, 0.2, 0.105]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.045, 0.22, 0.01]} />
          <primitive object={lapelMaterial} attach="material" />
        </mesh>
        {/* Lower torso / Waist */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.18]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.21, 1.3, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Arm */}
        <mesh position={[-0.02, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.38, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.02, -0.44, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.21, 1.3, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Arm */}
        <mesh position={[0.02, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.38, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.02, -0.44, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.09, 0.85, 0]}>
        {/* Thigh & Calve */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.045, 0.75, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.8, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.2]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.09, 0.85, 0]}>
        {/* Thigh & Calve */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.045, 0.75, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.8, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.2]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
