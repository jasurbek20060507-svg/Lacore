import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useMuseumStore } from '../../store'
import RomanticTable from '../RomanticTable'

// Safe non-suspending frame texture loader
let sharedFrameTexture = null
let isTextureLoading = false

function loadFrameTexture(onLoaded) {
  if (sharedFrameTexture) {
    onLoaded(sharedFrameTexture)
    return
  }
  if (isTextureLoading || typeof window === 'undefined') return
  isTextureLoading = true
  const loader = new THREE.TextureLoader()
  loader.load(
    '/frames/frame-baroque-ornate.png',
    (tex) => {
      sharedFrameTexture = tex
      onLoaded(tex)
    },
    undefined,
    () => {
      isTextureLoading = false
    }
  )
}

// Ornate Picture & Video Frame Component
function BaroquePhotoFrame({ photo, position, rotation = [0, 0, 0], wallSide = 'left' }) {
  const [hovered, setHovered] = useState(false)
  const [frameTexture, setFrameTexture] = useState(sharedFrameTexture)
  const frameRef = useRef()
  const glowRef = useRef()
  const setActivePhoto = useMuseumStore((s) => s.setActivePhoto)
  useCursor(hovered)

  useEffect(() => {
    loadFrameTexture((tex) => setFrameTexture(tex))
  }, [])

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.opacity = hovered
        ? 0.35 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        : 0.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03
    }
  })

  const frameWidth = 1.6
  const frameHeight = 1.15

  // Generate placeholder color
  const placeholderColor = useMemo(() => {
    const colors = ['#831843', '#1e3a8a', '#14532d', '#713f12', '#581c87', '#134e4a', '#881337', '#1e293b', '#7c2d12', '#312e81']
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
      {/* 3D Gold Moulding Backing */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, 0.04]} />
        <meshStandardMaterial
          color={hovered ? '#fbbf24' : '#d4af37'}
          roughness={0.25}
          metalness={0.8}
          emissive={hovered ? '#f59e0b' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Picture / Video Media Plane inside the frame (clamped so it never overflows) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[frameWidth * 0.72, frameHeight * 0.72]} />
        <meshStandardMaterial
          color={placeholderColor}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Transparent Baroque Gilded Ornate Frame Overlay */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial
          color={frameTexture ? '#ffffff' : '#d4af37'}
          map={frameTexture || null}
          transparent={true}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Media Indicator: Video or Photo */}
      {photo.video ? (
        <group position={[0, 0, 0.04]}>
          <mesh>
            <circleGeometry args={[0.15, 24]} />
            <meshStandardMaterial color="#000000" opacity={0.6} transparent />
          </mesh>
          <Text
            position={[0.02, 0, 0.01]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ▶
          </Text>
        </group>
      ) : (
        <Text
          position={[0, 0.05, 0.03]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {photo.id}
        </Text>
      )}

      <Text
        position={[0, -0.25, 0.03]}
        fontSize={0.075}
        color="#ffffffcc"
        anchorX="center"
        anchorY="middle"
      >
        {photo.title}
      </Text>

      {/* Romantic Golden Glow behind frame */}
      <mesh position={[0, 0, -0.04]} ref={glowRef}>
        <planeGeometry args={[frameWidth + 0.6, frameHeight + 0.6]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.08} />
      </mesh>

      {/* Ornate Plaque Label below frame */}
      <mesh position={[0, -(frameHeight / 2 + 0.16), 0.01]}>
        <planeGeometry args={[0.9, 0.14]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, -(frameHeight / 2 + 0.16), 0.005]}>
        <planeGeometry args={[0.94, 0.18]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
      </mesh>
      <Text
        position={[0, -(frameHeight / 2 + 0.16), 0.02]}
        fontSize={0.045}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
      >
        {photo.title} • {photo.date}
      </Text>
    </group>
  )
}

