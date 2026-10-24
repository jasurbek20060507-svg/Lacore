import React, { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMuseumStore } from '../store'
import BoyCharacter from './characters/BoyCharacter'
import GirlCharacter from './characters/GirlCharacter'

// Museum boundaries
const BOUNDS = {
  minX: -3.8,
  maxX: 3.8,
  minZ: -41,
  maxZ: 5.5,
}

const MOVE_SPEED = 3.6
const LOOK_SPEED = 0.002
const PLAYER_HEIGHT = 1.6

export default function PlayerController({ myRole = 'boy' }) {
  const { camera, gl } = useThree()
  const isMobile = useMuseumStore((s) => s.isMobile)
  const activePhoto = useMuseumStore((s) => s.activePhoto)
  const gameState = useMuseumStore((s) => s.gameState)
  const isSitting = useMuseumStore((s) => s.isSitting)
  const cameraMode = useMuseumStore((s) => s.cameraMode)
  const toggleCameraMode = useMuseumStore((s) => s.toggleCameraMode)

  const [isWalking, setIsWalking] = useState(false)
  const avatarGroupRef = useRef()

  const keys = useRef({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const playerPosition = useRef(new THREE.Vector3(0, 0, 3))
  const velocity = useRef(new THREE.Vector3())
  const isPointerLocked = useRef(false)
  const touchStart = useRef({ x: 0, y: 0 })
  const joystickInput = useRef({ x: 0, y: 0 })

  // Initialize camera position
  useEffect(() => {
    playerPosition.current.set(myRole === 'boy' ? -0.4 : 0.4, 0, 3)
    camera.position.set(playerPosition.current.x, PLAYER_HEIGHT, playerPosition.current.z)
    camera.rotation.set(0, 0, 0)
    euler.current.set(0, 0, 0, 'YXZ')
  }, [camera, myRole])

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e) => {
      keys.current[e.code] = true
      if (e.code === 'Escape') {
        const setActivePhoto = useMuseumStore.getState().setActivePhoto
        setActivePhoto(null)
      }
      if (e.code === 'KeyV') {
        toggleCameraMode()
      }
    }
    const onKeyUp = (e) => { keys.current[e.code] = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [toggleCameraMode])

  // Pointer lock for desktop
  useEffect(() => {
    if (isMobile) return

    const canvas = gl.domElement

    const onClick = () => {
      if (!isPointerLocked.current && gameState === 'playing' && !activePhoto) {
        canvas.requestPointerLock()
      }
    }

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas
    }

    const onMouseMove = (e) => {
      if (!isPointerLocked.current) return
      euler.current.y -= e.movementX * LOOK_SPEED
      euler.current.x -= e.movementY * LOOK_SPEED
      euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x))
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl, isMobile, gameState, activePhoto])

  // Mobile touch look (right side of screen)
  useEffect(() => {
    if (!isMobile) return

    const onTouchStart = (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]
        // Right half of screen for camera control
        if (touch.clientX > window.innerWidth * 0.45) {
          touchStart.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    const onTouchMove = (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]
        if (touch.clientX > window.innerWidth * 0.45) {
          const dx = touch.clientX - touchStart.current.x
          const dy = touch.clientY - touchStart.current.y
          euler.current.y -= dx * 0.004
          euler.current.x -= dy * 0.003
          euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x))
          touchStart.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [isMobile])

  // Expose joystick input setter globally for MobileControls
  useEffect(() => {
    window.__museumJoystick = joystickInput.current
  }, [])

  // Movement loop
  useFrame((_, delta) => {
    if (activePhoto || gameState !== 'playing') return

    // If sitting at table, lock position to chair
    if (isSitting) {
      const chairX = myRole === 'boy' ? -0.9 : 0.9
      const chairZ = -12 // Table position in gallery
      playerPosition.current.set(chairX, 0, chairZ)

      if (avatarGroupRef.current) {
        avatarGroupRef.current.visible = true
        avatarGroupRef.current.position.set(chairX, 0, chairZ)
        avatarGroupRef.current.rotation.y = myRole === 'boy' ? Math.PI / 2 : -Math.PI / 2
      }

      if (cameraMode === 'third') {
        camera.position.set(chairX, 1.6, chairZ + 1.8)
        camera.lookAt(chairX, 1.2, chairZ)
      } else {
        camera.position.set(chairX, 1.3, chairZ)
        camera.quaternion.setFromEuler(euler.current)
      }

      if (window.__sendMyTransform) {
        window.__sendMyTransform(playerPosition.current, euler.current.y, 'sitting')
      }
      return
    }

    const dt = Math.min(delta, 0.1)
    const speed = MOVE_SPEED * dt

    // Input
    let moveX = 0, moveZ = 0

    // Keyboard
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveZ -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveZ += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveX -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveX += 1

    // Mobile joystick
    if (isMobile && window.__museumJoystick) {
      moveX += window.__museumJoystick.x
      moveZ -= window.__museumJoystick.y
    }

    // Normalize diagonal
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ)
    if (len > 0) {
      moveX /= len
      moveZ /= len
    }

    const isMoving = len > 0.05
    if (isMoving !== isWalking) {
      setIsWalking(isMoving)
    }

    // Apply movement in camera direction
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, euler.current.y, 0))
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, euler.current.y, 0))

    velocity.current.x = (moveX * right.x + moveZ * forward.x) * speed
    velocity.current.z = (moveX * right.z + moveZ * forward.z) * speed

    // Update player position with bounds
    let newX = playerPosition.current.x + velocity.current.x
    let newZ = playerPosition.current.z + velocity.current.z

    newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, newX))
    newZ = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, newZ))

    playerPosition.current.x = newX
    playerPosition.current.z = newZ

    // Update 3D avatar position and visibility
    if (avatarGroupRef.current) {
      if (cameraMode === 'third') {
        avatarGroupRef.current.visible = true
        avatarGroupRef.current.position.set(newX, 0, newZ)
        avatarGroupRef.current.rotation.y = euler.current.y
      } else {
        avatarGroupRef.current.visible = false
      }
    }

    // Camera placement: 1st person vs 3rd person
    if (cameraMode === 'third') {
      // 3rd Person: camera hovers behind avatar
      const cameraOffset = new THREE.Vector3(0, 1.2, 2.2).applyEuler(new THREE.Euler(0, euler.current.y, 0))
      camera.position.x = playerPosition.current.x + cameraOffset.x
      camera.position.y = PLAYER_HEIGHT + 0.3
      camera.position.z = playerPosition.current.z + cameraOffset.z
      camera.quaternion.setFromEuler(euler.current)
    } else {
      // 1st Person: camera at head level
      camera.position.x = newX
      camera.position.y = PLAYER_HEIGHT
      camera.position.z = newZ
      camera.quaternion.setFromEuler(euler.current)
    }

    // Broadcast position to partner via multiplayer
    if (window.__sendMyTransform) {
      window.__sendMyTransform(playerPosition.current, euler.current.y, isMoving ? 'walking' : 'idle')
    }
  })

  return (
    <group ref={avatarGroupRef} visible={false}>
      {myRole === 'boy' ? (
        <BoyCharacter isWalking={isWalking} isSitting={isSitting} isDancing={false} />
      ) : (
        <GirlCharacter isWalking={isWalking} isSitting={isSitting} isDancing={false} />
      )}
    </group>
  )
}
