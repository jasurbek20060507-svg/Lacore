import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useMuseumStore } from '../../store'

// Photo frame component
function PhotoFrame({ photo, position, rotation = [0, 0, 0], wallSide = 'left' }) {
  const [hovered, setHovered] = useState(false)
  const frameRef = useRef()
  const glowRef = useRef()
  const setActivePhoto = useMuseumStore((s) => s.setActivePhoto)
  useCursor(hovered)

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.opacity = hovered
        ? 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        : 0.05 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03
    }
  })

  const frameWidth = 1.4
  const frameHeight = 1.0
  const borderSize = 0.08

  // Generate a placeholder color based on photo id
  const placeholderColor = useMemo(() => {
    const colors = ['#e8b4b8', '#b4c7e8', '#b8e8b4', '#e8d4b4', '#d4b4e8', '#b4e8e0', '#e8b4d8', '#c7e8b4', '#e8c7b4', '#b4d4e8']
    return colors[(photo.id - 1) % colors.length]
  }, [photo.id])

  return (
    <group
      position={position}
      rotation={rotation}
      ref={frameRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); setActivePhoto(photo) }}
    >
      {/* Frame border - gold ornate */}
      <mesh castShadow>
        <boxGeometry args={[frameWidth + borderSize * 2, frameHeight + borderSize * 2, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#fbbf24' : '#c9a060'}
          roughness={0.3}
          metalness={0.6}
          emissive={hovered ? '#fbbf24' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Inner frame shadow */}
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[frameWidth + 0.02, frameHeight + 0.02, 0.02]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      {/* Photo surface (placeholder) */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial
          color={placeholderColor}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Photo number overlay */}
      <Text
        position={[0, 0.05, 0.05]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {photo.id}
      </Text>
      <Text
        position={[0, -0.2, 0.05]}
        fontSize={0.07}
        color="#ffffff99"
        anchorX="center"
        anchorY="middle"
      >
        {photo.title}
      </Text>

      {/* Glow effect behind frame */}
      <mesh position={[0, 0, -0.05]} ref={glowRef}>
        <planeGeometry args={[frameWidth + 0.5, frameHeight + 0.5]} />
        <meshBasicMaterial
          color="#fda4af"
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Info label below frame */}
      <mesh position={[0, -(frameHeight / 2 + borderSize + 0.15), 0.02]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <Text
        position={[0, -(frameHeight / 2 + borderSize + 0.15), 0.04]}
        fontSize={0.04}
        color="#c9a882"
        anchorX="center"
        anchorY="middle"
      >
        {photo.title} • {photo.date}
      </Text>
    </group>
  )
}

// Decorative pillar
function Pillar({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color="#e0d0c0" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 3.6, 12]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 3.85, 0]}>
        <boxGeometry args={[0.38, 0.15, 0.38]} />
        <meshStandardMaterial color="#e0d0c0" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  )
}

// Bench decoration
function Bench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial color="#8b6548" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Legs */}
      {[[-0.5, 0.2, 0.15], [0.5, 0.2, 0.15], [-0.5, 0.2, -0.15], [0.5, 0.2, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#6b4528" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export default function MemoryGallery({ data, position }) {
  const roomWidth = 8
  const roomLength = 20
  const roomHeight = 4
  const photos = data.photos || []

  // Wall material
  const wallColor = '#f5ede4'

  return (
    <group position={position}>
      {/* Floor - polished marble effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.2} metalness={0.15} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Right wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Section title */}
      <Text
        position={[0, 3.2, roomLength / 2 - 0.5]}
        fontSize={0.25}
        color="#c9a882"
        anchorX="center"
        anchorY="middle"
      >
        ✦ Xotiralar Galereyasi ✦
      </Text>

      {/* Photo frames - 5 on each wall */}
      {photos.slice(0, 5).map((photo, i) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          position={[-roomWidth / 2 + 0.05, 1.8, roomLength / 2 - 2 - i * 3.5]}
          rotation={[0, Math.PI / 2, 0]}
          wallSide="left"
        />
      ))}

      {photos.slice(5, 10).map((photo, i) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          position={[roomWidth / 2 - 0.05, 1.8, roomLength / 2 - 2 - i * 3.5]}
          rotation={[0, -Math.PI / 2, 0]}
          wallSide="right"
        />
      ))}

      {/* Pillars between photos */}
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          <Pillar position={[-roomWidth / 2 + 0.3, 0, roomLength / 2 - 3.75 - i * 3.5]} />
          <Pillar position={[roomWidth / 2 - 0.3, 0, roomLength / 2 - 3.75 - i * 3.5]} />
        </React.Fragment>
      ))}

      {/* Benches in center */}
      <Bench position={[0, 0, roomLength / 2 - 4]} rotation={[0, Math.PI / 2, 0]} />
      <Bench position={[0, 0, roomLength / 2 - 11]} rotation={[0, Math.PI / 2, 0]} />

      {/* Ceiling lights along the gallery */}
      {[0, 1, 2, 3, 4].map((i) => (
        <pointLight
          key={i}
          position={[0, 3.5, roomLength / 2 - 2 - i * 4]}
          intensity={1.2}
          color="#ffe4c9"
          distance={8}
          decay={2}
        />
      ))}

      {/* Accent lights */}
      <pointLight position={[-3, 1.5, 0]} intensity={0.3} color="#fda4af" distance={5} decay={2} />
      <pointLight position={[3, 1.5, 0]} intensity={0.3} color="#fbbf24" distance={5} decay={2} />

      {/* Center line on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[0.05, roomLength - 2]} />
        <meshStandardMaterial color="#c9a060" roughness={0.3} metalness={0.4} opacity={0.4} transparent />
      </mesh>
    </group>
  )
}
