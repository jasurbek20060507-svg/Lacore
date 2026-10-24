import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Realistic Humanoid 3D Character - Boy (Kuyov)
 * Inspired by the uploaded 3D Pixar avatar (boy-avatar.png)
 * Features:
 * - Natural human anatomy (sculpted face, eyes with iris/pupil/reflections, eyebrows, nose, lips, ears)
 * - Voluminous styled quiff/pompadour hair matching avatar
 * - Tailored royal navy blue suit jacket with folded lapels, pocket square, and gilded buttons
 * - Crisp white collared shirt with folded collar points and silk black necktie
 * - Silver luxury wristwatch on left wrist
 * - Articulated legs and arms with smooth organic capsules (no rectangular boxes!)
 * - Polished Italian black leather oxford dress shoes
 */
export default function BoyCharacter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWalking = false,
  isDancing = false,
  isSitting = false,
}) {
  const groupRef = useRef()
  const headRef = useRef()
  const torsoRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftForearmRef = useRef()
  const rightForearmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftCalfRef = useRef()
  const rightCalfRef = useRef()

  // Materials with realistic PBR properties
  const materials = useMemo(() => {
    return {
      suit: new THREE.MeshStandardMaterial({
        color: '#182642',
        roughness: 0.55,
        metalness: 0.12,
      }),
      lapel: new THREE.MeshStandardMaterial({
        color: '#131e33',
        roughness: 0.5,
        metalness: 0.15,
      }),
      shirt: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.6,
      }),
      tie: new THREE.MeshStandardMaterial({
        color: '#0d131f',
        roughness: 0.35,
        metalness: 0.1,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: '#f3c4ac',
        roughness: 0.55,
      }),
      lips: new THREE.MeshStandardMaterial({
        color: '#c97b6e',
        roughness: 0.6,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: '#1f1510',
        roughness: 0.75,
      }),
      eyeWhite: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.1,
      }),
      eyeIris: new THREE.MeshStandardMaterial({
        color: '#362013',
        roughness: 0.25,
      }),
      eyePupil: new THREE.MeshBasicMaterial({
        color: '#050505',
      }),
      eyeGlint: new THREE.MeshBasicMaterial({
        color: '#ffffff',
      }),
      brows: new THREE.MeshStandardMaterial({
        color: '#150d09',
        roughness: 0.9,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.3,
        metalness: 0.8,
      }),
      silverWatch: new THREE.MeshStandardMaterial({
        color: '#d1d5db',
        roughness: 0.2,
        metalness: 0.85,
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: '#0a0d14',
        roughness: 0.25,
        metalness: 0.4,
      }),
      sole: new THREE.MeshStandardMaterial({
        color: '#171717',
        roughness: 0.8,
      }),
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (isSitting) {
      // Realistic Sitting posture at dining table
      if (torsoRef.current) torsoRef.current.position.y = 0.48
      if (headRef.current) {
        headRef.current.position.y = 1.05
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.08
        headRef.current.rotation.x = 0.05
      }
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.11, 0.48, 0.05)
        leftLegRef.current.rotation.x = -Math.PI / 2
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.11, 0.48, 0.05)
        rightLegRef.current.rotation.x = -Math.PI / 2
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.x = Math.PI / 2
      if (rightCalfRef.current) rightCalfRef.current.rotation.x = Math.PI / 2

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 3.2
        leftArmRef.current.rotation.z = 0.15
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3.2
        rightArmRef.current.rotation.z = -0.15
      }
      return
    }

    if (isDancing) {
      // Waltz dance posture - boy holds girl's hand & waist
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.95 + Math.sin(time * 3) * 0.03
        torsoRef.current.rotation.y = Math.sin(time * 3) * 0.1
      }
      if (headRef.current) {
        headRef.current.position.y = 1.48 + Math.sin(time * 3) * 0.03
        headRef.current.rotation.y = Math.PI / 12 + Math.sin(time * 2) * 0.06
      }
      // Left arm held up and forward holding girl's right hand
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 3.5
        leftArmRef.current.rotation.z = Math.PI / 3.2
        leftArmRef.current.rotation.y = 0.2
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = -0.4
      }
      // Right arm wrapped gently around girl's waist
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3
        rightArmRef.current.rotation.z = -Math.PI / 8
        rightArmRef.current.rotation.y = -Math.PI / 4
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = -0.6
      }

      // Waltz steps (1-2-3 glide)
      const waltzStride = Math.sin(time * 3) * 0.22
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.11, 0.88, 0)
        leftLegRef.current.rotation.x = waltzStride
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.11, 0.88, 0)
        rightLegRef.current.rotation.x = -waltzStride
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.x = Math.max(0, -waltzStride * 0.6)
      if (rightCalfRef.current) rightCalfRef.current.rotation.x = Math.max(0, waltzStride * 0.6)
      return
    }

    if (isWalking) {
      // Natural walking stride with articulated knee & elbow swing
      const stepFreq = 7.5
      const stride = Math.sin(time * stepFreq) * 0.48
      const bob = Math.abs(Math.sin(time * stepFreq)) * 0.035

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.95 + bob
        torsoRef.current.rotation.y = -stride * 0.12
        torsoRef.current.rotation.z = Math.sin(time * stepFreq) * 0.02
      }
      if (headRef.current) {
        headRef.current.position.y = 1.48 + bob
        headRef.current.rotation.y = stride * 0.06
      }

      // Legs with articulated knee flexion
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.11, 0.88 + bob, 0)
        leftLegRef.current.rotation.x = stride
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.11, 0.88 + bob, 0)
        rightLegRef.current.rotation.x = -stride
      }
      if (leftCalfRef.current) {
        leftCalfRef.current.rotation.x = stride < 0 ? Math.abs(stride) * 0.85 : 0.05
      }
      if (rightCalfRef.current) {
        rightCalfRef.current.rotation.x = stride > 0 ? Math.abs(stride) * 0.85 : 0.05
      }

      // Arms counter-swinging with slight elbow flexion
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.75
        leftArmRef.current.rotation.z = 0.08
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = stride * 0.75
        rightArmRef.current.rotation.z = -0.08
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.15 - Math.max(0, stride) * 0.25
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.15 - Math.max(0, -stride) * 0.25
    } else {
      // Idle lifelike breathing and gentle head look
      const breath = Math.sin(time * 2.2) * 0.02
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.95 + breath * 0.4
        torsoRef.current.rotation.set(0, 0, 0)
      }
      if (headRef.current) {
        headRef.current.position.y = 1.48 + breath * 0.6
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.06
        headRef.current.rotation.x = Math.sin(time * 1.4) * 0.02
      }
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.11, 0.88, 0)
        leftLegRef.current.rotation.set(0, 0, -0.02)
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.11, 0.88, 0)
        rightLegRef.current.rotation.set(0, 0, 0.02)
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.set(0, 0, 0)
      if (rightCalfRef.current) rightCalfRef.current.rotation.set(0, 0, 0)

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.04
        leftArmRef.current.rotation.z = 0.08 + breath * 0.5
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.04
        rightArmRef.current.rotation.z = -0.08 - breath * 0.5
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.set(-0.08, 0, 0)
      if (rightForearmRef.current) rightForearmRef.current.rotation.set(-0.08, 0, 0)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ==================== HEAD & FACE ==================== */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Cranium / Head base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <sphereGeometry args={[0.102, 32, 32]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Sculpted Masculine Jaw & Chin */}
        <mesh position={[0, -0.05, 0.03]} rotation={[0.22, 0, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.052, 16, 16]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Slender Neck with Collarbone contour */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.042, 0.048, 0.1, 24]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Left & Right Ears */}
        <mesh position={[-0.104, 0.015, -0.005]} rotation={[0, 0.15, -0.1]}>
          <capsuleGeometry args={[0.014, 0.032, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0.104, 0.015, -0.005]} rotation={[0, -0.15, 0.1]}>
          <capsuleGeometry args={[0.014, 0.032, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* ----- EYES (Expressive 3D Human Eyes) ----- */}
        {/* Left Eye */}
        <group position={[-0.038, 0.022, 0.088]}>
          {/* Eyeball / Sclera */}
          <mesh>
            <sphereGeometry args={[0.017, 16, 16]} />
            <primitive object={materials.eyeWhite} attach="material" />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.009]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <primitive object={materials.eyeIris} attach="material" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.012]}>
            <sphereGeometry args={[0.0055, 12, 12]} />
            <primitive object={materials.eyePupil} attach="material" />
          </mesh>
          {/* Corneal Glint / Lifelike Sparkle */}
          <mesh position={[-0.003, 0.003, 0.014]}>
            <sphereGeometry args={[0.0022, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          {/* Eyebrow */}
          <mesh position={[0, 0.024, 0.006]} rotation={[0, 0, -0.1]}>
            <capsuleGeometry args={[0.004, 0.034, 8, 8]} />
            <primitive object={materials.brows} attach="material" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.038, 0.022, 0.088]}>
          {/* Eyeball / Sclera */}
          <mesh>
            <sphereGeometry args={[0.017, 16, 16]} />
            <primitive object={materials.eyeWhite} attach="material" />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.009]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <primitive object={materials.eyeIris} attach="material" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.012]}>
            <sphereGeometry args={[0.0055, 12, 12]} />
            <primitive object={materials.eyePupil} attach="material" />
          </mesh>
          {/* Corneal Glint / Lifelike Sparkle */}
          <mesh position={[-0.003, 0.003, 0.014]}>
            <sphereGeometry args={[0.0022, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          {/* Eyebrow */}
          <mesh position={[0, 0.024, 0.006]} rotation={[0, 0, 0.1]}>
            <capsuleGeometry args={[0.004, 0.034, 8, 8]} />
            <primitive object={materials.brows} attach="material" />
          </mesh>
        </group>

        {/* ----- NOSE (Sculpted 3D Bridge & Tip) ----- */}
        <mesh position={[0, 0.006, 0.098]} rotation={[-0.2, 0, 0]}>
          <capsuleGeometry args={[0.007, 0.026, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0, -0.012, 0.106]}>
          <sphereGeometry args={[0.009, 12, 12]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* ----- MOUTH / LIPS ----- */}
        {/* Upper Lip */}
        <mesh position={[0, -0.034, 0.096]} rotation={[0, 0, 0]}>
          <capsuleGeometry args={[0.005, 0.028, 8, 8]} />
          <primitive object={materials.lips} attach="material" />
        </mesh>
        {/* Lower Lip (Gentle warm smile) */}
        <mesh position={[0, -0.043, 0.094]}>
          <capsuleGeometry args={[0.006, 0.024, 8, 8]} />
          <primitive object={materials.lips} attach="material" />
        </mesh>

        {/* ----- STYLED 3D HAIR (Matching boy-avatar.png Quiff/Pompadour) ----- */}
        {/* Hair Cap back and sides */}
        <mesh position={[0, 0.045, -0.015]} castShadow>
          <sphereGeometry args={[0.108, 28, 28]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        {/* Voluminous Swept Quiff at Top Front */}
        <mesh position={[0, 0.125, 0.025]} rotation={[0.26, 0, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.09, 16, 16]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[-0.045, 0.115, 0.02]} rotation={[0.24, -0.12, -0.15]}>
          <capsuleGeometry args={[0.042, 0.07, 12, 12]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0.045, 0.115, 0.02]} rotation={[0.24, 0.12, 0.15]}>
          <capsuleGeometry args={[0.042, 0.07, 12, 12]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        {/* Hair side fade */}
        <mesh position={[-0.095, 0.06, 0.005]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.025, 0.07, 10, 10]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0.095, 0.06, 0.005]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.025, 0.07, 10, 10]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
      </group>

      {/* ==================== TORSO & TAILORED SUIT ==================== */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* Athletic Chest & Blazer (Smooth Contoured Curves) */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.165, 0.14, 0.28, 32]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>
        {/* Natural Tailored Waist narrowing downwards */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.145, 0.2, 32]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Left & Right Rounded Deltoid Shoulders */}
        <mesh position={[-0.17, 0.28, 0]} castShadow>
          <sphereGeometry args={[0.065, 20, 20]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>
        <mesh position={[0.17, 0.28, 0]} castShadow>
          <sphereGeometry args={[0.065, 20, 20]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Crisp White Shirt Collar & V-Neck Opening */}
        <mesh position={[0, 0.24, 0.07]}>
          <cylinderGeometry args={[0.07, 0.05, 0.18, 16]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        {/* Shirt Collar Points (3D Folded Collar) */}
        <mesh position={[-0.04, 0.31, 0.09]} rotation={[0.2, 0.2, -0.3]}>
          <capsuleGeometry args={[0.012, 0.04, 8, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>
        <mesh position={[0.04, 0.31, 0.09]} rotation={[0.2, -0.2, 0.3]}>
          <capsuleGeometry args={[0.012, 0.04, 8, 8]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>

        {/* Tailored Suit Lapels (Notched European Cut) */}
        <mesh position={[-0.075, 0.17, 0.11]} rotation={[0, 0.18, -0.25]} castShadow>
          <capsuleGeometry args={[0.025, 0.22, 10, 10]} />
          <primitive object={materials.lapel} attach="material" />
        </mesh>
        <mesh position={[0.075, 0.17, 0.11]} rotation={[0, -0.18, 0.25]} castShadow>
          <capsuleGeometry args={[0.025, 0.22, 10, 10]} />
          <primitive object={materials.lapel} attach="material" />
        </mesh>

        {/* Black Silk Necktie (Realistic 3D Knot & Blade) */}
        {/* Tie Knot */}
        <mesh position={[0, 0.27, 0.115]} rotation={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.014, 0.038, 12]} />
          <primitive object={materials.tie} attach="material" />
        </mesh>
        {/* Tie Blade */}
        <mesh position={[0, 0.12, 0.12]} rotation={[-0.04, 0, 0]}>
          <capsuleGeometry args={[0.016, 0.24, 10, 10]} />
          <primitive object={materials.tie} attach="material" />
        </mesh>

        {/* White Linen Pocket Square on Left Chest */}
        <mesh position={[-0.1, 0.22, 0.12]} rotation={[0, 0.15, -0.2]}>
          <capsuleGeometry args={[0.008, 0.04, 6, 6]} />
          <primitive object={materials.shirt} attach="material" />
        </mesh>

        {/* Gilded Blazer Buttons */}
        <mesh position={[0, 0.05, 0.145]}>
          <sphereGeometry args={[0.007, 10, 10]} />
          <primitive object={materials.gold} attach="material" />
        </mesh>
        <mesh position={[0, -0.03, 0.145]}>
          <sphereGeometry args={[0.007, 10, 10]} />
          <primitive object={materials.gold} attach="material" />
        </mesh>
      </group>

      {/* ==================== LEFT ARM & WATCH ==================== */}
      <group ref={leftArmRef} position={[-0.22, 1.22, 0]}>
        {/* Upper Arm (Bicep/Tricep Capsule) */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.046, 0.18, 16, 16]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Elbow Joint & Forearm */}
        <group ref={leftForearmRef} position={[0, -0.24, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.042, 14, 14]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.11, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.16, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Crisp White Shirt Cuff peeking out */}
          <mesh position={[0, -0.21, 0]}>
            <cylinderGeometry args={[0.039, 0.039, 0.02, 16]} />
            <primitive object={materials.shirt} attach="material" />
          </mesh>

          {/* Luxury Silver Wristwatch */}
          <mesh position={[0, -0.225, 0]}>
            <cylinderGeometry args={[0.041, 0.041, 0.018, 16]} />
            <primitive object={materials.silverWatch} attach="material" />
          </mesh>
          <mesh position={[-0.038, -0.225, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
            <primitive object={materials.silverWatch} attach="material" />
          </mesh>

          {/* Natural Human Hand with Sculpted Fingers */}
          <group position={[0, -0.28, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <capsuleGeometry args={[0.028, 0.04, 12, 12]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Thumb */}
            <mesh position={[0.022, 0.01, 0.01]} rotation={[0, 0, 0.4]}>
              <capsuleGeometry args={[0.01, 0.026, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Curled Fingers */}
            <mesh position={[-0.005, -0.026, 0.005]} rotation={[-0.3, 0, 0]}>
              <capsuleGeometry args={[0.022, 0.036, 10, 10]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== RIGHT ARM ==================== */}
      <group ref={rightArmRef} position={[0.22, 1.22, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.046, 0.18, 16, 16]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Elbow Joint & Forearm */}
        <group ref={rightForearmRef} position={[0, -0.24, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.042, 14, 14]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.11, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.16, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Crisp White Shirt Cuff */}
          <mesh position={[0, -0.21, 0]}>
            <cylinderGeometry args={[0.039, 0.039, 0.02, 16]} />
            <primitive object={materials.shirt} attach="material" />
          </mesh>

          {/* Natural Human Hand with Sculpted Fingers */}
          <group position={[0, -0.28, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <capsuleGeometry args={[0.028, 0.04, 12, 12]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Thumb */}
            <mesh position={[-0.022, 0.01, 0.01]} rotation={[0, 0, -0.4]}>
              <capsuleGeometry args={[0.01, 0.026, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Curled Fingers */}
            <mesh position={[0.005, -0.026, 0.005]} rotation={[-0.3, 0, 0]}>
              <capsuleGeometry args={[0.022, 0.036, 10, 10]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== LEFT LEG & SHOE ==================== */}
      <group ref={leftLegRef} position={[-0.11, 0.88, 0]}>
        {/* Thigh (Smooth Navy Trousers) */}
        <mesh position={[0, -0.19, 0]} castShadow>
          <capsuleGeometry args={[0.058, 0.32, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Knee Joint & Calf */}
        <group ref={leftCalfRef} position={[0, -0.38, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.052, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.3, 18, 18]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Trouser Cuff Rim */}
          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.052, 0.054, 0.03, 20]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Polished Italian Black Leather Oxford Shoe */}
          <group position={[0, -0.42, 0.04]}>
            {/* Main Shoe Body */}
            <mesh position={[0, 0.03, 0.01]} rotation={[0.05, 0, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.13, 16, 16]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Leather Sole Welt */}
            <mesh position={[0, 0.005, 0.01]}>
              <cylinderGeometry args={[0.048, 0.048, 0.015, 20]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
            {/* Raised Heel */}
            <mesh position={[0, 0.015, -0.05]}>
              <boxGeometry args={[0.07, 0.02, 0.05]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== RIGHT LEG & SHOE ==================== */}
      <group ref={rightLegRef} position={[0.11, 0.88, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.19, 0]} castShadow>
          <capsuleGeometry args={[0.058, 0.32, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Knee Joint & Calf */}
        <group ref={rightCalfRef} position={[0, -0.38, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.052, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.3, 18, 18]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Trouser Cuff Rim */}
          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.052, 0.054, 0.03, 20]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Polished Italian Black Leather Oxford Shoe */}
          <group position={[0, -0.42, 0.04]}>
            {/* Main Shoe Body */}
            <mesh position={[0, 0.03, 0.01]} rotation={[0.05, 0, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.13, 16, 16]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Leather Sole Welt */}
            <mesh position={[0, 0.005, 0.01]}>
              <cylinderGeometry args={[0.048, 0.048, 0.015, 20]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
            {/* Raised Heel */}
            <mesh position={[0, 0.015, -0.05]}>
              <boxGeometry args={[0.07, 0.02, 0.05]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
