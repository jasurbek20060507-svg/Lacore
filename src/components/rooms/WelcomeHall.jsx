import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

// WelcomeHall Room Component


function ArchDecor({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Arch columns */}
      <mesh position={[-1.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[1.8, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[4, 0.2, 0.3]} />
        <meshStandardMaterial color="#d4b896" roughness={0.3} metalness={0.15} />
      </mesh>
    </group>
  )
}

function HeartDecoration({ position, scale = 1, color = '#f43f5e' }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  // Heart shape using a custom shape
  const heartShape = new THREE.Shape()
  const x = 0, y = 0
  heartShape.moveTo(x, y + 0.3)
  heartShape.bezierCurveTo(x, y + 0.45, x - 0.1, y + 0.6, x - 0.3, y + 0.6)
  heartShape.bezierCurveTo(x - 0.6, y + 0.6, x - 0.6, y + 0.35, x - 0.6, y + 0.35)
  heartShape.bezierCurveTo(x - 0.6, y + 0.15, x - 0.45, y - 0.1, x, y - 0.35)
  heartShape.bezierCurveTo(x + 0.45, y - 0.1, x + 0.6, y + 0.15, x + 0.6, y + 0.35)
  heartShape.bezierCurveTo(x + 0.6, y + 0.35, x + 0.6, y + 0.6, x + 0.3, y + 0.6)
  heartShape.bezierCurveTo(x + 0.1, y + 0.6, x, y + 0.45, x, y + 0.3)

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale} rotation={[Math.PI, 0, 0]}>
        <extrudeGeometry args={[heartShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 8 }]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </Float>
  )
}

function FlowerVase({ position }) {
  return (
    <group position={position}>
      {/* Vase */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.6, 16]} />
        <meshStandardMaterial color="#c9a882" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Flowers - simple spheres */}
      {[0, 0.8, 1.6, 2.4, 3.2].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle * Math.PI) * 0.08,
            0.7 + i * 0.05,
            Math.sin(angle * Math.PI) * 0.08,
          ]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#f9a8d4'][i]}
            emissive={['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#f9a8d4'][i]}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      {/* Stems */}
      {[0, 0.8, 1.6, 2.4, 3.2].map((angle, i) => (
        <mesh
          key={`stem-${i}`}
          position={[
            Math.cos(angle * Math.PI) * 0.04,
            0.55,
            Math.sin(angle * Math.PI) * 0.04,
          ]}
        >
          <cylinderGeometry args={[0.008, 0.008, 0.3, 4]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>
      ))}
    </group>
  )
}

export default function WelcomeHall({ data, position }) {
  const roomWidth = 8
  const roomLength = 7
  const roomHeight = 4

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#c9a882" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Right wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Front wall with opening */}
      <mesh position={[-3, roomHeight / 2, roomLength / 2]}>
        <planeGeometry args={[2, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[3, roomHeight / 2, roomLength / 2]}>
        <planeGeometry args={[2, roomHeight]} />
        <meshStandardMaterial color="#f5ede4" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Warm accent lights */}
      <pointLight position={[0, 3.5, 0]} intensity={1.5} color="#ffe4c9" distance={10} decay={2} />
      <pointLight position={[-2, 2.5, -1]} intensity={0.5} color="#fda4af" distance={6} decay={2} />
      <pointLight position={[2, 2.5, -1]} intensity={0.5} color="#fbbf24" distance={6} decay={2} />

      {/* Spotlight on the title wall */}
      <pointLight
        position={[0, 3.5, -2]}
        intensity={2.5}
        color="#fff5f0"
        distance={10}
      />

      {/* Welcome text on back wall */}
      <Text
        position={[0, 2.6, -3.45]}
        fontSize={0.45}
        color="#c9a882"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        {data.welcomeTitle || 'Sevgi Muzeyi'}
      </Text>

      <Text
        position={[0, 1.9, -3.45]}
        fontSize={0.35}
        color="#f43f5e"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        {data.coupleNames}
      </Text>

      <Text
        position={[0, 1.35, -3.45]}
        fontSize={0.14}
        color="#a89080"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
      >
        {data.welcomeMessage}
      </Text>

      {/* Heart decorations */}
      <HeartDecoration position={[-2.5, 2.5, -3]} scale={0.5} color="#f43f5e" />
      <HeartDecoration position={[2.5, 2.5, -3]} scale={0.5} color="#fb7185" />

      {/* Flower vases */}
      <FlowerVase position={[-3.2, 0, -2.5]} />
      <FlowerVase position={[3.2, 0, -2.5]} />
      <FlowerVase position={[-3.2, 0, 1]} />
      <FlowerVase position={[3.2, 0, 1]} />

      {/* Arch at the entrance to gallery */}
      <ArchDecor position={[0, 0, -roomLength / 2]} rotation={[0, 0, 0]} />

      {/* Floor trim / baseboard */}
      <mesh position={[0, 0.05, -roomLength / 2]} >
        <boxGeometry args={[roomWidth, 0.1, 0.05]} />
        <meshStandardMaterial color="#c9a882" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Decorative carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial color="#8b2252" roughness={0.8} metalness={0} opacity={0.7} transparent />
      </mesh>
    </group>
  )
}

export { HeartDecoration, FlowerVase }
