import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

function TimelineMarker({ item, position, index }) {
  const markerRef = useRef()

  useFrame((state) => {
    if (markerRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.02
      markerRef.current.scale.setScalar(1 + pulse)
    }
  })

  const isLeft = index % 2 === 0

  return (
    <group position={position} ref={markerRef}>
      {/* Timeline node - glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#f43f5e"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Connector line to card */}
      <mesh position={[isLeft ? -0.6 : 0.6, 0, 0]}>
        <boxGeometry args={[1.0, 0.015, 0.015]} />
        <meshStandardMaterial color="#c9a060" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Card background */}
      <group position={[isLeft ? -1.5 : 1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.6, 0.9, 0.05]} />
          <meshStandardMaterial
            color="#1a1008"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Card border */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.7, 1.0, 0.03]} />
          <meshStandardMaterial color="#c9a060" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Date */}
        <Text
          position={[0, 0.25, 0.04]}
          fontSize={0.06}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
        >
          {item.date}
        </Text>

        {/* Title */}
        <Text
          position={[0, 0.08, 0.04]}
          fontSize={0.1}
          color="#fda4af"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2"
          maxWidth={1.3}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text
          position={[0, -0.15, 0.04]}
          fontSize={0.05}
          color="#d4c4b0"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
        >
          {item.description}
        </Text>

        {/* Card glow */}
        <pointLight
          position={[0, 0, 0.3]}
          intensity={0.3}
          color="#fda4af"
          distance={2}
          decay={2}
        />
      </group>
    </group>
  )
}

export default function LoveStoryRoom({ data, position }) {
  const roomWidth = 8
  const roomLength = 10
  const roomHeight = 4
  const stories = data.loveStory || []

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>

      {/* Walls - darker for this room */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#2a1a15" roughness={0.8} />
      </mesh>
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#2a1a15" roughness={0.8} />
      </mesh>

      {/* Section title */}
      <Text
        position={[0, 3.2, roomLength / 2 - 0.5]}
        fontSize={0.25}
        color="#fda4af"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2"
      >
        ✦ Sevgi Hikoyamiz ✦
      </Text>

      {/* Central timeline line */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.02, 0.02, roomLength - 3]} />
        <meshStandardMaterial
          color="#c9a060"
          emissive="#c9a060"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Timeline markers */}
      {stories.map((story, i) => (
        <TimelineMarker
          key={i}
          item={story}
          position={[0, 1.8, roomLength / 2 - 2.5 - i * 2.2]}
          index={i}
        />
      ))}

      {/* Atmospheric lighting */}
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffe4c9" distance={12} decay={2} />
      <pointLight position={[-3, 1.5, 2]} intensity={0.4} color="#f43f5e" distance={5} decay={2} />
      <pointLight position={[3, 1.5, -2]} intensity={0.4} color="#fbbf24" distance={5} decay={2} />

      {/* Floor accent lights */}
      <pointLight position={[0, 0.2, 3]} intensity={0.3} color="#fda4af" distance={4} decay={2} />
      <pointLight position={[0, 0.2, -3]} intensity={0.3} color="#fda4af" distance={4} decay={2} />
    </group>
  )
}
