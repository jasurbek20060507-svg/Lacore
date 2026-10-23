import React, { useRef, useCallback, useEffect, useState } from 'react'
import { useMuseumStore } from '../store'

export default function MobileControls() {
  const joystickRef = useRef(null)
  const knobRef = useRef(null)
  const [active, setActive] = useState(false)
  const touchId = useRef(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const JOYSTICK_RADIUS = 50

  const handleStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    // Only respond to touches on the left half
    if (touch.clientX > window.innerWidth * 0.5) return

    touchId.current = touch.identifier
    setActive(true)

    const rect = joystickRef.current.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, [])

  const handleMove = useCallback((e) => {
    e.preventDefault()
    if (touchId.current === null) return

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier !== touchId.current) continue

      const dx = touch.clientX - centerRef.current.x
      const dy = touch.clientY - centerRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const clampedDist = Math.min(dist, JOYSTICK_RADIUS)
      const angle = Math.atan2(dy, dx)

      const normX = (clampedDist / JOYSTICK_RADIUS) * Math.cos(angle)
      const normY = (clampedDist / JOYSTICK_RADIUS) * Math.sin(angle)

      // Update knob position
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${normX * JOYSTICK_RADIUS}px, ${normY * JOYSTICK_RADIUS}px)`
      }

      // Update global joystick input (x = strafe, y = forward/backward inverted)
      if (window.__museumJoystick) {
        window.__museumJoystick.x = normX
        window.__museumJoystick.y = -normY
      }
    }
  }, [])

  const handleEnd = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId.current) {
        touchId.current = null
        setActive(false)
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(0px, 0px)'
        }
        if (window.__museumJoystick) {
          window.__museumJoystick.x = 0
          window.__museumJoystick.y = 0
        }
      }
    }
  }, [])

  useEffect(() => {
    const el = joystickRef.current
    if (!el) return
    el.addEventListener('touchstart', handleStart, { passive: false })
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd, { passive: false })
    window.addEventListener('touchcancel', handleEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', handleStart)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
      window.removeEventListener('touchcancel', handleEnd)
    }
  }, [handleStart, handleMove, handleEnd])

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-auto">
      {/* Joystick base */}
      <div
        ref={joystickRef}
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: `${JOYSTICK_RADIUS * 2 + 20}px`,
          height: `${JOYSTICK_RADIUS * 2 + 20}px`,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          touchAction: 'none',
        }}
      >
        {/* Knob */}
        <div
          ref={knobRef}
          className="rounded-full transition-transform"
          style={{
            width: '44px',
            height: '44px',
            background: active
              ? 'radial-gradient(circle, rgba(244, 63, 94, 0.6), rgba(244, 63, 94, 0.3))'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transitionDuration: active ? '0ms' : '200ms',
          }}
        />
      </div>

      {/* Label */}
      <p className="text-center text-white/20 text-xs mt-1">Harakatlanish</p>
    </div>
  )
}
