import React, { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMuseumStore } from '../store'

// Museum boundaries
const BOUNDS = {
  minX: -3.5,
  maxX: 3.5,
  minZ: -41,
  maxZ: 5.5,
}

const MOVE_SPEED = 3.5
const LOOK_SPEED = 0.002
const PLAYER_HEIGHT = 1.6

export default function PlayerController() {
  const { camera, gl } = useThree()
  const isMobile = useMuseumStore((s) => s.isMobile)
  const activePhoto = useMuseumStore((s) => s.activePhoto)
  const gameState = useMuseumStore((s) => s.gameState)

  const keys = useRef({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const velocity = useRef(new THREE.Vector3())
  const isPointerLocked = useRef(false)
  const touchStart = useRef({ x: 0, y: 0 })
  const joystickInput = useRef({ x: 0, y: 0 })

  // Initialize camera position
  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 5)
    camera.rotation.set(0, 0, 0)
    euler.current.set(0, 0, 0, 'YXZ')
  }, [camera])

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e) => {
      keys.current[e.code] = true
      if (e.code === 'Escape') {
        const setActivePhoto = useMuseumStore.getState().setActivePhoto
        setActivePhoto(null)
      }
    }
    const onKeyUp = (e) => { keys.current[e.code] = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

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

    const canvas = gl.domElement

    const onTouchStart = (e) => {
      const touch = e.touches[e.touches.length - 1]
      // Right half = camera look
      if (touch.clientX > window.innerWidth * 0.5) {
        touchStart.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    const onTouchMove = (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]
        if (touch.clientX > window.innerWidth * 0.4) {
          const dx = touch.clientX - touchStart.current.x
          const dy = touch.clientY - touchStart.current.y
          euler.current.y -= dx * 0.003
          euler.current.x -= dy * 0.003
          euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x))
          touchStart.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
    }
  }, [gl, isMobile])

  // Expose joystick input setter globally for MobileControls
  useEffect(() => {
    window.__museumJoystick = joystickInput.current
  }, [])

  // Movement loop
  useFrame((_, delta) => {
    if (activePhoto || gameState !== 'playing') return

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

    // Apply movement in camera direction
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, euler.current.y, 0))
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, euler.current.y, 0))

    velocity.current.x = (moveX * right.x + moveZ * forward.x) * speed
    velocity.current.z = (moveX * right.z + moveZ * forward.z) * speed

    // Update position with bounds
    let newX = camera.position.x + velocity.current.x
    let newZ = camera.position.z + velocity.current.z

    newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, newX))
    newZ = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, newZ))

    camera.position.x = newX
    camera.position.y = PLAYER_HEIGHT
    camera.position.z = newZ

    // Apply rotation
    camera.quaternion.setFromEuler(euler.current)
  })

  return null
}
