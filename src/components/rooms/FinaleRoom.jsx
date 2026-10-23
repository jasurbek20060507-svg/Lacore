import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useMuseumStore } from '../../store'

function BigHeart({ position }) {
  const heartRef = useRef()
  const glowRef = useRef()

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0, y = 0
    shape.moveTo(x, y + 0.3)
    shape.bezierCurveTo(x, y + 0.45, x - 0.1, y + 0.6, x - 0.3, y + 0.6)
    shape.bezierCurveTo(x - 0.6, y + 0.6, x - 0.6, y + 0.35, x - 0.6, y + 0.35)
    shape.bezierCurveTo(x - 0.6, y + 0.15, x - 0.45, y - 0.1, x, y - 0.35)
    shape.bezierCurveTo(x + 0.45, y - 0.1, x + 0.6, y + 0.15, x + 0.6, y + 0.35)
    shape.bezierCurveTo(x + 0.6, y + 0.35, x + 0.6, y + 0.6, x + 0.3, y + 0.6)
    shape.bezierCurveTo(x + 0.1, y + 0.6, x, y + 0.45, x, y + 0.3)
    return shape
  }, [])

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y = state.clock.elapsedTime * 0.3
      const scale = 2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      heartRef.current.scale.setScalar(scale)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group position={position}>
      <mesh ref={heartRef} rotation={[Math.PI, 0, 0]}>
        <extrudeGeometry args={[heartShape, {
          depth: 0.3,
          bevelEnabled: true,
          bevelThickness: 0.08,
          bevelSize: 0.05,
          bevelSegments: 12,
        }]} />
        <meshStandardMaterial
          color="#f43f5e"
          roughness={0.2}
          metalness={0.5}
          emissive="#f43f5e"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh ref={glowRef} scale={[3, 3, 3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.15} />
      </mesh>
      <pointLight color="#f43f5e" intensity={3} distance={8} decay={2} />
    </group>
  )
}

function HeartParticles({ count = 30, area = [6, 4, 6] }) {
  const particlesRef = useRef()
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * area[0],
        Math.random() * area[1],
        (Math.random() - 0.5) * area[2],
      ],
      speed: Math.random() * 0.5 + 0.3,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.08 + 0.03,
    }))
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i]
        child.position.y = (p.position[1] + state.clock.elapsedTime * p.speed * 0.3) % area[1]
        child.position.x = p.position[0] + Math.sin(state.clock.elapsedTime * 0.5 + p.offset) * 0.3
        child.rotation.z = Math.sin(state.clock.elapsedTime + p.offset) * 0.5
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#f43f5e' : '#fbbf24'}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function Pedestal({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.3, 24]} />
        <meshStandardMaterial color="#c9a060" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.7, 24]} />
        <meshStandardMaterial color="#e0d0c0" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.55, 0.1, 24]} />
        <meshStandardMaterial color="#c9a060" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}

export default function FinaleRoom({ data, position }) {
  const roomWidth = 10
  const roomLength = 10
  const roomHeight = 5

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Circular floor accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[3, 48]} />
        <meshStandardMaterial color="#3a1020" roughness={0.3} metalness={0.1} emissive="#f43f5e" emissiveIntensity={0.05} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#0a0508" roughness={0.9} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.8} />
      </mesh>
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.8} />
      </mesh>
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.8} />
      </mesh>
      <mesh position={[-3.5, roomHeight / 2, roomLength / 2]}>
        <planeGeometry args={[3, roomHeight]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[3.5, roomHeight / 2, roomLength / 2]}>
        <planeGeometry args={[3, roomHeight]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Heart on pedestal */}
      <Pedestal position={[0, 0, -1]} />
      <BigHeart position={[0, 2.2, -1]} />

      {/* Particles */}
      <HeartParticles count={40} area={[8, 4, 8]} />

      {/* Final message */}
      <Text
        position={[0, 3, -roomLength / 2 + 0.1]}
        fontSize={0.2}
        color="#fda4af"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2"
        maxWidth={7}
        textAlign="center"
      >
        {data.finalMessage || "Seni abadiy sevaman ❤️"}
      </Text>

      <Text
        position={[0, 2.5, -roomLength / 2 + 0.1]}
        fontSize={0.1}
        color="#c9a882"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
        maxWidth={6}
        textAlign="center"
      >
        {data.finalSubtext || ""}
      </Text>

      {/* Love letter */}
      <group position={[0, 1.5, -roomLength / 2 + 0.3]}>
        <mesh>
          <planeGeometry args={[4, 1.2]} />
          <meshStandardMaterial color="#1a0808" roughness={0.8} transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.07}
          color="#d4b8a0"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
          textAlign="center"
          lineHeight={1.8}
          font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2"
        >
          {data.loveLetter || ""}
        </Text>
      </group>

      {/* Dramatic lighting */}
      <spotLight position={[0, 4.5, 0]} angle={0.5} penumbra={0.8} intensity={3} color="#fff0f0" distance={10} castShadow />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#f43f5e" distance={6} decay={2} />
      <pointLight position={[3, 2, -3]} intensity={0.5} color="#fbbf24" distance={6} decay={2} />
      <pointLight position={[0, 0.5, 3]} intensity={0.3} color="#fda4af" distance={5} decay={2} />
    </group>
  )
}
