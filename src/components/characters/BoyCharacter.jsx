import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BoyCharacter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWalking = false,
  isDancing = false,
  isSitting = false,
}) {
  const groupRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (isSitting) {
      // Sitting at table posture
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2
        leftLegRef.current.position.y = 0.5
        leftLegRef.current.position.z = 0.2
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.PI / 2
        rightLegRef.current.position.y = 0.5
        rightLegRef.current.position.z = 0.2
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 3.5
        leftArmRef.current.rotation.z = 0.2
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3.5
        rightArmRef.current.rotation.z = -0.2
      }
      if (headRef.current) {
        headRef.current.position.y = 1.15
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.08
      }
      return
    }

    if (isDancing) {
      // Waltz dance posture
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 3.8
        leftArmRef.current.rotation.z = Math.PI / 3 + Math.sin(time * 3) * 0.06
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 2.8
        rightArmRef.current.rotation.y = -Math.PI / 5
      }
      if (headRef.current) {
        headRef.current.position.y = 1.48
        headRef.current.rotation.y = Math.PI / 10 + Math.sin(time * 2) * 0.05
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 3) * 0.2
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(time * 3) * 0.2
      return
    }

    if (isWalking) {
      // Natural walking stride
      const legAngle = Math.sin(time * 7) * 0.45
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = legAngle
        leftLegRef.current.position.set(-0.09, 0.85, 0)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -legAngle
        rightLegRef.current.position.set(0.09, 0.85, 0)
      }

      const armAngle = Math.sin(time * 7) * 0.35
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle

      if (headRef.current) {
        headRef.current.position.y = 1.48 + Math.abs(Math.sin(time * 7)) * 0.02
        headRef.current.rotation.y = 0
      }
    } else {
      // Idle breathing
      const breath = Math.sin(time * 2) * 0.03
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.05
        leftArmRef.current.rotation.z = 0.08 + breath * 0.4
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.05
        rightArmRef.current.rotation.z = -0.08 - breath * 0.4
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = 0
        leftLegRef.current.position.set(-0.09, 0.85, 0)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = 0
        rightLegRef.current.position.set(0.09, 0.85, 0)
      }
      if (headRef.current) {
        headRef.current.position.y = 1.48
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.05
      }
    }
  })

  // Exact matching materials from boy-avatar.png: Navy blue tailored suit, white shirt, black tie
  const suitMaterial = new THREE.MeshStandardMaterial({ color: '#1e2d4d', roughness: 0.5, metalness: 0.15 })
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 })
  const tieMaterial = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.4 })
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#f3c7b3', roughness: 0.6 })
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#271c19', roughness: 0.8 })
  const watchMaterial = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.2, metalness: 0.8 })
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.5 })

  const torsoY = isSitting ? 0.7 : 1.05

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head & Hair */}
      <group ref={headRef} position={[0, isSitting ? 1.15 : 1.48, 0]}>
        {/* Head */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.11, 20, 20]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Styled Hair */}
        <mesh position={[0, 0.045, -0.01]} castShadow>
          <sphereGeometry args={[0.116, 20, 20]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Modern fringe/pompadour */}
        <mesh position={[0, 0.11, 0.035]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.13, 0.06, 0.1]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Neck */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.08, 14]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Torso & Navy Suit Jacket */}
      <group position={[0, torsoY, 0]}>
        {/* Jacket body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.34, 0.4, 0.21]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* White collared shirt */}
        <mesh position={[0, 0.24, 0.106]}>
          <planeGeometry args={[0.09, 0.16]} />
          <primitive object={shirtMaterial} attach="material" />
        </mesh>
        {/* Black necktie */}
        <mesh position={[0, 0.18, 0.11]}>
          <boxGeometry args={[0.032, 0.2, 0.015]} />
          <primitive object={tieMaterial} attach="material" />
        </mesh>
        {/* White pocket square on left chest */}
        <mesh position={[-0.1, 0.24, 0.108]}>
          <boxGeometry args={[0.04, 0.015, 0.005]} />
          <primitive object={shirtMaterial} attach="material" />
        </mesh>
        {/* Lower torso */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.31, 0.18, 0.19]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Arm with Watch */}
      <group ref={leftArmRef} position={[-0.21, torsoY + 0.25, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.02, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.38, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Silver Watch */}
        <mesh position={[-0.02, -0.38, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.025, 12]} />
          <primitive object={watchMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.02, -0.44, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.21, torsoY + 0.25, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
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
      <group ref={leftLegRef} position={[-0.09, torsoY - 0.2, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.046, 0.75, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.8, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.2]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.09, torsoY - 0.2, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.046, 0.75, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.8, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.2]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
