import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GirlCharacter({
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
        headRef.current.position.y = 1.12
        headRef.current.rotation.y = -Math.sin(time * 0.8) * 0.08
      }
      return
    }

    if (isDancing) {
      // Waltz dance posture for the girl
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3.8
        rightArmRef.current.rotation.z = -Math.PI / 3 - Math.sin(time * 3) * 0.06
      }
      if (leftArmRef.current) {
        // Hand on partner's shoulder
        leftArmRef.current.rotation.x = -Math.PI / 2.8
        leftArmRef.current.rotation.y = Math.PI / 5
      }
      if (headRef.current) {
        headRef.current.position.y = 1.42
        headRef.current.rotation.y = -Math.PI / 10 + Math.sin(time * 2) * 0.05
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(time * 3) * 0.2
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 3) * 0.2
      return
    }

    if (isWalking) {
      const legAngle = Math.sin(time * 7) * 0.4
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = legAngle
        leftLegRef.current.position.set(-0.08, 0.82, 0)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -legAngle
        rightLegRef.current.position.set(0.08, 0.82, 0)
      }

      const armAngle = Math.sin(time * 7) * 0.3
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle

      if (headRef.current) {
        headRef.current.position.y = 1.42 + Math.abs(Math.sin(time * 7)) * 0.02
        headRef.current.rotation.y = 0
      }
    } else {
      // Idle graceful breathing
      const breath = Math.sin(time * 2) * 0.025
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.05
        leftArmRef.current.rotation.z = 0.07 + breath * 0.4
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.05
        rightArmRef.current.rotation.z = -0.07 - breath * 0.4
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = 0
        leftLegRef.current.position.set(-0.08, 0.82, 0)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = 0
        rightLegRef.current.position.set(0.08, 0.82, 0)
      }
      if (headRef.current) {
        headRef.current.position.y = 1.42
        headRef.current.rotation.y = Math.sin(time * 0.7) * 0.06
      }
    }
  })

  // Matching materials from girl-avatar.png: Tailored Navy Suit, white shirt, ponytail hair
  const suitMaterial = new THREE.MeshStandardMaterial({ color: '#1e2d4d', roughness: 0.45, metalness: 0.15 })
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 })
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#f7d2c3', roughness: 0.6 })
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#271c19', roughness: 0.8 })
  const watchMaterial = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.2, metalness: 0.8 })
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.5 })

  const torsoY = isSitting ? 0.68 : 1.02

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head & Ponytail Hair */}
      <group ref={headRef} position={[0, isSitting ? 1.12 : 1.42, 0]}>
        {/* Face */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.098, 20, 20]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        {/* Hair base */}
        <mesh position={[0, 0.035, -0.015]} castShadow>
          <sphereGeometry args={[0.106, 20, 20]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Ponytail at the back */}
        <mesh position={[0, -0.06, -0.1]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.055, 0.22, 12]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.038, 0.044, 0.08, 14]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Torso & Tailored Navy Blazer */}
      <group position={[0, torsoY, 0]}>
        {/* Blazer Body */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[0.3, 0.38, 0.19]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* White shirt inner */}
        <mesh position={[0, 0.22, 0.096]}>
          <planeGeometry args={[0.08, 0.18]} />
          <primitive object={shirtMaterial} attach="material" />
        </mesh>
        {/* Fitted waist */}
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.28, 0.16, 0.17]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Arm with Watch */}
      <group ref={leftArmRef} position={[-0.18, torsoY + 0.24, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.015, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.032, 0.35, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Silver watch */}
        <mesh position={[-0.015, -0.34, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.02, 12]} />
          <primitive object={watchMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.015, -0.4, 0]}>
          <sphereGeometry args={[0.033, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.18, torsoY + 0.24, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        <mesh position={[0.015, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.032, 0.35, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.015, -0.4, 0]}>
          <sphereGeometry args={[0.033, 12, 12]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
      </group>

      {/* Left Leg & Trousers */}
      <group ref={leftLegRef} position={[-0.08, torsoY - 0.18, 0]}>
        <mesh position={[0, -0.38, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.038, 0.72, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Black heels / shoes */}
        <mesh position={[0, -0.76, 0.03]} castShadow>
          <boxGeometry args={[0.075, 0.055, 0.17]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Leg & Trousers */}
      <group ref={rightLegRef} position={[0.08, torsoY - 0.18, 0]}>
        <mesh position={[0, -0.38, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.038, 0.72, 12]} />
          <primitive object={suitMaterial} attach="material" />
        </mesh>
        {/* Black heels / shoes */}
        <mesh position={[0, -0.76, 0.03]} castShadow>
          <boxGeometry args={[0.075, 0.055, 0.17]} />
          <primitive object={shoeMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
