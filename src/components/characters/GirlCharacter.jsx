import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Realistic Humanoid 3D Character - Girl (Kelin)
 * Inspired by the uploaded 3D Pixar avatar (girl-avatar.png)
 * Features:
 * - Natural feminine human anatomy (delicate oval face, almond eyes with double specular reflections, eyelashes, nose, rosy lips, cheek blush, pearl earrings)
 * - Elegant ponytail hairstyle with soft face-framing tendrils and gold scrunchie matching avatar
 * - Tailored royal navy blue women's blazer jacket with hourglass waist and gold accent buttons
 * - Crisp white open-collar silk blouse
 * - Silver watch/jewelry on slender wrist
 * - Articulated legs and arms with smooth organic capsules (no rectangular boxes!)
 * - Sleek black pointed-toe dress heels/pumps
 */
export default function GirlCharacter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWalking = false,
  isDancing = false,
  isSitting = false,
}) {
  const groupRef = useRef()
  const headRef = useRef()
  const torsoRef = useRef()
  const ponytailRef = useRef()
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
        roughness: 0.52,
        metalness: 0.12,
      }),
      lapel: new THREE.MeshStandardMaterial({
        color: '#131e33',
        roughness: 0.48,
        metalness: 0.15,
      }),
      blouse: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.6,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: '#fae0d4',
        roughness: 0.5,
      }),
      blush: new THREE.MeshStandardMaterial({
        color: '#f4a5ae',
        roughness: 0.6,
        transparent: true,
        opacity: 0.65,
      }),
      lips: new THREE.MeshStandardMaterial({
        color: '#d96b79',
        roughness: 0.35,
        metalness: 0.05,
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
        color: '#3d2416',
        roughness: 0.25,
      }),
      eyePupil: new THREE.MeshBasicMaterial({
        color: '#050505',
      }),
      eyeGlint: new THREE.MeshBasicMaterial({
        color: '#ffffff',
      }),
      eyelashes: new THREE.MeshBasicMaterial({
        color: '#0a0503',
      }),
      brows: new THREE.MeshStandardMaterial({
        color: '#1e130d',
        roughness: 0.9,
      }),
      pearl: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.15,
        metalness: 0.6,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.25,
        metalness: 0.85,
      }),
      silverWatch: new THREE.MeshStandardMaterial({
        color: '#d1d5db',
        roughness: 0.2,
        metalness: 0.85,
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: '#0a0d14',
        roughness: 0.22,
        metalness: 0.45,
      }),
      sole: new THREE.MeshStandardMaterial({
        color: '#171717',
        roughness: 0.8,
      }),
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Gentle swaying of ponytail
    if (ponytailRef.current) {
      ponytailRef.current.rotation.x = 0.25 + Math.sin(time * 2.5) * 0.04
      ponytailRef.current.rotation.z = Math.sin(time * 2) * 0.03
    }

    if (isSitting) {
      // Realistic Sitting posture at dining table
      if (torsoRef.current) torsoRef.current.position.y = 0.46
      if (headRef.current) {
        headRef.current.position.y = 1.02
        headRef.current.rotation.y = -Math.sin(time * 0.8) * 0.08
        headRef.current.rotation.x = 0.04
      }
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.09, 0.46, 0.05)
        leftLegRef.current.rotation.x = -Math.PI / 2
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.09, 0.46, 0.05)
        rightLegRef.current.rotation.x = -Math.PI / 2
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.x = Math.PI / 2
      if (rightCalfRef.current) rightCalfRef.current.rotation.x = Math.PI / 2

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 3.2
        leftArmRef.current.rotation.z = 0.12
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3.2
        rightArmRef.current.rotation.z = -0.12
      }
      return
    }

    if (isDancing) {
      // Waltz posture - girl holds boy's left hand and rests left hand on boy's shoulder
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.92 + Math.sin(time * 3) * 0.03
        torsoRef.current.rotation.y = -Math.sin(time * 3) * 0.1
      }
      if (headRef.current) {
        headRef.current.position.y = 1.42 + Math.sin(time * 3) * 0.03
        headRef.current.rotation.y = -Math.PI / 12 - Math.sin(time * 2) * 0.06
      }
      // Right arm extended forward holding boy's left hand
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3.5
        rightArmRef.current.rotation.z = -Math.PI / 3.2
        rightArmRef.current.rotation.y = -0.2
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = -0.4
      }
      // Left arm resting gracefully on partner's shoulder
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 2.6
        leftArmRef.current.rotation.y = Math.PI / 4.5
        leftArmRef.current.rotation.z = Math.PI / 10
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = -0.5
      }

      // Waltz steps (1-2-3 glide)
      const waltzStride = Math.sin(time * 3) * 0.2
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.09, 0.85, 0)
        leftLegRef.current.rotation.x = -waltzStride
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.09, 0.85, 0)
        rightLegRef.current.rotation.x = waltzStride
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.x = Math.max(0, waltzStride * 0.6)
      if (rightCalfRef.current) rightCalfRef.current.rotation.x = Math.max(0, -waltzStride * 0.6)
      return
    }

    if (isWalking) {
      // Graceful feminine walking stride
      const stepFreq = 7.5
      const stride = Math.sin(time * stepFreq) * 0.44
      const bob = Math.abs(Math.sin(time * stepFreq)) * 0.03

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.92 + bob
        torsoRef.current.rotation.y = -stride * 0.14
        torsoRef.current.rotation.z = Math.sin(time * stepFreq) * 0.025
      }
      if (headRef.current) {
        headRef.current.position.y = 1.42 + bob
        headRef.current.rotation.y = stride * 0.05
      }

      // Legs with articulated knee flexion
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.09, 0.85 + bob, 0)
        leftLegRef.current.rotation.x = stride
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.09, 0.85 + bob, 0)
        rightLegRef.current.rotation.x = -stride
      }
      if (leftCalfRef.current) {
        leftCalfRef.current.rotation.x = stride < 0 ? Math.abs(stride) * 0.85 : 0.05
      }
      if (rightCalfRef.current) {
        rightCalfRef.current.rotation.x = stride > 0 ? Math.abs(stride) * 0.85 : 0.05
      }

      // Arms counter-swinging gracefully
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.65
        leftArmRef.current.rotation.z = 0.07
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = stride * 0.65
        rightArmRef.current.rotation.z = -0.07
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.12 - Math.max(0, stride) * 0.2
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.12 - Math.max(0, -stride) * 0.2
    } else {
      // Idle graceful breathing
      const breath = Math.sin(time * 2.2) * 0.018
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.92 + breath * 0.35
        torsoRef.current.rotation.set(0, 0, 0)
      }
      if (headRef.current) {
        headRef.current.position.y = 1.42 + breath * 0.5
        headRef.current.rotation.y = Math.sin(time * 0.75) * 0.06
        headRef.current.rotation.x = Math.sin(time * 1.3) * 0.02
      }
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.09, 0.85, 0)
        leftLegRef.current.rotation.set(0, 0, -0.02)
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.09, 0.85, 0)
        rightLegRef.current.rotation.set(0, 0, 0.02)
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.set(0, 0, 0)
      if (rightCalfRef.current) rightCalfRef.current.rotation.set(0, 0, 0)

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.03
        leftArmRef.current.rotation.z = 0.07 + breath * 0.4
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.03
        rightArmRef.current.rotation.z = -0.07 - breath * 0.4
      }
      if (leftForearmRef.current) leftForearmRef.current.rotation.set(-0.06, 0, 0)
      if (rightForearmRef.current) rightForearmRef.current.rotation.set(-0.06, 0, 0)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ==================== HEAD & FACE ==================== */}
      <group ref={headRef} position={[0, 1.42, 0]}>
        {/* Cranium / Delicate feminine face */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <sphereGeometry args={[0.095, 32, 32]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Soft Tapered Feminine Chin */}
        <mesh position={[0, -0.048, 0.025]} rotation={[0.2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.046, 16, 16]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Slender Graceful Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.034, 0.04, 0.09, 24]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* Left & Right Ears with Pearl Earrings */}
        <group position={[-0.096, 0.01, -0.005]} rotation={[0, 0.15, -0.1]}>
          <mesh>
            <capsuleGeometry args={[0.012, 0.028, 10, 10]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          {/* Pearl Stud Earring */}
          <mesh position={[-0.006, -0.016, 0.002]}>
            <sphereGeometry args={[0.005, 12, 12]} />
            <primitive object={materials.pearl} attach="material" />
          </mesh>
        </group>
        <group position={[0.096, 0.01, -0.005]} rotation={[0, -0.15, 0.1]}>
          <mesh>
            <capsuleGeometry args={[0.012, 0.028, 10, 10]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          {/* Pearl Stud Earring */}
          <mesh position={[0.006, -0.016, 0.002]}>
            <sphereGeometry args={[0.005, 12, 12]} />
            <primitive object={materials.pearl} attach="material" />
          </mesh>
        </group>

        {/* ----- EYES (Expressive Romantic Eyes with Double Sparkle) ----- */}
        {/* Left Eye */}
        <group position={[-0.035, 0.018, 0.082]}>
          <mesh>
            <sphereGeometry args={[0.016, 16, 16]} />
            <primitive object={materials.eyeWhite} attach="material" />
          </mesh>
          {/* Warm Amber Iris */}
          <mesh position={[0, 0, 0.008]}>
            <sphereGeometry args={[0.0105, 16, 16]} />
            <primitive object={materials.eyeIris} attach="material" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.011]}>
            <sphereGeometry args={[0.0055, 12, 12]} />
            <primitive object={materials.eyePupil} attach="material" />
          </mesh>
          {/* Double Specular Glint (Disney/Pixar romantic sparkle) */}
          <mesh position={[-0.003, 0.003, 0.013]}>
            <sphereGeometry args={[0.0022, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          <mesh position={[0.002, -0.002, 0.013]}>
            <sphereGeometry args={[0.0014, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          {/* Upper Eyelashes */}
          <mesh position={[-0.002, 0.015, 0.008]} rotation={[0, 0, -0.15]}>
            <capsuleGeometry args={[0.0025, 0.026, 6, 6]} />
            <primitive object={materials.eyelashes} attach="material" />
          </mesh>
          {/* Slender Eyebrow */}
          <mesh position={[0, 0.022, 0.006]} rotation={[0, 0, -0.1]}>
            <capsuleGeometry args={[0.0032, 0.03, 8, 8]} />
            <primitive object={materials.brows} attach="material" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.035, 0.018, 0.082]}>
          <mesh>
            <sphereGeometry args={[0.016, 16, 16]} />
            <primitive object={materials.eyeWhite} attach="material" />
          </mesh>
          {/* Warm Amber Iris */}
          <mesh position={[0, 0, 0.008]}>
            <sphereGeometry args={[0.0105, 16, 16]} />
            <primitive object={materials.eyeIris} attach="material" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.011]}>
            <sphereGeometry args={[0.0055, 12, 12]} />
            <primitive object={materials.eyePupil} attach="material" />
          </mesh>
          {/* Double Specular Glint */}
          <mesh position={[-0.003, 0.003, 0.013]}>
            <sphereGeometry args={[0.0022, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          <mesh position={[0.002, -0.002, 0.013]}>
            <sphereGeometry args={[0.0014, 8, 8]} />
            <primitive object={materials.eyeGlint} attach="material" />
          </mesh>
          {/* Upper Eyelashes */}
          <mesh position={[0.002, 0.015, 0.008]} rotation={[0, 0, 0.15]}>
            <capsuleGeometry args={[0.0025, 0.026, 6, 6]} />
            <primitive object={materials.eyelashes} attach="material" />
          </mesh>
          {/* Slender Eyebrow */}
          <mesh position={[0, 0.022, 0.006]} rotation={[0, 0, 0.1]}>
            <capsuleGeometry args={[0.0032, 0.03, 8, 8]} />
            <primitive object={materials.brows} attach="material" />
          </mesh>
        </group>

        {/* ----- SOFT CHEEK BLUSH ----- */}
        <mesh position={[-0.052, -0.008, 0.075]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <primitive object={materials.blush} attach="material" />
        </mesh>
        <mesh position={[0.052, -0.008, 0.075]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <primitive object={materials.blush} attach="material" />
        </mesh>

        {/* ----- PETITE NOSE ----- */}
        <mesh position={[0, 0.004, 0.09]} rotation={[-0.2, 0, 0]}>
          <capsuleGeometry args={[0.006, 0.022, 10, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0, -0.012, 0.096]}>
          <sphereGeometry args={[0.0075, 12, 12]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>

        {/* ----- ROSY GLOSSY LIPS ----- */}
        {/* Upper Lip with Cupid's bow */}
        <mesh position={[0, -0.032, 0.088]}>
          <capsuleGeometry args={[0.0045, 0.024, 8, 8]} />
          <primitive object={materials.lips} attach="material" />
        </mesh>
        {/* Full Lower Lip */}
        <mesh position={[0, -0.04, 0.086]}>
          <capsuleGeometry args={[0.0055, 0.022, 8, 8]} />
          <primitive object={materials.lips} attach="material" />
        </mesh>

        {/* ----- STYLED 3D HAIR (Matching girl-avatar.png Ponytail) ----- */}
        {/* Main Hair Cap */}
        <mesh position={[0, 0.038, -0.012]} castShadow>
          <sphereGeometry args={[0.102, 28, 28]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        {/* Front Hair Parting & Volume */}
        <mesh position={[-0.04, 0.095, 0.02]} rotation={[0.2, -0.1, -0.15]}>
          <capsuleGeometry args={[0.035, 0.065, 12, 12]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0.04, 0.095, 0.02]} rotation={[0.2, 0.1, 0.15]}>
          <capsuleGeometry args={[0.035, 0.065, 12, 12]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        {/* Soft Face-Framing Side Bangs (Tendrils) */}
        <mesh position={[-0.085, 0.015, 0.04]} rotation={[0.1, 0, -0.15]}>
          <capsuleGeometry args={[0.012, 0.09, 8, 8]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>
        <mesh position={[0.085, 0.015, 0.04]} rotation={[0.1, 0, 0.15]}>
          <capsuleGeometry args={[0.012, 0.09, 8, 8]} />
          <primitive object={materials.hair} attach="material" />
        </mesh>

        {/* Gold Hair Scrunchie / Tie */}
        <mesh position={[0, 0.03, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.025, 0.009, 12, 20]} />
          <primitive object={materials.gold} attach="material" />
        </mesh>

        {/* Flowing Ponytail Cascading Down the Back */}
        <group ref={ponytailRef} position={[0, 0.02, -0.11]}>
          <mesh position={[0, -0.08, -0.02]} rotation={[0.3, 0, 0]} castShadow>
            <capsuleGeometry args={[0.034, 0.14, 14, 14]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
          <mesh position={[0, -0.19, -0.05]} rotation={[0.2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.026, 0.12, 12, 12]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, -0.07]} rotation={[0.1, 0, 0]}>
            <capsuleGeometry args={[0.018, 0.09, 10, 10]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ==================== TORSO & TAILORED BLAZER ==================== */}
      <group ref={torsoRef} position={[0, 0.92, 0]}>
        {/* Feminine Blazer Silhouette (Hourglass Contoured Curves) */}
        <mesh position={[0, 0.17, 0]} castShadow>
          <cylinderGeometry args={[0.145, 0.12, 0.26, 32]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>
        {/* Narrowed Waist & Lower Blazer */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.138, 0.19, 32]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Rounded Feminine Shoulders */}
        <mesh position={[-0.15, 0.26, 0]} castShadow>
          <sphereGeometry args={[0.055, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>
        <mesh position={[0.15, 0.26, 0]} castShadow>
          <sphereGeometry args={[0.055, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Crisp White Silk Blouse (Open V-Neck) */}
        <mesh position={[0, 0.22, 0.06]}>
          <cylinderGeometry args={[0.06, 0.042, 0.18, 16]} />
          <primitive object={materials.blouse} attach="material" />
        </mesh>
        {/* Blouse Collar Edges */}
        <mesh position={[-0.035, 0.27, 0.08]} rotation={[0.2, 0.15, -0.3]}>
          <capsuleGeometry args={[0.009, 0.035, 8, 8]} />
          <primitive object={materials.blouse} attach="material" />
        </mesh>
        <mesh position={[0.035, 0.27, 0.08]} rotation={[0.2, -0.15, 0.3]}>
          <capsuleGeometry args={[0.009, 0.035, 8, 8]} />
          <primitive object={materials.blouse} attach="material" />
        </mesh>

        {/* Tailored Women's Blazer Lapels */}
        <mesh position={[-0.065, 0.16, 0.1]} rotation={[0, 0.16, -0.22]} castShadow>
          <capsuleGeometry args={[0.022, 0.2, 10, 10]} />
          <primitive object={materials.lapel} attach="material" />
        </mesh>
        <mesh position={[0.065, 0.16, 0.1]} rotation={[0, -0.16, 0.22]} castShadow>
          <capsuleGeometry args={[0.022, 0.2, 10, 10]} />
          <primitive object={materials.lapel} attach="material" />
        </mesh>

        {/* Gilded Blazer Accent Button */}
        <mesh position={[0, 0.03, 0.13]}>
          <sphereGeometry args={[0.0065, 10, 10]} />
          <primitive object={materials.gold} attach="material" />
        </mesh>
      </group>

      {/* ==================== LEFT ARM & WATCH ==================== */}
      <group ref={leftArmRef} position={[-0.19, 1.18, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.11, 0]} castShadow>
          <capsuleGeometry args={[0.038, 0.17, 16, 16]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Elbow Joint & Forearm */}
        <group ref={leftForearmRef} position={[0, -0.22, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.035, 14, 14]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.033, 0.15, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* White Blouse Cuff */}
          <mesh position={[0, -0.19, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.018, 16]} />
            <primitive object={materials.blouse} attach="material" />
          </mesh>

          {/* Slender Silver Watch / Bracelet */}
          <mesh position={[0, -0.205, 0]}>
            <cylinderGeometry args={[0.034, 0.034, 0.014, 16]} />
            <primitive object={materials.silverWatch} attach="material" />
          </mesh>

          {/* Graceful Feminine Hand with Slender Fingers */}
          <group position={[0, -0.25, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <capsuleGeometry args={[0.023, 0.034, 12, 12]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Thumb */}
            <mesh position={[0.018, 0.008, 0.008]} rotation={[0, 0, 0.4]}>
              <capsuleGeometry args={[0.008, 0.022, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Curled Fingers */}
            <mesh position={[-0.004, -0.022, 0.004]} rotation={[-0.25, 0, 0]}>
              <capsuleGeometry args={[0.018, 0.032, 10, 10]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== RIGHT ARM ==================== */}
      <group ref={rightArmRef} position={[0.19, 1.18, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.11, 0]} castShadow>
          <capsuleGeometry args={[0.038, 0.17, 16, 16]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Elbow Joint & Forearm */}
        <group ref={rightForearmRef} position={[0, -0.22, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.035, 14, 14]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.1, 0]} castShadow>
            <capsuleGeometry args={[0.033, 0.15, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* White Blouse Cuff */}
          <mesh position={[0, -0.19, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.018, 16]} />
            <primitive object={materials.blouse} attach="material" />
          </mesh>

          {/* Graceful Feminine Hand */}
          <group position={[0, -0.25, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <capsuleGeometry args={[0.023, 0.034, 12, 12]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Thumb */}
            <mesh position={[-0.018, 0.008, 0.008]} rotation={[0, 0, -0.4]}>
              <capsuleGeometry args={[0.008, 0.022, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
            {/* Curled Fingers */}
            <mesh position={[0.004, -0.022, 0.004]} rotation={[-0.25, 0, 0]}>
              <capsuleGeometry args={[0.018, 0.032, 10, 10]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== LEFT LEG & POINTED HEELS ==================== */}
      <group ref={leftLegRef} position={[-0.09, 0.85, 0]}>
        {/* Thigh (Slim-fit Navy Trousers) */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Knee Joint & Calf */}
        <group ref={leftCalfRef} position={[0, -0.36, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.046, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.17, 0]} castShadow>
            <capsuleGeometry args={[0.043, 0.28, 18, 18]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Trouser Ankle Cuff */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.044, 0.046, 0.025, 20]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Sleek Pointed Black Dress Pumps/Heels */}
          <group position={[0, -0.39, 0.03]}>
            {/* Pointed Toe Box */}
            <mesh position={[0, 0.025, 0.02]} rotation={[0.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.036, 0.11, 16, 16]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Slender Raised Heel Lift */}
            <mesh position={[0, 0.015, -0.04]}>
              <cylinderGeometry args={[0.012, 0.009, 0.03, 12]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Sole */}
            <mesh position={[0, 0.004, 0.01]}>
              <cylinderGeometry args={[0.039, 0.039, 0.01, 16]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== RIGHT LEG & POINTED HEELS ==================== */}
      <group ref={rightLegRef} position={[0.09, 0.85, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.3, 18, 18]} />
          <primitive object={materials.suit} attach="material" />
        </mesh>

        {/* Knee Joint & Calf */}
        <group ref={rightCalfRef} position={[0, -0.36, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.046, 16, 16]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>
          <mesh position={[0, -0.17, 0]} castShadow>
            <capsuleGeometry args={[0.043, 0.28, 18, 18]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Trouser Ankle Cuff */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.044, 0.046, 0.025, 20]} />
            <primitive object={materials.suit} attach="material" />
          </mesh>

          {/* Sleek Pointed Black Dress Pumps/Heels */}
          <group position={[0, -0.39, 0.03]}>
            {/* Pointed Toe Box */}
            <mesh position={[0, 0.025, 0.02]} rotation={[0.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.036, 0.11, 16, 16]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Slender Raised Heel Lift */}
            <mesh position={[0, 0.015, -0.04]}>
              <cylinderGeometry args={[0.012, 0.009, 0.03, 12]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            {/* Sole */}
            <mesh position={[0, 0.004, 0.01]}>
              <cylinderGeometry args={[0.039, 0.039, 0.01, 16]} />
              <primitive object={materials.sole} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
