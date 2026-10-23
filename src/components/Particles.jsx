import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 100, area = [10, 5, 40], offset = [0, 2, 0] }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * area[0] + offset[0],
      y: Math.random() * area[1] + offset[1],
      z: (Math.random() - 0.5) * area[2] + offset[2],
      speed: Math.random() * 0.2 + 0.05,
      wobbleSpeed: Math.random() * 1 + 0.5,
      wobbleAmount: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 0.03 + 0.01,
    }))
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    particles.forEach((p, i) => {
      const y = ((p.y + time * p.speed) % area[1]) + offset[1] - area[1] / 2
      const x = p.x + Math.sin(time * p.wobbleSpeed + p.phase) * p.wobbleAmount
      const z = p.z + Math.cos(time * p.wobbleSpeed * 0.7 + p.phase) * p.wobbleAmount * 0.5

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#fda4af" transparent opacity={0.5} />
    </instancedMesh>
  )
}