// Ornate Gilded Baroque Pilaster
function BaroquePilaster({ position }) {
  const gold = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.25, metalness: 0.75 })
  const marble = new THREE.MeshStandardMaterial({ color: '#fcf8f2', roughness: 0.3, metalness: 0.05 })

  return (
    <group position={position}>
      {/* Marble Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.3]} />
        <primitive object={marble} attach="material" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.48, 0.05, 0.32]} />
        <primitive object={gold} attach="material" />
      </mesh>
      {/* Fluted Column Shaft */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 3.5, 16]} />
        <primitive object={marble} attach="material" />
      </mesh>
      {/* Corinthian Gilded Capital */}
      <mesh position={[0, 4.05, 0]}>
        <boxGeometry args={[0.48, 0.22, 0.32]} />
        <primitive object={gold} attach="material" />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.12, 16]} />
        <primitive object={gold} attach="material" />
      </mesh>
    </group>
  )
}

// Crystal Chandelier (Galerie d'Apollon Style)
function CrystalChandelier({ position }) {
  const crystal = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 })
  const gold = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.2, metalness: 0.85 })

  return (
    <group position={position}>
      {/* Chain */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <primitive object={gold} attach="material" />
      </mesh>
      {/* Ornate Gold Crown */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.2, 0.25, 16]} />
        <primitive object={gold} attach="material" />
      </mesh>
      {/* Crystal pendants ring */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[0.55, 0.08, 12, 24]} />
        <primitive object={crystal} attach="material" />
      </mesh>
      {/* Lower crystal drop */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.3, 0.5, 12]} />
        <primitive object={crystal} attach="material" />
      </mesh>
      {/* Radiant warm chandelier light */}
      <pointLight position={[0, -0.3, 0]} color="#fff7ed" intensity={2.5} distance={12} decay={2} />
    </group>
  )
}

export default function MemoryGallery({ data, position, onNearTable = () => {} }) {
  const roomWidth = 8.6
  const roomLength = 22
  const roomHeight = 4.8
  const photos = data.photos || []

  return (
    <group position={position}>
      {/* French Parquet Herringbone Wood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#854d24" roughness={0.2} metalness={0.15} />
      </mesh>

      {/* French Royal Vaulted Baroque Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#fef9f2" roughness={0.6} />
      </mesh>

      {/* Left Wall with Royal Gilded Baroque Trim */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.65} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.65} />
      </mesh>

      {/* Galerie d'Apollon Section Title */}
      <Text
        position={[0, 3.8, roomLength / 2 - 0.5]}
        fontSize={0.28}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
      >
        ✦ Galerie d'Apollon • Xotiralar Galereyasi ✦
      </Text>

      {/* Photo & Video Frames using Baroque Gilded Moulding (5 on Left, 5 on Right) */}
      {photos.slice(0, 5).map((photo, i) => (
        <BaroquePhotoFrame
          key={photo.id}
          photo={photo}
          position={[-roomWidth / 2 + 0.08, 2.0, roomLength / 2 - 2.5 - i * 3.8]}
          rotation={[0, Math.PI / 2, 0]}
          wallSide="left"
        />
      ))}

      {photos.slice(5, 10).map((photo, i) => (
        <BaroquePhotoFrame
          key={photo.id}
          photo={photo}
          position={[roomWidth / 2 - 0.08, 2.0, roomLength / 2 - 2.5 - i * 3.8]}
          rotation={[0, -Math.PI / 2, 0]}
          wallSide="right"
        />
      ))}

      {/* Gilded Pilasters along the gallery walls */}
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <BaroquePilaster position={[-roomWidth / 2 + 0.35, 0, roomLength / 2 - 4.4 - i * 3.8]} />
          <BaroquePilaster position={[roomWidth / 2 - 0.35, 0, roomLength / 2 - 4.4 - i * 3.8]} />
        </React.Fragment>
      ))}

      {/* Radiant Crystal Chandeliers in the center */}
      <CrystalChandelier position={[0, roomHeight - 0.8, roomLength / 2 - 4]} />
      <CrystalChandelier position={[0, roomHeight - 0.8, 0]} />
      <CrystalChandelier position={[0, roomHeight - 0.8, -roomLength / 2 + 4]} />

      {/* Romantic Candlelit Dining Table for Two with Sitting Interaction */}
      <RomanticTable
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        onProximityChange={onNearTable}
      />
    </group>
  )
}
