import { useEffect, useRef, useState, useCallback } from 'react'
import Peer from 'peerjs'
import { useMuseumStore } from '../store'

// Generate or read room ID from URL params
export function getRoomInfo() {
  if (typeof window === 'undefined') return { roomId: 'love-room-demo', role: 'boy' }
  const params = new URLSearchParams(window.location.search)
  const roomId = params.get('room') || 'love-room-demo'
  const role = params.get('role') || 'boy' // 'boy' or 'girl'
  const isHost = role === 'boy'
  return { roomId, role, isHost }
}

export function useMultiplayer() {
  const [peerId, setPeerId] = useState(null)
  const [partnerConnected, setPartnerConnected] = useState(false)
  const [partnerData, setPartnerData] = useState({
    position: [0, 0, -10],
    rotation: 0,
    action: 'idle', // 'idle' | 'walking' | 'waltz'
  })
  const [waltzStatus, setWaltzStatus] = useState('idle') // 'idle' | 'invited' | 'received' | 'dancing'
  const [partnerRole, setPartnerRole] = useState(null)

  const peerRef = useRef(null)
  const connRef = useRef(null)
  const sendIntervalRef = useRef(null)

  const { roomId, role, isHost } = getRoomInfo()

  // Peer initialization
  useEffect(() => {
    // Unique ID for each peer in the room
    const myId = `${roomId}-${role}`
    const targetPartnerId = `${roomId}-${role === 'boy' ? 'girl' : 'boy'}`
    setPartnerRole(role === 'boy' ? 'girl' : 'boy')

    const peer = new Peer(myId, {
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      },
    })

    peerRef.current = peer

    peer.on('open', (id) => {
      setPeerId(id)
      console.log('Peer connected with ID:', id)

      // If not host (or once open), attempt connecting to partner
      tryConnectToPartner(targetPartnerId)
    })

    const handleConnection = (conn) => {
      connRef.current = conn

      conn.on('open', () => {
        setPartnerConnected(true)
        console.log('Connected to partner:', conn.peer)
      })

      conn.on('data', (data) => {
        if (data.type === 'transform') {
          setPartnerData(data.payload)
        } else if (data.type === 'waltz_invite') {
          setWaltzStatus('received')
        } else if (data.type === 'waltz_accept') {
          setWaltzStatus('dancing')
        } else if (data.type === 'waltz_stop') {
          setWaltzStatus('idle')
        }
      })

      conn.on('close', () => {
        setPartnerConnected(false)
        connRef.current = null
      })

      conn.on('error', (err) => {
        console.warn('Connection error:', err)
      })
    }

    peer.on('connection', handleConnection)

    const tryConnectToPartner = (partnerId) => {
      const conn = peer.connect(partnerId, { reliable: true })
      handleConnection(conn)
    }

    // Retry connecting periodically if partner not yet online
    const reconnectTimer = setInterval(() => {
      if (!connRef.current || !connRef.current.open) {
        tryConnectToPartner(targetPartnerId)
      }
    }, 4000)

    return () => {
      clearInterval(reconnectTimer)
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current)
      if (connRef.current) connRef.current.close()
      if (peer) peer.destroy()
    }
  }, [roomId, role])

  // Function to broadcast my position & action to partner
  const sendMyTransform = useCallback((pos, rotY, action) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send({
        type: 'transform',
        payload: {
          position: [pos.x, pos.y, pos.z],
          rotation: rotY,
          action,
        },
      })
    }
  }, [])

  // Waltz controls
  const inviteWaltz = useCallback(() => {
    setWaltzStatus('invited')
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'waltz_invite' })
    }
  }, [])

  const acceptWaltz = useCallback(() => {
    setWaltzStatus('dancing')
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'waltz_accept' })
    }
  }, [])

  const stopWaltz = useCallback(() => {
    setWaltzStatus('idle')
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'waltz_stop' })
    }
  }, [])

  return {
    roomId,
    myRole: role,
    partnerRole,
    partnerConnected,
    partnerData,
    sendMyTransform,
    waltzStatus,
    inviteWaltz,
    acceptWaltz,
    stopWaltz,
  }
}
