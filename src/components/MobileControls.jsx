import React, { useRef, useCallback, useEffect, useState } from 'react'

export default function MobileControls() {
  const zoneRef = useRef(null)
  const joystickRef = useRef(null)
  const knobRef = useRef(null)
  const [active, setActive] = useState(false)
  const touchId = useRef(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const JOYSTICK_RADIUS = 45

  const handleStart = useCallback((e) => {
    // Only capture first touch in this zone
    if (touchId.current !== null) return
    const touch = e.changedTouches[0]
    touchId.current = touch.identifier
    setActive(true)

    // Center of the joystick circle
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect()
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }
  }, [])

  const handleMove = useCallback((e) => {
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

      // Move visual knob
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${normX * JOYSTICK_RADIUS}px, ${normY * JOYSTICK_RADIUS}px)`
      }

      // Send to PlayerController
      if (window.__museumJoystick) {
        window.__museumJoystick.x = normX
        window.__museumJoystick.y = -normY
      }
    }
  }, [])

  const handleEnd = useCallback((e) => {
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
    const zone = zoneRef.current
    if (!zone) return

    zone.addEventListener('touchstart', handleStart, { passive: false })
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd, { passive: false })
    window.addEventListener('touchcancel', handleEnd, { passive: false })

    return () => {
      zone.removeEventListener('touchstart', handleStart)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
      window.removeEventListener('touchcancel', handleEnd)
    }
  }, [handleStart, handleMove, handleEnd])

  return (
    // Wide active touch zone covering bottom-left quadrant
    <div
      ref={zoneRef}
      className="fixed bottom-0 left-0 w-1/2 h-1/2 z-30 touch-none pointer-events-auto flex items-end p-6 select-none"
    >
      {/* Joystick Base */}
      <div
        ref={joystickRef}
        className="relative rounded-full flex items-center justify-center transition-colors pointer-events-none"
        style={{
          width: `${JOYSTICK_RADIUS * 2 + 24}px`,
          height: `${JOYSTICK_RADIUS * 2 + 24}px`,
          background: active ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          border: active ? '2px solid rgba(212, 175, 55, 0.5)' : '2px solid rgba(255, 255, 255, 0.18)',
          boxShadow: active ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none',
        }}
      >
        {/* Joystick Center Knob */}
        <div
          ref={knobRef}
          className="rounded-full shadow-lg"
          style={{
            width: '46px',
            height: '46px',
            background: active
              ? 'radial-gradient(circle, #f59e0b, #d97706)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.15))',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            transition: active ? 'none' : 'transform 200ms ease-out',
          }}
        />
      </div>
    </div>
  )
}
